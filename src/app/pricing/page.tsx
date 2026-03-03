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
        <div className="min-h-screen bg-[#F4F6F8] flex flex-col items-center py-20 px-6">
            <Link href="/dashboard" className="absolute top-8 left-8 text-zinc-500 hover:text-zinc-900 flex items-center gap-2 font-black transition">
                <ArrowLeft className="w-5 h-5" /> Voltar ao Painel
            </Link>

            <div className="text-center max-w-3xl mb-20">
                <h1 className="text-5xl md:text-7xl font-black text-zinc-900 tracking-tighter mb-6 uppercase italic">
                    POTENCIAL <span className="text-green-600">ILIMITADO</span>
                </h1>
                <p className="text-xl text-zinc-500 font-bold tracking-tight max-w-2xl mx-auto">
                    A ciência da performance por um valor simbólico. Escolha o plano Pro e desbloqueie o motor completo de evolução.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full mb-32">
                {PLANS.map((plan) => (
                    <motion.div
                        key={plan.name}
                        whileHover={{ y: -8 }}
                        className={`relative bg-white rounded-[3rem] p-10 border-2 transition-all shadow-sm ${plan.accent === 'green' ? 'border-green-500 shadow-xl shadow-green-50' : 'border-zinc-100'}`}
                    >
                        {plan.popular && (
                            <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.2em] px-6 py-2.5 rounded-full shadow-2xl">
                                Elite Choice
                            </div>
                        )}
                        <div className="mb-10">
                            <h3 className="text-2xl font-black text-zinc-900 mb-2 uppercase italic tracking-tight">{plan.name}</h3>
                            <div className="flex items-baseline gap-1">
                                <span className="text-5xl font-black text-zinc-900 tracking-tighter italic">{plan.price}</span>
                                {plan.period && <span className="text-xs text-zinc-400 font-black uppercase tracking-widest ml-1">{plan.period}</span>}
                            </div>
                            <p className="text-zinc-500 text-sm mt-6 font-bold leading-relaxed">{plan.description}</p>
                        </div>
                        <ul className="space-y-4 mb-12">
                            {plan.features.map((feat) => (
                                <li key={feat} className="flex items-center gap-3 text-sm font-black uppercase tracking-tighter text-zinc-700">
                                    <div className={`p-1.5 rounded-xl border ${plan.accent === 'green' ? 'bg-green-50 text-green-600 border-green-100' : 'bg-zinc-50 text-zinc-300 border-zinc-100'}`}>
                                        <Check className="w-4 h-4" />
                                    </div>
                                    {feat}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => plan.accent === 'green' ? router.push('/upgrade') : null}
                            className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all shadow-xl shadow-zinc-100 ${plan.accent === 'green'
                                ? 'bg-green-600 text-white hover:bg-green-700 shadow-green-200 active:scale-95'
                                : 'bg-zinc-100 text-zinc-300 cursor-default grayscale'
                                }`}
                        >
                            {plan.cta}
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* FAQ SECTION */}
            <div className="max-w-3xl w-full mb-32">
                <div className="text-center mb-16">
                    <HelpCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                    <h2 className="text-4xl font-black text-zinc-900 uppercase italic tracking-tight mb-4">Dúvidas Frequentes</h2>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Transparência total em cada etapa</p>
                </div>

                <div className="space-y-4">
                    {FAQS.map((faq, i) => (
                        <div key={i} className="bg-white rounded-3xl border border-zinc-100 overflow-hidden shadow-sm">
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full text-left p-8 flex items-center justify-between group transition-colors hover:bg-zinc-50"
                            >
                                <span className="text-zinc-950 font-black uppercase tracking-tighter text-lg">{faq.q}</span>
                                {openFaq === i ? <ChevronUp className="w-5 h-5 text-green-600" /> : <ChevronDown className="w-5 h-5 text-zinc-300 group-hover:text-zinc-900" />}
                            </button>
                            <AnimatePresence>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-8 pb-8"
                                    >
                                        <p className="text-zinc-500 font-medium leading-relaxed border-t border-zinc-50 pt-6">
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
            <div className="flex flex-wrap items-center justify-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Ativação Segura</span>
                </div>
                <div className="flex items-center gap-3">
                    <Lock className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Privacidade Total</span>
                </div>
                <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Protocolo de Estorno</span>
                </div>
            </div>
        </div>
    );
}
