-- =====================================================
-- CREATORSTACK - SCHEMA SQL COMPLETO
-- Execute no SQL Editor do Supabase (em ordem)
-- =====================================================

-- -----------------------------------------------------
-- 1. TABELA DE PERFIS DE USUARIO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  niche TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'pro', 'business')),
  generations_used INTEGER DEFAULT 0,
  generations_limit INTEGER DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- 2. TABELA DE ASSINATURAS (Stripe)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'business')),
  status TEXT NOT NULL DEFAULT 'incomplete' CHECK (status IN ('incomplete', 'active', 'canceled', 'past_due', 'unpaid')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- 3. TABELA DE GERACOES DE CONTEUDO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS content_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  platform TEXT NOT NULL,
  topic TEXT NOT NULL,
  content_type TEXT DEFAULT 'ideas' CHECK (content_type IN ('ideas', 'scripts', 'captions', 'hashtags')),
  generated_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- 4. TABELA DE TEMPLATES USADOS
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS template_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  template_name TEXT NOT NULL,
  category TEXT,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- 5. TABELA DE ATIVIDADE DO CALENDARIO
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS calendar_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  platform TEXT NOT NULL,
  scheduled_date DATE NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------
-- ROW LEVEL SECURITY (RLS) - CRITICO PARA SEGURANCA
-- -----------------------------------------------------

-- Habilitar RLS em todas as tabelas
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_downloads ENABLE ROW LEVEL SECURITY;
ALTER TABLE calendar_posts ENABLE ROW LEVEL SECURITY;

-- Politicas para profiles
CREATE POLICY "Usuarios podem ver apenas seu proprio perfil"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Usuarios podem editar apenas seu proprio perfil"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Politicas para subscriptions
CREATE POLICY "Usuarios podem ver apenas suas proprias assinaturas"
  ON subscriptions FOR SELECT USING (auth.uid() = user_id);

-- Politicas para content_generations
CREATE POLICY "Usuarios podem ver apenas suas proprias geracoes"
  ON content_generations FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem criar suas proprias geracoes"
  ON content_generations FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Politicas para template_downloads
CREATE POLICY "Usuarios podem ver apenas seus proprios downloads"
  ON template_downloads FOR SELECT USING (auth.uid() = user_id);

-- Politicas para calendar_posts
CREATE POLICY "Usuarios podem ver apenas seus proprios posts"
  ON calendar_posts FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Usuarios podem gerenciar apenas seus proprios posts"
  ON calendar_posts FOR ALL USING (auth.uid() = user_id);

-- -----------------------------------------------------
-- TRIGGER: CRIAR PERFIL AUTOMATICAMENTE AO CADASTRAR
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url, plan, generations_used, generations_limit)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url',
    'free',
    0,
    10
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar trigger no auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------
-- FUNCTION: INCREMENTAR GERACOES USADAS
-- -----------------------------------------------------
CREATE OR REPLACE FUNCTION increment_generations(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE profiles
  SET generations_used = generations_used + 1,
      updated_at = NOW()
  WHERE id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- -----------------------------------------------------
-- INDICES PARA PERFORMANCE
-- -----------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_content_gen_user ON content_generations(user_id);
CREATE INDEX IF NOT EXISTS idx_content_gen_created ON content_generations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_calendar_user_date ON calendar_posts(user_id, scheduled_date);

-- -----------------------------------------------------
-- VIEW: RESUMO DO USUARIO (para dashboard)
-- -----------------------------------------------------
CREATE OR REPLACE VIEW user_dashboard_stats AS
SELECT
  p.id AS user_id,
  p.plan,
  p.generations_used,
  p.generations_limit,
  COUNT(DISTINCT cg.id) AS total_generations,
  COUNT(DISTINCT td.id) AS total_template_downloads,
  COUNT(DISTINCT cp.id) AS total_calendar_posts,
  s.status AS subscription_status,
  s.current_period_end
FROM profiles p
LEFT JOIN content_generations cg ON cg.user_id = p.id
LEFT JOIN template_downloads td ON td.user_id = p.id
LEFT JOIN calendar_posts cp ON cp.user_id = p.id
LEFT JOIN subscriptions s ON s.user_id = p.id AND s.status = 'active'
GROUP BY p.id, p.plan, p.generations_used, p.generations_limit, s.status, s.current_period_end;

-- =====================================================
-- FIM DO SCHEMA
-- Para verificar se deu certo, rode no SQL Editor:
-- SELECT * FROM profiles LIMIT 1;
-- SELECT * FROM user_dashboard_stats LIMIT 1;
-- =====================================================
