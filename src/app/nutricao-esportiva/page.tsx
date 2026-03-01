"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity, Zap, Target, Brain, ArrowLeft,
    Crown, Flame, ChevronRight, Calculator,
    Dna, Microscope, Trophy, Info, Lock, ArrowUpRight,
    Dumbbell, Footprints, Sword, CheckCircle2, Circle, LayoutList
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/client";

// --- DATA STRUCTURES ---

const SPORTS_DATA = {
    bodybuilding: {
        id: "bodybuilding",
        label: "Bodybuilding",
        icon: Dumbbell,
        accent: "text-emerald-500",
        bgAccent: "bg-emerald-500",
        description: "Maximização de hipertrofia e densidade muscular via tensão mecânica e estresse metabólico.",
        nutritionTitle: "Protocolo Hipertrófico",
        nutritionDesc: "Foco em superavit calórico e timing proteico para reparo tecidual.",
        protocol: [
            { time: "Pré-Treino", title: "Carga de Glicogênio", desc: "Carboidratos de baixo IG + 5g Creatina. Objetivo: Saturação intracelular.", stats: "1.0g Carb/kg" },
            { time: "Pós-Treino", title: "Janela Anabólica", desc: "Whey Isolado + Carboidratos rápidos. Disparo de insulina para transporte de aminoácidos.", stats: "40g Prot | 60g Carbs" },
            { time: "Ceia", title: "Reparo Noturno", desc: "Proteína de lenta absorção (Caseína/Ovos) + Gorduras boas.", stats: "30g Prot | 10g Gordura" }
        ],
        supps: [
            { name: "Creatina", info: "O suplemento mais estudado. Aumenta força explosiva." },
            { name: "Beta-Alanina", info: "Tamponamento de pH. Permite mais repetições até a falha." },
            { name: "BCAA/EAA", info: "Sinalização de mTOR durante o treino." }
        ],
        workout: [
            { title: "Periodização", desc: "Microciclos de Força (3-5 reps) e Hipertrofia (8-12 reps)." },
            { title: "Técnicas de Intensidade", desc: "Drop-sets, Rest-pause e Excêntricas lentas." }
        ],
        grid: ["Bater meta proteica", "Sono > 7h (Reparo)", "Progressão de Carga", "Alongamento de Fáscia"]
    },
    crossfit: {
        id: "crossfit",
        label: "Crossfit",
        icon: Target,
        accent: "text-orange-500",
        bgAccent: "bg-orange-500",
        description: "Desenvolvimento de potência, explosão e resistência cardiovascular em alta intensidade.",
        nutritionTitle: "Fueling de Performance",
        nutritionDesc: "Equilíbrio de macros para sustentar WODs intensos sem depleção.",
        protocol: [
            { time: "Pré-WOD", title: "Energia Explosiva", desc: "Carbs rápidos (Frutas/Palatinose) + Eletrólitos.", stats: "40g Carbs | 500mg Sódio" },
            { time: "Pós-WOD", title: "Recuperação Glicêmica", desc: "Reposição imediata de glicogênio + BCAA.", stats: "0.8g Carb/kg | 5g BCAA" },
            { time: "Dia Todo", title: "Hidratação Isotônica", desc: "Manter balanço hidroeletrolítico para evitar cãibras.", stats: "40ml/kg + Adição de Sais" }
        ],
        supps: [
            { name: "Palatinose", info: "Energia de liberação gradual para endurace." },
            { name: "Ômega 3", info: "Ação anti-inflamatória sistêmica pós-impacto." },
            { name: "Magnésio", info: "Recuperação neural e relaxamento muscular." }
        ],
        workout: [
            { title: "Work Capacity", desc: "AMRAPs e EMOMs para expandir o limiar de lactato." },
            { title: "Skills Médias", desc: "Foco em mobilidade de ombro e estabilidade de core." }
        ],
        grid: ["WOD Concluído", "Mobility de 15min", "Hidratação +3L", "Vitamina C/D"]
    },
    corrida: {
        id: "corrida",
        label: "Running",
        icon: Footprints,
        accent: "text-[#CCFF00]",
        bgAccent: "bg-[#CCFF00]",
        description: "Eficiência aeróbica, economia de corrida e resiliência metabólica de longa distância.",
        nutritionTitle: "Oxidação de Gordura",
        nutritionDesc: "Estratégias de 'Train Low' e 'Race High' para flexibilidade metabólica.",
        protocol: [
            { time: "Intra-Corrida", title: "Manutenção de Ritmo", desc: "Géis de carboidrato a cada 45min em treinos longos.", stats: "30-60g Carbs/hora" },
            { time: "Pós-Corrida", title: "Reprogramação Térmica", desc: "Antioxidantes + Reposição hídrica volumosa.", stats: "1.5L para cada kg perdido" },
            { time: "Diário", title: "Aporte de Ferro", desc: "Foco em micronutrientes para transporte de oxigênio.", stats: "Saturação de Ferritina" }
        ],
        supps: [
            { name: "Géis de Carb", info: "Mix de glicose/frutose (2:1) para absorção intestinal máxima." },
            { name: "Nitrato de Beterraba", info: "Melhora a eficiência do O2 e vasodilatação." },
            { name: "Colágeno UC-II", info: "Proteção de cartilagens e ligamentos de impacto." }
        ],
        workout: [
            { title: "Zonas de Frequência", desc: "80% Zone 2 (Base) e 20% Zone 4/5 (Intervalados)." },
            { title: "Fortalecimento", desc: "Treino de força reativa (pliometria) para economia." }
        ],
        grid: ["Meta de KM do dia", "Liberação Miofascial", "Refeição Pré-Longão", "Drenagem Linfática"]
    },
    lutas: {
        id: "lutas",
        label: "Combat Sports",
        icon: Sword,
        accent: "text-red-500",
        bgAccent: "bg-red-500",
        description: "Potência explosiva, controle de peso e recuperação rápida entre rounds.",
        nutritionTitle: "Tactical Weight Cutting",
        nutritionDesc: "Protocolos para manter força enquanto ajusta o peso para a categoria.",
        protocol: [
            { time: "Manhã", title: "Corte Gradual", desc: "Dieta hiperproteica com baixo carboidrato (se em fase de corte).", stats: "2.5g Prot/kg" },
            { time: "Janela de Treino", title: "Reserva Glicolítica", desc: "Carbs concentrados apenas no período de treino intenso.", stats: "Timing Restrito" },
            { time: "Recuperação", title: "Suporte Neural", desc: "Aporte de gorduras para proteção cerebral/hormonal.", stats: "Omega 3 Ultra-Dose" }
        ],
        supps: [
            { name: "Cafeína", info: "Aumenta o tempo de reação e percepção de esforço." },
            { name: "Eletrólitos", info: "Prevenção de desidratação severa em treinos térmicos." },
            { name: "Adaptógenos", info: "Ashwagandha para controle do cortisol competitivo." }
        ],
        workout: [
            { title: "Explosão Sprints", desc: "Sprints curtos (6-10s) com descanso longo (foco em ATP-CP)." },
            { title: "Treino Isométrico", desc: "Manutenção de pegada e força estática para grappling." }
        ],
        grid: ["Treino Técnico (Mat)", "Controle de Peso", "Refeição Anti-Cortisol", "Estudo de Vídeo"]
    }
};

// --- COMPONENTS ---

const TacticalGrid = ({ habits, accentColor, bgAccent }: { habits: string[], accentColor: string, bgAccent: string }) => {
    const [completed, setCompleted] = useState<Record<string, boolean>>({});

    const toggle = (habit: string) => {
        setCompleted(prev => ({ ...prev, [habit]: !prev[habit] }));
    };

    return (
        <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-10 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-black italic uppercase">Tactical Grid</h3>
                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-1 italic">Checklist de Performance Diária</p>
                </div>
                <LayoutList className={`w-8 h-8 ${accentColor}`} />
            </div>
            <div className="space-y-4">
                {habits.map((habit, i) => (
                    <motion.div
                        key={habit}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => toggle(habit)}
                        className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${completed[habit] ? `bg-white/5 ${accentColor.replace('text', 'border')}` : 'bg-black/20 border-white/5 hover:border-white/10'}`}
                    >
                        {completed[habit] ? (
                            <CheckCircle2 className={`w-5 h-5 ${accentColor}`} />
                        ) : (
                            <Circle className="w-5 h-5 text-zinc-700" />
                        )}
                        <span className={`text-xs font-black uppercase italic tracking-tighter ${completed[habit] ? 'line-through opacity-30' : 'text-zinc-300'}`}>
                            {habit}
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default function SportsNutritionPage() {
    const [isPro, setIsPro] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedSport, setSelectedSport] = useState<keyof typeof SPORTS_DATA>("bodybuilding");
    const supabase = createClient();

    const currentSport = SPORTS_DATA[selectedSport];

    useEffect(() => {
        const checkPlan = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setLoading(false);
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("plan_type, is_admin")
                .eq("id", user.id)
                .single();

            if (profile) {
                setIsPro(profile.plan_type === 'pro' || profile.is_admin);
            }
            setLoading(false);
        };
        checkPlan();
    }, [supabase]);

    return (
        <main className="relative min-h-screen bg-[#050505] text-white selection:bg-[#CCFF00] selection:text-black font-sans pb-20">

            {/* BOTÃO VOLTAR */}
            <div className="fixed top-8 left-8 z-[60]">
                <Link href="/dashboard" className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl hover:bg-zinc-800 transition-all group shadow-2xl">
                    <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-[#CCFF00] transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors">Voltar ao Painel</span>
                </Link>
            </div>

            {/* HERO SECTION */}
            <section className="relative h-[80vh] flex flex-col items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedSport}
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 0.3, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1 }}
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src="/whisk-hero.jpeg"
                            alt="NutriAcademic Lab"
                            fill
                            className="object-cover object-center grayscale-[50%]"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505]"></div>

                <div className="z-10 text-center px-6 max-w-5xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-full mb-8"
                    >
                        <Crown className="w-4 h-4 text-[#CCFF00]" />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[#CCFF00]">Módulo de Elite Pro Alpha</span>
                    </motion.div>

                    <motion.h1
                        layout
                        className="text-6xl md:text-9xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8"
                    >
                        SPORTS <br />
                        <span className={`bg-gradient-to-r ${currentSport.accent === 'text-[#CCFF00]' ? 'from-[#CCFF00] to-[#4A7A00]' : 'from-white to-zinc-500'} bg-clip-text text-transparent italic`}>
                            {currentSport.label}
                        </span>
                    </motion.h1>

                    {/* SELECTOR DE ESPORTE */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {Object.values(SPORTS_DATA).map((sport) => (
                            <button
                                key={sport.id}
                                onClick={() => setSelectedSport(sport.id as any)}
                                className={`px-6 py-3 rounded-2xl border-2 transition-all flex items-center gap-3 font-black text-[10px] uppercase tracking-widest ${selectedSport === sport.id ? `${sport.accent.replace('text', 'border')} bg-white text-black` : 'border-white/5 bg-zinc-900/50 text-zinc-500 hover:border-white/10'}`}
                            >
                                <sport.icon className={`w-4 h-4 ${selectedSport === sport.id ? 'text-black' : sport.accent}`} />
                                {sport.label}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTENT GRID */}
            <section className="px-6 max-w-7xl mx-auto relative">
                {!isPro && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 flex items-center justify-center px-6 -top-20"
                    >
                        <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur-xl"></div>
                        <div className="relative z-10 max-w-2xl w-full bg-zinc-900/80 border border-white/10 p-12 md:p-20 rounded-[4rem] text-center shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
                            <div className="bg-[#CCFF00]/10 p-8 rounded-[2rem] w-fit mx-auto mb-12 border border-[#CCFF00]/20">
                                <Lock className="w-16 h-16 text-[#CCFF00]" />
                            </div>
                            <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-6 leading-none">Acesso <br /> Restrito</h2>
                            <p className="text-zinc-500 text-xl font-bold italic max-w-md mx-auto leading-relaxed mb-16">
                                O laboratório de performance avançada é exclusivo para membros Pro Alpha. Escolha seu caminho de elite.
                            </p>
                            <Link href="/pricing" className="bg-[#CCFF00] text-black font-black px-12 py-6 rounded-2xl text-[10px] uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 mx-auto w-fit">
                                Migrar para Pro Alpha <Crown className="w-5 h-5" />
                            </Link>
                        </div>
                    </motion.div>
                )}

                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-10 transition-all duration-700 ${!isPro && !loading ? 'blur-2xl pointer-events-none' : ''}`}>

                    <div className="lg:col-span-2 space-y-10">
                        {/* PROTOCOLO NUTRICIONAL */}
                        <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-10 backdrop-blur-sm relative overflow-hidden">
                            <div className={`absolute top-0 right-0 p-10 opacity-5 ${currentSport.accent}`}><Zap className="w-48 h-48" /></div>
                            <div className="flex items-center justify-between mb-12 relative z-10">
                                <div>
                                    <h2 className="text-3xl font-black italic uppercase">{currentSport.nutritionTitle}</h2>
                                    <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest mt-2 italic">{currentSport.nutritionDesc}</p>
                                </div>
                                <div className={`w-12 h-12 ${currentSport.bgAccent} rounded-2xl flex items-center justify-center text-black`}>
                                    <Target className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="space-y-6 relative z-10">
                                {currentSport.protocol.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        layout
                                        className="bg-black/40 border border-white/5 p-8 rounded-3xl hover:border-white/20 transition-all flex flex-col md:flex-row gap-8 items-start group"
                                    >
                                        <div className="flex flex-col gap-2 shrink-0">
                                            <span className={`text-[9px] font-black ${currentSport.accent} border ${currentSport.accent.replace('text', 'border')}/30 px-3 py-1 rounded-full w-fit uppercase tracking-widest`}>{step.time}</span>
                                            <h4 className="text-xl font-black italic uppercase mt-2">{step.title}</h4>
                                        </div>
                                        <div className="space-y-4">
                                            <p className="text-sm text-zinc-400 font-medium italic leading-relaxed">{step.desc}</p>
                                            <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${currentSport.accent}`}>
                                                <Zap className="w-3 h-3" /> {step.stats}
                                                <button className="ml-4 p-1 rounded-md bg-white/5 text-zinc-600 hover:text-white transition-colors"><Info className="w-3 h-3" /></button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* PROTOCOLO DE TREINO ESPECÍFICO */}
                        <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-10 backdrop-blur-sm relative overflow-hidden">
                            <div className="flex items-center gap-4 mb-10">
                                <Activity className={`w-6 h-6 ${currentSport.accent}`} />
                                <h3 className="text-2xl font-black italic uppercase">Engenharia de Treino</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {currentSport.workout.map((w, i) => (
                                    <div key={i} className="p-8 bg-black/40 border border-white/5 rounded-[2.5rem] group hover:bg-zinc-800/50 transition-all">
                                        <h4 className={`text-sm font-black uppercase tracking-widest mb-4 ${currentSport.accent}`}>{w.title}</h4>
                                        <p className="text-sm font-bold italic text-zinc-400 leading-tight">{w.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        {/* TACTICAL GRID ESPECÍFICO */}
                        <TacticalGrid habits={currentSport.grid} accentColor={currentSport.accent} bgAccent={currentSport.bgAccent} />

                        {/* SUPLEMENTAÇÃO */}
                        <div className="bg-zinc-900/30 border border-white/5 rounded-[3rem] p-10 backdrop-blur-sm">
                            <div className="flex items-center gap-4 mb-8">
                                <Microscope className="w-6 h-6 text-emerald-500" />
                                <h3 className="text-xl font-black italic uppercase">Suplementos</h3>
                            </div>
                            <div className="space-y-6">
                                {currentSport.supps.map((s, i) => (
                                    <div key={i} className="flex gap-4 items-start group">
                                        <div className={`w-1.5 h-1.5 rounded-full ${currentSport.bgAccent} mt-2 shrink-0 group-hover:scale-150 transition-all`}></div>
                                        <div>
                                            <p className="text-xs font-black uppercase text-white mb-1 group-hover:text-primary transition-colors">{s.name}</p>
                                            <p className="text-[10px] text-zinc-500 leading-relaxed italic">{s.info}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INSIGHTS NEURAIS */}
                        <div className="bg-gradient-to-br from-zinc-900 to-black border border-white/10 rounded-[3rem] p-10 relative overflow-hidden">
                            <div className="flex items-center gap-3 mb-6">
                                <Brain className="w-5 h-5 text-purple-500" />
                                <h3 className="text-lg font-black italic uppercase">Physio Insight</h3>
                            </div>
                            <div className="space-y-4">
                                <p className="text-[11px] text-zinc-400 leading-relaxed italic border-l-2 border-purple-500/30 pl-4 py-1">
                                    "{currentSport.description}"
                                </p>
                                <p className="text-[9px] text-[#CCFF00] font-black uppercase tracking-widest animate-pulse">Alpha Brain Connection: Active</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-20 px-6 border-t border-white/5 bg-black mt-20">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-4">
                        <Activity className="text-[#CCFF00] w-8 h-8" />
                        <span className="text-2xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-[#CCFF00] to-[#4A7A00] bg-clip-text text-transparent">NutriAcademic Lab</span>
                    </div>
                </div>
            </footer>

            <style jsx global>{`
                .italic { font-style: italic; }
            `}</style>
        </main>
    );
}
