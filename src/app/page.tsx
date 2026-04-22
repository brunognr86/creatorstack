"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Zap, Sparkles, Check, Star, ArrowRight, Clock, Brain, Calendar, BarChart3, Layers, Rocket } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            10.000+ criadores ja economizam horas por semana
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Crie mais conteúdo em <span className="text-violet-600">menos tempo</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            A plataforma tudo-em-um para criadores de conteúdo. Gere scripts,
            acesse templates profissionais, organize seu calendario e escale sua producao com IA.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/" className="bg-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-violet-700 transition flex items-center justify-center gap-2">
              Começar Grátis <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#funcionalidades" className="bg-gray-100 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition">
              Ver Demonstração
            </a>
          </div>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <div className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" />Sem cartão de crédito</div>
            <div className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" />7 dias grátis</div>
            <div className="flex items-center gap-1"><Check className="h-4 w-4 text-green-500" />Cancele quando quiser</div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Você passa mais tempo planejando do que criando?</h2>
          <p className="text-center text-gray-600 mb-12">A realidade de quem cria conteúdo hoje:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, label: "2 horas", desc: "pensando no que postar" },
              { icon: Brain, label: "3 horas", desc: "escrevendo scripts e legendas" },
              { icon: Zap, label: "1 hora", desc: "pesquisando hashtags" },
              { icon: Calendar, label: "2 horas", desc: "organizando o calendario" },
            ].map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 text-center">
                <item.icon className="h-8 w-8 text-violet-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-gray-900">{item.label}</div>
                <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-center text-red-500 font-semibold mt-8 text-lg">Total: 8 horas. So de planejamento.</p>
        </div>
      </section>

      <section id="funcionalidades" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Tudo que você precisa em uma so plataforma</h2>
          <p className="text-center text-gray-600 mb-12">Ferramentas poderosas para cada etapa da criacao de conteúdo</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Sparkles, title: "Gerador de Conteúdo com IA", desc: "Scripts para vídeo, legendas para posts, ideias criativas e hashtags otimizadas. Tudo em segundos." },
              { icon: Layers, title: "200+ Templates Profissionais", desc: "Calendarios editoriais, scripts de YouTube, carrosseis do Instagram, planilhas de metricas e muito mais." },
              { icon: Calendar, title: "Calendario Editorial Inteligente", desc: "Planeje sua semana inteira em 15 minutos. Arraste, organize, receba lembretes." },
              { icon: BarChart3, title: "Analytics Avancado", desc: "Acompanhe o desempenho do seu conteúdo. Identifique o que funciona e otimize sua estratégia." },
              { icon: Rocket, title: "Automacoes", desc: "Conecte com suas ferramentas favoritas. Automatize tarefas repetitivas e ganhe tempo." },
              { icon: Brain, title: "IA que Aprende com Você", desc: "Quanto mais você usa, mais a IA entende seu estilo e entrega resultados personalizados." },
            ].map((f, i) => (
              <div key={i} className="p-6 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg transition">
                <f.icon className="h-10 w-10 text-violet-600 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="depoimentos" className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Milhares de criadores ja economizam horas por semana</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Ana Carolina", role: "Criadora de Conteúdo, 45k seguidores", text: "Eu passava 4 horas por dia criando conteúdo. Com o CreatorStack, faco em 1 hora. Meu faturamento dobrou em 3 meses.", stars: 5 },
              { name: "Pedro Mendes", role: "YouTuber, 120k inscritos", text: "Nunca mais fiquei sem ideias de vídeo. O gerador de scripts e incrível. Meu canal cresceu 150% desde que comecei a usar.", stars: 5 },
              { name: "Marina Silva", role: "Social Media Manager", text: "Gerencio 12 contas de clientes. Sem essa ferramenta seria impossível. A automacao de publicação salvou minha sanidade mental.", stars: 5 },
            ].map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.stars }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="preços" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">Escolha seu plano</h2>
          <p className="text-center text-gray-600 mb-12">Comece grátis. Escale quando estiver pronto.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Free", price: "R$ 0", period: "para sempre", features: ["10 gerações de conteúdo/mes", "5 templates basicos", "Calendario editorial simples", "Suporte por email"], highlight: false, cta: "Começar Grátis" },
              { name: "Starter", price: "R$ 29", period: "/mes", features: ["100 gerações de conteúdo/mes", "50+ templates profissionais", "Calendario editorial completo", "Analytics avancado", "Automacoes basicas", "Suporte prioritario"], highlight: true, cta: "Assinar Starter" },
              { name: "Pro", price: "R$ 79", period: "/mes", features: ["Gerações ILIMITADAS", "200+ templates premium", "Todas as automacoes", "API access", "Analytics em tempo real", "Suporte VIP (2h)"], highlight: false, cta: "Assinar Pro" },
            ].map((plan, i) => (
              <div key={i} className={`p-6 rounded-2xl border ${plan.highlight ? 'border-2 border-violet-600 bg-violet-50/50 relative' : 'border-gray-200'}`}>
                {plan.highlight && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-600 text-white text-xs font-semibold px-3 py-1 rounded-full">MAIS POPULAR</div>}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{plan.name}</h3>
                <div className="text-3xl font-bold text-gray-900 mb-1">{plan.price}<span className="text-base font-normal text-gray-500">{plan.period}</span></div>
                <ul className="space-y-3 mb-8 mt-6">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />{f}</li>
                  ))}
                </ul>
                <Link href="/auth/" className={`block w-full text-center py-3 rounded-xl font-medium transition ${plan.highlight ? 'bg-violet-600 text-white hover:bg-violet-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              { q: "Preciso de cartão de crédito para começar?", a: "Não! Você pode começar com o plano Free sem informar nenhum dado de pagamento. So precisara quando quiser fazer upgrade para um plano pago." },
              { q: "Posso cancelar a qualquer momento?", a: "Sim, você pode cancelar sua assinatura a qualquer momento. Não ha contratos de fidelidade nem multas de cancelamento." },
              { q: "Como funciona a garantia de 7 dias?", a: "Se você não ficar satisfeito nos primeiros 7 dias, devolvemos 100% do valor pago. Basta enviar um email para suporte." },
              { q: "O conteúdo gerado e original?", a: "Sim! Nossa IA cria conteúdo único e original para cada usuário. Não e cópia de nada que ja exista." },
              { q: "Posso mudar de plano depois?", a: "Sim, você pode fazer upgrade ou downgrade do seu plano a qualquer momento." },
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Pronto para transformar sua produtividade?</h2>
          <p className="text-lg text-gray-600 mb-8">Junte-se a milhares de criadores que ja economizam 10+ horas por semana.</p>
          <Link href="/auth/" className="inline-flex items-center gap-2 bg-violet-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-violet-700 transition">
            Criar Conta Grátis <ArrowRight className="h-5 w-5" />
          </Link>
          <p className="text-sm text-gray-500 mt-4">Sem cartão de crédito. Sem compromisso.</p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
