import React, { useState } from "react";
import { motion } from "motion/react";
import { Calendar as CalendarIcon, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { get3DAvatarUrl } from "../utils";

const MOCK_REQUESTS = [
  { id: "1", employee: "David Lee", role: "Software Engineer", type: "Annual Leave", startDate: "Oct 12", endDate: "Oct 15", days: 4, status: "pending", reason: "Family vacation" },
  { id: "2", employee: "Jessica Wang", role: "Product Manager", type: "Sick Leave", startDate: "Sep 28", endDate: "Sep 29", days: 2, status: "pending", reason: "Medical appointment" },
  { id: "3", employee: "Marcus Johnson", role: "UX Designer", type: "Annual Leave", startDate: "Nov 01", endDate: "Nov 05", days: 5, status: "approved", reason: "Trip to Japan" },
];

export function LeaveApprovals() {
  return (
    <main className="flex-1 w-full px-6 lg:px-10 py-6 overflow-y-auto bg-slate-50/50">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Leave Approvals</h2>
            <p className="text-sm text-slate-500 mt-1">Review and manage team time-off requests.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">Pending Requests</div>
            <div className="text-3xl font-black text-slate-900">2</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">Approved This Month</div>
            <div className="text-3xl font-black text-slate-900">14</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-sm font-medium text-slate-500 mb-1">Employees on Leave Today</div>
            <div className="text-3xl font-black text-slate-900">3</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Recent Requests</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_REQUESTS.map((req) => (
              <div key={req.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start gap-4">
                  <img src={get3DAvatarUrl(req.id)} alt={req.employee} className="w-10 h-10 rounded-full bg-slate-100" />
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{req.employee}</div>
                    <div className="text-xs text-slate-500">{req.role}</div>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                        <CalendarIcon className="w-3 h-3" />
                        {req.type}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {req.startDate} - {req.endDate} ({req.days} days)
                      </span>
                    </div>
                    {req.reason && (
                      <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                        "{req.reason}"
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'pending' ? (
                    <>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-100">
                        <XCircle className="w-3.5 h-3.5" />
                        Decline
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 shadow-md shadow-slate-900/20 rounded-lg transition-colors">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Approve
                      </button>
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-lg border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
