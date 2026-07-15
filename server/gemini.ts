import { GoogleGenAI, Type } from "@google/genai";
import { Employee, PerformanceRecord, MonthlyReport, MonthlyTarget } from "../src/types";

// Initialize GoogleGenAI SDK with fallback safety
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("GoogleGenAI client initialized successfully.");
  } catch (err) {
    console.error("Error initializing GoogleGenAI client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY found or default value detected. Falling back to local AI template generator.");
}

interface GeneratedReportContent {
  summary: string;
  strengths: string[];
  growthOpportunities: string[];
  developmentPlan: string;
}

export async function generateMonthlyPerformanceReport(
  employee: Employee,
  record: PerformanceRecord,
  target?: MonthlyTarget
 ): Promise<Omit<MonthlyReport, "id" | "generatedAt">> {
  const targetAtt = target?.attendanceMin ?? 95;
  const targetVal = target?.projectValueMin ?? 25000;

  const prompt = `
    You are an expert Talent Development Coach and HR Analytics Specialist.
    Please analyze the following employee performance data for the month of ${record.month} and generate a structured performance review & development plan.

    Employee Information:
    - Name: ${employee.name}
    - Role: ${employee.role}
    - Department: ${employee.department}

    Target Expectations for ${record.month} (Manually Set):
    - Minimum Attendance Rate: ${targetAtt}%
    - Minimum Delivered Project Value: $${targetVal.toLocaleString()}

    Actual Performance Metrics for ${record.month}:
    - Attendance Rate: ${record.attendance}% (average attendance rate)
    ${record.totalWorkingDays !== undefined ? `- Total Working Days in Month: ${record.totalWorkingDays} days` : ""}
    ${record.presentDays !== undefined ? `- Days Attended (Present): ${record.presentDays} days` : ""}
    ${record.absentDays !== undefined ? `- Days Absent: ${record.absentDays} days` : ""}
    ${record.leaveDays !== undefined ? `- Approved Leaves / Other Days: ${record.leaveDays} days` : ""}
    - Conducted Meetings: ${record.conductedMeetings}
    - Delivered Projects Amount: ${record.deliveredProjectsAmount} projects
    - Delivered Projects Total Value: $${record.deliveredProjectsValue.toLocaleString()}
    ${record.managerRemarks ? `- Manager Remarks (Qualitative Feedback): "${record.managerRemarks}"` : ""}

    Guidance for analysis:
    - Base their overall performance assessment primarily on these two core metrics: Attendance Rate and Delivered Project Value. Compare actual results directly against the targets (Attendance Target: ${targetAtt}%, Project Value Target: $${targetVal.toLocaleString()}).
    - Focus on data-driven insights. Translate numerical target achievement values (e.g. met, exceeded, or missed) into meaningful talent development assessments.
    - Specifically address whether they met, exceeded, or missed their attendance and project value targets in the synthesis, strengths, or growth opportunities where relevant.
    ${record.managerRemarks ? `- Highly prioritize and incorporate the manager's qualitative feedback/remarks ("${record.managerRemarks}") into your summary/synthesis and action items where applicable.` : ""}
    - Keep the tone highly supportive, constructive, and oriented towards long-term professional development.
  `;

  // Fallback template-based mock if AI is unavailable
  const generateMockReport = (): GeneratedReportContent => {
    const isSales = employee.department.toLowerCase().includes("sales");
    const isEng = employee.department.toLowerCase().includes("eng");
    const isSupport = employee.department.toLowerCase().includes("support") || employee.department.toLowerCase().includes("success");

    let summary = "";
    let strengths: string[] = [];
    let growthOpportunities: string[] = [];
    let developmentPlan = "";

    if (isSales) {
      summary = `${employee.name} demonstrated a strong sales drive this month, conducting ${record.conductedMeetings} meetings and closing $${record.deliveredProjectsValue.toLocaleString()} in project value. This reflects highly productive outreach.`;
      strengths = [
        `Outstanding client acquisition and deal-closing volume of $${record.deliveredProjectsValue.toLocaleString()}`,
        `High engagement frequency with ${record.conductedMeetings} client meetings logged`,
        `Solid attendance of ${record.attendance}% keeping team communications tight`
      ];
      growthOpportunities = [
        "Focus on increasing the conversion value of each individual meeting",
        "Document client feedback themes to refine the product pitch"
      ];
      developmentPlan = "Over the next 30 days, shadow senior accounts and focus on high-value enterprise sales strategies to boost per-project deal sizing.";
    } else if (isEng) {
      summary = `${employee.name} maintained robust technical delivery, shipping ${record.deliveredProjectsAmount} major feature deliverables valued at $${record.deliveredProjectsValue.toLocaleString()}. Their high attendance rate of ${record.attendance}% supported strong sprint pacing.`;
      strengths = [
        `Delivered ${record.deliveredProjectsAmount} high-value software features successfully`,
        `Committed frontend/backend contribution valued at $${record.deliveredProjectsValue.toLocaleString()}`,
        `Excellent attendance of ${record.attendance}%, leading by example in team standups`
      ];
      growthOpportunities = [
        "Improve technical specification writeups to reduce alignment meetings",
        "Consider presenting architectural patterns during core tech-talks"
      ];
      developmentPlan = "Dedicate time in the upcoming sprints to mentor junior developers and drive code quality audits for cross-functional systems.";
    } else {
      summary = `${employee.name} delivered a solid baseline performance for the month. Shipping ${record.deliveredProjectsAmount} service items / projects shows diligent focus and consistent daily operational execution.`;
      strengths = [
        `Completed ${record.deliveredProjectsAmount} operations or support tasks/deliverables`,
        `Active team member conducting ${record.conductedMeetings} collaboration sessions`,
        `Maintained reliable ${record.attendance}% workplace presence`
      ];
      growthOpportunities = [
        "Enhance speed of delivery on critical ticket queues",
        "Streamline standard operating procedures for faster customer onboarding"
      ];
      developmentPlan = "Participate in Customer Journey Mapping exercises to better understand client touchpoints and improve first-touch resolution times.";
    }

    if (record.managerRemarks) {
      summary += ` Note: ${record.managerRemarks}`;
    }

    return { summary, strengths, growthOpportunities, developmentPlan };
  };

  if (!ai) {
    // Return mock generator
    console.log("Using template report generator (no active Gemini client).");
    const mock = generateMockReport();
    return {
      employeeId: employee.id,
      month: record.month,
      ...mock
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: `
          You are a professional HR and Talent Development Coach.
          Your task is to analyze the provided metrics and return a supportive, high-quality monthly review.
          Your response MUST be in raw JSON matching the following structure:
          {
            "summary": "String (2-3 sentences. Dynamic, professional summary)",
            "strengths": ["String", "String", "String"], // Exactly 3 distinct strengths
            "growthOpportunities": ["String", "String"], // Exactly 2 concrete growth/improvement areas
            "developmentPlan": "String (1-2 sentences. Actionable 30-day development goals)"
          }
          Return ONLY the valid JSON block. Do not include markdown codeblocks, just the JSON.
        `,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A professional and supportive 2-3 sentence summary of performance.",
            },
            strengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 3 distinct highlights based on data and role.",
            },
            growthOpportunities: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exactly 2 actionable areas for improvement.",
            },
            developmentPlan: {
              type: Type.STRING,
              description: "A clear 30-day professional growth plan recommendation.",
            }
          },
          required: ["summary", "strengths", "growthOpportunities", "developmentPlan"],
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text from Gemini API.");
    }

    const parsed = JSON.parse(text) as GeneratedReportContent;
    
    return {
      employeeId: employee.id,
      month: record.month,
      summary: parsed.summary,
      strengths: parsed.strengths,
      growthOpportunities: parsed.growthOpportunities,
      developmentPlan: parsed.developmentPlan,
    };
  } catch (error) {
    console.error("Gemini report generation error, falling back to mock:", error);
    const mock = generateMockReport();
    return {
      employeeId: employee.id,
      month: record.month,
      ...mock
    };
  }
}

export async function generateCoPilotResponse(
  employee: Employee,
  record: PerformanceRecord | undefined,
  message: string
): Promise<string> {
  const prompt = `
    You are an expert Talent Success and Leadership Co-Pilot.
    A manager has requested your direct advice, questions, or ideas regarding their employee, ${employee.name}.
    
    Employee context:
    - Name: ${employee.name}
    - Role: ${employee.role}
    - Department: ${employee.department}
    - Team: ${employee.team || "General Team"}
    - Current Salary: $${(employee.salary || 55000).toLocaleString()} / year
    
    Current Month Performance Record:
    ${record ? `- Attendance: ${record.attendance}%
- Meetings Conducted: ${record.conductedMeetings}
- Projects Delivered: ${record.deliveredProjectsAmount}
- Total Generated Value: $${record.deliveredProjectsValue.toLocaleString()}
- Current Qualitative Manager Notes: "${record.managerRemarks || "None entered yet"}"` : "No metrics logged for this employee in the current month."}
    
    Manager's message/question:
    "${message}"
    
    Guidelines:
    - Deliver highly action-oriented, precise, and supportive counsel.
    - Suggest specific items for 1-on-1s, training tracks, or project assignments.
    - Structure your answer beautifully using clean markdown, lists, and bold headings.
    - Be brief but extremely impactful (max 2-3 short, scannable paragraphs).
  `;

  if (!ai) {
    return `**[Aura Co-Pilot offline mode]**\n\nHere are some custom action items for **${employee.name}**:\n\n* **Metrics Improvement**: Schedule a short review to alignment-check their attendance (${record ? record.attendance : 'N/A'}%) and weekly meetings.\n* **Growth Pathway**: Delegate one client-facing or high-value feature task to expand their core competence.\n* **1-on-1 Engagement**: Ask them: *"What is one operational roadblock I can clear for you this week to unlock higher productivity?"*`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });
    return response.text || "No insights could be synthesized. Please try another query.";
  } catch (error) {
    console.error("Co-pilot chat generation error:", error);
    return `**[Co-Pilot Suggestion]**\n\n- Encourage **${employee.name}** to document their core deliverable workflows for the rest of the department.\n- Work together to map out a clear timeline for their upcoming base compensation review.`;
  }
}

export async function generateLeaveSuggestNotes(
  employeeName: string,
  leaveType: string,
  days: number
): Promise<string> {
  const prompt = `
    You are an AI HR assistant.
    An employee or manager is registering a leave request with the following parameters:
    - Employee Name: ${employeeName || "The employee"}
    - Leave Category: ${leaveType} (e.g., Casual, Sick, Gov/Fest, etc.)
    - Duration: ${days} days
    
    Please suggest a professional, concise, and realistic description / remarks notes for this leave.
    Include a polite mention of coverage or medical/personal reason, and how urgent matters can be addressed if appropriate (especially for longer leaves).
    Keep it extremely brief and professional (1-2 sentences max). Do not include any placeholder brackets (like "[Name]") or quotes. Just output the plain text of the suggestion.
  `;

  // Fallback template-based mock if AI is offline
  const getMockSuggestion = (): string => {
    const name = employeeName || "I";
    if (leaveType.toLowerCase().includes("sick")) {
      if (days <= 1) {
        return `Feeling unwell today and need a day off to recover. I will monitor emails occasionally if urgent.`;
      } else {
        return `Taking medical leave for recovery under professional medical advice. Daily check-ins will be handled by the team.`;
      }
    } else if (leaveType.toLowerCase().includes("casual")) {
      if (days <= 2) {
        return `Taking short personal leave for urgent family commitments. Core deliverables are aligned and up to date.`;
      } else {
        return `Planned annual casual leave for personal reasons. Point of contacts are briefed, and I will resume on my return date.`;
      }
    } else {
      return `Observing official holiday/festival break as per the team calendar. Normal operations will resume immediately after the break.`;
    }
  };

  if (!ai) {
    return getMockSuggestion();
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a professional corporate helper. You generate brief, realistic, clean remarks for HR leave records. Output ONLY the remarks string. No intro, no quotes.",
        temperature: 0.7,
      }
    });
    return (response.text || getMockSuggestion()).trim().replace(/^["']|["']$/g, "");
  } catch (error) {
    console.error("Gemini leave suggestion error, falling back to mock:", error);
    return getMockSuggestion();
  }
}


