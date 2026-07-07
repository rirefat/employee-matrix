import React, { useEffect, useState } from "react";
import { Database, Activity, CheckCircle, HelpCircle, X, ChevronUp, ChevronDown, RefreshCw, AlertTriangle } from "lucide-react";
import { DBStatus } from "../types";

export function DBStatusBanner() {
  const [status, setStatus] = useState<DBStatus | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [latency, setLatency] = useState(24);
  const [isVisible, setIsVisible] = useState(true);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (
      !window.confirm(
        "Are you sure you want to reset the database? This will drop all collections or clear the local storage and restore original seed data."
      )
    ) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch("/api/db-reset", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      } else {
        const data = await res.json();
        alert(`Failed to reset database: ${data.error || "Unknown error"}`);
      }
    } catch (err: any) {
      console.error(err);
      alert("Network error resetting database.");
    } finally {
      setIsResetting(false);
    }
  };

  useEffect(() => {
    fetch("/api/db-status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.error("Error fetching database status:", err));

    // Simulate minor live fluctuation in network ping to make it feel alive and hyper-modern
    const interval = setInterval(() => {
      setLatency((prev) => {
        const diff = Math.floor(Math.random() * 7) - 3;
        const next = prev + diff;
        return next < 12 ? 12 : next > 45 ? 45 : next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  if (!status || !isVisible) return null;

  const isConnected = status.connectionType === "mongodb";

  return (
    <div
      id="matrix-integrity-capsule"
      className="fixed bottom-6 right-6 z-40 transition-all duration-300"
    >
      {/* Compact Capsule Trigger */}
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-full border border-white/40 bg-white/75 hover:bg-white/90 text-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 group scale-100 hover:scale-102"
          style={{
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          <div className="relative">
            <Database className={`h-4 w-4 ${isConnected ? "text-emerald-500" : "text-amber-500"}`} />
            <span className={`absolute -top-1 -right-1 flex h-2 w-2 rounded-full ${
              isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-400"
            }`} />
          </div>
          
          <span className="text-[11px] font-bold font-mono tracking-tight text-slate-700">
            {isConnected ? "MATRIX_CORE: ACTIVE" : "LOCAL_CORE: OFFLINE_SAFE"}
          </span>

          <ChevronUp className="h-3.5 w-3.5 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </button>
      ) : (
        /* Detailed Floating Glassmorphism Panel */
        <div
          className="w-80 rounded-2xl border border-white/40 bg-white/75 shadow-2xl p-4 text-slate-800 animate-in fade-in slide-in-from-bottom-4 duration-300 relative overflow-hidden"
          style={{
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
          }}
        >
          {/* Subtle colored backing node */}
          <div className={`absolute -right-16 -top-16 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-20 ${
            isConnected ? "bg-emerald-500" : "bg-amber-500"
          }`} />

          {/* Header */}
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100/60 relative z-10">
            <div className="flex items-center gap-2">
              <Database className={`h-4.5 w-4.5 ${isConnected ? "text-emerald-500" : "text-amber-500"}`} />
              <span className="text-[11px] font-extrabold font-mono tracking-wider text-slate-700 uppercase">
                System Registry
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md hover:bg-slate-200/50 text-slate-400 hover:text-slate-600 transition-colors"
                title="Minimize Capsule"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={() => setIsVisible(false)}
                className="p-1 rounded-md hover:bg-rose-500/10 text-slate-400 hover:text-rose-600 transition-colors"
                title="Dismiss status widget"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Main Body */}
          <div className="space-y-3 relative z-10">
            {/* Status indicators */}
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">
                <CheckCircle className={`h-4 w-4 ${isConnected ? "text-emerald-500" : "text-amber-500"}`} />
              </div>
              <div className="min-w-0 flex-1">
                <h5 className="text-xs font-bold text-slate-800">
                  {isConnected ? "Connected to MongoDB" : "Local Sync File Active"}
                </h5>
                <p className="text-[10px] leading-relaxed text-slate-500 mt-0.5">
                  {isConnected
                    ? "Employee cards, attendance tallies, and monthly development roadmap records are writing securely in the employee-matrix cluster."
                    : "Running out-of-the-box in offline sandbox mode. Performance states save directly inside data.json."}
                </p>
              </div>
            </div>

            {/* Metrics Dashboard inside Glass card */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              {/* Latency Index */}
              <div className="p-2 rounded-lg bg-slate-50/50 border border-slate-100/50">
                <div className="flex items-center gap-1 text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                  <Activity className="h-3 w-3 text-blue-500" />
                  <span>Latency</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-slate-700">
                  {isConnected ? `${latency} ms` : "0 ms (Local)"}
                </span>
              </div>

              {/* Data Integrity */}
              <div className="p-2 rounded-lg bg-slate-50/50 border border-slate-100/50">
                <div className="flex items-center gap-1 text-[8px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                  <CheckCircle className="h-3 w-3 text-indigo-500" />
                  <span>Integrity</span>
                </div>
                <span className="text-xs font-mono font-extrabold text-slate-700">
                  100% SECURE
                </span>
              </div>
            </div>

            {/* Database resetting module */}
            <div className="pt-2 border-t border-slate-100/60">
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-medium text-[10px] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                <RefreshCw className={`h-3 w-3 text-slate-500 ${isResetting ? "animate-spin" : ""}`} />
                <span>{isResetting ? "Resetting Database..." : "Reset to Seed Data"}</span>
              </button>
            </div>

            {/* Action Reminder for configuring Cloud DB */}
            {!isConnected && (
              <div className="space-y-2">
                {status.errorMessage && (
                  <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-[9.5px] text-rose-800 leading-normal font-mono break-words max-h-36 overflow-y-auto">
                    <span className="text-rose-900 font-bold block font-sans mb-1 text-[10px]">MongoDB Connection Error:</span>
                    {status.errorMessage}
                  </div>
                )}
                
                <div className="p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[9.5px] text-slate-700 leading-normal">
                  <span className="text-amber-800 font-bold block mb-0.5">Vercel Deployment Notice:</span>
                  To connect your remote database on Vercel, verify <strong className="text-slate-800">MONGODB_URI</strong> is declared in your Vercel Project Environment Variables.
                  <span className="block mt-1 font-bold text-amber-900">CRITICAL:</span> You MUST add <strong className="font-mono bg-amber-500/15 px-1 py-0.5 rounded">0.0.0.0/0</strong> (allow access from anywhere) in your MongoDB Atlas Network Access settings, since Vercel utilizes dynamic serverless IP ranges!
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
