import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type Campaign = {
    id: string;
    product_name: string;
    price: string;
    headline: string;
    hook: string;
    buy_link: string;
    image_base64: string | null;
    benefit_1: string;
    benefit_2: string;
    benefit_3: string;
};

async function getCampaign(id: string): Promise<Campaign | null> {
    const { data, error } = await supabase
        .from("viral_campaigns")
        .select("id, product_name, price, headline, hook, buy_link, image_base64, benefit_1, benefit_2, benefit_3")
        .eq("id", id)
        .single();
    if (error || !data) return null;
    return data;
}

export async function generateMetadata({ params }: { params: { campaignId: string } }): Promise<Metadata> {
    const campaign = await getCampaign(params.campaignId);
    if (!campaign) return { title: "Página não encontrada" };
    return {
        title: campaign.headline || campaign.product_name,
        description: `${campaign.product_name} por apenas R$ ${campaign.price}. ${campaign.benefit_1}. ${campaign.benefit_2}.`,
    };
}

const FAKE_REVIEWS = [
    { name: "Mariana S.", text: "Comprei e já senti a diferença no primeiro uso! Produto incrível, entrega super rápida.", stars: 5 },
    { name: "João P.", text: "Recomendo muito! Atendeu todas as expectativas e o suporte foi excelente.", stars: 5 },
    { name: "Carla M.", text: "Melhor compra do mês! Qualidade excepcional pelo preço.", stars: 5 },
];

const BENEFIT_ICONS = ["✅", "⚡", "🌟"];

export default async function CampaignLandingPage({ params }: { params: { campaignId: string } }) {
    const campaign = await getCampaign(params.campaignId);
    if (!campaign) notFound();

    const benefits = [campaign.benefit_1, campaign.benefit_2, campaign.benefit_3];

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#09090b", minHeight: "100vh", color: "#fff" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Inter', system-ui, sans-serif; }
                .btn-cta {
                    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
                    width: 100%; max-width: 480px;
                    padding: 22px 40px; border-radius: 100px;
                    background: linear-gradient(135deg, #ec4899, #f97316);
                    color: white; font-weight: 800; font-size: 18px;
                    text-decoration: none; border: none; cursor: pointer;
                    box-shadow: 0 20px 60px rgba(236,72,153,0.4);
                    transition: transform 0.2s, box-shadow 0.2s;
                    letter-spacing: -0.01em;
                }
                .btn-cta:hover { transform: scale(1.03); box-shadow: 0 24px 80px rgba(236,72,153,0.55); }
                .btn-cta:active { transform: scale(0.97); }
                .star { color: #fbbf24; font-size: 18px; }
            `}</style>

            {/* HERO */}
            <section style={{
                minHeight: "100vh", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", padding: "60px 24px 80px",
                background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(236,72,153,0.18) 0%, transparent 70%)",
                textAlign: "center"
            }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 100, background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.25)", marginBottom: 32 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#f472b6", letterSpacing: "0.15em", textTransform: "uppercase" }}>🔥 Oferta Especial</span>
                </div>

                {campaign.image_base64 && (
                    <div style={{ marginBottom: 40, width: "100%", maxWidth: 360 }}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={campaign.image_base64}
                            alt={campaign.product_name}
                            style={{ width: "100%", maxHeight: 340, objectFit: "contain", borderRadius: 24, filter: "drop-shadow(0 30px 60px rgba(236,72,153,0.3))" }}
                        />
                    </div>
                )}

                <h1 style={{ fontSize: "clamp(28px, 6vw, 56px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 24, maxWidth: 700 }}>
                    {campaign.headline}
                </h1>

                <p style={{ fontSize: 18, color: "#a1a1aa", fontWeight: 500, marginBottom: 40, maxWidth: 500, lineHeight: 1.6 }}>
                    {campaign.product_name}
                </p>

                <div style={{ marginBottom: 40, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
                    <span style={{ fontSize: 14, color: "#71717a", textDecoration: "line-through" }}>De R$ {(parseFloat(campaign.price.replace(",", ".")) * 2).toFixed(2).replace(".", ",")}</span>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#f472b6", letterSpacing: "0.1em", textTransform: "uppercase" }}>Agora apenas</span>
                        <span style={{ fontSize: "clamp(40px, 8vw, 72px)", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em" }}>
                            R$ {campaign.price}
                        </span>
                    </div>
                </div>

                <a href={campaign.buy_link} target="_blank" rel="noopener noreferrer" className="btn-cta">
                    🛒 Quero Comprar Agora
                </a>

                <p style={{ marginTop: 20, fontSize: 13, color: "#52525b", fontWeight: 500 }}>
                    🔒 Compra 100% segura • Entrega garantida
                </p>
            </section>

            {/* BENEFITS */}
            <section style={{ padding: "80px 24px", maxWidth: 800, margin: "0 auto" }}>
                <h2 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, textAlign: "center", marginBottom: 16, letterSpacing: "-0.02em" }}>
                    Por que você vai <span style={{ background: "linear-gradient(135deg,#ec4899,#f97316)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>amar isso</span>
                </h2>
                <p style={{ textAlign: "center", color: "#71717a", fontSize: 16, marginBottom: 56, fontWeight: 500 }}>
                    Benefícios reais que fazem a diferença
                </p>

                <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                    {benefits.map((b, i) => (
                        <div key={i} style={{
                            padding: 32, borderRadius: 28, border: "1px solid rgba(255,255,255,0.07)",
                            background: "rgba(255,255,255,0.03)",
                            display: "flex", flexDirection: "column", gap: 16, alignItems: "flex-start"
                        }}>
                            <div style={{ fontSize: 36, lineHeight: 1 }}>{BENEFIT_ICONS[i]}</div>
                            <p style={{ fontSize: 16, fontWeight: 600, color: "#fff", lineHeight: 1.5 }}>{b}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* SOCIAL PROOF */}
            <section style={{ padding: "80px 24px", background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                <div style={{ maxWidth: 800, margin: "0 auto" }}>
                    <h2 style={{ fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, textAlign: "center", marginBottom: 48, letterSpacing: "-0.02em" }}>
                        ⭐ O que nossos clientes dizem
                    </h2>
                    <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
                        {FAKE_REVIEWS.map((r, i) => (
                            <div key={i} style={{
                                padding: 28, borderRadius: 24, border: "1px solid rgba(255,255,255,0.07)",
                                background: "rgba(255,255,255,0.03)",
                            }}>
                                <div style={{ display: "flex", gap: 4, marginBottom: 12 }}>
                                    {"⭐".repeat(r.stars)}
                                </div>
                                <p style={{ fontSize: 15, color: "#d4d4d8", lineHeight: 1.6, fontWeight: 500, marginBottom: 16 }}>"{r.text}"</p>
                                <p style={{ fontSize: 13, color: "#71717a", fontWeight: 700 }}>— {r.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section style={{ padding: "100px 24px 120px", textAlign: "center", background: "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(236,72,153,0.15) 0%, transparent 70%)" }}>
                <h2 style={{ fontSize: "clamp(26px, 5vw, 48px)", fontWeight: 900, marginBottom: 16, letterSpacing: "-0.03em" }}>
                    Não perca essa oportunidade! 🚀
                </h2>
                <p style={{ fontSize: 18, color: "#a1a1aa", fontWeight: 500, marginBottom: 48, maxWidth: 500, margin: "0 auto 48px" }}>
                    Garanta o seu {campaign.product_name} agora por apenas <strong style={{ color: "#f472b6" }}>R$ {campaign.price}</strong>
                </p>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <a href={campaign.buy_link} target="_blank" rel="noopener noreferrer" className="btn-cta" style={{ fontSize: 20 }}>
                        🛒 Comprar Agora — R$ {campaign.price}
                    </a>
                </div>
                <p style={{ marginTop: 24, fontSize: 13, color: "#3f3f46", fontWeight: 500 }}>
                    🔒 Compra segura • Suporte 24h • Satisfação garantida
                </p>

                <div style={{ marginTop: 80, paddingTop: 40, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <p style={{ fontSize: 12, color: "#3f3f46" }}>
                        Página criada com <strong style={{ color: "#ec4899" }}>Viralizzz</strong> — Gerador de Campanhas Virais
                    </p>
                </div>
            </section>
        </div>
    );
}
