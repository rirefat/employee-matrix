import React from "react";
import { motion } from "motion/react";
import { Settings, Shield, FileText, Bell, CreditCard, Users, Briefcase } from "lucide-react";

export function CompanyPolicies() {
  return (
    <main className="flex-1 w-full px-6 lg:px-10 py-6 overflow-y-auto bg-slate-50/50">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Company Settings</h2>
            <p className="text-sm text-slate-500 mt-1">Manage global HR policies, payroll, and compliance.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Leave Policies</h3>
            <p className="text-sm text-slate-500">Configure annual leave quotas, sick days, and public holidays.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Payroll & Benefits</h3>
            <p className="text-sm text-slate-500">Manage salary structures, bonuses, and health insurance plans.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Compliance & Data</h3>
            <p className="text-sm text-slate-500">Set data retention policies, access controls, and GDPR settings.</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors shadow-sm">
              <Bell className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">Notifications</h3>
            <p className="text-sm text-slate-500">Configure automated alerts for anniversaries, birthdays, and reviews.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
