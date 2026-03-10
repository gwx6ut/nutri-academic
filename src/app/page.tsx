"use client";

import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  Zap,
  Brain,
  Dna,
  Sparkles,
  Menu,
  X,
  Target,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  CheckCircle2
} from "lucide-react";
import Image from "next/image";

// Reusable animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 500], [1, 0]);
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationLinks = [
    { href: "#ciencia", label: "A Ciência" },
    { href: "#resultados", label: "Resultados" },
    { href: "/pricing", label: "Protocolos PRO" },
  ];

  return (
    <main className="relative min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-emerald-500/30 overflow-x-hidden">

      {/* GLOBAL LIGHTING EFFECTS */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-600/10 rounded-[100%] blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-teal-600/10 rounded-[100%] blur-[100px]" />
      </div>

      {/* NAVIGATION */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group z-50 relative">
            <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg shadow-emerald-500/10 group-hover:border-emerald-500/30 transition-colors">
              <Activity className="text-emerald-400 w-5 h-5 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-white flex items-center gap-1">
              Nutri<span className="text-zinc-500 font-normal">Academic</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs font-semibold tracking-wider text-zinc-400 hover:text-white transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-2 left-0 w-0 h-px bg-emerald-500 transition-all group-hover:w-full"></span>
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 z-50 relative">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-zinc-400 hover:text-white transition">
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden sm:flex items-center gap-4">
              <Link href="/login" className="text-xs font-semibold tracking-wider text-zinc-300 hover:text-white transition px-4 py-2">
                Acesso
              </Link>
              <Link href="/login" className="px-6 py-2.5 text-xs font-semibold text-zinc-950 bg-white hover:bg-zinc-200 rounded-full transition shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center gap-2">
                Iniciar Protocolo <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden absolute top-full left-0 right-0 bg-zinc-950/95 backdrop-blur-3xl border-b border-white/5 overflow-hidden"
            >
              <div className="p-6 flex flex-col gap-4">
                {navigationLinks.map((link) => (
                  <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="text-sm font-medium text-zinc-300 hover:text-white py-3 border-b border-white/5">
                    {link.label}
                  </Link>
                ))}
                <Link href="/login" onClick={() => setMenuOpen(false)} className="mt-4 px-6 py-4 text-center text-xs font-semibold tracking-wider text-zinc-950 bg-white rounded-xl">
                  Acessar Plataforma
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO SECTION */}
      <section className="relative min-h-[100svh] flex items-center justify-center pt-24 pb-12 px-6 lg:px-12 z-10 overflow-hidden">
        <motion.div style={{ opacity: heroOpacity, y: heroY }} className="max-w-5xl mx-auto w-full text-center flex flex-col items-center">

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-8"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] font-semibold text-zinc-300 tracking-[0.2em] uppercase">Engenharia Fisiológica V6.0</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.4 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-medium tracking-tight text-white mb-6 leading-[0.9] max-w-4xl"
          >
            Sua Melhor Versão, <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 via-white to-zinc-500 italic pr-4">Decodificada.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }}
            className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed mb-12"
          >
            O primeiro ecossistema de alta performance do Brasil a unir inteligência artificial, nutrição avançada e controle neural. Pare de advinhar, comece a executar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link href="/login" className="px-8 py-4 bg-white text-zinc-950 font-semibold rounded-full hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.15)] group">
              Injetar Protocolo <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#ciencia" className="px-8 py-4 bg-zinc-900 border border-white/10 text-white font-medium rounded-full hover:bg-zinc-800 hover:border-white/20 transition-all flex items-center justify-center gap-2">
              Entender a Ciência
            </Link>
          </motion.div>

          {/* Abstract Cinematic Visual below Hero text */}
          <motion.div
            initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.5, delay: 1 }}
            className="mt-20 relative w-full max-w-4xl mx-auto aspect-[21/9] rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-emerald-500/5 group"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent z-10" />
            <div className="absolute inset-0 bg-zinc-900 flex items-center justify-center">
              {/* Fallback pattern if image is missing, otherwise image */}
              <Image src="/whisk-hero.jpeg" alt="Atleta em alta performance" fill className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000 ease-out" />
            </div>
            {/* Overlay UI elements to look like software */}
            <div className="absolute bottom-6 left-6 z-20 flex items-end gap-4">
              <div className="p-4 bg-black/40 backdrop-blur-md rounded-2xl border border-white/5">
                <p className="text-[10px] text-zinc-400 tracking-wider mb-1">Taxa Metabólica</p>
                <p className="text-2xl font-semibold text-white">2.450 <span className="text-sm font-normal text-emerald-400">kcal/dia</span></p>
              </div>
            </div>
          </motion.div>

        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 hidden md:flex"
        >
          <span className="text-[8px] tracking-[0.3em] text-zinc-500 uppercase">Descubra</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-zinc-500 to-transparent relative">
            <motion.div
              animate={{ y: [0, 48, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="absolute top-0 left-[-1px] w-[3px] h-4 bg-emerald-500 rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* THE SCIENCE (BENTO BOX) */}
      <section id="ciencia" className="py-24 md:py-32 px-6 lg:px-12 relative z-10">
        <div className="max-w-7xl mx-auto">

          <motion.div
            variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}
            className="mb-16 md:mb-24"
          >
            <motion.h2 variants={fadeUp} className="text-3xl md:text-5xl font-medium tracking-tight mb-6">
              O Corpo Humano <br className="hidden md:block" />não aceita desculpas.
            </motion.h2>
            <motion.p variants={fadeUp} className="text-zinc-400 max-w-xl text-lg leading-relaxed">
              Substituímos o achismo por um motor de inferência algorítmica. O NutriAcademic cruza seus dados antropométricos diários e prescreve o exato caminho para a hipertrofia e definição.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 auto-rows-[300px]">

            {/* Bento 1: AI */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
              className="md:col-span-2 bg-zinc-900 border border-white/5 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group hover:border-white/10 transition-colors"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] group-hover:bg-emerald-500/10 transition-colors" />
              <Brain className="w-8 h-8 text-zinc-300 mb-6" />
              <h3 className="text-2xl font-medium mb-3">Inteligência Sintética</h3>
              <p className="text-zinc-400 max-w-md leading-relaxed">Algoritmos que analisam sua composição em tempo real, sugerindo ajustes calóricos micro-precisos baseados na sua progressão, evitando platôs.</p>
            </motion.div>

            {/* Bento 2: Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }}
              className="md:col-span-1 bg-zinc-900 border border-white/5 rounded-[2rem] p-8 flex flex-col justify-end relative overflow-hidden group hover:border-white/10 transition-colors"
            >
              <div className="absolute top-8 right-8 text-zinc-800 group-hover:text-zinc-700 transition-colors">
                <Activity className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-medium mb-2 relative z-10">O Sistema GRID</h3>
              <p className="text-zinc-400 text-sm relative z-10">Condicionamento neural através de metas e recompensas diárias.</p>
            </motion.div>

            {/* Bento 3: Nutrição Esportiva */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }}
              className="md:col-span-1 bg-gradient-to-br from-emerald-900/40 to-zinc-900 border border-emerald-500/20 rounded-[2rem] p-8 relative overflow-hidden group"
            >
              <Zap className="w-8 h-8 text-emerald-400 mb-6" />
              <h3 className="text-xl font-medium mb-2 text-white">Suplementação PRO</h3>
              <p className="text-emerald-500/80 text-sm leading-relaxed">Timings exatos e dosagens científicas para ergogênicos e recuperação.</p>
            </motion.div>

            {/* Bento 4: Scanner */}
            <motion.div
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }}
              className="md:col-span-2 bg-zinc-900 border border-white/5 rounded-[2rem] p-8 md:p-12 relative overflow-hidden group hover:border-white/10 transition-colors flex items-center justify-between"
            >
              <div>
                <ShieldCheck className="w-8 h-8 text-zinc-300 mb-6" />
                <h3 className="text-2xl font-medium mb-3">AI Label Scanner</h3>
                <p className="text-zinc-400 max-w-sm leading-relaxed">Digitalize rótulos de suplementos instantaneamente. Descubra o verdadeiro valor biológico do que você ingere.</p>
              </div>
              <div className="hidden md:flex w-32 h-32 rounded-full border border-dashed border-zinc-700 items-center justify-center relative">
                <div className="absolute inset-0 bg-emerald-500/5 rounded-full animate-pulse" />
                <Target className="w-8 h-8 text-zinc-500" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* RESULTS / PROOF */}
      <section id="resultados" className="py-24 md:py-32 px-6 lg:px-12 relative z-10 border-t border-white/5 bg-zinc-950/50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-16 justify-between items-center">

            <div className="flex-1">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
                <motion.span variants={fadeUp} className="text-xs font-semibold tracking-widest text-emerald-500 uppercase mb-4 block">Fisiologia em Números</motion.span>
                <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-medium tracking-tight mb-8">
                  Resultados que o espelho não pode negar.
                </motion.h2>
                <motion.p variants={fadeUp} className="text-zinc-400 text-lg leading-relaxed mb-12">
                  Construímos o NutriAcademic para ser inflexível com falhas. O resultado é um ambiente onde seus objetivos biológicos são matematicamente inevitáveis se você seguir o protocolo.
                </motion.p>
              </motion.div>

              <div className="grid grid-cols-2 gap-8">
                {[
                  { value: "3x", label: "Velocidade de Recomposição" },
                  { value: "100%", label: "Controle de Macros" },
                  { value: "24/7", label: "Monitoramento de Hábitos" },
                  { value: "0", label: "Margem para Erro" },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1, duration: 0.6 }} viewport={{ once: true }}
                    className="border-l-2 border-white/10 pl-6"
                  >
                    <div className="text-4xl font-semibold mb-2 text-white">{stat.value}</div>
                    <div className="text-xs text-zinc-500 font-medium tracking-wide">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex-1 w-full max-w-md relative">
              <div className="absolute inset-0 bg-emerald-500/5 blur-[100px] rounded-full" />
              <div className="relative bg-zinc-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-zinc-800 flex items-center justify-center"><Brain className="w-5 h-5 text-emerald-400" /></div>
                  <div>
                    <p className="text-sm font-medium text-white">Neural Status</p>
                    <p className="text-xs text-zinc-400">Sync Level: 92%</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                      </div>
                      <div className="h-2 flex-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${100 - (i * 15)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 text-center">
                  <p className="text-3xl font-medium text-white mb-1">Status Alpha</p>
                  <p className="text-xs font-semibold tracking-wider text-emerald-500 uppercase">Protocolo Otimizado</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA / BOTTOM */}
      <section className="py-32 px-6 lg:px-12 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950 to-zinc-900 z-0" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }}
          >
            <h2 className="text-4xl sm:text-6xl font-medium tracking-tight mb-8">
              O futuro da sua fisiologia <br className="hidden sm:block" /> começa no próximo clique.
            </h2>
            <p className="text-zinc-400 text-lg mb-12 max-w-xl mx-auto">Não espere a segunda-feira. Transforme seu smartphone no centro de comando do seu copo agora mesmo.</p>
            <Link href="/login" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-zinc-950 font-semibold rounded-full hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.1)] group text-sm">
              Criar Painel Grátis <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 bg-zinc-950 py-16 px-6 lg:px-12 relative z-10 text-zinc-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center md:items-start gap-12">

          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center gap-3 mb-4 opacity-50">
              <Activity className="w-5 h-5" />
              <span className="font-semibold tracking-tight text-white">NutriAcademic</span>
            </div>
            <p className="text-xs max-w-xs text-center md:text-left leading-relaxed">Software de alta performance para atletas e entusiastas. Ciência e precisão algorítmica.</p>
          </div>

          <div className="flex gap-16">
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium text-sm">Plataforma</h4>
              <Link href="/login" className="text-xs hover:text-white transition-colors">Acesso</Link>
              <Link href="/pricing" className="text-xs hover:text-white transition-colors">Protocolo PRO</Link>
            </div>
            <div className="flex flex-col gap-4">
              <h4 className="text-white font-medium text-sm">Legal</h4>
              <span className="text-xs cursor-not-allowed opacity-50">Privacidade</span>
              <span className="text-xs cursor-not-allowed opacity-50">Termos</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-[10px]">&copy; {new Date().getFullYear()} NutriAcademic. Todos os direitos reservados.</p>
          <p className="text-[10px] flex items-center gap-1">Desenvolvido no <span className="text-emerald-500">Brasil</span></p>
        </div>
      </footer>
    </main>
  );
}

