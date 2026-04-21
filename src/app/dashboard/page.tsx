"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  Zap, Sparkles, LayoutTemplate, Calendar, Settings,
  LogOut, Copy, Check, ChevronRight, Star, TrendingUp,
  Clock, Hash, FileText, BarChart3, Loader2
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("gerador");
  const [generated, setGenerated] = useState<string>("");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [contentType, setContentType] = useState("ideas");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [generations, setGenerations] = useState<any[]>([]);
  const [templates] = useState([
    { name: "Calendario Editorial 2026", category: "Planejamento", downloads: "2.4k", icon: Calendar },
    { name: "100 Hooks Virais", category: "Engajamento", downloads: "3.1k", icon: TrendingUp },
    { name: "Sistema de Repurposing", category: "Estrategia", downloads: "1.8k", icon: Copy },
    { name: "Scripts de YouTube", category: "Video", downloads: "4.2k", icon: FileText },
    { name: "Checklist Pre-Publicacao", category: "Qualidade", downloads: "5.6k", icon: Check },
    { name: "50 Legendas para Instagram", category: "Copywriting", downloads: "6.1k", icon: Star },
  ]);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        setProfile(data);
        loadGenerations(user.id);
      }
    };
    checkUser();
  }, []);

  const loadGenerations = async (userId: string) => {
    const { data } = await supabase
      .from('content_generations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);
    if (data) setGenerations(data);
  };

  const handleGenerate = async () => {
    if (!topic.trim() || !user) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform, contentType, userId: user.id }),
      });
      const data = await res.json();
      if (data.text) {
        setGenerated(data.text);
        loadGenerations(user.id);
        setProfile((p: any) => p ? { ...p, generations_used: p.generations_used + 1 } : p);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCheckout = async (plan: string) => {
    if (!user) return;
    const res = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, email: user.email }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  const tabs = [
    { id: "gerador", label: "Gerador", icon: Sparkles },
    { id: "templates", label: "Templates", icon: LayoutTemplate },
    { id: "historico", label: "Historico", icon: Clock },
    { id: "config", label: "Configuracoes", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2">
                <Zap className="h-6 w-6 text-violet-600" />
                <span className="text-lg font-bold text-gray-900 hidden sm:block">CreatorStack</span>
              </Link>
              <div className="h-6 w-px bg-gray-200 hidden sm:block" />
              <span className="text-sm text-gray-500 hidden sm:block">Dashboard</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user?.email || "Convidado"}</p>
                <p className="text-xs text-gray-500 uppercase">{profile?.plan || "free"}</p>
              </div>
              <button onClick={() => supabase.auth.signOut()} className="text-gray-400 hover:text-gray-600">
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Geracoes", value: profile?.generations_used || 0, max: profile?.generations_limit || 10, icon: Sparkles },
            { label: "Templates", value: "6", max: profile?.plan === 'free' ? "6" : "200+", icon: LayoutTemplate },
            { label: "Posts", value: generations.length, max: "∞", icon: FileText },
            { label: "Plano", value: profile?.plan?.toUpperCase() || "FREE", max: "", icon: BarChart3 },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-4 rounded-xl border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <stat.icon className="h-5 w-5 text-violet-600" />
                {stat.max && <span className="text-xs text-gray-400">max {stat.max}</span>}
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition ${
                activeTab === tab.id ? "bg-violet-600 text-white" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}>
              <tab.icon className="h-4 w-4" />{tab.label}
            </button>
          ))}
        </div>

        {activeTab === "gerador" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4">Novo Conteudo</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tema/Assunto</label>
                    <input type="text" value={topic} onChange={(e) => setTopic(e.target.value)}
                      placeholder="Ex: produtividade, marketing..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Plataforma</label>
                    <select value={platform} onChange={(e) => setPlatform(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm bg-white">
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="youtube">YouTube</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="twitter">Twitter/X</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                    <select value={contentType} onChange={(e) => setContentType(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500 text-sm bg-white">
                      <option value="ideas">Ideias</option>
                      <option value="scripts">Scripts</option>
                      <option value="captions">Legendas</option>
                      <option value="hashtags">Hashtags</option>
                    </select>
                  </div>
                  <button onClick={handleGenerate} disabled={loading || !topic.trim() || !user}
                    className="w-full bg-violet-600 text-white py-3 rounded-xl font-medium hover:bg-violet-700 transition disabled:opacity-50 flex items-center justify-center gap-2">
                    {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Gerando...</> : <><Sparkles className="h-4 w-4" /> Gerar Conteudo</>}
                  </button>
                  {!user && <p className="text-xs text-red-500 text-center">Faca login para gerar conteudo</p>}
                </div>
              </div>
            </div>
            <div className="lg:col-span-2">
              {!generated ? (
                <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                  <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum conteudo gerado ainda</h3>
                  <p className="text-sm text-gray-500">Preencha o formulario e clique em "Gerar Conteudo"</p>
                </div>
              ) : (
                <div className="bg-white p-6 rounded-2xl border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Hash className="h-4 w-4 text-violet-600" />
                      <span className="text-xs font-medium text-violet-600 uppercase">{platform} / {contentType}</span>
                    </div>
                    <button onClick={() => handleCopy(generated)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
                      {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{generated}</pre>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "templates" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((t, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-violet-200 hover:shadow-lg transition">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-violet-50 rounded-xl"><t.icon className="h-6 w-6 text-violet-600" /></div>
                  <span className="text-xs text-gray-400">{t.downloads} downloads</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{t.name}</h3>
                <p className="text-sm text-gray-500 mb-4">{t.category}</p>
                <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:border-violet-300 hover:bg-violet-50 transition">
                  Usar Template <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "historico" && (
          <div className="space-y-3">
            {generations.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
                <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhuma geracao ainda</p>
              </div>
            ) : generations.map((g, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <Hash className="h-4 w-4 text-violet-600" />
                  <span className="text-xs font-medium text-violet-600 uppercase">{g.platform}</span>
                  <span className="text-xs text-gray-400 ml-auto">{new Date(g.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">{g.generated_text}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "config" && (
          <div className="max-w-2xl space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Plano Atual</h3>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mb-4">
                <div>
                  <p className="font-medium text-gray-900">{profile?.plan?.toUpperCase() || "FREE"}</p>
                  <p className="text-sm text-gray-500">{profile?.generations_used || 0} / {profile?.generations_limit || 10} geracoes</p>
                </div>
                {profile?.plan === 'free' && (
                  <button onClick={() => handleCheckout('starter')} className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm font-medium hover:bg-violet-700 transition">
                    Fazer Upgrade
                  </button>
                )}
              </div>
              {profile?.plan === 'free' && (
                <div className="grid grid-cols-3 gap-3">
                  {[{ name: 'Starter', price: 'R$ 29', plan: 'starter' }, { name: 'Pro', price: 'R$ 79', plan: 'pro' }, { name: 'Business', price: 'R$ 199', plan: 'business' }].map((p) => (
                    <button key={p.plan} onClick={() => handleCheckout(p.plan)}
                      className="p-3 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition text-center">
                      <p className="font-semibold text-gray-900">{p.name}</p>
                      <p className="text-sm text-gray-500">{p.price}/mes</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
