import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  "https://zvlqrgdqftzqtlrhzaha.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PROMPTS: Record<string, (topic: string, platform: string) => string> = {
  ideas: (topic, platform) =>
    `Gere 5 ideias de conteudo criativas e originais sobre "${topic}" para ${platform}.\n\nRegras:\n- Cada ideia deve ter um titulo chamativo\n- Inclua uma breve descricao de 1-2 frases\n- Use formato numerado\n- Texto em portugues do Brasil\n\nFormato de saida:\n1. [Titulo] - [Descricao]\n2. [Titulo] - [Descricao]\n3. [Titulo] - [Descricao]\n4. [Titulo] - [Descricao]\n5. [Titulo] - [Descricao]`,

  scripts: (topic, platform) =>
    `Escreva um roteiro completo de video sobre "${topic}" para ${platform}.\n\nRegras:\n- Hook inicial impactante (primeiros 3 segundos)\n- Estrutura: Hook -> Problema -> Solucao -> CTA\n- Texto em portugues do Brasil`,

  captions: (topic, platform) =>
    `Crie 3 legendas para post sobre "${topic}" no ${platform}.\n\nRegras:\n- Legendas com gancho no inicio\n- Use emojis estrategicamente\n- Inclua call-to-action\n- Texto em portugues do Brasil\n\nLegenda 1:\n[TEXTO]\n\nLegenda 2:\n[TEXTO]\n\nLegenda 3:\n[TEXTO]`,

  hashtags: (topic, platform) =>
    `Gere 30 hashtags estrategicas para conteudo sobre "${topic}" no ${platform}.\n\nRegras:\n- Mix: 10 populares, 10 medias, 10 nicho\n- Formato: #hashtag\n- Texto em portugues do Brasil`,
};

export async function POST(req: NextRequest) {
  try {
    const { topic, platform, contentType, userId } = await req.json();

    if (!topic || !platform || !contentType || !userId) {
      return NextResponse.json({ error: 'Campos obrigatorios faltando' }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('generations_used, generations_limit')
      .eq('id', userId)
      .single();

    if (!profile) {
      return NextResponse.json({ error: 'Usuario nao encontrado' }, { status: 404 });
    }

    if (profile.generations_used >= profile.generations_limit) {
      return NextResponse.json(
        { error: 'Limite de geracoes atingido' },
        { status: 429 }
      );
    }

    const prompt = PROMPTS[contentType]?.(topic, platform) || PROMPTS.ideas(topic, platform);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Voce e um especialista em criacao de conteudo para redes sociais.' },
          { role: 'user', content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI error: ${response.status}`);
    }

    const aiData = await response.json();
    const generatedText = aiData.choices[0]?.message?.content || 'Erro na geracao.';

    await supabase.from('content_generations').insert({
      user_id: userId,
      platform,
      topic,
      content_type: contentType,
      generated_text: generatedText,
    });

    await supabase.rpc('increment_generations', { user_uuid: userId });

    return NextResponse.json({
      text: generatedText,
      remaining: profile.generations_limit - profile.generations_used - 1,
    });
  } catch (error: any) {
    console.error('Erro:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
