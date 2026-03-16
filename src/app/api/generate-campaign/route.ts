import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Chave GEMINI_API_KEY não configurada." }, { status: 500 });
        }

        const body = await req.json();
        const {
            productName, price, audience,
            benefit1, benefit2, benefit3,
            imageBase64, buyLink, tiktokLink, userId
        } = body;

        if (!productName || !price || !audience || !benefit1 || !benefit2 || !benefit3 || !buyLink || !userId) {
            return NextResponse.json({ error: "Campos obrigatórios ausentes." }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

        const prompt = `
Você é um especialista em marketing viral para TikTok e copywriting de alta conversão.
Crie uma campanha viral completa para o seguinte produto:

Produto: ${productName}
Preço: R$ ${price}
Público-alvo: ${audience}
Benefício 1: ${benefit1}
Benefício 2: ${benefit2}
Benefício 3: ${benefit3}
Link de compra: ${buyLink}
${tiktokLink ? `Link de vídeo TikTok de referência: ${tiktokLink}` : ""}

Retorne APENAS um JSON válido, sem markdown ao redor, com a seguinte estrutura:
{
  "hook": "Hook viral de 1-2 frases para os primeiros 3 segundos do vídeo (máx 15 palavras, em português, impactante, direto)",
  "script": "Roteiro completo do vídeo dividido em 4 partes:\n🎣 HOOK (0-3s): ...\n🎬 DEMONSTRAÇÃO (3-15s): ...\n✅ PROVA (15-25s): ...\n🛒 CHAMADA PARA AÇÃO (25-30s): ...",
  "video_idea": "Ideia criativa e específica de como gravar o vídeo (ex: unboxing com reação surpresa, teste ao vivo do produto, comparação antes e depois). Descreva a cena em 2-3 frases.",
  "headline": "Título persuasivo de uma frase para a página de vendas do produto (máx 10 palavras, focado no maior benefício)"
}
`;

        const parts: any[] = [prompt];

        if (imageBase64) {
            const base64Data = imageBase64.split(",")[1] || imageBase64;
            const mimeType = imageBase64.match(/data:(.*?);base64/)?.[1] || "image/jpeg";
            parts.push({ inlineData: { data: base64Data, mimeType } });
        }

        const result = await model.generateContent(parts);
        const responseText = result.response.text();
        const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);

        if (!parsed.hook || !parsed.script || !parsed.video_idea || !parsed.headline) {
            return NextResponse.json({ error: "Resposta inesperada da IA." }, { status: 500 });
        }

        // Save campaign to Supabase
        const { data: campaign, error: dbError } = await supabaseAdmin
            .from("viral_campaigns")
            .insert({
                user_id: userId,
                product_name: productName,
                price,
                audience,
                benefit_1: benefit1,
                benefit_2: benefit2,
                benefit_3: benefit3,
                image_base64: imageBase64 || null,
                buy_link: buyLink,
                tiktok_link: tiktokLink || null,
                hook: parsed.hook,
                script: parsed.script,
                video_idea: parsed.video_idea,
                headline: parsed.headline,
            })
            .select()
            .single();

        if (dbError) {
            console.error("DB Error:", dbError);
            // Return the generated content even if save fails
            return NextResponse.json({
                campaignId: null,
                hook: parsed.hook,
                script: parsed.script,
                video_idea: parsed.video_idea,
                headline: parsed.headline,
                dbError: dbError.message
            });
        }

        return NextResponse.json({
            campaignId: campaign.id,
            hook: parsed.hook,
            script: parsed.script,
            video_idea: parsed.video_idea,
            headline: parsed.headline,
        });

    } catch (error: any) {
        console.error("Campaign API Error:", error);
        return NextResponse.json({ error: "Falha na geração da campanha: " + error.message }, { status: 500 });
    }
}
