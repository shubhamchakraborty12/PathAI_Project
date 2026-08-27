export const CAREER_ROLES = [
  {
    id: "product-placement",
    title: "Product Company Placement Track (FAANG / Tier-1)",
    icon: "Award",
    category: "Placement Specialization",
    description: "Master Advanced Data Structures & Algorithms, System Design, and High-Performance Full-Stack Projects for Google, Amazon, Microsoft, and Meta interviews.",
    demand: "Top Tier",
    avgSalary: "$140,000 - $210,000",
    requiredSkills: [
      { id: "dsa-advanced", name: "Data Structures & Algorithms (LeetCode Medium/Hard)", category: "Core CS", importance: "Critical", targetLevel: "Advanced" },
      { id: "system-design", name: "System Design & Microservices Architecture", category: "Architecture", importance: "Critical", targetLevel: "Advanced" },
      { id: "javascript-ts", name: "Modern JavaScript & TypeScript", category: "Languages", importance: "Critical", targetLevel: "Advanced" },
      { id: "react", name: "React.js & Next.js Ecosystem", category: "Frontend", importance: "High", targetLevel: "Advanced" },
      { id: "nodejs-express", name: "Node.js High-Performance APIs", category: "Backend", importance: "High", targetLevel: "Advanced" },
      { id: "db-design", name: "Database Indexing & Caching (Redis/Postgres)", category: "Database", importance: "High", targetLevel: "Intermediate" }
    ]
  },
  {
    id: "service-placement",
    title: "Service Company Placement Track (TCS / Infosys / Wipro)",
    icon: "Building2",
    category: "Placement Specialization",
    description: "Crack aptitude tests, core Computer Science fundamentals (DBMS, OS, Computer Networks), Foundation DSA, and production web stack projects for TCS, Infosys, Accenture, and Wipro.",
    demand: "High Volume",
    avgSalary: "$65,000 - $95,000",
    requiredSkills: [
      { id: "dsa-foundations", name: "DSA & Problem Solving (Array/Strings/Sorting)", category: "Core CS", importance: "Critical", targetLevel: "Intermediate" },
      { id: "cs-fundamentals", name: "DBMS, OS & Computer Networks", category: "Core CS", importance: "Critical", targetLevel: "Advanced" },
      { id: "html-css", name: "HTML5, CSS3 & Web Fundamentals", category: "Frontend", importance: "High", targetLevel: "Intermediate" },
      { id: "javascript-ts", name: "JavaScript & OOP Concepts", category: "Languages", importance: "High", targetLevel: "Intermediate" },
      { id: "sql", name: "SQL Queries & Database Management", category: "Database", importance: "Critical", targetLevel: "Advanced" },
      { id: "aptitude", name: "Quantitative Aptitude & Logical Reasoning", category: "Aptitude", importance: "High", targetLevel: "Intermediate" }
    ]
  },
  {
    id: "fullstack-ai",
    title: "Full-Stack AI Engineer",
    icon: "Cpu",
    category: "Artificial Intelligence",
    description: "Build end-to-end web applications integrated with Large Language Models, AI agents, vector databases, and scalable backend infrastructure.",
    demand: "High",
    avgSalary: "$135,000 - $185,000",
    requiredSkills: [
      { id: "python", name: "Python Programming", category: "Languages", importance: "Critical", targetLevel: "Advanced" },
      { id: "javascript-ts", name: "JavaScript & TypeScript", category: "Languages", importance: "Critical", targetLevel: "Advanced" },
      { id: "react", name: "React.js & Next.js", category: "Frontend", importance: "High", targetLevel: "Advanced" },
      { id: "fastapi", name: "FastAPI & REST/GraphQL", category: "Backend", importance: "High", targetLevel: "Intermediate" },
      { id: "llm-apis", name: "LLM APIs & Prompt Engineering", category: "AI & ML", importance: "Critical", targetLevel: "Advanced" },
      { id: "langchain", name: "LangChain & AI Agents", category: "AI & ML", importance: "High", targetLevel: "Intermediate" },
      { id: "vector-db", name: "Vector Databases (Pinecone / Chroma)", category: "Data", importance: "High", targetLevel: "Intermediate" },
      { id: "docker", name: "Docker & Containerization", category: "DevOps", importance: "Medium", targetLevel: "Intermediate" }
    ]
  },
  {
    id: "mern-stack",
    title: "MERN Stack Developer",
    icon: "Layers",
    category: "Full Stack Web",
    description: "Master modern Full-Stack web application engineering with MongoDB, Express.js, React.js, and Node.js.",
    demand: "Very High",
    avgSalary: "$110,000 - $155,000",
    requiredSkills: [
      { id: "html-css", name: "HTML5, CSS3 & Responsive Design", category: "Frontend", importance: "Critical", targetLevel: "Advanced" },
      { id: "javascript-ts", name: "JavaScript (ES6+) & TypeScript", category: "Languages", importance: "Critical", targetLevel: "Advanced" },
      { id: "nodejs-express", name: "Node.js & Express.js REST APIs", category: "Backend", importance: "Critical", targetLevel: "Advanced" },
      { id: "mongodb", name: "MongoDB & Mongoose ODM", category: "Database", importance: "Critical", targetLevel: "Advanced" },
      { id: "react", name: "React.js Ecosystem & State Management", category: "Frontend", importance: "Critical", targetLevel: "Advanced" },
      { id: "jwt-auth", name: "JWT Auth & Security Middleware", category: "Security", importance: "High", targetLevel: "Intermediate" }
    ]
  },
  {
    id: "mean-stack",
    title: "MEAN Stack Developer",
    icon: "Code2",
    category: "Full Stack Web",
    description: "Build robust enterprise applications using MongoDB, Express.js, Angular, Node.js, and RxJS.",
    demand: "High",
    avgSalary: "$108,000 - $150,000",
    requiredSkills: [
      { id: "javascript-ts", name: "TypeScript & JavaScript", category: "Languages", importance: "Critical", targetLevel: "Advanced" },
      { id: "angular", name: "Angular Framework & RxJS", category: "Frontend", importance: "Critical", targetLevel: "Advanced" },
      { id: "nodejs-express", name: "Node.js & Express.js", category: "Backend", importance: "Critical", targetLevel: "Advanced" },
      { id: "mongodb", name: "MongoDB Database", category: "Database", importance: "Critical", targetLevel: "Advanced" }
    ]
  },
  {
    id: "data-science-ml",
    title: "Data Scientist & ML Specialist",
    icon: "BrainCircuit",
    category: "Data & AI",
    description: "Extract insights from complex data, design machine learning algorithms, train neural networks, and deploy predictive models.",
    demand: "High",
    avgSalary: "$125,000 - $175,000",
    requiredSkills: [
      { id: "python", name: "Python Programming", category: "Languages", importance: "Critical", targetLevel: "Advanced" },
      { id: "math-stats", name: "Linear Algebra & Statistics", category: "Math", importance: "Critical", targetLevel: "Advanced" },
      { id: "pandas-numpy", name: "Data Manipulation (Pandas/NumPy)", category: "Data", importance: "Critical", targetLevel: "Advanced" },
      { id: "scikit-learn", name: "Scikit-Learn & Classical ML", category: "AI & ML", importance: "Critical", targetLevel: "Advanced" },
      { id: "pytorch", name: "PyTorch & Deep Learning", category: "AI & ML", importance: "Critical", targetLevel: "Advanced" },
      { id: "sql", name: "SQL & Data Warehousing", category: "Data", importance: "High", targetLevel: "Advanced" }
    ]
  },
  {
    id: "cloud-devops",
    title: "Cloud DevOps Architect",
    icon: "Cloud",
    category: "Infrastructure",
    description: "Automate CI/CD pipelines, manage Kubernetes clusters, design resilient cloud architectures on AWS/Azure, and enforce Infrastructure-as-Code.",
    demand: "Very High",
    avgSalary: "$130,000 - $180,000",
    requiredSkills: [
      { id: "linux", name: "Linux System Administration", category: "Core", importance: "Critical", targetLevel: "Advanced" },
      { id: "bash-python", name: "Shell Scripting & Python", category: "Languages", importance: "High", targetLevel: "Intermediate" },
      { id: "docker", name: "Docker Containerization", category: "DevOps", importance: "Critical", targetLevel: "Advanced" },
      { id: "k8s", name: "Kubernetes Orchestration", category: "DevOps", importance: "Critical", targetLevel: "Advanced" },
      { id: "terraform", name: "Terraform (IaC)", category: "DevOps", importance: "Critical", targetLevel: "Advanced" },
      { id: "aws", name: "AWS Cloud Services", category: "Cloud", importance: "Critical", targetLevel: "Advanced" }
    ]
  }
];

export const SKILL_LEVELS = [
  { value: "Beginner", label: "Beginner (No or minimal experience)", score: 1 },
  { value: "Intermediate", label: "Intermediate (Hands-on experience, built small projects)", score: 2 },
  { value: "Advanced", label: "Advanced (Production experience, deep expertise)", score: 3 }
];

export const LEARNING_STYLES = [
  { id: "visual", label: "Visual & Video Courses", description: "Learn best with step-by-step videos, diagrams, and video walkthroughs" },
  { id: "hands-on", label: "Hands-on Project Based", description: "Learn best by building real-world projects and writing code directly" },
  { id: "reading", label: "Comprehensive Docs & Books", description: "Learn best with official documentation, books, and architectural articles" },
  { id: "mixed", label: "Balanced Hybrid", description: "A healthy mix of theoretical reading, video courses, and practical capstones" }
];
