import { MongoClient, Db, Collection } from "mongodb";
import fs from "fs";
import path from "path";
import { Employee, PerformanceRecord, MonthlyReport, MonthlyTarget, DBStatus, LeaveRequest } from "../src/types";

const LOCAL_DB_PATH = path.join(process.cwd(), "data.json");

// Helper function to generate IDs if missing
const generateId = () => Math.random().toString(36).substring(2, 11);

// Seed data

const initialLeaveRequests: LeaveRequest[] = [
  {
    id: "lr-1x9a2b3c",
    employeeId: "emp-alpha-001",
    type: "Sick",
    startDate: "2026-06-10",
    endDate: "2026-06-11",
    days: 2,
    status: "Approved",
    requestedAt: new Date("2026-06-05T09:30:00Z").toISOString()
  },
  {
    id: "lr-4y8b5d6e",
    employeeId: "emp-beta-002",
    type: "Casual",
    startDate: "2026-07-15",
    endDate: "2026-07-15",
    days: 1,
    status: "Pending",
    requestedAt: new Date("2026-07-08T14:15:00Z").toISOString()
  },
  {
    id: "lr-7z6c8f9g",
    employeeId: "emp-gamma-003",
    type: "Gov/Fest",
    startDate: "2026-05-01",
    endDate: "2026-05-01",
    days: 1,
    status: "Approved",
    requestedAt: new Date("2026-04-20T10:00:00Z").toISOString()
  }
];

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
    "id": "emp-1",
    "name": "Karen Young",
    "role": "Executive",
    "department": "Sales",
    "team": "Custom",
    "email": "karen.young@nexus.com",
    "active": true,
    "createdAt": "2025-09-15T00:00:00.000Z"
  },
  {
    "id": "emp-2",
    "name": "Joseph Green",
    "role": "Developer",
    "department": "Sales",
    "team": "Custom",
    "email": "joseph.green@nexus.com",
    "active": true,
    "createdAt": "2025-04-15T00:00:00.000Z"
  },
  {
    "id": "emp-3",
    "name": "Lisa King",
    "role": "Designer",
    "department": "Operations",
    "team": "Custom",
    "email": "lisa.king@nexus.com",
    "active": true,
    "createdAt": "2025-08-15T00:00:00.000Z"
  },
  {
    "id": "emp-4",
    "name": "Brian Rivera",
    "role": "Executive",
    "department": "Sales",
    "team": "Custom",
    "email": "brian.rivera@nexus.com",
    "active": true,
    "createdAt": "2025-04-15T00:00:00.000Z"
  },
  {
    "id": "emp-5",
    "name": "Daniel Taylor",
    "role": "Engineer",
    "department": "Sales",
    "team": "Custom",
    "email": "daniel.taylor@nexus.com",
    "active": true,
    "createdAt": "2025-02-15T00:00:00.000Z"
  },
  {
    "id": "emp-6",
    "name": "Charles White",
    "role": "Executive",
    "department": "Operations",
    "team": "Custom",
    "email": "charles.white@nexus.com",
    "active": true,
    "createdAt": "2025-06-15T00:00:00.000Z"
  },
  {
    "id": "emp-7",
    "name": "Nancy Adams",
    "role": "Manager",
    "department": "Operations",
    "team": "Custom",
    "email": "nancy.adams@nexus.com",
    "active": true,
    "createdAt": "2025-07-15T00:00:00.000Z"
  },
  {
    "id": "emp-8",
    "name": "William Nelson",
    "role": "Executive",
    "department": "Operations",
    "team": "Custom",
    "email": "william.nelson@nexus.com",
    "active": true,
    "createdAt": "2025-01-15T00:00:00.000Z"
  },
  {
    "id": "emp-9",
    "name": "Nancy Torres",
    "role": "Analyst",
    "department": "Sales",
    "team": "Custom",
    "email": "nancy.torres@nexus.com",
    "active": true,
    "createdAt": "2025-01-15T00:00:00.000Z"
  },
  {
    "id": "emp-10",
    "name": "Kimberly Baker",
    "role": "Designer",
    "department": "Sales",
    "team": "Custom",
    "email": "kimberly.baker@nexus.com",
    "active": true,
    "createdAt": "2025-01-15T00:00:00.000Z"
  },
  {
    "id": "emp-11",
    "name": "Emily Thompson",
    "role": "Manager",
    "department": "Operations",
    "team": "Custom",
    "email": "emily.thompson@nexus.com",
    "active": true,
    "createdAt": "2025-05-15T00:00:00.000Z"
  },
  {
    "id": "emp-12",
    "name": "Matthew Carter",
    "role": "Developer",
    "department": "Operations",
    "team": "Shopify",
    "email": "matthew.carter@nexus.com",
    "active": true,
    "createdAt": "2025-03-15T00:00:00.000Z"
  },
  {
    "id": "emp-13",
    "name": "Mary Anderson",
    "role": "Developer",
    "department": "Sales",
    "team": "Shopify",
    "email": "mary.anderson@nexus.com",
    "active": true,
    "createdAt": "2025-09-15T00:00:00.000Z"
  },
  {
    "id": "emp-14",
    "name": "Michelle Garcia",
    "role": "Manager",
    "department": "Operations",
    "team": "Shopify",
    "email": "michelle.garcia@nexus.com",
    "active": true,
    "createdAt": "2025-05-15T00:00:00.000Z"
  },
  {
    "id": "emp-15",
    "name": "Margaret Nguyen",
    "role": "Engineer",
    "department": "Operations",
    "team": "Shopify",
    "email": "margaret.nguyen@nexus.com",
    "active": true,
    "createdAt": "2025-07-15T00:00:00.000Z"
  },
  {
    "id": "emp-16",
    "name": "Margaret Hall",
    "role": "Designer",
    "department": "Operations",
    "team": "Shopify",
    "email": "margaret.hall@nexus.com",
    "active": true,
    "createdAt": "2025-05-15T00:00:00.000Z"
  },
  {
    "id": "emp-17",
    "name": "Richard Lewis",
    "role": "Executive",
    "department": "Sales",
    "team": "Shopify",
    "email": "richard.lewis@nexus.com",
    "active": true,
    "createdAt": "2025-03-15T00:00:00.000Z"
  },
  {
    "id": "emp-18",
    "name": "Melissa Jackson",
    "role": "Designer",
    "department": "Sales",
    "team": "Shopify",
    "email": "melissa.jackson@nexus.com",
    "active": true,
    "createdAt": "2025-06-15T00:00:00.000Z"
  },
  {
    "id": "emp-19",
    "name": "Dorothy Miller",
    "role": "Analyst",
    "department": "Sales",
    "team": "Shopify",
    "email": "dorothy.miller@nexus.com",
    "active": true,
    "createdAt": "2025-06-15T00:00:00.000Z"
  },
  {
    "id": "emp-20",
    "name": "Betty Hall",
    "role": "Executive",
    "department": "Sales",
    "team": "Shopify",
    "email": "betty.hall@nexus.com",
    "active": true,
    "createdAt": "2025-04-15T00:00:00.000Z"
  },
  {
    "id": "emp-21",
    "name": "George Wright",
    "role": "Developer",
    "department": "Sales",
    "team": "Shopify",
    "email": "george.wright@nexus.com",
    "active": true,
    "createdAt": "2025-05-15T00:00:00.000Z"
  },
  {
    "id": "emp-22",
    "name": "Robert Miller",
    "role": "Developer",
    "department": "Operations",
    "team": "Shopify",
    "email": "robert.miller@nexus.com",
    "active": true,
    "createdAt": "2025-08-15T00:00:00.000Z"
  },
  {
    "id": "emp-23",
    "name": "Christopher Hall",
    "role": "Developer",
    "department": "Sales",
    "team": "WordPress",
    "email": "christopher.hall@nexus.com",
    "active": true,
    "createdAt": "2025-03-15T00:00:00.000Z"
  },
  {
    "id": "emp-24",
    "name": "John King",
    "role": "Executive",
    "department": "Operations",
    "team": "WordPress",
    "email": "john.king@nexus.com",
    "active": true,
    "createdAt": "2025-09-15T00:00:00.000Z"
  },
  {
    "id": "emp-25",
    "name": "James Nguyen",
    "role": "Executive",
    "department": "Operations",
    "team": "WordPress",
    "email": "james.nguyen@nexus.com",
    "active": true,
    "createdAt": "2025-01-15T00:00:00.000Z"
  },
  {
    "id": "emp-26",
    "name": "William Green",
    "role": "Analyst",
    "department": "Operations",
    "team": "WordPress",
    "email": "william.green@nexus.com",
    "active": true,
    "createdAt": "2025-01-15T00:00:00.000Z"
  },
  {
    "id": "emp-27",
    "name": "Brian Hill",
    "role": "Specialist",
    "department": "Sales",
    "team": "WordPress",
    "email": "brian.hill@nexus.com",
    "active": true,
    "createdAt": "2025-03-15T00:00:00.000Z"
  },
  {
    "id": "emp-28",
    "name": "Linda King",
    "role": "Specialist",
    "department": "Operations",
    "team": "WordPress",
    "email": "linda.king@nexus.com",
    "active": true,
    "createdAt": "2025-07-15T00:00:00.000Z"
  },
  {
    "id": "emp-29",
    "name": "Timothy Flores",
    "role": "Analyst",
    "department": "Operations",
    "team": "WordPress",
    "email": "timothy.flores@nexus.com",
    "active": true,
    "createdAt": "2025-05-15T00:00:00.000Z"
  },
  {
    "id": "emp-30",
    "name": "Andrew Moore",
    "role": "Specialist",
    "department": "Operations",
    "team": "WordPress",
    "email": "andrew.moore@nexus.com",
    "active": true,
    "createdAt": "2025-07-15T00:00:00.000Z"
  },
  {
    "id": "emp-31",
    "name": "Christopher Lewis",
    "role": "Manager",
    "department": "Operations",
    "team": "WordPress",
    "email": "christopher.lewis@nexus.com",
    "active": true,
    "createdAt": "2025-03-15T00:00:00.000Z"
  },
  {
    "id": "emp-32",
    "name": "Carol Anderson",
    "role": "Specialist",
    "department": "Operations",
    "team": "WordPress",
    "email": "carol.anderson@nexus.com",
    "active": true,
    "createdAt": "2025-07-15T00:00:00.000Z"
  },
  {
    "id": "emp-33",
    "name": "Robert Hall",
    "role": "Specialist",
    "department": "Sales",
    "team": "WordPress",
    "email": "robert.hall@nexus.com",
    "active": true,
    "createdAt": "2025-03-15T00:00:00.000Z"
  },
  {
    "id": "emp-34",
    "name": "Jennifer Scott",
    "role": "Designer",
    "department": "Operations",
    "team": "UI/UX",
    "email": "jennifer.scott@nexus.com",
    "active": true,
    "createdAt": "2025-09-15T00:00:00.000Z"
  },
  {
    "id": "emp-35",
    "name": "Mary Wright",
    "role": "Executive",
    "department": "Operations",
    "team": "UI/UX",
    "email": "mary.wright@nexus.com",
    "active": true,
    "createdAt": "2025-01-15T00:00:00.000Z"
  },
  {
    "id": "emp-36",
    "name": "Jennifer Martinez",
    "role": "Specialist",
    "department": "Sales",
    "team": "UI/UX",
    "email": "jennifer.martinez@nexus.com",
    "active": true,
    "createdAt": "2025-09-15T00:00:00.000Z"
  },
  {
    "id": "emp-37",
    "name": "Donna Jackson",
    "role": "Analyst",
    "department": "Sales",
    "team": "UI/UX",
    "email": "donna.jackson@nexus.com",
    "active": true,
    "createdAt": "2025-07-15T00:00:00.000Z"
  },
  {
    "id": "emp-38",
    "name": "William Lewis",
    "role": "Specialist",
    "department": "Operations",
    "team": "UI/UX",
    "email": "william.lewis@nexus.com",
    "active": true,
    "createdAt": "2025-06-15T00:00:00.000Z"
  },
  {
    "id": "emp-39",
    "name": "Barbara Walker",
    "role": "Manager",
    "department": "Operations",
    "team": "UI/UX",
    "email": "barbara.walker@nexus.com",
    "active": true,
    "createdAt": "2025-09-15T00:00:00.000Z"
  },
  {
    "id": "emp-40",
    "name": "Lisa Thompson",
    "role": "Executive",
    "department": "Sales",
    "team": "UI/UX",
    "email": "lisa.thompson@nexus.com",
    "active": true,
    "createdAt": "2025-03-15T00:00:00.000Z"
  },
  {
    "id": "emp-41",
    "name": "Susan Johnson",
    "role": "Analyst",
    "department": "Operations",
    "team": "UI/UX",
    "email": "susan.johnson@nexus.com",
    "active": true,
    "createdAt": "2025-06-15T00:00:00.000Z"
  },
  {
    "id": "emp-42",
    "name": "Barbara Lewis",
    "role": "Developer",
    "department": "Operations",
    "team": "UI/UX",
    "email": "barbara.lewis@nexus.com",
    "active": true,
    "createdAt": "2025-03-15T00:00:00.000Z"
  },
  {
    "id": "emp-43",
    "name": "Mary Lewis",
    "role": "Designer",
    "department": "Operations",
    "team": "UI/UX",
    "email": "mary.lewis@nexus.com",
    "active": true,
    "createdAt": "2025-03-15T00:00:00.000Z"
  },
  {
    "id": "emp-44",
    "name": "Michelle Hall",
    "role": "Specialist",
    "department": "Sales",
    "team": "UI/UX",
    "email": "michelle.hall@nexus.com",
    "active": true,
    "createdAt": "2025-06-15T00:00:00.000Z"
  }
];

const initialPerformance: PerformanceRecord[] = [
  {
    "id": "perf-1",
    "employeeId": "emp-1",
    "month": "2026-05",
    "attendance": 92,
    "conductedMeetings": 18,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 71942,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-2",
    "employeeId": "emp-1",
    "month": "2026-06",
    "attendance": 88,
    "conductedMeetings": 19,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 48142,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-3",
    "employeeId": "emp-2",
    "month": "2026-05",
    "attendance": 85,
    "conductedMeetings": 32,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 45073,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-4",
    "employeeId": "emp-2",
    "month": "2026-06",
    "attendance": 88,
    "conductedMeetings": 12,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 16334,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-5",
    "employeeId": "emp-3",
    "month": "2026-05",
    "attendance": 89,
    "conductedMeetings": 32,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 72099,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-6",
    "employeeId": "emp-3",
    "month": "2026-06",
    "attendance": 93,
    "conductedMeetings": 37,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 77971,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-7",
    "employeeId": "emp-4",
    "month": "2026-05",
    "attendance": 87,
    "conductedMeetings": 14,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 47106,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-8",
    "employeeId": "emp-4",
    "month": "2026-06",
    "attendance": 91,
    "conductedMeetings": 22,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 79767,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-9",
    "employeeId": "emp-5",
    "month": "2026-05",
    "attendance": 85,
    "conductedMeetings": 22,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 19935,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-10",
    "employeeId": "emp-5",
    "month": "2026-06",
    "attendance": 86,
    "conductedMeetings": 33,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 41759,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-11",
    "employeeId": "emp-6",
    "month": "2026-05",
    "attendance": 92,
    "conductedMeetings": 17,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 35976,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-12",
    "employeeId": "emp-6",
    "month": "2026-06",
    "attendance": 89,
    "conductedMeetings": 38,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 72421,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-13",
    "employeeId": "emp-7",
    "month": "2026-05",
    "attendance": 94,
    "conductedMeetings": 29,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 52730,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-14",
    "employeeId": "emp-7",
    "month": "2026-06",
    "attendance": 85,
    "conductedMeetings": 25,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 22209,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-15",
    "employeeId": "emp-8",
    "month": "2026-05",
    "attendance": 85,
    "conductedMeetings": 17,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 86259,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-16",
    "employeeId": "emp-8",
    "month": "2026-06",
    "attendance": 85,
    "conductedMeetings": 35,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 71382,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-17",
    "employeeId": "emp-9",
    "month": "2026-05",
    "attendance": 96,
    "conductedMeetings": 17,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 28661,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-18",
    "employeeId": "emp-9",
    "month": "2026-06",
    "attendance": 91,
    "conductedMeetings": 34,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 76262,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-19",
    "employeeId": "emp-10",
    "month": "2026-05",
    "attendance": 99,
    "conductedMeetings": 25,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 54032,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-20",
    "employeeId": "emp-10",
    "month": "2026-06",
    "attendance": 90,
    "conductedMeetings": 36,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 95806,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-21",
    "employeeId": "emp-11",
    "month": "2026-05",
    "attendance": 92,
    "conductedMeetings": 27,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 46211,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-22",
    "employeeId": "emp-11",
    "month": "2026-06",
    "attendance": 88,
    "conductedMeetings": 27,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 35149,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-23",
    "employeeId": "emp-12",
    "month": "2026-05",
    "attendance": 93,
    "conductedMeetings": 10,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 78901,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-24",
    "employeeId": "emp-12",
    "month": "2026-06",
    "attendance": 91,
    "conductedMeetings": 35,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 70702,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-25",
    "employeeId": "emp-13",
    "month": "2026-05",
    "attendance": 94,
    "conductedMeetings": 11,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 57237,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-26",
    "employeeId": "emp-13",
    "month": "2026-06",
    "attendance": 93,
    "conductedMeetings": 15,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 44294,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-27",
    "employeeId": "emp-14",
    "month": "2026-05",
    "attendance": 88,
    "conductedMeetings": 23,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 43851,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-28",
    "employeeId": "emp-14",
    "month": "2026-06",
    "attendance": 86,
    "conductedMeetings": 35,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 80807,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-29",
    "employeeId": "emp-15",
    "month": "2026-05",
    "attendance": 88,
    "conductedMeetings": 18,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 11542,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-30",
    "employeeId": "emp-15",
    "month": "2026-06",
    "attendance": 85,
    "conductedMeetings": 20,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 37911,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-31",
    "employeeId": "emp-16",
    "month": "2026-05",
    "attendance": 91,
    "conductedMeetings": 17,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 41217,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-32",
    "employeeId": "emp-16",
    "month": "2026-06",
    "attendance": 94,
    "conductedMeetings": 15,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 70528,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-33",
    "employeeId": "emp-17",
    "month": "2026-05",
    "attendance": 85,
    "conductedMeetings": 24,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 70759,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-34",
    "employeeId": "emp-17",
    "month": "2026-06",
    "attendance": 85,
    "conductedMeetings": 34,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 99938,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-35",
    "employeeId": "emp-18",
    "month": "2026-05",
    "attendance": 88,
    "conductedMeetings": 32,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 33813,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-36",
    "employeeId": "emp-18",
    "month": "2026-06",
    "attendance": 87,
    "conductedMeetings": 35,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 57041,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-37",
    "employeeId": "emp-19",
    "month": "2026-05",
    "attendance": 92,
    "conductedMeetings": 11,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 42373,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-38",
    "employeeId": "emp-19",
    "month": "2026-06",
    "attendance": 99,
    "conductedMeetings": 13,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 51847,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-39",
    "employeeId": "emp-20",
    "month": "2026-05",
    "attendance": 95,
    "conductedMeetings": 13,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 103294,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-40",
    "employeeId": "emp-20",
    "month": "2026-06",
    "attendance": 92,
    "conductedMeetings": 14,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 36339,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-41",
    "employeeId": "emp-21",
    "month": "2026-05",
    "attendance": 99,
    "conductedMeetings": 36,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 36983,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-42",
    "employeeId": "emp-21",
    "month": "2026-06",
    "attendance": 93,
    "conductedMeetings": 29,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 53559,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-43",
    "employeeId": "emp-22",
    "month": "2026-05",
    "attendance": 85,
    "conductedMeetings": 24,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 52878,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-44",
    "employeeId": "emp-22",
    "month": "2026-06",
    "attendance": 97,
    "conductedMeetings": 32,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 36617,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-45",
    "employeeId": "emp-23",
    "month": "2026-05",
    "attendance": 87,
    "conductedMeetings": 31,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 86676,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-46",
    "employeeId": "emp-23",
    "month": "2026-06",
    "attendance": 95,
    "conductedMeetings": 14,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 109416,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-47",
    "employeeId": "emp-24",
    "month": "2026-05",
    "attendance": 91,
    "conductedMeetings": 10,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 64110,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-48",
    "employeeId": "emp-24",
    "month": "2026-06",
    "attendance": 87,
    "conductedMeetings": 22,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 83299,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-49",
    "employeeId": "emp-25",
    "month": "2026-05",
    "attendance": 89,
    "conductedMeetings": 38,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 14769,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-50",
    "employeeId": "emp-25",
    "month": "2026-06",
    "attendance": 85,
    "conductedMeetings": 23,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 24951,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-51",
    "employeeId": "emp-26",
    "month": "2026-05",
    "attendance": 89,
    "conductedMeetings": 20,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 73232,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-52",
    "employeeId": "emp-26",
    "month": "2026-06",
    "attendance": 97,
    "conductedMeetings": 14,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 53921,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-53",
    "employeeId": "emp-27",
    "month": "2026-05",
    "attendance": 89,
    "conductedMeetings": 16,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 74728,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-54",
    "employeeId": "emp-27",
    "month": "2026-06",
    "attendance": 91,
    "conductedMeetings": 29,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 102807,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-55",
    "employeeId": "emp-28",
    "month": "2026-05",
    "attendance": 91,
    "conductedMeetings": 10,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 11787,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-56",
    "employeeId": "emp-28",
    "month": "2026-06",
    "attendance": 95,
    "conductedMeetings": 14,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 44303,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-57",
    "employeeId": "emp-29",
    "month": "2026-05",
    "attendance": 87,
    "conductedMeetings": 24,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 101687,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-58",
    "employeeId": "emp-29",
    "month": "2026-06",
    "attendance": 87,
    "conductedMeetings": 13,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 59918,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-59",
    "employeeId": "emp-30",
    "month": "2026-05",
    "attendance": 91,
    "conductedMeetings": 16,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 58166,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-60",
    "employeeId": "emp-30",
    "month": "2026-06",
    "attendance": 89,
    "conductedMeetings": 33,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 64183,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-61",
    "employeeId": "emp-31",
    "month": "2026-05",
    "attendance": 85,
    "conductedMeetings": 28,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 28464,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-62",
    "employeeId": "emp-31",
    "month": "2026-06",
    "attendance": 99,
    "conductedMeetings": 29,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 16914,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-63",
    "employeeId": "emp-32",
    "month": "2026-05",
    "attendance": 91,
    "conductedMeetings": 28,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 68349,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-64",
    "employeeId": "emp-32",
    "month": "2026-06",
    "attendance": 89,
    "conductedMeetings": 26,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 108153,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-65",
    "employeeId": "emp-33",
    "month": "2026-05",
    "attendance": 95,
    "conductedMeetings": 16,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 83220,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-66",
    "employeeId": "emp-33",
    "month": "2026-06",
    "attendance": 92,
    "conductedMeetings": 26,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 89052,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-67",
    "employeeId": "emp-34",
    "month": "2026-05",
    "attendance": 88,
    "conductedMeetings": 11,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 30240,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-68",
    "employeeId": "emp-34",
    "month": "2026-06",
    "attendance": 95,
    "conductedMeetings": 39,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 88761,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-69",
    "employeeId": "emp-35",
    "month": "2026-05",
    "attendance": 88,
    "conductedMeetings": 27,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 23880,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-70",
    "employeeId": "emp-35",
    "month": "2026-06",
    "attendance": 98,
    "conductedMeetings": 16,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 56220,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-71",
    "employeeId": "emp-36",
    "month": "2026-05",
    "attendance": 88,
    "conductedMeetings": 35,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 75452,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-72",
    "employeeId": "emp-36",
    "month": "2026-06",
    "attendance": 96,
    "conductedMeetings": 38,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 103762,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-73",
    "employeeId": "emp-37",
    "month": "2026-05",
    "attendance": 91,
    "conductedMeetings": 31,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 33422,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-74",
    "employeeId": "emp-37",
    "month": "2026-06",
    "attendance": 85,
    "conductedMeetings": 10,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 59782,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-75",
    "employeeId": "emp-38",
    "month": "2026-05",
    "attendance": 92,
    "conductedMeetings": 20,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 88084,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-76",
    "employeeId": "emp-38",
    "month": "2026-06",
    "attendance": 92,
    "conductedMeetings": 25,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 97281,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-77",
    "employeeId": "emp-39",
    "month": "2026-05",
    "attendance": 87,
    "conductedMeetings": 28,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 72352,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-78",
    "employeeId": "emp-39",
    "month": "2026-06",
    "attendance": 89,
    "conductedMeetings": 22,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 13816,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-79",
    "employeeId": "emp-40",
    "month": "2026-05",
    "attendance": 89,
    "conductedMeetings": 31,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 61063,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-80",
    "employeeId": "emp-40",
    "month": "2026-06",
    "attendance": 96,
    "conductedMeetings": 17,
    "deliveredProjectsAmount": 2,
    "deliveredProjectsValue": 60281,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-81",
    "employeeId": "emp-41",
    "month": "2026-05",
    "attendance": 92,
    "conductedMeetings": 37,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 88321,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-82",
    "employeeId": "emp-41",
    "month": "2026-06",
    "attendance": 97,
    "conductedMeetings": 37,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 49049,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-83",
    "employeeId": "emp-42",
    "month": "2026-05",
    "attendance": 86,
    "conductedMeetings": 25,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 102495,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-84",
    "employeeId": "emp-42",
    "month": "2026-06",
    "attendance": 99,
    "conductedMeetings": 28,
    "deliveredProjectsAmount": 1,
    "deliveredProjectsValue": 30230,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-85",
    "employeeId": "emp-43",
    "month": "2026-05",
    "attendance": 97,
    "conductedMeetings": 14,
    "deliveredProjectsAmount": 4,
    "deliveredProjectsValue": 66620,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-86",
    "employeeId": "emp-43",
    "month": "2026-06",
    "attendance": 97,
    "conductedMeetings": 28,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 77364,
    "updatedAt": "2026-06-28T00:00:00.000Z"
  },
  {
    "id": "perf-87",
    "employeeId": "emp-44",
    "month": "2026-05",
    "attendance": 99,
    "conductedMeetings": 25,
    "deliveredProjectsAmount": 3,
    "deliveredProjectsValue": 68660,
    "updatedAt": "2026-05-28T00:00:00.000Z"
  },
  {
    "id": "perf-88",
    "employeeId": "emp-44",
    "month": "2026-06",
    "attendance": 94,
    "conductedMeetings": 20,
    "deliveredProjectsAmount": 5,
    "deliveredProjectsValue": 54710,
    "updatedAt": "2026-06-28T00:00:00.000Z"
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
  leaveRequests: LeaveRequest[];
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
    targets: initialTargets,
    leaveRequests: initialLeaveRequests
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
        targets: initialTargets,
        leaveRequests: initialLeaveRequests
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
        targets: initialTargets,
        leaveRequests: initialLeaveRequests
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

  public async saveEmployee(emp: Omit<Employee, "id" | "createdAt"> & { id?: string }): Promise<Employee> {
    await this.ensureInitialized();
    const targetId = emp.id && emp.id.trim() ? emp.id.trim() : "emp-" + generateId();

    // Check if duplicate ID exists
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const existing = await this.db.collection("employees").findOne({ id: targetId });
      if (existing) {
        throw new Error(`Employee with ID "${targetId}" already exists in the system.`);
      }
    } else {
      const data = this.readLocal();
      const existing = data.employees.find(e => e.id.toLowerCase() === targetId.toLowerCase());
      if (existing) {
        throw new Error(`Employee with ID "${targetId}" already exists in the system.`);
      }
    }

    const newEmp: Employee = {
      name: emp.name,
      role: emp.role,
      department: emp.department,
      team: emp.team,
      email: emp.email,
      id: targetId,
      active: true,
      leaveBalance: emp.leaveBalance || {
        sickLeaveUsed: 0,
        casualLeaveUsed: 0,
        govFestHolidaysUsed: 0
      },
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
      await this.db.collection("employees").updateOne(
        { id: id },
        { $set: emp }
      );
      const doc = await this.db.collection("employees").findOne({ id: id });
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

  public async deleteEmployee(id: string): Promise<boolean> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const result = await this.db.collection("employees").deleteOne({ id: id });
      // Clean up associated performance records, monthly reports
      await this.db.collection("performance_records").deleteMany({ employeeId: id });
      await this.db.collection("monthly_reports").deleteMany({ employeeId: id });
      return result.deletedCount > 0;
    } else {
      const data = this.readLocal();
      const idx = data.employees.findIndex(e => e.id === id);
      if (idx === -1) return false;
      data.employees.splice(idx, 1);
      
      // Clean up local associated tables too
      data.performance = data.performance.filter(p => p.employeeId !== id);
      data.reports = data.reports.filter(r => r.employeeId !== id);

      this.writeLocal(data);
      return true;
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




  // --- LEAVE REQUESTS API ---
  public async getLeaveRequests(): Promise<LeaveRequest[]> {
    await this.ensureInitialized();
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      const docs = await this.db.collection("leave_requests").find({}).toArray();
      return docs.map(doc => {
        const { _id, ...rest } = doc;
        return { ...rest, id: rest.id || _id.toString() } as LeaveRequest;
      });
    } else {
      const data = this.readLocal();
      return data.leaveRequests || [];
    }
  }

  public async saveLeaveRequest(request: Omit<LeaveRequest, "id">): Promise<LeaveRequest> {
    await this.ensureInitialized();
    const newRequest: LeaveRequest = {
      ...request,
      id: "lr-" + generateId()
    };
    if (this.db && this.dbStatus.connectionType === "mongodb") {
      await this.db.collection("leave_requests").insertOne({ ...newRequest });
    } else {
      const data = this.readLocal();
      if (!data.leaveRequests) data.leaveRequests = [];
      data.leaveRequests.push(newRequest);
      this.writeLocal(data);
    }
    return newRequest;
  }
}

export const dbService = new DatabaseService();
