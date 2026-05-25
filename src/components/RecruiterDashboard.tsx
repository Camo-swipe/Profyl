import React, { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  MapPin, 
  Layers, 
  Bookmark, 
  Mail, 
  Briefcase, 
  Award,
  ChevronRight,
  Send,
  Loader2,
  BookmarkCheck,
  Eye,
  Star,
  CheckCircle2,
  X
} from "lucide-react";
import { PortfolioData } from "../types";
import TemplatesPreview from "./TemplatesPreview";

export default function RecruiterDashboard() {
  const [candidates, setCandidates] = useState<PortfolioData[]>([]);
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Search state query
  const [titleQuery, setTitleQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [skillsQuery, setSkillsQuery] = useState("");

  // Visual modal toggles
  const [selectedCandidate, setSelectedCandidate] = useState<PortfolioData | null>(null);
  const [showContactModal, setShowContactModal] = useState<PortfolioData | null>(null);

  // Form parameters
  const [emailSubject, setEmailSubject] = useState("Technical Interview Invitation - nexus recruitment");
  const [emailBody, setEmailBody] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const performSearch = async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (titleQuery) q.set("title", titleQuery);
      if (locationQuery) q.set("location", locationQuery);
      if (skillsQuery) q.set("skills", skillsQuery);
      
      const res = await fetch(`/api/recruiter/search?${q.toString()}`);
      const data = await res.json();
      setCandidates(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const res = await fetch(`/api/recruiter/bookmarks/rec-123`);
      const data = await res.json();
      setBookmarks(data.map((b: PortfolioData) => b.id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleBookmark = async (portfolioId: string) => {
    try {
      const res = await fetch("/api/recruiter/bookmark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolioId, recruiterId: "rec-123" })
      });
      const data = await res.json();
      if (data.bookmarked) {
        setBookmarks(prev => [...prev, portfolioId]);
      } else {
        setBookmarks(prev => prev.filter(id => id !== portfolioId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenContact = (cand: PortfolioData) => {
    setShowContactModal(cand);
    setEmailBody(`Hello ${cand.personalInfo.name},\n\nI was reviewing your Profyl AI profile, and your experience in "${cand.skills.slice(0, 3).join(', ')}" fits perfectly with our technical goals.\n\nCould we schedule an introduction call?\n\nBest regards,\nSarah Recruiter\nNexus Grid Corp`);
    setFormSubmitted(false);
  };

  const handleSendEmailSimulated = () => {
    setFormSubmitted(true);
    setTimeout(() => {
      setShowContactModal(null);
      alert(`[Recruiter Simulated Notification] Message successfully dispatched to ${showContactModal?.personalInfo.email}`);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      
      {/* Header and statistics banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-emerald-400" /> Talent Finder Portal
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">Search and matching intelligence console over globally published portfolios.</p>
        </div>
        <div className="flex gap-2 text-xs font-mono">
          <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded text-indigo-400">
            Bookmarked Candidates: <strong>{bookmarks.length}</strong>
          </span>
        </div>
      </div>

      {/* Recruiter Advanced Filters Console Box */}
      <section className="bg-slate-900 border border-slate-850 p-6 rounded-xl space-y-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 font-mono">Talent Query Filters</h4>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Title Keywords</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="e.g. Architect, Security"
                value={titleQuery}
                onChange={(e) => setTitleQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs px-9 py-2.5 rounded focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Location filter</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="e.g. San Francisco, Tokyo"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs px-9 py-2.5 rounded focus:border-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold tracking-wider text-slate-500 font-mono">Required Tools / Skills</label>
            <div className="relative">
              <Layers className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
              <input 
                type="text"
                placeholder="e.g. Rust, React (comma separated)"
                value={skillsQuery}
                onChange={(e) => setSkillsQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs px-9 py-2.5 rounded focus:border-indigo-600 outline-none"
              />
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end gap-2">
          <button 
            onClick={() => {
              setTitleQuery("");
              setLocationQuery("");
              setSkillsQuery("");
              setTimeout(() => performSearch(), 100);
            }}
            className="px-4 py-2 border border-slate-800 text-slate-400 hover:text-white transition rounded text-xs"
          >
            Clear Filters
          </button>
          <button 
            onClick={performSearch}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold uppercase tracking-wider transition"
          >
            Search Candidates
          </button>
        </div>
      </section>

      {/* Render Match list */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 space-y-2">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
          <p className="text-xs font-mono">Querying candidate registries database...</p>
        </div>
      ) : candidates.length === 0 ? (
        <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-850 rounded-xl">
          <p className="text-xs">No matching verified portfolios found. Clear queries to view all candidates.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {candidates.map((cand) => {
            const hasBookmark = bookmarks.includes(cand.id);
            
            // Random index compatibility score base
            let score = 95;
            if (skillsQuery) {
              const qs = skillsQuery.toLowerCase().split(",").map(val => val.trim()).filter(Boolean);
              const lowercandSkills = cand.skills.map(s => s.toLowerCase());
              const matchCount = qs.filter(q => lowercandSkills.some(idx => idx.includes(q))).length;
              score = qs.length > 0 ? Math.round((matchCount / qs.length) * 100) : 95;
            }

            return (
              <div 
                key={cand.id}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 rounded-2xl flex flex-col justify-between space-y-4 shadow transition duration-200"
              >
                {/* Profile Top Row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-3">
                    <img src={cand.personalInfo.avatar} alt={cand.personalInfo.name} className="w-12 h-12 rounded-xl object-cover border border-slate-850" />
                    <div>
                      <h4 className="font-extrabold text-white text-base flex items-center gap-1.5">
                        {cand.personalInfo.name}
                      </h4>
                      <p className="text-indigo-400 text-xs font-semibold">{cand.personalInfo.title}</p>
                      <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-1 font-mono"><MapPin className="w-3 h-3 text-slate-600" /> {cand.personalInfo.location || "Global candidate"}</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full font-mono font-bold uppercase">
                      {score}% Match
                    </span>
                    <button 
                      onClick={() => handleToggleBookmark(cand.id)}
                      className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-yellow-400 duration-150"
                      title="Bookmark talent"
                    >
                      <Star className={`w-4 h-4 ${hasBookmark ? "fill-yellow-400 text-yellow-500" : ""}`} />
                    </button>
                  </div>
                </div>

                {/* Bio text snippet */}
                <p className="text-slate-300 text-xs leading-relaxed line-clamp-3">
                  {cand.personalInfo.bio}
                </p>

                {/* Skills inventory chips */}
                <div className="flex flex-wrap gap-1 pt-1">
                  {cand.skills.slice(0, 5).map((s, idx) => (
                    <span key={idx} className="text-[10px] px-2 py-0.5 bg-slate-950 text-slate-400 rounded border border-slate-850">
                      {s}
                    </span>
                  ))}
                  {cand.skills.length > 5 && (
                    <span className="text-[10px] px-2 py-0.5 text-indigo-400 font-bold">
                      +{cand.skills.length - 5}
                    </span>
                  )}
                </div>

                {/* Direct Action triggers */}
                <div className="pt-4 border-t border-slate-850 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-500">Slug: /{cand.slug}</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleOpenContact(cand)}
                      className="px-3 py-1.5 border border-slate-800 hover:bg-slate-850 text-slate-300 rounded text-xs font-bold transition flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5" /> Book Interview
                    </button>
                    <button 
                      onClick={() => setSelectedCandidate(cand)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-black uppercase tracking-wider transition flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Inspect Live
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL 1: PREVIEW CANDIDATE PORTFOLIO DIALOG BOX */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-sm flex items-center justify-center p-3 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-5xl h-[90vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl">
            {/* Header bar controls */}
            <div className="bg-slate-950 px-6 py-4 flex justify-between items-center border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h5 className="font-extrabold text-white text-sm uppercase font-mono">Viewing live preview: /{selectedCandidate.slug} (Style_{selectedCandidate.templateId})</h5>
              </div>
              <button 
                onClick={() => setSelectedCandidate(null)}
                className="p-1.5 rounded-full hover:bg-slate-850 text-slate-400 hover:text-white duration-150"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Preview Area */}
            <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950">
              <TemplatesPreview data={selectedCandidate} />
            </div>

            {/* Bottom Actions info */}
            <div className="bg-slate-950 border-t border-slate-800 px-6 py-4 flex justify-between items-center text-xs text-slate-500 shrink-0">
              <span>Recruiter audit simulated triggers are active during inspect.</span>
              <button 
                onClick={() => {
                  setSelectedCandidate(null);
                  handleOpenContact(selectedCandidate);
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold uppercase text-[11px] tracking-wider transition"
              >
                Hire {selectedCandidate.personalInfo.name}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BOOK INTERVIEW CONTACT POPUP DIALOG */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md p-6 rounded-2xl shadow-xl space-y-4 relative">
            
            <button 
              onClick={() => setShowContactModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h4 className="text-base font-black text-white">Contact {showContactModal.personalInfo.name}</h4>
              <p className="text-slate-400 text-xs">Simulate technical screening & interview request templates.</p>
            </div>

            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <label className="text-slate-500 uppercase font-bold tracking-wider font-mono text-[10px]">Subject Title</label>
                <input 
                  type="text" 
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none font-sans"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-500 uppercase font-bold tracking-wider font-mono text-[10px]">Email Message Content</label>
                <textarea 
                  rows={6}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 px-3 py-2 text-slate-200 rounded focus:border-indigo-600 outline-none font-sans"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button 
                onClick={handleSendEmailSimulated}
                disabled={formSubmitted}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-850 text-white rounded font-bold text-xs uppercase tracking-wider transition flex items-center gap-1.5"
              >
                {formSubmitted ? "Transmitting..." : "Send Simulated Memo"} <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
