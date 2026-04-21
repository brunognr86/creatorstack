import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PLAN_LIMITS: Record<string, number> = {
  starter: 100,
  pro: 999999,
  business: 999999,
};

export async function POST(req: NextRequest) {
  const payload = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  const secret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event: Stripe.Event;

  try {
    if (secret && secret !== 'whsec_placeholder') {
      event = stripe.webhooks.constructEvent(payload, signature, secret);
    } else {
      event = JSON.parse(payload);
    }
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const subscriptionId = session.subscription as string;
        const customerId = session.customer as string;

        const subscription = await stripe.subscriptions.retrieve(subscriptionId) as any;
        const priceId = subscription.items.data[0].price.id;
        const plan = Object.entries({
          [process.env.STRIPE_STARTER_PRICE_ID!]: 'starter',
          [process.env.STRIPE_PRO_PRICE_ID!]: 'pro',
          [process.env.STRIPE_BUSINESS_PRICE_ID!]: 'business',
        }).find(([id]) => id === priceId)?.[1] || 'starter';

        const userEmail = session.customer_details?.email || '';
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', userEmail)
          .single();

        const userId = profile?.id || customerId;

        await supabase.from('subscriptions').upsert({
          user_id: userId,
          stripe_subscription_id: subscriptionId,
          stripe_customer_id: customerId,
          plan,
          status: 'active',
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          cancel_at_period_end: subscription.cancel_at_period_end,
        });

        await supabase.from('profiles').update({
          plan,
          generations_limit: PLAN_LIMITS[plan] || 10,
        }).eq('id', userId);

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_subscription_id', subscription.id)
          .single();

        if (sub) {
          await supabase.from('subscriptions').update({
            status: 'canceled',
            cancel_at_period_end: true,
          }).eq('stripe_subscription_id', subscription.id);

          await supabase.from('profiles').update({
            plan: 'free',
            generations_limit: 10,
          }).eq('id', sub.user_id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
