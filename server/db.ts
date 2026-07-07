import { MongoClient, Db, Collection } from "mongodb";
import fs from "fs";
import path from "path";
import { Employee, PerformanceRecord, MonthlyReport, DBStatus, MonthlyTarget } from "../src/types";

const LOCAL_DB_PATH = path.join(process.cwd(), "data.json");

// Helper function to generate IDs if missing
const generateId = () => Math.random().toString(36).substring(2, 11);

// Seed data
const initialTargets: MonthlyTarget[] = [
  {
    id: "target-default",
    month: "2026-06",
    attendanceMin: 95,
    projectValueMin: 30000,
    updatedAt: new Date("2026-06-01").toISOString()
  },
  {
    id: "target-prev",
    month: "2026-05",
    attendanceMin: 95,
    projectValueMin: 25000,
    updatedAt: new Date("2026-05-01").toISOString()
  }
];

// Seed data
const initialEmployees: Employee[] = [
  {
    id: "emp-1",
    name: "Sarah Jenkins",
    role: "Senior Frontend Engineer",
    department: "Engineering",
    email: "sarah.jenkins@company.com",
    active: true,
    createdAt: new Date("2025-01-15").toISOString(),
  },
  {
    id: "emp-2",
    name: "David Chen",
    role: "Account Executive",
    department: "Sales",
    email: "david.chen@company.com",
    active: true,
    createdAt: new Date("2025-03-10").toISOString(),
  },
  {
    id: "emp-3",
    name: "Maria Rodriguez",
    role: "Customer Support Specialist",
    department: "Customer Success",
    email: "maria.rodriguez@company.com",
    active: true,
    createdAt: new Date("2025-06-01").toISOString(),
  },
  {
    id: "emp-4",
    name: "Alex Thompson",
    role: "Product Designer",
    department: "Product",
    email: "alex.thompson@company.com",
    active: true,
    createdAt: new Date("2025-08-20").toISOString(),
  }
];

const initialPerformance: PerformanceRecord[] = [
  // May 2026
  {
    id: "perf-1",
    employeeId: "emp-1",
    month: "2026-05",
    attendance: 100,
    conductedMeetings: 24,
    deliveredProjectsAmount: 4,
    deliveredProjectsValue: 45000,
    updatedAt: new Date("2026-05-31").toISOString(),
  },
  {
    id: "perf-2",
    employeeId: "emp-2",
    month: "2026-05",
    attendance: 95,
    conductedMeetings: 48,
    deliveredProjectsAmount: 2,
    deliveredProjectsValue: 120000,
    updatedAt: new Date("2026-05-31").toISOString(),
  },
  {
    id: "perf-3",
    employeeId: "emp-3",
    month: "2026-05",
    attendance: 98,
    conductedMeetings: 15,
    deliveredProjectsAmount: 8,
    deliveredProjectsValue: 15000,
    updatedAt: new Date("2026-05-31").toISOString(),
  },
  {
    id: "perf-4",
    employeeId: "emp-4",
    month: "2026-05",
    attendance: 92,
    conductedMeetings: 32,
    deliveredProjectsAmount: 3,
    deliveredProjectsValue: 30000,
    updatedAt: new Date("2026-05-31").toISOString(),
  },
  // June 2026
  {
    id: "perf-5",
    employeeId: "emp-1",
    month: "2026-06",
    attendance: 96,
    conductedMeetings: 28,
    deliveredProjectsAmount: 5,
    deliveredProjectsValue: 55000,
    updatedAt: new Date("2026-06-30").toISOString(),
  },
  {
    id: "perf-6",
    employeeId: "emp-2",
    month: "2026-06",
    attendance: 98,
    conductedMeetings: 52,
    deliveredProjectsAmount: 3,
    deliveredProjectsValue: 180000,
    updatedAt: new Date("2026-06-30").toISOString(),
  },
  {
    id: "perf-7",
    employeeId: "emp-3",
    month: "2026-06",
    attendance: 100,
    conductedMeetings: 18,
    deliveredProjectsAmount: 10,
    deliveredProjectsValue: 20000,
    updatedAt: new Date("2026-06-30").toISOString(),
  },
  {
    id: "perf-8",
    employeeId: "emp-4",
    month: "2026-06",
    attendance: 96,
    conductedMeetings: 30,
    deliveredProjectsAmount: 4,
    deliveredProjectsValue: 40000,
    updatedAt: new Date("2026-06-30").toISOString(),
  }
];

const initialReports: MonthlyReport[] = [
  {
    id: "rep-1",
    employeeId: "emp-1",
    month: "2026-06",
    summary: "Sarah Jenkins had an exceptional month of June, delivering 5 key project features with outstanding velocity. She maintained an active calendar and high engineering standard.",
    strengths: [
      "Excellent technical leadership on frontend components",
      "Consistent 96% attendance and reliable communication",
      "Successfully delivered 5 project increments valued at $55,000"
    ],
    growthOpportunities: [
      "Increase collaboration with the design team earlier in the development lifecycle",
      "Take on more cross-department mentorship sessions"
    ],
    developmentPlan: "Focus on UI architecture refactoring over the next 30 days and host a knowledge-sharing brownbag on modern state management.",
    generatedAt: new Date("2026-07-01").toISOString()
  }
];

interface LocalSchema {
  employees: Employee[];
  performance: PerformanceRecord[];
  reports: MonthlyReport[];
  targets: MonthlyTarget[];
}

class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private dbStatus: DBStatus = {
    isConnected: false,
    connectionType: "local",
    uriProvided: false
  };
  private initPromise: Promise<void>;
  
  // Safe in-memory fallback for read-only filesystem environments (like Vercel serverless)
  private memoryDb: LocalSchema = {
    employees: initialEmployees,
    performance: initialPerformance,
    reports: initialReports,
    targets: initialTargets
  };

  constructor() {
    this.initPromise = this.initialize();
  }

  private async ensureInitialized() {
    await this.initPromise;
  }

  private async initialize() {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      this.dbStatus.uriProvided = true;
      try {
        console.log("Attempting to connect to MongoDB...");
        this.client = new MongoClient(mongoUri, { connectTimeoutMS: 5000 });
        await this.client.connect();
        
        // Dynamically use the database specified in the URI, defaulting to "employee-matrix"
        this.db = this.client.db();
        if (!this.db.databaseName || this.db.databaseName === "test") {
          this.db = this.client.db("employee-matrix");
        }
        
        this.dbStatus.isConnected = true;
        this.dbStatus.connectionType = "mongodb";
        this.dbStatus.errorMessage = undefined;
        console.log(`Successfully connected to MongoDB database: ${this.db.databaseName}`);
        
        // Seed MongoDB if collections are empty
        await this.seedMongoIfNeeded();
      } catch (err: any) {
        console.error("MongoDB Connection Failed. Falling back to local/in-memory storage.", err);
        this.dbStatus.isConnected = false;
        this.dbStatus.connectionType = "local";
        this.dbStatus.errorMessage = err.message || String(err);
        this.setupLocalStorage();
      }
    } else {
      console.log("No MONGODB_URI provided. Initializing local JSON database.");
      this.setupLocalStorage();
    }
  }

  private setupLocalStorage() {
    this.dbStatus.isConnected = false;
    this.dbStatus.connectionType = "local";
    
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const initialData: LocalSchema = {
        employees: initialEmployees,
        performance: initialPerformance,
        reports: initialReports,
        targets: initialTargets
      };
      try {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2));
        console.log("Seeded local JSON database at", LOCAL_DB_PATH);
      } catch (err) {
        console.warn("Could not write local JSON file (likely read-only serverless environment). Using in-memory store fallback instead.", err);
      }
    }
  }

  private async seedMongoIfNeeded() {
    if (!this.db) return;
    try {
      const employeesColl = this.db.collection("employees");
      const count = await employeesColl.countDocuments();
      
      if (count === 0) {
        console.log("Seeding initial employees into MongoDB...");
        // Use JSON cloning to avoid mutating initial objects (MongoDB driver mutates passed objects to inject _id)
        const cleanEmployees = JSON.parse(JSON.stringify(initialEmployees));
        await this.db.collection("employees").insertMany(cleanEmployees);
      }
      
      const perfColl = this.db.collection("performance_records");
      const perfCount = await perfColl.countDocuments();
      if (perfCount === 0) {
        console.log("Seeding initial performance records into MongoDB...");
        const cleanPerformance = JSON.parse(JSON.stringify(initialPerformance));
        await this.db.collection("performance_records").insertMany(cleanPerformance);
      }

      const reportsColl = this.db.collection("monthly_reports");
      const reportsCount = await reportsColl.countDocuments();
      if (reportsCount === 0) {
        console.log("Seeding initial monthly reports into MongoDB...");
        const cleanReports = JSON.parse(JSON.stringify(initialReports));
        await this.db.collection("monthly_reports").insertMany(cleanReports);
      }

      const targetsColl = this.db.collection("monthly_targets");
      const targetsCount = await targetsColl.countDocuments();
      if (targetsCount === 0) {
        console.log("Seeding initial monthly targets into MongoDB...");
        const cleanTargets = JSON.parse(JSON.stringify(initialTargets));
        await this.db.collection("monthly_targets").insertMany(cleanTargets);
      }
      
      console.log("MongoDB initialization/seeding check complete.");
    } catch (err) {
      console.error("Error checking/seeding MongoDB collections:", err);
    }
  }

  public async resetDatabase(): Promise<boolean> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      try {
        console.log("Resetting MongoDB database from scratch...");
        await this.db.collection("employees").deleteMany({});
        await this.db.collection("performance_records").deleteMany({});
        await this.db.collection("monthly_reports").deleteMany({});
        await this.db.collection("monthly_targets").deleteMany({});
        
        await this.seedMongoIfNeeded();
        return true;
      } catch (err) {
        console.error("Failed to reset MongoDB:", err);
        throw err;
      }
    } else {
      console.log("Resetting Local JSON/Memory database from scratch...");
      const initialData: LocalSchema = {
        employees: initialEmployees,
        performance: initialPerformance,
        reports: initialReports,
        targets: initialTargets
      };
      this.memoryDb = JSON.parse(JSON.stringify(initialData));
      try {
        fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2));
      } catch (err) {
        console.warn("Unable to write reset file. State saved to in-memory store.", err);
      }
      return true;
    }
  }

  public getStatus(): DBStatus {
    return this.dbStatus;
  }

  // Reading Local Storage Data helper
  private readLocal(): LocalSchema {
    try {
      if (fs.existsSync(LOCAL_DB_PATH)) {
        const parsed = JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf8"));
        if (!parsed.targets) {
          parsed.targets = [];
        }
        return parsed as LocalSchema;
      }
    } catch (e) {
      console.error("Error reading local db", e);
    }
    // Fall back to memoryDb which contains preloaded initial seed data
    return this.memoryDb;
  }

  // Writing Local Storage Data helper
  private writeLocal(data: LocalSchema) {
    this.memoryDb = data;
    try {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
      console.warn("Unable to write local JSON file (read-only filesystem). State saved to in-memory store instead.", e);
    }
  }

  // --- EMPLOYEES API ---
  public async getEmployees(): Promise<Employee[]> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      // Ignore soft-deleted employees (active: false)
      const docs = await this.db.collection("employees").find({ active: { $ne: false } }).toArray();
      return docs.map(doc => {
        const { _id, ...rest } = doc;
        return { ...rest, id: rest.id || _id.toString() } as Employee;
      });
    } else {
      const data = this.readLocal();
      return data.employees.filter(e => e.active !== false);
    }
  }

  public async saveEmployee(emp: Omit<Employee, "id" | "createdAt">): Promise<Employee> {
    await this.ensureInitialized();
    const newEmp: Employee = {
      ...emp,
      id: "emp-" + generateId(),
      active: true,
      createdAt: new Date().toISOString()
    };

    if (this.db && this.dbStatus.connectionType === "mongodb") {
      await this.db.collection("employees").insertOne({ ...newEmp });
    } else {
      const data = this.readLocal();
      data.employees.push(newEmp);
      this.writeLocal(data);
    }
    return newEmp;
  }

  public async updateEmployee(id: string, emp: Partial<Employee>): Promise<Employee | null> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const result = await this.db.collection("employees").findOneAndUpdate(
        { id: id },
        { $set: emp },
        { returnDocument: "after" }
      );
      if (!result) return null;
      
      // Handle MongoDB Driver v4/v5 which wraps the document in `{ value: Doc }`
      // versus MongoDB Driver v6 which returns the document directly.
      let doc: any = null;
      if ("value" in result) {
        doc = (result as any).value;
      } else {
        doc = result;
      }
      
      if (!doc) return null;
      const { _id, ...rest } = doc;
      return { ...rest, id: rest.id || _id.toString() } as Employee;
    } else {
      const data = this.readLocal();
      const idx = data.employees.findIndex(e => e.id === id);
      if (idx === -1) return null;
      data.employees[idx] = { ...data.employees[idx], ...emp };
      this.writeLocal(data);
      return data.employees[idx];
    }
  }

  // --- PERFORMANCE RECORDS API ---
  public async getPerformance(month?: string): Promise<PerformanceRecord[]> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const query = month ? { month } : {};
      const docs = await this.db.collection("performance_records").find(query).toArray();
      return docs.map(doc => {
        const { _id, ...rest } = doc;
        return { ...rest, id: rest.id || _id.toString() } as PerformanceRecord;
      });
    } else {
      const data = this.readLocal();
      if (month) {
        return data.performance.filter(p => p.month === month);
      }
      return data.performance;
    }
  }

  public async savePerformance(record: Omit<PerformanceRecord, "id" | "updatedAt">): Promise<PerformanceRecord> {
    await this.ensureInitialized();
    const existing = await this.findPerformance(record.employeeId, record.month);
    
    const recordToSave = {
      ...record,
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      // Update
      if (this.db && this.dbStatus.connectionType === "mongodb") {
        await this.db.collection("performance_records").updateOne(
          { id: existing.id },
          { $set: recordToSave }
        );
      } else {
        const data = this.readLocal();
        const idx = data.performance.findIndex(p => p.id === existing.id);
        if (idx !== -1) {
          data.performance[idx] = { ...data.performance[idx], ...recordToSave };
          this.writeLocal(data);
        }
      }
      return { ...existing, ...recordToSave };
    } else {
      // Insert
      const newRecord: PerformanceRecord = {
        ...recordToSave,
        id: "perf-" + generateId()
      };
      
      if (this.db && this.dbStatus.connectionType === "mongodb") {
        await this.db.collection("performance_records").insertOne({ ...newRecord });
      } else {
        const data = this.readLocal();
        data.performance.push(newRecord);
        this.writeLocal(data);
      }
      return newRecord;
    }
  }

  private async findPerformance(employeeId: string, month: string): Promise<PerformanceRecord | null> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const doc = await this.db.collection("performance_records").findOne({ employeeId, month });
      if (!doc) return null;
      const { _id, ...rest } = doc;
      return { ...rest, id: rest.id || _id.toString() } as PerformanceRecord;
    } else {
      const data = this.readLocal();
      const rec = data.performance.find(p => p.employeeId === employeeId && p.month === month);
      return rec || null;
    }
  }

  // --- MONTHLY REPORTS API ---
  public async getReports(employeeId?: string, month?: string): Promise<MonthlyReport[]> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const query: any = {};
      if (employeeId) query.employeeId = employeeId;
      if (month) query.month = month;
      const docs = await this.db.collection("monthly_reports").find(query).toArray();
      return docs.map(doc => {
        const { _id, ...rest } = doc;
        return { ...rest, id: rest.id || _id.toString() } as MonthlyReport;
      });
    } else {
      const data = this.readLocal();
      let res = data.reports;
      if (employeeId) res = res.filter(r => r.employeeId === employeeId);
      if (month) res = res.filter(r => r.month === month);
      return res;
    }
  }

  public async saveReport(report: Omit<MonthlyReport, "id" | "generatedAt">): Promise<MonthlyReport> {
    await this.ensureInitialized();
    const existing = await this.findReport(report.employeeId, report.month);
    
    const reportToSave = {
      ...report,
      generatedAt: new Date().toISOString()
    };

    if (existing) {
      if (this.db && this.dbStatus.connectionType === "mongodb") {
        await this.db.collection("monthly_reports").updateOne(
          { id: existing.id },
          { $set: reportToSave }
        );
      } else {
        const data = this.readLocal();
        const idx = data.reports.findIndex(r => r.id === existing.id);
        if (idx !== -1) {
          data.reports[idx] = { ...data.reports[idx], ...reportToSave };
          this.writeLocal(data);
        }
      }
      return { ...existing, ...reportToSave };
    } else {
      const newReport: MonthlyReport = {
        ...reportToSave,
        id: "rep-" + generateId()
      };
      
      if (this.db && this.dbStatus.connectionType === "mongodb") {
        await this.db.collection("monthly_reports").insertOne({ ...newReport });
      } else {
        const data = this.readLocal();
        data.reports.push(newReport);
        this.writeLocal(data);
      }
      return newReport;
    }
  }

  private async findReport(employeeId: string, month: string): Promise<MonthlyReport | null> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const doc = await this.db.collection("monthly_reports").findOne({ employeeId, month });
      if (!doc) return null;
      const { _id, ...rest } = doc;
      return { ...rest, id: rest.id || _id.toString() } as MonthlyReport;
    } else {
      const data = this.readLocal();
      const rep = data.reports.find(r => r.employeeId === employeeId && r.month === month);
      return rep || null;
    }
  }

  // --- MONTHLY TARGETS API ---
  public async getTargets(month?: string): Promise<MonthlyTarget[]> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const query = month ? { month } : {};
      const docs = await this.db.collection("monthly_targets").find(query).toArray();
      return docs.map(doc => {
        const { _id, ...rest } = doc;
        return { ...rest, id: rest.id || _id.toString() } as MonthlyTarget;
      });
    } else {
      const data = this.readLocal();
      const targets = data.targets || [];
      if (month) {
        return targets.filter(t => t.month === month);
      }
      return targets;
    }
  }

  public async saveTarget(target: Omit<MonthlyTarget, "id" | "updatedAt">): Promise<MonthlyTarget> {
    await this.ensureInitialized();
    const existing = await this.findTarget(target.month);
    
    const targetToSave = {
      ...target,
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      if (this.db && this.dbStatus.connectionType === "mongodb") {
        await this.db.collection("monthly_targets").updateOne(
          { id: existing.id },
          { $set: targetToSave }
        );
      } else {
        const data = this.readLocal();
        if (!data.targets) data.targets = [];
        const idx = data.targets.findIndex(t => t.id === existing.id);
        if (idx !== -1) {
          data.targets[idx] = { ...data.targets[idx], ...targetToSave };
        } else {
          data.targets.push({ ...existing, ...targetToSave });
        }
        this.writeLocal(data);
      }
      return { ...existing, ...targetToSave };
    } else {
      const newTarget: MonthlyTarget = {
        ...targetToSave,
        id: "target-" + generateId()
      };
      
      if (this.db && this.dbStatus.connectionType === "mongodb") {
        await this.db.collection("monthly_targets").insertOne({ ...newTarget });
      } else {
        const data = this.readLocal();
        if (!data.targets) data.targets = [];
        data.targets.push(newTarget);
        this.writeLocal(data);
      }
      return newTarget;
    }
  }

  private async findTarget(month: string): Promise<MonthlyTarget | null> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const doc = await this.db.collection("monthly_targets").findOne({ month });
      if (!doc) return null;
      const { _id, ...rest } = doc;
      return { ...rest, id: rest.id || _id.toString() } as MonthlyTarget;
    } else {
      const data = this.readLocal();
      const targets = data.targets || [];
      const tar = targets.find(t => t.month === month);
      return tar || null;
    }
  }
}

export const dbService = new DatabaseService();
