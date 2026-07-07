import React, { useEffect, useState } from "react";
import { Database, AlertTriangle, CheckCircle, Info } from "lucide-react";
import { DBStatus } from "../types";

export function DBStatusBanner() {
  const [status, setStatus] = useState<DBStatus | null>(null);

  useEffect(() => {
    fetch("/api/db-status")
      .then((res) => res.json())
      .then((data) => setStatus(data))
      .catch((err) => console.error("Error fetching database status:", err));
  }, []);

  if (!status) return null;

  return (
    <div id="db-status-banner" className="mb-6 rounded-xl border p-4 bg-slate-50 border-slate-200 shadow-sm transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg mt-0.5 ${
            status.connectionType === "mongodb" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
          }`}>
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
              {status.connectionType === "mongodb" ? (
                <>
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Connected to MongoDB
                </>
              ) : (
                <>
                  <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                  Running in Mock Local DB Mode
                </>
              )}
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              {status.connectionType === "mongodb" ? (
                "All performance cards, attendance logs, and AI-driven development reports are securely stored in your MongoDB database."
              ) : (
                "Data is currently saved to a local server-side database file (data.json). This allows the application to be fully interactive out of the box."
              )}
            </p>
          </div>
        </div>

        {status.connectionType === "local" && (
          <div className="flex items-center gap-2 text-xs bg-amber-50/70 text-amber-800 px-3 py-2 rounded-lg border border-amber-200/50 max-w-md">
            <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
            <span>
              To connect your live database, add the <strong>MONGODB_URI</strong> secret inside the <strong>Settings &gt; Secrets</strong> panel of Google AI Studio.
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
