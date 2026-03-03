"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Activity,
  BarChart3,
  Zap,
  Target,
  Brain,
  Users,
  Dna,
  ChevronRight,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import Image from "next/image";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring", stiffness: 100 },
};

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigationLinks = [
    { href: "#recursos", label: "Recursos" },
    { href: "#beneficios", label: "Benefícios" },
    { href: "/pricing", label: "Preços" },
  ];

  return (
    <main className="relative min-h-screen bg-white text-black font-sans overflow-x-hidden">
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-4 w-96 h-96 bg-green-400/5 rounded-full blur-3xl" />
      </div>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-green-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-green-400 to-green-700 rounded-lg flex items-center justify-center shadow-lg shadow-green-400/20">
              <Activity className="text-white w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="text-lg sm:text-xl font-black bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent uppercase italic">
              NutriAcademic
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-semibold text-black hover:text-green-600 transition">
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition">
              {menuOpen ? <X className="w-6 h-6 text-green-600" /> : <Menu className="w-6 h-6 text-green-600" />}
            </button>

            <Link href="/login" className="hidden sm:block px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-black hover:text-green-600 transition">
              Login
            </Link>
            <Link href="/login" className="px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 rounded-lg transition min-h-[44px] flex items-center uppercase font-black">
              Começar
            </Link>
          </div>
        </div>

        {/* Mobile menu expanded */}
        {menuOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="md:hidden bg-white backdrop-blur border-t border-green-200 p-6 space-y-4">
            {navigationLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-black hover:text-green-600 hover:bg-green-50 rounded-lg transition min-h-[44px] flex items-center">
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setMenuOpen(false)} className="block px-4 py-3 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg transition min-h-[44px] flex items-center uppercase font-black">
              Login
            </Link>
          </motion.div>
        )}
      </nav>

      {/* Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-40 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} initial="initial" animate="animate" className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 border border-green-300 rounded-full mb-6 bg-green-50 backdrop-blur">
              <Sparkles className="w-4 h-4 text-green-600" />
              <span className="text-xs sm:text-sm font-black text-green-700 uppercase tracking-wider">Revolução em Nutrição Esportiva</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-[0.9]">
              <span className="block text-black">Performance</span>
              <span className="bg-gradient-to-r from-green-500 via-green-600 to-green-700 bg-clip-text text-transparent">Otimizada</span>
            </h1>

            <p className="text-lg sm:text-xl text-black max-w-2xl mx-auto leading-relaxed mb-8">Análises genômicas, suplementação científica e planos personalizados para atletas que querem mais.</p>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16 sm:mb-32">
            <Link href="/login" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black rounded-xl transition-all min-h-[52px] flex items-center justify-center gap-2 uppercase tracking-wider shadow-lg shadow-green-600/30">
              Começar Grátis <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/pricing" className="w-full sm:w-auto px-8 py-4 border-2 border-green-500 hover:border-green-600 text-green-600 hover:text-green-700 hover:bg-green-50 font-black rounded-xl transition-all min-h-[52px] flex items-center justify-center gap-2 uppercase tracking-wider">
              Ver Planos <ChevronRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} initial="initial" animate="animate" transition={{ delay: 0.3 }} className="relative rounded-2xl overflow-hidden shadow-2xl shadow-green-600/20 aspect-video border border-green-200">
            <Image src="/whisk-hero.jpeg" alt="Hero" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="recursos" className="relative py-20 sm:py-40 px-4 sm:px-6 lg:px-8 z-10 border-t border-green-200">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight"><span className="text-black">Tecnologia</span> <span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Avançada</span></h2>
            <p className="text-black text-base sm:text-lg max-w-2xl mx-auto">Ferramentas científicas para otimizar seu corpo e performance</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[
              { icon: Dna, title: "Análise Genômica", desc: "Personalizações baseadas em seu perfil genético" },
              { icon: BarChart3, title: "Dashboard Intuitivo", desc: "Métricas em tempo real de performance" },
              { icon: Zap, title: "Suplementos IA", desc: "Recomendações otimizadas por algoritmo" },
              { icon: Users, title: "Comunidade Pro", desc: "Network com atletas e profissionais" },
              { icon: Brain, title: "IA Adaptativa", desc: "Algoritmo que aprende com seus dados" },
              { icon: Target, title: "Planos 360°", desc: "Estratégias personalizadas por esporte" },
            ].map((f, i) => (
              <motion.div key={i} variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 bg-gradient-to-br from-green-50 to-white rounded-2xl border border-green-200 hover:border-green-400 hover:shadow-xl hover:shadow-green-600/20 transition-all group">
                <f.icon className="w-12 h-12 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-black mb-3 text-black">{f.title}</h3>
                <p className="text-black text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section id="beneficios" className="relative py-20 sm:py-40 px-4 sm:px-6 lg:px-8 z-10 border-t border-green-200">
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="text-center mb-16 sm:mb-24">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 tracking-tight"><span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Resultados</span> <span className="text-black">Comprovados</span></h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {[
              { number: "3x", text: "Mais eficiente na otimização nutricional" },
              { number: "2x", text: "Redução de tempo em análises" },
              { number: "95%", text: "Taxa de satisfação entre atletas" },
              { number: "500+", text: "Combinações de suplementos analisadas" },
            ].map((b, i) => (
              <motion.div key={i} variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-8 bg-gradient-to-r from-green-100 to-green-50 rounded-2xl border border-green-300 group">
                <div className="text-4xl sm:text-5xl font-black bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform origin-left">{b.number}</div>
                <p className="text-lg text-black">{b.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 sm:py-32 px-4 sm:px-6 lg:px-8 z-10">
        <motion.div variants={fadeInUp} initial="initial" whileInView="animate" viewport={{ once: true }} className="max-w-4xl mx-auto bg-gradient-to-r from-green-50 via-white to-green-50 rounded-3xl p-12 sm:p-16 text-center border border-green-300 backdrop-blur">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 text-black tracking-tight">Pronto para<br /><span className="bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">Descolar?</span></h2>
          <p className="text-lg sm:text-xl text-black mb-8 max-w-2xl mx-auto">Junte-se a centenas de atletas que já otimizaram sua performance com NutriAcademic</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-400 hover:to-green-500 text-white font-black rounded-2xl transition-all min-h-[56px] uppercase tracking-wider shadow-lg shadow-green-600/30 hover:scale-105">Começar Agora <ArrowRight className="w-5 h-5" /></Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-green-200 bg-gradient-to-b from-white to-green-50 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-700 rounded-lg flex items-center justify-center">
                  <Activity className="text-white w-5 h-5" />
                </div>
                <span className="font-black bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent uppercase">NutriAcademic</span>
              </div>
              <p className="text-black text-sm">Nutrição científica para atletas em busca de performance máxima.</p>
            </div>

            <div>
              <h4 className="text-black font-black mb-4 uppercase">Produto</h4>
              <ul className="space-y-2 text-sm text-black">
                <li><Link href="/pricing" className="hover:text-green-600 transition">Preços</Link></li>
                <li><Link href="/nutricao-esportiva" className="hover:text-green-600 transition">Nutrição Esportiva</Link></li>
                <li><Link href="/dashboard" className="hover:text-green-600 transition">Dashboard</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-black font-black mb-4 uppercase">Legal</h4>
              <ul className="space-y-2 text-sm text-black">
                <li><a href="#" className="hover:text-green-600 transition">Privacidade</a></li>
                <li><a href="#" className="hover:text-green-600 transition">Termos</a></li>
                <li><a href="#" className="hover:text-green-600 transition">Contato</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-green-200 pt-8 text-center text-sm text-black">
            <p>&copy; 2026 NutriAcademic. Todos os direitos reservados. Desenvolvido com ⚡ para atletas.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
