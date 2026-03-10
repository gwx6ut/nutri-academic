"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Mail, Lock, ArrowRight, Loader2, LogIn, UserPlus, Shield, Zap, Target } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [feedback, setFeedback] = useState<{ message: string; isSuccess: boolean } | null>(null);

    const router = useRouter();
    const supabase = createClient();

    const translateError = (message: string): string => {
        if (message.includes("Invalid login credentials")) return "Email ou senha incorretos. Verifique seus dados e tente novamente.";
        if (message.includes("Email not confirmed")) return "Seu email ainda não foi confirmado. Verifique sua caixa de entrada.";
        if (message.includes("User already registered")) return "Este email já está cadastrado. Tente fazer login.";
        if (message.includes("Password should be at least")) return "A senha deve ter pelo menos 6 caracteres.";
        if (message.includes("Unable to validate email address")) return "Endereço de email inválido.";
        if (message.includes("signup is disabled") || message.includes("signups are disabled")) return "O cadastro por email está desativado. Entre em contato com o suporte.";
        if (message.includes("logins are disabled")) return "O login por email está desativado. Entre em contato com o suporte.";
        if (message.includes("rate limit")) return "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.";
        if (message.includes("sending confirmation email") || message.includes("confirmation email")) return "EMAIL_CONFIRM_ERROR";
        return message || "Ocorreu um erro durante a autenticação.";
    };

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFeedback(null);

        try {
            if (isLogin) {
                const { data, error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;
                if (!data.session) {
                    setFeedback({ message: "Não foi possível iniciar a sessão. Tente novamente.", isSuccess: false });
                    return;
                }
                router.push("/dashboard");
            } else {
                const { error: signUpError, data } = await supabase.auth.signUp({ email, password });
                const isEmailSendError = signUpError?.message?.includes("sending confirmation email") || signUpError?.message?.includes("confirmation email");
                if (signUpError && !isEmailSendError) throw signUpError;
                const user = data?.user;

                if (!isEmailSendError && user && !data.session) {
                    setFeedback({ message: "✅ Cadastro realizado! Verifique seu email para confirmar sua conta antes de entrar.", isSuccess: true });
                    setLoading(false);
                    return;
                }

                if (user) {
                    await supabase.from("profiles").upsert(
                        { id: user.id, email: user.email, plan_type: "free", is_admin: false },
                        { onConflict: "id" }
                    );
                }
                router.push("/dashboard");
            }
        } catch (err: any) {
            setFeedback({ message: translateError(err.message), isSuccess: false });
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: Zap, title: "Inteligência Sintética", desc: "Algoritmos que analisam sua composição em tempo real" },
        { icon: Target, title: "O Sistema GRID", desc: "Condicionamento neural através de metas diárias" },
        { icon: Shield, title: "Suplementação PRO", desc: "Timings exatos e dosagens científicas para ergogênicos" },
    ];

    return (
        <div className="min-h-screen flex bg-zinc-950 font-sans overflow-hidden selection:bg-emerald-500/30">

            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden border-r border-white/5 bg-zinc-950">

                {/* Subdued Background Effects */}
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-[100%] blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/5 rounded-[100%] blur-[100px]" />

                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-3 w-fit group z-10">
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
                        <Activity className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    </div>
                    <span className="text-xl font-semibold tracking-tight text-white flex items-center gap-1">
                        Nutri<span className="text-zinc-500 font-normal">Academic</span>
                    </span>
                </Link>

                {/* Hero text */}
                <div className="relative z-10">
                    <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: "easeOut" }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[10px] font-semibold text-zinc-300 tracking-[0.2em] uppercase">Engenharia Fisiológica V6.0</span>
                        </div>

                        <h1 className="text-5xl xl:text-6xl font-medium tracking-tight text-white leading-[1.05] mb-6">
                            Bem-vindo de volta <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 via-white to-zinc-500 italic pr-4">ao Sistema.</span>
                        </h1>

                        <p className="text-zinc-400 text-lg leading-relaxed max-w-md mb-12">
                            Acesse seu painel central. Seus protocolos, macros e condicionamento neural aguardam sua execução.
                        </p>

                        {/* Feature cards */}
                        <div className="flex flex-col gap-4">
                            {features.map(({ icon: Icon, title, desc }, i) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                                    className="flex items-center gap-4 p-5 rounded-2xl bg-zinc-900/50 border border-white/5 backdrop-blur-sm group hover:border-white/10 transition-colors"
                                >
                                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-zinc-800 transition-colors">
                                        <Icon className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white mb-1">{title}</p>
                                        <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom quote */}
                <p className="relative z-10 text-xs text-zinc-600 border-t border-white/5 pt-6 mt-12 flex items-center justify-between">
                    <span>© {new Date().getFullYear()} NutriAcademic. Todos os direitos reservados.</span>
                    <span className="flex items-center gap-1">Status: <span className="text-emerald-500 font-medium">Operacional</span></span>
                </p>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative bg-zinc-950 overflow-hidden">
                <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-emerald-600/5 rounded-[100%] blur-[120px] pointer-events-none" />

                {/* Mobile top bar */}
                <div className="absolute top-6 left-6 lg:hidden z-10">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg shadow-emerald-500/10">
                            <Activity className="w-4 h-4 text-emerald-400" />
                        </div>
                        <span className="text-sm font-semibold tracking-tight text-white flex items-center gap-1">
                            Nutri<span className="text-zinc-500 font-normal">Academic</span>
                        </span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-[420px] relative z-10"
                >
                    {/* Card */}
                    <div className="bg-zinc-900/80 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 md:p-10 shadow-2xl">

                        {/* Tab toggle */}
                        <div className="flex gap-2 p-1 bg-zinc-950/50 rounded-xl mb-10 border border-white/5">
                            {[
                                { label: "Injetar Protocolo", value: true, icon: LogIn },
                                { label: "Criar Acesso", value: false, icon: UserPlus },
                            ].map(({ label, value, icon: Icon }) => (
                                <button
                                    key={label}
                                    onClick={() => { setIsLogin(value); setFeedback(null); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${isLogin === value
                                        ? "bg-white text-zinc-950 shadow-md"
                                        : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {label}
                                </button>
                            ))}
                        </div>

                        {/* Heading */}
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={isLogin ? "login" : "signup"}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.2 }}
                                className="mb-8 text-center"
                            >
                                <h2 className="text-2xl font-medium tracking-tight text-white mb-2">
                                    {isLogin ? "Acessar Dashboard" : "Iniciar Nova Jornada"}
                                </h2>
                                <p className="text-sm text-zinc-400">
                                    {isLogin
                                        ? "Autentique-se para sincronizar seus dados biológicos."
                                        : "O primeiro passo para a hipertrofia e definição decodificada."}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleAuth} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-1">
                                    Identificação (Email)
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@dominio.com"
                                        className="w-full pl-11 pr-4 py-3.5 bg-zinc-950 border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 rounded-xl text-white text-sm placeholder:text-zinc-600 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 px-1">
                                    Código de Segurança (Senha)
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3.5 bg-zinc-950 border border-white/10 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 rounded-xl text-white text-sm placeholder:text-zinc-600 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Feedback */}
                            <AnimatePresence>
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8, height: 0 }}
                                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className={`text-sm font-medium p-4 rounded-xl flex items-start gap-3 ${feedback.isSuccess
                                            ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                                            : "bg-red-500/10 border border-red-500/20 text-red-400"
                                            }`}
                                    >
                                        <span className="mt-0.5 flex-shrink-0">{feedback.isSuccess ? "✅" : "⚠️"}</span>
                                        <span className="leading-relaxed">{feedback.message}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 mt-2 bg-white hover:bg-zinc-200 text-zinc-950 disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-sm rounded-xl transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? "Acessar Sistema" : "Inicializar Conta"}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer toggle */}
                        <p className="text-center text-xs text-zinc-500 mt-8">
                            {isLogin ? "Sem credenciais? " : "Já possui acesso? "}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setFeedback(null); }}
                                className="text-white font-medium hover:text-emerald-400 transition-colors"
                            >
                                {isLogin ? "Solicitar acesso" : "Autorizar entrada"}
                            </button>
                        </p>
                    </div>

                    {/* Bottom link */}
                    <p className="text-center text-xs text-zinc-500 mt-8">
                        <Link href="/pricing" className="hover:text-white transition-colors flex items-center justify-center gap-2 group">
                            Explorar Protocolos PRO <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
