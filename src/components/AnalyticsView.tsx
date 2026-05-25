import React, { useEffect, useState } from "react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  BarChart, 
  Bar, 
  Cell,
  PieChart, 
  Pie
} from "recharts";
import { 
  TrendingUp, 
  Users, 
  Download, 
  Smartphone, 
  Monitor, 
  Globe, 
  Layers, 
  Loader2, 
  Award,
  ChevronRight
} from "lucide-react";
import { ViewAnalytics } from "../types";

interface Props {
  portfolioId: string;
}

export default function AnalyticsView({ portfolioId }: Props) {
  const [data, setData] = useState<ViewAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      setLoading(true);
      try {
        const res = await fetch(`/api/analytics/${portfolioId}`);
        const parsed = await res.json();
        setData(parsed);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, [portfolioId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400 space-y-2">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-xs font-mono lowercase tracking-wider">Syncing recruiter telemetry maps...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500 bg-slate-900 border border-slate-800 rounded-xl">
        <p className="text-xs">No active telemetry exists yet. Share your published page to map recruiter actions.</p>
      </div>
    );
  }

  // Prep device data
  const deviceData = [
    { name: "Desktop", value: data.devices.desktop || 10, color: "#6366f1" },
    { name: "Mobile", value: data.devices.mobile || 10, color: "#ec4899" },
    { name: "Tablet", value: data.devices.tablet || 2, color: "#f59e0b" }
  ];

  // Prep location progress list max view
  const maxLocationCount = Math.max(...data.locations.map(l => l.count), 1);

  return (
    <div className="space-y-6">
      {/* Top statistics summary boxes */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Total Views</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">{data.views}</span>
            <span className="text-[10px] text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">+12%</span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">Global candidate audits</p>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Unique Visitors</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">{data.uniqueVisitors}</span>
            <span className="text-[10px] text-indigo-400 bg-indigo-500/10 px-1.5 rounded">+5%</span>
          </div>
          <p className="text-[10px] text-slate-400">Calculated distinct IP logs</p>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl space-y-1">
          <div className="flex justify-between items-center">
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Recruiter Audits</p>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">{data.recruiterViews}</span>
            <span className="text-[10px] bg-red-500/10 text-red-400 px-1.5 rounded">+18%</span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">Target verified employers</p>
        </div>

        <div className="bg-slate-900 border border-slate-800/80 p-4 rounded-xl space-y-1">
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">Resume DLs</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">{data.resumeDownloads}</span>
            <span className="text-[10px] text-yellow-500 bg-yellow-500/10 px-1.5 rounded">+9%</span>
          </div>
          <p className="text-[10px] text-slate-400 font-sans">Print exports triggers</p>
        </div>
      </div>

      {/* Main Graph views grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Weekly Views Line Graph (2/3 col) */}
        <div className="md:col-span-2 bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-400" /> Weekly Visitor telemetry
            </h4>
            <span className="text-[10px] font-mono text-slate-500">REALTIME DATA UPDATES</span>
          </div>
          
          <div className="w-full h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.weeklyViews} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" stroke="#475569" strokeWidth={1} fontSize={10} style={{ fontFamily: "monospace" }} />
                <YAxis stroke="#475569" strokeWidth={1} fontSize={10} style={{ fontFamily: "monospace" }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}
                  labelStyle={{ color: "#64748b", fontFamily: "monospace", fontSize: "10px" }}
                  itemStyle={{ color: "#ffffff", fontWeight: "bold", fontSize: "12px" }}
                />
                <Area type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#viewsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Device Ratio Pie Diagram */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-850 pb-3">
            <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4 text-pink-400" /> Device Segments
            </h4>
            <span className="text-[10px] font-mono text-slate-500">Ratios %</span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 min-h-[220px]">
            <div className="w-full h-32 flex justify-center items-center">
              <ResponsiveContainer width={150} height={130}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={55}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-3 gap-2 w-full text-center text-[10px] font-mono text-slate-300">
              <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                <p className="text-indigo-400 font-bold">Desktop</p>
                <p className="text-slate-500 mt-0.5">{data.devices.desktop}</p>
              </div>
              <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                <p className="text-pink-400 font-bold">Mobile</p>
                <p className="text-slate-500 mt-0.5">{data.devices.mobile}</p>
              </div>
              <div className="p-1.5 bg-slate-950/60 rounded border border-slate-800">
                <p className="text-amber-500 font-bold">Tablet</p>
                <p className="text-slate-500 mt-0.5">{data.devices.tablet}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Geolocations and Project Click rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Geo lists progress bar */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-3">
            <Globe className="w-4 h-4 text-yellow-500" /> Audit Origin Geolocations
          </h4>
          
          <div className="space-y-4">
            {data.locations.map((loc, idx) => {
              const perc = Math.round((loc.count / maxLocationCount) * 100);
              return (
                <div key={idx} className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex justify-between items-center text-slate-300">
                    <span className="font-semibold flex items-center gap-2">
                      <span className="text-[10px] text-slate-500">#{idx+1}</span> {loc.country}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-bold">{loc.count} audits</span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-850">
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full" 
                      style={{ width: `${perc}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Project Click ranking list */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-4">
          <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider flex items-center gap-1.5 border-b border-slate-850 pb-3">
            <Layers className="w-4 h-4 text-emerald-400" /> High-End Project Clicks Performance
          </h4>

          <div className="space-y-3 font-mono">
            {Object.keys(data.projectClicks).length === 0 ? (
              <div className="text-center py-6 text-slate-500 font-mono text-xs">
                No telemetry clicks on outbound source code urls.
              </div>
            ) : (
              Object.entries(data.projectClicks).map(([projId, clicks], idx) => {
                return (
                  <div key={projId} className="flex justify-between items-center p-3 bg-slate-950/60 rounded border border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 bg-indigo-500/10 text-indigo-400 font-black text-xs flex items-center justify-center border border-indigo-500/20 rounded">
                        {idx + 1}
                      </span>
                      <p className="text-slate-200 text-xs font-semibold uppercase">Project ID_{projId}</p>
                    </div>
                    <span className="text-xs text-white bg-indigo-600/20 px-3 py-1 border border-indigo-600/30 rounded font-bold">
                      {clicks} CLICKS
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
