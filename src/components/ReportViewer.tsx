import React, { useState, useEffect } from "react";
import { FileText, Sparkles, Printer, Copy, Check, Loader2, ArrowRight, UserCheck, TrendingUp } from "lucide-react";
import { Employee, MonthlyReport, PerformanceRecord } from "../types";

interface ReportViewerProps {
  employee: Employee;
  record: PerformanceRecord | undefined;
  report: MonthlyReport | null;
  month: string;
  onGenerate: () => void;
  isGenerating: boolean;
}

export function ReportViewer({
  employee,
  record,
  report,
  month,
  onGenerate,
  isGenerating,
}: ReportViewerProps) {
  const [copied, setCopied] = useState(false);
  const [loadingTip, setLoadingTip] = useState("");

  const tips = [
    "Analyzing monthly project delivery metrics...",
    "Correlating attendance rate with project values...",
    "Synthesizing customized 30-day talent growth milestones...",
    "Drafting strengths based on meeting participation...",
    "Formulating professional development opportunities..."
  ];

  useEffect(() => {
    if (!isGenerating) return;
    let index = 0;
    setLoadingTip(tips[0]);
    const interval = setInterval(() => {
      index = (index + 1) % tips.length;
      setLoadingTip(tips[index]);
    }, 2500);
    return () => clearInterval(interval);
  }, [isGenerating]);

  const copyToClipboard = () => {
    if (!report) return;
    const text = `
MONTHLY PROGRESS & TALENT DEVELOPMENT REPORT
Employee: ${employee.name} (${employee.role})
Department: ${employee.department}
Month: ${report.month}
Generated At: ${new Date(report.generatedAt).toLocaleDateString()}

SUMMARY:
${report.summary}

KEY STRENGTHS:
${report.strengths.map((s, i) => `${i + 1}. ${s}`).join("\n")}

GROWTH OPPORTUNITIES:
${report.growthOpportunities.map((g, i) => `${i + 1}. ${g}`).join("\n")}

30-DAY ACTION PLAN:
${report.developmentPlan}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatMonth = (mStr: string) => {
    const [year, monthNum] = mStr.split("-");
    const date = new Date(Number(year), Number(monthNum) - 1, 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  if (isGenerating) {
    return (
      <div id="report-generating-loader" className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-slate-200 rounded-2xl min-h-[400px]">
        <div className="relative mb-6">
          <div className="absolute inset-0 rounded-full bg-blue-100 animate-ping opacity-75" />
          <div className="relative p-4 rounded-full bg-blue-50 border border-blue-200 text-blue-600">
            <Sparkles className="h-8 w-8 animate-pulse" />
          </div>
        </div>
        <h4 className="text-lg font-semibold text-slate-800 animate-pulse">Consulting Gemini Coach</h4>
        <p className="text-xs text-blue-600 mt-2 font-mono h-5">{loadingTip}</p>
        <p className="text-xs text-slate-400 mt-4 max-w-sm text-center">
          We use Google Gemini AI to analyze performance vectors and construct a bespoke professional roadmap.
        </p>
      </div>
    );
  }

  if (!record) {
    return (
      <div id="report-no-record-warning" className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-300 rounded-2xl text-center min-h-[300px]">
        <div className="p-3 rounded-full bg-slate-100 border border-slate-200 text-slate-500 mb-4">
          <FileText className="h-6 w-6" />
        </div>
        <h4 className="text-md font-semibold text-slate-800">No Performance Data Logged</h4>
        <p className="text-sm text-slate-500 max-w-md mt-2">
          You must record employee performance metrics (attendance, meetings, and projects) for <strong>{formatMonth(month)}</strong> before a talent development report can be generated.
        </p>
      </div>
    );
  }

  if (!report) {
    return (
      <div id="report-generate-prompt" className="flex flex-col items-center justify-center p-8 bg-blue-50/50 border border-blue-100 rounded-2xl text-center min-h-[300px]">
        <div className="p-3 rounded-full bg-blue-50 border border-blue-200 text-blue-600 mb-4">
          <Sparkles className="h-6 w-6" />
        </div>
        <h4 className="text-md font-bold text-slate-800">Generate Development Roadmap</h4>
        <p className="text-sm text-slate-600 max-w-md mt-2">
          Use Gemini AI to analyze {employee.name}'s performance ({record.attendance}% attendance, {record.conductedMeetings} meetings, {record.deliveredProjectsAmount} projects) and write a monthly development plan.
        </p>
        <button
          id="btn-generate-report"
          onClick={onGenerate}
          className="mt-5 flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-sm transition-all"
        >
          <Sparkles className="h-4 w-4" />
          Generate AI Report
        </button>
      </div>
    );
  }

  return (
    <div id="report-card-container" className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden print:border-none print:shadow-none">
      {/* Header Panel */}
      <div className="bg-slate-900 text-white p-6 print:bg-white print:text-slate-900 print:border-b print:p-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-blue-500/20 text-blue-300 font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider print:hidden">
                Talent Development
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ID: {report.id}
              </span>
            </div>
            <h3 className="text-xl font-bold mt-1">{employee.name}</h3>
            <p className="text-xs text-slate-300">
              {employee.role} &bull; {employee.department}
            </p>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold transition-all"
              title="Copy to Clipboard"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded-lg text-xs font-semibold transition-all"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
          </div>
        </div>

        {/* Stats overlay inside header */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800/80 print:grid-cols-4 print:text-slate-800 print:border-slate-200">
          <div className="bg-slate-800/40 p-3 rounded-xl print:bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Attendance</span>
              <span className="text-md font-bold font-mono">{record.attendance}%</span>
            </div>
            <div className="mt-1.5 flex flex-wrap gap-1 text-[8px] font-semibold text-slate-300 print:text-slate-500 font-mono">
              <span className="bg-slate-700/50 px-1 rounded print:bg-slate-100">Pres: {record.presentDays !== undefined ? record.presentDays : Math.round((record.totalWorkingDays || 22) * (record.attendance / 100))}d</span>
              <span className="bg-slate-700/50 px-1 rounded print:bg-slate-100">Abs: {record.absentDays !== undefined ? record.absentDays : ((record.totalWorkingDays || 22) - (record.presentDays !== undefined ? record.presentDays : Math.round((record.totalWorkingDays || 22) * (record.attendance / 100))))}d</span>
              {record.leaveDays !== undefined && record.leaveDays > 0 && (
                <span className="bg-slate-700/50 px-1 rounded print:bg-slate-100">Lv: {record.leaveDays}d</span>
              )}
            </div>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl print:bg-slate-50">
            <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Meetings</span>
            <span className="text-md font-bold font-mono">{record.conductedMeetings}</span>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl print:bg-slate-50">
            <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Projects Amount</span>
            <span className="text-md font-bold font-mono">{record.deliveredProjectsAmount}</span>
          </div>
          <div className="bg-slate-800/40 p-3 rounded-xl print:bg-slate-50">
            <span className="block text-[10px] text-slate-400 font-medium uppercase tracking-wider">Delivered Value</span>
            <span className="text-md font-bold font-mono text-emerald-400 print:text-emerald-700">
              ${record.deliveredProjectsValue.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Body panel */}
      <div className="p-6 space-y-6">
        {/* Summary Block */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            Performance Synthesis
          </h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-blue-50/20 p-4 rounded-xl border border-blue-100/30">
            {report.summary}
          </p>
        </div>

        {/* Strengths & Growth Areas Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-3 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-emerald-500" />
              Core Competencies & Strengths
            </h4>
            <ul className="space-y-2.5">
              {report.strengths.map((strength, index) => (
                <li key={index} className="flex gap-2 text-xs text-slate-700 items-start">
                  <span className="h-5 w-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-3 flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-amber-500" />
              Growth & Coaching Opportunities
            </h4>
            <ul className="space-y-2.5">
              {report.growthOpportunities.map((opp, index) => (
                <li key={index} className="flex gap-2 text-xs text-slate-700 items-start">
                  <span className="h-5 w-5 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{opp}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Plan */}
        <div className="pt-6 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3 flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-blue-500" />
            30-Day Talent Development Blueprint
          </h4>
          <div className="bg-blue-600 text-white p-5 rounded-xl flex gap-4 items-start shadow-sm shadow-blue-100">
            <div className="p-2 rounded-lg bg-blue-500/30 text-blue-100 shrink-0 mt-0.5">
              <ArrowRight className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <p className="text-sm font-medium leading-relaxed">
                {report.developmentPlan}
              </p>
              <span className="block mt-2 text-[10px] text-blue-200">
                Action items should be integrated into standard 1-on-1 operational review agendas.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400">
        <span>Generated: {new Date(report.generatedAt).toLocaleString()}</span>
        <span className="font-mono">Employee Card ID: {employee.id}</span>
      </div>
    </div>
  );
}
