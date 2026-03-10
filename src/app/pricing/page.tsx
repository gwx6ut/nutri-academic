"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, ArrowLeft, Crown, Zap, ShieldCheck, HelpCircle, ChevronDown, ChevronUp, Lock, CreditCard } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PLANS = [
    {
        name: "Plano Free",
        price: "R$ 0",
        description: "Para iniciantes que buscam organização básica.",
        features: [
            "Visualização de 2 Refeições/dia",
            "3 Hábitos Essenciais no The Grid",
            "Acesso ao Treino A",
            "Suporte via Comunidade",
        ],
        cta: "Plano Atual",
        active: true,
        accent: "zinc",
    },
    {
        name: "Plano Pro",
        price: "R$ 10",
        period: "/único",
        description: "Para quem busca alta performance e biohacking.",
        features: [
            "Cardápio Completo (8+ refeições)",
            "The Grid Ilimitado (10+ hábitos)",
            "Todos os Treinos (ABCDE + Cardio)",
            "Explicações Científicas das Refeições",
            "Antropometria Avançada",
            "Widget de Hidratação & Macros",
        ],
        cta: "Fazer Upgrade Agora",
        active: false,
        accent: "green",
        popular: true,
    }
];

const FAQS = [
    {
        q: "Como funciona a ativação do Plano Pro?",
        a: "Após realizar o PIX de R$10 e clicar em 'Confirmar Pagamento', nossa equipe administrativa valida a transação. Seu acesso Pro é liberado em poucos minutos diretamente no seu painel."
    },
    {
        q: "O pagamento é mensal ou único?",
        a: "O valor de R$10 é um pagamento único para acesso vitalício às funcionalidades atuais do Pro. Sem taxas escondidas ou assinaturas recorrentes."
    },
    {
        q: "É seguro pagar via PIX?",
        a: "Sim, utilizamos o sistema oficial do Banco Central. Além disso, todas as solicitações ficam registradas no nosso banco de dados vinculado ao seu e-mail para sua total segurança."
    },
    {
        q: "O que acontece se eu não gostar?",
        a: "Nossa meta é sua performance. Se por algum motivo você sentir que o app não é para você, entre em contato e faremos o estorno integral do valor."
    }
];

export default function PricingPage() {
    const router = useRouter();
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center py-20 px-6 relative overflow-hidden font-sans selection:bg-emerald-500/30">
            {/* Background Decorations */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/5 rounded-full blur-[100px]" />
            </div>

            <Link href="/dashboard" className="absolute top-8 left-8 z-50 flex items-center gap-3 bg-zinc-900/50 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl hover:bg-zinc-800 transition-all group shadow-2xl">
                <ArrowLeft className="w-5 h-5 text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">Voltar ao Console</span>
            </Link>

            <div className="text-center max-w-4xl mb-24 relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-10"
                >
                    <Crown className="w-4 h-4 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Upgrade Protocolo Alpha</span>
                </motion.div>
                <h1 className="text-6xl md:text-8xl font-medium tracking-tight text-white mb-8 leading-none">
                    Potencial <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 italic pr-4">Ilimitado.</span>
                </h1>
                <p className="text-xl text-zinc-500 font-bold tracking-wide max-w-2xl mx-auto leading-relaxed">
                    A ciência da performance por um valor simbólico. Escolha o protocolo Pro e desbloqueie o motor completo de evolução metabólica.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full mb-32 relative z-10">
                {PLANS.map((plan) => (
                    <motion.div
                        key={plan.name}
                        whileHover={{ y: -10 }}
                        className={`relative bg-zinc-900/40 backdrop-blur-3xl rounded-[4rem] p-12 border transition-all shadow-2xl overflow-hidden group ${plan.accent === 'green' ? 'border-emerald-500/30 shadow-emerald-500/5' : 'border-white/5'}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-[60px] rounded-full group-hover:bg-emerald-500/20 transition-all"></div>
                        )}

                        <div className="relative z-10 mb-12">
                            <div className="flex justify-between items-start mb-6">
                                <h3 className="text-3xl font-semibold text-white tracking-tight">{plan.name}</h3>
                                {plan.popular && (
                                    <span className="bg-emerald-500 text-zinc-950 text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full">Elite Choice</span>
                                )}
                            </div>
                            <div className="flex items-baseline gap-2">
                                <span className="text-7xl font-semibold text-white tracking-tighter">{plan.price}</span>
                                {plan.period && <span className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">{plan.period}</span>}
                            </div>
                            <p className="text-zinc-500 text-sm mt-8 font-bold leading-relaxed">{plan.description}</p>
                        </div>

                        <ul className="space-y-6 mb-16 relative z-10">
                            {plan.features.map((feat) => (
                                <li key={feat} className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                                    <div className={`p-2 rounded-xl border ${plan.accent === 'green' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/5 text-zinc-500 border-white/5'}`}>
                                        <Check className="w-4 h-4" />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>

                        <button
                            onClick={() => plan.accent === 'green' ? router.push('/upgrade') : null}
                            className={`w-full py-6 rounded-[2.5rem] font-bold uppercase tracking-[0.3em] text-[11px] transition-all relative z-10 ${plan.accent === 'green'
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-2xl shadow-emerald-500/20 hover:scale-[1.02] active:scale-95'
                                : 'bg-white/5 text-zinc-600 cursor-default border border-white/5'
                                }`}
                        >
                            {plan.cta}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* FAQ SECTION */}
            <div className="max-w-4xl w-full mb-32 relative z-10">
                <div className="text-center mb-20">
                    <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mx-auto mb-8 flex items-center justify-center">
                        <HelpCircle className="w-8 h-8 text-emerald-400" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight mb-6 leading-none">Dúvidas <span className="text-zinc-500 italic">Frequentes</span></h2>
                    <p className="text-zinc-600 font-bold uppercase tracking-[0.3em] text-[10px]">Transparência total em cada etapa do protocolo</p>
                </div>

                <div className="space-y-5">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="bg-zinc-900/40 backdrop-blur-2xl rounded-[2.5rem] border border-white/5 overflow-hidden transition-all hover:border-white/10">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full text-left p-10 flex items-center justify-between group transition-colors"
                            >
                                <span className="text-white font-semibold tracking-tight text-xl">{faq.q}</span>
                                {openFaq === i ? <ChevronUp className="w-6 h-6 text-emerald-400" /> : <ChevronDown className="w-6 h-6 text-zinc-700 group-hover:text-emerald-400 transition-all" />}
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-10 pb-10"
                                    >
                                        <p className="text-zinc-500 font-bold text-sm leading-relaxed border-t border-white/5 pt-8 tracking-wide">
                                            {faq.a}
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-16 opacity-30 group-hover:opacity-100 transition-opacity duration-1000 relative z-10">
                <div className="flex items-center gap-4">
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Ativação Segura</span>
                </div>
                <div className="flex items-center gap-4">
                    <Lock className="w-6 h-6 text-zinc-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Privacidade Total</span>
                </div>
                <div className="flex items-center gap-4">
                    <CreditCard className="w-6 h-6 text-emerald-400" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">Protocolo de Estorno</span>
                </div>
            </div>
        </div>
    );
}
