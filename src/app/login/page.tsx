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
        if (message.includes("Invalid login credentials"))
            return "Email ou senha incorretos. Verifique seus dados e tente novamente.";
        if (message.includes("Email not confirmed"))
            return "Seu email ainda não foi confirmado. Verifique sua caixa de entrada.";
        if (message.includes("User already registered"))
            return "Este email já está cadastrado. Tente fazer login.";
        if (message.includes("Password should be at least"))
            return "A senha deve ter pelo menos 6 caracteres.";
        if (message.includes("Unable to validate email address"))
            return "Endereço de email inválido.";
        if (message.includes("signup is disabled") || message.includes("signups are disabled"))
            return "O cadastro por email está desativado. Entre em contato com o suporte.";
        if (message.includes("logins are disabled"))
            return "O login por email está desativado. Entre em contato com o suporte.";
        if (message.includes("rate limit"))
            return "Muitas tentativas. Aguarde alguns minutos antes de tentar novamente.";
        if (message.includes("sending confirmation email") || message.includes("confirmation email"))
            return "EMAIL_CONFIRM_ERROR";
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

                const isEmailSendError =
                    signUpError?.message?.includes("sending confirmation email") ||
                    signUpError?.message?.includes("confirmation email");

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
        { icon: Zap, title: "IA Adaptativa", desc: "Planos que evoluem com você" },
        { icon: Target, title: "Metas Precisas", desc: "Macros calculados cientificamente" },
        { icon: Shield, title: "Dados Seguros", desc: "Criptografia de ponta a ponta" },
    ];

    return (
        <div className="min-h-screen flex bg-[#090c0a] font-sans overflow-hidden">

            {/* ── LEFT PANEL ── */}
            <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">

                {/* Grid background */}
                <div
                    className="absolute inset-0 opacity-[0.04]"
                    style={{
                        backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`,
                        backgroundSize: "60px 60px",
                    }}
                />

                {/* Green glow blobs */}
                <div className="absolute top-[-80px] left-[-80px] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-80px] right-[-80px] w-[400px] h-[400px] bg-emerald-400/8 rounded-full blur-[100px]" />

                {/* Logo */}
                <Link href="/" className="relative flex items-center gap-3 w-fit group">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-700 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
                        <Activity className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-black text-white uppercase italic tracking-tight">
                        Nutri<span className="text-green-400">Academic</span>
                    </span>
                </Link>

                {/* Hero text */}
                <div className="relative">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-xs font-bold text-green-400 uppercase tracking-widest">Performance Científica</span>
                        </div>

                        <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.05] tracking-tighter mb-6">
                            Nutrição<br />
                            <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                                de Elite
                            </span>
                        </h1>

                        <p className="text-zinc-400 text-lg leading-relaxed max-w-md mb-10">
                            Análises avançadas, recomendações personalizadas com IA e protocolos de alta performance para atletas sérios.
                        </p>

                        {/* Feature cards */}
                        <div className="flex flex-col gap-3">
                            {features.map(({ icon: Icon, title, desc }, i) => (
                                <motion.div
                                    key={title}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.2 + i * 0.1, duration: 0.5 }}
                                    className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                                        <Icon className="w-5 h-5 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{title}</p>
                                        <p className="text-xs text-zinc-500">{desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Bottom quote */}
                <p className="relative text-xs text-zinc-600 border-t border-white/5 pt-6">
                    © 2025 NutriAcademic. Todos os direitos reservados.
                </p>
            </div>

            {/* ── RIGHT PANEL ── */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 relative">

                {/* Mobile top bar */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-700 rounded-lg flex items-center justify-center">
                            <Activity className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm font-black text-white uppercase italic">
                            Nutri<span className="text-green-400">Academic</span>
                        </span>
                    </Link>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full max-w-[420px]"
                >
                    {/* Card */}
                    <div className="bg-[#0e1410] border border-white/[0.08] rounded-3xl p-8 shadow-2xl shadow-black/60">

                        {/* Tab toggle */}
                        <div className="flex gap-2 p-1 bg-white/[0.04] rounded-2xl mb-8">
                            {[
                                { label: "Entrar", value: true, icon: LogIn },
                                { label: "Criar Conta", value: false, icon: UserPlus },
                            ].map(({ label, value, icon: Icon }) => (
                                <button
                                    key={label}
                                    onClick={() => { setIsLogin(value); setFeedback(null); }}
                                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${isLogin === value
                                            ? "bg-green-500 text-white shadow-lg shadow-green-500/30"
                                            : "text-zinc-500 hover:text-zinc-300"
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
                                className="mb-7"
                            >
                                <h2 className="text-2xl font-black text-white mb-1">
                                    {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
                                </h2>
                                <p className="text-sm text-zinc-500">
                                    {isLogin
                                        ? "Entre para acessar seu dashboard de performance"
                                        : "Comece sua jornada de alta performance agora"}
                                </p>
                            </motion.div>
                        </AnimatePresence>

                        {/* Form */}
                        <form onSubmit={handleAuth} className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] hover:border-green-500/40 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 rounded-xl text-white text-sm placeholder:text-zinc-600 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
                                    Senha
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/[0.08] hover:border-green-500/40 focus:border-green-500 focus:ring-2 focus:ring-green-500/10 rounded-xl text-white text-sm placeholder:text-zinc-600 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            {/* Feedback */}
                            <AnimatePresence>
                                {feedback && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className={`text-sm font-medium p-3.5 rounded-xl flex items-start gap-2.5 ${feedback.isSuccess
                                                ? "bg-green-500/10 border border-green-500/20 text-green-400"
                                                : "bg-red-500/10 border border-red-500/20 text-red-400"
                                            }`}
                                    >
                                        <span className="mt-0.5 flex-shrink-0">{feedback.isSuccess ? "✅" : "⚠️"}</span>
                                        <span>{feedback.message}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-green-500 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-sm uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-green-500/20 hover:shadow-green-500/40 flex items-center justify-center gap-2 group mt-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? "Entrar Agora" : "Criar Conta"}
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Footer toggle */}
                        <p className="text-center text-xs text-zinc-600 mt-6">
                            {isLogin ? "Não tem conta? " : "Já tem uma conta? "}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setFeedback(null); }}
                                className="text-green-400 font-bold hover:text-green-300 transition-colors"
                            >
                                {isLogin ? "Crie agora" : "Faça login"}
                            </button>
                        </p>
                    </div>

                    {/* Bottom link */}
                    <p className="text-center text-xs text-zinc-700 mt-6">
                        <Link href="/pricing" className="hover:text-green-500 transition-colors">
                            Ver planos e preços →
                        </Link>
                    </p>
                </motion.div>
            </div>
        </div>
    );
}
