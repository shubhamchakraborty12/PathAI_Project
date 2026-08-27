// Initial Demo Users metadata fallback
export const INITIAL_DEMO_USERS = [
  {
    id: "user-alex",
    customId: "user-alex",
    name: "Alex Chen",
    email: "alex@example.com",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "Junior Web Developer",
    hasCompletedSurvey: true,
    targetGoalId: "fullstack-ai",
    weeklyHours: 15,
    learningStyle: "hands-on"
  },
  {
    id: "user-priya",
    customId: "user-priya",
    name: "Priya Sharma",
    email: "priya@example.com",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    role: "Senior Data Analyst",
    hasCompletedSurvey: true,
    targetGoalId: "data-science-ml",
    weeklyHours: 10,
    learningStyle: "visual"
  },
  {
    id: "user-david",
    customId: "user-david",
    name: "David Miller",
    email: "david@example.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "Linux SysAdmin",
    hasCompletedSurvey: true,
    targetGoalId: "cloud-devops",
    weeklyHours: 12,
    learningStyle: "mixed"
  }
];

// Local Storage Persistence Helpers

export function getLocalUser() {
  try {
    const raw = localStorage.getItem('pathai_current_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn('Failed to parse local user:', e);
    return null;
  }
}

export function setLocalUser(user) {
  try {
    if (user) {
      localStorage.setItem('pathai_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('pathai_current_user');
    }
  } catch (e) {
    console.warn('Failed to set local user:', e);
  }
}

export function removeLocalUser() {
  try {
    localStorage.removeItem('pathai_current_user');
  } catch (e) {
    console.warn('Failed to remove local user:', e);
  }
}

export function getLocalWorkspace(userId) {
  try {
    if (!userId) return null;
    const raw = localStorage.getItem(`pathai_workspace_${userId}`);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.warn(`Failed to parse local workspace for ${userId}:`, e);
    return null;
  }
}

export function setLocalWorkspace(userId, state) {
  try {
    if (userId && state) {
      localStorage.setItem(`pathai_workspace_${userId}`, JSON.stringify(state));
    }
  } catch (e) {
    console.warn(`Failed to save local workspace for ${userId}:`, e);
  }
}

// MongoDB Atlas API Client (With Local Storage Fallback & Caching)

export async function apiFetchAllUsers() {
  try {
    const res = await fetch('/api/users/all');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.warn('MongoDB Atlas fetch users error:', err.message);
  }
  return INITIAL_DEMO_USERS;
}

export async function apiLoginUser(email, password) {
  const res = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Invalid credentials');
  }
  const data = await res.json();
  if (data.user) {
    setLocalUser(data.user);
  }
  return data.user;
}

export async function apiRegisterUser(name, email, password) {
  const res = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.error || 'Registration failed');
  }
  const data = await res.json();
  if (data.user) {
    setLocalUser(data.user);
  }
  return data.user;
}

export async function apiSaveUserSurvey(userId, surveyData) {
  try {
    const res = await fetch(`/api/users/${userId}/survey`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.user) setLocalUser(data.user);
      return data.user;
    }
  } catch (err) {
    console.warn('Failed to sync survey to MongoDB Atlas:', err.message);
  }
  return null;
}

export async function apiFetchWorkspaceData(userId) {
  if (!userId || userId === 'guest') return getLocalWorkspace(userId);
  try {
    const res = await fetch(`/api/workspace/${userId}`);
    if (res.ok) {
      const atlasWorkspace = await res.json();
      if (atlasWorkspace) {
        setLocalWorkspace(userId, atlasWorkspace);
        return atlasWorkspace;
      }
    }
  } catch (err) {
    console.warn(`Failed to fetch workspace for user ${userId} from MongoDB Atlas`, err);
  }
  return getLocalWorkspace(userId);
}

export async function apiSaveWorkspaceData(userId, state) {
  if (!userId || userId === 'guest') return;
  setLocalWorkspace(userId, state);
  try {
    await fetch(`/api/workspace/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state)
    });
  } catch (err) {
    console.warn(`Failed to save workspace for user ${userId} to MongoDB Atlas`, err);
  }
}

