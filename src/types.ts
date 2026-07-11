export interface IncrementRecord {
  date: string;
  previousSalary: number;
  newSalary: number;
  remarks?: string;
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
