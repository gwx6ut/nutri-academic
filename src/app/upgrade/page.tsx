"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Copy, Check, ArrowLeft, Send, Crown, ShieldCheck,
    Zap, Star, Users, Trophy, ChevronRight, Lock, Activity
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function UpgradePage() {
    const PIX_CODE = "00020101021126570014br.gov.bcb.pix0114+55119877631650217NutriAcademicSaas520400005303986540510.005802BR5921GUILHERME DOS S SILVA6009SAO PAULO62070503***6304F336";
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    const handleCopy = () => {
        navigator.clipboard.writeText(PIX_CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const submitPaymentRequest = async () => {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            router.push("/login");
            return;
        }

        try {
            await supabase.from('payment_requests').insert({
                user_id: user.id,
                user_email: user.email,
                status: 'pending'
            });
            setSuccess(true);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-[#CCFF00] selection:text-black font-sans flex flex-col lg:flex-row overflow-hidden">

            {/* BACKGROUND DECORATION */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#CCFF00]/10 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]"></div>
            </div>

            {/* BOTÃO VOLTAR */}
            <div className="fixed top-8 left-8 z-[60]">
                <Link href="/dashboard" className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl hover:bg-zinc-800 transition-all group shadow-2xl">
                    <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-[#CCFF00] transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Abortar Upgrade</span>
                </Link>
            </div>

            {/* LEFT SIDE: VALUE PROPOSITION */}
            <section className="flex-1 relative z-10 flex flex-col justify-center px-10 py-20 lg:px-24">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-full mb-8">
                        <Crown className="w-4 h-4 text-[#CCFF00]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#CCFF00]">Otimização Metabólica Máxima</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.9] tracking-tighter mb-8">
                        A ERA DO <br />
                        <span className="bg-gradient-to-r from-[#CCFF00] to-[#4A7A00] bg-clip-text text-transparent italic">ALPHA PRO</span>
                    </h1>

                    <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-lg italic mb-12 leading-relaxed">
                        Você não está comprando um app. Está injetando engenharia biológica na sua rotina. Chega de suposições. Comece a performar.
                    </p>

                    <div className="space-y-6 mb-16">
                        {[
                            { icon: Zap, text: "Nutrição Esportiva: Protocolos de Elite desbloqueados." },
                            { icon: Trophy, text: "The Grid: Habit Tracker completo sem limitações." },
                            { icon: Activity, text: "Biofeedback: Ativação do Neural Index Alpha." },
                            { icon: Lock, text: "Acesso Prioritário: Suporte tático 24/7." }
                        ].map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 + (idx * 0.1) }}
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:bg-[#CCFF00]/20 transition-all">
                                    <item.icon className="w-5 h-5 text-[#CCFF00]" />
                                </div>
                                <span className="text-sm font-bold uppercase italic tracking-tighter text-zinc-300 group-hover:text-white transition-colors">{item.text}</span>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="flex -space-x-3">
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050505] bg-zinc-800 flex items-center justify-center overflow-hidden">
                                    <Users className="w-4 h-4 text-zinc-500" />
                                </div>
                            ))}
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">+500 Atletas Alpha</p>
                            <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 text-[#CCFF00] fill-[#CCFF00]" />)}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* RIGHT SIDE: PAYMENT LAB */}
            <section className="lg:w-[500px] xl:w-[600px] bg-zinc-950/50 backdrop-blur-3xl border-l border-white/5 relative z-10 flex flex-col justify-center items-center p-10 lg:p-20">
                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="w-full max-w-sm text-center"
                        >
                            <div className="w-24 h-24 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-[2rem] mx-auto mb-8 flex items-center justify-center shadow-[0_0_50px_rgba(204,255,0,0.1)]">
                                <Check className="w-12 h-12 text-[#CCFF00]" />
                            </div>
                            <h2 className="text-4xl font-black italic uppercase tracking-tighter mb-4">Protocolo Ativado</h2>
                            <p className="text-zinc-500 text-lg font-bold italic mb-10 leading-relaxed">
                                Sua solicitação foi injetada no sistema. Assim que o PIX for validado, seu dashboard se transformará no **Modo Pro**.
                            </p>
                            <button
                                onClick={() => router.push('/dashboard')}
                                className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] py-6 rounded-2xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-2xl"
                            >
                                Voltar ao Painel Alpha <ChevronRight className="w-4 h-4" />
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="checkout"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="w-full max-w-sm"
                        >
                            {/* PIX CONTAINER */}
                            <div className="bg-zinc-900/50 border border-white/5 rounded-[3.5rem] p-10 shadow-2xl relative overflow-hidden group mb-10">
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Zap className="w-32 h-32" />
                                </div>

                                <div className="text-center mb-10">
                                    <p className="text-[10px] font-black text-[#CCFF00] uppercase tracking-[0.3em] mb-4">Escaneie para Ativar</p>
                                    <div className="bg-white p-4 rounded-[2.5rem] inline-block shadow-[0_0_40px_rgba(255,255,255,0.05)] hover:scale-105 transition-transform duration-500">
                                        <img
                                            src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=00020101021126570014br.gov.bcb.pix0114%2B55119877631650217NutriAcademicSaas520400005303986540510.005802BR5921GUILHERME%20DOS%20S%20SILVA6009SAO%20PAULO62070503***6304F336"
                                            alt="QR Code PIX"
                                            className="w-48 h-48 object-contain"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] text-center italic">Ou use a chave copia e cola</p>
                                    <div className="flex items-center gap-2 bg-black/60 border border-white/5 rounded-2xl p-4 overflow-hidden group/input">
                                        <input
                                            type="text"
                                            readOnly
                                            value={PIX_CODE}
                                            className="bg-transparent text-zinc-400 text-[10px] w-full outline-none font-mono tracking-tighter"
                                        />
                                        <button
                                            onClick={handleCopy}
                                            className="p-3 bg-zinc-800 h rounded-xl hover:bg-[#CCFF00] hover:text-black transition-all text-zinc-400 flex-shrink-0"
                                        >
                                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* PRICE BOX */}
                            <div className="flex justify-between items-center mb-10 px-4">
                                <div>
                                    <p className="text-xs font-black text-zinc-500 uppercase tracking-widest italic mb-1">Acesso Vitalício V6</p>
                                    <p className="text-3xl font-black italic uppercase tracking-tighter leading-none">R$ 10,00</p>
                                </div>
                                <div className="p-3 bg-zinc-900 border border-white/5 rounded-2xl">
                                    <ShieldCheck className="w-6 h-6 text-[#CCFF00]" />
                                </div>
                            </div>

                            <button
                                onClick={submitPaymentRequest}
                                disabled={loading}
                                className="w-full bg-[#CCFF00] text-black font-black uppercase tracking-[0.2em] text-[11px] py-6 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_50px_rgba(204,255,0,0.2)] disabled:opacity-50 flex items-center justify-center gap-3"
                            >
                                {loading ? "Processando..." : (
                                    <>Confirmar Pagamento <Send className="w-4 h-4" /></>
                                )}
                            </button>

                            <p className="text-[8px] font-black text-zinc-600 uppercase tracking-[0.2em] text-center mt-8">
                                <Lock className="inline w-2 h-2 mr-1" /> Conexão Segura AES-256 Protocolo
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

        </main>
    );
}
