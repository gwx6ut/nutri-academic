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
import SupplementAnalyzer from "./SupplementAnalyzer";

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
            { time: "Ceia", title: "Reparo Noturno", desc: "Proteína de lenta absorção (Caseína/Ovos) + Gorduras estruturais.", stats: "30g Prot | 10g Gordura" }
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
            { name: "Palatinose", info: "Energia de liberação gradual para endurance." },
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
        accent: "text-sky-500",
        bgAccent: "bg-sky-500",
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
        nutritionTitle: "Corte de Peso Tático",
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
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 sm:p-10 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl sm:text-2xl font-medium tracking-tight text-white mb-1">Rotina Perfeita</h3>
                    <p className="text-[10px] text-zinc-500 font-medium uppercase tracking-widest">Checklist de Performance Diária</p>
                </div>
                <LayoutList className={`w-6 h-6 sm:w-8 sm:h-8 ${accentColor}`} />
            </div>
            <div className="space-y-4">
                {habits.map((habit, i) => (
                    <motion.div
                        key={habit}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => toggle(habit)}
                        className={`flex items-center gap-4 p-5 rounded-2xl border cursor-pointer transition-all ${completed[habit] ? `bg-white/5 ${accentColor.replace('text', 'border')}` : 'bg-zinc-950/50 border-white/5 hover:border-white/10 hover:bg-zinc-900'}`}
                    >
                        {completed[habit] ? (
                            <CheckCircle2 className={`w-5 h-5 ${accentColor}`} />
                        ) : (
                            <Circle className="w-5 h-5 text-zinc-600" />
                        )}
                        <span className={`text-sm font-medium tracking-tight ${completed[habit] ? 'line-through opacity-40 text-zinc-500' : 'text-zinc-300'}`}>
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
        <main className="relative min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30 font-sans pb-24">

            {/* BOTÃO VOLTAR */}
            <div className="fixed top-8 left-8 z-[60] max-sm:left-4 max-sm:top-4">
                <Link href="/dashboard" className="flex items-center gap-3 bg-zinc-900/80 backdrop-blur-xl border border-white/5 px-5 py-3 rounded-xl hover:bg-zinc-800 transition-all group shadow-2xl">
                    <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                    <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-400 group-hover:text-white transition-colors max-sm:hidden">Retornar ao Painel</span>
                </Link>
            </div>

            {/* HERO SECTION */}
            <section className="relative h-[75vh] flex flex-col items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedSport}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.4, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src="/whisk-hero.jpeg"
                            alt="NutriAcademic Lab"
                            fill
                            className="object-cover object-center grayscale-[80%] opacity-40 mix-blend-luminosity"
                            priority
                        />
                    </motion.div>
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>

                {/* Emerald Background Glow */}
                <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-[100%] blur-[120px] pointer-events-none" />

                <div className="z-10 text-center px-4 sm:px-6 max-w-5xl mt-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-8 backdrop-blur-md"
                    >
                        <Crown className="w-4 h-4 text-emerald-400" />
                        <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-emerald-400">Nutrição Esportiva Avançada</span>
                    </motion.div>

                    <motion.h1
                        layout
                        className="text-5xl sm:text-7xl md:text-8xl font-medium tracking-tight leading-[1] mb-12 text-white"
                    >
                        Protocolos de <br />
                        <span className={`bg-gradient-to-r ${currentSport.accent === 'text-emerald-500' ? 'from-emerald-400 to-teal-500' : 'from-white to-zinc-400'} bg-clip-text text-transparent italic`}>
                            {currentSport.label}
                        </span>
                    </motion.h1>

                    {/* SELECTOR DE ESPORTE */}
                    <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-3 sm:gap-4 mb-8 w-full max-w-3xl mx-auto">
                        {Object.values(SPORTS_DATA).map((sport) => (
                            <button
                                key={sport.id}
                                onClick={() => setSelectedSport(sport.id as any)}
                                className={`px-4 sm:px-6 py-3 rounded-2xl border transition-all flex items-center justify-center gap-2 font-medium text-sm tracking-tight min-h-[48px] shadow-sm backdrop-blur-sm ${selectedSport === sport.id ? `${sport.accent.replace('text', 'border')} bg-zinc-900 border-white/20 text-white scale-[1.02]` : 'border-white/5 bg-zinc-900/40 text-zinc-500 hover:border-white/10 hover:bg-zinc-800 hover:text-zinc-300'}`}
                            >
                                <sport.icon className={`w-4 h-4 shrink-0 transition-colors ${selectedSport === sport.id ? sport.accent : 'text-zinc-500'}`} />
                                <span>{sport.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* CONTENT GRID */}
            <section className="px-4 sm:px-6 max-w-7xl mx-auto relative z-10">
                {!isPro && !loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 flex items-start justify-center px-4 sm:px-6 mt-10"
                    >
                        <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-xl rounded-[3rem]"></div>
                        <div className="relative z-10 max-w-xl w-full bg-zinc-900 border border-white/10 p-8 sm:p-12 rounded-[2rem] text-center shadow-2xl mt-20">
                            <div className="bg-emerald-500/10 p-6 rounded-2xl w-fit mx-auto mb-8 border border-emerald-500/20">
                                <Lock className="w-10 h-10 text-emerald-400" />
                            </div>
                            <h2 className="text-3xl font-medium tracking-tight text-white mb-4">Acesso PRO Necessário</h2>
                            <p className="text-zinc-400 text-sm leading-relaxed mb-10">
                                O laboratório de performance avançada e análise científica esportiva é exclusivo para assinantes. Eleve seu jogo para o nível profissional.
                            </p>
                            <Link href="/pricing" className="bg-white text-zinc-950 font-semibold px-8 py-4 rounded-xl text-sm transition-all hover:bg-zinc-200 flex items-center justify-center gap-3 w-full shadow-lg">
                                Desbloquear Performance <Crown className="w-4 h-4" />
                            </Link>
                        </div>
                    </motion.div>
                )}

                <div className={`grid grid-cols-1 xl:grid-cols-3 gap-6 sm:gap-8 transition-all duration-700 ${!isPro && !loading ? 'blur-md pointer-events-none select-none opacity-50' : ''}`}>

                    <div className="xl:col-span-2 space-y-8">
                        {/* PROTOCOLO NUTRICIONAL */}
                        <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 sm:p-10 backdrop-blur-xl relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 p-10 opacity-[0.03] transition-opacity group-hover:opacity-5 ${currentSport.accent}`}><Zap className="w-48 h-48" /></div>
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6 relative z-10 w-full">
                                <div className="flex-1 w-full">
                                    <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">{currentSport.nutritionTitle}</h2>
                                    <p className="text-sm text-zinc-400 font-medium mt-2 leading-relaxed max-w-lg">{currentSport.nutritionDesc}</p>
                                </div>
                                <div className={`w-14 h-14 shrink-0 bg-zinc-950 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner`}>
                                    <Target className={`w-6 h-6 ${currentSport.accent}`} />
                                </div>
                            </div>

                            <div className="space-y-4 relative z-10">
                                {currentSport.protocol.map((step, idx) => (
                                    <motion.div
                                        key={idx}
                                        layout
                                        className="bg-zinc-950/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 hover:bg-zinc-900/80 transition-all flex flex-col md:flex-row gap-6 items-start relative overflow-hidden"
                                    >
                                        <div className="flex flex-col gap-2 shrink-0 md:w-48">
                                            <span className={`text-[9px] font-semibold text-zinc-400 uppercase tracking-widest`}>{step.time}</span>
                                            <h4 className="text-lg font-medium text-white tracking-tight">{step.title}</h4>
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <p className="text-sm text-zinc-400 leading-relaxed font-normal">{step.desc}</p>
                                            <div className={`flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest ${currentSport.accent} bg-white/5 px-3 py-2 rounded-lg w-fit`}>
                                                <Zap className="w-3 h-3 shrink-0" />
                                                <span className="leading-none pt-0.5">{step.stats}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* PROTOCOLO DE TREINO ESPECÍFICO */}
                        <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 sm:p-10 backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <Activity className={`w-5 h-5 ${currentSport.accent}`} />
                                <h3 className="text-xl font-medium tracking-tight text-white">Dinâmica de Treino</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {currentSport.workout.map((w, i) => (
                                    <div key={i} className="p-6 bg-zinc-950/50 border border-white/5 rounded-2xl hover:bg-zinc-900 transition-all">
                                        <h4 className={`text-[10px] font-semibold uppercase tracking-widest mb-2 ${currentSport.accent}`}>{w.title}</h4>
                                        <p className="text-sm text-zinc-400 leading-relaxed font-normal">{w.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ANÁLISE DE SUPLEMENTOS */}
                        <SupplementAnalyzer accentColor={currentSport.accent} bgAccent={currentSport.bgAccent} />
                    </div>

                    <div className="space-y-8">
                        {/* TACTICAL GRID ESPECÍFICO */}
                        <TacticalGrid habits={currentSport.grid} accentColor={currentSport.accent} bgAccent={currentSport.bgAccent} />

                        {/* SUPLEMENTAÇÃO */}
                        <div className="bg-zinc-900/50 border border-white/5 rounded-[2rem] p-8 sm:p-10 backdrop-blur-xl">
                            <div className="flex items-center gap-3 mb-8">
                                <Microscope className={`w-5 h-5 ${currentSport.accent}`} />
                                <h3 className="text-xl font-medium tracking-tight text-white">Ergogênicos</h3>
                            </div>
                            <div className="space-y-4">
                                {currentSport.supps.map((s, i) => (
                                    <div key={i} className="flex gap-4 items-start bg-zinc-950/50 p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
                                        <div className={`w-1.5 h-1.5 rounded-full ${currentSport.bgAccent} mt-2 shrink-0 shadow-[0_0_8px_rgba(255,255,255,0.2)]`}></div>
                                        <div>
                                            <p className="text-sm font-medium text-white mb-1 tracking-tight">{s.name}</p>
                                            <p className="text-xs text-zinc-500 leading-relaxed font-normal">{s.info}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INSIGHTS NEURAIS */}
                        <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-white/10 rounded-[2rem] p-8 sm:p-10 relative overflow-hidden shadow-xl">
                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <Brain className="w-5 h-5 text-purple-400" />
                                <h3 className="text-xl font-medium tracking-tight text-white">Biomecânica</h3>
                            </div>
                            <div className="space-y-6 relative z-10">
                                <p className="text-sm text-zinc-400 leading-relaxed font-normal border-l-2 border-purple-500/20 pl-4 py-1">
                                    "{currentSport.description}"
                                </p>
                                <p className="text-[9px] font-semibold text-emerald-400 tracking-widest uppercase flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Sincronizado
                                </p>
                            </div>
                            <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-purple-500/5 rounded-[100%] blur-[80px] pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 px-6 border-t border-white/5 mt-24">
                <div className="max-w-7xl mx-auto flex flex-col items-center justify-center text-center">
                    <div className="flex items-center gap-3 mb-4">
                        <Activity className="text-emerald-500 w-5 h-5" />
                        <span className="text-lg font-medium tracking-tight text-white flex items-center gap-1">Nutri<span className="text-zinc-500">Academic</span></span>
                    </div>
                    <p className="text-xs text-zinc-600">Alta Performance Decodificada. © {new Date().getFullYear()}</p>
                </div>
            </footer>

        </main>
    );
}
