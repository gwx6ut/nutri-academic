"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight, Activity, ShieldCheck, Flame, Medal,
  Dna, Zap, Target, Brain, CheckCircle2,
  Instagram, Twitter, Github, Mail, ArrowUpRight,
  ChevronRight, Lock, Sparkles, Trophy, MousePointer2
} from "lucide-react";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2, delayChildren: 0.3 },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 10 } },
} as const;

export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#050505] text-white selection:bg-primary selection:text-black font-sans">

      {/* BARRA DE NAVEGAÇÃO */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-8 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm">
        <div className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-gradient-to-br from-[#CCFF00] to-[#4A7A00] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(204,255,0,0.3)] group-hover:scale-110 transition-transform">
            <Activity className="text-black w-6 h-6" />
          </div>
          <span className="text-2xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-[#CCFF00] to-[#4A7A00] bg-clip-text text-transparent">NutriAcademic</span>
        </div>
        <div className="hidden md:flex items-center gap-10">
          <Link href="#features" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#CCFF00] transition-colors">Tecnologia</Link>
          <Link href="#science" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#CCFF00] transition-colors">Ciência</Link>
          <Link href="/pricing" className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#CCFF00] transition-colors">Planos</Link>
          <Link href="/login" className="px-6 py-2 border border-zinc-800 rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">Portal Alpha</Link>
        </div>
      </nav>

      {/* SEÇÃO HERO */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/whisk-hero.jpeg"
            alt="Ambiente de Performance NutriAcademic"
            fill
            className="object-cover object-center opacity-30 grayscale-[10%]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/60 via-transparent to-[#050505]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)]"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#CCFF00] rounded-full mix-blend-soft-light filter blur-[180px] opacity-10 z-0"></div>

        <motion.div
          className="z-10 flex flex-col items-center text-center px-6 max-w-6xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="mb-8 flex items-center space-x-3 bg-zinc-900/80 backdrop-blur-xl border border-white/5 px-6 py-3 rounded-2xl shadow-2xl"
          >
            <Sparkles className="text-[#CCFF00] w-4 h-4 animate-pulse" />
            <span className="text-zinc-400 font-black tracking-[0.3em] uppercase text-[9px]">Motor de Performance Neural 2.0</span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-6xl md:text-[10rem] font-black italic tracking-tight leading-[0.85] mb-8 uppercase"
          >
            EVOLUÇÃO <br />
            <span className="bg-gradient-to-r from-[#CCFF00] to-[#4A7A00] bg-clip-text text-transparent pr-4 translate-x-2 inline-block">INTELIGENTE</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto mb-14 font-medium leading-relaxed italic"
          >
            Sua jornada fitness guiada por algoritmos avançados. <br className="hidden md:block" />
            Não é apenas uma dieta, é engenharia para o seu corpo.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 items-center justify-center w-full max-w-2xl mx-auto">
            <Link
              href="/login"
              className="group relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-6 font-black uppercase tracking-[0.2em] text-black bg-gradient-to-r from-[#CCFF00] to-[#BDFF00] rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(204,255,0,0.15)]"
            >
              <span className="relative z-10 flex items-center gap-3 text-xs italic">
                Começar Agora <ChevronRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </span>
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto px-10 py-6 bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center justify-center gap-3"
            >
              <Trophy className="w-4 h-4 text-zinc-500" /> Ver Planos Elite
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer"
        >
          <span className="text-[8px] font-black uppercase tracking-[0.4em] text-zinc-600">O Mapa da Evolução</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#CCFF00] to-transparent opacity-50"></div>
        </motion.div>
      </section>

      {/* BANNER DE ACESSO RESTRITO */}
      <div className="bg-[#CCFF00]/5 border-y border-white/5 py-4 overflow-hidden whitespace-nowrap">
        <div className="flex animate-marquee gap-20">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center gap-4">
              <Lock className="w-3 h-3 text-[#CCFF00] opacity-50" />
              <span className="text-[10px] font-black uppercase tracking-[1em] text-zinc-500">AUTENTICAÇÃO NECESSÁRIA PARA ACESSO AO SISTEMA</span>
            </div>
          ))}
        </div>
      </div>

      {/* SEÇÃO DE TECNOLOGIA */}
      <section id="features" className="py-40 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group h-[600px] rounded-[3rem] overflow-hidden border border-zinc-800 shadow-[0_50px_100px_rgba(0,0,0,0.5)]"
            >
              <Image
                src="/whisk-hero.jpeg"
                alt="Prévia da Tecnologia"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              <div className="absolute bottom-12 left-12 right-12">
                <div className="bg-black/80 backdrop-blur-2xl p-8 rounded-[2rem] border border-white/10 shadow-2xl">
                  <p className="bg-gradient-to-r from-[#CCFF00] to-[#4A7A00] bg-clip-text text-transparent font-black uppercase text-[9px] tracking-[0.4em] mb-4">Display em Tempo Real</p>
                  <h4 className="text-3xl font-black italic uppercase pr-6 leading-none mb-6">Interface de <br /> Alta Precisão</h4>
                  <div className="space-y-3">
                    <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                      <motion.div className="h-full bg-gradient-to-r from-[#CCFF00] to-[#4A7A00]" initial={{ width: 0 }} whileInView={{ width: "92%" }} transition={{ duration: 1.5 }} />
                    </div>
                    <div className="flex justify-between text-[10px] font-black uppercase text-zinc-500">
                      <span>Sincronia Metabólica</span>
                      <span className="text-white">92%</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-12">
              <div>
                <h2 className="bg-gradient-to-r from-[#CCFF00] to-[#4A7A00] bg-clip-text text-transparent font-black uppercase tracking-widest text-xs mb-6 flex items-center gap-3">
                  <div className="w-8 h-[1px] bg-[#CCFF00]"></div> SISTEMA NUTRIACADEMIC
                </h2>
                <h3 className="text-5xl md:text-7xl font-black italic uppercase pr-10 leading-[0.9] tracking-tighter mb-10">
                  CHEGA DE <br /> <span className="text-zinc-500 opacity-30">ADIVINHAR.</span>
                </h3>
                <p className="text-zinc-400 text-lg leading-relaxed font-medium mb-12 italic">
                  NutriAcademic não é apenas um app de dieta. É uma ferramenta para quem busca o máximo de resultados com base em dados reais e ciência aplicada.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {[
                  { title: "Modos Dinâmicos", desc: "Mude entre Cutting (perda) e Bulking (ganho) instantaneamente.", icon: Zap },
                  { title: "Catálogo Inteligente", desc: "Sugestões de refeições baseadas no que você tem disponível.", icon: Target },
                  { title: "O Grid", desc: "Sistema de hábitos para manter sua disciplina no topo todos os dias.", icon: Activity }
                ].map((item, i) => (
                  <Link key={i} href="/login" className="group flex items-center gap-8 p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/80 transition-all hover:border-[#CCFF00]/20">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-[#CCFF00]/30 transition-all shadow-inner shadow-zinc-800">
                      <item.icon className="w-6 h-6 text-zinc-500 group-hover:text-[#CCFF00] transition-colors" />
                    </div>
                    <div>
                      <h4 className="font-black italic uppercase tracking-tighter mb-1">{item.title}</h4>
                      <p className="text-xs text-zinc-500 font-medium leading-relaxed">{item.desc}</p>
                    </div>
                    <Lock className="w-4 h-4 ml-auto text-zinc-800 group-hover:text-zinc-600 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CHAMADA PARA AÇÃO - LOGIN */}
      <section className="py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="p-16 rounded-[4rem] bg-zinc-900 border border-white/5 shadow-2xl space-y-12"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#CCFF00]/10 border border-[#CCFF00]/20 rounded-full">
              <MousePointer2 className="w-4 h-4 text-[#CCFF00]" />
              <p className="text-[10px] font-black uppercase text-[#CCFF00] tracking-widest">Acesso Restrito</p>
            </div>

            <h3 className="text-5xl font-black italic uppercase leading-none pr-4 tracking-tighter">
              Somente Para <br /> <span className="bg-gradient-to-r from-[#CCFF00] to-[#4A7A00] bg-clip-text text-transparent pr-6 translate-x-3 inline-block">Membros Elite</span>
            </h3>

            <p className="text-zinc-500 font-bold max-w-xl mx-auto leading-relaxed">
              O acesso completo ao ecossistema NutriAcademic requer login. Proteja seus dados e sincronize sua evolução com nossa tecnologia.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/login" className="px-12 py-6 bg-gradient-to-r from-[#CCFF00] to-[#BDFF00] text-black font-black uppercase tracking-widest text-[11px] rounded-[1.75rem] shadow-[0_20px_40px_rgba(204,255,0,0.15)] hover:scale-105 active:scale-95 transition-all">Sincronizar Agora</Link>
              <Link href="/login" className="px-12 py-6 bg-zinc-800 text-white font-black uppercase tracking-widest text-[11px] rounded-[1.75rem] hover:bg-zinc-700 transition-all">Criar Conta</Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex items-center gap-4 group">
            <Activity className="text-[#CCFF00] w-8 h-8 group-hover:scale-110 transition-transform" />
            <span className="text-2xl font-black italic uppercase tracking-tighter bg-gradient-to-r from-[#CCFF00] to-[#4A7A00] bg-clip-text text-transparent">NutriAcademic</span>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">© 2024 NutriAcademic Bio-Systems. Acesso Restrito.</p>
          <div className="flex gap-6">
            <Link href="/login" className="text-zinc-600 hover:text-white transition-colors"><Lock className="w-5 h-5" /></Link>
            <Link href="/login" className="text-zinc-600 hover:text-white transition-colors"><Mail className="w-5 h-5" /></Link>
            <Link href="/login" className="text-zinc-600 hover:text-white transition-colors"><Instagram className="w-5 h-5" /></Link>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        .stroke-text {
          -webkit-text-stroke: 1px rgba(255,255,255,0.2);
          color: transparent;
        }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </main>
  );
}
