import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, ArrowRight, ShieldCheck, Zap, AlertCircle } from 'lucide-react';
import { get3DAvatarUrl } from '../utils';
import { Manager } from '../types';

export const dummyManagers: Manager[] = [
  {
    id: 'a1',
    name: 'Super Admin',
    email: 'admin@nexus.com',
    role: 'Super Admin',
    roleType: 'admin',
    teams: ['All Teams'],
    employeeId: 'NEX-9999',
    department: 'Administration',
    joinDate: '2019-01-01',
    reportingTo: 'Board of Directors',
    employeeType: 'Full-Time',
    skills: ['System Administration', 'Access Control'],
    jobConfirmed: 'Confirmed on 2019-01-01',
    phone: '+1 (555) 000-0000',
    location: 'Remote',
    bio: 'System Administrator with full access to Nexus Portal.',
    workHours: '24/7',
    workStyle: 'Remote',
    costCenter: 'CC-000-ADM',
    allocatedEquipment: 'Custom Server Rig',
    education: 'Ph.D. in Computer Science',
    certifications: 'CISSP, AWS Certified Solutions Architect Professional',
    linkedinLink: 'https://linkedin.com/in/nexusadmin',
    githubLink: 'https://github.com/nexusadmin',
    preferredLanguage: 'English (US)',
    timezone: 'UTC'
  },
  { 
    id: 'm1', 
    name: 'Rafiul Refat', 
    email: 'rafiul@nexus.com', 
    role: 'Custom Dev', 
    teams: ['Custom', 'Node'],
    employeeId: 'NEX-2024-081',
    department: 'Engineering',
    joinDate: '2024-03-15',
    reportingTo: 'Sarah Jenkins (VP of Engineering)',
    emergencyContactName: 'John Smith',
    emergencyContactPhone: '+1 (555) 012-3456',
    employeeType: 'Full-Time',
    skills: ['React', 'TypeScript', 'Node.js', 'System Architecture', 'Agile'],
    jobConfirmed: 'Confirmed on 2024-03-20',
    phone: '+1 (555) 019-2834',
    location: 'San Francisco, CA',
    bio: 'Dedicated Manager at Nexus, currently directing operations, tracking key performance indices, and organizing teammate resources to maximize velocity and workspace synergy.',
    workHours: '9:00 AM - 5:00 PM PST',
    workStyle: 'Remote',
    costCenter: 'CC-402-ENG',
    allocatedEquipment: 'MacBook Pro 16", LG 34" UltraWide Monitor',
    education: 'M.S. in Computer Science - Stanford University',
    certifications: 'AWS Certified Solutions Architect, Scrum Alliance CSP-SM',
    linkedinLink: 'https://linkedin.com/in/rafiul-refat-nexus',
    githubLink: 'https://github.com/rafiul-refat-nexus',
    preferredLanguage: 'English (US)',
    timezone: 'America/Los_Angeles'
  },
  { 
    id: 'm3', 
    name: 'Charlie Davis', 
    email: 'charlie@nexus.com', 
    role: 'WordPress Manager', 
    teams: ['WordPress'],
    employeeId: 'NEX-2022-409',
    department: 'Marketing Platforms',
    joinDate: '2022-11-10',
    reportingTo: 'Marcus Aurelius (Director of Marketing)',
    emergencyContactName: 'David Davis',
    emergencyContactPhone: '+1 (555) 015-1122',
    employeeType: 'Full-Time',
    skills: ['PHP', 'WordPress REST API', 'SEO', 'Security Hardening'],
    jobConfirmed: 'Pending Verification',
    phone: '+1 (555) 018-9382',
    location: 'Chicago, IL',
    bio: 'Managing corporate CMS setups, enterprise plugins, and performance optimization for our global multi-site marketing portals.',
    workHours: '9:00 AM - 6:00 PM EST',
    workStyle: 'Onsite',
    costCenter: 'CC-102-MKT',
    allocatedEquipment: 'Lenovo ThinkPad X1 Carbon, Dell 27" 4K Monitor',
    education: 'B.A. in Web Design & Interactive Media - Columbia College Chicago',
    certifications: 'Google Analytics Individual Qualification, W3Schools PHP Certification',
    linkedinLink: 'https://linkedin.com/in/charlie-davis-web',
    githubLink: 'https://github.com/charlie-davis-wp',
    preferredLanguage: 'English (US)',
    timezone: 'America/New_York'
  },
  {
    id: 'hr1',
    name: 'Grace Hopper',
    email: 'hr@nexus.com',
    role: 'HR Manager',
    teams: ['Custom', 'Node', 'Shopify', 'WordPress', 'UI/UX', 'Design'],
    employeeId: 'NEX-2020-001',
    department: 'Human Resources',
    joinDate: '2020-01-15',
    reportingTo: 'CEO',
    emergencyContactName: 'John Hopper',
    emergencyContactPhone: '+1 (555) 012-9999',
    employeeType: 'Full-Time',
    skills: ['HR Management', 'Conflict Resolution', 'Onboarding'],
    jobConfirmed: 'Confirmed on 2020-01-15',
    phone: '+1 (555) 019-5555',
    location: 'New York, NY',
    bio: 'Head of Human Resources, ensuring a great workplace environment.',
    workHours: '9:00 AM - 5:00 PM EST',
    workStyle: 'Remote',
    costCenter: 'CC-100-HR',
    allocatedEquipment: 'MacBook Air 13"',
    education: 'M.S. in Human Resources - NYU',
    certifications: 'SHRM-CP',
    linkedinLink: 'https://linkedin.com/in/grace-hopper-hr',
    githubLink: '',
    preferredLanguage: 'English (US)',
    timezone: 'America/New_York'
  },
  {
    id: 'u1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'Full Stack Developer',
    roleType: 'user',
    teams: ['Custom'],
    employeeId: 'NEX-2024-100',
    department: 'Engineering',
    joinDate: '2024-05-10',
    reportingTo: 'Rafiul Refat',
    emergencyContactName: 'Jane Doe',
    emergencyContactPhone: '+1 (555) 019-9999',
    employeeType: 'Full-Time',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript'],
    jobConfirmed: 'Confirmed on 2024-05-15',
    phone: '+1 (555) 019-1111',
    location: 'Remote',
    bio: 'Full Stack Developer at Nexus.',
    workHours: '9:00 AM - 5:00 PM EST',
    workStyle: 'Remote',
    costCenter: 'CC-600-USR',
    allocatedEquipment: 'MacBook Pro 14"',
    education: 'B.S. in Computer Science',
    certifications: 'AWS Certified Developer',
    linkedinLink: 'https://linkedin.com/in/johndoe',
    githubLink: 'https://github.com/johndoe',
    preferredLanguage: 'English (US)',
    timezone: 'America/New_York'
  }
];

interface LoginPageProps {
  onLogin: (manager: Manager) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [managers, setManagers] = useState<Manager[]>(dummyManagers);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  React.useEffect(() => {
    fetch('/api/managers', { cache: 'no-store' })
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Failed to fetch from backend');
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setManagers(data);
        }
      })
      .catch(err => {
        console.warn('Could not fetch managers, using dummy managers fallback', err);
      });
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const manager = managers.find(m => m.email.toLowerCase() === email.trim().toLowerCase() && password === 'admin123');
    if (manager) {
      onLogin(manager);
    } else {
      setError('Invalid credentials. Use one of the accounts below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-400/10 blur-[100px]" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-indigo-400/10 blur-[120px]" />
        <div className="absolute -bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-emerald-400/10 blur-[100px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 bg-white/70 backdrop-blur-xl border border-white/50 rounded-3xl shadow-xl overflow-hidden z-10"
      >
        <div className="p-10 md:p-14 flex flex-col justify-center border-r border-slate-100">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <ShieldCheck className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Nexus Portal</h1>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight leading-tight mb-2">Welcome Back.</h2>
            <p className="text-xs text-slate-500">Sign in to manage your dedicated teams and track performance metrics.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Work Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@nexus.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-500 shadow-sm"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all placeholder:text-slate-500 shadow-sm"
                  required
                />
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="text-xs text-rose-500 font-semibold flex items-center gap-1.5 bg-rose-50 p-2.5 rounded-lg border border-rose-100">
                <AlertCircle className="h-3.5 w-3.5" />
                {error}
              </motion.div>
            )}

            <button 
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              Secure Login <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        <div className="bg-slate-50/50 p-10 md:p-14 flex flex-col justify-center">
          <div className="mb-8">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-widest mb-1 flex items-center gap-2">
              <Zap className="h-4 w-4 text-emerald-500" /> Demo Accounts
            </h3>
            <p className="text-xs text-slate-500">Use these credentials to preview different role-based views. Password for all is <strong className="text-slate-700">admin123</strong>.</p>
          </div>

          <div className="space-y-3">
            {managers.map((manager, idx) => (
              <motion.div 
                key={manager.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  setEmail(manager.email);
                  setPassword('admin123');
                }}
                className="group p-3.5 bg-white border border-slate-200 rounded-xl cursor-pointer hover:border-blue-300 hover:shadow-md transition-all flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-white shadow-sm overflow-hidden shrink-0">
                  <img src={get3DAvatarUrl(manager.name)} alt={manager.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{manager.name}</h4>
                  <p className="text-xs text-slate-500">{manager.email}</p>
                </div>
                <div className={`px-2.5 py-1 text-[11px] font-bold rounded-md uppercase tracking-wide transition-colors ${manager.roleType === 'admin' ? 'bg-indigo-100 text-indigo-700 border border-indigo-200 group-hover:bg-indigo-200' : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                  {manager.roleType === 'admin' ? 'Admin' : manager.role}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
