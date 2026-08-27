export const COURSE_CATALOG = [
  // Product Placement Courses & DSA
  {
    id: "res-faang-dsa-101",
    skillId: "dsa-advanced",
    title: "FAANG Placement Track: Master 450+ LeetCode DSA Patterns",
    provider: "LeetCode Premium / Striver A2Z DSA",
    type: "Course",
    format: "Video + LeetCode Practice Sheets",
    duration: "45 Hours",
    level: "Advanced",
    rating: 4.98,
    url: "https://leetcode.com/problemset/all/",
    prerequisites: [],
    tags: ["DSA", "FAANG", "LeetCode", "Placement", "Google", "Amazon"],
    description: "Master Arrays, Sliding Window, Trees, Graphs, Dynamic Programming & Backtracking with daily problem practice sessions tailored for Google, Amazon, Meta, and Microsoft.",
    recruiterGuidance: {
      resumeBullet: "Solved 450+ LeetCode Data Structure & Algorithm problems covering DP, Graphs, and System Design with O(N) optimal time complexities.",
      keyHighlights: ["Optimal Time/Space Complexity", "Clean Modular Code", "LeetCode Contest Rating"],
      githubTips: "Maintain a public GitHub repository titled 'leetcode-dsa-solutions' categorized by topic (DP, Graphs, Trees) with explanations for optimal solutions."
    }
  },
  {
    id: "res-sys-design-101",
    skillId: "system-design",
    title: "High Level & Low Level System Design for Product Companies",
    provider: "ByteByteGo / Alex Xu",
    type: "Course",
    format: "Architectural Diagrams + Case Studies",
    duration: "30 Hours",
    level: "Advanced",
    rating: 4.95,
    url: "https://bytebytego.com",
    prerequisites: ["res-faang-dsa-101"],
    tags: ["System Design", "HLD", "LLD", "Scalability", "Microservices", "Redis"],
    description: "Design scalable distributed systems like URL Shortener, Uber backend, WhatsApp chat, Rate Limiters, and Distributed Caching for Tier-1 company interviews.",
    recruiterGuidance: {
      resumeBullet: "Designed microservices architecture for distributed URL Shortener handling 100k requests/sec with Redis caching and PostgreSQL database sharding.",
      keyHighlights: ["Cap Theorem Tradeoffs", "Distributed Caching", "DB Sharding & Load Balancing"],
      githubTips: "Create Mermaid.js sequence diagrams and HLD architecture blueprints in your repo README explaining scalability trade-offs."
    }
  },

  // Service Company Placement Courses
  {
    id: "res-service-prep-101",
    skillId: "dsa-foundations",
    title: "Complete Service Company Placement Prep: TCS NQT, Wipro & Infosys",
    provider: "GeeksforGeeks / PrepInsta",
    type: "Course",
    format: "Video + Mock Online Tests",
    duration: "35 Hours",
    level: "Intermediate",
    rating: 4.85,
    url: "https://www.geeksforgeeks.org",
    prerequisites: [],
    tags: ["Placement", "TCS", "Infosys", "Wipro", "Aptitude", "Core CS"],
    description: "Comprehensive preparation covering Quantitative Aptitude, Logical Reasoning, DBMS SQL queries, Computer Networks, OS fundamentals, and Foundation DSA.",
    recruiterGuidance: {
      resumeBullet: "Aced campus placement technical assessment covering DBMS normalization, SQL joins, OS process synchronization, and core DSA.",
      keyHighlights: ["DBMS Normalization", "SQL Optimization", "Core OS Concepts"],
      githubTips: "Highlight your scored percentile in mock assessment tests and showcase clean SQL scripts in your portfolio."
    }
  },
  {
    id: "res-cs-fund-101",
    skillId: "cs-fundamentals",
    title: "Core Computer Science Crash Course: DBMS, OS & Networks",
    provider: "Gate Smashers / MIT OCW",
    type: "Course",
    format: "Video Lectures + Notes",
    duration: "20 Hours",
    level: "Intermediate",
    rating: 4.9,
    url: "https://www.geeksforgeeks.org/dbms/",
    prerequisites: [],
    tags: ["DBMS", "OS", "Networking", "SQL", "Interview Prep"],
    description: "Master ER Diagrams, Normalization, SQL Joins, Process Scheduling, Deadlocks, Memory Management, and TCP/IP 7-layer OSI models.",
    recruiterGuidance: {
      resumeBullet: "Engineered relational database schema with 3NF normalization and optimized complex SQL query execution time by 40%.",
      keyHighlights: ["ACID Compliance", "TCP/IP Protocol Stack", "Deadlock Prevention"],
      githubTips: "Publish a clean cheat-sheet repository of CS core interview questions with 100+ stars."
    }
  },

  // MERN Stack Courses & Projects
  {
    id: "res-mern-101",
    skillId: "nodejs-express",
    title: "MERN Stack Front to Back: Node.js, Express, React & MongoDB",
    provider: "Udemy / Traversy Media",
    type: "Course",
    format: "Video + Guided Labs",
    duration: "22 Hours",
    level: "Intermediate",
    rating: 4.9,
    url: "https://www.mongodb.com/mern-stack",
    prerequisites: ["res-js-101"],
    tags: ["MERN", "MongoDB", "Express", "React", "Node.js", "Full Stack"],
    description: "Build an in-depth full stack social network application with authentication, JWT tokens, Redux state management, and MongoDB Atlas database.",
    recruiterGuidance: {
      resumeBullet: "Developed full-stack MERN application with JWT authentication, custom Express middleware, and MongoDB Atlas NoSQL data modeling.",
      keyHighlights: ["JWT Authentication", "Custom Middleware", "State Management"],
      githubTips: "Include live demo link hosted on Vercel/Render, Environment Variable sample template (.env.example), and API endpoint documentation."
    }
  },
  {
    id: "res-mern-proj-1",
    skillId: "mongodb",
    title: "Project: Build a Full-Stack MERN E-Commerce Platform with Stripe",
    provider: "freeCodeCamp / GitHub Capstone",
    type: "Project",
    format: "Hands-on Project",
    duration: "25 Hours",
    level: "Advanced",
    rating: 4.95,
    url: "https://github.com",
    prerequisites: ["res-mern-101"],
    tags: ["MERN", "Project", "E-Commerce", "Stripe", "MongoDB", "Tailwind"],
    description: "Architect a production-ready shopping portal featuring product search, cart state management, checkout with Stripe payments, admin order tracking, and JWT auth.",
    recruiterGuidance: {
      resumeBullet: "Engineered production MERN e-commerce platform processing Stripe payments with 100% webhooks integration and admin order analytics.",
      keyHighlights: ["Stripe Webhooks", "Admin Dashboard Analytics", "Role-Based Access Control"],
      githubTips: "Record a 2-minute video walkthrough gif showing user checkout flow and embed it at the top of your GitHub README!"
    }
  },

  // MEAN Stack Courses & Projects
  {
    id: "res-mean-101",
    skillId: "angular",
    title: "MEAN Stack Full Course: Angular, Node.js, Express & MongoDB",
    provider: "Coursera / Maximilian Schwarzmüller",
    type: "Course",
    format: "Video + Hands-on Project",
    duration: "28 Hours",
    level: "Intermediate",
    rating: 4.88,
    url: "https://angular.io/docs",
    prerequisites: ["res-js-101"],
    tags: ["MEAN", "Angular", "TypeScript", "Node.js", "Express", "MongoDB"],
    description: "Build scalable enterprise web applications combining Angular components, RxJS reactive extensions, dependency injection, Node APIs, and MongoDB.",
    recruiterGuidance: {
      resumeBullet: "Built enterprise MEAN stack web app utilizing Angular RxJS reactive streams, TypeScript strong typing, and Express REST microservices.",
      keyHighlights: ["RxJS Observables", "Angular Material UI", "TypeScript Generics"],
      githubTips: "Showcase unit tests written with Jasmine/Karma and modular feature folder organization."
    }
  },

  // Python & Programming Basics
  {
    id: "res-py-101",
    skillId: "python",
    title: "Complete Python Bootcamp: From Zero to Hero",
    provider: "Udemy / Scientific Python",
    type: "Course",
    format: "Video + Exercises",
    duration: "18 Hours",
    level: "Beginner",
    rating: 4.8,
    url: "https://www.python.org/doc/",
    prerequisites: [],
    tags: ["Python", "Fundamentals", "OOP", "Scripts"],
    description: "Master Python fundamentals, data structures, object-oriented programming, and file handling through practical hands-on exercises.",
    recruiterGuidance: {
      resumeBullet: "Automated data extraction and file processing workflows using Python OOP principles, reducing manual execution time by 80%.",
      keyHighlights: ["OOP Encapsulation", "File I/O Automation", "Clean Pythonic Code"],
      githubTips: "Include clean docstrings, PEP-8 compliance formatting, and virtual environment requirements.txt."
    }
  },

  // React & Frontend
  {
    id: "res-react-101",
    skillId: "react",
    title: "React.js 19 - Full Modern Course with Hooks & Context",
    provider: "React Official / Coursera",
    type: "Course",
    format: "Interactive + Labs",
    duration: "20 Hours",
    level: "Intermediate",
    rating: 4.9,
    url: "https://react.dev",
    prerequisites: ["res-js-101"],
    tags: ["React", "JSX", "Hooks", "Custom Hooks", "State Management"],
    description: "Learn state management, side-effects, component composition, custom hooks, performance tuning, and React Server Components.",
    recruiterGuidance: {
      resumeBullet: "Built responsive React SPA utilizing Custom Hooks, Context API state management, and optimized render performance with React.memo.",
      keyHighlights: ["Custom Hooks", "Context API", "Component Reusability"],
      githubTips: "Deploy live preview link via Vercel/Netlify with 100/100 Lighthouse performance score badge."
    }
  },

  // Capstone & Assessment
  {
    id: "res-capstone-ai",
    skillId: "llm-apis",
    title: "Capstone Project: Enterprise AI Knowledge Base Agent",
    provider: "PathAI Portfolio Project",
    type: "Project",
    format: "Real World Portfolio Capstone",
    duration: "25 Hours",
    level: "Advanced",
    rating: 5.0,
    url: "https://github.com",
    prerequisites: ["res-langchain-101", "res-rag-101", "res-react-101"],
    tags: ["Capstone", "Full Stack AI", "LangChain", "Vector DB", "React UI"],
    description: "Architect and launch a multi-tenant AI assistant with file upload semantic ingestion, streaming text replies, and live dashboard metrics.",
    recruiterGuidance: {
      resumeBullet: "Architected Full-Stack AI Assistant using LangChain, RAG with Pinecone Vector DB, and React streaming UI to process 1,000+ document queries.",
      keyHighlights: ["RAG Vector Retrieval", "Streaming WebSockets", "Multi-Tenant Isolation"],
      githubTips: "Include full architectural flow diagram, API documentation, demo video link, and Docker Compose deployment instructions."
    }
  }
];
