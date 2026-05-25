import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  Code, 
  CheckCircle, 
  ArrowRight, 
  ChevronDown, 
  Github, 
  Zap,
  Star,
  Terminal,
  Cpu
} from "lucide-react";

// Richer, higher density scatter distribution for floating background particles / starry sky
const BACKGROUND_PARTICLES = Array.from({ length: 32 }, (_, idx) => {
  const colors = [
    "bg-indigo-400/50 shadow-[0_0_8px_rgba(129,140,248,0.5)]", 
    "bg-pink-400/40 shadow-[0_0_8px_rgba(244,114,182,0.4)]", 
    "bg-yellow-300/40 shadow-[0_0_8px_rgba(253,224,71,0.4)]", 
    "bg-violet-400/50 shadow-[0_0_8px_rgba(167,139,250,0.5)]",
    "bg-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
  ];
  return {
    id: idx,
    x: [8, 22, 38, 52, 68, 82, 12, 28, 44, 58, 72, 88, 18, 34, 48, 62, 78, 92, 5, 25, 45, 65, 85, 95, 15, 35, 55, 75, 50, 60, 40, 30][idx],
    y: [18, 78, 48, 8, 68, 38, 88, 28, 58, 12, 82, 42, 72, 22, 52, 2, 62, 32, 45, 15, 85, 55, 25, 65, 95, 5, 35, 75, 40, 20, 80, 60][idx],
    size: (idx % 4 === 0) ? 7 : (idx % 3 === 0) ? 5 : (idx % 2 === 0) ? 3 : 2,
    delay: (idx * 0.4) % 6,
    duration: 8 + ((idx * 4) % 12),
    color: colors[idx % colors.length]
  };
});

// Cool drifting developer tag elements to look extremely catchy on the tech-focused portfolio layout
const DRIFTING_TAGS = [
  { text: "TypeScript", x: 10, y: 16, delay: 0, duration: 25, color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5" },
  { text: "React 19", x: 82, y: 12, delay: 3, duration: 22, color: "text-pink-400 border-pink-500/20 bg-pink-500/5" },
  { text: "Gemini Pro", x: 74, y: 58, delay: 1, duration: 28, color: "text-purple-400 border-purple-500/20 bg-purple-500/5" },
  { text: "Solidity", x: 14, y: 64, delay: 4, duration: 26, color: "text-violet-400 border-violet-500/20 bg-violet-500/5" },
  { text: "Tailwind CSS", x: 48, y: 6, delay: 2, duration: 21, color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5" },
  { text: "Node CJS", x: 88, y: 44, delay: 5, duration: 24, color: "text-yellow-400 border-yellow-500/20 bg-yellow-400/5" },
  { text: "Web3", x: 5, y: 38, delay: 2.5, duration: 27, color: "text-rose-400 border-rose-500/20 bg-rose-500/5" },
];

interface Props {
  onStartBuilding: () => void;
  onLoginClick: () => void;
}

export default function LandingPage({ onStartBuilding, onLoginClick }: Props) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [demoPrompt, setDemoPrompt] = useState("A Lead Blockchain security specialist based in Zurich with neon purple cyberpunk design");
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoOutput, setDemoOutput] = useState<any | null>(null);

  const handleRunDemo = () => {
    setDemoLoading(true);
    setTimeout(() => {
      setDemoLoading(false);
      setDemoOutput({
        name: "Devon Mercer",
        title: "Principal Blockchain Architect",
        location: "Zurich, Switzerland",
        topSkills: ["Solidity", "Go", "Rust", "ZK-Proofs", "Tailwind"],
        headline: "Synthesizing zero-knowledge node consensus with glowing visual terminals."
      });
    }, 1200);
  };

  const samplePrompts = [
    "A lead blockchain security specialist based in Zurich with neon purple cyberpunk design",
    "Creative visual storyteller and UX researcher in San Francisco with minimal soft shadows style",
    "Startup technical co-founder with achievement boards and bold orange accent styling"
  ];

  return (
    <div className="w-full bg-slate-950 text-slate-100 flex flex-col items-center relative overflow-hidden">
      {/* Dynamic Grid Background Accent with gentle pulse animation */}
      <motion.div 
        animate={{ opacity: [0.12, 0.28, 0.12] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-0 inset-x-0 h-[800px] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_80%,transparent_100%)] pointer-events-none select-none z-0" 
      />

      {/* Decorative Floating AI Glow Orbs and Ambient Particles */}
      <div className="absolute top-0 inset-x-0 h-[800px] overflow-hidden pointer-events-none select-none z-0">
        
        {/* Colorful dynamic morphing glowing backdrop (Aurora) */}
        <motion.div 
          animate={{
            rotate: [0, 120, 240, 360],
            scale: [1, 1.15, 0.9, 1],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-[-10%] left-[20%] w-[550px] h-[550px] bg-gradient-to-tr from-indigo-500/20 via-pink-500/10 to-transparent rounded-full blur-[130px] opacity-75"
        />

        {/* Indigo drifting deep orb */}
        <motion.div 
          animate={{
            x: [0, 50, -40, 0],
            y: [0, -60, 70, 0],
            scale: [1, 1.25, 0.85, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[6%] left-[10%] w-[380px] h-[380px] bg-indigo-600/20 rounded-full blur-[110px]"
        />

        {/* Pink drifting energetic orb */}
        <motion.div 
          animate={{
            x: [0, -60, 40, 0],
            y: [0, 70, -50, 0],
            scale: [1, 0.8, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[10%] right-[10%] w-[360px] h-[360px] bg-pink-500/15 rounded-full blur-[100px]"
        />

        {/* Cyan/Cyan cool lighting element */}
        <motion.div 
          animate={{
            x: [-20, 20, -10, -20],
            y: [30, -30, 10, 30],
            scale: [0.8, 1.1, 0.9, 0.8],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[25%] left-[30%] w-[260px] h-[260px] bg-cyan-400/10 rounded-full blur-[90px]"
        />

        {/* Animated concentric tech-rings coordinates */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] flex items-center justify-center opacity-30">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="absolute w-[450px] h-[450px] border border-dashed border-indigo-500/20 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute w-[300px] h-[300px] border border-dotted border-pink-500/20 rounded-full"
          />
          <div className="absolute w-[150px] h-[150px] border border-slate-700/30 rounded-full" />
        </div>

        {/* Cosmic drifting smart developer web tags (Drifting behind Hero for rich tech texture) */}
        {DRIFTING_TAGS.map((tag, idx) => (
          <motion.div
            key={idx}
            style={{
              left: `${tag.x}%`,
              top: `${tag.y}%`
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, 15, 0],
              opacity: [0.2, 0.75, 0.2]
            }}
            transition={{
              duration: tag.duration,
              delay: tag.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className={`absolute px-3 py-1 text-[10px] font-mono font-bold tracking-wider rounded-full border shadow-sm pointer-events-none select-none backdrop-blur-[3px] z-10 ${tag.color}`}
          >
            {tag.text}
          </motion.div>
        ))}

        {/* Gentle drifting warm particle spots */}
        {BACKGROUND_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
            }}
            className={`absolute rounded-full pointer-events-none select-none ${p.color}`}
            animate={{
              y: [0, -110, 0],
              opacity: [0.2, 0.9, 0.2],
              scale: [1, 1.8, 1],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl w-full px-6 pt-24 pb-16 text-center space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wide uppercase shadow-[0_0_15px_rgba(99,102,241,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> Profyl AI is officially live
        </motion.div>
        
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white max-w-5xl mx-auto leading-tight">
          Build Stunning AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-300 drop-shadow-[0_0_35px_rgba(99,102,241,0.3)]">Portfolios</span> in Minutes.
        </h1>
        
        <p className="text-slate-400 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed">
          The elite SaaS platform optimized for developers, startup founders, and designers. Let Gemini draft premium interactive layouts with zero complex setup.
        </p>

        {/* Action button grouping */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartBuilding}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-lg shadow-indigo-900/50 text-sm font-black tracking-wider uppercase transition flex items-center justify-center gap-2 cursor-pointer relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10 flex items-center gap-2">
              Create Your Portfolio <ArrowRight className="w-4 h-4" />
            </span>
          </motion.button>
        </div>
      </section>

      {/* AI Prompt Generator Interactive Live Demo */}
      <section className="relative z-10 max-w-5xl w-full px-6 pb-24">
        <div className="bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-2xl shadow-2xl space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-4">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-400" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-2">DEMO_SANDBOX // Interactive AI Draft Engine</h4>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-slate-400 tracking-wider">Describe your ideal professional design concept:</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text" 
                value={demoPrompt}
                onChange={(e) => setDemoPrompt(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 text-sm text-slate-200 px-4 py-3 rounded-xl focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 outline-none"
              />
              <button 
                onClick={handleRunDemo}
                disabled={demoLoading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition shrink-0 flex items-center gap-2"
              >
                {demoLoading ? "Engineering..." : "Generate Demo"} <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Selector helper chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {samplePrompts.map((p, idx) => (
                <button 
                  key={idx}
                  onClick={() => setDemoPrompt(p)}
                  className="text-[11px] text-indigo-300 bg-indigo-950/40 hover:bg-indigo-900/30 border border-indigo-900/30 px-3 py-1 rounded-full transition"
                >
                  #{idx + 1}: {p.slice(0, 36)}...
                </button>
              ))}
            </div>
          </div>

          {/* Inline Sandbox output preview frame */}
          {demoLoading && (
            <div className="p-8 border border-dashed border-slate-800 rounded-xl bg-slate-950 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-500 font-mono tracking-wider">AI_ENGINE IS DRAFTING COMPOSITIONS AND BIO SCRIPTS...</p>
            </div>
          )}

          {!demoLoading && demoOutput && (
            <div className="border border-slate-800 rounded-xl bg-slate-950 p-5 space-y-4 animate-fadeIn">
              <div className="flex justify-between items-start flex-wrap gap-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <div>
                  <h5 className="font-extrabold text-white text-base">{demoOutput.name}</h5>
                  <p className="text-indigo-400 text-xs font-semibold">{demoOutput.title}</p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20 rounded-full">
                  📍 {demoOutput.location}
                </span>
              </div>
              
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Suggested Headline Draft:</p>
                <p className="text-slate-300 text-xs sm:text-sm bg-slate-900/25 p-2 rounded border border-slate-800 italic">
                  "{demoOutput.headline}"
                </p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest font-mono">Suggested Key Skills:</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {demoOutput.topSkills.map((s: string, idx: number) => (
                    <span key={idx} className="text-[10px] bg-slate-900 px-2 py-0.5 text-yellow-500 rounded border border-slate-800 font-mono">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button 
                  onClick={onStartBuilding}
                  className="text-xs font-semibold text-indigo-400 hover:text-white flex items-center gap-1 group transition"
                >
                  Create actual editable portfolio from this <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-200" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Five Templates Showcase Slider Grid */}
      <section className="relative z-10 max-w-7xl w-full px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest">Premium Layouts</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">5 High-Performance Templates</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">Designed to capture corporate respect, hacker vibes, or minimalist investor pitches.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-pink-500/40 duration-200">
            <div>
              <Terminal className="w-8 h-8 text-pink-500 mb-3" />
              <h4 className="font-bold text-slate-200 text-sm sm:text-base">1. Cyberpunk Terminal</h4>
              <p className="text-slate-400 text-xs mt-2 line-clamp-3">Glowing grids, scanline layers, neon variables, and terminal styled layout boards.</p>
            </div>
            <span className="text-[10px] text-pink-500 bg-pink-500/10 border border-pink-500/20 px-2 py-0.5 rounded uppercase font-mono max-w-fit mt-4">Hacker Theme</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/40 duration-200">
            <div>
              <Layers className="w-8 h-8 text-indigo-400 mb-3" />
              <h4 className="font-bold text-slate-200 text-sm sm:text-base">2. Glassmorphism</h4>
              <p className="text-slate-400 text-xs mt-2 line-clamp-3">Frosted blur backdrops, radial vectors, float cards, and modern translucent typography.</p>
            </div>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded uppercase font-mono max-w-fit mt-4">Silicon Valley</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-blue-500/40 duration-200">
            <div>
              <ShieldCheck className="w-8 h-8 text-blue-500 mb-3" />
              <h4 className="font-bold text-slate-200 text-sm sm:text-base">3. Corporate Pro</h4>
              <p className="text-slate-400 text-xs mt-2 line-clamp-3">Ultra ATS-friendly blueprint conforming strictly to executive expectations and corporate standards.</p>
            </div>
            <span className="text-[10px] text-blue-500 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase font-mono max-w-fit mt-4">ATS Preferred</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-yellow-500/40 duration-200">
            <div>
              <Zap className="w-8 h-8 text-yellow-500 mb-3" />
              <h4 className="font-bold text-slate-200 text-sm sm:text-base">4. Creative Designer</h4>
              <p className="text-slate-400 text-xs mt-2 line-clamp-3">Thick solid borders, bright color cards, and bold display fonts pairing for product artists.</p>
            </div>
            <span className="text-[10px] text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-2 py-0.5 rounded uppercase font-mono max-w-fit mt-4">Bold Contrast</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-amber-500/40 duration-200">
            <div>
              <Cpu className="w-8 h-8 text-amber-500 mb-3" />
              <h4 className="font-bold text-slate-200 text-sm sm:text-base">5. Startup Founder</h4>
              <p className="text-slate-400 text-xs mt-2 line-clamp-3">Inspired by high-level pitch desks, featuring daily stats, achievement boards, and timeline grids.</p>
            </div>
            <span className="text-[10px] text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-mono max-w-fit mt-4">Pitch Inspired</span>
          </div>
        </div>
      </section>

      {/* Feature capabilities grid grid */}
      <section className="relative z-10 max-w-7xl w-full px-6 py-16 space-y-12">
        <div className="border border-slate-800 bg-slate-900/40 p-10 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Gemini API Integrator</h4>
            <p className="text-slate-400 text-xs sm:text-sm">We call server-side Gemini generation models to rewrite weak bios, invent layout structures, suggest skills, and generate color themes.</p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 flex items-center justify-center text-pink-400 border border-pink-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Advanced Analytics Dashboard</h4>
            <p className="text-slate-400 text-xs sm:text-sm">Observe recruiter visit metrics, resume downloads, country location distributions, mobile/desktop ratios, and daily charts.</p>
          </div>

          <div className="space-y-3">
            <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-400 border border-yellow-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-white text-base">Instant SEO &amp; Subdomains</h4>
            <p className="text-slate-400 text-xs sm:text-sm">Publish interactive portfolios under search optimized SEO metadata settings, and host under a beautiful custom slug or domain instantly.</p>
          </div>
        </div>
      </section>

      {/* Pricing options section */}
      <section className="relative z-10 max-w-6xl w-full px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest font-mono">Suggested Pricing</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white">Choose Your Professional Level</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">Upgrade to premium representation anytime via instant simulated payment gateway checkout.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Free plan box */}
          <div className="border border-slate-800 bg-slate-900/40 p-6 rounded-2xl flex flex-col justify-between space-y-5 hover:border-slate-700 transition">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-white text-sm">Free</h4>
                <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">Basic</span>
              </div>
              <p className="text-3xl font-black text-white font-mono">₹0 <span className="text-xs text-slate-500 font-medium font-sans">/ month</span></p>
              <p className="text-slate-400 text-xs">Essential hosting plan for graduates and junior developers looking for quick basic setups.</p>
              
              <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-slate-800/80">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Max 1 Portfolio Page</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Basic Template Themes</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> 5 AI Model Content Runs</li>
                <li className="flex items-center gap-2 text-slate-600 line-through">&times; Advanced Analytics Charts</li>
                <li className="flex items-center gap-2 text-slate-600 line-through">&times; Custom Domain Names</li>
              </ul>
            </div>
            
            <button 
              onClick={onStartBuilding}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-755 text-slate-200 text-xs font-bold uppercase rounded-xl transition"
            >
              Start For Free
            </button>
          </div>

          {/* Student Pro plan box */}
          <div className="border border-indigo-900/60 bg-slate-900/40 p-6 rounded-2xl flex flex-col justify-between space-y-5 hover:border-indigo-700/60 transition">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-white text-sm">Student Pro</h4>
                <span className="text-[9px] font-mono bg-indigo-950/80 text-indigo-400 px-2 py-0.5 rounded border border-indigo-900/40 uppercase">Academic</span>
              </div>
              <p className="text-3xl font-black text-white font-mono">₹99 <span className="text-xs text-indigo-400 font-medium font-sans">/ month</span></p>
              <p className="text-slate-400 text-xs">A special student tier offering advanced features to boost your academic profile.</p>
              
              <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-slate-800/80">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Up to 3 Portfolios</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Cyberpunk & Founder Themes</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Unlimited AI Creations</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> General Custom Domains</li>
                <li className="flex items-center gap-2 text-slate-600 line-through">&times; Premium Recharts Analytics</li>
              </ul>
            </div>
            
            <button 
              onClick={onStartBuilding}
              className="w-full py-2.5 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 text-xs font-bold uppercase rounded-xl transition border border-indigo-800/40"
            >
              Get Student Pro
            </button>
          </div>

          {/* Premium plan box */}
          <div className="border-2 border-indigo-500 bg-slate-900 p-6 rounded-2xl flex flex-col justify-between space-y-5 relative hover:shadow-indigo-950/30 hover:shadow-2xl transition">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-500 text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow-md">
              PRO CHOICE
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-white text-sm">Premium</h4>
                <span className="text-[9px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900/50 px-2 py-0.5 rounded uppercase">Best Seller</span>
              </div>
              <p className="text-3xl font-black text-white font-mono">₹299 <span className="text-xs text-indigo-400 font-medium font-sans">/ month</span></p>
              <p className="text-slate-400 text-xs">Unlock all customized templates, visitor charts, custom domains, and instant PDF/CV exports.</p>
              
              <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-indigo-900/30">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Unlimited Portfolios</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> All Present Templates</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Unlimited AI Generative Calls</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Full Telemetry Metrics Charts</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Custom Domain Integration</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Instant PDF CV Exports</li>
              </ul>
            </div>
            
            <button 
              onClick={onStartBuilding}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-755 text-white text-xs font-black uppercase tracking-wider rounded-xl transition shadow-lg"
            >
              Unlock Premium
            </button>
          </div>

          {/* Lifetime plan box */}
          <div className="border border-yellow-600/55 bg-slate-900/40 p-6 rounded-2xl flex flex-col justify-between space-y-5 hover:border-yellow-500 transition">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-white text-sm">Lifetime</h4>
                <span className="text-[9px] font-mono bg-yellow-950/80 text-yellow-500 px-2 py-0.5 rounded border border-yellow-950/40 uppercase">Infinite</span>
              </div>
              <p className="text-3xl font-black text-white font-mono">₹1499 <span className="text-xs text-yellow-600 font-medium font-sans">one-time</span></p>
              <p className="text-slate-400 text-xs">Unlock supreme lifetime credentials: pay once, host your portfolios absolutely forever.</p>
              
              <ul className="space-y-2 text-xs text-slate-300 pt-4 border-t border-slate-800/80">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" /> Unlimited Portfolios Slots</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" /> Present & Future Templates</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" /> Priority AI Key Allocations</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" /> Custom Domain Maps</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" /> VIP Enterprise Support</li>
              </ul>
            </div>
            
            <button 
              onClick={onStartBuilding}
              className="w-full py-2.5 bg-yellow-600 hover:bg-yellow-700 text-slate-950 text-xs font-black uppercase rounded-xl transition"
            >
              Get Lifetime Plan
            </button>
          </div>
        </div>

        {/* Dynamic quote/notes for Indian Students exactly matching requested photo */}
        <div className="max-w-md mx-auto text-center p-5 bg-gradient-to-r from-indigo-950/30 to-slate-900 border border-slate-800/80 rounded-2xl animate-pulse space-y-1">
          <p className="text-xs font-mono text-slate-400">For Indian students:</p>
          <p className="text-sm font-black text-indigo-400">₹99–149/month works well.</p>
        </div>
      </section>

      {/* Frequently Asked Questions FAQ */}
      <section className="relative z-10 max-w-4xl w-full px-6 py-16 space-y-6">
        <h3 className="text-center font-bold text-xs uppercase tracking-widest text-indigo-400">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {[
            {
              q: "How does the AI portfolio generation helper work?",
              a: "We pass your brief layout prompts (such as role, tech stacks, and locations) server-side to the Gemini 3.5 API. Using pre-defined JSON schemas, it generates high-quality technical bios, suggests projects tailored to the niche, and returns styled section models."
            },
            {
              q: "Can I connect my own custom internet domain name?",
              a: "Yes! Premium tier users can configure a customized domain (e.g. portfolio.yourname.com or portfolio-site) automatically from their accounts management toolbar."
            },
            {
              q: "Is there a real ATS-optimized layout compliant with executive screeners?",
              a: "Yes, our Corporate Professional template conforms exactly to global parsing standards, ensuring machine parsers and high-end executive agencies score your records perfectly."
            },
            {
              q: "How are visit numbers and project clicks calculated?",
              a: "Every template has simulated or active REST API tracker bindings. When a client or hiring agency views your profile, clicks custom projects, or hits PDF resume, statistics are updated inside your analytics charts instantly."
            }
          ].map((item, idx) => {
            const open = activeFaq === idx;
            return (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden transition">
                <button 
                  onClick={() => setActiveFaq(open ? null : idx)}
                  className="w-full text-left px-5 py-4 flex justify-between items-center bg-slate-900 hover:bg-slate-850 duration-150 gap-4"
                >
                  <span className="font-bold text-sm text-slate-200">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transform transition ${open ? "rotate-180" : ""}`} />
                </button>
                {open && (
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-400 leading-relaxed border-t border-slate-850 bg-slate-950/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="w-full py-8 border-t border-slate-900 text-center text-xs text-slate-600">
        <p>&copy; 2026 K² Technologies. Developed under the owner Koustubh Katti. All rights reserved. {/* Platform Engine: v2 */}</p>
      </footer>
    </div>
  );
}
