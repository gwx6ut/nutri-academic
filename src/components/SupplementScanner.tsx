"use client";

import { useState, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Upload, AlertTriangle, CheckCircle, Search, Sparkles, X, Crown, SearchCode } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function SupplementScanner({ isPro, userId }: { isPro: boolean, userId: string }) {
    const [imageStr, setImageStr] = useState<string | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [result, setResult] = useState<any | null>(null);
    const [errorMsg, setErrorMsg] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const supabase = createClient();

    const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset
        setResult(null);
        setErrorMsg("");

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageStr(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    const triggerScan = async () => {
        if (!imageStr) return;

        // Verifica limite (simulado para Free)
        if (!isPro) {
            const { data: profile } = await supabase.from('profiles').select('free_scans_used').eq('id', userId).single();
            if (profile && profile.free_scans_used >= 1) {
                setErrorMsg("Você atingiu o limite de 1 SCAN GRÁTIS do plano free. Faça upgrade para o Alpha Pro para scans ilimitados!");
                return;
            }
        }

        setIsScanning(true);
        setErrorMsg("");

        try {
            const res = await fetch("/api/scan-supplement", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageBase64: imageStr, userId, isPro })
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao conectar com servidor");
            }

            setResult(data);

            // Se for hit sucesso e não for pró, desconta o scan grátis
            if (!isPro) {
                const { error: rpcError } = await supabase.rpc('increment_scan_usage', { user_id: userId });
                if (rpcError) {
                    // Fallback se a RPC não existir
                    const { data: p } = await supabase.from('profiles').select('free_scans_used').eq('id', userId).single();
                    if (p) {
                        await supabase.from('profiles').update({ free_scans_used: (p.free_scans_used || 0) + 1 }).eq('id', userId);
                    }
                }
            }

        } catch (err: any) {
            setErrorMsg(err.message);
        } finally {
            setIsScanning(false);
        }
    };

    const reset = () => {
        setImageStr(null);
        setResult(null);
        setErrorMsg("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    return (
        <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-10 backdrop-blur-sm relative overflow-hidden h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black italic uppercase items-center flex gap-3">
                        Detector <span className="text-[#CCFF00]">AI</span>
                    </h2>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2 italic">Descubra se seu Whey é puro açúcar em 3 segundos.</p>
                </div>
                <div className="w-12 h-12 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-2xl flex items-center justify-center text-[#CCFF00]">
                    <SearchCode className="w-6 h-6" />
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">

                {/* STATE 1: UPLOAD */}
                {!imageStr && !isScanning && !result && (
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex-1 border-2 border-dashed border-zinc-700 rounded-[2rem] flex flex-col items-center justify-center hover:bg-zinc-800/50 hover:border-white/20 transition-all cursor-pointer group"
                    >
                        <div className="bg-black p-6 rounded-full group-hover:scale-110 transition-transform mb-6">
                            <Camera className="w-10 h-10 text-zinc-400 group-hover:text-white" />
                        </div>
                        <h4 className="text-xl font-black uppercase text-white mb-2 text-center">Tire Foto da Tabela</h4>
                        <p className="text-sm font-bold text-zinc-500 text-center px-4">Faça upload da tabela nutricional do pote.</p>

                        {!isPro && (
                            <div className="mt-8 px-4 py-2 bg-white/5 rounded-full inline-flex items-center gap-2 border border-white/10">
                                <Sparkles className="w-3 h-3 text-yellow-500" />
                                <span className="text-[9px] font-black uppercase tracking-widest text-zinc-400">Scan Grátis: 1 disponível</span>
                            </div>
                        )}
                    </div>
                )}

                {/* STATE 2: SCANNING / RESULT */}
                {imageStr && (
                    <div className="w-full flex flex-col items-center">
                        <div className="relative w-full max-w-[300px] h-[400px] rounded-3xl overflow-hidden shadow-2xl mb-8 group">
                            <img src={imageStr} className="w-full h-full object-cover" alt="Tabela Nutricional" />

                            {/* OVERLAY DE SCANNER */}
                            {isScanning && (
                                <>
                                    <div className="absolute inset-0 bg-black/50 blur-sm"></div>
                                    <motion.div
                                        initial={{ top: "0%" }}
                                        animate={{ top: ["0%", "100%", "0%"] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                                        className="absolute w-full h-1 bg-[#CCFF00] shadow-[0_0_20px_#CCFF00] z-20"
                                    ></motion.div>
                                    <div className="absolute inset-x-0 bottom-0 top-0 opacity-20 bg-[linear-gradient(transparent_50%,rgba(0,0,0,1)_50%)] bg-[length:100%_4px] bg-repeat-y z-10 pointer-events-none"></div>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center z-30">
                                        <SearchCode className="w-12 h-12 text-[#CCFF00] animate-pulse mb-4" />
                                        <p className="text-[#CCFF00] font-black uppercase tracking-widest text-xs animate-pulse">Alpha Engine Processing...</p>
                                    </div>
                                </>
                            )}

                            {!isScanning && (
                                <button onClick={reset} className="absolute top-4 right-4 bg-black/60 p-2 rounded-full backdrop-blur hover:bg-black/90 transition-all opacity-0 group-hover:opacity-100">
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            )}
                        </div>

                        {!isScanning && !result && !errorMsg && (
                            <button
                                onClick={triggerScan}
                                className="bg-white text-black font-black uppercase px-10 py-5 rounded-2xl tracking-[0.2em] text-sm hover:scale-105 transition-transform flex items-center gap-3 w-full sm:w-auto justify-center"
                            >
                                Analisar Produto <Search className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                )}

                {/* STATE 3: RESULTS UI */}
                {result && !isScanning && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="w-full"
                    >
                        <div className={`p-8 rounded-[2rem] border-2 text-center w-full relative overflow-hidden ${result.pureza >= 70 ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-red-900/20 border-red-500/30'}`}>
                            {result.pureza >= 70 ? (
                                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                            ) : (
                                <div className="absolute inset-0 bg-red-500/5 animate-[pulse_2s_ease-in-out_infinite]"></div>
                            )}

                            <h4 className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mb-1 italic">Veredito do Laboratório</h4>
                            <h3 className="text-2xl font-black uppercase mb-6">{result.produto}</h3>

                            <div className="flex justify-center flex-wrap gap-4 mb-8">
                                <div className="bg-black/40 px-6 py-4 rounded-2xl flex-1 min-w-[120px]">
                                    <p className="text-[9px] uppercase text-zinc-500 font-black tracking-widest">Proteína/Porção</p>
                                    <p className="text-xl font-black mt-1">{result.proteina_g}g</p>
                                    <p className="text-xs text-zinc-500 mt-1">em {result.porcao_g}g</p>
                                </div>
                                <div className="bg-black/40 px-6 py-4 rounded-2xl flex-1 min-w-[120px]">
                                    <p className="text-[9px] uppercase text-zinc-500 font-black tracking-widest">Índice de Pureza</p>
                                    <p className={`text-4xl font-black italic mt-1 ${result.pureza >= 70 ? 'text-emerald-500' : 'text-red-500'}`}>{result.pureza}%</p>
                                </div>
                            </div>

                            {result.pureza >= 70 ? (
                                <div className="flex items-center gap-4 bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 max-w-lg mx-auto">
                                    <CheckCircle className="w-8 h-8 text-emerald-500 shrink-0" />
                                    <div className="text-left">
                                        <p className="text-sm font-black uppercase text-emerald-500">Produto Alpha Aprovado</p>
                                        <p className="text-xs font-bold italic text-emerald-500/70 mt-1 leading-relaxed">Excelente margem de proteína real. Concentração adequada para construção de massa magna livre de sujeira.</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4 bg-red-500/10 p-5 rounded-2xl border border-red-500/20 max-w-lg mx-auto">
                                    <AlertTriangle className="w-10 h-10 text-red-500 shrink-0 animate-[bounce_1s_infinite]" />
                                    <div className="text-left">
                                        <p className="text-sm font-black uppercase text-red-500">Whey Fake/Enchimento</p>
                                        <p className="text-xs font-bold italic text-red-400 mt-1 leading-relaxed">Alto % de carboidrato ou amino spiking. Você está pagando caro por açúcar e pó inócuo. Evite compras futuras.</p>
                                    </div>
                                </div>
                            )}

                            <button onClick={reset} className="mt-8 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
                                Escanear outro produto
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* ERROR FEEDBACK */}
                {errorMsg && (
                    <div className="mt-6 w-full">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5 flex flex-col sm:flex-row gap-4 items-center sm:items-start text-center sm:text-left">
                            <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
                            <div>
                                <h4 className="text-red-500 font-black uppercase text-sm mb-1">Erro Tático</h4>
                                <p className="text-zinc-300 text-xs italic font-bold leading-relaxed">{errorMsg}</p>
                            </div>
                        </div>
                        {errorMsg.includes('upgrade') && (
                            <a href="/pricing" className="mt-4 bg-[#CCFF00] text-black w-full block text-center py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
                                Assinar Pro Alpha <Crown className="w-4 h-4" />
                            </a>
                        )}
                    </div>
                )}
            </div>

            <input
                type="file"
                accept="image/*"
                capture="environment"
                ref={fileInputRef}
                onChange={handleImageUpload}
                className="hidden"
            />
        </div>
    );
}
