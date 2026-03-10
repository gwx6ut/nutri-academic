"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Activity, ArrowUpRight, BookOpen, Brain, Calculator, CheckCircle2, ChevronRight, Circle, Crown, Droplets, Dumbbell, Flame, Heart, Info, LayoutList, Lock, LogOut, Minus, PieChart, Plus, Save, Scale, Settings, ShieldCheck, Target as TargetIcon, Trash2, Trophy, User, Users, Utensils, Waves, Zap, SearchCode
} from "lucide-react";
import { DIET_CATALOG, WORKOUTS, SIDEBAR_ITEMS, WaterWave } from "./constants";
import SupplementScanner from "@/components/SupplementScanner";

type Profile = {
    id: string;
    email?: string;
    plan_type: 'free' | 'pro';
    is_admin: boolean;
    weight?: string;
    height?: string;
    target_calories?: number | null;
    target_protein?: number | null;
    target_carbs?: number | null;
    target_fats?: number | null;
    mode?: 'cutting' | 'bulking';
    water_intake?: number;
};

type Habit = {
    id: number;
    task_name: string;
    is_completed: boolean;
};

type CustomMeal = {
    id: string;
    name: string;
    time: string;
    items: string;
    protein: number;
    carbs: number;
    fats: number;
    calories: number;
    mode: 'cutting' | 'bulking';
};


export default function DashboardPage() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [mode, setMode] = useState<'cutting' | 'bulking'>('cutting');
    const [selectedProfile, setSelectedProfile] = useState<'standard' | 'economical' | 'practical'>('standard');
    const [activeTab, setActiveTab] = useState<'overview' | 'dieta' | 'treinos' | 'grid' | 'scanner'>('overview');
    const [habits, setHabits] = useState<Habit[]>([]);
    const [waterIntake, setWaterIntake] = useState(0);

    const [weight, setWeight] = useState("");
    const [height, setHeight] = useState("");
    const [targetCalories, setTargetCalories] = useState<string>("");
    const [targetProtein, setTargetProtein] = useState<string>("");
    const [targetCarbs, setTargetCarbs] = useState<string>("");
    const [targetFats, setTargetFats] = useState<string>("");

    const [isSavingMetrics, setIsSavingMetrics] = useState(false);
    const [newTaskName, setNewTaskName] = useState("");
    const [showMealInfo, setShowMealInfo] = useState<number | null>(null);
    const [customMeals, setCustomMeals] = useState<CustomMeal[]>([]);
    const [isEditingDiet, setIsEditingDiet] = useState(false);
    const [isSavingDiet, setIsSavingDiet] = useState(false);
    const [isWaterSplashing, setIsWaterSplashing] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const supabase = createClient();
    const router = useRouter();

    // DERIVED VALUES (Moved up to prevent TDZ)
    const isPro = profile?.plan_type === 'pro' || profile?.is_admin;

    const currentSuggestions = selectedProfile === 'standard'
        ? (mode === 'cutting' ? DIET_CATALOG.standard.cutting : DIET_CATALOG.standard.bulking)
        : selectedProfile === 'economical'
            ? (mode === 'cutting' ? DIET_CATALOG.economical.cutting : DIET_CATALOG.economical.bulking)
            : (mode === 'cutting' ? DIET_CATALOG.practical.cutting : DIET_CATALOG.practical.bulking);

    const displaySuggestions = isPro ? currentSuggestions : currentSuggestions.slice(0, 2);

    const weightNum = parseFloat(weight);
    const hasMetrics = !isNaN(weightNum) && weightNum > 0;

    // Fallback/Auto-calc values
    const autoCalories = hasMetrics ? Math.round(weightNum * (mode === 'cutting' ? 26 : 38)) : 0;
    const autoProtein = Math.round(weightNum * 2.2) || 0;
    const autoFats = Math.round(weightNum * 0.8) || 0;
    const autoCarbs = Math.round((autoCalories - (autoProtein * 4) - (autoFats * 9)) / 4) || 0;

    // Actual values used in display (Manual override or Auto-calc)
    const finalCalories = parseInt(targetCalories) || autoCalories;
    const finalProtein = parseInt(targetProtein) || autoProtein;
    const finalCarbs = parseInt(targetCarbs) || autoCarbs;
    const finalFats = parseInt(targetFats) || autoFats;

    const completedCount = habits.filter(h => h.is_completed).length;
    const progressPerc = habits.length === 0 ? 0 : Math.round((completedCount / habits.length) * 100);

    const accentColor = mode === 'cutting' ? 'text-emerald-600' : 'text-orange-600';
    const accentBg = mode === 'cutting' ? 'bg-emerald-600' : 'bg-orange-600';
    const accentBorder = mode === 'cutting' ? 'border-emerald-600' : 'border-orange-600';
    const accentLightBg = mode === 'cutting' ? 'bg-emerald-50' : 'bg-orange-50';

    const waterGoal = 3000;
    const waterPerc = Math.min((waterIntake / waterGoal) * 100, 100);

    // Evaluation Engine Data
    const currentMeals = customMeals.filter(m => m.mode === mode);
    const useMeals = (currentMeals.length > 0 && !isEditingDiet) ? currentMeals : null;

    const totalDietMacros = (useMeals || currentSuggestions || []).reduce((acc, m: any) => ({
        p: acc.p + (m.protein || 0),
        c: acc.c + (m.carbs || 0),
        f: acc.f + (m.fats || 0),
        kcal: acc.kcal + (m.calories || 0)
    }), { p: 0, c: 0, f: 0, kcal: 0 });

    const getEvaluation = () => {
        const diffP = totalDietMacros.p - finalProtein;
        const diffKcal = totalDietMacros.kcal - finalCalories;

        const isAuto = !useMeals;
        const prefix = isAuto ? "[Auto] " : "";

        if (mode === 'bulking') {
            if (diffP < -10) return { score: 'Crítico', msg: `${prefix}Proteína insuficiente para anabolismo.`, color: 'text-red-500' };
            if (diffKcal < -150) return { score: 'Alerta', msg: `${prefix}Déficit detectado. Você não vai ganhar massa assim.`, color: 'text-orange-500' };
            if (Math.abs(diffP) < 30 && Math.abs(diffKcal) < 200) return { score: 'Alpha Performance', msg: `${prefix}Bulking limpo e otimizado!`, color: 'text-emerald-500' };
            if (diffKcal > 500) return { score: 'Sujeira', msg: `${prefix}Superávit muito alto. Ganho de gordura excessivo.`, color: 'text-orange-500' };
        } else {
            if (diffKcal > 100) return { score: 'Crítico', msg: `${prefix}Calorias acima do limite para Cutting.`, color: 'text-red-500' };
            if (diffP < -15) return { score: 'Alerta', msg: `${prefix}Proteína baixa. Risco de perda muscular.`, color: 'text-orange-500' };
            if (Math.abs(diffKcal) < 150 && diffP >= -5) return { score: 'Alpha Performance', msg: `${prefix}Cutting perfeito e seguro!`, color: 'text-emerald-500' };
        }
        return { score: 'Ajustável', msg: `${prefix}Bons alimentos, ajuste as porções para seus macros.`, color: 'text-yellow-500' };
    };

    const getDietInsights = () => {
        const insights = [];
        const diffP = finalProtein - totalDietMacros.p;
        const diffC = finalCarbs - totalDietMacros.c;
        const diffKcal = finalCalories - totalDietMacros.kcal;

        if (diffP > 20) insights.push(`Faltam ${diffP}g de proteína. Adicione fontes como frango, ovos ou whey.`);
        if (Math.abs(diffKcal) > 200) insights.push(diffKcal > 0 ? `Déficit de ${diffKcal}kcal detectado. Aumente as porções.` : `Excesso de ${Math.abs(diffKcal)}kcal. Reduza carboidratos ou gorduras.`);
        if (diffC > 50 && mode === 'bulking') insights.push("Carboidratos baixos para Bulking. Adicione aveia ou arroz.");
        if (!useMeals && insights.length > 0) insights.unshift("Sugestão automática: Considere ajustar as porções para bater os macros exatos.");
        if (insights.length === 0) insights.push("Configuração Alpha detectada. Mantenha a disciplina.");
        return insights;
    };

    const getGridEvaluation = () => {
        if (habits.length === 0) return { score: 'Vazio', msg: 'Nenhum objetivo tático injetado no Grid.', color: 'text-zinc-400' };
        if (habits.length < 5) return { score: 'Baixa Volatilidade', msg: 'Sua rotina está muito leve. Adicione mais desafios.', color: 'text-yellow-500' };
        if (progressPerc > 80) return { score: 'Elite Execution', msg: 'Disciplina de alto nível detectada.', color: 'text-primary' };
        if (progressPerc < 30 && habits.length > 0) return { score: 'Crítico', msg: 'Falha na execução. Reajuste suas prioridades.', color: 'text-red-500' };
        return { score: 'Operacional', msg: 'Ritmo constante. Mantenha a consistência.', color: 'text-emerald-500' };
    };

    const getGoalEvaluation = () => {
        if (!hasMetrics) return { score: 'Incompleto', msg: 'Aguardando dados antropométricos.', color: 'text-zinc-400' };
        const bmr = autoCalories;
        const isDangerousDeficit = mode === 'cutting' && finalCalories < (bmr * 0.7);
        const isExcessiveSurplus = mode === 'bulking' && finalCalories > (bmr * 1.3);
        if (isDangerousDeficit) return { score: 'Risco Biológico', msg: 'Calorias muito baixas. Risco de catabolismo e crash hormonal.', color: 'text-red-500' };
        if (isExcessiveSurplus) return { score: 'Alerta de Gordura', msg: 'Superávit muito alto. Ganho de gordura será excessivo.', color: 'text-orange-500' };
        if (finalProtein < (weightNum * 1.6)) return { score: 'Proteína Baixa', msg: 'Abaixo do limiar de segurança para síntese proteica.', color: 'text-yellow-500' };
        return { score: 'Meta Otimizada', msg: 'Seus alvos estão dentro da zona de segurança científica.', color: 'text-emerald-500' };
    };

    const evalResult = getEvaluation();
    const gridEval = getGridEvaluation();
    const goalEval = getGoalEvaluation();

    const getOverallPerformance = () => {
        let score = 0;
        if (progressPerc > 70) score += 40;
        if (evalResult.score === 'Alpha Performance') score += 30;
        if (goalEval.score === 'Meta Otimizada') score += 20;
        if (waterPerc > 80) score += 10;
        return score;
    };

    const overallScore = getOverallPerformance();
    const dietInsights = getDietInsights();

    // EFFECTS
    useEffect(() => {
        const savedTab = localStorage.getItem('nutri_active_tab');
        if (savedTab) setActiveTab(savedTab as any);
    }, []);

    useEffect(() => {
        localStorage.setItem('nutri_active_tab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        if (!profile?.id || loading) return;
        const timer = setTimeout(async () => {
            const updates = {
                weight,
                height,
                target_calories: parseInt(targetCalories) || null,
                target_protein: parseInt(targetProtein) || null,
                target_carbs: parseInt(targetCarbs) || null,
                target_fats: parseInt(targetFats) || null
            };
            await supabase.from('profiles').update(updates).eq('id', profile.id);
            setProfile(prev => prev ? { ...prev, ...updates } : null);
        }, 1500);
        return () => clearTimeout(timer);
    }, [weight, height, targetCalories, targetProtein, targetCarbs, targetFats, profile?.id]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                if (!user) {
                    router.push("/login");
                    return;
                }

                // Garante que o perfil existe antes de qualquer outra operação
                const { data: profileData } = await supabase
                    .from("profiles")
                    .select("*")
                    .eq("id", user.id)
                    .single();

                if (profileData) {
                    setProfile({ ...profileData, email: user.email });
                    setWeight(profileData.weight || "");
                    setHeight(profileData.height || "");
                    setTargetCalories(profileData.target_calories?.toString() || "");
                    setTargetProtein(profileData.target_protein?.toString() || "");
                    setTargetCarbs(profileData.target_carbs?.toString() || "");
                    setTargetFats(profileData.target_fats?.toString() || "");
                    if (profileData.mode) setMode(profileData.mode as 'cutting' | 'bulking');
                    if (profileData.water_intake !== undefined) setWaterIntake(profileData.water_intake);
                } else {
                    // Cria o perfil se não existir (primeiro login)
                    await supabase.from('profiles').upsert({
                        id: user.id,
                        email: user.email,
                        plan_type: 'free',
                        is_admin: false,
                    }, { onConflict: 'id' });
                    setProfile({ id: user.id, email: user.email, plan_type: 'free', is_admin: false });
                }

                const isPro = profileData?.plan_type === 'pro' || profileData?.is_admin;

                // Fetch today's habits
                const today = new Date().toISOString().split('T')[0];
                const { data: habitData, error: habitFetchError } = await supabase
                    .from('habits')
                    .select('*')
                    .eq('user_id', user.id)
                    .eq('created_at', today);

                if (!habitFetchError && habitData && habitData.length > 0) {
                    setHabits(habitData.sort((a, b) => a.id - b.id));
                } else if (!habitFetchError) {
                    const baseHabitsCount = isPro ? 10 : 5;
                    const baseHabitNames = [
                        "Bater Calorias Alvo",
                        "3L de Água (Metabolismo)",
                        "Treino do Dia (Protocolo)",
                        "Banho Gelado (Dopamina/Inflamação)",
                        "7h de Sono (Recuperação CNS)",
                        "Leitura 10min",
                        "Cardio 30min",
                        "Suplementação (Creatina)",
                        "Zero Açúcar",
                        "Meditação (Foco)"
                    ].slice(0, baseHabitsCount);

                    const inserts = baseHabitNames.map(task => ({
                        user_id: user.id,
                        task_name: task,
                        is_completed: false,
                        created_at: today
                    }));

                    const { data: newHabits } = await supabase.from('habits').insert(inserts).select();
                    if (newHabits) {
                        setHabits(newHabits.sort((a, b) => a.id - b.id));
                    }
                }

                // Fetch custom meals
                const { data: mealsData } = await supabase
                    .from('diet_meals')
                    .select('*')
                    .eq('user_id', user.id);

                if (mealsData && mealsData.length > 0) {
                    setCustomMeals(mealsData);
                }
            } catch (err) {
                console.error("Dashboard fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [router, supabase]);

    const toggleHabit = async (id: number, currentStatus: boolean) => {
        const newStatus = !currentStatus;
        setHabits(habits.map(h => h.id === id ? { ...h, is_completed: newStatus } : h));
        const { error } = await supabase.from('habits').update({ is_completed: newStatus }).eq('id', id);
        if (error) {
            console.error("Grid Error:", error);
            // Revert state if error
            setHabits(habits.map(h => h.id === id ? { ...h, is_completed: currentStatus } : h));
            alert("Erro ao atualizar o Grid. Verifique se rodou o SQL de permissão.");
        }
    };

    const addCustomTask = async () => {
        if (!newTaskName.trim() || !profile) return;

        // LIMITAÇÃO PLANO FREE: Apenas 1 task customizada (além das 5 base)
        const baseHabitNames = [
            "Bater Calorias Alvo", "3L de Água (Metabolismo)", "Treino do Dia (Protocolo)",
            "Banho Gelado (Dopamina/Inflamação)", "7h de Sono (Recuperação CNS)",
            "Leitura 10min", "Cardio 30min", "Suplementação (Creatina)", "Zero Açúcar", "Meditação (Foco)"
        ];
        const customHabitsCount = habits.filter(h => !baseHabitNames.includes(h.task_name)).length;

        if (!isPro && customHabitsCount >= 1) {
            alert("Limite de 1 tarefa customizada atingido no plano Free. Evolua para o Pro para controle total.");
            return;
        }

        const today = new Date().toISOString().split('T')[0];
        const { data: newHabit, error } = await supabase.from('habits').insert({
            user_id: profile.id,
            task_name: newTaskName,
            is_completed: false,
            created_at: today
        }).select().single();

        if (error) {
            console.error("Add Habit Error:", error);
            alert("Erro ao adicionar objetivo. Verifique as permissões (RLS).");
            return;
        }

        if (newHabit) {
            setHabits(prevHabits => [...prevHabits, newHabit].sort((a, b) => a.id - b.id));
            setNewTaskName("");
        }
    };

    const deleteHabit = async (id: number) => {
        const previousHabits = [...habits];
        setHabits(habits.filter(h => h.id !== id));
        const { error } = await supabase.from('habits').delete().eq('id', id);
        if (error) {
            console.error("Delete Error:", error);
            setHabits(previousHabits);
            alert("Erro ao deletar tarefa.");
        }
    };

    const updateMode = async (newMode: 'cutting' | 'bulking') => {
        setMode(newMode);
        // Reseta alvos manuais ao trocar de modo se eles forem baseados no modo anterior
        // Isso evita que o usuário fique preso no "Crítico" por ter um alvo de Cutting em modo Bulking
        setTargetCalories("");
        setTargetProtein("");
        setTargetCarbs("");
        setTargetFats("");

        if (profile?.id) {
            await supabase.from('profiles').update({
                mode: newMode,
                target_calories: null,
                target_protein: null,
                target_carbs: null,
                target_fats: null
            }).eq('id', profile.id);
        }
    };

    const updateWater = async (newAmount: number) => {
        if (newAmount > waterIntake) {
            setIsWaterSplashing(true);
            setTimeout(() => setIsWaterSplashing(false), 600);
        }
        setWaterIntake(newAmount);
        if (profile?.id) {
            await supabase.from('profiles').update({ water_intake: newAmount }).eq('id', profile.id);
        }
    };

    const toggleDietEdit = () => {
        if (!isEditingDiet && customMeals.filter(m => m.mode === mode).length === 0) {
            // Pre-populate with suggestions if empty
            // Pre-populate with suggestions if empty
            const initialMeals: CustomMeal[] = currentSuggestions.map(s => ({
                id: Math.random().toString(36).substr(2, 9),
                name: s.name,
                time: s.time,
                items: s.items,
                protein: s.protein || 0,
                carbs: s.carbs || 0,
                fats: s.fats || 0,
                calories: s.calories || 0,
                mode: mode
            }));
            setCustomMeals(initialMeals);
        }
        setIsEditingDiet(!isEditingDiet);
    };

    const updateCustomMeal = (id: string, field: keyof CustomMeal, value: any) => {
        setCustomMeals(prev => prev.map(m => {
            if (m.id === id) {
                const updated = { ...m, [field]: value };
                if (field === 'protein' || field === 'carbs' || field === 'fats') {
                    updated.calories = (updated.protein * 4) + (updated.carbs * 4) + (updated.fats * 9);
                }
                return updated;
            }
            return m;
        }));
    };

    const saveDiet = async () => {
        setIsSavingDiet(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Limpar anteriores do mesmo modo
        await supabase.from('diet_meals').delete().eq('user_id', user.id).eq('mode', mode);

        const inserts = customMeals.filter(m => m.mode === mode).map(m => ({
            user_id: user.id,
            name: m.name,
            time: m.time,
            items: m.items,
            protein: m.protein,
            carbs: m.carbs,
            fats: m.fats,
            calories: m.calories,
            mode: mode
        }));

        const { error } = await supabase.from('diet_meals').insert(inserts);
        if (error) {
            alert("Erro ao salvar dieta. Verifique se rodou o SQL da tabela diet_meals.");
        } else {
            setIsEditingDiet(false);
        }
        setIsSavingDiet(false);
    };

    const saveMetrics = async () => {
        setIsSavingMetrics(true);
        const updates = {
            weight,
            height,
            target_calories: parseInt(targetCalories) || null,
            target_protein: parseInt(targetProtein) || null,
            target_carbs: parseInt(targetCarbs) || null,
            target_fats: parseInt(targetFats) || null
        };
        const { error } = await supabase.from('profiles').update(updates).eq('id', profile?.id);

        if (error) {
            alert(`Erro ao salvar: ${error.message}`);
        } else {
            setProfile(prev => prev ? {
                ...prev,
                ...updates
            } : null);
            // Visual feedback for save
            setIsSavingMetrics(false);
            setTimeout(() => setIsSavingMetrics(false), 2000);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );



    return (
        <div className="h-screen flex bg-white font-sans selection:bg-green-200 overflow-hidden">
            {/* MOBILE SIDEBAR DRAWER */}
            <motion.div
                animate={{ x: sidebarOpen ? 0 : -320 }}
                transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                className="fixed left-0 top-0 h-screen w-80 bg-white shadow-2xl z-[95] lg:hidden flex flex-col overflow-hidden"
            >
                <div className="p-10 border-b border-zinc-100 flex items-center gap-3 bg-gradient-to-r from-green-400 to-green-700">
                    <div className="p-2.5 rounded-xl bg-white/20 text-white shadow-lg">
                        <Activity className="w-6 h-6" />
                    </div>
                    <h1 className="font-black tracking-tighter text-white text-xl leading-none uppercase italic pr-4">Nutri<br />Academic</h1>
                </div>

                <div className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
                    {SIDEBAR_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isLocked = !isPro && item.proOnly;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setSidebarOpen(false);
                                    if (item.isExternal) {
                                        window.location.href = '/nutricao-esportiva';
                                    } else {
                                        setActiveTab(item.id as any);
                                    }
                                }}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                                    ? 'bg-zinc-950 text-white shadow-xl'
                                    : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <Icon className="w-5 h-5" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                                </div>
                                {isLocked && <Lock className="w-3 h-3 text-zinc-300" />}
                            </button>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-zinc-100">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-green-600 hover:bg-green-50 rounded-lg transition"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="text-xs font-semibold uppercase">Sair</span>
                    </button>
                </div>
            </motion.div>

            {/* MOBILE DRAWER HANDLE */}
            {!sidebarOpen && (
                <motion.button
                    onClick={() => setSidebarOpen(true)}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 10 }}
                    className="fixed left-0 top-1/2 -translate-y-1/2 bg-green-600 hover:bg-green-700 text-white rounded-r-lg shadow-lg z-[90] lg:hidden p-3 transition-all"
                    title="Abrir menu"
                >
                    <motion.div
                        animate={{ x: sidebarOpen ? 20 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronRight className="w-6 h-6" />
                    </motion.div>
                </motion.button>
            )}

            {/* OVERLAY */}
            {sidebarOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setSidebarOpen(false)}
                    className="fixed inset-0 bg-black/40 z-[85] lg:hidden"
                />
            )}
            {/* SIDEBAR */}
            <aside className="hidden lg:flex w-80 flex-col bg-white border-r border-zinc-200 shadow-sm z-10 sticky top-0 h-screen">
                <div className="p-10 border-b border-zinc-100 flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${accentBg} text-white shadow-lg shadow-zinc-100`}>
                        <Activity className="w-6 h-6" />
                    </div>
                    <h1 className="font-black tracking-tighter text-zinc-900 text-xl leading-none uppercase italic pr-4">Nutri<br />Academic</h1>
                </div>

                {/* Sidebar Items */}
                <div className="flex-1 px-4 space-y-2 overflow-y-auto py-4">
                    {SIDEBAR_ITEMS.map((item) => {
                        const Icon = item.icon;
                        const isLocked = !isPro && item.proOnly;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    if ((item as any).isExternal) {
                                        window.location.href = '/nutricao-esportiva';
                                    } else {
                                        setActiveTab(item.id as any);
                                    }
                                }}
                                className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group ${activeTab === item.id
                                    ? 'bg-zinc-950 text-white shadow-xl shadow-zinc-900/20'
                                    : 'text-zinc-400 hover:bg-zinc-100 hover:text-zinc-900'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <Icon className={`w-5 h-5 transition-transform duration-500 ${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'}`} />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">{item.label}</span>
                                </div>
                                {isLocked ? (
                                    <Lock className="w-3 h-3 text-zinc-300" />
                                ) : activeTab === item.id ? (
                                    <ChevronRight className="w-4 h-4 opacity-50" />
                                ) : (item as any).isExternal && (
                                    <ArrowUpRight className="w-3.5 h-3.5 opacity-20 group-hover:opacity-100 transition-opacity" />
                                )}
                            </button>
                        );
                    })}

                    {/* Admin Shortcut */}
                    {profile?.is_admin && (
                        <Link
                            href="/admin-nutri-master"
                            className="w-full mt-10 flex items-center gap-4 px-6 py-4 rounded-2xl bg-green-600/10 border border-green-600/20 text-green-600 hover:bg-green-600 hover:text-white transition-all duration-300 group shadow-lg shadow-green-500/5"
                        >
                            <ShieldCheck className="w-5 h-5 transition-transform group-hover:rotate-12" />
                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Painel Admin Master</span>
                        </Link>
                    )}
                </div>

                <div className="mt-auto p-8 border-t border-zinc-50 bg-zinc-50/50">
                    <div className="flex items-center gap-4 mb-8 p-4 bg-white rounded-2xl border border-zinc-100 shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-zinc-900 flex items-center justify-center text-white border-2 border-white shadow-lg">
                            <User className="w-6 h-6" />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs font-black text-zinc-950 truncate uppercase italic tracking-tighter">Guardião da Performance</p>
                            <p className="text-[8px] text-zinc-400 truncate font-black uppercase tracking-widest">{profile?.email || 'N/A'}</p>
                        </div>
                    </div>
                    {!isPro && (
                        <button onClick={() => router.push('/pricing')} className="w-full mb-4 py-4 flex items-center justify-center gap-2 rounded-2xl bg-zinc-950 text-white text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] transition-transform active:scale-95 group">
                            <Crown className="w-4 h-4 text-primary group-hover:animate-pulse" /> Ativar Pro Alpha
                        </button>
                    )}
                    <button onClick={handleLogout} className="w-full py-3 flex items-center justify-center gap-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-50 text-[10px] font-black uppercase tracking-widest transition-all">
                        <LogOut className="w-4 h-4" /> Sair do Sistema
                    </button>
                </div>
            </aside >

            {/* MAIN */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-12 relative">

                    {/* Upper Header Control */}
                    <div className="flex flex-col xl:flex-row justify-between xl:items-end mb-16 gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className={`w-3 h-3 rounded-full ${accentBg} animate-ping`}></span>
                                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em]">Status: Operacional • V6.0</span>
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight italic uppercase leading-[0.9] pr-6">
                                {SIDEBAR_ITEMS.find(i => i.id === activeTab)?.label}
                            </h2>
                        </div>

                        <div className="bg-white border-2 border-zinc-100 p-2 rounded-[1.5rem] flex relative w-full xl:w-96 overflow-hidden shadow-sm">
                            <motion.div
                                className={`absolute top-2 bottom-2 w-[calc(50%-8px)] rounded-xl shadow-lg z-0 ${accentBg}`}
                                initial={false}
                                animate={{ x: mode === 'cutting' ? 8 : '100%' }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                            />
                            <button onClick={() => updateMode('cutting')} className={`relative z-10 flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors ${mode === 'cutting' ? 'text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>
                                <Droplets className="w-4 h-4" /> Cutting
                            </button>
                            <button onClick={() => updateMode('bulking')} className={`relative z-10 flex-1 flex items-center justify-center gap-3 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-colors ${mode === 'bulking' ? 'text-white' : 'text-zinc-400 hover:text-zinc-900'}`}>
                                <Flame className="w-4 h-4" /> Bulking
                            </button>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">

                        {/* TAB: OVERVIEW */}
                        {activeTab === 'overview' && (
                            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-12">

                                {/* Top Stats Ribbon */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                    <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-200 shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl group">
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Adesão Protocolo</span>
                                            <div className={`p-2 rounded-lg ${accentLightBg} ${accentColor} group-hover:bg-zinc-950 group-hover:text-white transition-colors cursor-help`} title="Adesão mede sua consistência neural. Sem consistência, não há hipertrofia.">
                                                <Activity className="w-4 h-4" />
                                            </div>
                                        </div>
                                        <div className="text-5xl font-black text-zinc-900 tracking-tighter italic mb-4">{progressPerc}%</div>
                                        <div className="w-full bg-zinc-100 rounded-full h-1.5 mb-4">
                                            <motion.div className={`h-full rounded-full ${accentBg}`} initial={{ width: 0 }} animate={{ width: `${progressPerc}%` }} />
                                        </div>
                                        <p className="text-[8px] text-zinc-400 font-bold uppercase leading-tight italic opacity-0 group-hover:opacity-100 transition-opacity">
                                            "Consistência vence a intensidade. 80%+ é o alvo Alpha."
                                        </p>
                                    </div>

                                    <motion.div
                                        animate={isWaterSplashing ? { scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] } : {}}
                                        className="bg-white rounded-[2.5rem] p-10 border border-zinc-200 shadow-sm relative overflow-hidden group transition-shadow hover:shadow-xl"
                                    >
                                        <div className="flex items-center justify-between mb-8 relative z-20">
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Tanque d'Água</span>
                                            <div className="p-2 rounded-lg bg-blue-50 text-blue-500 cursor-help" title="A água é o condutor da síntese proteica. Células desidratadas não crescem.">
                                                <Waves className={`w-4 h-4 ${isWaterSplashing ? 'animate-bounce' : ''}`} />
                                            </div>
                                        </div>
                                        <div className="flex items-baseline gap-1 mb-4 relative z-20">
                                            <span className="text-5xl font-black text-zinc-900 tracking-tighter italic">{(waterIntake / 1000).toFixed(1)}</span>
                                            <span className="text-xs font-black text-zinc-300 uppercase tracking-widest">/ 3.0L</span>
                                        </div>
                                        <div className="flex gap-2 relative z-20">
                                            <button onClick={() => updateWater(Math.max(0, waterIntake - 250))} className="p-3 bg-zinc-50 rounded-xl hover:bg-zinc-100 text-zinc-400 hover:text-zinc-600 transition outline-none"><Minus className="w-3 h-3" /></button>
                                            <button onClick={() => updateWater(waterIntake + 250)} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-black text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-blue-100 transition hover:bg-blue-700 active:scale-95 outline-none">+ 250ML</button>
                                        </div>

                                        {/* Glassy Overlay for realism */}
                                        <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/40 to-transparent pointer-events-none z-10" />

                                        {/* Fluid Animation System */}
                                        <WaterWave progress={waterPerc} />
                                    </motion.div>

                                    <div className="bg-white rounded-[2.5rem] p-10 border border-zinc-200 shadow-sm transition-all hover:scale-[1.02] hover:shadow-xl">
                                        <div className="flex items-center justify-between mb-8">
                                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Peso Atual</span>
                                            <Scale className="w-5 h-5 text-zinc-300" />
                                        </div>
                                        <div className="text-5xl font-black text-zinc-900 tracking-tighter italic">{weight || '--'} <span className="text-xs text-zinc-300 not-italic uppercase tracking-widest">kg</span></div>
                                        <p className="text-[9px] font-black text-green-500 bg-green-50 px-3 py-1.5 rounded-full w-fit mt-5 uppercase tracking-widest border border-green-100">Algoritmo Ativado</p>
                                    </div>

                                    <div className="bg-zinc-950 rounded-[2.5rem] p-10 shadow-2xl text-white relative overflow-hidden group transition-all hover:scale-[1.02] hover:shadow-[0_40px_100px_rgba(0,0,0,0.3)]">
                                        <div className="absolute top-0 right-0 p-6 opacity-10 scale-150 rotate-12 transition-transform group-hover:rotate-0"><Brain className="w-24 h-24" /></div>
                                        <div className="flex items-center justify-between mb-8 relative z-10">
                                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Neural Index</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase text-primary">{overallScore}/100</span>
                                                <Activity className="w-4 h-4 text-primary" />
                                            </div>
                                        </div>
                                        <p className="text-xl font-black italic tracking-tight leading-[1.1] relative z-10 group-hover:text-primary transition-colors mb-4">
                                            {overallScore > 80 ? 'Protocolo em estado de fluxo. Performance de elite.' : overallScore > 50 ? 'Consistente, mas há margem para otimização neural.' : 'Sistema em degradação. Reajuste protocolos imediatamente.'}
                                        </p>
                                        <div className="w-full bg-zinc-800 rounded-full h-1 mb-4 relative z-10">
                                            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: `${overallScore}%` }} />
                                        </div>
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-600">Biohacking V6 Alpha</span>
                                    </div>
                                </div>

                                {/* Goals & Macro Widget */}
                                <div className="bg-white rounded-[3.5rem] p-8 md:p-16 border border-zinc-200 shadow-sm relative overflow-hidden">
                                    <div className="flex flex-col lg:flex-row gap-20">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <h3 className="text-3xl md:text-4xl font-black text-zinc-900 uppercase italic tracking-tight pr-4">Budget de Nutrientes</h3>
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${targetCalories ? 'bg-orange-950 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
                                                    {targetCalories ? 'Manual Override' : 'Auto Algorithm'}
                                                </div>
                                            </div>
                                            <p className="text-zinc-500 font-bold text-sm mb-12 uppercase tracking-widest max-w-xl leading-relaxed">Referencial estratégico calculado para sua massa de {weight || '?'}kg sob regime de {mode}.</p>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                                                {[
                                                    { label: 'Proteína', val: finalProtein, color: 'emerald', sub: '2.2g/kg' },
                                                    { label: 'Carbos', val: finalCarbs, color: 'orange', sub: 'Fator Energia' },
                                                    { label: 'Gorduras', val: finalFats, color: 'yellow', sub: 'Hormonal' }
                                                ].map((macro, i) => (
                                                    <div key={i} className="bg-zinc-50 border border-zinc-100 p-8 rounded-[2rem] hover:bg-white transition-all hover:border-zinc-200 shadow-inner">
                                                        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-4">{macro.label}</p>
                                                        <p className="text-4xl font-black text-zinc-950 tracking-tighter italic mb-2">{macro.val}g</p>
                                                        <p className={`text-[8px] font-black uppercase tracking-widest text-${macro.color}-600`}>{macro.sub}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="w-full lg:w-96 aspect-square rounded-[3rem] bg-zinc-950 flex flex-col items-center justify-center p-12 text-center shadow-[0_40px_100px_rgba(0,0,0,0.1)] relative group">
                                            <div className="absolute top-8 right-8 text-primary shadow-2xl opacity-50 group-hover:scale-125 transition-transform"><TargetIcon className="w-8 h-8" /></div>
                                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-6">Demanda Calórica</p>
                                            <div className="relative">
                                                <span className="text-7xl md:text-8xl font-black text-white tracking-tighter italic leading-[0.85] pr-4">{finalCalories}</span>
                                                <div className="absolute -right-4 -top-4 w-4 h-4 rounded-full bg-primary blur-sm"></div>
                                            </div>
                                            <span className="text-xs font-black text-primary uppercase tracking-[0.3em] mt-6">KCal / Ciclo 24h</span>
                                            <div className="mt-12 p-4 bg-zinc-900/50 rounded-2xl border border-zinc-800 w-full">
                                                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Basal + Efeito Térmico + NEAT</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* ACESSO RÁPIDO GLOBAL: NUTRIÇÃO ESPORTIVA */}
                                <div className="bg-zinc-950 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                                        <Trophy className="w-64 h-64 text-white" />
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(204,255,0,0.05)_0%,_transparent_70%)]"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                        <div className="max-w-xl text-center md:text-left">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#CCFF00]/10 border border-zinc-800 rounded-full mb-6 mx-auto md:mx-0">
                                                <Crown className="w-3 h-3 text-[#CCFF00]" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#CCFF00]">Módulo de Elite Alpha</span>
                                            </div>
                                            <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">Nutrição <br className="hidden md:block" /> <span className="bg-gradient-to-r from-[#CCFF00] to-[#4A7A00] bg-clip-text text-transparent">Esportiva</span></h3>
                                            <p className="text-zinc-400 text-sm font-bold italic leading-relaxed">
                                                Protocolos de timing, suplementação e métricas avançadas para transformar seu metabolismo em uma máquina de performance.
                                            </p>
                                        </div>

                                        <Link href="/nutricao-esportiva" className="shrink-0 px-12 py-6 bg-gradient-to-r from-[#CCFF00] to-[#BDFF00] text-black font-black uppercase tracking-widest text-[11px] rounded-[1.75rem] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(204,255,0,0.15)] flex items-center gap-3">
                                            Explorar Módulo <ArrowUpRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>

                                {/* Anthropometry Module (Summarized) */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                    <div className="col-span-1 lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 border border-zinc-200 shadow-sm relative overflow-hidden">
                                        <div className="flex justify-between items-start mb-8">
                                            <div>
                                                <h3 className="text-2xl font-black text-zinc-900 uppercase italic flex items-center gap-3">
                                                    <Scale className="w-6 h-6 text-emerald-500" /> Antropometria
                                                </h3>
                                                <p className="text-[10px] text-zinc-400 uppercase tracking-widest mt-2">{goalEval.msg}</p>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${goalEval.color.replace('text', 'bg').replace('500', '50/50')} ${goalEval.color}`}>{goalEval.score}</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Peso (kg)</label>
                                                <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="00.0" className="w-full bg-transparent font-black text-2xl md:text-3xl text-zinc-950 outline-none" />
                                            </div>
                                            <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-1">Altura (cm)</label>
                                                <input value={height} onChange={(e) => setHeight(e.target.value)} placeholder="000" className="w-full bg-transparent font-black text-2xl md:text-3xl text-zinc-950 outline-none" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-4 gap-2 mb-6">
                                            <div className="col-span-4 md:col-span-1 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                                <label className="text-[8px] font-black text-zinc-400 uppercase block">Kcal Alvo</label>
                                                <input value={targetCalories} onChange={(e) => setTargetCalories(e.target.value)} placeholder={autoCalories.toString()} className="w-full bg-transparent font-black text-lg min-w-0" />
                                            </div>
                                            <div className="col-span-4 md:col-span-1 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                                <label className="text-[8px] font-black text-zinc-400 uppercase block">Prot (g)</label>
                                                <input value={targetProtein} onChange={(e) => setTargetProtein(e.target.value)} placeholder={autoProtein.toString()} className="w-full bg-transparent font-black text-lg min-w-0" />
                                            </div>
                                            <div className="col-span-4 md:col-span-1 bg-zinc-50 p-3 rounded-xl border border-zinc-100">
                                                <label className="text-[8px] font-black text-zinc-400 uppercase block">Carb (g)</label>
                                                <input value={targetCarbs} onChange={(e) => setTargetCarbs(e.target.value)} placeholder={autoCarbs.toString()} className="w-full bg-transparent font-black text-lg min-w-0" />
                                            </div>
                                            <button onClick={saveMetrics} disabled={isSavingMetrics} className="col-span-4 md:col-span-1 bg-zinc-950 text-white font-black rounded-xl shadow-lg hover:bg-zinc-800 transition-colors text-[9px] uppercase tracking-widest flex items-center justify-center p-3 gap-2 disabled:opacity-50">
                                                {isSavingMetrics ? '...' : <><Save className="w-3 h-3" /> Salvar</>}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Science Card Mini */}
                                    <div className="col-span-1 bg-zinc-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-2xl flex flex-col justify-center">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,_rgba(16,185,129,0.15)_0%,_transparent_50%)]"></div>
                                        <BookOpen className="w-8 h-8 text-emerald-500 mb-6 relative z-10" />
                                        <h4 className="text-xl font-black uppercase italic mb-4 tracking-tighter relative z-10">Protocolo Alpha</h4>
                                        <p className="text-zinc-400 text-xs leading-relaxed italic relative z-10 mb-6">
                                            Ajustes de peso base devem variar entre 0.25% e 0.5% na semana. Offsets recomendados: <strong className="text-orange-400">Bulking</strong> (+38 kcal/kg), <strong className="text-emerald-400">Cutting</strong> (-26 kcal/kg).
                                        </p>
                                        <div className="mt-auto p-4 bg-white/5 backdrop-blur-sm rounded-xl border border-white/5 text-center relative z-10">
                                            <span className="text-xl font-black italic tracking-tighter block text-white">{mode.toUpperCase()}</span>
                                            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Modo Operacional Ativo</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}



                        {/* TAB: GRID */}
                        {activeTab === 'grid' && (
                            <motion.div key="grid" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                                <div className="bg-white rounded-[3.5rem] p-8 md:p-16 border border-zinc-200 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 via-zinc-900 to-orange-500"></div>
                                    <div className="flex flex-col lg:flex-row justify-between lg:items-end mb-20 gap-10">
                                        <div>
                                            <h3 className="text-4xl md:text-5xl font-black text-zinc-900 uppercase italic leading-none mb-4 tracking-tighter pr-4">The Grid</h3>
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className={`text-[10px] font-black uppercase tracking-widest ${gridEval.color}`}>{gridEval.score}</span>
                                                <span className="text-[10px] text-zinc-400 uppercase tracking-widest">• {gridEval.msg}</span>
                                            </div>
                                            <p className="text-zinc-400 font-bold text-[10px] tracking-[0.4em] uppercase ml-1">Routine Synchronization Engine</p>
                                        </div>
                                        <div className="flex items-center gap-4 bg-zinc-50 border-2 border-zinc-100 p-3 rounded-[2.5rem] max-w-xl w-full shadow-inner group focus-within:border-zinc-300 transition-all">
                                            <div className="bg-white p-4 rounded-3xl text-zinc-300 shadow-sm group-focus-within:text-zinc-900 transition-colors">
                                                <Plus className="w-7 h-7" />
                                            </div>
                                            <input
                                                value={newTaskName} onChange={(e) => setNewTaskName(e.target.value)}
                                                placeholder="Inject tactical objective..."
                                                className="bg-transparent border-none text-lg font-black w-full outline-none text-zinc-950 placeholder:text-zinc-300 italic"
                                                onKeyDown={(e) => e.key === 'Enter' && addCustomTask()}
                                            />
                                            <button onClick={addCustomTask} className={`px-10 py-4 rounded-[1.75rem] font-black transition-all uppercase tracking-[0.2em] text-[10px] ${newTaskName ? 'bg-zinc-950 text-white shadow-2xl hover:scale-105 active:scale-95' : 'bg-transparent text-zinc-200 cursor-not-allowed'}`}>
                                                Deploy
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6">
                                        {habits.map((habit) => (
                                            <motion.div
                                                layout key={habit.id}
                                                className={`flex items-center group justify-between p-8 rounded-[2.5rem] border-2 transition-all cursor-pointer ${habit.is_completed
                                                    ? `${accentLightBg} ${accentBorder} ${accentColor} shadow-xl shadow-zinc-100`
                                                    : 'bg-zinc-50 border-zinc-100 text-zinc-950 hover:border-zinc-200 hover:bg-white'
                                                    }`}
                                            >
                                                <button onClick={() => toggleHabit(habit.id, habit.is_completed)} className="flex-1 flex items-center gap-6 text-left font-black uppercase tracking-tight text-lg md:text-xl italic pr-6 group-active:scale-[0.98] transition-transform">
                                                    {habit.is_completed ? (
                                                        <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center shadow-lg translate-x-1"><CheckCircle2 className="w-7 h-7" /></div>
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-2xl bg-white/50 border-2 border-zinc-200 flex items-center justify-center transition-colors group-hover:border-zinc-400 translate-x-1"><Circle className="w-6 h-6 text-zinc-200" /></div>
                                                    )}
                                                    <span className={`${habit.is_completed ? 'line-through opacity-30 italic' : ''} transition-all translate-x-[-4px]`}>{habit.task_name}</span>
                                                </button>
                                                <button onClick={() => deleteHabit(habit.id)} className="opacity-0 group-hover:opacity-100 p-4 hover:bg-red-50 rounded-2xl transition-all text-zinc-300 hover:text-red-500 scale-90 hover:scale-100">
                                                    <Trash2 className="w-6 h-6" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </div>
                                    <div className="mt-16 pt-10 border-t border-zinc-50 flex flex-wrap items-center justify-between gap-6">
                                        <div className="flex gap-10 text-zinc-400 text-[10px] font-black uppercase tracking-[0.4em]">
                                            <span>Active Nodes: {habits.length}</span>
                                            <span className={accentColor}>Sync Level: {progressPerc}%</span>
                                        </div>
                                        <div className="p-6 bg-zinc-50 rounded-[2rem] border border-zinc-100 max-w-md">
                                            <p className="text-[10px] font-black text-zinc-900 uppercase tracking-widest mb-2 flex items-center gap-2"><Brain className="w-3 h-3" /> Por que o Grid?</p>
                                            <p className="text-xs text-zinc-400 italic font-medium leading-relaxed">A dopamina é liberada ao "dar check". O Grid não é apenas uma lista, é um sistema de recompensa neural para manter seu córtex pré-frontal focado no objetivo anabólico.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* ACESSO RÁPIDO: NUTRIÇÃO ESPORTIVA */}
                                <div className="bg-zinc-950 rounded-[3.5rem] p-10 md:p-14 text-white relative overflow-hidden group border border-white/5 shadow-2xl">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-700">
                                        <Trophy className="w-64 h-64 text-white" />
                                    </div>
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,_rgba(204,255,0,0.05)_0%,_transparent_70%)]"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
                                        <div className="max-w-xl text-center md:text-left">
                                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#CCFF00]/10 border border-zinc-800 rounded-full mb-6 mx-auto md:mx-0">
                                                <Crown className="w-3 h-3 text-[#CCFF00]" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[#CCFF00]">Módulo de Elite Alpha</span>
                                            </div>
                                            <h3 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 leading-none">Nutrição <br className="hidden md:block" /> <span className="bg-gradient-to-r from-[#CCFF00] to-[#4A7A00] bg-clip-text text-transparent">Esportiva</span></h3>
                                            <p className="text-zinc-400 text-sm font-bold italic leading-relaxed">
                                                Protocolos de timing, suplementação e métricas avançadas para transformar seu metabolismo em uma máquina de performance.
                                            </p>
                                        </div>

                                        <Link href="/nutricao-esportiva" className="shrink-0 px-12 py-6 bg-gradient-to-r from-[#CCFF00] to-[#BDFF00] text-black font-black uppercase tracking-widest text-[11px] rounded-[1.75rem] hover:scale-105 active:scale-95 transition-all shadow-[0_20px_40px_rgba(204,255,0,0.15)] flex items-center gap-3">
                                            Explorar Módulo <ArrowUpRight className="w-5 h-5" />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* TAB: DIETA */}
                        {activeTab === 'dieta' && (
                            <motion.div key="dieta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                                    <div>
                                        <h3 className="text-4xl font-black text-zinc-900 italic uppercase tracking-tighter">Diet Analytics</h3>
                                        <p className="text-zinc-400 font-bold text-[10px] tracking-[0.4em] uppercase">High-Fidelity Nutrition Evaluator</p>
                                    </div>
                                    <div className="flex gap-4">
                                        {isEditingDiet && (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        const template = DIET_CATALOG[selectedProfile];
                                                        const meals = mode === 'cutting' ? template.cutting : template.bulking;
                                                        setCustomMeals(prev => [...prev.filter(m => m.mode !== mode), ...meals.map(s => ({
                                                            id: Math.random().toString(36).substr(2, 9),
                                                            name: s.name,
                                                            time: s.time,
                                                            items: s.items,
                                                            protein: s.protein,
                                                            carbs: s.carbs,
                                                            fats: s.fats,
                                                            calories: s.calories,
                                                            mode: mode
                                                        }))]);
                                                    }}
                                                    className="px-6 py-3 bg-zinc-100 text-zinc-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-zinc-200 transition-all"
                                                >
                                                    Restaurar Padrão
                                                </button>
                                                <button
                                                    onClick={async () => {
                                                        if (confirm("Deseja zerar sua customização deste modo?")) {
                                                            setCustomMeals(prev => prev.filter(m => m.mode !== mode));
                                                            if (profile?.id) {
                                                                await supabase.from('diet_meals').delete().eq('user_id', profile.id).eq('mode', mode);
                                                            }
                                                        }
                                                    }}
                                                    className="px-6 py-3 bg-red-50 text-red-500 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-all"
                                                >
                                                    Zerar
                                                </button>
                                            </div>
                                        )}
                                        {isEditingDiet ? (
                                            <button onClick={saveDiet} disabled={isSavingDiet} className="px-8 py-3 bg-zinc-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl hover:scale-105 transition-all">
                                                <Save className="w-4 h-4" /> {isSavingDiet ? 'Salvando...' : 'Salvar Customização'}
                                            </button>
                                        ) : (
                                            <button onClick={toggleDietEdit} className="px-8 py-3 bg-white border-2 border-zinc-100 text-zinc-950 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-50 transition-all">
                                                <Settings className="w-4 h-4" /> Customizar Protocolo
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Catalog Selector */}
                                <div className="mb-10">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.3em] mb-6">Selecione seu Catálogo de Alimentos (Base do que tem em casa)</p>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {[
                                            { id: 'standard', label: 'Alpha Standard', desc: 'Equilíbrio entre custo e performance.', icon: <Utensils className="w-5 h-5" /> },
                                            { id: 'economical', label: 'Essencial/Econômico', desc: 'Foco em ovos, arroz, feijão e frango.', icon: <Calculator className="w-5 h-5" /> },
                                            { id: 'practical', label: 'Ultra Praticidade', desc: 'Shakes, marmitas e lanches rápidos.', icon: <Zap className="w-5 h-5" /> }
                                        ].map((cat) => {
                                            // compute quick evaluation for this catalog (day total)
                                            const template = cat.id === 'standard' ? DIET_CATALOG.standard : cat.id === 'economical' ? DIET_CATALOG.economical : DIET_CATALOG.practical;
                                            const meals = mode === 'cutting' ? template.cutting : template.bulking;
                                            const totals = meals.reduce((acc, m) => ({ p: acc.p + (m.protein || 0), c: acc.c + (m.carbs || 0), f: acc.f + (m.fats || 0), kcal: acc.kcal + (m.calories || 0) }), { p: 0, c: 0, f: 0, kcal: 0 });
                                            const diffP = totals.p - finalProtein;
                                            const diffKcal = totals.kcal - finalCalories;
                                            let catScore = 'Ajustável';
                                            let catColor = 'text-yellow-500';
                                            if (mode === 'bulking') {
                                                if (diffP < -10) { catScore = 'Crítico'; catColor = 'text-red-500'; }
                                                else if (diffKcal < -150) { catScore = 'Alerta'; catColor = 'text-orange-500'; }
                                                else if (Math.abs(diffP) < 30 && Math.abs(diffKcal) < 200) { catScore = 'Alpha Performance'; catColor = 'text-emerald-500'; }
                                                else if (diffKcal > 500) { catScore = 'Sujeira'; catColor = 'text-orange-500'; }
                                            } else {
                                                if (diffKcal > 100) { catScore = 'Crítico'; catColor = 'text-red-500'; }
                                                else if (diffP < -15) { catScore = 'Alerta'; catColor = 'text-orange-500'; }
                                                else if (Math.abs(diffKcal) < 150 && diffP >= -5) { catScore = 'Alpha Performance'; catColor = 'text-emerald-500'; }
                                            }

                                            return (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        if (!isPro && cat.id !== 'standard') {
                                                            alert("Este catálogo é exclusivo para assinantes Alpha Pro.");
                                                            return;
                                                        }
                                                        setSelectedProfile(cat.id as any);
                                                        if (isEditingDiet) {
                                                            const templateInner = cat.id === 'standard' ? DIET_CATALOG.standard : cat.id === 'economical' ? DIET_CATALOG.economical : DIET_CATALOG.practical;
                                                            const mealsInner = mode === 'cutting' ? templateInner.cutting : templateInner.bulking;
                                                            setCustomMeals(mealsInner.map(s => ({
                                                                id: Math.random().toString(36).substr(2, 9),
                                                                name: s.name,
                                                                time: s.time,
                                                                items: s.items,
                                                                protein: s.protein,
                                                                carbs: s.carbs,
                                                                fats: s.fats,
                                                                calories: s.calories,
                                                                mode: mode
                                                            })));
                                                        }
                                                    }}
                                                    className={`p-6 rounded-[2rem] text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${selectedProfile === cat.id ? `${accentBorder} bg-white shadow-xl` : 'border-zinc-100 bg-zinc-50/50 opacity-60 hover:opacity-100'} relative overflow-hidden`}
                                                >
                                                    {!isPro && cat.id !== 'standard' && <div className="absolute top-4 right-4"><Lock className="w-4 h-4 text-zinc-300" /></div>}
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${selectedProfile === cat.id ? accentBg + ' text-white' : 'bg-white text-zinc-300'}`}>
                                                        {cat.icon}
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div>
                                                            <h4 className="font-black italic uppercase tracking-tighter mb-1 text-sm">{cat.label}</h4>
                                                            <p className="text-[10px] text-zinc-400 font-bold leading-tight">{cat.desc}</p>
                                                        </div>
                                                        <div className="ml-4 flex-shrink-0 text-right">
                                                            <span className={`px-3 py-1 rounded-full text-xs font-black ${catColor.replace('text', 'bg').replace('500', '50/50')} ${catColor}`}>{catScore}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Advanced Evaluator Panel */}
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                                    {/* Status Card */}
                                    <div className={`col-span-1 p-10 rounded-[3rem] border-2 flex flex-col justify-between relative overflow-hidden ${evalResult.color.replace('text', 'border')} ${evalResult.color.replace('text', 'bg').replace('500', '50/50')}`}>
                                        <div className="relative z-10">
                                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 mb-2">Veredito AI</p>
                                            <h4 className={`text-4xl font-black italic tracking-tighter uppercase mb-2 ${evalResult.color}`}>{evalResult.score}</h4>
                                            <p className="text-sm font-bold text-zinc-600 leading-tight">{evalResult.msg}</p>
                                        </div>
                                        <div className="mt-8 relative z-10">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="text-[10px] font-black uppercase">Consistência de Macro</span>
                                                <span className="text-[10px] font-black ml-auto">{Math.min(100, Math.round((totalDietMacros.p / finalProtein) * 100))}%</span>
                                            </div>
                                            <div className="w-full bg-zinc-200/50 rounded-full h-1.5 overflow-hidden">
                                                <motion.div className={`h-full ${accentBg}`} initial={{ width: 0 }} animate={{ width: `${(totalDietMacros.p / finalProtein) * 100}%` }} />
                                            </div>
                                        </div>
                                        <Activity className={`absolute -bottom-10 -right-10 w-48 h-48 opacity-5 ${evalResult.color}`} />
                                    </div>

                                    {/* Macro Comparison bars */}
                                    <div className="col-span-1 lg:col-span-2 bg-zinc-950 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 relative z-10">
                                            <div className="space-y-6">
                                                <div className="flex items-center justify-between">
                                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Alinhamento de Macros</h5>
                                                    <div className="flex gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                                        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                                                        <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                                                    </div>
                                                </div>

                                                {[
                                                    { label: 'Proteína', current: totalDietMacros.p, target: finalProtein, color: 'bg-emerald-500' },
                                                    { label: 'Carbos', current: totalDietMacros.c, target: finalCarbs, color: 'bg-orange-500' },
                                                    { label: 'Gordura', current: totalDietMacros.f, target: finalFats, color: 'bg-yellow-500' }
                                                ].map((m, idx) => (
                                                    <div key={idx} className="space-y-2">
                                                        <div className="flex justify-between text-[10px] font-black uppercase">
                                                            <span className="text-zinc-500">{m.label}</span>
                                                            <span>{m.current}g / <span className="text-zinc-500">{m.target}g</span></span>
                                                        </div>
                                                        <div className="w-full bg-white/5 rounded-full h-2">
                                                            <motion.div className={`h-full rounded-full ${m.color}`} initial={{ width: 0 }} animate={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="flex flex-col justify-between border-l border-white/5 md:pl-10">
                                                <div>
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-4 flex items-center gap-2"><Brain className="w-3 h-3" /> Mentoria Tactical</p>
                                                    <div className="space-y-4">
                                                        {isPro ? (
                                                            dietInsights.map((insight, idx) => (
                                                                <div key={idx} className="flex gap-3 items-start">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                                                                    <p className="text-[11px] font-medium text-zinc-400 leading-relaxed italic">"{insight}"</p>
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-center py-10">
                                                                <Lock className="w-6 h-6 text-zinc-600 mx-auto mb-3" />
                                                                <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Mentoria AI Bloqueada</p>
                                                                <p className="text-[9px] text-zinc-600 font-bold mb-4">Evolua para o Plano Pro Alpha para insights neurais sobre sua dieta.</p>
                                                                <Link href="/pricing" className="text-[8px] font-black uppercase tracking-widest bg-primary px-4 py-2 rounded-lg text-black hover:scale-105 transition-all inline-block">Upgrade</Link>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mt-8 pt-6 border-t border-white/5 flex items-end justify-between">
                                                    <div>
                                                        <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Total Diário</p>
                                                        <p className="text-3xl font-black italic tracking-tighter">{totalDietMacros.kcal} kcal</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-[10px] font-black text-zinc-600 uppercase mb-1">Alvo</p>
                                                        <p className="text-xl font-black italic text-zinc-400 tracking-tighter">{finalCalories} kcal</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-6">
                                    {(isEditingDiet ? customMeals.filter(m => m.mode === mode) : (useMeals || displaySuggestions)).map((food: any, i) => (
                                        <div key={i} className="rounded-[3rem] p-10 bg-transparent shadow-sm relative group overflow-hidden">
                                            <div className="flex flex-col xl:flex-row gap-10 items-start xl:items-center">
                                                <div className={`w-32 h-32 rounded-[2rem] ${accentLightBg} border-2 ${accentBorder} flex flex-col items-center justify-center font-black ${accentColor} shadow-inner`}>
                                                    <span className="text-[10px] uppercase tracking-widest mb-1 opacity-50">T-Minus</span>
                                                    {isEditingDiet ? (
                                                        <input value={food.time} onChange={(e) => updateCustomMeal(food.id, 'time', e.target.value)} className="bg-transparent w-full text-center text-xl tracking-tighter italic font-black outline-none" />
                                                    ) : (
                                                        <span className="text-3xl tracking-tighter italic">{food.time}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1 w-full">
                                                    <div className="flex items-center gap-4 mb-3">
                                                        {isEditingDiet ? (
                                                            <input value={food.name} onChange={(e) => updateCustomMeal(food.id, 'name', e.target.value)} className="text-2xl md:text-3xl font-black text-zinc-900 italic tracking-tighter uppercase bg-zinc-50 px-4 py-2 rounded-xl w-full outline-none focus:bg-white" />
                                                        ) : (
                                                            <h4 className="text-4xl font-black text-zinc-900 italic tracking-tighter uppercase">{food.name}</h4>
                                                        )}
                                                        {!isEditingDiet && <button onClick={() => setShowMealInfo(showMealInfo === i ? null : i)} className={`p-3 rounded-2xl transition-all ${showMealInfo === i ? 'bg-zinc-950 text-white' : 'bg-zinc-100 text-zinc-400 hover:text-zinc-900'}`}><Info className="w-5 h-5" /></button>}
                                                    </div>

                                                    {isEditingDiet ? (
                                                        <textarea value={food.items} onChange={(e) => updateCustomMeal(food.id, 'items', e.target.value)} className="w-full bg-zinc-50 p-4 rounded-xl font-bold text-zinc-600 italic mb-6 outline-none focus:bg-white min-h-[80px]" />
                                                    ) : (
                                                        <p className="text-xl font-bold text-zinc-600 mb-6 italic leading-tight">{food.items}</p>
                                                    )}

                                                    <div className="flex flex-wrap gap-4">
                                                        {isEditingDiet ? (
                                                            <div className="flex gap-2">
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[8px] font-black uppercase text-zinc-400">P</span>
                                                                    <input type="number" value={food.protein} onChange={(e) => updateCustomMeal(food.id, 'protein', parseInt(e.target.value))} className="w-16 bg-zinc-100 p-2 rounded-lg font-black text-xs" />
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[8px] font-black uppercase text-zinc-400">C</span>
                                                                    <input type="number" value={food.carbs} onChange={(e) => updateCustomMeal(food.id, 'carbs', parseInt(e.target.value))} className="w-16 bg-zinc-100 p-2 rounded-lg font-black text-xs" />
                                                                </div>
                                                                <div className="flex flex-col gap-1">
                                                                    <span className="text-[8px] font-black uppercase text-zinc-400">G</span>
                                                                    <input type="number" value={food.fats} onChange={(e) => updateCustomMeal(food.id, 'fats', parseInt(e.target.value))} className="w-16 bg-zinc-100 p-2 rounded-lg font-black text-xs" />
                                                                </div>
                                                                <div className="flex flex-col gap-1 ml-4 justify-center">
                                                                    <span className="text-[10px] font-black text-zinc-950">{food.calories} kcal</span>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-50 border border-zinc-100 ${accentColor}`}>{food.macros || `${food.protein}P / ${food.carbs}C / ${food.fats}G`}</span>
                                                                <span className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-zinc-950 text-white">{typeof food.calories === 'string' ? food.calories : `${food.calories} kcal`}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <AnimatePresence>
                                                {showMealInfo === i && (
                                                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-10 pt-10 border-t border-zinc-50">
                                                        <div className="bg-zinc-950 p-10 rounded-[2.5rem] flex gap-8 items-start shadow-2xl">
                                                            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-500"><Brain className="w-8 h-8" /></div>
                                                            <div>
                                                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 block underline decoration-emerald-900 underline-offset-8">Fundamentação Bioquímica</span>
                                                                <p className="text-lg font-medium text-zinc-400 italic leading-relaxed">"{food.science}"</p>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'treinos' && (
                            <motion.div key="treinos" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                {isPro ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {WORKOUTS.map((wk, i) => (
                                            <div key={i} className="bg-white rounded-[3rem] p-10 border border-zinc-200 transition-all hover:-translate-y-2 hover:shadow-2xl group">
                                                <div className="flex justify-between items-start mb-6">
                                                    <h4 className="text-3xl font-black text-zinc-900 italic tracking-tighter uppercase leading-none">{wk.title}</h4>
                                                    <Dumbbell className="w-6 h-6 text-zinc-200 group-hover:text-emerald-500 transition-colors" />
                                                </div>
                                                <p className="text-zinc-500 text-lg font-bold italic leading-tight mb-8">{wk.desc}</p>
                                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 bg-emerald-50 w-fit px-4 py-2 rounded-full border border-emerald-100 uppercase tracking-widest">
                                                    <Zap className="w-4 h-4" /> Hardcore Intensity
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-zinc-950 rounded-[4rem] p-24 text-center border border-zinc-800 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-24 opacity-5 rotate-12 scale-150"><Dumbbell className="w-96 h-96 text-white" /></div>
                                        <div className="bg-emerald-600/10 p-8 rounded-[2rem] w-fit mx-auto mb-12 border border-emerald-500/20 shadow-inner"><Lock className="w-16 h-16 text-emerald-500" /></div>
                                        <h3 className="text-5xl font-black text-white italic tracking-tighter uppercase mb-6 leading-none">Periodização <br />Bloqueada</h3>
                                        <p className="text-zinc-500 text-xl font-bold italic max-w-2xl mx-auto leading-relaxed mb-16">Para resultados de nível competição, seu treino precisa de ciência, não apenas esforço. O PRO entrega o mapa biomecânico completo.</p>
                                        <Link href="/pricing" className="bg-primary text-black font-black px-16 py-6 rounded-[2rem] text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-emerald-500/20 flex items-center gap-4 mx-auto w-fit">Injetar Upgrade Pro <Crown className="w-5 h-5" /></Link>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {activeTab === 'scanner' && (
                            <motion.div key="scanner" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-[calc(100vh-120px)] sm:h-[calc(100vh-80px)]">
                                <SupplementScanner isPro={!!isPro} userId={profile?.id || ''} />
                            </motion.div>
                        )}

                    </AnimatePresence >
                </div >
            </main >
        </div >
    );
}
