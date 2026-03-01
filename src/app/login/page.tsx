"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Activity, Mail, Lock, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (isLogin) {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.push("/dashboard");
            } else {
                const { error: signUpError, data } = await supabase.auth.signUp({
                    email,
                    password,
                });

                if (signUpError) throw signUpError;

                // Se der sucesso, pode logar direto ou pedir verificação
                // Como Mínimo, insira no banco de perfis
                if (data.user) {
                    const { error: profileError } = await supabase.from('profiles').insert({
                        id: data.user.id,
                        email: data.user.email,
                    });
                    if (profileError) {
                        console.error("Profile creation error: ", profileError);
                    }
                }

                router.push("/dashboard");
            }
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro durante a autenticação.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#020202] flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-[200px] opacity-10"></div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="sm:mx-auto sm:w-full sm:max-w-md z-10"
            >
                <div className="flex justify-center mb-6">
                    <Activity className="text-primary w-12 h-12" />
                </div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight italic">
                    {isLogin ? "BEM-VINDO DE VOLTA" : "CRIE SUA CONTA"}
                </h2>
                <p className="mt-2 text-center text-sm text-zinc-400">
                    Ou{" "}
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        className="font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                        {isLogin ? "crie uma conta de alta performance" : "faça login para continuar"}
                    </button>
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10 relative"
            >
                <div className="bg-zinc-950/50 backdrop-blur-xl py-8 px-4 shadow sm:rounded-2xl sm:px-10 border border-zinc-800">
                    <form className="space-y-6" onSubmit={handleAuth}>
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-zinc-300"
                            >
                                Endereço de Email
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-zinc-500" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 sm:text-sm bg-zinc-900 border-zinc-700 text-white rounded-lg focus:ring-primary focus:border-primary p-3 transition-colors"
                                    placeholder="seu@email.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-zinc-300"
                            >
                                Senha
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-zinc-500" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-10 sm:text-sm bg-zinc-900 border-zinc-700 text-white rounded-lg focus:ring-primary focus:border-primary p-3 transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="text-red-500 text-sm mt-2 font-medium bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-full text-black bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-[#020202] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? "Entrar" : "Criar Conta"}
                                        <span className="absolute right-4 flex items-center">
                                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
