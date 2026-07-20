import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Search, BookOpen, Shield, Users, Briefcase, Code, FileText, 
  ChevronRight, ChevronDown, HelpCircle, Activity, Settings, Target, Calendar
} from 'lucide-react';
import { Manager } from '../types';

interface DocumentationCenterProps {
  onClose: () => void;
  loggedInManager: Manager | null;
}

interface DocSection {
  id: string;
  title: string;
  icon: React.ElementType;
  content: React.ReactNode;
  subsections?: DocSection[];
}

export function DocumentationCenter({ onClose, loggedInManager }: DocumentationCenterProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSectionId, setActiveSectionId] = useState<string>('overview');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  // Determine user's generic role category for docs
  const roleCategory = useMemo(() => {
    if (!loggedInManager) return 'General User';
    if (loggedInManager.role === 'Super Admin' || loggedInManager.roleType === 'admin') return 'Super Admin';
    if (loggedInManager.roleType === 'manager') return 'Manager';
    if (loggedInManager.role === 'Leader') return 'Leader';
    if (loggedInManager.role === 'Co-Leader') return 'Co-Leader';
    if (loggedInManager.role?.includes('Developer')) return 'Web Developer';
    return 'General User';
  }, [loggedInManager]);

  const toggleSection = (id: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const docsContent: Record<string, DocSection[]> = {
    'Super Admin': [
      {
        id: 'overview',
        title: 'Role Overview & Responsibilities',
        icon: Shield,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              As a <strong>Super Admin</strong>, you hold the highest level of authority within the Nexus Matrix Portal. 
              Your primary responsibility is to ensure the integrity, security, and proper configuration of the platform.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Manage all user roles, permissions, and organizational hierarchy.</li>
              <li>Provision new accounts and manage access revocation.</li>
              <li>Configure system-wide settings, team structures, and strategic organizational targets.</li>
              <li>Monitor platform health and oversee all managerial actions.</li>
            </ul>
          </div>
        )
      },
      {
        id: 'admin-dashboard',
        title: 'Admin Dashboard Guide',
        icon: Settings,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              The <strong>Super Admin Control</strong> portal is your command center. 
              It provides a high-level overview of total active users, system health, and active roles.
            </p>
            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-3">
              <h4 className="font-bold text-slate-800">Key Actions:</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Provision New User:</strong> Click the dark button at the top right to open the user creation wizard.</li>
                <li><strong>Manage Team Targets:</strong> Set department-level KPIs and revenue targets for Operations Managers.</li>
                <li><strong>Role Adjustments:</strong> Click the edit icon next to any user to change their role, team, or status.</li>
                <li><strong>Account Deactivation:</strong> Use the ban/delete toggles to immediately revoke access for offboarded employees.</li>
              </ul>
            </div>
          </div>
        )
      },
      {
        id: 'team-targets',
        title: 'Setting Team Targets',
        icon: Target,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Strategic planning starts here. The <strong>Manage Team Targets</strong> modal allows you to assign specific, measurable objectives to teams. 
              These targets will automatically become visible to the designated Operations Manager.
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Navigate to the Admin Control portal.</li>
              <li>Click <strong>Manage Team Targets</strong>.</li>
              <li>Select the target team. The system will automatically map the appropriate Operations Manager.</li>
              <li>Define the Target Title, Objective, and Measurement Type (e.g., Revenue, Delivery count).</li>
              <li>Set the Target Value, Period, and Deadline.</li>
              <li>Assign a Priority and Status (Draft vs Active).</li>
            </ol>
          </div>
        )
      }
    ],
    'Manager': [
      {
        id: 'overview',
        title: 'Role Overview & Responsibilities',
        icon: Briefcase,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              As a <strong>Manager</strong>, you are responsible for overseeing team performance, managing employee workloads, 
              and ensuring strategic targets are met. You act as the bridge between executive leadership and your team.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Review and approve leave requests for your team.</li>
              <li>Conduct monthly performance reviews and generate AI-assisted reports.</li>
              <li>Track progress against team targets set by Super Admins.</li>
              <li>Maintain employee dossiers and log performance notes.</li>
            </ul>
          </div>
        )
      },
      {
        id: 'performance',
        title: 'Performance Reviews',
        icon: Activity,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              The Performance Portal allows you to track key metrics such as bugs resolved, projects delivered, and overall quality.
            </p>
            <h4 className="font-bold text-slate-800 mt-4 mb-2">Generating Reports:</h4>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Navigate to the Performance portal.</li>
              <li>Select an employee from your team.</li>
              <li>Click <strong>Generate Report</strong> to utilize the AI Co-Pilot, which will analyze the employee's recent metrics, leave history, and manager notes to draft a comprehensive monthly review.</li>
              <li>Review, edit, and publish the report.</li>
            </ol>
          </div>
        )
      },
      {
        id: 'leaves',
        title: 'Managing Leaves',
        icon: Calendar,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Approve or deny time-off requests efficiently.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Go to the <strong>Leave Requests</strong> portal.</li>
              <li>Review the pending requests queue. You will see the requested dates, reason, and the employee's remaining leave balance.</li>
              <li>Click the green check to approve, or the red X to deny.</li>
            </ul>
          </div>
        )
      }
    ],
    'Leader': [
      {
        id: 'overview',
        title: 'Role Overview & Responsibilities',
        icon: Users,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              As a <strong>Leader</strong>, you guide your squad's daily operations, ensuring code quality, task delivery, and sprint goals are achieved.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Monitor squad performance metrics and project delivery.</li>
              <li>Assist Managers with technical evaluations.</li>
              <li>Mentor Co-Leaders and Developers.</li>
              <li>Manage technical debt and architectural decisions.</li>
            </ul>
          </div>
        )
      },
      {
        id: 'dashboard',
        title: 'Leader Dashboard',
        icon: Activity,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Your dashboard focuses on operational metrics rather than administrative tasks.
              You have access to view your team's performance data and project statuses to help unblock your developers.
            </p>
            <p>Use the <strong>My Squad</strong> view to quickly check the status (active, on leave) of your direct team members.</p>
          </div>
        )
      }
    ],
    'Co-Leader': [
      {
        id: 'overview',
        title: 'Role Overview & Responsibilities',
        icon: Users,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              As a <strong>Co-Leader</strong>, you support the Team Leader in sprint execution, code reviews, and daily standups.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Assist in managing the sprint board and ticket assignment.</li>
              <li>Provide peer reviews and pair programming support to Web Developers.</li>
              <li>Step in for the Team Leader during their absence.</li>
            </ul>
          </div>
        )
      }
    ],
    'Web Developer': [
      {
        id: 'overview',
        title: 'Role Overview & Responsibilities',
        icon: Code,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              As a <strong>Web Developer</strong>, your focus is on writing high-quality code, resolving bugs, and delivering features.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Execute assigned sprint tasks and deliver projects on time.</li>
              <li>Submit code for review and address feedback.</li>
              <li>Log hours, manage your personal leave requests, and track your performance metrics.</li>
            </ul>
          </div>
        )
      },
      {
        id: 'personal-dashboard',
        title: 'Using Your Dashboard',
        icon: Activity,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Your portal provides a simplified view focused on your personal workflow.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>My Performance:</strong> Track your bugs resolved, projects delivered, and quality score.</li>
              <li><strong>Leave Management:</strong> Submit new time-off requests and view your remaining balance (Standard: 15 Sick Days, 15 Casual Days).</li>
              <li><strong>My Reports:</strong> View finalized monthly reviews published by your manager.</li>
            </ul>
          </div>
        )
      },
      {
        id: 'requesting-leave',
        title: 'Requesting Leave',
        icon: Calendar,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Navigate to the <strong>My Leaves</strong> portal from the sidebar.</li>
              <li>Click <strong>New Request</strong>.</li>
              <li>Select the Leave Type (Sick or Casual).</li>
              <li>Select the Start and End dates.</li>
              <li>Provide a brief reason to help your manager process the request faster.</li>
              <li>Submit. You can track the status (Pending, Approved, Denied) directly from this page.</li>
            </ol>
          </div>
        )
      }
    ],
    'General User': [
      {
        id: 'overview',
        title: 'Welcome to Matrix Portal',
        icon: BookOpen,
        content: (
          <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
            <p>
              Welcome! This portal is your central hub for managing your employment profile, tracking your performance, and requesting time off.
            </p>
            <p>
              Use the sidebar on the left to navigate between different modules. If you need assistance beyond this guide, contact your immediate manager or the HR department.
            </p>
          </div>
        )
      }
    ]
  };

  const currentDocs = docsContent[roleCategory] || docsContent['General User'];

  const filteredDocs = useMemo(() => {
    if (!searchTerm.trim()) return currentDocs;
    const lower = searchTerm.toLowerCase();
    return currentDocs.filter(doc => 
      doc.title.toLowerCase().includes(lower) || 
      (typeof doc.content === 'string' ? doc.content.toLowerCase().includes(lower) : true)
    );
  }, [currentDocs, searchTerm]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/20 backdrop-blur-sm">
        <motion.div 
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-5xl h-full bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden"
        >
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 shrink-0">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <BookOpen className="w-5 h-5" />
              <span>Documentation</span>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-500 border border-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="w-full md:w-72 bg-slate-50 border-r border-slate-100 flex flex-col shrink-0 h-48 md:h-full">
            <div className="p-6 hidden md:block">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xl tracking-tight font-display mb-1">
                <BookOpen className="w-6 h-6" />
                <span>Docs Center</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Knowledge Base & Guides</p>
            </div>

            <div className="p-4 md:px-6 md:pb-4 shrink-0 border-b border-slate-100">
              <div className="relative mb-4">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text" 
                  placeholder="Search guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5 hidden md:block">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Quick Links
                </div>
                <button 
                  onClick={() => {
                    const el = document.getElementById('faq-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full text-left px-2 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition-colors flex items-center gap-2"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
                  FAQ & Troubleshooting
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                {roleCategory} Guides
              </div>
              {filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => {
                    setActiveSectionId(doc.id);
                    setExpandedSections(new Set([doc.id]));
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                    activeSectionId === doc.id 
                      ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <doc.icon className={`w-4 h-4 ${activeSectionId === doc.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className="truncate">{doc.title}</span>
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-slate-200/60 hidden md:block">
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 text-slate-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Role</p>
                  <p className="text-sm font-bold text-slate-800 truncate">{loggedInManager?.role || 'User'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
            <div className="absolute top-6 right-6 hidden md:block z-10">
              <button 
                onClick={onClose}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-full transition-colors"
                title="Close Documentation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-12">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6">
                  <span>Documentation</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{roleCategory}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {filteredDocs.find(d => d.id === activeSectionId)?.title || 'Guide'}
                  </span>
                </div>

                {filteredDocs.length === 0 ? (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <Search className="w-6 h-6 text-slate-300" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 mb-1">No results found</h3>
                    <p className="text-sm text-slate-500">Try adjusting your search terms.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredDocs.map((doc) => (
                      <div 
                        key={doc.id}
                        id={doc.id}
                        className={`transition-all duration-300 ${activeSectionId === doc.id ? 'opacity-100' : 'opacity-40 hidden md:block'}`}
                      >
                        <button 
                          onClick={() => toggleSection(doc.id)}
                          className="w-full flex items-center justify-between py-4 border-b border-slate-100 group"
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${activeSectionId === doc.id ? 'bg-indigo-50 text-indigo-600' : 'bg-slate-50 text-slate-500 group-hover:bg-slate-100'}`}>
                              <doc.icon className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{doc.title}</h2>
                          </div>
                          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${expandedSections.has(doc.id) ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                          {expandedSections.has(doc.id) && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="py-6 prose prose-slate prose-sm md:prose-base max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-indigo-600 hover:prose-a:text-indigo-700">
                                {doc.content}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* FAQ Section (Static for now) */}
                <div id="faq-section" className="mt-16 pt-10 border-t border-slate-100 pb-16">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-500" />
                    Frequently Asked Questions
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-800 text-sm mb-1">How do I change my password?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">Navigate to the Profile section and click on Security Settings. Note: Super Admins can force password resets for any user.</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <h4 className="font-bold text-slate-800 text-sm mb-1">What happens when I deny a leave?</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">The employee will be notified, and their requested days will be instantly refunded to their available balance.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
