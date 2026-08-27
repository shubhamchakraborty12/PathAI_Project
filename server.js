import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/pathai_db';

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// ----------------------------------------------------
// MongoDB Atlas Connection
// ----------------------------------------------------


mongoose.set('strictQuery', false);

let cached = globalThis.__mongoose;

if (!cached) {
  cached = globalThis.__mongoose = {
    conn: null,
    promise: null,
    isConnected: false,
    seedPromise: null
  };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI environment variable is not defined.');
  }

  if (cached.promise) {
    return cached.promise;
  }

  cached.promise = mongoose
    .connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    })
    .then(async (mongooseInstance) => {
      cached.conn = mongooseInstance;
      cached.isConnected = true;

      console.log('✅ Connected successfully to MongoDB Atlas!');

      // Seed only once per serverless runtime
      if (!cached.seedPromise) {
        cached.seedPromise = seedDemoUsersIfEmpty().catch((err) => {
          console.warn('Seed warning:', err.message);
        });
      }

      await cached.seedPromise;

      return mongooseInstance;
    })
    .catch((error) => {
      cached.promise = null;
      cached.conn = null;
      cached.isConnected = false;

      console.error('❌ MongoDB connection failed:', error.message);

      throw error;
    });

  return cached.promise;
}
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('Database connection error:', error);

    res.status(503).json({
      error: 'Database connection unavailable.'
    });
  }
});
// ----------------------------------------------------
// Mongoose Schemas & Models
// ----------------------------------------------------
const UserSchema = new mongoose.Schema({
  customId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, default: 'Learner' },
  hasCompletedSurvey: { type: Boolean, default: false },
  targetGoalId: { type: String, default: 'fullstack-ai' },
  weeklyHours: { type: Number, default: 12 },
  learningStyle: { type: String, default: 'hands-on' },
  surveySkills: [
    {
      id: String,
      name: String,
      level: String
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

const WorkspaceSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  profile: { type: Object, default: {} },
  enrolledCourse: { type: Object, default: null },
  completedResources: { type: [String], default: [] },
  chatMessages: { type: [Object], default: [] },
  userStreak: { type: Number, default: 1 },
  dsaStreak: { type: Number, default: 3 },
  isDsaSolvedToday: { type: Boolean, default: false },
  studyLogs: { type: [Object], default: [] },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const Workspace = mongoose.model('Workspace', WorkspaceSchema);

// Initial Demo Users to seed if DB is empty (with bcrypt hashed passwords)
const INITIAL_DEMO_USERS = [
  {
    customId: "user-alex",
    name: "Alex Chen",
    email: "alex@example.com",
    password: bcrypt.hashSync("password123", 10),
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Junior Web Developer",
    hasCompletedSurvey: true,
    targetGoalId: "fullstack-ai",
    weeklyHours: 15,
    learningStyle: "hands-on"
  },
  {
    customId: "user-priya",
    name: "Priya Sharma",
    email: "priya@example.com",
    password: bcrypt.hashSync("password123", 10),
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "Senior Data Analyst",
    hasCompletedSurvey: true,
    targetGoalId: "data-science-ml",
    weeklyHours: 10,
    learningStyle: "visual"
  },
  {
    customId: "user-david",
    name: "David Miller",
    email: "david@example.com",
    password: bcrypt.hashSync("password123", 10),
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Linux SysAdmin",
    hasCompletedSurvey: true,
    targetGoalId: "cloud-devops",
    weeklyHours: 12,
    learningStyle: "mixed"
  }
];

async function seedDemoUsersIfEmpty() {
  try {
    const count = await User.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial demo users into MongoDB Atlas...');
      await User.insertMany(INITIAL_DEMO_USERS);
      console.log('✅ Demo users seeded successfully with encrypted passwords!');
    }
  } catch (err) {
    console.warn('Seed warning:', err.message);
  }
}

// Helper to format user response (excludes password field)
function formatUserResponse(userDoc) {
  return {
    id: userDoc.customId || userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    avatar: userDoc.avatar,
    role: userDoc.role,
    hasCompletedSurvey: userDoc.hasCompletedSurvey,
    targetGoalId: userDoc.targetGoalId,
    weeklyHours: userDoc.weeklyHours,
    learningStyle: userDoc.learningStyle,
    surveySkills: userDoc.surveySkills || []
  };
}

// ----------------------------------------------------
// Express API Routes
// ----------------------------------------------------

// Server Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: cached.isConnected
  ? 'MongoDB Atlas Connected'
  : 'Not connected yet',
    timestamp: new Date()
  });
});

// Get all users (demo listing)
app.get('/api/users/all', async (req, res) => {
  try {
    
    const users = await User.find();
    res.json(users.map(formatUserResponse));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// User Registration Endpoint (MongoDB Atlas with Bcrypt Hashing)
// User Registration Endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Name, email, and password are required.'
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'An account with this email address already exists.'
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const customId = 'user-' + Date.now();

    const newUser = new User({
      customId,
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`,
      role: 'Learner',
      hasCompletedSurvey: false,
      targetGoalId: 'fullstack-ai',
      weeklyHours: 12,
      learningStyle: 'mixed'
    });

    await newUser.save();

    console.log(
      `👤 New user registered in MongoDB Atlas: ${name} (${email})`
    );

    return res.status(201).json({
      user: formatUserResponse(newUser)
    });

  } catch (err) {
    console.error('Registration error:', err);

    res.status(500).json({
      error: err.message || 'Registration failed.'
    });
  }
});
// User Login Endpoint (MongoDB Atlas with Bcrypt Verification)
// User Login Endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Email and password are required.'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email address or password.'
      });
    }

    // Verify bcrypt password
    let isMatch = false;

    if (
      user.password.startsWith('$2a$') ||
      user.password.startsWith('$2b$') ||
      user.password.startsWith('$2y$')
    ) {
      isMatch = await bcrypt.compare(password, user.password);
    } else {
      // Legacy plain-text password support
      isMatch = user.password === password;

      if (isMatch) {
        user.password = await bcrypt.hash(password, 10);
        await user.save();
      }
    }

    if (!isMatch) {
      return res.status(401).json({
        error: 'Invalid email address or password.'
      });
    }

    console.log(
      `🔓 User authenticated via MongoDB Atlas: ${user.name} (${user.email})`
    );

    return res.json({
      user: formatUserResponse(user)
    });

  } catch (err) {
    console.error('Login error:', err);

    res.status(500).json({
      error: err.message || 'Login failed.'
    });
  }
});

// Complete Onboarding Survey & Update Profile (MongoDB Atlas)
// Complete Onboarding Survey & Update Profile
app.put('/api/users/:id/survey', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      targetGoalId,
      weeklyHours,
      learningStyle,
      assessedSkills
    } = req.body;

    const user = await User.findOne({
      $or: [
        { customId: id },
        {
          _id: mongoose.Types.ObjectId.isValid(id)
            ? id
            : null
        }
      ]
    });

    if (!user) {
      return res.status(404).json({
        error: 'User not found.'
      });
    }

    user.hasCompletedSurvey = true;

    if (targetGoalId) {
      user.targetGoalId = targetGoalId;
    }

    if (weeklyHours) {
      user.weeklyHours = weeklyHours;
    }

    if (learningStyle) {
      user.learningStyle = learningStyle;
    }

    if (assessedSkills) {
      user.surveySkills = assessedSkills;
    }

    await user.save();

    console.log(
      `📋 Onboarding survey saved for user: ${user.name}`
    );

    return res.json({
      user: formatUserResponse(user)
    });

  } catch (err) {
    console.error('Survey error:', err);

    res.status(500).json({
      error: err.message
    });
  }
});

// Fetch User Workspace State (MongoDB Atlas)
// Fetch User Workspace State
app.get('/api/workspace/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const workspace = await Workspace.findOne({ userId });

    if (!workspace) {
      return res.status(404).json({
        error: 'Workspace not found'
      });
    }

    return res.json(workspace);

  } catch (err) {
    console.error('Get workspace error:', err);

    res.status(500).json({
      error: err.message
    });
  }
});

// Save User Workspace State (MongoDB Atlas)
// Save User Workspace State
app.post('/api/workspace/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const workspaceData = req.body;

    const updated = await Workspace.findOneAndUpdate(
      { userId },
      {
        ...workspaceData,
        userId,
        updatedAt: new Date()
      },
      {
        upsert: true,
        new: true
      }
    );

    return res.json({
      status: 'saved',
      workspace: updated
    });

  } catch (err) {
    console.error('Save workspace error:', err);

    res.status(500).json({
      error: err.message
    });
  }
});

// ----------------------------------------------------
// Start Server
// ----------------------------------------------------
export default app;
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () => {
    console.log(`🚀 PathAI Express Server running on http://localhost:${PORT}`);
  });
}