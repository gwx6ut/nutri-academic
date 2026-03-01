"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, Check, Clock, Users, Zap, TrendingUp, DollarSign, Activity } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type PaymentRequest = {
    id: number;
    user_id: string;
    user_email: string;
    status: string;
};

type Stats = {
    totalUsers: number;
    pendingRequests: number;
    totalRevenue: number;
};

export default function AdminPage() {
    const [requests, setRequests] = useState<PaymentRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const [stats, setStats] = useState<Stats>({ totalUsers: 0, pendingRequests: 0, totalRevenue: 0 });

    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const checkAdminAndFetchRequests = async () => {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                router.push("/login");
                return;
            }

            const { data: profile } = await supabase
                .from("profiles")
                .select("is_admin")
                .eq("id", user.id)
                .single();

            if (!profile?.is_admin) {
                router.push("/dashboard");
                return;
            }

            setIsAdmin(true);

            // Fetch Requests
            const { data: requestsData } = await supabase
                .from("payment_requests")
                .select("*")
                .eq("status", "pending")
                .order('id', { ascending: false });

            if (requestsData) {
                setRequests(requestsData);
            }

            // Fetch Stats
            const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            const { count: proCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('plan_type', 'pro');

            setStats({
                totalUsers: userCount || 0,
                pendingRequests: requestsData?.length || 0,
                totalRevenue: (proCount || 0) * 10
            });

            setLoading(false);
        };

        checkAdminAndFetchRequests();
    }, [router, supabase]);

    const approvePayment = async (requestId: number, userId: string, email: string) => {
        try {
            const { error: requestError } = await supabase
                .from("payment_requests")
                .update({ status: 'approved' })
                .eq("id", requestId);

            if (requestError) {
                console.error("Erro ao atualizar status:", requestError);
                alert(`Erro ao atualizar pagamento: ${requestError.message}`);
                return;
            }

            const { error: profileError } = await supabase
                .from("profiles")
                .upsert({
                    id: userId,
                    email: email,
                    plan_type: 'pro',
                    is_admin: false
                }, { onConflict: 'id' });

            if (profileError) {
                console.error("Erro ao atualizar perfil:", profileError);
                alert(`Erro ao liberar Plano PRO: ${profileError.message}\n\nDica: Verifique se o RLS permite que o Admin altere/insira outros perfis.`);
                return;
            }

            setRequests(requests.filter(r => r.id !== requestId));
            setStats(prev => ({
                ...prev,
                pendingRequests: prev.pendingRequests - 1,
                totalRevenue: prev.totalRevenue + 10
            }));
            alert("Sucesso! O usuário agora é PRO.");
        } catch (err) {
            console.error("Approve Error:", err);
            alert("Erro inesperado ao aprovar pagamento.");
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-[#020202] flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    if (!isAdmin) return null;

    return (
        <div className="min-h-screen bg-[#020202] p-8 md:p-12 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full filter blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-600/5 rounded-full filter blur-[100px] pointer-events-none"></div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
                    <Link href="/dashboard" className="text-zinc-500 hover:text-white flex items-center gap-2 transition font-black uppercase text-[10px] tracking-widest">
                        <ArrowLeft className="w-4 h-4" /> Painel de Controle
                    </Link>
                    <div className="flex items-center gap-3 text-primary bg-primary/10 px-6 py-2.5 rounded-2xl border border-primary/20 shadow-[0_0_20px_rgba(204,255,0,0.1)]">
                        <ShieldCheck className="w-5 h-5" />
                        <span className="font-black text-xs tracking-[0.2em] uppercase">Auth: Nutri-Master Alpha</span>
                    </div>
                </div>

                <div className="mb-16">
                    <h1 className="text-5xl md:text-7xl font-black italic text-white mb-4 uppercase tracking-tighter leading-none">
                        CENTRAL <br />
                        <span className="text-primary glow-text">DE CONTROLE</span>
                    </h1>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-[10px] ml-1">Gerenciamento de Ativos e Fluxo de Caixa</p>
                </div>

                {/* STATS RIBBON */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {[
                        { label: "Usuários Ativos", val: stats.totalUsers, icon: Users, color: "zinc-400" },
                        { label: "Pendentes (PIX)", val: stats.pendingRequests, icon: Clock, color: "orange-500" },
                        { label: "Receita (BRL)", val: `R$ ${stats.totalRevenue}`, icon: TrendingUp, color: "emerald-500" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 p-8 rounded-[2rem] shadow-xl flex items-center justify-between group hover:border-zinc-700 transition-all">
                            <div>
                                <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-2">{stat.label}</p>
                                <p className="text-4xl font-black text-white italic tracking-tighter">{stat.val}</p>
                            </div>
                            <div className={`p-4 rounded-2xl bg-black border border-zinc-800 text-${stat.color} group-hover:scale-110 transition-transform`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center gap-4 mb-8">
                    <h2 className="text-2xl font-black text-white uppercase italic tracking-tight">Queue de Aprovação</h2>
                    <div className="h-px flex-1 bg-zinc-900"></div>
                </div>

                {requests.length === 0 ? (
                    <div className="bg-zinc-900/30 border-2 border-dashed border-zinc-800/50 rounded-[3rem] p-20 text-center flex flex-col items-center">
                        <Check className="w-16 h-16 text-zinc-800 mb-6" />
                        <h3 className="text-2xl font-black text-zinc-600 uppercase italic">Sistema Sincronizado</h3>
                        <p className="text-zinc-700 font-bold uppercase tracking-widest text-[10px] mt-2">Zero solicitações pendentes no buffer</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {requests.map((req) => (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                key={req.id}
                                className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 hover:bg-zinc-900/80 transition-all"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-orange-500/10 text-orange-500 rounded-3xl flex items-center justify-center border border-orange-500/20 shadow-inner">
                                        <Zap className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <p className="text-xl font-black text-white tracking-tight italic uppercase">{req.user_email}</p>
                                        <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.2em] mt-2">ID: {req.user_id.substring(0, 12)}...</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-6 w-full lg:w-auto">
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-1">Status</p>
                                        <p className="text-orange-500 text-xs font-black uppercase italic">Aguardando Validação</p>
                                    </div>
                                    <button
                                        onClick={() => approvePayment(req.id, req.user_id, req.user_email)}
                                        className="bg-primary text-black font-black text-xs uppercase tracking-[0.2em] px-10 py-5 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 flex-1 lg:flex-none"
                                    >
                                        Liberar Acesso Pro
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* Footer Decor */}
                <div className="mt-20 flex items-center justify-center gap-4 opacity-10">
                    <Activity className="w-4 h-4 text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em]">Nutri-Admin OS v5.2</span>
                    <Activity className="w-4 h-4 text-zinc-500" />
                </div>
            </div>
        </div>
    );
}
