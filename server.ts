import express from "express";
import path from "path";
import dotenv from "dotenv";
import { dbService } from "./server/db";
import { generateMonthlyPerformanceReport, generateCoPilotResponse } from "./server/gemini";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// --- API ROUTES ---

// DB Status
app.get("/api/db-status", (req, res) => {
  res.json(dbService.getStatus());
});

// Reset Database (drops collections and seeds)
app.post("/api/db-reset", async (req, res) => {
  try {
    await dbService.resetDatabase();
    res.json({ success: true, message: "Database reset and seeded successfully." });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to reset database" });
  }
});

// Get Employees
app.get("/api/employees", async (req, res) => {
  try {
    const emps = await dbService.getEmployees();
    res.json(emps);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch employees" });
  }
});

// Create Employee
app.post("/api/employees", async (req, res) => {
  try {
    const { name, role, department, team, email, id, leaveBalance, joiningDate, salary, incrementHistory, phone, emergencyContact, notes } = req.body;
    if (!name || !role || !department || !team || !email) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const newEmp = await dbService.saveEmployee({
      name,
      role,
      department,
      team,
      email,
      id,
      active: true,
      leaveBalance,
      joiningDate,
      salary,
      incrementHistory,
      phone,
      emergencyContact,
      notes
    });
    res.status(201).json(newEmp);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save employee" });
  }
});

// Update Employee
app.put("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    const updated = await dbService.updateEmployee(id, updateData);
    if (!updated) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to update employee" });
  }
});

// Delete Employee (Hard delete)
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const success = await dbService.deleteEmployee(id);
    if (!success) {
      return res.status(404).json({ error: "Employee not found" });
    }
    res.json({ success: true, message: "Employee successfully deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to delete employee" });
  }
});

// Get Performance Records
app.get("/api/performance", async (req, res) => {
  try {
    const { month } = req.query;
    const records = await dbService.getPerformance(month as string);
    res.json(records);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch performance records" });
  }
});

// Save/Update Performance Record
app.post("/api/performance", async (req, res) => {
  try {
    const { 
      employeeId, 
      month, 
      attendance, 
      conductedMeetings, 
      deliveredProjectsAmount, 
      deliveredProjectsValue,
      totalWorkingDays,
      presentDays,
      absentDays,
      leaveDays,
      managerRemarks
    } = req.body;
    if (!employeeId || !month || attendance === undefined || conductedMeetings === undefined || deliveredProjectsAmount === undefined || deliveredProjectsValue === undefined) {
      return res.status(400).json({ error: "Missing required performance metrics" });
    }
    const record = await dbService.savePerformance({
      employeeId,
      month,
      attendance: Number(attendance),
      conductedMeetings: Number(conductedMeetings),
      deliveredProjectsAmount: Number(deliveredProjectsAmount),
      deliveredProjectsValue: Number(deliveredProjectsValue),
      totalWorkingDays: totalWorkingDays !== undefined ? Number(totalWorkingDays) : undefined,
      presentDays: presentDays !== undefined ? Number(presentDays) : undefined,
      absentDays: absentDays !== undefined ? Number(absentDays) : undefined,
      leaveDays: leaveDays !== undefined ? Number(leaveDays) : undefined,
      managerRemarks: managerRemarks !== undefined ? String(managerRemarks) : undefined,
    });
    res.json(record);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save performance record" });
  }
});

// Get Reports
app.get("/api/reports", async (req, res) => {
  try {
    const { employeeId, month } = req.query;
    const reports = await dbService.getReports(employeeId as string, month as string);
    res.json(reports);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch reports" });
  }
});

// Generate & Save Report
app.post("/api/reports/generate", async (req, res) => {
  try {
    const { employeeId, month } = req.body;
    if (!employeeId || !month) {
      return res.status(400).json({ error: "employeeId and month are required" });
    }

    // Fetch employee profile
    const employees = await dbService.getEmployees();
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee profile not found" });
    }

    // Fetch performance record
    const records = await dbService.getPerformance(month);
    const record = records.find(r => r.employeeId === employeeId);
    if (!record) {
      return res.status(400).json({
        error: `No performance metrics found for ${employee.name} in month ${month}. Please record performance card data before generating a progress report.`
      });
    }

    // Fetch targets for this month to align AI expectations
    const targets = await dbService.getTargets(month);
    const target = targets.find(t => t.month === month);

    // Generate report using Gemini
    console.log(`Generating Monthly Talent Report for ${employee.name} for ${month}...`);
    const generatedReportData = await generateMonthlyPerformanceReport(employee, record, target);
    
    // Save report to database
    const savedReport = await dbService.saveReport(generatedReportData);
    res.json(savedReport);
  } catch (err: any) {
    console.error("Error generating report:", err);
    res.status(500).json({ error: err.message || "Failed to generate talent development report" });
  }
});

// --- AI TALENT COPILOT CHAT API ---
app.post("/api/copilot/ask", async (req, res) => {
  try {
    const { employeeId, month, message } = req.body;
    if (!employeeId || !message) {
      return res.status(400).json({ error: "employeeId and message are required" });
    }

    const employees = await dbService.getEmployees();
    const employee = employees.find(e => e.id === employeeId);
    if (!employee) {
      return res.status(404).json({ error: "Employee profile not found" });
    }

    const records = await dbService.getPerformance(month);
    const record = records.find(r => r.employeeId === employeeId);

    const answer = await generateCoPilotResponse(employee, record, message);
    res.json({ answer });
  } catch (err: any) {
    console.error("Co-pilot chat error:", err);
    res.status(500).json({ error: err.message || "Failed to generate co-pilot advice" });
  }
});


// --- LEAVE REQUESTS API ---
app.get("/api/leave-requests", async (req, res) => {
  try {
    const requests = await dbService.getLeaveRequests();
    res.json(requests);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch leave requests" });
  }
});

app.post("/api/leave-requests", async (req, res) => {
  try {
    const { employeeId, type, startDate, endDate, days, status, requestedAt } = req.body;
    if (!employeeId || !type || !startDate || !endDate || !days || !status || !requestedAt) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const saved = await dbService.saveLeaveRequest({
      employeeId, type, startDate, endDate, days, status, requestedAt
    });
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save leave request" });
  }
});

// --- TARGETS API ---

app.get("/api/targets", async (req, res) => {
  try {
    const { month } = req.query;
    const targets = await dbService.getTargets(month as string);
    res.json(targets);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to fetch targets" });
  }
});

app.post("/api/targets", async (req, res) => {
  try {
    const { month, attendanceMin, projectValueMin } = req.body;
    if (!month || attendanceMin === undefined || projectValueMin === undefined) {
      return res.status(400).json({ error: "Missing required target fields" });
    }
    const saved = await dbService.saveTarget({
      month,
      attendanceMin: Number(attendanceMin),
      projectValueMin: Number(projectValueMin)
    });
    res.json(saved);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to save target" });
  }
});

// --- VITE DEV MIDDLEWARE OR PRODUCTION STATIC ROUTING ---
if (process.env.NODE_ENV !== "production") {
  console.log("Setting up Vite Development Server middleware...");
  import("vite").then(({ createServer: createViteServer }) => {
    createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    }).then((vite) => {
      app.use(vite.middlewares);
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server listening on http://0.0.0.0:${PORT} (Dev)`);
      });
    }).catch((err) => {
      console.error("Vite Dev Server creation failed:", err);
    });
  }).catch((err) => {
    console.error("Failed to dynamically import Vite module:", err);
  });
} else {
  // Production environment
  if (!process.env.VERCEL) {
    console.log("Setting up Production static folder routing...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening on http://0.0.0.0:${PORT} (Prod)`);
    });
  } else {
    console.log("Running in Vercel Serverless Function mode.");
  }
}

export default app;
