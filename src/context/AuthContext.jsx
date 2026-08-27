import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_DEMO_USERS,
  apiFetchAllUsers,
  apiLoginUser,
  apiRegisterUser,
  apiSaveUserSurvey,
  getLocalUser,
  setLocalUser,
  removeLocalUser,
  getLocalWorkspace,
  setLocalWorkspace,
  apiSaveWorkspaceData
} from '../utils/authStorage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState(INITIAL_DEMO_USERS);
  const [currentUser, setCurrentUser] = useState(() => getLocalUser());
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [onboardingSurveyOpen, setOnboardingSurveyOpen] = useState(false);

  // Fetch users from MongoDB Atlas on mount and sync currentUser if logged in
  useEffect(() => {
    let isMounted = true;
    async function loadUsersFromAtlas() {
      const atlasUsers = await apiFetchAllUsers();
      if (Array.isArray(atlasUsers) && atlasUsers.length > 0 && isMounted) {
        setUsers(atlasUsers);
        // Sync currentUser if present
        if (currentUser) {
          const matched = atlasUsers.find(u => u.id === currentUser.id || u.customId === currentUser.id || u.email === currentUser.email);
          if (matched) {
            const syncedUser = { ...currentUser, ...matched };
            setCurrentUser(syncedUser);
            setLocalUser(syncedUser);
          }
        }
      }
    }
    loadUsersFromAtlas();
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (currentUser && !currentUser.hasCompletedSurvey) {
      setOnboardingSurveyOpen(true);
    }
  }, [currentUser]);

  // MongoDB Atlas Login handler
  const login = async (email, password) => {
    const user = await apiLoginUser(email, password);
    setCurrentUser(user);
    setLocalUser(user);
    setAuthModalOpen(false);
    return user;
  };

  // MongoDB Atlas Register handler
  const register = async (name, email, password) => {
    const newUser = await apiRegisterUser(name, email, password);
    setCurrentUser(newUser);
    setLocalUser(newUser);
    setAuthModalOpen(false);
    setOnboardingSurveyOpen(true);

    // Refresh users list from Atlas
    const updatedUsers = await apiFetchAllUsers();
    setUsers(updatedUsers);
    return newUser;
  };

  const quickDemoLogin = (userId) => {
    const demoUser = users.find(u => u.id === userId || u.customId === userId);
    if (demoUser) {
      setCurrentUser(demoUser);
      setLocalUser(demoUser);
      setAuthModalOpen(false);
      if (!demoUser.hasCompletedSurvey) {
        setOnboardingSurveyOpen(true);
      }
    }
  };

  const logout = () => {
    if (currentUser && currentUser.id) {
      const uId = currentUser.id;
      const cached = getLocalWorkspace(uId) || {};
      const updated = { ...cached, chatMessages: [] };
      setLocalWorkspace(uId, updated);
      apiSaveWorkspaceData(uId, updated);
    }
    setCurrentUser(null);
    removeLocalUser();
    setOnboardingSurveyOpen(false);
  };

  const completeOnboardingSurvey = async (surveyData) => {
    if (!currentUser) return;

    const updatedUser = {
      ...currentUser,
      hasCompletedSurvey: true,
      targetGoalId: surveyData.targetGoalId,
      weeklyHours: surveyData.weeklyHours,
      learningStyle: surveyData.learningStyle,
      surveySkills: surveyData.assessedSkills
    };

    setCurrentUser(updatedUser);
    setLocalUser(updatedUser);

    // Sync to MongoDB Atlas
    await apiSaveUserSurvey(currentUser.id, {
      targetGoalId: surveyData.targetGoalId,
      weeklyHours: surveyData.weeklyHours,
      learningStyle: surveyData.learningStyle,
      assessedSkills: surveyData.assessedSkills
    });

    setOnboardingSurveyOpen(false);
    return updatedUser;
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      isAuthenticated: !!currentUser,
      authModalOpen,
      setAuthModalOpen,
      onboardingSurveyOpen,
      setOnboardingSurveyOpen,
      login,
      register,
      quickDemoLogin,
      logout,
      completeOnboardingSurvey
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

