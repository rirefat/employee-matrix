import React, { useState } from 'react';
import { Target, Activity, Settings2, Users } from 'lucide-react';

export function OpsSettings() {
  const [sprintDuration, setSprintDuration] = useState('14');
  const [allocationCap, setAllocationCap] = useState('120');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 border border-slate-200/60 rounded-3xl p-6 relative overflow-hidden shadow-3xs">
        <div className="absolute right-0 top-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-1">
          <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-widest font-mono bg-indigo-50 border border-indigo-100/60 px-2.5 py-1 rounded-full">
            Operations Portal
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight font-display pt-1">
            Operations Manager Settings
          </h2>
          <p className="text-xs text-slate-500 max-w-xl leading-relaxed">
            Configure team-level operational parameters, sprint cycles, and resource allocation caps for your direct reports.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Sprint & Delivery</h3>
              <p className="text-xs text-slate-500">Configure delivery cycles</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Standard Sprint Duration (Days)</label>
              <select 
                value={sprintDuration}
                onChange={(e) => setSprintDuration(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 block px-4 py-3 outline-none"
              >
                <option value="7">1 Week (7 Days)</option>
                <option value="14">2 Weeks (14 Days)</option>
                <option value="21">3 Weeks (21 Days)</option>
                <option value="30">Monthly (30 Days)</option>
              </select>
            </div>
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <div className="text-[10px] text-blue-600 font-bold uppercase tracking-wider mb-1">Impact</div>
              <div className="text-xs text-slate-600">This setting will automatically align KPIs and project reporting intervals to {sprintDuration}-day cycles for your assigned teams.</div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Resource Limits</h3>
              <p className="text-xs text-slate-500">Manage workload capacities</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Max Monthly Hours Per Member</label>
              <div className="relative">
                <input 
                  type="number"
                  value={allocationCap}
                  onChange={(e) => setAllocationCap(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 text-sm rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 block px-4 py-3 outline-none"
                />
                <div className="absolute right-4 top-3 text-xs font-bold text-slate-400">HRS</div>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
              <Users className="w-4 h-4 text-slate-400" />
              <div className="text-[11px] text-slate-600">
                Warning triggers when a team member exceeds <strong className="text-emerald-600">{allocationCap}h</strong> in active assignments.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
