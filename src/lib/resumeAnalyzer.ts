const skillDatabase = [
  "React",
  "Node.js",
  "MongoDB",
  "TypeScript",
  "JavaScript",
  "Next.js",
  "TailwindCSS",
  "AWS",
  "Docker",
  "Python",
  "Java",
  "C++",
  "System Design",
  "DSA",
];

export function analyzeResume(resumeText: string) {
  const detectedSkills = skillDatabase.filter((skill) =>
    resumeText.toLowerCase().includes(skill.toLowerCase())
  );

  const requiredSkills = [
    "React",
    "TypeScript",
    "Node.js",
    "MongoDB",
    "System Design",
    "AWS",
    "Docker",
  ];

  const missingSkills = requiredSkills.filter(
    (skill) => !detectedSkills.includes(skill)
  );

  const atsScore = Math.min(
    100,
    Math.round((detectedSkills.length / skillDatabase.length) * 100)
  );

  const skillStrength = Math.round(
    (detectedSkills.length / requiredSkills.length) * 100
  );

  const careerReadiness = Math.round(
    (atsScore + skillStrength) / 2
  );



let role = "General Developer";

if (
  detectedSkills.includes("React") &&
  detectedSkills.includes("TypeScript")
) {
  role = "Frontend Developer";
}

if (
  detectedSkills.includes("Node.js") &&
  detectedSkills.includes("MongoDB")
) {
  role = "Backend Developer";
}

if (
  detectedSkills.includes("React") &&
  detectedSkills.includes("Node.js") &&
  detectedSkills.includes("MongoDB")
) {
  role = "Full Stack Developer";
}

if (
  detectedSkills.includes("Python") &&
  detectedSkills.includes("AWS")
) {
  role = "AI Engineer";
}

let currentSalary = "₹2–4 LPA";
let futureSalary = "₹5–7 LPA";

if (role === "Frontend Developer") {
  currentSalary = "₹4–6 LPA";
  futureSalary = "₹8–12 LPA";
}

if (role === "Backend Developer") {
  currentSalary = "₹5–7 LPA";
  futureSalary = "₹10–14 LPA";
}

if (role === "Full Stack Developer") {
  currentSalary = "₹6–9 LPA";
  futureSalary = "₹12–18 LPA";
}

if (role === "AI Engineer") {
  currentSalary = "₹8–12 LPA";
  futureSalary = "₹15–25 LPA";
}
let marketDemand = 60;
const weaknesses: string[] = [];
const suggestions: string[] = [];
if (!detectedSkills.includes("AWS")) {
  suggestions.push("Add cloud deployment experience (AWS/Vercel)");
}

if (!detectedSkills.includes("Docker")) {
  suggestions.push("Include containerization projects using Docker");
}

if (!detectedSkills.includes("System Design")) {
  suggestions.push("Show architecture or scalability knowledge");
}

if (!detectedSkills.includes("MongoDB")) {
  suggestions.push("Add backend/database-based projects");
}

if (!detectedSkills.includes("DSA")) {
  suggestions.push("Mention coding/problem-solving experience");
}

if (!detectedSkills.includes("AWS")) {
  weaknesses.push("Missing cloud deployment skills");
}

if (!detectedSkills.includes("System Design")) {
  weaknesses.push("Weak system design understanding");
}

if (!detectedSkills.includes("Docker")) {
  weaknesses.push("No containerization knowledge");
}

if (!detectedSkills.includes("MongoDB")) {
  weaknesses.push("Backend database experience missing");
}

if (!detectedSkills.includes("DSA")) {
  weaknesses.push("Problem-solving & DSA not found");
}

if (role === "Frontend Developer") {
  marketDemand = 82;
}

if (role === "Backend Developer") {
  marketDemand = 85;
}

if (role === "Full Stack Developer") {
  marketDemand = 91;
}

if (role === "AI Engineer") {
  marketDemand = 96;
}
return {
  detectedSkills,
  missingSkills,
  atsScore,
  skillStrength,
  careerReadiness,
  role,
  currentSalary,
  futureSalary,
  marketDemand,
  weaknesses,
  suggestions,
};
}