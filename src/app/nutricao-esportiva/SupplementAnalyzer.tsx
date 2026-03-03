"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    DollarSign, TrendingUp, TrendingDown, AlertCircle,
    CheckCircle2, Copy, Loader, BarChart3, Zap, Microscope
} from "lucide-react";

interface AnalysisResult {
    supplementName: string;
    proteinPerServing: number;
    pricePerServing: number;
    marketAveragePrice: number;
    costBenefitScore: number; // 0-100
    verdict: "excellent" | "good" | "average" | "poor";
    reasoning: string;
    comparison: string;
}

const MARKET_AVERAGES = {
    "whey protein": { pricePerServing: 1.2, proteinPerServing: 25 },
    "creatina": { pricePerServing: 0.3, proteinPerServing: 0 },
    "bcaa": { pricePerServing: 0.8, proteinPerServing: 5 },
    "beta-alanina": { pricePerServing: 0.5, proteinPerServing: 0 },
    "ômega 3": { pricePerServing: 0.6, proteinPerServing: 0 },
    "magnésio": { pricePerServing: 0.4, proteinPerServing: 0 },
    "vitamin d": { pricePerServing: 0.2, proteinPerServing: 0 },
    "colágeno": { pricePerServing: 1.0, proteinPerServing: 10 },
};

export default function SupplementAnalyzer({
    accentColor,
    bgAccent,
}: {
    accentColor: string;
    bgAccent: string;
}) {
    const [inputType, setInputType] = useState<"link" | "manual">("manual");
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState("");

    // Manual input fields
    const [supplementName, setSupplementName] = useState("");
    const [proteinPerServing, setProteinPerServing] = useState("");
    const [servingsPerPackage, setServingsPerPackage] = useState("");
    const [totalPrice, setTotalPrice] = useState("");

    const calculateAnalysis = () => {
        setError("");
        setLoading(true);

        try {
            if (!supplementName || !proteinPerServing || !servingsPerPackage || !totalPrice) {
                throw new Error("Preencha todos os campos");
            }

            const protein = parseFloat(proteinPerServing);
            const servings = parseFloat(servingsPerPackage);
            const price = parseFloat(totalPrice);

            if (protein < 0 || servings <= 0 || price <= 0) {
                throw new Error("Valores devem ser positivos");
            }

            const pricePerServing = price / servings;

            // Find market average for similar product
            const marketData = Object.entries(MARKET_AVERAGES).find(([key]) =>
                supplementName.toLowerCase().includes(key)
            )?.[1] || { pricePerServing: 1.0, proteinPerServing: 20 };

            // Calculate cost-benefit score
            // Lower price per serving = higher score
            // Higher protein per serving = higher score
            const priceRatio = marketData.pricePerServing / pricePerServing; // < 1 = mais caro, > 1 = mais barato
            const proteinRatio = protein / (marketData.proteinPerServing || 20);

            const costBenefitScore = Math.min(100, Math.round((priceRatio * 50 + proteinRatio * 50)));

            let verdict: "excellent" | "good" | "average" | "poor" = "average";
            let reasoning = "";

            if (costBenefitScore >= 80) {
                verdict = "excellent";
                reasoning = `Excelente custo-benefício! ${priceRatio > 1 ? "Mais barato" : "Comparável ao mercado"} que a média, com ${proteinRatio > 1 ? "mais" : "quantidade similar"} de proteína por porção.`;
            } else if (costBenefitScore >= 60) {
                verdict = "good";
                reasoning = `Bom custo-benefício. Oferece uma relação ${priceRatio > 1 ? "favorável" : "ligeiramente acima"} da média de mercado.`;
            } else if (costBenefitScore >= 40) {
                verdict = "average";
                reasoning = `Custo-benefício dentro da média. Vale a pena se a qualidade é verificada, mas existem alternativas melhores.`;
            } else {
                verdict = "poor";
                reasoning = `Custo-benefício abaixo da média. Recomenda-se buscar alternativas mais econômicas com similar perfil nutricional.`;
            }

            const comparison = `R$ ${pricePerServing.toFixed(2)}/porção vs média de mercado: R$ ${marketData.pricePerServing.toFixed(2)}/porção`;

            setAnalysis({
                supplementName,
                proteinPerServing: protein,
                pricePerServing,
                marketAveragePrice: marketData.pricePerServing,
                costBenefitScore,
                verdict,
                reasoning,
                comparison,
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Erro ao calcular");
            setAnalysis(null);
        } finally {
            setLoading(false);
        }
    };

    const verdictColors = {
        excellent: "bg-emerald-500/20 border-emerald-500/50 text-emerald-300",
        good: "bg-blue-500/20 border-blue-500/50 text-blue-300",
        average: "bg-yellow-500/20 border-yellow-500/50 text-yellow-300",
        poor: "bg-red-500/20 border-red-500/50 text-red-300",
    };

    const verdictIcons = {
        excellent: <CheckCircle2 className="w-5 h-5" />,
        good: <TrendingUp className="w-5 h-5" />,
        average: <AlertCircle className="w-5 h-5" />,
        poor: <TrendingDown className="w-5 h-5" />,
    };

    return (
        <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-10 backdrop-blur-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5 text-emerald-500">
                <Microscope className="w-48 h-48" />
            </div>

            <div className="flex items-center justify-between mb-12 relative z-10">
                <div>
                    <h2 className="text-3xl font-black italic uppercase">Análise de Suplementos</h2>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2 italic">
                        Custo-Benefício vs Mercado
                    </p>
                </div>
                <div className={`w-12 h-12 ${bgAccent} rounded-2xl flex items-center justify-center text-black`}>
                    <DollarSign className="w-6 h-6" />
                </div>
            </div>

            {/* Input Type Selector */}
            <div className="flex gap-3 mb-8 relative z-10">
                {[
                    { type: "manual" as const, label: "Entrada Manual" },
                    { type: "link" as const, label: "Cola Link (Em Breve)" },
                ].map((option) => (
                    <button
                        key={option.type}
                        onClick={() => setInputType(option.type)}
                        disabled={option.type === "link"}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            inputType === option.type
                                ? "bg-emerald-500 text-black"
                                : "bg-white/5 text-zinc-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            {/* Manual Input Form */}
            {inputType === "manual" && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 mb-8 relative z-10"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-3">
                                Nome do Suplemento
                            </label>
                            <input
                                type="text"
                                value={supplementName}
                                onChange={(e) => setSupplementName(e.target.value)}
                                placeholder="Ex: Whey Protein Isolado"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-3">
                                Proteína por Porção (g)
                            </label>
                            <input
                                type="number"
                                value={proteinPerServing}
                                onChange={(e) => setProteinPerServing(e.target.value)}
                                placeholder="Ex: 25"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-3">
                                Porções por Embalagem
                            </label>
                            <input
                                type="number"
                                value={servingsPerPackage}
                                onChange={(e) => setServingsPerPackage(e.target.value)}
                                placeholder="Ex: 40"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-3">
                                Preço Total (R$)
                            </label>
                            <input
                                type="number"
                                value={totalPrice}
                                onChange={(e) => setTotalPrice(e.target.value)}
                                placeholder="Ex: 150"
                                className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white placeholder-zinc-600 focus:border-emerald-500 focus:outline-none transition-all"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="bg-red-500/20 border border-red-500/50 p-4 rounded-xl flex gap-3 items-start"
                        >
                            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                            <p className="text-sm text-red-300">{error}</p>
                        </motion.div>
                    )}

                    <button
                        onClick={calculateAnalysis}
                        disabled={loading}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-black font-black py-4 rounded-xl uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-3"
                    >
                        {loading ? (
                            <>
                                <Loader className="w-4 h-4 animate-spin" />
                                Analisando...
                            </>
                        ) : (
                            <>
                                <BarChart3 className="w-4 h-4" />
                                Analisar Custo-Benefício
                            </>
                        )}
                    </button>
                </motion.div>
            )}

            {/* Analysis Results */}
            <AnimatePresence>
                {analysis && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6 relative z-10"
                    >
                        {/* Verdict Card */}
                        <div
                            className={`border rounded-2xl p-8 flex items-start gap-6 ${
                                verdictColors[analysis.verdict]
                            }`}
                        >
                            <div className="p-3 bg-white/10 rounded-xl">
                                {verdictIcons[analysis.verdict]}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-black uppercase text-lg mb-2 tracking-tight">
                                    {analysis.verdict === "excellent" && "Excelente Custo-Benefício"}
                                    {analysis.verdict === "good" && "Bom Custo-Benefício"}
                                    {analysis.verdict === "average" && "Custo-Benefício Médio"}
                                    {analysis.verdict === "poor" && "Custo-Benefício Abaixo da Média"}
                                </h3>
                                <p className="text-sm leading-relaxed">{analysis.reasoning}</p>
                            </div>
                        </div>

                        {/* Score Bar */}
                        <div className="bg-black/40 border border-white/5 p-8 rounded-2xl space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                                    Score de Custo-Benefício
                                </span>
                                <span className="text-2xl font-black text-emerald-400">
                                    {analysis.costBenefitScore}/100
                                </span>
                            </div>
                            <div className="w-full bg-black/60 border border-white/5 h-2 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${analysis.costBenefitScore}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className={`h-full rounded-full ${
                                        analysis.costBenefitScore >= 80
                                            ? "bg-emerald-500"
                                            : analysis.costBenefitScore >= 60
                                            ? "bg-blue-500"
                                            : analysis.costBenefitScore >= 40
                                            ? "bg-yellow-500"
                                            : "bg-red-500"
                                    }`}
                                />
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-black/40 border border-white/5 p-6 rounded-xl text-center">
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">
                                    Proteína/Porção
                                </p>
                                <p className="text-2xl font-black text-emerald-400">
                                    {analysis.proteinPerServing}g
                                </p>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-6 rounded-xl text-center">
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">
                                    Seu Preço/Porção
                                </p>
                                <p className="text-2xl font-black text-white">
                                    R$ {analysis.pricePerServing.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-6 rounded-xl text-center">
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">
                                    Média Mercado
                                </p>
                                <p className="text-2xl font-black text-zinc-400">
                                    R$ {analysis.marketAveragePrice.toFixed(2)}
                                </p>
                            </div>
                            <div className="bg-black/40 border border-white/5 p-6 rounded-xl text-center">
                                <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mb-2">
                                    Diferença
                                </p>
                                <p
                                    className={`text-2xl font-black ${
                                        analysis.pricePerServing < analysis.marketAveragePrice
                                            ? "text-emerald-400"
                                            : "text-red-400"
                                    }`}
                                >
                                    {analysis.pricePerServing < analysis.marketAveragePrice ? "-" : "+"}
                                    {Math.abs(
                                        analysis.marketAveragePrice - analysis.pricePerServing
                                    ).toFixed(2)}
                                </p>
                            </div>
                        </div>

                        {/* Comparison Info */}
                        <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border border-emerald-500/30 p-6 rounded-2xl flex gap-4 items-start">
                            <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-1" />
                            <p className="text-sm font-bold italic text-zinc-200">{analysis.comparison}</p>
                        </div>

                        {/* Reset Button */}
                        <button
                            onClick={() => {
                                setAnalysis(null);
                                setSupplementName("");
                                setProteinPerServing("");
                                setServingsPerPackage("");
                                setTotalPrice("");
                            }}
                            className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black py-3 rounded-xl uppercase tracking-widest text-[10px] transition-all"
                        >
                            Nova Análise
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
