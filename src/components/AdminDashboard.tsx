import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  Settings2,
  Shield,
  Building,
  Mail,
  MoreVertical,
  Activity,
  Database,
  Terminal,
  AlertTriangle
} from 'lucide-react';
import { Employee, Manager } from '../types';

interface AdminDashboardProps {
  loggedInManager: Manager;
  employees: Employee[];
}

export function AdminDashboard({ loggedInManager, employees }: AdminDashboardProps) {
  const stats = useMemo(() => {
    return [
      { label: "Total Users", value: employees.length, icon: Users },
      { label: "Active Roles", value: new Set(employees.map(e => e.role)).size, icon: Shield },
      { label: "Departments", value: new Set(employees.map(e => e.department)).size, icon: Building },
      { label: "Platform Status", value: "Active", icon: Activity }
    ];
  }, [employees]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col gap-1 mb-6">
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Platform Administration</h2>
        <p className="text-sm text-slate-500">Manage all users, roles, and global platform settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4, ease: "easeOut" }}
            key={idx}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex items-center gap-4"
          >
            <div className="p-3 bg-slate-900 rounded-xl text-white">
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              <div className="text-2xl font-black text-slate-900">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="font-bold text-slate-800">User Directory</h3>
              <button className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg shadow-sm hover:bg-slate-800 transition-colors">
                Add User
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {employees.slice(0, 5).map(emp => (
                <div key={emp.id} className="p-4 px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold">
                      {emp.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        {emp.name}
                        {emp.roleType === 'admin' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">Admin</span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5">
                        <Mail className="w-3 h-3" /> {emp.email}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <div className="text-sm font-semibold text-slate-700">{emp.role}</div>
                      <div className="text-xs text-slate-500">{emp.department}</div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {employees.length > 5 && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button className="text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors">
                  View All {employees.length} Users
                </button>
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-5 border-b border-slate-100 flex items-center gap-2 bg-slate-50/50">
              <Settings2 className="w-5 h-5 text-slate-500" />
              <h3 className="font-bold text-slate-800">Global Settings</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-800">Maintenance Mode</div>
                    <div className="text-xs text-slate-500">Disable access for non-admins</div>
                  </div>
                  <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm" />
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-800">Two-Factor Auth</div>
                    <div className="text-xs text-slate-500">Enforce for all accounts</div>
                  </div>
                  <div className="w-10 h-6 bg-slate-900 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm" />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-bold text-slate-800">Public Registration</div>
                    <div className="text-xs text-slate-500">Allow new users to sign up</div>
                  </div>
                  <div className="w-10 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                    <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <button className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-sm font-bold rounded-xl border border-slate-200 transition-colors">
                  Advanced Configuration
                </button>
              </div>
            </div>
          </motion.div>

          {loggedInManager.email === 'admin@nexus.com' && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl border border-red-200 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-red-100 flex items-center justify-between bg-red-50/50">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-red-800">Super Admin Zone</h3>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-700 uppercase tracking-widest">Restricted</span>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-white rounded-xl border border-red-100 flex items-start gap-4">
                  <div className="p-2 bg-red-50 rounded-lg text-red-600">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">Database Factory Reset</h4>
                    <p className="text-xs text-slate-500 mt-1">Wipe all application data and restore initial seed data. This action cannot be undone.</p>
                    <button 
                      onClick={async () => {
                        if (window.confirm("Are you sure you want to factory reset the database? This cannot be undone.")) {
                          try {
                            const res = await fetch("/api/db-reset", { method: "POST" });
                            if (res.ok) {
                              alert("Database reset successfully.");
                              window.location.reload();
                            } else {
                              alert("Failed to reset database.");
                            }
                          } catch (e) {
                            alert("Error resetting database.");
                          }
                        }
                      }}
                      className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm shadow-red-600/20"
                    >
                      Reset Database
                    </button>
                  </div>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4">
                  <div className="p-2 bg-slate-200 rounded-lg text-slate-700">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">System Audit Trail</h4>
                    <p className="text-xs text-slate-500 mt-1">View raw application logs, authentication events, and API request traces.</p>
                    <button className="mt-3 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors">
                      View Logs
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
