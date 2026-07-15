export interface IncrementRecord {
  date: string;
  previousSalary: number;
  newSalary: number;
  remarks?: string;
}

export interface ManagerNote {
  id: string;
  author: string;
  text: string;
  createdAt: string; // ISO datetime
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  team: string;
  email: string;
  active: boolean;
  leaveBalance?: {
    sickLeaveUsed: number;
    casualLeaveUsed: number;
    govFestHolidaysUsed: number;
  };
  createdAt: string;
  joiningDate?: string;
  salary?: number;
  incrementHistory?: IncrementRecord[];
  phone?: string;
  emergencyContact?: string;
  notes?: string;
  managerNotes?: ManagerNote[];

  // Extensive Personal & HR Details
  bloodGroup?: string;
  dob?: string;
  gender?: string;
  maritalStatus?: string;
  nationality?: string;
  personalEmail?: string;
  currentAddress?: string;
  permanentAddress?: string;
  highestQualification?: string;
  experienceYears?: number;
  nationalId?: string;
  taxId?: string;
  bankName?: string;
  bankAccountNumber?: string;
  bankIfscCode?: string;
  probationPeriod?: string;
  workLocation?: string;
  employmentType?: string;

  // Extension for Full Manager Editable Properties (persisted to database)
  skillsGrouped?: {
    languages: string[];
    frontend: string[];
    backend: string[];
    cloudDevops: string[];
    databases: string[];
  };
  tickets?: {
    id: string;
    title: string;
    status: string;
    priority: string;
    loggedHours: number;
    sp: number;
  }[];
  containers?: {
    id: string;
    name: string;
    image: string;
    port: string;
    status: string;
  }[];
  sshKeys?: {
    id: string;
    name: string;
    type: string;
    fingerprint: string;
    date: string;
  }[];
  leaveRequests?: {
    id: string;
    type: string;
    start: string;
    end: string;
    days: number;
    status: string;
    notes: string;
  }[];
  okrs?: {
    title: string;
    pct: number;
    metric: string;
  }[];
  portfolioItems?: {
    id: string;
    title: string;
    description: string;
    category: "Open Source" | "Internal Product" | "Technical Writing" | "Research & Patent";
    technologies: string[];
    link?: string;
    metrics?: string;
    date: string;
  }[];
}

export interface PerformanceRecord {
  id: string;
  employeeId: string;
  month: string; // "YYYY-MM"
  attendance: number; // e.g. 98.5 for 98.5%
  conductedMeetings: number;
  deliveredProjectsAmount: number;
  deliveredProjectsValue: number; // e.g. in USD
  updatedAt: string;
  totalWorkingDays?: number;
  presentDays?: number;
  absentDays?: number;
  leaveDays?: number;
  managerRemarks?: string;
}

export interface MonthlyReport {
  id: string;
  employeeId: string;
  month: string; // "YYYY-MM"
  summary: string;
  strengths: string[];
  growthOpportunities: string[];
  developmentPlan: string;
  generatedAt: string;
}

export interface MonthlyTarget {
  id: string;
  month: string; // "YYYY-MM"
  attendanceMin: number; // percentage, e.g. 95 for 95%
  projectValueMin: number; // value in USD, e.g. 30000
  updatedAt: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: 'Sick' | 'Casual' | 'Gov/Fest';
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  days: number;
  status: 'Pending' | 'Approved' | 'Rejected';
  requestedAt: string; // ISO date string
}

export interface DBStatus {
  isConnected: boolean;
  connectionType: 'mongodb' | 'local';
  uriProvided: boolean;
  errorMessage?: string;
}

export interface DashboardMetrics {
  totalEmployees: number;
  avgAttendance: number;
  totalMeetings: number;
  totalProjectsAmount: number;
  totalProjectsValue: number;
  departmentAverages: {
    department: string;
    avgAttendance: number;
    avgMeetings: number;
    avgProjectsAmount: number;
    avgProjectsValue: number;
  }[];
}
