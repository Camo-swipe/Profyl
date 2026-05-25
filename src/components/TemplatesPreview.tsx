import React, { useState, useEffect, useRef } from "react";

import { 
  Briefcase, 
  MapPin, 
  Mail, 
  Link as LinkIcon, 
  Github, 
  Linkedin, 
  Layers, 
  Award, 
  MessageSquare, 
  Download, 
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  Terminal,
  Cpu
} from "lucide-react";
import { PortfolioData } from "../types";

interface Props {
  data: PortfolioData;
  isDemo?: boolean;
}

export default function TemplatesPreview({ data, isDemo = false }: Props) {
  const [copied, setCopied] = useState(false);

  const tracker = async (type: "view" | "download" | "click", projectId?: string) => {
    if (isDemo) return;
    try {
      await fetch(`/api/analytics/${data.id}/track`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          projectId,
          isRecruiter: true // Simulate all viewer recruiters
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDownloadResume = () => {
    tracker("download");

    const p = personalInfo || { name: "", title: "", bio: "", email: "", location: "", linkedin: "", github: "", headline: "" };
    const nameStr = p.name || "Portfolio Owner";
    const titleStr = p.title || "Developer";
    const bioStr = p.bio || p.headline || "Professional Developer Portfolio Profile.";

    // Simple HTML resume generator that converts perfectly to physical PDF
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${nameStr} - Professional Resume</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1e293b;
      background-color: #f8fafc;
      line-height: 1.5;
      padding: 2.5rem 1rem;
    }

    .no-print {
      max-width: 800px;
      margin: 0 auto 1.5rem auto;
      background: #4f46e5;
      color: white;
      padding: 12px 20px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 13.5px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.08);
    }
    .no-print button {
      background: white;
      color: #4f46e5;
      border: none;
      padding: 6px 14px;
      border-radius: 4px;
      font-weight: 700;
      cursor: pointer;
      font-size: 12.5px;
      transition: background 0.15s ease;
    }
    .no-print button:hover {
      background: #f1f5f9;
    }

    .resume-container {
      background: white;
      max-width: 800px;
      margin: 0 auto;
      padding: 3rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.02), 0 10px 15px -3px rgba(0,0,0,0.03);
    }

    header {
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 1.5rem;
      margin-bottom: 1.5rem;
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
    }

    h1 {
      font-size: 2.1rem;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.025em;
      line-height: 1.1;
    }

    .subtitle-role {
      font-size: 1.1rem;
      color: #4f46e5;
      font-weight: 600;
      margin-top: 0.25rem;
    }

    .contact-info {
      display: flex;
      gap: 1.25rem;
      flex-wrap: wrap;
      margin-top: 1rem;
      font-size: 0.85rem;
      color: #475569;
    }

    .contact-item {
      display: flex;
      align-items: center;
      gap: 0.35rem;
    }

    .section-title {
      font-size: 1rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #0f172a;
      border-bottom: 1px solid #e2e8f0;
      padding-bottom: 0.25rem;
      margin-top: 1.75rem;
      margin-bottom: 0.75rem;
    }

    .bio {
      font-size: 0.9rem;
      color: #334155;
      margin-bottom: 1rem;
    }

    .timeline-item {
      margin-bottom: 1.25rem;
    }

    .timeline-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
    }

    .timeline-sub {
      display: flex;
      justify-content: space-between;
      font-size: 0.875rem;
      color: #4f46e5;
      font-weight: 600;
      margin-top: 0.125rem;
      margin-bottom: 0.375rem;
    }

    .timeline-desc {
      font-size: 0.85rem;
      color: #334155;
      white-space: pre-line;
      line-height: 1.45;
    }

    .grid-2 {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }

    @media (max-width: 640px) {
      .grid-2 {
        grid-template-columns: 1fr;
      }
    }

    .project-card {
      border: 1px solid #e2e8f0;
      background: #f8fafc;
      padding: 1rem;
      border-radius: 8px;
    }

    .project-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: #0f172a;
    }

    .project-tech {
      font-size: 0.775rem;
      color: #4f46e5;
      font-weight: 600;
      margin-bottom: 0.375rem;
    }

    .project-desc {
      font-size: 0.825rem;
      color: #475569;
      line-height: 1.4;
    }

    .tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    .tag {
      background: #f1f5f9;
      color: #334155;
      font-size: 0.775rem;
      font-weight: 600;
      padding: 0.25rem 0.625rem;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }

    .cert-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
    }
    @media (max-width: 640px) {
      .cert-grid {
        grid-template-columns: 1fr;
      }
    }

    .cert-item {
      font-size: 0.85rem;
      color: #334155;
    }

    @media print {
      body {
        background: white;
        padding: 0;
      }
      .no-print {
        display: none !important;
      }
      .resume-container {
        padding: 0;
        box-shadow: none;
        border-radius: 0;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>

  <div class="no-print">
    <span>📄 Your professional CV is ready to print or save. Quick-tip: Select <strong>"Save as PDF"</strong> for clean formatting.</span>
    <button onclick="window.print()">Export to PDF</button>
  </div>

  <div class="resume-container">
    <header>
      <div class="header-main">
        <div>
          <h1>${nameStr}</h1>
          <div class="subtitle-role">${titleStr}</div>
        </div>
      </div>
      <div class="contact-info">
        ${p.email ? `<div class="contact-item"><strong>📧</strong> ${p.email}</div>` : ""}
        ${p.location ? `<div class="contact-item"><strong>📍</strong> ${p.location}</div>` : ""}
        ${p.linkedin ? `<div class="contact-item"><strong>🔗</strong> <a href="https://${p.linkedin.replace("https://", "")}" target="_blank">${p.linkedin}</a></div>` : ""}
        ${p.github ? `<div class="contact-item"><strong>💻</strong> <a href="https://${p.github.replace("https://", "")}" target="_blank">${p.github}</a></div>` : ""}
      </div>
    </header>

    <main>
      <section>
        <div class="section-title">Professional Summary</div>
        <div class="bio">${bioStr}</div>
      </section>

      ${skills && skills.length > 0 ? `
      <section>
        <div class="section-title">Core Skills</div>
        <div class="tags">
          ${skills.map((s: string) => `<span class="tag">${s}</span>`).join("")}
        </div>
      </section>
      ` : ""}

      ${experience && experience.length > 0 ? `
      <section>
        <div class="section-title">Professional Experience</div>
        ${experience.map((exp: any) => `
          <div class="timeline-item">
            <div class="timeline-header">
              <div>${exp.company}</div>
              <div style="font-weight: 500; font-size: 0.85rem; color: #64748b;">${exp.duration}</div>
            </div>
            <div class="timeline-sub">
              <div>${exp.role}</div>
            </div>
            <p class="timeline-desc">${exp.description}</p>
          </div>
        `).join("")}
      </section>
      ` : ""}

      ${projects && projects.length > 0 ? `
      <section>
        <div class="section-title">Key Projects</div>
        <div class="grid-2">
          ${projects.map((proj: any) => `
            <div class="project-card">
              <div class="project-name">${proj.name}</div>
              <div class="project-tech">${proj.technologies ? proj.technologies.join(", ") : ""}</div>
              <p class="project-desc">${proj.description}</p>
            </div>
          `).join("")}
        </div>
      </section>
      ` : ""}

      ${certifications && certifications.length > 0 ? `
      <section>
        <div class="section-title">Certifications & Credentials</div>
        <div class="cert-grid">
          ${certifications.map((cert: any) => `
            <div class="cert-item">
              <strong>${cert.title}</strong> — <span style="color: #64748b;">${cert.issuer} ${cert.date ? `(${cert.date})` : ""}</span>
            </div>
          `).join("")}
        </div>
      </section>
      ` : ""}

      ${testimonials && testimonials.length > 0 ? `
      <section>
        <div class="section-title">Key Citations / Recommendations</div>
        <div style="display: flex; flex-direction: column; gap: 0.75rem;">
          ${testimonials.map((test: any) => `
            <div style="background: #faf8ff; padding: 0.75rem; border-left: 3px solid #6366f1; border-radius: 4px;">
              <p style="font-style: italic; font-size: 0.825rem; color: #475569;">"${test.text}"</p>
              <div style="font-size: 0.8rem; font-weight: 700; color: #0f172a; margin-top: 0.25rem; text-align: right;">
                — ${test.clientName}, <span style="font-weight: 500; color: #64748b;">${test.role}</span>
              </div>
            </div>
          `).join("")}
        </div>
      </section>
      ` : ""}
    </main>
  </div>
</body>
</html>`;

    // Package to download blob
    const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" });
    const fileUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = `${nameStr.toLowerCase().replace(/\s+/g, "_")}_Resume.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(fileUrl);
  };

  const handleProjectClick = (projId: string, url: string) => {
    tracker("click", projId);
    window.open(url, "_blank");
  };

  const { personalInfo, skills, projects, experience, certifications, testimonials, templateId, accentColor } = data;

  // 1. DEVELOPER CYBERPUNK TEMPLATE
  if (templateId === "cyberpunk") {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-emerald-400 font-mono p-4 md:p-8 relative overflow-hidden border-2 border-slate-800 rounded-xl">
        {/* Glow grid backdrops */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#020617_1px,transparent_1px),linear-gradient(to_bottom,#020617_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
        
        {/* Neon scanline overlay */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,3px_100%]" />

        {/* Header Terminal style */}
        <header className="relative z-10 max-w-5xl mx-auto border-b border-emerald-500/30 pb-6 mb-8">
          <div className="flex justify-between items-center text-xs mb-4 text-emerald-500/60">
            <span className="flex items-center gap-1"><Terminal className="w-3 h-3" /> PROFYL_OS v2.43 // CONNECTED</span>
            <span>SECURE STATE / IP_LOCAL</span>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 mt-4">
            <div className="relative">
              <div className="absolute -inset-1.5 bg-pink-500 rounded-full blur opacity-40 animate-pulse" />
              <img 
                src={personalInfo.avatar || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=150&q=80"} 
                alt={personalInfo.name} 
                className="w-24 h-24 rounded-full border-2 border-pink-500 object-cover relative z-10"
              />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-3xl font-black text-white tracking-widest uppercase flex flex-wrap justify-center md:justify-start items-center gap-2">
                {personalInfo.name}
                <span className="text-xs px-2 py-0.5 border border-pink-500 text-pink-500 uppercase font-mono tracking-normal shrink-0 rounded">
                  SYS_LEADER
                </span>
              </h1>
              <p className="text-pink-500 font-bold mt-1 text-base">{personalInfo.title}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs mt-3 text-slate-400">
                <span className="flex items-center gap-1 text-emerald-500"><MapPin className="w-3 h-3" /> {personalInfo.location}</span>
                <span className="flex items-center gap-1 text-emerald-500"><Mail className="w-3 h-3" /> {personalInfo.email}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Bio Terminal */}
        <main className="relative z-10 max-w-5xl mx-auto space-y-12 pb-16">
          <section className="bg-slate-900/80 border border-emerald-500/20 rounded p-6 shadow-lg shadow-emerald-950/20">
            <div className="flex items-center gap-2 mb-4 border-b border-emerald-500/20 pb-2">
              <div className="w-3 h-3 rounded-full bg-pink-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-2">WHOAMI // BIOS_SUMMARY</h3>
            </div>
            <p className="text-emerald-300 leading-relaxed text-sm md:text-base">{personalInfo.bio}</p>
            {personalInfo.headline && (
              <p className="mt-3 text-pink-400 text-xs font-semibold italic">
                &gt;&gt; "{personalInfo.headline}"
              </p>
            )}
          </section>

          {/* Grid setup */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Skills Panel */}
            <section className="md:col-span-1 bg-slate-900/80 border border-emerald-500/20 rounded p-6">
              <h3 className="text-sm font-black text-white tracking-wider uppercase border-b border-emerald-500/20 pb-2 mb-4 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-pink-500" /> INVENTORY
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill, index) => (
                  <span 
                    key={index} 
                    className="text-xs px-2 py-1 bg-slate-950 border border-emerald-500/40 text-emerald-400 hover:border-pink-500 hover:text-white transition duration-200 cursor-default rounded"
                  >
                    [ {skill} ]
                  </span>
                ))}
              </div>
            </section>

            {/* Exp and Certifications */}
            <div className="md:col-span-2 space-y-8">
              {/* Projects */}
              <section className="bg-slate-900/80 border border-emerald-500/20 rounded p-6">
                <h3 className="text-sm font-black text-white tracking-wider uppercase border-b border-emerald-500/20 pb-2 mb-4 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> RECENT_DEPLOYMENTS
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projects.map((proj) => (
                    <div 
                      key={proj.id} 
                      onClick={() => handleProjectClick(proj.id, proj.url)}
                      className="group border border-emerald-500/10 hover:border-pink-500/50 bg-slate-950/60 p-4 rounded transition duration-200 cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        {proj.image && (
                          <img src={proj.image} alt={proj.name} className="w-full h-24 object-cover rounded opacity-80 group-hover:opacity-100 transition mb-3" />
                        )}
                        <h4 className="font-bold text-white text-sm group-hover:text-pink-400 duration-200 flex items-center gap-1.5">
                          {proj.name} <ExternalLink className="w-3 h-3 text-slate-500 shrink-0" />
                        </h4>
                        <p className="text-slate-400 text-xs mt-1.5 line-clamp-3">{proj.description}</p>
                      </div>
                      <div className="mt-4 flex flex-wrap gap-1.5 pt-2">
                        {proj.technologies.map((t, idx) => (
                          <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-900 text-pink-500 border border-pink-500/20 rounded">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Experiences */}
              <section className="bg-slate-900/80 border border-emerald-500/20 rounded p-6">
                <h3 className="text-sm font-black text-white tracking-wider uppercase border-b border-emerald-500/20 pb-2 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-emerald-400" /> HISTORIC_LOGS
                </h3>
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="border-l border-pink-500/40 pl-4 py-1">
                      <div className="flex justify-between items-start flex-wrap gap-2">
                        <h4 className="font-bold text-white text-sm">{exp.role}</h4>
                        <span className="text-xs text-pink-500 bg-pink-500/10 px-2 py-0.5 border border-pink-500/20 rounded">{exp.duration}</span>
                      </div>
                      <p className="text-xs text-emerald-500 mt-0.5">{exp.company}</p>
                      <p className="text-slate-400 text-xs mt-2">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Certs and Testimonials */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {certifications.length > 0 && (
                  <div className="bg-slate-900/80 border border-emerald-500/20 rounded p-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-pink-500" /> SECURITY_CERTS
                    </h4>
                    <div className="space-y-3">
                      {certifications.map((c) => (
                        <div key={c.id} className="text-xs">
                          <p className="text-emerald-400 font-bold">{c.title}</p>
                          <p className="text-slate-400">{c.issuer} // {c.date}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {testimonials.length > 0 && (
                  <div className="bg-slate-900/80 border border-emerald-500/20 rounded p-4">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> SIGNALS_FEEDBACK
                    </h4>
                    {testimonials.map((t) => (
                      <div key={t.id} className="text-xs space-y-2">
                        <p className="text-slate-400 italic">"{t.text}"</p>
                        <p className="text-pink-500 font-bold text-right">— {t.clientName}, <span className="text-slate-500">{t.role}</span></p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
        
        {/* Futuristic bottom controls */}
        <footer className="relative z-10 max-w-5xl mx-auto border-t border-emerald-500/20 pt-6 mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 font-mono">ENCRYPTED ENDPOINT WITH AES_256</p>
          <div className="flex gap-4">
            <button 
              onClick={handleDownloadResume}
              className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white font-mono text-xs rounded transition flex items-center gap-2 font-bold shadow-lg shadow-pink-900/30"
            >
              <Download className="w-3.5 h-3.5" /> DECRYPT_RESUME.PDF
            </button>
          </div>
        </footer>
      </div>
    );
  }

  // 2. MINIMAL GLASSMORPHISM TEMPLATE
  if (templateId === "glassmorphism") {
    return (
      <div className="w-full min-h-screen bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 text-slate-100 p-4 md:p-12 relative overflow-hidden border border-indigo-900/30 rounded-xl">
        {/* Dynamic smooth floating light circles blur */}
        <div className="absolute top-20 left-10 w-48 h-48 rounded-full bg-indigo-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          {/* Main top Profile Card */}
          <header className="backdrop-blur-md bg-white/5 border border-white/10 p-8 rounded-2xl shadow-xl flex flex-col md:flex-row items-center gap-8">
            <img 
              src={personalInfo.avatar || "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"} 
              alt={personalInfo.name} 
              className="w-28 h-28 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-inner"
            />
            <div className="text-center md:text-left flex-1 space-y-3">
              <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-200 via-pink-200 to-white bg-clip-text text-transparent">
                {personalInfo.name}
              </h1>
              <p className="text-indigo-300 font-medium text-lg leading-none">{personalInfo.title}</p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-indigo-400" /> {personalInfo.location}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-indigo-400" /> {personalInfo.email}</span>
              </div>
            </div>
            <button 
              onClick={handleDownloadResume} 
              className="w-full md:w-auto shrink-0 px-5 py-2.5 bg-indigo-600/30 border border-indigo-400/30 hover:bg-indigo-600 hover:text-white transition duration-200 backdrop-blur-md text-indigo-300 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow"
            >
              <Download className="w-4 h-4" /> Download Resume
            </button>
          </header>

          <main className="space-y-8">
            {/* About and Skills in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg space-y-4">
                <h3 className="text-lg font-bold text-slate-200 border-b border-indigo-900/30 pb-2">About Me</h3>
                <p className="text-slate-300 text-sm leading-relaxed">{personalInfo.bio}</p>
                {personalInfo.headline && (
                  <p className="text-indigo-300 text-xs italic bg-indigo-950/40 p-3 border border-indigo-800/30 rounded-xl leading-relaxed">
                    "{personalInfo.headline}"
                  </p>
                )}
              </div>
              <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg space-y-4">
                <h3 className="text-lg font-bold text-slate-200 border-b border-indigo-900/30 pb-2">Skills Inventory</h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 cursor-default rounded-lg duration-150">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Work experience */}
            <section className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg space-y-6">
              <h3 className="text-lg font-bold text-slate-200 border-b border-indigo-900/30 pb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-indigo-400" /> Professional Journeys
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="bg-white/2 border border-white/5 hover:border-indigo-500/20 p-4 rounded-xl transition space-y-2">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-semibold text-slate-100 text-sm">{exp.role}</h4>
                      <span className="text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 px-2 py-0.5 rounded-full">{exp.duration}</span>
                    </div>
                    <p className="text-indigo-400 font-medium text-xs">{exp.company}</p>
                    <p className="text-slate-400 text-xs leading-relaxed">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Projects in Glass style */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2 pl-1">
                <Layers className="w-4 h-4 text-pink-400" /> Showcase Projects
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div 
                    key={proj.id} 
                    onClick={() => handleProjectClick(proj.id, proj.url)}
                    className="backdrop-blur-md bg-white/5 border border-white/10 hover:border-pink-500/40 p-4 rounded-2xl shadow-md cursor-pointer group flex flex-col justify-between hover:-translate-y-1 duration-200"
                  >
                    <div>
                      {proj.image && (
                        <div className="overflow-hidden rounded-xl mb-3">
                          <img src={proj.image} alt={proj.name} className="w-full h-32 object-cover group-hover:scale-105 duration-200" />
                        </div>
                      )}
                      <h4 className="font-bold text-slate-100 text-sm group-hover:text-pink-300 flex items-center justify-between gap-2 duration-150">
                        {proj.name} <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </h4>
                      <p className="text-slate-400 text-xs mt-1.5 leading-relaxed line-clamp-3">{proj.description}</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-white/5">
                      {proj.technologies.map((tech, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded-md">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Testimonials and details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {certifications.length > 0 && (
                <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <Award className="w-4 h-4 text-indigo-400" /> Certifications
                  </h4>
                  <div className="space-y-3">
                    {certifications.map((c) => (
                      <div key={c.id} className="text-xs">
                        <p className="font-semibold text-slate-200">{c.title}</p>
                        <p className="text-slate-400 text-[11px]">{c.issuer} • {c.date}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {testimonials.length > 0 && (
                <div className="backdrop-blur-md bg-white/5 border border-white/10 p-6 rounded-2xl shadow-lg space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                    <MessageSquare className="w-4 h-4 text-pink-400" /> Colleague Endorsements
                  </h4>
                  {testimonials.map((t) => (
                    <div key={t.id} className="text-xs space-y-2">
                      <p className="text-slate-300 italic">"{t.text}"</p>
                      <div className="flex items-center gap-2 justify-end">
                        {t.avatar && <img src={t.avatar} alt={t.clientName} className="w-5 h-5 rounded-full object-cover" />}
                        <p className="text-indigo-400 font-semibold">— {t.clientName}, <span className="text-slate-500">{t.role}</span></p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // 3. CORPORATE PROFESSIONAL TEMPLATE (ATS and Executive Friendly)
  if (templateId === "professional") {
    return (
      <div className="w-full min-h-screen bg-white text-slate-800 p-4 md:p-12 relative border border-slate-200 rounded-xl max-w-5xl mx-auto shadow-sm">
        <header className="border-b-2 border-slate-900 pb-6 mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-2 flex-1">
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none uppercase">
              {personalInfo.name}
            </h1>
            <p className="text-indigo-700 font-bold tracking-widest uppercase text-xs sm:text-sm">{personalInfo.title}</p>
            <div className="flex flex-wrap gap-y-1 gap-x-4 text-xs font-medium text-slate-500 pt-2">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.location}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-400" /> {personalInfo.email}</span>
            </div>
          </div>
          <button 
            onClick={handleDownloadResume} 
            className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded hover:bg-indigo-700 transition flex items-center gap-2 shadow-sm shrink-0"
          >
            <Download className="w-3.5 h-3.5" /> PRINT CV / RESUME
          </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* Main profile layout left */}
          <div className="md:col-span-2 space-y-8">
            <section className="space-y-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 hover:text-indigo-700 transition duration-150">Professional Summary</h3>
              <p className="text-slate-600 leading-relaxed font-normal">{personalInfo.bio}</p>
              {personalInfo.headline && (
                <p className="text-slate-800 font-medium italic border-l-2 border-indigo-600 pl-3 py-1">
                  "{personalInfo.headline}"
                </p>
              )}
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Professional Experience</h3>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex justify-between items-start flex-wrap gap-2 text-slate-900">
                      <h4 className="font-bold text-sm md:text-base">{exp.role}</h4>
                      <span className="text-xs font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{exp.duration}</span>
                    </div>
                    <p className="text-[13px] text-indigo-700 font-bold tracking-wide">{exp.company}</p>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Key Achievements & Projects</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((proj) => (
                  <div 
                    key={proj.id} 
                    onClick={() => handleProjectClick(proj.id, proj.url)}
                    className="border border-slate-200 hover:border-indigo-600 p-4 rounded bg-slate-50/50 cursor-pointer transition hover:shadow-xs group"
                  >
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-indigo-700 duration-150 flex justify-between items-center gap-1">
                      {proj.name} <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-indigo-600" />
                    </h4>
                    <p className="text-slate-500 text-xs mt-1 leading-relaxed line-clamp-3">{proj.description}</p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {proj.technologies.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right layout parameters */}
          <div className="space-y-8 md:border-l md:border-slate-200 md:pl-6">
            <section className="space-y-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Technical Skillset</h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s, idx) => (
                  <span key={idx} className="text-xs px-2 py-1 bg-indigo-50 border border-indigo-100 text-indigo-900 rounded font-medium">
                    {s}
                  </span>
                ))}
              </div>
            </section>

            {certifications.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Certifications</h3>
                <div className="space-y-3">
                  {certifications.map((c) => (
                    <div key={c.id} className="text-xs">
                      <p className="font-bold text-slate-900 leading-tight">{c.title}</p>
                      <p className="text-slate-500">{c.issuer} ({c.date})</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {testimonials.length > 0 && (
              <section className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Professional Validation</h3>
                <div className="space-y-3">
                  {testimonials.map((t) => (
                    <div key={t.id} className="bg-slate-50 p-3 rounded border border-slate-100 space-y-2 text-xs">
                      <p className="text-slate-600 italic">"{t.text}"</p>
                      <p className="font-bold text-slate-900 text-right">— {t.clientName}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <div className="p-4 bg-slate-900 text-white rounded space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-yellow-500" /> ATS COMPLIANCE OK
              </h4>
              <p className="text-[11px] text-slate-400">This layout conforms precisely to global recruiter indexing requirements and machine parsing standards.</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 4. CREATIVE DESIGNER TEMPLATE (Bold colors, visual storytelling)
  if (templateId === "creative") {
    return (
      <div className="w-full min-h-screen bg-slate-900 text-white p-4 md:p-8 rounded-xl relative overflow-hidden">
        {/* Dynamic bright shapes */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tr from-pink-500 to-yellow-500 opacity-20 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-60 h-60 rounded-full bg-indigo-600 opacity-20 blur-2xl" />

        <div className="relative z-10 max-w-5xl mx-auto space-y-12">
          {/* Main Visual Header */}
          <header className="flex flex-col md:flex-row items-center gap-8 bg-slate-800/80 border-3 border-white p-6 md:p-10 rounded-3xl shadow-2xl relative">
            <div className="absolute top-2 right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
            <div className="relative shrink-0">
              <img 
                src={personalInfo.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"} 
                alt={personalInfo.name} 
                className="w-28 h-28 md:w-36 md:h-36 rounded-2xl object-cover border-4 border-yellow-400 -rotate-3 hover:rotate-0 transition duration-300 shadow-lg"
              />
            </div>
            <div className="flex-1 text-center md:text-left space-y-3">
              <span className="px-3 py-1 bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-widest rounded-full">Creative Space</span>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
                {personalInfo.name}
              </h1>
              <p className="text-pink-400 font-extrabold text-lg sm:text-xl">{personalInfo.title}</p>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-yellow-400" /> {personalInfo.location}</span>
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-pink-400" /> {personalInfo.email}</span>
              </div>
            </div>
            <button 
              onClick={handleDownloadResume} 
              className="w-full md:w-auto shrink-0 px-6 py-3 bg-gradient-to-r from-yellow-400 to-pink-500 text-slate-950 hover:scale-105 transition duration-200 hover:text-white rounded-2xl text-sm font-black flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-4 h-4" /> Download Resume Box
            </button>
          </header>

          {/* Bio text */}
          <section className="bg-slate-800/65 border-2 border-slate-700 p-6 md:p-8 rounded-3xl space-y-4">
            <h3 className="text-xl font-black uppercase text-yellow-400 tracking-wider">Concept Blueprint</h3>
            <p className="text-slate-100 text-sm sm:text-base leading-relaxed">{personalInfo.bio}</p>
            {personalInfo.headline && (
              <p className="text-pink-300 text-xs sm:text-sm font-extrabold italic border-l-4 border-pink-500 pl-4 py-1">
                "{personalInfo.headline}"
              </p>
            )}
          </section>

          {/* Core Projects grid */}
          <section className="space-y-6">
            <h3 className="text-2xl font-black uppercase tracking-tight text-white flex items-center gap-2">
              <Layers className="w-6 h-6 text-pink-500" /> Curated Projects Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj) => (
                <div 
                  key={proj.id} 
                  onClick={() => handleProjectClick(proj.id, proj.url)}
                  className="group bg-slate-800 border-2 border-slate-700 hover:border-yellow-400 p-5 rounded-3xl shadow-lg cursor-pointer transition duration-300 flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    {proj.image && (
                      <div className="overflow-hidden rounded-2xl">
                        <img src={proj.image} alt={proj.name} className="w-full h-44 object-cover group-hover:scale-105 transition duration-300" />
                      </div>
                    )}
                    <h4 className="font-extrabold text-white text-lg group-hover:text-yellow-400 transition flex items-center justify-between gap-2 duration-150">
                      {proj.name} <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-yellow-400" />
                    </h4>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">{proj.description}</p>
                  </div>
                  <div className="mt-6 flex flex-wrap gap-2 pt-4 border-t border-slate-700">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-xs px-2.5 py-0.5 bg-slate-900 border border-slate-700 text-pink-400 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experiences and skills in side cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 bg-slate-800/80 border-2 border-slate-700 p-6 rounded-3xl space-y-6">
              <h3 className="text-lg font-black uppercase text-yellow-400">Creative Timeline</h3>
              <div className="space-y-6">
                {experience.map((exp) => (
                  <div key={exp.id} className="relative pl-6 border-l-2 border-pink-500">
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <h4 className="font-bold text-white text-base">{exp.role}</h4>
                      <span className="text-[10px] sm:text-xs text-yellow-500 font-bold bg-yellow-400/10 px-2 py-0.5 rounded-full">{exp.duration}</span>
                    </div>
                    <p className="text-xs text-pink-400 font-semibold">{exp.company}</p>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6 bg-slate-800/80 border-2 border-slate-700 p-6 rounded-3xl">
              <h3 className="text-lg font-black uppercase text-pink-400">Toolkit Base</h3>
              <div className="flex flex-wrap gap-2">
                {skills.map((s, idx) => (
                  <span key={idx} className="text-xs px-3 py-1 bg-slate-900 border border-slate-700 text-slate-100 uppercase tracking-widest font-bold rounded-lg hover:border-yellow-400 duration-150 cursor-pointer">
                    {s}
                  </span>
                ))}
              </div>

              {certifications.length > 0 && (
                <div className="pt-4 border-t border-slate-700 space-y-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Achievements</h4>
                  {certifications.slice(0, 2).map((c) => (
                    <div key={c.id} className="text-xs">
                      <p className="font-bold text-slate-100">{c.title}</p>
                      <p className="text-slate-400">{c.issuer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. STARTUP FOUNDER TEMPLATE (Pitch-deck inspired, stats count layout)
  if (templateId === "founder") {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-white p-4 md:p-12 border border-yellow-500/20 rounded-xl relative">
        <div className="absolute top-10 right-20 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl" />
        
        <div className="relative z-10 max-w-4xl mx-auto space-y-12">
          {/* Pitch Deck Title and Mission */}
          <header className="border-b border-white/10 pb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
            <img 
              src={personalInfo.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"} 
              alt={personalInfo.name} 
              className="w-24 h-24 rounded-full object-cover border-2 border-amber-500"
            />
            <div className="text-center md:text-left flex-1 space-y-2">
              <span className="text-xs font-bold tracking-widest text-amber-500 uppercase bg-amber-500/10 px-3 py-1 rounded">DECK OUTLINE_</span>
              <h1 className="text-4xl font-extrabold tracking-tight text-white">{personalInfo.name}</h1>
              <p className="text-slate-400 font-medium text-lg">{personalInfo.title} @ <span className="text-amber-500">Founder Lab</span></p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono text-slate-500">
                <span>📍 {personalInfo.location}</span>
                <span>✉️ {personalInfo.email}</span>
              </div>
            </div>
            <button 
              onClick={handleDownloadResume} 
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs sm:text-sm font-bold tracking-wide transition duration-150 shrink-0 uppercase rounded"
            >
              Get Investor Memo (CV)
            </button>
          </header>

          <main className="space-y-10">
            {/* Elevator Pitch Box */}
            <section className="bg-slate-900 border border-white/5 p-6 md:p-8 rounded-xl space-y-4 shadow-lg">
              <h3 className="text-sm font-bold text-amber-500 uppercase tracking-widest">1. THE ELEVATOR PITCH</h3>
              <p className="text-slate-200 text-base sm:text-lg font-light leading-relaxed">
                "{personalInfo.bio}"
              </p>
              {personalInfo.headline && (
                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <p className="text-amber-500 text-xs sm:text-sm font-semibold uppercase tracking-wider">{personalInfo.headline}</p>
                </div>
              )}
            </section>

            {/* Achievements Counter Stats inspired */}
            <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-lg text-center">
                <p className="text-3xl font-extrabold text-white">4+</p>
                <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">Years Exp</p>
              </div>
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-lg text-center">
                <p className="text-3xl font-extrabold text-amber-500">100%</p>
                <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">Launch rate</p>
              </div>
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-lg text-center">
                <p className="text-3xl font-extrabold text-white">8+</p>
                <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">Products Built</p>
              </div>
              <div className="bg-slate-900/40 border border-white/5 p-4 rounded-lg text-center">
                <p className="text-3xl font-extrabold text-amber-500">AWS / GCP</p>
                <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">Expertise</p>
              </div>
            </section>

            {/* Core Ventures / Projects */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">2. THE PORTFOLIO VENTURES</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map((proj) => (
                  <div 
                    key={proj.id} 
                    onClick={() => handleProjectClick(proj.id, proj.url)}
                    className="bg-slate-900 border border-white/15 hover:border-amber-500 p-5 rounded-lg transition duration-200 cursor-pointer flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <h4 className="font-extrabold text-white text-base flex justify-between items-center gap-2">
                        {proj.name} <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      </h4>
                      <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{proj.description}</p>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-1.5 pt-4 border-t border-white/5">
                      {proj.technologies.map((t, idx) => (
                        <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-950 text-amber-500 border border-amber-500/20 rounded">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Experience and Skills */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-white/5 p-6 rounded-lg space-y-4">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">3. CHRONOLOGICAL EXECUTION RECOGNITIONS</h3>
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="text-xs">
                      <p className="font-bold text-white text-[13px]">{exp.role} @ {exp.company}</p>
                      <p className="text-slate-500 font-mono mt-0.5">{exp.duration}</p>
                      <p className="text-slate-400 mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900 border border-white/5 p-6 rounded-lg space-y-4">
                <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest">4. TOOLKIT & VALIDATIONS</h3>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-slate-950 text-slate-300 border border-white/5 rounded font-mono">
                      {s}
                    </span>
                  ))}
                </div>

                {testimonials.length > 0 && (
                  <div className="pt-4 border-t border-white/10 space-y-2">
                    <p className="text-[11px] text-slate-400 italic">"{testimonials[0].text}"</p>
                    <p className="text-[10px] text-amber-500 text-right">— {testimonials[0].clientName}, {testimonials[0].role}</p>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // 6. NEO-BRUTALIST THEME (High-contrast, bold lines, solid drop shadows, raw modernism)
  if (templateId === "neo_brutalist") {
    return (
      <div className="w-full min-h-screen bg-yellow-50 text-slate-950 p-6 md:p-12 border-4 border-slate-950 rounded-xl relative space-y-10 font-sans">
        <header className="border-4 border-slate-950 bg-white p-6 md:p-8 rounded-none shadow-[6px_6px_0px_#000000] flex flex-col md:flex-row items-center md:items-start gap-6">
          <img 
            src={personalInfo.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"} 
            alt={personalInfo.name} 
            className="w-24 h-24 rounded-none object-cover border-4 border-slate-950 shadow-[4px_4px_0px_#000000]"
          />
          <div className="text-center md:text-left flex-1 space-y-2">
            <span className="text-xs font-black tracking-widest text-[#4f46e5] uppercase bg-yellow-200 border-2 border-slate-950 px-3 py-1">Swiss Brutalist //</span>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-950 uppercase select-all leading-none pt-1">{personalInfo.name}</h1>
            <p className="text-slate-800 font-extrabold text-lg uppercase tracking-wide">{personalInfo.title}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono font-bold text-slate-700">
              <span className="bg-white border border-slate-950 px-2 py-0.5">📍 {personalInfo.location}</span>
              <span className="bg-white border border-slate-950 px-2 py-0.5">✉️ {personalInfo.email}</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleDownloadResume} 
            className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-black tracking-widest uppercase border-4 border-slate-950 rounded-none shadow-[4px_4px_0px_#000000] active:translate-x-1 active:translate-y-1 active:shadow-none transition duration-150 shrink-0"
          >
            Download Memo (CV)
          </button>
        </header>

        <main className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Bio info */}
          <section className="md:col-span-2 border-4 border-slate-950 bg-white p-6 rounded-none shadow-[6px_6px_0px_#000000] space-y-4">
            <h3 className="text-lg font-black uppercase text-slate-950 border-b-4 border-slate-950 pb-2 bg-yellow-100/60 px-2">1. Pitch Manifesto</h3>
            <p className="text-slate-850 text-base font-bold leading-relaxed">{personalInfo.bio}</p>
            {personalInfo.headline && (
              <p className="text-indigo-600 text-sm font-black uppercase tracking-wider bg-[#e0e7ff] border-2 border-slate-950 px-3 py-2">
                " {personalInfo.headline} "
              </p>
            )}
          </section>

          {/* Core toolkit */}
          <section className="border-4 border-slate-950 bg-white p-6 rounded-none shadow-[6px_6px_0px_#000000] space-y-4">
            <h3 className="text-lg font-black uppercase text-slate-950 border-b-4 border-slate-950 pb-2 bg-pink-100 px-2">2. Toolkit</h3>
            <div className="flex flex-wrap gap-2 pt-2">
              {skills.map((s, idx) => (
                <span key={idx} className="text-xs px-2.5 py-1 bg-white border-2 border-slate-950 text-slate-900 uppercase font-black tracking-wider rounded-none hover:bg-slate-950 hover:text-white duration-100 cursor-pointer">
                  {s}
                </span>
              ))}
            </div>
          </section>

          {/* Ventured Projects */}
          <section className="md:col-span-3 space-y-4">
            <h3 className="text-xl font-black uppercase text-slate-950 bg-cyan-100 border-4 border-slate-950 p-3 shadow-[4px_4px_0px_#000000] inline-block">3. Selected Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.map((proj) => (
                <div 
                  key={proj.id} 
                  onClick={() => handleProjectClick(proj.id, proj.url)}
                  className="bg-white border-4 border-slate-950 p-6 rounded-none shadow-[6px_6px_0px_#000000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_#000000] transition duration-200 cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    <h4 className="font-black text-lg text-slate-900 border-b-2 border-slate-950 pb-1 uppercase tracking-tight flex justify-between items-center bg-slate-50 px-2">
                      {proj.name} <ExternalLink className="w-4 h-4 text-slate-950" />
                    </h4>
                    <p className="text-slate-800 text-xs sm:text-sm font-semibold pt-1">{proj.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5 border-t border-slate-200 pt-3">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 bg-yellow-250 border border-slate-950 text-slate-950 font-black rounded-none">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Chronology & Accents */}
          <section className="md:col-span-3 border-4 border-slate-950 bg-white p-6 rounded-none shadow-[6px_6px_0px_#000000]">
            <h3 className="text-lg font-black uppercase text-slate-950 border-b-4 border-slate-950 pb-2 bg-[#e0e7ff] px-2 mb-4">4. Experience Narrative</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {experience.map((exp) => (
                <div key={exp.id} className="border-2 border-slate-950 p-4 bg-yellow-50/20">
                  <p className="font-extrabold text-[#4f46e5] uppercase text-sm">{exp.role} // {exp.company}</p>
                  <p className="text-slate-500 font-bold font-mono text-xs mt-0.5">{exp.duration}</p>
                  <p className="text-slate-700 text-xs sm:text-sm font-semibold mt-2">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // 7. MIDNIGHT NEBULA THEME (Cosmic purple, starry gradient dark mode, modern neon)
  if (templateId === "midnight_nebula") {
    return (
      <div className="w-full min-h-screen bg-neutral-950 text-slate-100 p-6 md:p-12 border border-violet-500/30 rounded-xl relative space-y-12 overflow-hidden">
        {/* Cosmos gradient nodes */}
        <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-indigo-600/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-violet-600/15 blur-3xl" />
        
        <header className="relative z-10 max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-6 pb-8 border-b border-violet-900/30">
          <img 
            src={personalInfo.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"} 
            alt={personalInfo.name} 
            className="w-24 h-24 rounded-full object-cover border-2 border-violet-500 ring-4 ring-indigo-950"
          />
          <div className="text-center md:text-left flex-1 space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-violet-300 font-bold uppercase bg-violet-950/80 border border-violet-800/40 px-2.5 py-0.5 rounded-full">
              Cosmic Slate Overlay_
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {personalInfo.name}
            </h1>
            <p className="text-violet-400 font-semibold text-lg">{personalInfo.title}</p>
            
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-slate-400 font-mono">
              <span>📍 {personalInfo.location}</span>
              <span>✉️ {personalInfo.email}</span>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleDownloadResume} 
            className="px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition shadow-lg shadow-violet-950/50 shrink-0"
          >
            Launch Astro CV
          </button>
        </header>

        <main className="relative z-10 max-w-4xl mx-auto space-y-10">
          {/* Bio statement */}
          <section className="bg-neutral-900/60 border border-violet-900/20 p-6 md:p-8 rounded-2xl space-y-3 backdrop-blur-sm">
            <h3 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest">01 / Pitch Narrative</h3>
            <p className="text-slate-200 text-base font-light leading-relaxed">
              "{personalInfo.bio}"
            </p>
            {personalInfo.headline && (
              <p className="text-violet-300 text-xs sm:text-sm font-mono border-l-2 border-violet-500 pl-3 italic mt-4">
                &gt;&gt; {personalInfo.headline}
              </p>
            )}
          </section>

          {/* Ventured Projects */}
          <section className="space-y-4">
            <h3 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest">02 / Selected Cosmos Missions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((proj) => (
                <div 
                  key={proj.id} 
                  onClick={() => handleProjectClick(proj.id, proj.url)}
                  className="bg-neutral-900/40 border border-violet-950 hover:border-violet-500 p-5 rounded-2xl transition duration-300 cursor-pointer flex flex-col justify-between group"
                >
                  <div className="space-y-2">
                    <h4 className="font-extrabold text-white text-base flex justify-between items-center">
                      {proj.name} <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-violet-400 duration-150" />
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">{proj.description}</p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-1 pt-3 border-t border-violet-950">
                    {proj.technologies.map((t, idx) => (
                      <span key={idx} className="text-[9px] font-mono px-2 py-0.5 bg-neutral-950 border border-violet-900/30 text-violet-300 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Experience Timeline */}
          <section className="bg-neutral-900/30 border border-violet-950 p-6 rounded-2xl space-y-6">
            <h3 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest">03 / Astrochronology</h3>
            <div className="space-y-6 relative border-l-2 border-violet-900/40 pl-5 ml-2">
              {experience.map((exp) => (
                <div key={exp.id} className="relative space-y-1">
                  <div className="absolute -left-[27px] top-1.5 w-3 h-3 rounded-full bg-violet-500 border-2 border-neutral-950" />
                  <p className="font-bold text-white text-sm uppercase">{exp.role} @ {exp.company}</p>
                  <p className="text-[10px] text-violet-400 font-mono font-medium">{exp.duration}</p>
                  <p className="text-slate-400 text-xs sm:text-sm mt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Toolkit */}
          <section className="bg-neutral-900/40 border border-violet-950 p-6 rounded-2xl space-y-4 text-center">
            <h3 className="text-xs font-mono font-bold text-violet-400 uppercase tracking-widest">04 / Unified Core Systems</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {skills.map((s, idx) => (
                <span key={idx} className="text-xs font-mono px-3 py-1.5 bg-neutral-950 border border-violet-900/40 text-slate-200 rounded-lg select-none hover:border-indigo-400 border-dashed duration-150 cursor-pointer">
                  {s}
                </span>
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // Fallback layout generic
  return (
    <div className="p-8 text-center text-slate-400">
      <p>Error rendering portfolio preview template.</p>
    </div>
  );
}
