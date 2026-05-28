import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Cpu,
  Monitor,
  Smartphone,
  Tablet,
  X,
  Eye,
  Layout,
  Flame,
  MousePointer,
  Globe,
  Share2,
  Lock,
  MessageSquare,
  ThumbsUp,
  MapPin,
  ListFilter,
  Loader2
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import TemplatesPreview from "./TemplatesPreview";
import { PortfolioData } from "../types";

// Standard top-tier mock database for templates live presentation
const MOCK_PREVIEW_PROFILE: PortfolioData = {
  id: "demo-id",
  userId: "demo-user",
  title: "Koustubh Katti | Engineering Showcase",
  templateId: "glassmorphism",
  accentColor: "#6366f1",
  isPublished: true,
  slug: "koustubh",
  personalInfo: {
    name: "Koustubh Katti",
    title: "Lead AI Systems Architect",
    bio: "Pioneering distributed serverless architecture paradigms & telemetry pipelines. Built systems scaled to 10M+ operations under load with K² Technologies.",
    email: "kattikoustubh22@gmail.com",
    location: "Zurich, Switzerland",
    linkedin: "linkedin.com/in/koustubh",
    github: "github.com/koustubh",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=256&auto=format&fit=crop",
    headline: "Engineering resilient server fabrics, hyper-growth cloud models, and advanced visual telemetry dashboards."
  },
  skills: ["TypeScript", "Node.js", "Express", "Firebase", "Go", "Docker", "Kubernetes", "Distributed Systems", "AI Engineering"],
  projects: [
    {
      id: "p1",
      name: "Nebula telemetry engine",
      description: "A real-time data ingestion pipeline mapping click-through events under extreme 50,000 req/sec load.",
      url: "https://github.com",
      technologies: ["Node.js", "Prometheus", "Kafka"]
    },
    {
      id: "p2",
      name: "Quant ledger consensus",
      description: "Secure cryptographic payment processing routing compliant transactions with state-machine safety checks.",
      url: "https://github.com",
      technologies: ["Rust", "WebAssembly", "Solidity"]
    }
  ],
  experience: [
    {
      id: "e1",
      company: "K² Technologies",
      role: "Chief Architect & Owner",
      duration: "2024 - Present",
      description: "Orchestrated distributed cluster migrators, reducing database replication latencies by up to 24% while managing 8 core engineers."
    },
    {
      id: "e2",
      company: "Silicon Valley Lab",
      role: "Lead Platform Engineer",
      duration: "2022 - 2024",
      description: "Spearheaded Cloud Native ingress frameworks, optimizing container startup latency thresholds from 4.2 seconds to 450ms."
    }
  ],
  certifications: [
    {
      id: "c1",
      title: "AWS Certified Developer",
      issuer: "Amazon Web Services",
      date: "Jan 2025"
    }
  ],
  testimonials: [
    {
      id: "t1",
      clientName: "Devon Mercer",
      role: "VP of Product at Google AI Studio",
      text: "Koustubh is an exceptional server systems architect. He completed our mission-critical distributed platform migrations 3 weeks ahead of target."
    }
  ]
};

// Background starry particles arrangement
const BACKGROUND_PARTICLES = Array.from({ length: 40 }, (_, idx) => {
  const colors = [
    "bg-indigo-400/50 shadow-[0_0_8px_rgba(129,140,248,0.5)]", 
    "bg-pink-400/40 shadow-[0_0_8px_rgba(244,114,182,0.4)]", 
    "bg-yellow-300/40 shadow-[0_0_8px_rgba(253,224,71,0.4)]", 
    "bg-violet-400/50 shadow-[0_0_8px_rgba(167,139,250,0.5)]",
    "bg-cyan-400/50 shadow-[0_0_8px_rgba(34,211,238,0.5)]"
  ];
  return {
    id: idx,
    x: [5, 22, 38, 52, 68, 82, 12, 28, 44, 58, 72, 88, 18, 34, 48, 62, 78, 92, 5, 25, 45, 65, 85, 95, 15, 35, 55, 75, 50, 60, 40, 30, 10, 20, 70, 80, 90, 6, 86, 96][idx],
    y: [18, 78, 48, 8, 68, 38, 88, 28, 58, 12, 82, 42, 72, 22, 52, 2, 62, 32, 45, 15, 85, 55, 25, 65, 95, 5, 35, 75, 40, 20, 80, 60, 10, 90, 30, 70, 50, 6, 84, 98][idx],
    size: (idx % 4 === 0) ? 6 : (idx % 3 === 0) ? 4 : (idx % 2 === 0) ? 3 : 2,
    delay: (idx * 0.3) % 5,
    duration: 6 + ((idx * 3) % 10),
    color: colors[idx % colors.length]
  };
});

// Shimmering developer web tech tags
const DRIFTING_TAGS = [
  { text: "TypeScript", x: 10, y: 14, delay: 0, duration: 25, color: "text-indigo-400 border-indigo-500/20 bg-indigo-500/5" },
  { text: "React 19", x: 84, y: 11, delay: 3, duration: 22, color: "text-pink-400 border-pink-500/20 bg-pink-500/5" },
  { text: "Gemini 3.5", x: 76, y: 56, delay: 1, duration: 28, color: "text-purple-400 border-purple-500/20 bg-purple-500/5" },
  { text: "Tailwind v4", x: 45, y: 8, delay: 2, duration: 21, color: "text-cyan-400 border-cyan-500/20 bg-cyan-500/5" },
  { text: "Express CJS", x: 88, y: 40, delay: 5, duration: 24, color: "text-yellow-400 border-yellow-500/20 bg-yellow-400/5" },
];

const ANALYTICS_GRAPH_DATA = [
  { day: "Mon", count: 240 },
  { day: "Tue", count: 480 },
  { day: "Wed", count: 320 },
  { day: "Thu", count: 750 },
  { day: "Fri", count: 610 },
  { day: "Sat", count: 980 },
  { day: "Sun", count: 1250 }
];

interface Props {
  onStartBuilding: () => void;
  onLoginClick: () => void;
}

export default function LandingPage({ onStartBuilding, onLoginClick }: Props) {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [activeInspirationTab, setActiveInspirationTab] = useState<'ai_engineer' | 'designer' | 'founder' | 'corporate'>('ai_engineer');

  // AI Typewriter Demo Section State Machine 
  const targetPromptText = "Generate a Cyberpunk AI Engineer Portfolio with modern animations and recruiter-focused design.";
  const [demoPromptText, setDemoPromptText] = useState("");
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [aiStepsState, setAiStepsState] = useState<string[]>([]);
  const [demoLoading, setDemoLoading] = useState(false);
  const [demoOutput, setDemoOutput] = useState<any | null>(null);

  // Template Preview system state
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Launch automatic prompt typing simulation on load
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < targetPromptText.length) {
        setDemoPromptText((prev) => prev + targetPromptText.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        // Start processing output automatically after typing finishes!
        triggerAiSimulation();
      }
    }, 40);
    return () => clearInterval(interval);
  }, []);

  const triggerAiSimulation = () => {
    setDemoLoading(true);
    setDemoOutput(null);
    setAiStepsState([]);
    setCurrentStepIndex(0);

    const stages = [
      "⚡ [INIT] Ingesting schema directives and parsing layout parameters...",
      "🤖 [LLM] Calling server-side Gemini 3.5 API JSON blueprints...",
      "🎨 [STYLING] Applying Cyberpunk neon variables & active scanline assets...",
      "🚀 [COMPILED] Finished! Rendered professional web candidate preview below."
    ];

    let currentStage = 0;
    const stageTimer = setInterval(() => {
      if (currentStage < stages.length) {
        setAiStepsState((prev) => [...prev, stages[currentStage]]);
        currentStage++;
      } else {
        clearInterval(stageTimer);
        setDemoLoading(false);
        setDemoOutput({
          name: "Devon Mercer",
          title: "Lead Deep-Learning Architect",
          location: "Zurich, Switzerland",
          topSkills: ["Solidity", "Rust", "TensorFlow", "Generative Networks", "React 19"],
          headline: "Synthesizing reactive multi-agent system state with glowing visual terminal shells."
        });
      }
    }, 600);
  };

  const templatesList = [
    {
      id: "cyberpunk",
      name: "Developer Cyberpunk",
      desc: "Cyberpunk neon console, glowing grids, responsive scanline textures, and real-time terminal output logs.",
      tags: ["hacker mode", "matrix grids", "neon", "premium"],
      accent: "#ec4899"
    },
    {
      id: "glassmorphism",
      name: "Minimal Glassmorphism",
      desc: "Translucent frosted-glass panels, smooth responsive layouts, floating glow layers, and elegant typography.",
      tags: ["modern tech", "blur backdrops", "silicon valley"],
      accent: "#6366f1"
    },
    {
      id: "professional",
      name: "Corporate Professional",
      desc: "Conforms meticulously to corporate parsing systems, utilizing high-contrast structure for optimal executive parsing scores.",
      tags: ["ATS preferred", "high readability", "standard"],
      accent: "#3b82f6"
    },
    {
      id: "creative",
      name: "Creative Designer",
      desc: "Bold thick outline frames, cartoonishly catchy interactive layouts, and solid high-contrast designer badges.",
      tags: ["retro aesthetic", "high-contrast", "illustrator"],
      accent: "#f59e0b"
    },
    {
      id: "founder",
      name: "Startup Founder",
      desc: "Perfect representation of venture pitch decks, featuring real-time achievement scorecards, growth steps, and project galleries.",
      tags: ["pitch inspired", "telemetry indicators", "founder core", "premium"],
      accent: "#10b981"
    }
  ];

  const handleOpenLivePreview = (templateId: string) => {
    const updatedData = {
      ...MOCK_PREVIEW_PROFILE,
      templateId: templateId as any
    };
    setPreviewTemplate(updatedData);
  };

  return (
    <div className="w-full bg-slate-950 text-slate-100 flex flex-col items-center relative overflow-hidden select-none">
      
      {/* Decorative Grid Background */}
      <div className="absolute top-0 inset-x-0 h-[1000px] bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_85%,transparent_100%)] pointer-events-none z-0" />

      {/* Decorative Floating AI Glow Orbs */}
      <div className="absolute top-0 inset-x-0 h-[800px] overflow-hidden pointer-events-none select-none z-0">
        <motion.div 
          animate={{ rotate: 360, scale: [1, 1.15, 0.95, 1] }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-10%] left-[25%] w-[600px] h-[600px] bg-gradient-to-tr from-indigo-505/20 via-pink-500/10 to-transparent rounded-full blur-[140px] opacity-70"
        />
        <motion.div 
          animate={{ x: [0, 40, -40, 0], y: [0, -40, 60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[8%] left-[8%] w-[420px] h-[420px] bg-indigo-600/25 rounded-full blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -50, 40, 0], y: [0, 60, -40, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[12%] right-[8%] w-[400px] h-[400px] bg-pink-500/20 rounded-full blur-[110px]"
        />

        {/* Drifting Tags */}
        {DRIFTING_TAGS.map((tag, idx) => (
          <motion.div
            key={idx}
            style={{ left: `${tag.x}%`, top: `${tag.y}%` }}
            animate={{ y: [0, -35, 0], x: [0, 10, 0], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: tag.duration, delay: tag.delay, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute px-4 py-1.5 text-[10px] font-mono font-bold tracking-widest rounded-full border shadow-lg backdrop-blur-[4px] z-10 ${tag.color}`}
          >
            {tag.text}
          </motion.div>
        ))}

        {/* background dots */}
        {BACKGROUND_PARTICLES.map((p) => (
          <motion.div
            key={p.id}
            style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
            className={`absolute rounded-full pointer-events-none ${p.color}`}
            animate={{ y: [0, -100, 0], opacity: [0.15, 0.85, 0.15], scale: [1, 1.6, 1] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      {/* Hero Header Section */}
      <section className="relative z-10 max-w-7xl w-full px-6 pt-32 pb-16 text-center space-y-8">
        
        {/* Dynamic Micro-Badge */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(99,102,241,0.25)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" /> 
          PROFYL.AI: THE PLATFORM BUILT FOR CREATIVE BUILDERS
        </motion.div>

        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white max-w-6xl mx-auto leading-none">
          Build Stunning AI-Powered <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-pink-400 to-yellow-300 drop-shadow-[0_0_35px_rgba(99,102,241,0.35)] font-sans">
            Portfolios
          </span> in Minutes.
        </h1>

        <p className="text-slate-450 text-base sm:text-xl max-w-3xl mx-auto leading-relaxed">
          Generate professional, recruiter-optimized portfolios, resumes, and personal brand pages with advanced AI telemetry. Say goodbye to standard static layouts.
        </p>

        {/* Call to action grouping */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
          <motion.button 
            whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(99,102,241,0.4)" }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartBuilding}
            className="w-full sm:w-auto px-8 py-4.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xl text-xs font-black tracking-widest uppercase transition flex items-center justify-center gap-2.5 cursor-pointer relative overflow-hidden group"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500/20 to-indigo-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span>CREATE YOUR DRAFT COMPOSITION</span> 
            <ArrowRight className="w-4 h-4 text-pink-300 group-hover:translate-x-1 duration-200" />
          </motion.button>

          <motion.button 
            whileHover={{ scale: 1.02 }}
            onClick={onLoginClick}
            className="w-full sm:w-auto px-7 py-4 bg-slate-900 hover:bg-slate-850 text-slate-350 border border-slate-800 hover:text-white rounded-xl text-xs font-black tracking-widest uppercase transition cursor-pointer"
          >
            CLAIM YOUR UNIQUE SLUG
          </motion.button>
        </div>
      </section>

      {/* Visual representation of high density layout - Screen mockups */}
      <section className="relative z-10 max-w-7xl w-full px-6 pb-20">
        <div className="relative bg-slate-900/60 border border-slate-800 p-2 md:p-4 rounded-2xl shadow-3xl overflow-hidden group">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-300" />
          
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 px-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-400" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-400" />
            </div>
            <div className="bg-slate-950 px-6 py-1 rounded text-[10px] font-mono text-slate-500 tracking-wider">
              https://profyl.ai/editor/koustubh
            </div>
            <div className="text-slate-500 font-mono text-[10px]">PREVIEW CORE</div>
          </div>

          {/* Interactive Mock Content Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3">
            {/* Sidebar tool configs */}
            <div className="lg:col-span-4 bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-4">
              <div className="p-2.5 bg-slate-900 border border-slate-850 rounded-lg flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-black uppercase text-indigo-400">AI GEN ENGINE CORES</h4>
                  <p className="text-[9px] text-slate-500 mt-0.5 font-mono">MODEL: GEMINI-3.5-FLASH</p>
                </div>
                <Flame className="w-4 h-4 text-pink-500 animate-pulse" />
              </div>

              {/* Slider mocks */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                    <span>Branding accent density</span>
                    <span className="text-indigo-400">84%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-indigo-500 h-full w-[84%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[9px] font-mono text-slate-400 uppercase">
                    <span>Recruiter search optimization</span>
                    <span className="text-pink-400">95%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full w-[95%]" />
                  </div>
                </div>
              </div>

              {/* Mock items list */}
              <div className="space-y-2 pt-2 border-t border-slate-900">
                <p className="text-[9px] font-mono uppercase text-slate-500">Suggested layout segments</p>
                <div className="p-2 bg-slate-900 rounded border border-slate-850 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-350">Interactive Projects Terminal</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-850 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-350">Real-time Recruiter Analytics Maps</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <div className="p-2 bg-slate-900 rounded border border-slate-850 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-350">Automatic PDF Resume Engine</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </div>
              </div>
            </div>

            {/* Simulated Live visual device render output of candidate */}
            <div className="lg:col-span-8 bg-slate-950 p-6 border border-slate-800 rounded-xl flex flex-col justify-between relative min-h-[320px]">
              <div className="absolute top-2 right-2 border border-slate-800 px-2 py-0.5 bg-slate-900 rounded text-[9px] font-mono text-yellow-500 tracking-wider">
                ACTIVE PRESENTATION: GLASSMORPHISM PREVIEW
              </div>
              
              <div className="space-y-4 max-w-lg mt-4">
                <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] uppercase font-mono tracking-widest font-bold rounded">
                  📍 ZURICH, SWITZERLAND
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">Koustubh Katti</h3>
                <p className="text-[11px] text-indigo-300 font-bold uppercase tracking-wide">
                  Lead Professional Platforms Architect at K² Technologies
                </p>
                <p className="text-slate-400 text-xs leading-relaxed italic">
                  "Engineering resilient server-side architectures, real-time analytics aggregators, and high-performance Web APIs scaled seamlessly across Sandboxed Express runtimes."
                </p>

                {/* Simulated skills capsules */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {["Docker", "TypeScript", "Node.js", "Express", "Vercel", "Prometheus"].map((sk, idx) => (
                    <span key={idx} className="text-[8px] bg-indigo-950/40 text-indigo-300 border border-indigo-900/40 font-mono px-2 py-0.5 rounded-full uppercase">
                      • {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-900 text-[10px] text-slate-500">
                <span>View stats, download PDF, or review projects timeline on live slug site.</span>
                <button onClick={onStartBuilding} className="text-indigo-400 font-bold hover:underline flex items-center gap-1 group">
                  Start configuring <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 duration-100" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI EXPERIENCE ENHANCEMENT - SIMULATED PROMPT GENERATION */}
      <section className="relative z-10 max-w-6xl w-full px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest font-mono">VISIBLE AI CORE ENGINE</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">Witness the AI Formulation Sandbox</h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">We feed structured prompts to Gemini 3.5 models server-side, immediately parsing clean, production-ready schemas for rendering.</p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-6 md:p-8 rounded-3xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
              <h4 className="text-xs font-mono text-slate-500 uppercase tracking-widest ml-1">AI_DRAFTING_SANDBOX // RAW SIMULATION</h4>
            </div>
            <button 
              onClick={triggerAiSimulation}
              className="text-[10px] font-mono text-indigo-400 border border-indigo-500/20 px-2.5 py-1 rounded bg-indigo-500/5 hover:bg-indigo-500/10 transition flex items-center gap-1"
            >
              <Zap className="w-3 h-3" /> Re-trigger Simulation
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Input Typing Terminal */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between space-y-4 relative min-h-[220px]">
              <div className="space-y-2">
                <div className="flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                  <Terminal className="w-3.5 h-3.5 text-indigo-450" /> User Input Prompt String:
                </div>
                <p className="font-mono text-xs sm:text-sm text-yellow-500 border-l-2 border-indigo-505 pl-3 py-1 bg-slate-900/40 min-h-[40px]">
                  {demoPromptText}
                </p>
              </div>

              {/* Progress Stepper Outputs */}
              <div className="space-y-1.5 pt-3 border-t border-slate-900 font-mono text-[10px] sm:text-xs">
                {aiStepsState.map((step, index) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -5 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={index} 
                    className="text-slate-400"
                  >
                    {step}
                  </motion.div>
                ))}
                {demoLoading && (
                  <div className="flex items-center gap-1 text-indigo-400 animate-pulse">
                    <span>⚡ Processing on Gemini Server...</span>
                    <span className="inline-block w-1.5 h-3 bg-indigo-505 animate-bounce" />
                  </div>
                )}
              </div>
            </div>

            {/* Target formulation output card */}
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex flex-col justify-between min-h-[220px]">
              {demoLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-2 text-slate-500 font-mono text-[11px]">
                  <Loader2 className="w-7 h-7 text-indigo-500 animate-spin" />
                  <p>RENDERING BLUEPRINT JSON SCHEMAS...</p>
                </div>
              ) : demoOutput ? (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1 }} className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-extrabold text-[#ec4899] text-base font-mono uppercase tracking-wider">{demoOutput.name}</h4>
                      <p className="text-slate-400 text-xs font-bold uppercase font-mono">{demoOutput.title}</p>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 rounded-full flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> {demoOutput.location}
                    </span>
                  </div>

                  <p className="p-3 bg-slate-900 border border-slate-850 rounded text-xs text-slate-350 italic font-mono leading-relaxed">
                    "{demoOutput.headline}"
                  </p>

                  <div className="space-y-1.5">
                    <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider">Suggested Key Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {demoOutput.topSkills.map((sk: string, idx: number) => (
                        <span key={idx} className="bg-slate-900 border border-slate-850 text-indigo-300 font-mono text-[10px] px-2 py-0.5 rounded">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-slate-500 font-mono text-[11px] p-6 text-center">
                  <Cpu className="w-8 h-8 mb-2 text-slate-700" />
                  <p>Awaiting typewriter compilation...</p>
                </div>
              )}

              <div className="mt-4 pt-3 border-t border-slate-900 flex justify-end">
                <button onClick={onStartBuilding} className="text-xs font-black text-indigo-400 hover:text-white uppercase flex items-center gap-1 group transition">
                  Create ACTUAL editable site <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-150" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PORTFOLIO INSPIRATION GALLERY */}
      <section className="relative z-10 max-w-7xl w-full px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest font-mono">Inspiration Gallery</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">Live Real-World Portfolios Showcase</h2>
          <p className="text-slate-450 max-w-xl mx-auto text-sm sm:text-base">Pre-configured design combinations constructed by actual creative candidates global-wide.</p>
        </div>

        {/* Categories Tab Selector */}
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto pb-4">
          {[
            { id: 'ai_engineer', label: "Deep-Learning/AI Specialist", icon: Cpu },
            { id: 'designer', label: "Visual Storyteller / Artist", icon: Layout },
            { id: 'founder', label: "Technical Venture Founder", icon: Zap },
            { id: 'corporate', label: "Strict ATS Corporate Pro", icon: ShieldCheck }
          ].map((tab) => {
            const IconComp = tab.icon;
            const active = activeInspirationTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveInspirationTab(tab.id as any)}
                className={`px-4.5 py-2.5 rounded-xl border text-xs font-bold transition flex items-center gap-2 cursor-pointer ${active ? "bg-indigo-600 border-indigo-700 text-white shadow-lg" : "bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200"}`}
              >
                <IconComp className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Gallery Visual Content Card */}
        <div className="bg-slate-900 border border-slate-800/80 p-6 md:p-8 rounded-3xl">
          <AnimatePresence mode="wait">
            {activeInspirationTab === 'ai_engineer' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                {/* Visual mockup frame */}
                <div className="md:col-span-7 bg-slate-950 p-6 border border-slate-850 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-pink-400">
                    <Terminal className="w-3.5 h-3.5" /> DOCKER_CONTAINER_LIVE // cyber_engine
                  </div>
                  <h4 className="text-white text-xl font-mono font-black">/ Devon.Mercer - Principal Node Specialist</h4>
                  <p className="text-slate-400 text-xs font-mono leading-relaxed">
                    "Built secure cryptographic ledgers, handling parallelized state machines and multi-tenant telemetry loops under Express structures."
                  </p>
                  <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl space-y-1">
                    <p className="text-[10px] uppercase text-indigo-400 font-mono font-bold">Featured AI Solution:</p>
                    <p className="text-[11px] text-slate-300 font-mono">Autoregulator node migrator mapped securely on persistent storage units.</p>
                  </div>
                  <div className="flex gap-2">
                    {["Rust", "ZK-Proofs", "Go", "docker", "gRPC"].map((t, idx) => (
                      <span key={idx} className="bg-slate-900 border border-slate-800 text-yellow-500 text-[9px] font-mono px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Description details and use template CTA */}
                <div className="md:col-span-5 space-y-5">
                  <div className="inline px-2 py-0.5 rounded bg-pink-500/10 border border-pink-500/20 text-pink-400 font-mono text-[9px] uppercase font-bold">
                    CYBERPUNK THEME PRESET
                  </div>
                  <h3 className="text-white text-2xl font-black">Hacker Terminal Setup</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    For builders who want to highlight code competencies. Glow grids, scanline layouts, raw terminal logs, and system dashboards deliver maximum tech depth.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <button 
                      onClick={() => handleOpenLivePreview("cyberpunk")}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-705 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-750 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full Live Preview
                    </button>
                    <button 
                      onClick={onStartBuilding}
                      className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                    >
                      Clone This Style <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeInspirationTab === 'designer' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                {/* Visual mockup frame */}
                <div className="md:col-span-7 bg-slate-950 p-6 border border-slate-850 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-purple-400">
                    <Sparkles className="w-3.5 h-3.5" /> SHADER_ORB_RENDER // aurora_visuals
                  </div>
                  <h4 className="text-white text-xl font-black">Elena Rostova - Principal Creative Storyteller</h4>
                  <p className="text-slate-450 text-xs leading-relaxed italic">
                    "Synthesizing high-contrast design principles, radial color vectors, frosted visual glass cards, and modern layout microinteractions."
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="p-2 border border-slate-800 rounded bg-slate-900/50">
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Total designs</span>
                      <span className="text-xs text-white font-bold">148 concepts</span>
                    </div>
                    <div className="p-2 border border-slate-800 rounded bg-slate-900/50">
                      <span className="text-[9px] text-slate-500 font-mono uppercase block">Active tools</span>
                      <span className="text-xs text-indigo-400 font-bold">Figma &amp; Webflow</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-5">
                  <div className="inline px-2 py-0.5 rounded bg-purple-500/10 border border-purple-500/20 text-purple-400 font-mono text-[9px] uppercase font-bold">
                    GLASSMORPHISM PRESET
                  </div>
                  <h3 className="text-white text-2xl font-black">Translucent Blur Layout</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Designed for visual UI/UX practitioners. Generous negative spaces, gorgeous frosted backing glass elements, and custom radial ambient back-glow.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <button 
                      onClick={() => handleOpenLivePreview("glassmorphism")}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-705 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-750 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full Live Preview
                    </button>
                    <button 
                      onClick={onStartBuilding}
                      className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                    >
                      Clone This Style <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeInspirationTab === 'founder' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                {/* Visual mockup frame */}
                <div className="md:col-span-7 bg-slate-950 p-6 border border-slate-850 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-450">
                    <Zap className="w-3.5 h-3.5 text-yellow-500" /> VENTURE_METRIC_CORE // series_A_pitch
                  </div>
                  <h4 className="text-white text-xl font-black text-bold">Warren Gates - Venture Co-founder</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    "Scaling next-generation SaaS infrastructures and routing real-time global telemetry metrics to attract premium institutional VC syndicates."
                  </p>
                  <div className="p-3 bg-emerald-950/15 border border-emerald-900/20 rounded-xl flex justify-between">
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">Arr generated</span>
                      <p className="text-emerald-400 font-mono text-sm font-bold">₹1.2M ARR</p>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase block">Active clients</span>
                      <p className="text-white font-mono text-sm font-bold">4,500 active</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-5">
                  <div className="inline px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[9px] uppercase font-bold">
                    FOUNDER THEME PRESET
                  </div>
                  <h3 className="text-white text-2xl font-black">Corporate Venture Pitch</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Geared towards entrepreneurs and startups. Beautiful structural steps widgets, timeline maps, metrics counters, and VC contact channels.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <button 
                      onClick={() => handleOpenLivePreview("founder")}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-705 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-750 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full Live Preview
                    </button>
                    <button 
                      onClick={onStartBuilding}
                      className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                    >
                      Clone This Style <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeInspirationTab === 'corporate' && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center"
              >
                {/* Visual mockup frame */}
                <div className="md:col-span-7 bg-slate-100 text-slate-800 p-6 border-4 border-slate-300 rounded-2xl space-y-3 font-sans">
                  <div className="border-b-2 border-slate-400 pb-2">
                    <h4 className="text-slate-900 text-xl font-bold">Benjamin Vance</h4>
                    <p className="text-indigo-600 text-xs font-bold uppercase tracking-wide">AWS Solutions Systems Engineer</p>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-650">
                    "AWS Certified Solutions Engineer with 6+ years maintaining high throughput database fabrics, distributed queues, and containerized deployment pods."
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-600 border-t pt-2 border-slate-200">
                    <span>📍 San Francisco, CA</span>
                    <span>✉️ benjamin@aws.com</span>
                  </div>
                </div>

                <div className="md:col-span-5 space-y-5">
                  <div className="inline px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[9px] uppercase font-bold">
                    CORPORATE PRESENTS
                  </div>
                  <h3 className="text-white text-2xl font-black">Strict ATS Conformance</h3>
                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    Designed specifically for standard screeners and machine parsed agencies. Zero unnecessary visuals, ultra-legible Inter fonts, and structured section definitions.
                  </p>
                  <div className="flex flex-wrap gap-2.5">
                    <button 
                      onClick={() => handleOpenLivePreview("professional")}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-705 text-slate-200 hover:text-white rounded-lg text-xs font-bold border border-slate-750 transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" /> Full Live Preview
                    </button>
                    <button 
                      onClick={onStartBuilding}
                      className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer"
                    >
                      Clone This Style <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* THREE LAYOUT INTERACTIVE CARDS */}
      <section className="relative z-10 max-w-7xl w-full px-6 py-16 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest font-mono">LAYOUT TEMPLATES</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">5 High-Performance Templates</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">Designed to capture corporate respect, hacker vibes, or minimalist investor pitches.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {templatesList.map((tpl) => (
            <div 
              key={tpl.id}
              className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col justify-between hover:border-indigo-500/50 hover:shadow-lg transition duration-300 relative overflow-hidden group min-h-[340px]"
            >
              {/* Shimmer background on card hover */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-indigo-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="w-9 h-9 rounded-lg bg-indigo-550/10 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase font-mono">
                    {tpl.name.charAt(0)}
                  </div>
                  {tpl.tags.includes("premium") && (
                    <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded uppercase font-mono font-bold tracking-wider">
                      SaaS Pro
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-200 text-sm sm:text-base">{tpl.name}</h4>
                  <p className="text-slate-440 text-xs leading-relaxed line-clamp-4">
                    {tpl.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {tpl.tags.map((tag, idx) => (
                    <span key={idx} className="text-[9px] bg-slate-950 text-slate-450 border border-slate-850 px-2 py-0.5 rounded">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-5 border-t border-slate-850 mt-4 relative z-10">
                <button 
                  onClick={() => handleOpenLivePreview(tpl.id)}
                  className="py-1.5 px-2 bg-slate-850 hover:bg-slate-800 text-slate-300 text-[10px] font-black uppercase rounded transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Eye className="w-3 h-3" /> Preview
                </button>
                <button 
                  onClick={onStartBuilding}
                  className="py-1.5 px-2 bg-indigo-600 hover:bg-indigo-755 text-white text-[10px] font-black uppercase rounded transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* POWER BI-STYLE GRAPH SECTION */}
      <section className="relative z-10 max-w-7xl w-full px-6 py-12">
        <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-3xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 space-y-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="space-y-2">
              <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest font-mono">REALTIME ANALYTICS</span>
              <h3 className="text-2xl sm:text-4xl font-black text-white">Advanced Recruiter Telemetry</h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                Observe verified employer visit curves, resume download histories, active viewport distributions, and direct project conversion triggers. Conforms strictly to professional metrics standards.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-mono">Audit Converters</p>
                <p className="text-lg font-black text-white mt-1">+24.5%</p>
              </div>
              <div className="bg-slate-950 p-3.5 border border-slate-850 rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase font-mono">Average Duration</p>
                <p className="text-lg font-black text-indigo-400 mt-1">4.2 mins</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-ping" />
                <span className="text-[10px] text-slate-400 font-mono">LIVE CLOUD TELEMETRY RECORDER // GRAPH PREVIEW</span>
              </div>
              <span className="text-[9px] font-mono text-slate-600">FILTERS: Mon-Sun</span>
            </div>

            {/* Simulated graph using real recharts AreaChart */}
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={ANALYTICS_GRAPH_DATA} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="landingGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" stroke="#475569" strokeWidth={1} fontSize={10} style={{ fontFamily: "monospace" }} />
                  <YAxis stroke="#475569" strokeWidth={1} fontSize={10} style={{ fontFamily: "monospace" }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                    labelStyle={{ color: "#64748b", fontFamily: "monospace", fontSize: "10px" }}
                    itemStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "11px" }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#ec4899" strokeWidth={2} fillOpacity={1} fill="url(#landingGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURE MATRIX COMPARATIVE GRID */}
      <section className="relative z-10 max-w-7xl w-full px-6 py-12 text-center space-y-12">
        <div className="space-y-3">
          <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest font-mono">TIER MATRIX</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">Compare Applet Features &amp; Options</h2>
          <p className="text-slate-400 max-w-xl mx-auto text-sm sm:text-base">Check why graduated engineers, startup professionals, and elite system leaders opt for SaaS Pro tiers.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-350 border-collapse border border-slate-800 rounded-2xl overflow-hidden bg-slate-900/40">
            <thead>
              <tr className="bg-slate-900 border-b border-slate-800 font-mono text-[10px] text-slate-450 uppercase">
                <th className="p-4">CAPABILITIES CORE</th>
                <th className="p-4">FREE STANDARD</th>
                <th className="p-4 text-indigo-400">STUDENT PRO</th>
                <th className="p-4 text-pink-400">PREMIUM PRO CHOICE</th>
                <th className="p-4 text-yellow-500">LIFETIME INFINITE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="p-4 font-bold text-slate-200">Portfolio active slots</td>
                <td className="p-4">1 Portfolio instance</td>
                <td className="p-4">3 Slots</td>
                <td className="p-4 text-white font-bold">Uncapped Unlimited</td>
                <td className="p-4">Unlimited Slots</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-200">Gemini Generative runs</td>
                <td className="p-4">5 AI runs</td>
                <td className="p-4 font-bold text-indigo-400">Infinite runs</td>
                <td className="p-4 text-pink-400 font-bold">Infinite runs</td>
                <td className="p-4">Priority AI Key quota</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-200">Premium visual presets</td>
                <td className="p-4">Basic glassmorphism only</td>
                <td className="p-4">Founder, Cyberpunk</td>
                <td className="p-4 text-white font-bold">All 7 Template presets</td>
                <td className="p-4">All present &amp; future</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-200">Telemetry visitor charts</td>
                <td className="p-4 text-slate-600">❌ Inactive</td>
                <td className="p-4 text-slate-600">❌ Inactive</td>
                <td className="p-4 text-emerald-400 font-bold">✔️ Fully Tracked Recharts</td>
                <td className="p-4 text-emerald-400">✔️ Fully Tracked Recharts</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-200">Internet Custom domains</td>
                <td className="p-4 text-slate-600">❌ Inactive</td>
                <td className="p-4">✔️ Fully Configured</td>
                <td className="p-4 text-emerald-400 font-bold">✔️ Fully Configured</td>
                <td className="p-4 text-emerald-400">✔️ Fully Configured</td>
              </tr>
              <tr>
                <td className="p-4 font-bold text-slate-200">PDF resume exports</td>
                <td className="p-4 text-slate-600">Watermarked</td>
                <td className="p-4 font-bold text-white">Full exports</td>
                <td className="p-4 text-emerald-400 font-bold">Full PDF ZIP outputs</td>
                <td className="p-4 text-emerald-400 font-bold">Full PDF ZIP outputs</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* PRICING PLANS OPTION */}
      <section className="relative z-10 max-w-6xl w-full px-6 py-16 space-y-12">
        <div className="text-center space-y-4">
          <span className="text-xs text-indigo-400 font-extrabold uppercase tracking-widest font-mono">Suggested Pricing</span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">Formulate Your Rep Profile</h2>

          {/* Billing period TOGGLER */}
          <div className="flex justify-center items-center gap-3">
            <span className={`text-xs font-bold font-mono transition ${billingPeriod === 'monthly' ? "text-white" : "text-slate-500"}`}>
              MONTHLY TIER
            </span>
            <button 
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6.5 bg-indigo-950 border border-indigo-900 rounded-full p-1 relative flex items-center transition"
            >
              <div className={`w-4.5 h-4.5 bg-indigo-500 rounded-full transition-all duration-300 ${billingPeriod === 'yearly' ? "absolute right-1" : "absolute left-1"}`} />
            </button>
            <span className={`text-xs font-bold font-mono transition flex items-center gap-1.5 ${billingPeriod === 'yearly' ? "text-yellow-500" : "text-slate-500"}`}>
              YEARLY BLUEPRINT <span className="bg-yellow-500/10 text-yellow-550 border border-yellow-500/20 text-[9px] px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Plan 1 */}
          <div className="border border-slate-800 bg-slate-900/40 p-6 rounded-2xl flex flex-col justify-between space-y-5 hover:border-slate-700 transition">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-white text-sm">Free</h4>
                <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase">Basic</span>
              </div>
              <p className="text-3xl font-black text-white font-mono">₹0 <span className="text-xs text-slate-500 font-medium font-sans">/ month</span></p>
              <p className="text-slate-440 text-xs text-slate-400 uppercase tracking-wide">For testing candidate options.</p>
              
              <ul className="space-y-2 text-xs text-slate-355 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Max 1 Portfolio Page</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Glassmorphism Theme</li>
                <li className="flex items-center gap-2 text-slate-600 line-through">&times; Recruiter views tracker</li>
                <li className="flex items-center gap-2 text-slate-600 line-through">&times; Cloud Custom domains</li>
                <li className="flex items-center gap-2 text-slate-600 line-through">&times; Premium template presets</li>
              </ul>
            </div>
            <button onClick={onStartBuilding} className="w-full py-2.5 bg-slate-800 hover:bg-slate-755 text-slate-200 text-xs font-bold uppercase rounded-xl transition cursor-pointer">
              Start Free Layout
            </button>
          </div>

          {/* Plan 2 */}
          <div className="border border-indigo-900/60 bg-slate-900/40 p-6 rounded-2xl flex flex-col justify-between space-y-5 hover:border-indigo-700/60 transition">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-white text-sm">Student Pro</h4>
                <span className="text-[9px] font-mono bg-indigo-950/80 text-indigo-450 px-2 py-0.5 rounded border border-indigo-900/40 uppercase">Academic</span>
              </div>
              <p className="text-3xl font-black text-white font-mono">
                {billingPeriod === 'monthly' ? "₹99" : "₹79"} <span className="text-xs text-indigo-400 font-medium font-sans">/ month</span>
              </p>
              <p className="text-slate-440 text-xs text-slate-400 uppercase tracking-wide">A special student tier offering advanced features to boost profile.</p>
              
              <ul className="space-y-2 text-xs text-slate-355 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Up to 3 Portfolios</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Cyberpunk &amp; Founder Themes</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Unlimited AI Generations</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> Custom Domain Names</li>
                <li className="flex items-center gap-2 text-slate-600 line-through">&times; Recruiter analytics map</li>
              </ul>
            </div>
            <button onClick={onStartBuilding} className="w-full py-2.5 bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 text-xs font-bold uppercase rounded-xl transition border border-indigo-800/40 cursor-pointer">
              Secure Student Plan
            </button>
          </div>

          {/* Plan 3 */}
          <div className="border-2 border-indigo-500 bg-slate-900 p-6 rounded-2xl flex flex-col justify-between space-y-5 relative hover:shadow-2xl transition">
            <div className="absolute top-0 right-6 -translate-y-1/2 bg-indigo-500 text-white text-[9px] font-black tracking-widest uppercase px-2.5 py-0.5 rounded-full shadow-md">
              PRO CHOICE
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-white text-sm">Premium</h4>
                <span className="text-[9px] font-mono bg-indigo-950 text-indigo-400 border border-indigo-900/50 px-2 py-0.5 rounded uppercase">Best Seller</span>
              </div>
              <p className="text-3xl font-black text-white font-mono">
                {billingPeriod === 'monthly' ? "₹199" : "₹159"} <span className="text-xs text-indigo-400 font-medium font-sans">/ month</span>
              </p>
              <p className="text-slate-440 text-xs text-slate-400 uppercase tracking-wide">For senior platforms architects, and tech graduates.</p>
              
              <ul className="space-y-2 text-xs text-slate-355 pt-4 border-t border-indigo-900/30">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Unlimited Active Portfolios</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Unlock All Present Templates</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Unlimited AI Generative APIs</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Recruiter visitor mapping</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Custom DNS Domains</li>
              </ul>
            </div>
            <button onClick={onStartBuilding} className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-widest rounded-xl transition shadow-lg cursor-pointer animate-pulse">
              Upgrade to Premium
            </button>
          </div>

          {/* Plan 4 */}
          <div className="border border-yellow-600/55 bg-slate-900/40 p-6 rounded-2xl flex flex-col justify-between space-y-5 hover:border-yellow-500 transition">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-extrabold text-white text-sm">Lifetime</h4>
                <span className="text-[9px] font-mono bg-yellow-950/80 text-yellow-500 px-2 py-0.5 rounded border border-yellow-950/40 uppercase">Infinite</span>
              </div>
              <p className="text-3xl font-black text-white font-mono">
                {billingPeriod === 'monthly' ? "₹999" : "₹799"} <span className="text-xs text-yellow-600 font-medium font-sans">one-time</span>
              </p>
              <p className="text-slate-440 text-xs text-slate-400 uppercase tracking-wide">Supreme lifetime credentials without recurrent bills.</p>
              
              <ul className="space-y-2 text-xs text-slate-355 pt-4 border-t border-slate-800">
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" /> Unlimited Slots</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" /> Present &amp; Future Theme layouts</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" /> Priority Server API allocation</li>
                <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-yellow-500 shrink-0" /> VC-Recruiter Bookmark priority</li>
              </ul>
            </div>
            <button onClick={onStartBuilding} className="w-full py-2.5 bg-yellow-650 hover:bg-yellow-600 text-slate-950 text-xs font-black uppercase rounded-xl transition cursor-pointer">
              Acquire Infinite License
            </button>
          </div>
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
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-404 leading-relaxed border-t border-slate-850 bg-slate-950/40">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FULL-SCREEN INTERACTIVE LIVE TEMPLATE PREVIEW MODAL */}
      <AnimatePresence>
        {previewTemplate && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-md flex flex-col"
          >
            {/* Header Control Shell */}
            <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-1 px-3 border border-slate-800 rounded bg-slate-950 text-[10px] uppercase font-mono text-indigo-400 tracking-wider">
                  REAL-TIME PREVIEW
                </div>
                <h3 className="font-extrabold text-white text-sm uppercase font-mono hidden sm:block">
                  Viewing Live Preview: /{previewTemplate.slug} (Style_{previewTemplate.templateId})
                </h3>
              </div>

              {/* Layout device responsive selectors */}
              <div className="flex items-center gap-1 bg-slate-950 p-1 border border-slate-800 rounded-lg">
                <button 
                  onClick={() => setPreviewDevice('desktop')}
                  className={`p-1.5 rounded transition ${previewDevice === 'desktop' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                  title="Desktop preset width"
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setPreviewDevice('tablet')}
                  className={`p-1.5 rounded transition ${previewDevice === 'tablet' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                  title="Tablet preset width"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setPreviewDevice('mobile')}
                  className={`p-1.5 rounded transition ${previewDevice === 'mobile' ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"}`}
                  title="Mobile preset width"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>

              {/* Close CTAs */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={onStartBuilding}
                  className="p-1 px-3.5 bg-indigo-605 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-black uppercase tracking-wider transition cursor-pointer"
                >
                  Use Style
                </button>
                <button 
                  onClick={() => setPreviewTemplate(null)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 hover:text-white transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </header>

            {/* Inner frame wrapper containing TemplatesPreview itself */}
            <div className="flex-1 overflow-auto bg-slate-950 flex justify-center p-4">
              <div 
                className={`h-full w-full border border-slate-800 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 relative bg-slate-950 ${
                  previewDevice === 'desktop' ? 'max-w-full' :
                  previewDevice === 'tablet' ? 'max-w-3xl' : 'max-w-md'
                }`}
              >
                <div className="w-full h-full overflow-y-auto scrollbar-none">
                  <TemplatesPreview data={previewTemplate} isDemo={true} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Landing Footer */}
      <footer className="w-full py-8 border-t border-slate-900 text-center text-xs text-slate-600 relative z-10 bg-slate-950">
        <p>&copy; 2026 K² Technologies. Developed under the owner Koustubh Katti. All rights reserved.</p>
      </footer>
    </div>
  );
}
