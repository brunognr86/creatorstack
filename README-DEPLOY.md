# CreatorStack — Deploy na Vercel

## IMPORTANTE: As chaves ja estao configuradas!

O arquivo `.env.local` ja contem todas as suas chaves.

## Como fazer deploy

### Opcao 1: GitHub + Vercel (Recomendado)

1. Crie um repositorio no GitHub
2. Faca upload deste codigo para o GitHub
3. Na Vercel (vercel.com), importe o projeto do GitHub
4. As variaveis de ambiente ja estao no .env.local

### Opcao 2: Vercel CLI

```bash
# Instale a CLI
npm i -g vercel

# No diretorio do projeto
vercel --prod
```

### Opcao 3: Upload manual na Vercel

1. Va em https://vercel.com
2. "Add New Project"
3. "Import" ou arraste esta pasta
4. Framework: Next.js
5. Deploy!

## Apos o deploy

### 1. Configure o webhook do Stripe

Va no dashboard do Stripe:
- Developers → Webhooks → Add endpoint
- URL: `https://seu-app.vercel.app/api/webhook/stripe`
- Selecione estes eventos:
  - `checkout.session.completed`
  - `invoice.paid`
  - `invoice.payment_failed`
  - `customer.subscription.deleted`
  - `customer.subscription.updated`
- Copie o Signing Secret e adicione na Vercel como `STRIPE_WEBHOOK_SECRET`

### 2. Execute o schema SQL no Supabase

Se ainda nao executou:
1. Supabase → SQL Editor → New query
2. Cole o conteudo do arquivo `sql/schema-completo.sql`
3. Run

## Variaveis de ambiente configuradas

✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ STRIPE_SECRET_KEY
✅ STRIPE_STARTER_PRICE_ID
✅ STRIPE_PRO_PRICE_ID
✅ STRIPE_BUSINESS_PRICE_ID
✅ OPENAI_API_KEY
⚠️ STRIPE_WEBHOOK_SECRET (precisa configurar apos o deploy)

## URLs do app

| Pagina | URL |
|--------|-----|
| Landing | / |
| Login/Cadastro | /auth |
| Dashboard | /dashboard |
| API Checkout | /api/checkout |
| API Webhook Stripe | /api/webhook/stripe |
| API Geracao IA | /api/generate |
