import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@supabase/supabase-js";

// Inicializa o GenAI com a chave, se existir
const apiKey = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);

// Inicializa cliente de admin do Supabase (para pular RLS e checar créditos, se necessário usar secret key)
// Vamos apenas checar logado via cabeçalho ou usar client safe (simplificado aqui mas em produção usaria RLS via cookies)

export async function POST(req: NextRequest) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({ error: "Chave de API do Gemini não configurada no servidor (.env.local)." }, { status: 500 });
        }

        const body = await req.json();
        const { imageBase64, userId, isPro } = body;

        if (!imageBase64) {
            return NextResponse.json({ error: "Nenhuma imagem enviada." }, { status: 400 });
        }

        // Se quiser validar créditos do usuário Free na tabela profiles,
        // o ideal seria fazer via banco (iremos assumir que a verificação de limite ocorreu no cliente ou aqui futuramente).

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `
Você é um perito nutricional linha dura.
Analise a imagem desta tabela nutricional de suplemento (foco em Whey Protein ou hipercalóricos).
Encontre exatamente os seguintes valores numéricos em GRAMAS (g):
1. O tamanho da porção (ex: 30g, 32g, 40g). Se vier colheres, extraia o valor em gramas.
2. A quantidade de PROTEÍNA por porção (ex: 20g, 24g).
3. O nome ou marca do produto se visível (se não, retorne "Desconhecido").
4. A quantidade de carboidratos por porção (para fins informativos).

Retorne APENAS um JSON válido estrito, sem markdown ao redor, seguindo o formato:
{
    "produto": "Nome",
    "porcao_g": 30,
    "proteina_g": 24,
    "carbos_g": 2
}
Caso a imagem seja ilegível ou não seja uma tabela nutricional, retorne:
{
    "erro": "Ilegível ou não é tabela nutricional"
}
`;

        const imageParts = [
            {
                inlineData: {
                    data: imageBase64.split(",")[1] || imageBase64, // Remove o prefixo data:image/...;base64,
                    mimeType: imageBase64.match(/data:(.*?);base64/)?.[1] || "image/jpeg"
                }
            }
        ];

        const result = await model.generateContent([prompt, ...imageParts]);
        const responseText = result.response.text();

        // Faz parse limpando eventuais marcações markdown de JSON
        const cleanJsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJsonString);

        if (parsed.erro) {
            return NextResponse.json({ error: parsed.erro }, { status: 400 });
        }

        const pureza = (parsed.proteina_g / parsed.porcao_g) * 100;

        return NextResponse.json({
            produto: parsed.produto,
            porcao_g: parsed.porcao_g,
            proteina_g: parsed.proteina_g,
            carbos_g: parsed.carbos_g || 0,
            pureza: parseFloat(pureza.toFixed(1))
        }, { status: 200 });

    } catch (error: any) {
        console.error("API Scanner Error:", error);
        return NextResponse.json({ error: "Falha na análise da IA: " + error.message }, { status: 500 });
    }
}
