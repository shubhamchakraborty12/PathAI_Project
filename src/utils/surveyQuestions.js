export const TECH_SURVEY_QUESTIONS = {
  "fullstack-ai": [
    {
      id: "q_ai_1",
      question: "How much experience do you have with Python programming and asynchronous frameworks?",
      options: [
        { label: "No prior Python experience", level: "Beginner", score: 1 },
        { label: "Used basic Python scripts & data structures", level: "Intermediate", score: 2 },
        { label: "Built async APIs using FastAPI/AsyncIO in production", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_ai_2",
      question: "Which statement best describes your experience with Large Language Model APIs (e.g., OpenAI, Claude, LangChain)?",
      options: [
        { label: "Used ChatGPT web app, but never written code with LLM APIs", level: "Beginner", score: 1 },
        { label: "Called OpenAI API endpoints for basic text completion", level: "Intermediate", score: 2 },
        { label: "Architected RAG pipelines, vector DB search, and autonomous agents", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_ai_3",
      question: "What is your proficiency level with React.js frontend development?",
      options: [
        { label: "Basic HTML/CSS or no web dev experience", level: "Beginner", score: 1 },
        { label: "Built component-based React apps with hooks & state", level: "Intermediate", score: 2 },
        { label: "Mastered Next.js, server components, and dynamic UI state", level: "Advanced", score: 3 }
      ]
    }
  ],
  "mern-stack": [
    {
      id: "q_mern_1",
      question: "What is your experience with Node.js backend development & Express.js REST APIs?",
      options: [
        { label: "New to server-side JavaScript programming", level: "Beginner", score: 1 },
        { label: "Built REST API routes with Express and JSON body parsers", level: "Intermediate", score: 2 },
        { label: "Designed async controllers, custom middleware & JWT auth flows", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_mern_2",
      question: "How familiar are you with MongoDB and Mongoose Object Data Modeling (ODM)?",
      options: [
        { label: "Never used MongoDB or NoSQL databases", level: "Beginner", score: 1 },
        { label: "Created collections and performed basic CRUD operations", level: "Intermediate", score: 2 },
        { label: "Architected Mongoose schemas, indexes, & aggregation pipelines", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_mern_3",
      question: "How proficient are you in React.js component state and custom hooks?",
      options: [
        { label: "HTML/CSS baseline or beginner JS", level: "Beginner", score: 1 },
        { label: "Built React apps using useState, useEffect, and Redux/Zustand", level: "Intermediate", score: 2 },
        { label: "Architected production React applications with dynamic state & APIs", level: "Advanced", score: 3 }
      ]
    }
  ],
  "mean-stack": [
    {
      id: "q_mean_1",
      question: "What is your level of experience with TypeScript and Angular framework?",
      options: [
        { label: "No prior experience with Angular or TypeScript", level: "Beginner", score: 1 },
        { label: "Built basic Angular components with data binding & directives", level: "Intermediate", score: 2 },
        { label: "Mastered Angular modules, RxJS observables, services & lazy loading", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_mean_2",
      question: "How comfortable are you with Node.js and Express backend API design?",
      options: [
        { label: "Beginner: Basic HTTP understanding", level: "Beginner", score: 1 },
        { label: "Intermediate: Built Express routes and connected to databases", level: "Intermediate", score: 2 },
        { label: "Advanced: Architected microservices & async middleware", level: "Advanced", score: 3 }
      ]
    }
  ],
  "data-science-ml": [
    {
      id: "q_ds_1",
      question: "What is your level of comfort with Python data libraries like Pandas, NumPy, and SQL queries?",
      options: [
        { label: "Beginner: Worked with Excel or basic spreadsheets", level: "Beginner", score: 1 },
        { label: "Intermediate: Can write SQL JOINs and clean data with Pandas", level: "Intermediate", score: 2 },
        { label: "Advanced: Build complex SQL data pipelines & feature engineering", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_ds_2",
      question: "Have you trained classical machine learning algorithms (e.g. Scikit-learn Random Forests, XGBoost)?",
      options: [
        { label: "No experience with machine learning math or models", level: "Beginner", score: 1 },
        { label: "Trained basic regression & classification models in Jupyter", level: "Intermediate", score: 2 },
        { label: "Implemented cross-validation, hyperparameter tuning & MLOps", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_ds_3",
      question: "What is your familiarity with Deep Learning frameworks like PyTorch or TensorFlow?",
      options: [
        { label: "No experience with neural networks", level: "Beginner", score: 1 },
        { label: "Understood neural network concepts and loss functions", level: "Intermediate", score: 2 },
        { label: "Trained Transformers/CNNs and fine-tuned models on GPUs", level: "Advanced", score: 3 }
      ]
    }
  ],
  "cloud-devops": [
    {
      id: "q_do_1",
      question: "How comfortable are you using Linux command line and shell scripting?",
      options: [
        { label: "Rarely use command line terminals", level: "Beginner", score: 1 },
        { label: "Comfortable with basic Linux commands & file permissions", level: "Intermediate", score: 2 },
        { label: "Write automated Bash/Python automation scripts & cron jobs", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_do_2",
      question: "What is your experience with Docker containerization and Compose?",
      options: [
        { label: "Never built a Docker container image", level: "Beginner", score: 1 },
        { label: "Can write basic Dockerfiles and run Docker Compose", level: "Intermediate", score: 2 },
        { label: "Mastered multi-stage builds, layer optimization & networking", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_do_3",
      question: "Have you managed Kubernetes clusters or Infrastructure-as-Code (Terraform)?",
      options: [
        { label: "No experience with cloud orchestration or IaC", level: "Beginner", score: 1 },
        { label: "Deployed basic manifests on Kubernetes or AWS console", level: "Intermediate", score: 2 },
        { label: "Architected production EKS clusters, CKA level & Terraform IaC", level: "Advanced", score: 3 }
      ]
    }
  ],
  "cybersecurity": [
    {
      id: "q_sec_1",
      question: "What is your understanding of network protocols (TCP/IP, HTTP/S, DNS)?",
      options: [
        { label: "Basic computer user knowledge", level: "Beginner", score: 1 },
        { label: "Understand ports, subnets, packet sniffing & HTTP headers", level: "Intermediate", score: 2 },
        { label: "Perform deep packet analysis, firewall routing & Wireshark captures", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_sec_2",
      question: "Have you performed penetration testing or web application vulnerability audits?",
      options: [
        { label: "No experience with pentesting tools", level: "Beginner", score: 1 },
        { label: "Familiar with OWASP Top 10 and basic vulnerability scanning", level: "Intermediate", score: 2 },
        { label: "Conduct full red team penetration tests using Burp Suite & Metasploit", level: "Advanced", score: 3 }
      ]
    }
  ],
  "frontend-architect": [
    {
      id: "q_fe_1",
      question: "How deep is your knowledge of Modern JavaScript (ES6+), TypeScript & HTML/CSS?",
      options: [
        { label: "Basic HTML/CSS layout creation", level: "Beginner", score: 1 },
        { label: "Comfortable with ES6, DOM manipulation & responsive CSS", level: "Intermediate", score: 2 },
        { label: "Mastered TypeScript generics, async patterns & CSS architecture", level: "Advanced", score: 3 }
      ]
    },
    {
      id: "q_fe_2",
      question: "What is your proficiency level with React / Next.js ecosystem?",
      options: [
        { label: "No experience with modern frontend frameworks", level: "Beginner", score: 1 },
        { label: "Built React single page applications with state hooks", level: "Intermediate", score: 2 },
        { label: "Architected Next.js SSR, custom state management & micro-frontends", level: "Advanced", score: 3 }
      ]
    }
  ]
};
