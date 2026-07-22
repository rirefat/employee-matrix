import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, HelpCircle, Mail, MessageSquare, Phone, Shield, FileText, 
  ChevronRight, AlertCircle, CheckCircle, Clock, Activity
} from 'lucide-react';
import { Manager } from '../types';

interface SupportPortalProps {
  onClose: () => void;
  loggedInManager: Manager | null;
}

export function SupportPortal({ onClose, loggedInManager }: SupportPortalProps) {
  const [activeTab, setActiveTab] = useState<'contact' | 'status' | 'tickets'>('contact');
  const [formData, setFormData] = useState({
    subject: '',
    category: 'technical',
    urgency: 'medium',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ subject: '', category: 'technical', urgency: 'medium', message: '' });
      }, 3000);
    }, 1000);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex justify-end bg-slate-900/20 backdrop-blur-sm">
        <motion.div 
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="w-full max-w-4xl h-full bg-white shadow-2xl flex flex-col md:flex-row overflow-hidden"
        >
          {/* Mobile Header (Hidden on Desktop) */}
          <div className="md:hidden flex items-center justify-between p-4 border-b border-slate-100 bg-slate-50 shrink-0">
            <div className="flex items-center gap-2 text-indigo-600 font-bold">
              <HelpCircle className="w-5 h-5" />
              <span>Support Portal</span>
            </div>
            <button onClick={onClose} className="p-2 bg-white rounded-full text-slate-500 border border-slate-200">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <div className="w-full md:w-64 bg-slate-50 border-r border-slate-100 flex flex-col shrink-0 h-48 md:h-full">
            <div className="p-6 hidden md:block">
              <div className="flex items-center gap-2 text-indigo-600 font-black text-xl tracking-tight font-display mb-1">
                <HelpCircle className="w-6 h-6" />
                <span>Support Center</span>
              </div>
              <p className="text-xs text-slate-500 font-medium">Help & Assistance</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
                Support Options
              </div>
              
              <button
                onClick={() => setActiveTab('contact')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                  activeTab === 'contact' 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Mail className={`w-4 h-4 ${activeTab === 'contact' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>Contact Support</span>
              </button>

              <button
                onClick={() => setActiveTab('tickets')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                  activeTab === 'tickets' 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
              >
                <FileText className={`w-4 h-4 ${activeTab === 'tickets' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>My Tickets</span>
              </button>
              
              <button
                onClick={() => setActiveTab('status')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-3 ${
                  activeTab === 'status' 
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100/50' 
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
                }`}
              >
                <Activity className={`w-4 h-4 ${activeTab === 'status' ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>System Status</span>
              </button>
            </div>
            
            <div className="p-4 border-t border-slate-200/60 hidden md:block">
              <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Emergency HR</p>
                  <p className="text-sm font-bold text-slate-800 truncate">+1 (800) 555-0199</p>
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
                title="Close Support Portal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 md:p-10">
              <div className="max-w-2xl mx-auto">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-8">
                  <span>Support Center</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                    {activeTab === 'contact' ? 'Contact Support' : activeTab === 'tickets' ? 'My Tickets' : 'System Status'}
                  </span>
                </div>

                {activeTab === 'contact' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">How can we help?</h2>
                      <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                        Submit a ticket to our internal support team. We aim to respond to all inquiries within 24 business hours.
                      </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Category</label>
                          <select 
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                          >
                            <option value="technical">Technical Support / IT</option>
                            <option value="hr">Human Resources</option>
                            <option value="payroll">Payroll & Benefits</option>
                            <option value="access">Access & Permissions</option>
                            <option value="other">Other</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Urgency</label>
                          <select 
                            value={formData.urgency}
                            onChange={e => setFormData({...formData, urgency: e.target.value})}
                            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                          >
                            <option value="low">Low - General Inquiry</option>
                            <option value="medium">Medium - Needs Attention</option>
                            <option value="high">High - Blocking Work</option>
                            <option value="critical">Critical - System Down</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Subject</label>
                        <input 
                          required
                          type="text"
                          value={formData.subject}
                          onChange={e => setFormData({...formData, subject: e.target.value})}
                          placeholder="Brief description of the issue"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Message</label>
                        <textarea 
                          required
                          rows={5}
                          value={formData.message}
                          onChange={e => setFormData({...formData, message: e.target.value})}
                          placeholder="Please provide as much detail as possible..."
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-700 resize-none"
                        />
                      </div>

                      <div className="pt-2">
                        <button 
                          type="submit"
                          disabled={isSubmitting || isSubmitted}
                          className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm
                            ${isSubmitted 
                              ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' 
                              : isSubmitting 
                                ? 'bg-indigo-400 text-white cursor-not-allowed'
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/20 hover:shadow-md'
                            }`}
                        >
                          {isSubmitted ? (
                            <>
                              <CheckCircle className="w-5 h-5" />
                              Ticket Submitted Successfully
                            </>
                          ) : isSubmitting ? (
                            <>
                              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            <>
                              <MessageSquare className="w-5 h-5" />
                              Submit Support Ticket
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'tickets' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">My Tickets</h2>
                      <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                        Track the status of your recent support requests.
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-100 mx-auto mb-4">
                        <FileText className="w-6 h-6 text-slate-300" />
                      </div>
                      <h3 className="font-bold text-slate-800 mb-1">No Active Tickets</h3>
                      <p className="text-sm text-slate-500 max-w-sm mx-auto">You don't have any pending support tickets. If you need help, please use the Contact Support form.</p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'status' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 tracking-tight">System Status</h2>
                      <p className="text-slate-500 mt-2 text-sm leading-relaxed">
                        Current operational status of internal systems and third-party integrations.
                      </p>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 flex items-start gap-4">
                      <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl shrink-0">
                        <CheckCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-emerald-800 text-sm">All Systems Operational</h4>
                        <p className="text-xs text-emerald-600 mt-1">No reported issues or downtime across the Matrix Portal platform.</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono px-1">Core Services</h4>
                      
                      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="font-semibold text-slate-700 text-sm">Authentication / Login</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 99.99% Uptime</span>
                      </div>
                      
                      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="font-semibold text-slate-700 text-sm">Database Sync (Cloud)</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 99.95% Uptime</span>
                      </div>
                      
                      <div className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          <span className="font-semibold text-slate-700 text-sm">AI Co-Pilot (Gemini API)</span>
                        </div>
                        <span className="text-xs font-medium text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 99.98% Uptime</span>
                      </div>
                    </div>
                  </motion.div>
                )}

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
