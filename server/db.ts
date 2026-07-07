import { MongoClient, Db, Collection } from "mongodb";
import fs from "fs";
import path from "path";
import { Employee, PerformanceRecord, MonthlyReport, DBStatus } from "../src/types";

const LOCAL_DB_PATH = path.join(process.cwd(), "data.json");

// Helper function to generate IDs if missing
const generateId = () => Math.random().toString(36).substring(2, 11);

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
}

class DatabaseService {
  private client: MongoClient | null = null;
  private db: Db | null = null;
  private dbStatus: DBStatus = {
    isConnected: false,
    connectionType: "local",
    uriProvided: false
  };

  constructor() {
    this.initialize();
  }

  private async initialize() {
    const mongoUri = process.env.MONGODB_URI;
    if (mongoUri) {
      this.dbStatus.uriProvided = true;
      try {
        console.log("Attempting to connect to MongoDB...");
        this.client = new MongoClient(mongoUri, { connectTimeoutMS: 5000 });
        await this.client.connect();
        this.db = this.client.db();
        this.dbStatus.isConnected = true;
        this.dbStatus.connectionType = "mongodb";
        console.log("Successfully connected to MongoDB database.");
        
        // Seed MongoDB if collections are empty
        await this.seedMongoIfNeeded();
      } catch (err: any) {
        console.error("MongoDB Connection Failed. Falling back to local storage.", err);
        this.dbStatus.errorMessage = err.message || "Unknown error";
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
        reports: initialReports
      };
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(initialData, null, 2));
      console.log("Seeded local JSON database at", LOCAL_DB_PATH);
    }
  }

  private async seedMongoIfNeeded() {
    if (!this.db) return;
    
    const employeesColl = this.db.collection("employees");
    const count = await employeesColl.countDocuments();
    
    if (count === 0) {
      console.log("Seeding initial data into MongoDB...");
      await this.db.collection("employees").insertMany(initialEmployees);
      await this.db.collection("performance_records").insertMany(initialPerformance);
      await this.db.collection("monthly_reports").insertMany(initialReports);
      console.log("Seeding complete for MongoDB.");
    }
  }

  public getStatus(): DBStatus {
    return this.dbStatus;
  }

  // Reading Local Storage Data helper
  private readLocal(): LocalSchema {
    try {
      if (fs.existsSync(LOCAL_DB_PATH)) {
        return JSON.parse(fs.readFileSync(LOCAL_DB_PATH, "utf8"));
      }
    } catch (e) {
      console.error("Error reading local db", e);
    }
    return { employees: [], performance: [], reports: [] };
  }

  // Writing Local Storage Data helper
  private writeLocal(data: LocalSchema) {
    try {
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
      console.error("Error writing local db", e);
    }
  }

  // --- EMPLOYEES API ---
  public async getEmployees(): Promise<Employee[]> {
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const docs = await this.db.collection("employees").find({}).toArray();
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
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const result = await this.db.collection("employees").findOneAndUpdate(
        { id: id },
        { $set: emp },
        { returnDocument: "after" }
      );
      if (!result) return null;
      const { _id, ...rest } = result as any;
      return { ...rest } as Employee;
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
}

export const dbService = new DatabaseService();
