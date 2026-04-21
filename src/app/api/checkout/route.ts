import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil',
});

const PRICE_MAP: Record<string, string> = {
  starter: process.env.STRIPE_STARTER_PRICE_ID!,
  pro: process.env.STRIPE_PRO_PRICE_ID!,
  business: process.env.STRIPE_BUSINESS_PRICE_ID!,
};

export async function POST(req: NextRequest) {
  try {
    const { plan, email } = await req.json();

    if (!plan || !PRICE_MAP[plan]) {
      return NextResponse.json({ error: 'Plano invalido' }, { status: 400 });
    }

    const customers = await stripe.customers.list({ email, limit: 1 });
    let customerId = customers.data[0]?.id;

    if (!customerId) {
      const customer = await stripe.customers.create({ email });
      customerId = customer.id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: PRICE_MAP[plan], quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/#precos`,
      allow_promotion_codes: true,
      billing_address_collection: 'auto',
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Erro no checkout:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
