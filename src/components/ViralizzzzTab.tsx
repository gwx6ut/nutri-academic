"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import {
    ArrowUpRight, CheckCircle2, Crown, ExternalLink, Flame,
    ImagePlus, Loader2, Lock, Megaphone, Rocket, Sparkles,
    Trash2, Video, Zap
} from "lucide-react";

type Campaign = {
    id: string;
    product_name: string;
    price: string;
    hook: string;
    script: string;
    video_idea: string;
    headline: string;
    buy_link: string;
    benefit_1: string;
    benefit_2: string;
    benefit_3: string;
    created_at: string;
};

type Props = {
    userId: string;
    isPro: boolean;
    isUnlimited: boolean;
};

const PLAN_LIMITS: Record<string, number> = {
    free: 1,
    pro: 20,
    unlimited: Infinity,
};

export default function ViralizzzzTab({ userId, isPro, isUnlimited }: Props) {
    const supabase = createClient();

    // Campaign list
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loadingCampaigns, setLoadingCampaigns] = useState(true);

    // Form
    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [audience, setAudience] = useState("");
    const [benefit1, setBenefit1] = useState("");
    const [benefit2, setBenefit2] = useState("");
    const [benefit3, setBenefit3] = useState("");
    const [buyLink, setBuyLink] = useState("");
    const [tiktokLink, setTiktokLink] = useState("");
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    // Generation state
    const [generating, setGenerating] = useState(false);
    const [result, setResult] = useState<Campaign | null>(null);
    const [error, setError] = useState<string | null>(null);

    const planLimit = isUnlimited ? Infinity : isPro ? PLAN_LIMITS.pro : PLAN_LIMITS.free;
    const canCreate = campaigns.length < planLimit;

    useEffect(() => {
        const fetchCampaigns = async () => {
            setLoadingCampaigns(true);
            const { data } = await supabase
                .from("viral_campaigns")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });
            if (data) setCampaigns(data);
            setLoadingCampaigns(false);
        };
        fetchCampaigns();
    }, [userId]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const b64 = ev.target?.result as string;
            setImageBase64(b64);
            setImagePreview(b64);
        };
        reader.readAsDataURL(file);
    };

    const handleGenerate = async () => {
        setError(null);
        if (!productName || !price || !audience || !benefit1 || !benefit2 || !benefit3 || !buyLink) {
            setError("Preencha todos os campos obrigatórios.");
            return;
        }
        if (!canCreate) {
            setError("Limite de campanhas atingido. Faça upgrade do seu plano.");
            return;
        }
        setGenerating(true);
        try {
            const res = await fetch("/api/generate-campaign", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productName, price, audience,
                    benefit1, benefit2, benefit3,
                    imageBase64, buyLink, tiktokLink,
                    userId
                }),
            });
            const data = await res.json();
            if (!res.ok || data.error) {
                setError(data.error || "Erro ao gerar campanha.");
                return;
            }
            const newCampaign: Campaign = {
                id: data.campaignId,
                product_name: productName,
                price,
                hook: data.hook,
                script: data.script,
                video_idea: data.video_idea,
                headline: data.headline,
                buy_link: buyLink,
                benefit_1: benefit1,
                benefit_2: benefit2,
                benefit_3: benefit3,
                created_at: new Date().toISOString().split("T")[0],
            };
            setResult(newCampaign);
            setCampaigns(prev => [newCampaign, ...prev]);
            // Reset form
            setProductName(""); setPrice(""); setAudience("");
            setBenefit1(""); setBenefit2(""); setBenefit3("");
            setBuyLink(""); setTiktokLink("");
            setImageBase64(null); setImagePreview(null);
        } catch (e: any) {
            setError("Erro inesperado: " + e.message);
        } finally {
            setGenerating(false);
        }
    };

    const deleteCampaign = async (id: string) => {
        setCampaigns(prev => prev.filter(c => c.id !== id));
        await supabase.from("viral_campaigns").delete().eq("id", id);
        if (result?.id === id) setResult(null);
    };

    const inputClass = "w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-medium placeholder:text-zinc-600 outline-none focus:border-pink-500/50 focus:bg-pink-500/5 transition-all";
    const labelClass = "block text-[10px] font-bold text-zinc-500 tracking-[0.3em] uppercase mb-2";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
        >
            {/* Header Banner */}
            <div className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-pink-950/60 via-rose-950/40 to-orange-950/40 border border-pink-500/20 p-10 md:p-14 shadow-2xl shadow-pink-900/20">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,_rgba(236,72,153,0.15)_0%,_transparent_60%)] pointer-events-none" />
                <div className="absolute top-0 right-0 p-10 opacity-10">
                    <Megaphone className="w-48 h-48 text-pink-400" />
                </div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-pink-500/10 border border-pink-500/20 rounded-full mb-5">
                            <Sparkles className="w-3 h-3 text-pink-400" />
                            <span className="text-[9px] font-bold tracking-widest text-pink-400 uppercase">Powered by Gemini AI</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-none mb-4">
                            Viralizzz <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">🔥</span>
                        </h2>
                        <p className="text-zinc-400 text-sm font-medium leading-relaxed max-w-lg">
                            Cole os dados do seu produto e a IA gera um hook viral, roteiro de TikTok e uma página de vendas pronta — em segundos.
                        </p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-3">
                        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-center">
                            <p className="text-[10px] text-zinc-500 font-bold tracking-widest uppercase">Campanhas Usadas</p>
                            <p className="text-3xl font-bold text-white mt-1">
                                {campaigns.length}
                                <span className="text-zinc-600 text-lg">/{planLimit === Infinity ? "∞" : planLimit}</span>
                            </p>
                        </div>
                        {!isPro && !isUnlimited && (
                            <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                                <Crown className="w-3 h-3 text-yellow-400" />
                                <span className="text-[10px] text-yellow-400 font-bold tracking-wider">Plano Free: 1 campanha</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Campaign Form */}
            {!canCreate ? (
                <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-14 text-center">
                    <div className="w-20 h-20 rounded-[2rem] bg-pink-500/10 border border-pink-500/20 flex items-center justify-center mx-auto mb-8">
                        <Lock className="w-10 h-10 text-pink-400" />
                    </div>
                    <h3 className="text-3xl font-bold text-white mb-4">Limite Atingido</h3>
                    <p className="text-zinc-400 text-sm max-w-md mx-auto mb-10 leading-relaxed">
                        {isPro
                            ? "Você usou todas as 20 campanhas do Plano Pro. Faça upgrade para o Plano Ilimitado."
                            : "Você usou sua 1 campanha gratuita. Assine o Plano Pro (R$14,90/mês) para até 20 campanhas."}
                    </p>
                    <a href="/pricing" className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold text-xs tracking-widest uppercase rounded-3xl shadow-xl shadow-pink-500/20 hover:scale-105 active:scale-95 transition-all">
                        <Crown className="w-4 h-4" /> Ver Planos
                    </a>
                </div>
            ) : (
                <div className="bg-zinc-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/5 shadow-2xl shadow-black/40 overflow-hidden">
                    <div className="p-10 md:p-14 border-b border-white/5">
                        <h3 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-pink-500/10 border border-pink-500/20">
                                <Rocket className="w-5 h-5 text-pink-400" />
                            </div>
                            Criar Nova Campanha Viral
                        </h3>
                        <p className="text-zinc-500 text-sm mt-2 ml-14">Preencha os dados do produto e a IA faz o resto.</p>
                    </div>

                    <div className="p-10 md:p-14 space-y-8">
                        {/* Row 1: Product Name + Price */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Nome do Produto *</label>
                                <input value={productName} onChange={e => setProductName(e.target.value)} placeholder="ex: Creme Anti-Rugas Premium" className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Preço (R$) *</label>
                                <input value={price} onChange={e => setPrice(e.target.value)} placeholder="ex: 97,00" className={inputClass} />
                            </div>
                        </div>

                        {/* Row 2: Audience */}
                        <div>
                            <label className={labelClass}>Público-alvo *</label>
                            <input value={audience} onChange={e => setAudience(e.target.value)} placeholder="ex: Mulheres de 35-55 anos que querem rejuvenescer a pele" className={inputClass} />
                        </div>

                        {/* Row 3: Benefits */}
                        <div>
                            <label className={labelClass}>3 Benefícios Principais *</label>
                            <div className="space-y-3">
                                <input value={benefit1} onChange={e => setBenefit1(e.target.value)} placeholder="Benefício 1 – ex: Reduz rugas em 7 dias" className={inputClass} />
                                <input value={benefit2} onChange={e => setBenefit2(e.target.value)} placeholder="Benefício 2 – ex: Hidratação 72 horas" className={inputClass} />
                                <input value={benefit3} onChange={e => setBenefit3(e.target.value)} placeholder="Benefício 3 – ex: Ingredientes 100% naturais" className={inputClass} />
                            </div>
                        </div>

                        {/* Row 4: Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className={labelClass}>Link de Compra *</label>
                                <input value={buyLink} onChange={e => setBuyLink(e.target.value)} placeholder="https://..." className={inputClass} />
                            </div>
                            <div>
                                <label className={labelClass}>Link de Vídeo TikTok (opcional)</label>
                                <input value={tiktokLink} onChange={e => setTiktokLink(e.target.value)} placeholder="https://tiktok.com/..." className={inputClass} />
                            </div>
                        </div>

                        {/* Row 5: Image Upload */}
                        <div>
                            <label className={labelClass}>Imagem do Produto (opcional)</label>
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="cursor-pointer border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center gap-4 hover:border-pink-500/40 hover:bg-pink-500/5 transition-all group"
                            >
                                {imagePreview ? (
                                    <img src={imagePreview} alt="preview" className="h-32 object-contain rounded-xl" />
                                ) : (
                                    <>
                                        <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-pink-500/10 transition-colors">
                                            <ImagePlus className="w-8 h-8 text-zinc-600 group-hover:text-pink-400 transition-colors" />
                                        </div>
                                        <p className="text-zinc-500 text-sm font-medium">Clique para fazer upload da foto do produto</p>
                                        <p className="text-zinc-700 text-xs">PNG, JPG ou WEBP</p>
                                    </>
                                )}
                            </div>
                            <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-medium">
                                ⚠️ {error}
                            </div>
                        )}

                        {/* Submit Button */}
                        <button
                            onClick={handleGenerate}
                            disabled={generating}
                            className="w-full py-6 rounded-3xl bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold text-sm tracking-widest uppercase shadow-2xl shadow-pink-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {generating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Gerando sua campanha viral...
                                </>
                            ) : (
                                <>
                                    <Zap className="w-5 h-5" />
                                    Gerar Campanha Viral 🚀
                                </>
                            )}
                        </button>
                    </div>
                </div>
            )}

            {/* Generated Result */}
            <AnimatePresence>
                {result && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-gradient-to-br from-pink-950/50 via-zinc-900/60 to-orange-950/30 border border-pink-500/20 rounded-[3rem] overflow-hidden shadow-2xl shadow-pink-900/20"
                    >
                        <div className="p-10 md:p-14 border-b border-pink-500/10 flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-3 rounded-2xl bg-pink-500/20 border border-pink-500/30">
                                    <Sparkles className="w-6 h-6 text-pink-400" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Campanha Gerada! 🎉</h3>
                                    <p className="text-zinc-500 text-xs mt-1 font-medium">{result.product_name}</p>
                                </div>
                            </div>
                            {result.id && (
                                <a
                                    href={`/viralizzz/${result.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="shrink-0 flex items-center gap-2 px-6 py-3 bg-pink-500 text-white text-xs font-bold tracking-wider rounded-2xl hover:bg-pink-600 transition-colors shadow-lg shadow-pink-500/20"
                                >
                                    Ver Página de Vendas <ExternalLink className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        <div className="p-10 md:p-14 space-y-8">
                            {/* Hook */}
                            <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5">
                                <p className="text-[10px] font-bold text-pink-400 tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                                    <Flame className="w-4 h-4" /> Hook Viral (primeiros 3 segundos)
                                </p>
                                <p className="text-2xl font-bold text-white leading-snug">"{result.hook}"</p>
                            </div>

                            {/* Script */}
                            <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5">
                                <p className="text-[10px] font-bold text-orange-400 tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                                    <Video className="w-4 h-4" /> Roteiro do Vídeo
                                </p>
                                <pre className="text-sm text-zinc-300 font-medium leading-relaxed whitespace-pre-wrap">{result.script}</pre>
                            </div>

                            {/* Video Idea */}
                            <div className="bg-white/5 rounded-[2rem] p-8 border border-white/5">
                                <p className="text-[10px] font-bold text-emerald-400 tracking-[0.3em] uppercase mb-4 flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" /> Ideia de Gravação
                                </p>
                                <p className="text-base text-zinc-300 font-medium leading-relaxed">{result.video_idea}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Past Campaigns */}
            {campaigns.length > 0 && (
                <div className="space-y-6">
                    <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-pink-500 shadow-[0_0_8px_#ec4899]" />
                        Campanhas Anteriores
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {campaigns.map((c) => (
                            <motion.div
                                key={c.id}
                                layout
                                className="bg-zinc-900/40 border border-white/5 rounded-[2rem] p-8 flex flex-col gap-5 group hover:border-pink-500/20 hover:-translate-y-1 transition-all shadow-xl"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-bold text-zinc-600 tracking-widest uppercase mb-1">{c.created_at}</p>
                                        <h4 className="text-lg font-bold text-white leading-tight">{c.product_name}</h4>
                                        <p className="text-sm text-pink-400 font-medium mt-1">R$ {c.price}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteCampaign(c.id)}
                                        className="opacity-0 group-hover:opacity-100 p-3 hover:bg-rose-500/10 rounded-xl transition-all text-zinc-600 hover:text-rose-400"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-xs text-zinc-500 font-medium leading-relaxed line-clamp-2">
                                    🎣 {c.hook}
                                </p>
                                {c.id && (
                                    <a
                                        href={`/viralizzz/${c.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors mt-auto"
                                    >
                                        Ver Página de Vendas <ArrowUpRight className="w-4 h-4" />
                                    </a>
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {loadingCampaigns && (
                <div className="flex items-center justify-center py-16">
                    <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
                </div>
            )}
        </motion.div>
    );
}
