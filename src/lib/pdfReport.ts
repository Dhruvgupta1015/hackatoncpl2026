import { jsPDF } from "jspdf";
import { ResumeAnalysisResult } from "./resumeContext";

const getTechnicalQuestions = (role: string): string[] => {
  if (role.includes("AI") || role.includes("Machine Learning")) {
    return [
      "Explain how Transformers and Attention mechanisms work.",
      "What is the difference between RAG and Fine-tuning?",
      "What are vector databases and how do you calculate cosine similarity?",
      "How do you resolve issues with vanishing gradients?"
    ];
  }
  if (role.includes("Backend")) {
    return [
      "Explain Node.js event loop architecture.",
      "What is database indexing and how does it speed up queries?",
      "How do you handle horizontal scaling and caching in REST APIs?",
      "What are ACID transactions in relational databases?"
    ];
  }
  if (role.includes("Full Stack")) {
    return [
      "Explain the difference between client-side and server-side rendering.",
      "How do you optimize React rendering performance and avoid unnecessary rerenders?",
      "How do you design secure token-based authentication (JWT)?",
      "What is CORS and how do you configure it securely?"
    ];
  }
  if (role.includes("DevOps")) {
    return [
      "Explain the core components of Kubernetes architecture.",
      "What is Infrastructure as Code (IaC) and why use Terraform?",
      "How do you secure a CI/CD pipeline using secrets management?",
      "What is the difference between Docker images and containers?"
    ];
  }
  return [
    "What is React Virtual DOM?",
    "Difference between useState and useEffect?",
    "What is event bubbling in JavaScript?",
    "Explain React Lifecycle."
  ];
};

export function generatePdfReport(result: ResumeAnalysisResult) {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;

  let y = 20;

  // --- PAGE 1: EVALUATION METRICS ---
  
  // Header Background band (Navy/Dark slate)
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 40, "F");

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(6, 182, 212); // cyan-500
  doc.text("SKILLSYNC AI", margin, 18);
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("RESUME EVALUATION & ATS COMPATIBILITY REPORT", margin, 28);
  
  // Date
  const dateStr = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  doc.setFont("helvetica", "normal");
  doc.text(`Generated on: ${dateStr}`, pageWidth - margin - 50, 28);

  y = 50;

  // Candidate Profile Summary Box
  doc.setFillColor(248, 250, 252); // slate-50
  doc.setDrawColor(226, 232, 240); // slate-200
  doc.rect(margin, y, contentWidth, 32, "FD");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Candidate Profile", margin + 6, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105); // slate-600
  doc.text(`Email: ${result.email || "N/A"}`, margin + 6, y + 16);
  doc.text(`Phone: ${result.phone || "N/A"}`, margin + 6, y + 24);

  const col2X = margin + (contentWidth / 2);
  doc.text(`GitHub: ${result.github || "N/A"}`, col2X, y + 16);
  doc.text(`LinkedIn: ${result.linkedin || "N/A"}`, col2X, y + 24);

  y += 42;

  // Overall ATS Score & Subscores Card
  doc.setFillColor(248, 250, 252); // slate-50
  doc.rect(margin, y, contentWidth, 38, "FD");

  // Giant Circle ATS Score representation
  doc.setFillColor(6, 182, 212); // cyan-500
  doc.circle(margin + 20, y + 19, 14, "F");
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(255, 255, 255);
  doc.text(`${result.atsScore}`, margin + 16, y + 21);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text("ATS SCORE", margin + 11, y + 26);

  // Subscores lists
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text("ATS Breakdown", margin + 45, y + 8);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`- Format & Structure:  ${result.subscores.structure}/100`, margin + 45, y + 16);
  doc.text(`- Keyword Optimization:  ${result.subscores.keywords}/100`, margin + 45, y + 24);
  doc.text(`- Action Verbs / Metrics:  ${result.subscores.formatting}/100`, margin + 45, y + 32);

  // Market Demand & Classified Role info
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text("Classified Role Match", col2X + 10, y + 8);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(217, 70, 239); // fuchsia-500
  doc.text(result.role, col2X + 10, y + 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Market Demand Index: ${result.marketDemand}%`, col2X + 10, y + 24);
  doc.text(`Predicted Career Growth: Strong`, col2X + 10, y + 32);

  y += 48;

  // Recruiter Narrative Box
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Recruiter Evaluation & Verdict", margin, y);
  
  y += 5;
  doc.setDrawColor(6, 182, 212); // cyan-500
  doc.setLineWidth(0.5);
  doc.line(margin, y, margin + 40, y);
  
  y += 6;
  doc.setFillColor(240, 253, 250); // teal-50
  doc.setDrawColor(204, 251, 241); // teal-100
  
  const rawNarrative = result.recruiterEvaluation || "Evaluation narrative unavailable.";
  const wrappedLines = doc.splitTextToSize(rawNarrative, contentWidth - 10);
  const boxHeight = (wrappedLines.length * 5) + 10;
  
  doc.rect(margin, y, contentWidth, boxHeight, "FD");
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(15, 23, 42);
  
  let lineY = y + 7;
  wrappedLines.forEach((line: string) => {
    doc.text(line, margin + 5, lineY);
    lineY += 5;
  });

  y += boxHeight + 10;

  // Strengths & Weaknesses Split
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Key Strengths", margin, y);
  doc.text("Identified Weaknesses", col2X, y);

  y += 4;
  doc.setDrawColor(226, 232, 240);
  doc.line(margin, y, margin + 30, y);
  doc.line(col2X, y, col2X + 30, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);

  const numItems = Math.max(result.suggestions.length, result.weaknesses.length);
  let leftY = y;
  let rightY = y;

  result.suggestions.forEach((suggest) => {
    const textLines = doc.splitTextToSize(`+ ${suggest}`, (contentWidth / 2) - 5);
    textLines.forEach((line: string) => {
      doc.text(line, margin, leftY);
      leftY += 5;
    });
  });

  result.weaknesses.forEach((weak) => {
    const textLines = doc.splitTextToSize(`- ${weak}`, (contentWidth / 2) - 5);
    textLines.forEach((line: string) => {
      doc.text(line, col2X, rightY);
      rightY += 5;
    });
  });

  // Footer info Page 1
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184); // slate-400
  doc.text("Page 1 of 2  |  SkillSync AI Platform", margin, pageHeight - 10);
  doc.text("Confidential evaluation report", pageWidth - margin - 40, pageHeight - 10);

  // --- PAGE 2: ROADMAP & INTERVIEW PREP ---
  doc.addPage();
  y = 20;

  // Header Band
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, pageWidth, 35, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(219, 70, 239); // fuchsia-500
  doc.text("SKILLSYNC AI", margin, 15);
  
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text("ACTIONABLE CAREER ROADMAP & INTERVIEW PREPARATION SUMMARY", margin, 24);

  y = 48;

  // Target Role & Missing Skills
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text(`Bridge Your Gaps to: ${result.role}`, margin, y);

  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105);
  
  const skillsStr = result.missingSkills.length > 0 
    ? result.missingSkills.join(", ") 
    : "No critical skill gaps detected. You match standard benchmarks perfectly!";
  
  const wrappedSkills = doc.splitTextToSize(`Missing Gaps: ${skillsStr}`, contentWidth);
  wrappedSkills.forEach((line: string) => {
    doc.text(line, margin, y);
    y += 5;
  });

  y += 5;

  // Actionable Roadmap Timeline
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Personalized Step-by-Step Learning Roadmap", margin, y);

  y += 4;
  doc.setDrawColor(219, 70, 239);
  doc.line(margin, y, margin + 40, y);
  
  y += 6;

  result.roadmap.forEach((phase) => {
    // Phase Card
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, contentWidth, 24, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(15, 23, 42);
    doc.text(`${phase.month}: ${phase.title}`, margin + 5, y + 6);

    // List tasks
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(71, 85, 105);

    let taskY = y + 12;
    phase.tasks.slice(0, 2).forEach((task) => {
      doc.text(`- [${task.type.toUpperCase()}] ${task.title}`, margin + 8, taskY);
      taskY += 5;
    });

    y += 28;
  });

  y += 2;

  // Interview Prep Questions
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(15, 23, 42);
  doc.text("Tailored Mock Interview Prep Questions", margin, y);

  y += 4;
  doc.setDrawColor(15, 23, 42);
  doc.line(margin, y, margin + 40, y);

  y += 6;

  const prepQuestions = getTechnicalQuestions(result.role);
  prepQuestions.forEach((q, idx) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`Q${idx + 1}: ${q}`, margin, y);
    
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text("Tip: Focus on technical structure, real-world examples, and metric-based outcomes in your response.", margin + 6, y);
    
    y += 7;
  });

  // Footer Page 2
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text("Page 2 of 2  |  SkillSync AI Platform", margin, pageHeight - 10);
  doc.text("Elevating technical profiles", pageWidth - margin - 40, pageHeight - 10);

  // Save the PDF
  const filename = `${result.name.replace(/\s+/g, "_")}_evaluation_report.pdf`;
  doc.save(filename);
}
