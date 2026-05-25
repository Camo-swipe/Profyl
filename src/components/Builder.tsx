import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Save, 
  Eye, 
  Download, 
  Trash2, 
  Plus, 
  Check, 
  ArrowLeft, 
  Layers, 
  Globe, 
  FileJson, 
  FileCode,
  AlertCircle,
  TrendingUp,
  MapPin,
  Mail,
  Linkedin,
  Github,
  Award,
  MessageSquare,
  Briefcase,
  ChevronRight,
  Terminal,
  Play,
  Share2,
  Lock,
  Loader2
} from "lucide-react";
import { PortfolioData, User, Project, Experience, Certification, Testimonial } from "../types";
import TemplatesPreview from "./TemplatesPreview";
import AnalyticsView from "./AnalyticsView";

interface Props {
  user: User | null;
  onBackToDashboard?: () => void;
  onUpgradePrompt?: () => void;
}

export default function Builder({ user, onBackToDashboard, onUpgradePrompt }: Props) {
  const [loading, setLoading] = useState(false);
  const [aiPrompModalOpen, setAiPrompModalOpen] = useState(false);
  const [aiSearchPrompt, setAiSearchPrompt] = useState("");
  const [aiProgressStatus, setAiProgressStatus] = useState("");
  const [showAnalyticsDrawer, setShowAnalyticsDrawer] = useState(false);

  // Default seeded portfolio values
  const [portfolio, setPortfolio] = useState<PortfolioData>({
    id: "",
    userId: user?.id || "usr-anon",
    title: "My Creative Dev Showcase",
    templateId: "glassmorphism",
    accentColor: "#6366f1",
    isPublished: true,
    slug: `site-${Math.floor(Math.random() * 9000) + 1000}`,
    personalInfo: {
      name: user?.name || "Jane Hacker",
      title: "Senior Full Stack Dev & AI Orchestrator",
      bio: "Crafting modular, high-performance web products. Specializing in Node backend services, React rendering systems, and deep LLM context integrations.",
      email: user?.email || "jane@hacker.dev",
      location: "San Francisco, CA",
      linkedin: "linkedin.com/in/jane-hacker",
      github: "github.com/jane-dev",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      headline: "Optimizing request loops to engineer pristine client modules."
    },
    skills: ["TypeScript", "Node.js", "Express", "React", "Tailwind CSS", "Gemini API"],
    projects: [
      {
        id: "p-d1",
        name: "Aura Metrics Node Scanner",
        description: "Optimized overlay mapping of distributed consensus networks, reducing latencies by 38%.",
        url: "https://github.com/jane-dev/aura",
        technologies: ["Node.js", "Express", "D3.js"]
      }
    ],
    experience: [
      {
        id: "exp-d1",
        company: "Vanguard Tech Inc",
        role: "Senior Prototyper",
        duration: "2024 - Present",
        description: "Wrote backend microservices processing high throughput event requests."
      }
    ],
    certifications: [
      {
        id: "cert-d1",
        title: "AWS Certified Developer",
        issuer: "Amazon Web Services",
        date: "2024"
      }
    ],
    testimonials: [
      {
        id: "test-d1",
        clientName: "Aaria Thorne",
        role: "Lead Engineer",
        text: "Outstanding modular delivery. Codebase builds green instantly.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
      }
    ]
  });

  // Current active side tabs: 'personal' | 'skills' | 'projects' | 'experience' | 'certifications' | 'testimonials' | 'template' | 'hosting'
  const [activeSideTab, setActiveSideTab] = useState<'personal' | 'skills' | 'projects' | 'experience' | 'certifications' | 'testimonials' | 'template' | 'hosting'>('personal');

  // AI improve states action indicators
  const [optimizingBio, setOptimizingBio] = useState(false);

  // Fetch index user portfolios list
  useEffect(() => {
    async function loadExistPortfolios() {
      if (!user) return;
      try {
        const res = await fetch("/api/portfolios", {
          headers: { "Authorization": `Bearer mock-token-${user.id}` }
        });
        const portfoliosList = await res.json();
        if (portfoliosList && portfoliosList.length > 0) {
          setPortfolio(portfoliosList[0]);
        }
      } catch (err) {
        console.error("No portfolio loaded, using default templates", err);
      }
    }
    loadExistPortfolios();
  }, [user]);

  // Handle Save portfolio
  const handleSavePortfolio = async (showNotification = true) => {
    setLoading(true);
    try {
      const res = await fetch("/api/portfolios", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer mock-token-${user?.id}`
        },
        body: JSON.stringify(portfolio)
      });
      const data = await res.json();
      if (res.ok) {
        setPortfolio(data);
        if (showNotification) alert("🎉 Portfolio details saved & deployed successfully!");
      } else {
        alert(`Error: ${data.error || "Failed to sync updates"}`);
      }
    } catch (e) {
      console.error(e);
      alert("Error logging state modifications. Check server channels.");
    } finally {
      setLoading(false);
    }
  };

  // AI Complete generation draft matching schema
  const handleGenerateWholeProfile = async () => {
    if (!aiSearchPrompt.trim()) return;
    setAiProgressStatus("Connecting server-side Gemini 3.5-flash AI engine...");
    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer mock-token-${user?.id}`
        },
        body: JSON.stringify({
          userPrompt: aiSearchPrompt,
          templateId: portfolio.templateId,
          userName: portfolio.personalInfo.name,
          userTitle: portfolio.personalInfo.title
        })
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Draft generator failed.");
        return;
      }
      if (data.portfolio) {
        setPortfolio({
          ...portfolio,
          ...data.portfolio,
          id: portfolio.id, // Preserving original id
          slug: portfolio.slug // Preserving slug link
        });
        setAiPrompModalOpen(false);
        setAiSearchPrompt("");
        alert("✨ Successfully generated your custom themed portfolio with Gemini AI! Now review the draft components below.");
      }
    } catch (err) {
      console.error(err);
      alert("Encountered connection errors during drafting. Falling back.");
    } finally {
      setAiProgressStatus("");
    }
  };

  // Improve Bio with AI
  const handleRewriteBioViaAI = async () => {
    if (!portfolio.personalInfo.bio) return;
    setOptimizingBio(true);
    try {
      const res = await fetch("/api/ai/improve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          originalText: portfolio.personalInfo.bio,
          action: "professional"
        })
      });
      const data = await res.json();
      if (data.result) {
        setPortfolio({
          ...portfolio,
          personalInfo: {
            ...portfolio.personalInfo,
            bio: data.result
          }
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setOptimizingBio(false);
    }
  };

  // Dynamic Array updates
  const handleAddSkill = (skill: string) => {
    if (!skill.trim() || portfolio.skills.includes(skill)) return;
    setPortfolio({
      ...portfolio,
      skills: [...portfolio.skills, skill]
    });
  };

  const handleRemoveSkill = (skill: string) => {
    setPortfolio({
      ...portfolio,
      skills: portfolio.skills.filter(s => s !== skill)
    });
  };

  const handleUpdatePersonalInfo = (field: string, val: string) => {
    setPortfolio({
      ...portfolio,
      personalInfo: {
        ...portfolio.personalInfo,
        [field]: val
      }
    });
  };

  // State lists additions
  const handleAddProject = () => {
    const newProj: Project = {
      id: `p-${Date.now()}`,
      name: "New Software Node Project",
      description: "A secure scalable application routing engine built with modern interfaces.",
      url: "https://github.com",
      technologies: ["React", "Express"]
    };
    setPortfolio({
      ...portfolio,
      projects: [...portfolio.projects, newProj]
    });
  };

  const handleUpdateProjectField = (id: string, field: string, value: any) => {
    setPortfolio({
      ...portfolio,
      projects: portfolio.projects.map(p => 
        p.id === id ? { ...p, [field]: value } : p
      )
    });
  };

  const handleRemoveProject = (id: string) => {
    setPortfolio({
      ...portfolio,
      projects: portfolio.projects.filter(p => p.id !== id)
    });
  };

  // Exp additions
  const handleAddExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      company: "Silicon Ventures Lab",
      role: "Solutions Developer",
      duration: "2024 - Present",
      description: "Developed automated telemetry pipelines, resolving memory overheads by 15%."
    };
    setPortfolio({
      ...portfolio,
      experience: [...portfolio.experience, newExp]
    });
  };

  const handleUpdateExperienceField = (id: string, field: string, value: string) => {
    setPortfolio({
      ...portfolio,
      experience: portfolio.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const handleRemoveExperience = (id: string) => {
    setPortfolio({
      ...portfolio,
      experience: portfolio.experience.filter(exp => exp.id !== id)
    });
  };

  // Certifications additions
  const handleAddCert = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      title: "AWS Certified Solution Architect",
      issuer: "Amazon Web Services",
      date: "2025"
    };
    setPortfolio({
      ...portfolio,
      certifications: [...portfolio.certifications, newCert]
    });
  };

  const handleUpdateCertField = (id: string, field: string, val: string) => {
    setPortfolio({
      ...portfolio,
      certifications: portfolio.certifications.map(c => 
        c.id === id ? { ...c, [field]: val } : c
      )
    });
  };

  const handleRemoveCert = (id: string) => {
    setPortfolio({
      ...portfolio,
      certifications: portfolio.certifications.filter(c => c.id !== id)
    });
  };

  // Testimonials additions
  const handleAddTestimonial = () => {
    const newTest: Testimonial = {
      id: `test-${Date.now()}`,
      clientName: "David lee",
      role: "VP Engineering",
      text: "Outstanding delivery and clean modular code schemas.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80"
    };
    setPortfolio({
      ...portfolio,
      testimonials: [...portfolio.testimonials, newTest]
    });
  };

  const handleUpdateTestimonialField = (id: string, field: string, val: string) => {
    setPortfolio({
      ...portfolio,
      testimonials: portfolio.testimonials.map(t => 
        t.id === id ? { ...t, [field]: val } : t
      )
    });
  };

  const handleRemoveTestimonial = (id: string) => {
    setPortfolio({
      ...portfolio,
      testimonials: portfolio.testimonials.filter(t => t.id !== id)
    });
  };

  // Download entire portfolio setup JSON Schema
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(portfolio, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${portfolio.slug}-profyl-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download interactive zip elements mockup
  const handleExportZIP = () => {
    alert(`[ZIP Packaging System] Bundling static elements styled on "${portfolio.templateId}" preset format:
- /index.html
- /style.css
- /personal_data.json
- /assets/
Successfully packaged ZIP file ready for deployment.`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-950 text-slate-100 font-sans">
      
      {/* Top action control dashboard menu bar */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBackToDashboard}
            className="p-1 px-3 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded text-xs flex items-center gap-1 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </button>
          
          <div className="hidden sm:block">
            <h1 className="text-base font-black text-white flex items-center gap-1.5">
              Profyl AI Builder v2 <Sparkles className="w-4 h-4 text-indigo-400" />
            </h1>
            <p className="text-[10px] text-slate-400">Editing Slug: /{portfolio.slug}</p>
          </div>
        </div>

        {/* Global Toolbar */}
        <div className="flex items-center gap-2">
          
          {/* AI Generator Trigger */}
          <button 
            onClick={() => setAiPrompModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-lg transition flex items-center gap-1.5 shadow"
          >
            <Sparkles className="w-3.5 h-3.5" /> Gemini AI Prompt Draft
          </button>

          {/* Analytics Drawer toggle trigger */}
          <button 
            onClick={() => setShowAnalyticsDrawer(!showAnalyticsDrawer)}
            className="px-3 py-2 border border-slate-800 hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-lg transition flex items-center gap-1"
          >
            <TrendingUp className="w-3.5 h-3.5 text-pink-400" /> Stats
          </button>

          {/* Quick share visual live link */}
          <a 
            href={`/p/${portfolio.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-slate-800 text-slate-300 border border-slate-700 rounded-lg hover:text-white transition"
            title="Open sharing live portfolio visual URL"
            onClick={() => handleSavePortfolio(false)}
          >
            <Share2 className="w-4 h-4" />
          </a>

          {/* Save Action */}
          <button 
            onClick={() => handleSavePortfolio(true)}
            disabled={loading}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold uppercase transition flex items-center gap-1"
          >
            <Save className="w-3.5 h-3.5" /> {loading ? "Saving..." : "Save Code"}
          </button>
        </div>
      </header>

      {/* Main split work dashboard workspace layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT WORKSPACE PANELS EDITORS */}
        <aside className="w-full md:w-[480px] bg-slate-900 border-r border-slate-800 flex flex-col overflow-hidden shrink-0">
          
          {/* Section Category Choice Tab Slider menu indicators */}
          <div className="bg-slate-950 px-4 py-2 border-b border-slate-800 flex gap-2 overflow-x-auto select-none shrink-0 text-[10px] font-mono scrollbar-none">
            {[
              { id: 'personal', name: 'Profile' },
              { id: 'skills', name: 'Skills' },
              { id: 'projects', name: 'Projects' },
              { id: 'experience', name: 'Jobs' },
              { id: 'certifications', name: 'Certs' },
              { id: 'testimonials', name: 'Quotes' },
              { id: 'template', name: 'Styles' },
              { id: 'hosting', name: 'Cloud' }
            ].map((tab) => {
              const active = activeSideTab === tab.id;
              return (
                <button 
                  key={tab.id}
                  onClick={() => setActiveSideTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-md uppercase font-bold text-center duration-150 shrink-0 ${active ? "bg-indigo-600 text-white font-black" : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"}`}
                >
                  {tab.name}
                </button>
              );
            })}
          </div>

          {/* Selected category field parameters container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* TAB 1: PERSONAL PROFILE */}
            {activeSideTab === 'personal' && (
              <div className="space-y-4 animate-fadeIn">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Personal Outline Details</h4>
                
                <div className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Candidate Full Name</label>
                    <input 
                      type="text" 
                      value={portfolio.personalInfo.name}
                      onChange={(e) => handleUpdatePersonalInfo("name", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Professional Job Title</label>
                    <input 
                      type="text" 
                      value={portfolio.personalInfo.title}
                      onChange={(e) => handleUpdatePersonalInfo("title", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-slate-400">
                      <label className="font-medium">Bio Description</label>
                      <button 
                        onClick={handleRewriteBioViaAI}
                        disabled={optimizingBio}
                        className="text-[10px] text-indigo-400 hover:text-indigo-200 flex items-center gap-1 font-mono uppercase bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20"
                      >
                        <Sparkles className="w-3 h-3" /> {optimizingBio ? "Improving..." : "Gemini Rewrite"}
                      </button>
                    </div>
                    <textarea 
                      rows={4}
                      value={portfolio.personalInfo.bio}
                      onChange={(e) => handleUpdatePersonalInfo("bio", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none text-xs leading-relaxed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Interactive Sub-Headline</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Scaling micro-consensus across cloud segments"
                      value={portfolio.personalInfo.headline || ""}
                      onChange={(e) => handleUpdatePersonalInfo("headline", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-medium">Location</label>
                      <input 
                        type="text" 
                        value={portfolio.personalInfo.location}
                        onChange={(e) => handleUpdatePersonalInfo("location", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-medium">Public Email</label>
                      <input 
                        type="email" 
                        value={portfolio.personalInfo.email}
                        onChange={(e) => handleUpdatePersonalInfo("email", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-slate-400 font-medium">LinkedIn Link</label>
                      <input 
                        type="text" 
                        value={portfolio.personalInfo.linkedin}
                        onChange={(e) => handleUpdatePersonalInfo("linkedin", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-slate-400 font-medium">GitHub Link</label>
                      <input 
                        type="text" 
                        value={portfolio.personalInfo.github}
                        onChange={(e) => handleUpdatePersonalInfo("github", e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-medium">Profile photo Avatar URL</label>
                    <input 
                      type="text" 
                      value={portfolio.personalInfo.avatar}
                      onChange={(e) => handleUpdatePersonalInfo("avatar", e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none text-[11px] font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SKILLS LIST */}
            {activeSideTab === 'skills' && (
              <div className="space-y-4 animate-fadeIn text-xs">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Expertise Tool Tag inventories</h4>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      id="skillInputVal"
                      placeholder="Type tool name (e.g. Solidity, K8s, Python)"
                      className="flex-1 bg-slate-950 border border-slate-800 px-3 py-2 text-slate-250 rounded focus:border-indigo-600 outline-none text-xs"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddSkill((e.target as any).value);
                          (e.target as any).value = "";
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                        const target = document.getElementById("skillInputVal") as HTMLInputElement;
                        if (target) {
                          handleAddSkill(target.value);
                          target.value = "";
                        }
                      }}
                      className="p-2.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg shrink-0 flex items-center justify-center font-bold"
                    >
                      <Plus className="w-4 h-4" /> Add
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4">
                    {portfolio.skills.map((s, idx) => (
                      <span 
                        key={idx} 
                        className="px-2.5 py-1.5 bg-slate-950 border border-slate-800 text-slate-300 rounded flex items-center gap-1.5 hover:border-red-500 duration-155 hover:text-red-400 group cursor-pointer"
                        onClick={() => handleRemoveSkill(s)}
                      >
                        {s} <span className="text-[10px] text-slate-600 group-hover:text-red-500 font-black font-sans">&times;</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: PROJECTS PANEL */}
            {activeSideTab === 'projects' && (
              <div className="space-y-6 animate-fadeIn text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Showcase Projects ({portfolio.projects.length})</h4>
                  <button 
                    onClick={handleAddProject}
                    className="p-1 px-2.5 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 hover:bg-indigo-600 hover:text-white rounded text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Project
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolio.projects.map((proj, idx) => {
                    return (
                      <div key={proj.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 relative">
                        <button 
                          onClick={() => handleRemoveProject(proj.id)}
                          className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition"
                          title="Delete project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        
                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-wider text-slate-500">Project #{idx + 1} Name</label>
                          <input 
                            type="text"
                            value={proj.name}
                            onChange={(e) => handleUpdateProjectField(proj.id, "name", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-slate-200 rounded outline-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] uppercase tracking-wider text-slate-500">Description Achievements</label>
                          <textarea 
                            rows={3}
                            value={proj.description}
                            onChange={(e) => handleUpdateProjectField(proj.id, "description", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-slate-350 rounded outline-none leading-relaxed"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-slate-500">Technologies (comma sep)</label>
                            <input 
                              type="text"
                              value={proj.technologies.join(", ")}
                              onChange={(e) => handleUpdateProjectField(proj.id, "technologies", e.target.value.split(",").map(val => val.trim()).filter(Boolean))}
                              className="w-full bg-slate-900 border border-slate-850 px-3 py-1.5 text-slate-200 rounded outline-none"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-slate-500">Project Link URL</label>
                            <input 
                              type="text"
                              value={proj.url}
                              onChange={(e) => handleUpdateProjectField(proj.id, "url", e.target.value)}
                              className="w-full bg-slate-900 border border-slate-850 px-3 py-1.5 text-slate-200 rounded outline-none font-mono text-[10px]"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-slate-500">Project Visual Image URL (optional)</label>
                          <input 
                            type="text"
                            value={proj.image || ""}
                            onChange={(e) => handleUpdateProjectField(proj.id, "image", e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-slate-900 border border-slate-850 px-3 py-1.5 text-slate-200 rounded outline-none font-mono text-[10px]"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 4: WORK JOURNEYS */}
            {activeSideTab === 'experience' && (
              <div className="space-y-6 animate-fadeIn text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Job Experience Log Items ({portfolio.experience.length})</h4>
                  <button 
                    onClick={handleAddExperience}
                    className="p-1 px-2.5 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 hover:bg-indigo-600 hover:text-white rounded text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Job
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolio.experience.map((exp, idx) => (
                    <div key={exp.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 relative animate-fadeIn">
                      <button 
                        onClick={() => handleRemoveExperience(exp.id)}
                        className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-slate-500">Company Name</label>
                          <input 
                            type="text"
                            value={exp.company}
                            onChange={(e) => handleUpdateExperienceField(exp.id, "company", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-slate-200 rounded outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-slate-500">Job Role/Title</label>
                          <input 
                            type="text"
                            value={exp.role}
                            onChange={(e) => handleUpdateExperienceField(exp.id, "role", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-slate-200 rounded outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-500">Timeline Duration</label>
                        <input 
                          type="text"
                          value={exp.duration}
                          onChange={(e) => handleUpdateExperienceField(exp.id, "duration", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 px-3 py-1.5 text-slate-200 rounded outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-500">Responsibilities Summary</label>
                        <textarea 
                          rows={3}
                          value={exp.description}
                          onChange={(e) => handleUpdateExperienceField(exp.id, "description", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 px-3 py-1.5 text-slate-350 rounded outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 5: CERTIFICATIONS */}
            {activeSideTab === 'certifications' && (
              <div className="space-y-6 animate-fadeIn text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Certifications ({portfolio.certifications.length})</h4>
                  <button 
                    onClick={handleAddCert}
                    className="p-1 px-2.5 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 hover:bg-indigo-600 hover:text-white rounded text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Cert
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolio.certifications.map((c) => (
                    <div key={c.id} className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-3 relative">
                      <button 
                        onClick={() => handleRemoveCert(c.id)}
                        className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-500">Credential Name Title</label>
                        <input 
                          type="text"
                          value={c.title}
                          onChange={(e) => handleUpdateCertField(c.id, "title", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-slate-200 rounded outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-slate-500">Issuer Institution</label>
                          <input 
                            type="text"
                            value={c.issuer}
                            onChange={(e) => handleUpdateCertField(c.id, "issuer", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-slate-200 rounded outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-slate-500">Date Issued</label>
                          <input 
                            type="text"
                            value={c.date}
                            onChange={(e) => handleUpdateCertField(c.id, "date", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 px-3 py-1.5 text-slate-200 rounded outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: CITATION QUOTES TESTIMONIALS */}
            {activeSideTab === 'testimonials' && (
              <div className="space-y-6 animate-fadeIn text-xs">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Testimonial Citations ({portfolio.testimonials.length})</h4>
                  <button 
                    onClick={handleAddTestimonial}
                    className="p-1 px-2.5 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 hover:bg-indigo-600 hover:text-white rounded text-xs font-bold flex items-center gap-1 transition"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Quote
                  </button>
                </div>

                <div className="space-y-4">
                  {portfolio.testimonials.map((t) => (
                    <div key={t.id} className="p-4 bg-slate-950/60 border border-slate-850 rounded-xl space-y-3 relative">
                      <button 
                        onClick={() => handleRemoveTestimonial(t.id)}
                        className="absolute top-4 right-4 text-slate-600 hover:text-red-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-slate-500">Client/Peer Name</label>
                          <input 
                            type="text"
                            value={t.clientName}
                            onChange={(e) => handleUpdateTestimonialField(t.id, "clientName", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-850 px-3 py-1.5 text-slate-200 rounded outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-slate-500">Peer Position role</label>
                          <input 
                            type="text"
                            value={t.role}
                            onChange={(e) => handleUpdateTestimonialField(t.id, "role", e.target.value)}
                            className="w-full bg-slate-900 border border-slate-850 px-3 py-1.5 text-slate-200 rounded outline-none"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase tracking-wider text-slate-500">Endorsement quote text</label>
                        <textarea 
                          rows={3}
                          value={t.text}
                          onChange={(e) => handleUpdateTestimonialField(t.id, "text", e.target.value)}
                          className="w-full bg-slate-900 border border-slate-850 px-3 py-1.5 text-slate-350 rounded outline-none leading-relaxed"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 7: TEMPLATE VISUAL STYLE */}
            {activeSideTab === 'template' && (
              <div className="space-y-5 animate-fadeIn text-xs">
                <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500 font-mono">Premium Theme Layouts Selectors</h4>

                <div className="grid grid-cols-1 gap-3">
                  {[
                    { id: 'cyberpunk', name: 'Developer Cyberpunk', tags: ["neon console", "hacker grids"], premium: true },
                    { id: 'glassmorphism', name: 'Minimal Glassmorphism', tags: ["frosted", "radial glow"], premium: false },
                    { id: 'professional', name: 'Corporate Professional', tags: ["ATS-optimized", "minimal"], premium: false },
                    { id: 'creative', name: 'Creative Designer', tags: ["bold", "storytelling"], premium: false },
                    { id: 'founder', name: 'Startup Founder', tags: ["pitch desk", "achievements"], premium: true },
                    { id: 'neo_brutalist', name: 'Swiss Neo-Brutalist', tags: ["high contrast", "solid shadow"], premium: false },
                    { id: 'midnight_nebula', name: 'Midnight Nebula Cosmic', tags: ["starry gradient", "cosmic glows"], premium: true }
                  ].map((tpl) => {
                    const active = portfolio.templateId === tpl.id;
                    const isSubscriptionAllowed = user?.plan && user.plan !== 'free';
                    const locked = tpl.premium && !isSubscriptionAllowed;

                    return (
                      <button 
                        key={tpl.id}
                        disabled={locked}
                        onClick={() => setPortfolio({
                          ...portfolio,
                          templateId: tpl.id as any,
                          accentColor: tpl.id === 'cyberpunk' ? '#ec4899' : tpl.id === 'founder' ? '#f59e0b' : tpl.id === 'neo_brutalist' ? '#4f46e5' : tpl.id === 'midnight_nebula' ? '#8b5cf6' : '#6366f1'
                        })}
                        className={`w-full text-left p-4 rounded-xl border flex justify-between items-center transition ${active ? "bg-indigo-600 border-indigo-500 text-white shadow-lg" : "bg-slate-950 border-slate-850 hover:border-slate-700 text-slate-300"} ${locked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        <div className="space-y-1">
                          <p className="font-extrabold text-sm flex items-center gap-1.5">
                            {tpl.name}
                            {tpl.premium && <span className="text-[9px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded-full uppercase">SaaS Pro</span>}
                          </p>
                          <div className="flex gap-1">
                            {tpl.tags.map((tag, i) => (
                              <span key={i} className="text-[9px] bg-slate-900/60 px-1.5 py-0.5 rounded text-slate-400">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          {locked ? (
                            <Lock className="w-4 h-4 text-amber-500 shrink-0" />
                          ) : active ? (
                            <Check className="w-4 h-4 text-emerald-300" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-slate-600" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Accent Color picker */}
                <div className="space-y-2 pt-4 border-t border-slate-850">
                  <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Accent Palette Theme Code</label>
                  <div className="flex gap-3">
                    <input 
                      type="color" 
                      value={portfolio.accentColor}
                      onChange={(e) => setPortfolio({ ...portfolio, accentColor: e.target.value })}
                      className="w-12 h-10 bg-slate-950 border border-slate-800 rounded cursor-pointer p-0.5 shrink-0"
                    />
                    <input 
                      type="text" 
                      value={portfolio.accentColor}
                      onChange={(e) => setPortfolio({ ...portfolio, accentColor: e.target.value })}
                      className="flex-1 bg-slate-950 border border-slate-800 text-xs px-3 py-2 text-slate-200 rounded font-mono outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: CLOUD HOSTING & EXPORTS */}
            {activeSideTab === 'hosting' && (
              <div className="space-y-6 animate-fadeIn text-xs">
                
                {/* Deployment configuration */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-4">
                  <h4 className="text-xs font-bold text-slate-350 uppercase tracking-widest font-mono">1. Hosting URL config</h4>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Live Subdirectory Slug</label>
                    <div className="flex items-center bg-slate-900 border border-slate-800 rounded overflow-hidden">
                      <span className="bg-slate-950 text-[10px] text-slate-500 px-3.5 py-2 font-mono">profyl.ai/</span>
                      <input 
                        type="text" 
                        value={portfolio.slug}
                        onChange={(e) => setPortfolio({ ...portfolio, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })}
                        className="flex-1 bg-transparent border-0 outline-none px-3 text-white text-xs font-mono py-1.5"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider text-slate-500 font-mono">Cloud Custom Domains</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        placeholder="e.g. portfolio.yourdomain.com"
                        value={portfolio.customDomain || ""}
                        disabled={!user?.plan || user.plan === 'free'}
                        onChange={(e) => setPortfolio({ ...portfolio, customDomain: e.target.value.toLowerCase() })}
                        className="w-full bg-slate-900 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none pr-8 text-[11px]"
                      />
                      {(!user?.plan || user.plan === 'free') && (
                        <div className="absolute right-2.5 top-2 cursor-pointer" onClick={onUpgradePrompt}>
                          <Lock className="w-4 h-4 text-amber-500" />
                        </div>
                      )}
                    </div>
                    {(!user?.plan || user.plan === 'free') && (
                      <p className="text-[9px] text-amber-400">Custom Domains is an Elite SaaS premium feature. Click lock to upgrade.</p>
                    )}
                  </div>

                  {/* isPublished switch toggle */}
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-slate-400 font-medium">Public Status Publish</span>
                    <button 
                      onClick={() => setPortfolio({ ...portfolio, isPublished: !portfolio.isPublished })}
                      className={`px-3 py-1.5 rounded text-[10px] font-mono uppercase font-bold text-center transition ${portfolio.isPublished ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400" : "bg-red-500/15 border border-red-500/30 text-red-400"}`}
                    >
                      {portfolio.isPublished ? "Live Published" : "Suspended Offline"}
                    </button>
                  </div>
                </div>

                {/* Local Backup exports */}
                <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-3">
                  <h4 className="text-xs font-bold text-slate-350 uppercase tracking-widest font-mono">2. Backups & Zip Sources Exports</h4>
                  <p className="text-[10px] text-slate-500">Export your configured layout as functional JSON blueprint meta-structures or optimized ZIP packages.</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <button 
                      onClick={handleExportJSON}
                      className="px-3 py-2 border border-slate-800 hover:bg-slate-850 text-slate-300 text-[10px] font-bold rounded flex items-center justify-center gap-1 uppercase transition"
                    >
                      <FileJson className="w-3.5 h-3.5 text-yellow-500" /> Backup JSON
                    </button>
                    <button 
                      onClick={handleExportZIP}
                      className="px-3 py-2 border border-slate-800 hover:bg-slate-850 text-slate-300 text-[10px] font-bold rounded flex items-center justify-center gap-1 uppercase transition"
                    >
                      <FileCode className="w-3.5 h-3.5 text-indigo-400" /> Download ZIP
                    </button>
                  </div>
                </div>

              </div>
            )}

          </div>

          {/* Quick instructions indicator footer */}
          <footer className="bg-slate-950 px-6 py-4 border-t border-slate-850 text-[10px] text-slate-500 flex justify-between items-center shrink-0">
            <span>Syncs to cloud servers automatically on save.</span>
            <span className="font-mono">PROFYL_v2</span>
          </footer>

        </aside>

        {/* RIGHT PREVIEW MOCKUP CONTAINER */}
        <main className="flex-1 bg-slate-950 p-4 md:p-6 flex flex-col overflow-hidden relative">
          
          {/* Header toolbar stats display link */}
          <div className="bg-slate-900 border border-slate-800/80 p-3 rounded-2xl mb-4 shrink-0 flex flex-wrap items-center justify-between gap-4">
            
            {/* Visual address bar mockup */}
            <div className="bg-slate-950 border border-slate-800 px-4 py-1.5 rounded-lg flex items-center gap-2 max-w-sm w-full">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
              <p className="text-[11px] text-slate-400 truncate font-mono">
                {portfolio.customDomain || `https://profyl.ai/p/${portfolio.slug}`}
              </p>
            </div>

            <div className="flex gap-2 text-xs font-mono">
              <span className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md text-emerald-400">
                AI Credits Used: <strong>{user?.aiUsageCount || 0}/5</strong>
              </span>
              <span className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-md text-slate-400 uppercase">
                Plan: <strong className="text-amber-500">{user?.plan}</strong>
              </span>
            </div>
          </div>

          {/* Main Visual Frame holding TemplatesPreview or AnalyticsView */}
          <div className="flex-1 overflow-y-auto bg-slate-900/40 border border-slate-800/80 rounded-2xl p-4 md:p-6 scroll-smooth position-relative">
            {showAnalyticsDrawer ? (
              <div className="space-y-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                    <TrendingUp className="w-5 h-5 text-indigo-500" /> Real-time Page Analytics Telemetry
                  </h3>
                  <button 
                    onClick={() => setShowAnalyticsDrawer(false)}
                    className="p-1 px-2.5 border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white rounded text-xs duration-150"
                  >
                    Close Analytics
                  </button>
                </div>
                {portfolio.id ? (
                  <AnalyticsView portfolioId={portfolio.id} />
                ) : (
                  <div className="text-center py-12 text-slate-500">
                    <p className="text-xs">Save the portfolio once first to initialize tracking databases.</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-4xl mx-auto">
                <TemplatesPreview data={portfolio} isDemo={true} />
              </div>
            )}
          </div>

        </main>

      </div>

      {/* MODAL: GEMINI AI DRAFT COMPREHENSIVE GENERATION DIALOG OVERLAY */}
      {aiPrompModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl shadow-2xl space-y-4">
            
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h4 className="text-base font-black text-white flex items-center gap-1.5">
                  <Sparkles className="w-5 h-5 text-indigo-400" /> Draft with Gemini 3.5 AI
                </h4>
                <p className="text-slate-400 text-xs text-[11px]">Tell us your role, achievements, or aesthetic and the model will draft complete bios, skills, and niche developments.</p>
              </div>
              <button 
                onClick={() => setAiPrompModalOpen(false)}
                className="text-slate-500 hover:text-white"
              >
                &times;
              </button>
            </div>

            {/* AI Generator field parameters */}
            <div className="space-y-3 pt-2">
              <textarea 
                rows={4}
                placeholder="e.g. A senior machine learning engineer based in Seattle with neon cyberpunk borders who loves AWS pipelines..."
                value={aiSearchPrompt}
                onChange={(e) => setAiSearchPrompt(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 p-3 text-slate-200 text-xs rounded-xl focus:border-indigo-600 outline-none leading-relaxed font-sans"
              />

              {aiProgressStatus && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono text-[10px] rounded space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>{aiProgressStatus}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end pt-2">
              <button 
                onClick={() => setAiPrompModalOpen(false)}
                className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white rounded text-xs"
              >
                Cancel
              </button>
              <button 
                onClick={handleGenerateWholeProfile}
                disabled={!aiSearchPrompt.trim() || aiProgressStatus !== ""}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-850 text-white rounded-xl text-xs font-bold uppercase tracking-wide transition flex items-center gap-1.5"
              >
                Draft Layout <Play className="w-3.5 h-3.5 fill-white" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
