import React, { useState } from "react";
import { motion } from "motion/react";
import { Users, UserPlus, Search, Filter, MoreVertical, Briefcase, Mail, Phone, Calendar, Clock, CheckCircle2, XCircle } from "lucide-react";
import { get3DAvatarUrl } from "../utils";

const MOCK_CANDIDATES = [
  { id: "1", name: "Alex Chen", role: "Senior Frontend Engineer", stage: "interview", appliedDate: "2 days ago", email: "alex.chen@example.com" },
  { id: "2", name: "Sarah Miller", role: "Product Designer", stage: "offer", appliedDate: "1 week ago", email: "sarah.m@example.com" },
  { id: "3", name: "James Wilson", role: "Backend Developer", stage: "screen", appliedDate: "3 days ago", email: "james.w@example.com" },
  { id: "4", name: "Emily Davis", role: "Marketing Manager", stage: "applied", appliedDate: "Today", email: "emily.d@example.com" },
  { id: "5", name: "Michael Chang", role: "UX Researcher", stage: "interview", appliedDate: "5 days ago", email: "mike.c@example.com" },
];

const STAGES = [
  { id: "applied", label: "Applied", color: "bg-slate-100 text-slate-700 border-slate-200" },
  { id: "screen", label: "Phone Screen", color: "bg-blue-50 text-blue-700 border-blue-200" },
  { id: "interview", label: "Interview", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { id: "offer", label: "Offer Extended", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
];

export function RecruitmentPipeline() {
  const [activeTab, setActiveTab] = useState("pipeline");

  return (
    <main className="flex-1 w-full px-6 lg:px-10 py-6 overflow-y-auto bg-slate-50/50">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Recruitment & ATS</h2>
            <p className="text-sm text-slate-500 mt-1">Manage active candidates and job postings.</p>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md shadow-slate-900/20 hover:bg-slate-800 transition-colors flex items-center gap-2">
            <UserPlus className="w-4 h-4" />
            New Job Posting
          </button>
        </div>

        {/* Kanban Board for Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          {STAGES.map(stage => {
            const candidates = MOCK_CANDIDATES.filter(c => c.stage === stage.id);
            return (
              <div key={stage.id} className="bg-slate-100/50 rounded-2xl p-4 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-700">{stage.label}</h3>
                  <span className="text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded-full border border-slate-200">{candidates.length}</span>
                </div>
                
                <div className="space-y-3">
                  {candidates.map(candidate => (
                    <motion.div 
                      key={candidate.id}
                      layoutId={`candidate-${candidate.id}`}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs cursor-pointer hover:border-slate-300 transition-all group relative"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex gap-3">
                          <img src={get3DAvatarUrl(candidate.id)} alt={candidate.name} className="w-8 h-8 rounded-full bg-slate-100" />
                          <div>
                            <div className="text-sm font-bold text-slate-900">{candidate.name}</div>
                            <div className="text-[10px] text-slate-500 font-medium truncate w-32">{candidate.role}</div>
                          </div>
                        </div>
                        <button className="text-slate-400 hover:text-slate-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {candidate.appliedDate}
                        </div>
                      </div>
                      
                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm rounded-xl border border-slate-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-colors">
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors">
                          <XCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
