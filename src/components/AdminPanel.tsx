import React, { useEffect, useState } from "react";
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  TrendingUp, 
  Cpu, 
  Sparkles, 
  ToggleLeft, 
  ToggleRight, 
  Trash,
  CheckCircle2,
  AlertTriangle,
  Loader2
} from "lucide-react";

interface AdminOverview {
  totalUsers: number;
  premiumUsers: number;
  totalPortfolios: number;
  activePublished: number;
  aggregateViews: number;
  usersList: Array<{ id: string; email: string; name: string; role: string; plan: string; portfolioCount: number; aiUsageCount: number }>;
  portfoliosList: Array<{ id: string; slug: string; title: string; userName: string; templateId: string; isPublished: boolean }>;
}

interface AdminPanelProps {
  user: { id: string; email: string; name: string; role: string; plan: string; } | null;
}

export default function AdminPanel({ user }: AdminPanelProps) {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    if (!user) return;
    try {
      const res = await fetch("/api/admin/overview", {
        headers: {
          "Authorization": `Bearer mock-token-${user.id}`
        }
      });
      const parsed = await res.json();
      setData(parsed);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [user]);

  const handleToggleModeration = async (portfolioId: string, currentStatus: boolean) => {
    if (!user) return;
    try {
      const res = await fetch("/api/admin/moderate-portfolio", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer mock-token-${user.id}`
        },
        body: JSON.stringify({ portfolioId, isPublished: !currentStatus })
      });
      const parsed = await res.json();
      if (parsed.success) {
        // Optimistic state updates
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            portfoliosList: prev.portfoliosList.map(p => 
              p.id === portfolioId ? { ...p, isPublished: !currentStatus } : p
            )
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggleUserPlan = async (userId: string, currentPlan: string) => {
    // Modify on local express-backed users db securely
    try {
      let targetEndpoint = "/api/subs/upgrade";
      let nextPlan: 'free' | 'student_pro' | 'premium' | 'lifetime' = 'student_pro';
      
      if (currentPlan === 'free') {
        nextPlan = 'student_pro';
      } else if (currentPlan === 'student_pro') {
        nextPlan = 'premium';
      } else if (currentPlan === 'premium') {
        nextPlan = 'lifetime';
      } else {
        targetEndpoint = "/api/subs/cancel";
        nextPlan = 'free';
      }

      const res = await fetch(targetEndpoint, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer mock-token-${userId}`
        },
        body: JSON.stringify({ plan: nextPlan })
      });
      const parsed = await res.json();
      if (parsed.success) {
        setData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            usersList: prev.usersList.map(u => 
              u.id === userId ? { ...u, plan: nextPlan } : u
            )
          };
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin mx-auto text-indigo-500 mb-2" />
        <p className="text-xs font-mono">Connecting secure admin supervisor channel...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p className="text-xs">Unauthorized or failed connection to administration schemas.</p>
      </div>
    );
  }

  // Calculate stats proportions
  const totalAIUsage = data.usersList.reduce((sum, u) => sum + (u.aiUsageCount || 0), 0);

  return (
    <div className="space-y-6">
      
      {/* Header and indicator bar */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-indigo-500" /> Admin Ops Console
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm">Manage active subscriptions, moderate published slugs, and monitor AI Gemini telemetry.</p>
        </div>
        <span className="text-[10px] font-mono bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 px-3 py-1.5 rounded uppercase">
          Role: Platform Supervisor
        </span>
      </div>

      {/* Overview Analytics counters */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-xs font-mono">
        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Total Users</p>
          <p className="text-2xl font-black text-white mt-1">{data.totalUsers}</p>
          <p className="text-[10px] text-slate-500 mt-2 font-sans">{data.premiumUsers} premium plans</p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Registered Portfolios</p>
          <p className="text-2xl font-black text-white mt-1">{data.totalPortfolios}</p>
          <p className="text-[10px] text-slate-500 mt-2 font-sans">{data.activePublished} live published</p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">SaaS Conversion Rate</p>
          <p className="text-2xl font-black text-indigo-400 mt-1">
            {data.totalUsers > 0 ? Math.round((data.premiumUsers / data.totalUsers) * 100) : 0}%
          </p>
          <p className="text-[10px] text-slate-500 mt-2 font-sans">Upgrade ratios</p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Aggregate Client Views</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{data.aggregateViews}</p>
          <p className="text-[10px] text-slate-500 mt-2 font-sans">Simulated tracked clicks</p>
        </div>

        <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl">
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-mono flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> AI Runs Metrics
          </span>
          <p className="text-2xl font-black text-white mt-1">{totalAIUsage}</p>
          <p className="text-[10px] text-slate-500 mt-2 font-sans">Gemini model hits</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* User Account List and pricing tier triggers */}
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-3">
            <Users className="w-4 h-4 text-indigo-400" /> Platform Accounts Registry ({data.usersList.length})
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[350px]">
            {data.usersList.map((usr) => (
              <div key={usr.id} className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg flex items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <p className="font-extrabold text-white">{usr.name} <span className="text-[9px] text-slate-500 font-mono">({usr.role})</span></p>
                  <p className="text-slate-400 text-[10px]">{usr.email}</p>
                  <p className="text-[10px] text-indigo-400 font-mono">AI usage count: {usr.aiUsageCount || 0} hits</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold border ${
                    usr.plan === "lifetime" ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" :
                    usr.plan === "premium" ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" :
                    usr.plan === "student_pro" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" :
                    "bg-slate-800 text-slate-400 border-transparent"
                  }`}>
                    {usr.plan?.replace('_', ' ')}
                  </span>
                  
                  <button 
                    onClick={() => handleToggleUserPlan(usr.id, usr.plan)}
                    className="p-1 px-2 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded text-[10px] font-bold duration-150"
                  >
                    Adjust Plan
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Content Moderation toggle switch */}
        <section className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-3">
            <Layers className="w-4 h-4 text-pink-500" /> Active published Slugs Moderation console
          </h3>

          <div className="space-y-3 overflow-y-auto max-h-[350px]">
            {data.portfoliosList.map((p) => (
              <div key={p.id} className="p-3 bg-slate-950/60 border border-slate-850 rounded-lg flex items-center justify-between gap-4 text-xs">
                <div>
                  <h4 className="font-bold text-white uppercase tracking-tight">{p.title}</h4>
                  <p className="text-slate-400 text-[10px]">Slug: /{p.slug} • Style: {p.templateId}</p>
                  <p className="text-[10px] text-slate-500">Owner: {p.userName}</p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold font-mono ${p.isPublished ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-500 border border-red-500/20"}`}>
                    {p.isPublished ? "Online" : "Suspended"}
                  </span>

                  <button 
                    onClick={() => handleToggleModeration(p.id, p.isPublished)}
                    className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 duration-150"
                    title={p.isPublished ? "Suspend publish status" : "Activate publish status"}
                  >
                    {p.isPublished ? (
                      <span className="text-[10px] text-red-400 font-bold px-2 py-0.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 duration-150 rounded">Block</span>
                    ) : (
                      <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/5 hover:bg-emerald-500/10 duration-150 rounded">Allow</span>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
