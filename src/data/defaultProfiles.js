export const PRESET_PERSONAS = [
  {
    id: "persona-alex",
    name: "Alex Chen",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Junior Web Developer",
    targetGoalId: "fullstack-ai",
    bio: "Self-taught web developer seeking to transition into Full-Stack AI engineering and build LLM-powered applications.",
    weeklyHours: 15,
    learningStyle: "hands-on",
    currentSkills: [
      { id: "html-css", name: "HTML5 & CSS3", level: "Advanced" },
      { id: "javascript-ts", name: "JavaScript & TypeScript", level: "Intermediate" },
      { id: "react", name: "React.js", level: "Intermediate" },
      { id: "python", name: "Python Programming", level: "Beginner" }
    ],
    completedResources: ["res-js-101", "res-py-101"]
  },
  {
    id: "persona-priya",
    name: "Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "Senior Data Analyst",
    targetGoalId: "data-science-ml",
    bio: "Data Analyst skilled in SQL and BI tools wanting to pivot to Machine Learning modeling, PyTorch, and Deep Learning.",
    weeklyHours: 10,
    learningStyle: "visual",
    currentSkills: [
      { id: "sql", name: "SQL & Data Warehousing", level: "Advanced" },
      { id: "viz", name: "Data Visualization", level: "Advanced" },
      { id: "python", name: "Python Programming", level: "Intermediate" },
      { id: "math-stats", name: "Linear Algebra & Statistics", level: "Intermediate" },
      { id: "pandas-numpy", name: "Data Manipulation (Pandas)", level: "Intermediate" }
    ],
    completedResources: ["res-py-101", "res-math-101"]
  },
  {
    id: "persona-david",
    name: "David Miller",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Linux SysAdmin",
    targetGoalId: "cloud-devops",
    bio: "System Administrator wanting to master Kubernetes, Terraform, AWS, and build production CI/CD pipelines.",
    weeklyHours: 12,
    learningStyle: "mixed",
    currentSkills: [
      { id: "linux", name: "Linux Administration", level: "Advanced" },
      { id: "networking", name: "TCP/IP & Networking", level: "Advanced" },
      { id: "bash-python", name: "Shell Scripting", level: "Intermediate" },
      { id: "docker", name: "Docker Containerization", level: "Beginner" }
    ],
    completedResources: ["res-docker-101"]
  }
];
