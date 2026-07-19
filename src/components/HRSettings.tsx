import React, { useState } from 'react';
import { Shield, FileSignature, CheckCircle2, Lock } from 'lucide-react';

export function HRSettings() {
  const [require2FA, setRequire2FA] = useState(true);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 border border-slate-200/60 rounded-3xl p-6 relative overflow-hidden shadow-3xs">
        <div className="absolute right-0 top-0 w-64 h-64 bg-rose-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <span className="text-[11px] font-bold text-rose-600 uppercase tracking-widest font-mono bg-rose-50 border border-rose-100/60 px-2.5 py-1 rounded-full">
            Global Control
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight font-display pt-1">
            HR Manager Settings
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Manage company-wide HR policies, compliance requirements, and core organizational settings. These settings apply globally across all departments and teams.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center text-violet-600">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Compliance & Security</h3>
              <p className="text-xs text-slate-500">Global security enforcement</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4 text-slate-400" />
                <div>
                  <div className="text-xs font-bold text-slate-900">Enforce 2FA</div>
                  <div className="text-[10px] text-slate-500">Require multi-factor auth for all employees</div>
                </div>
              </div>
              <button 
                onClick={() => setRequire2FA(!require2FA)}
                className={`w-10 h-6 rounded-full transition-colors relative ${require2FA ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${require2FA ? 'left-5' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <FileSignature className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Company Policies</h3>
              <p className="text-xs text-slate-500">Review and update global terms</p>
            </div>
          </div>
          
          <div className="space-y-3 pt-2">
            {[
              "Code of Conduct",
              "Remote Work Guidelines",
              "Data Privacy Policy"
            ].map((doc, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors cursor-pointer group">
                <span className="text-xs font-medium text-slate-700">{doc}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
