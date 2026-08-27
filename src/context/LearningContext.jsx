import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { useAuth } from './AuthContext';
import { 
  analyzeSkillGaps, 
  generatePersonalizedRoadmap, 
  generateAIChatResponseAsync,
  getGroqApiKey
} from '../utils/aiEngine';
import { 
  apiFetchWorkspaceData,
  apiSaveWorkspaceData,
  getLocalWorkspace
} from '../utils/authStorage';

export function buildWelcomeMessage(userName, targetRoleTitle) {
  const name = userName || 'Learner';
  const role = targetRoleTitle || 'Target Goal';
  return {
    id: "msg-welcome-intro",
    sender: "ai",
    text: `👋 Welcome **${name}**! I am your **PathAI Executive Assistant**.\n\nI have complete access to your user profile, dashboard stats, enrolled courses, and your **${role}** learning roadmap.\n\nHere are some things we can work on together:\n• **Analyze your skill gaps** for your target role\n• **Recommend capstone project ideas** for your portfolio\n• **Estimate time & schedule** to finish your roadmap\n\nHow can I assist your learning journey today?`,
    timestamp: "Just now",
    suggestedActions: [
      { label: "Analyze my skill gaps", action: "QUERY_GAPS" },
      { label: "View Visual Roadmap", action: "NAV_ROADMAP" },
      { label: "Recommend Capstone Project", action: "QUERY_PROJECTS" }
    ]
  };
}

const LearningContext = createContext();

export const LearningProvider = ({ children }) => {
  const { currentUser } = useAuth();

  const userId = currentUser ? currentUser.id : 'guest';

  const defaultUserWorkspace = useMemo(() => {
    if (!currentUser) {
      return {
        profile: {
          id: 'guest',
          name: 'Guest Learner',
          role: 'Visitor',
          targetGoalId: 'fullstack-ai',
          weeklyHours: 12,
          learningStyle: 'hands-on',
          currentSkills: []
        },
        enrolledCourse: null,
        completedResources: [],
        chatMessages: [buildWelcomeMessage('Guest Learner', 'Full-Stack AI Engineer')],
        userStreak: 1,
        dsaStreak: 3,
        isDsaSolvedToday: false,
        studyLogs: [{ date: "Mon", hours: 2 }]
      };
    }

    const defaultSkills = currentUser.surveySkills || [
      { id: "python", name: "Python Programming", level: "Beginner" },
      { id: "javascript-ts", name: "JavaScript & TypeScript", level: "Intermediate" }
    ];

    return {
      profile: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
        role: currentUser.role || 'Learner',
        targetGoalId: currentUser.targetGoalId || 'fullstack-ai',
        bio: `Personalized workspace for ${currentUser.name}`,
        weeklyHours: currentUser.weeklyHours || 12,
        learningStyle: currentUser.learningStyle || 'hands-on',
        currentSkills: defaultSkills
      },
      enrolledCourse: null,
      completedResources: [],
      chatMessages: [
        buildWelcomeMessage(currentUser.name, 'Full-Stack AI Engineer')
      ],
      userStreak: 3,
      dsaStreak: 4,
      isDsaSolvedToday: false,
      studyLogs: [
        { date: "Mon", hours: 2.0 },
        { date: "Tue", hours: 3.5 },
        { date: "Wed", hours: 1.5 },
        { date: "Thu", hours: 4.0 },
        { date: "Fri", hours: 2.5 }
      ]
    };
  }, [currentUser]);

  const [workspaceData, setWorkspaceData] = useState(() => {
    const local = getLocalWorkspace(userId);
    return local ? { ...defaultUserWorkspace, ...local } : defaultUserWorkspace;
  });

  const [isWorkspaceLoaded, setIsWorkspaceLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState(currentUser ? 'dashboard' : 'landing');
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadWorkspaceFromAtlas() {
      setIsWorkspaceLoaded(false);
      const baseState = { ...defaultUserWorkspace };
      const localWorkspace = getLocalWorkspace(userId);

      let initialData = localWorkspace ? {
        ...baseState,
        ...localWorkspace,
        profile: {
          ...baseState.profile,
          ...(localWorkspace.profile || {})
        }
      } : baseState;

      if (currentUser) {
        initialData.profile = {
          ...initialData.profile,
          id: currentUser.id,
          name: currentUser.name,
          avatar: currentUser.avatar || initialData.profile.avatar,
          targetGoalId: initialData.profile.targetGoalId || currentUser.targetGoalId || 'fullstack-ai',
          weeklyHours: initialData.profile.weeklyHours || currentUser.weeklyHours || 12,
          learningStyle: initialData.profile.learningStyle || currentUser.learningStyle || 'hands-on',
          currentSkills: (initialData.profile.currentSkills && initialData.profile.currentSkills.length > 0) 
            ? initialData.profile.currentSkills 
            : (currentUser.surveySkills || [])
        };
        // Preserve active session chat messages on refresh, or initialize welcome intro if empty
        if (!initialData.chatMessages || initialData.chatMessages.length === 0) {
          initialData.chatMessages = [
            buildWelcomeMessage(currentUser.name, initialData.profile.targetGoalId)
          ];
        }
        setActiveTab(prev => prev === 'landing' ? 'dashboard' : prev);
      } else {
        if (!initialData.chatMessages || initialData.chatMessages.length === 0) {
          initialData.chatMessages = [
            buildWelcomeMessage('Guest Learner', 'Full-Stack AI Engineer')
          ];
        }
        setActiveTab('landing');
      }

      if (isMounted) {
        setWorkspaceData(initialData);
      }

      // Load workspace directly from MongoDB Atlas
      if (userId && userId !== 'guest') {
        const atlasWorkspace = await apiFetchWorkspaceData(userId);
        if (atlasWorkspace && isMounted) {
          setWorkspaceData(prev => {
            const mergedProfile = {
              ...(prev.profile || {}),
              ...(atlasWorkspace.profile || {})
            };
            if (currentUser) {
              mergedProfile.id = currentUser.id;
              mergedProfile.name = currentUser.name;
              if (currentUser.avatar) mergedProfile.avatar = currentUser.avatar;
            }

            const existingMessages = (atlasWorkspace.chatMessages && atlasWorkspace.chatMessages.length > 0)
              ? atlasWorkspace.chatMessages
              : (prev.chatMessages && prev.chatMessages.length > 0 ? prev.chatMessages : []);

            const finalChatMessages = existingMessages.length > 0
              ? existingMessages
              : [buildWelcomeMessage(currentUser ? currentUser.name : 'Guest Learner', mergedProfile.targetGoalId || 'fullstack-ai')];

            return {
              ...prev,
              ...atlasWorkspace,
              profile: mergedProfile,
              chatMessages: finalChatMessages
            };
          });
        }
      }

      if (isMounted) {
        setIsWorkspaceLoaded(true);
      }
    }

    loadWorkspaceFromAtlas();

    return () => { isMounted = false; };
  }, [userId, currentUser]);

  useEffect(() => {
    if (isWorkspaceLoaded && userId && userId !== 'guest') {
      apiSaveWorkspaceData(userId, workspaceData);
    }
  }, [workspaceData, userId, isWorkspaceLoaded]);

  const effectiveProfile = useMemo(() => {
    const rawProfile = workspaceData.profile || {};
    if (currentUser) {
      return {
        ...rawProfile,
        id: currentUser.id,
        name: currentUser.name || rawProfile.name || 'Learner',
        avatar: currentUser.avatar || rawProfile.avatar,
        role: currentUser.role || rawProfile.role || 'Learner',
        targetGoalId: rawProfile.targetGoalId || currentUser.targetGoalId || 'fullstack-ai',
        weeklyHours: rawProfile.weeklyHours || currentUser.weeklyHours || 12,
        learningStyle: rawProfile.learningStyle || currentUser.learningStyle || 'hands-on',
        currentSkills: (rawProfile.currentSkills && rawProfile.currentSkills.length > 0)
          ? rawProfile.currentSkills
          : (currentUser.surveySkills || [])
      };
    }
    return rawProfile;
  }, [workspaceData.profile, currentUser]);

  const { enrolledCourse, completedResources, chatMessages, userStreak, dsaStreak, isDsaSolvedToday, studyLogs } = workspaceData;

  const profile = effectiveProfile;

  const setProfile = (newProfile) => {
    setWorkspaceData(prev => ({
      ...prev,
      profile: typeof newProfile === 'function' ? newProfile(prev.profile) : newProfile
    }));
  };

  const enrollInCourse = (course) => {
    let newGoalId = profile.targetGoalId;
    if (course.id.includes('faang') || course.tags?.includes('FAANG') || course.tags?.includes('DSA')) {
      newGoalId = 'product-placement';
    } else if (course.id.includes('service') || course.tags?.includes('CS Fundamentals') || course.tags?.includes('DBMS')) {
      newGoalId = 'service-placement';
    } else if (course.id.includes('mern') || course.tags?.includes('React') || course.tags?.includes('Node.js')) {
      newGoalId = 'mern-stack';
    } else if (course.id.includes('mean') || course.tags?.includes('Angular')) {
      newGoalId = 'mean-stack';
    } else if (course.id.includes('data') || course.id.includes('ml') || course.tags?.includes('Machine Learning') || course.tags?.includes('Python')) {
      newGoalId = 'data-science-ml';
    } else if (course.id.includes('devops') || course.id.includes('cloud') || course.tags?.includes('Docker') || course.tags?.includes('Kubernetes')) {
      newGoalId = 'cloud-devops';
    } else if (course.id.includes('ai') || course.tags?.includes('LangChain') || course.tags?.includes('LLM')) {
      newGoalId = 'fullstack-ai';
    }

    setWorkspaceData(prev => ({
      ...prev,
      enrolledCourse: course,
      profile: {
        ...prev.profile,
        targetGoalId: newGoalId
      }
    }));

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const markDsaSolved = () => {
    setWorkspaceData(prev => {
      const isSolved = !prev.isDsaSolvedToday;
      return {
        ...prev,
        isDsaSolvedToday: isSolved,
        dsaStreak: isSolved ? prev.dsaStreak + 1 : Math.max(1, prev.dsaStreak - 1)
      };
    });
  };

  const gapResult = useMemo(() => {
    return analyzeSkillGaps(profile.currentSkills, profile.targetGoalId);
  }, [profile.currentSkills, profile.targetGoalId]);

  const activeRoadmap = useMemo(() => {
    return generatePersonalizedRoadmap(profile, completedResources);
  }, [profile, completedResources]);

  const toggleResourceCompletion = (resourceId) => {
    setWorkspaceData(prev => {
      const isCompleted = prev.completedResources.includes(resourceId);
      const updatedList = isCompleted 
        ? prev.completedResources.filter(id => id !== resourceId) 
        : [...prev.completedResources, resourceId];

      if (!isCompleted) {
        confetti({
          particleCount: 70,
          spread: 65,
          origin: { y: 0.7 }
        });
      }

      return {
        ...prev,
        completedResources: updatedList
      };
    });
  };

  const updateTargetGoal = (goalId) => {
    setProfile(prev => ({ ...prev, targetGoalId: goalId }));
  };

  const updateCurrentSkills = (skillsArray) => {
    setProfile(prev => ({ ...prev, currentSkills: skillsArray }));
  };

  const updatePreferences = (weeklyHours, learningStyle) => {
    setProfile(prev => ({ ...prev, weeklyHours, learningStyle }));
  };

  const sendChatMessage = async (userText) => {
    const userMsg = {
      id: "msg-u-" + Date.now(),
      sender: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    let updatedHistory = [];
    setWorkspaceData(prev => {
      const baseHistory = (prev.chatMessages && prev.chatMessages.length > 0)
        ? prev.chatMessages
        : [buildWelcomeMessage(profile.name, gapResult.targetRole.title)];
      updatedHistory = [...baseHistory, userMsg];
      return {
        ...prev,
        chatMessages: updatedHistory
      };
    });

    try {
      const apiKey = getGroqApiKey();
      const aiReply = await generateAIChatResponseAsync(
        userText,
        {
          targetRole: gapResult.targetRole,
          gapResult,
          activeRoadmap,
          profile,
          enrolledCourse,
          userStreak,
          dsaStreak,
          isDsaSolvedToday,
          studyLogs,
          completedResources,
          chatMessages: updatedHistory
        },
        apiKey
      );

      setWorkspaceData(prev => ({
        ...prev,
        chatMessages: [...prev.chatMessages, aiReply]
      }));
    } catch (error) {
      console.error("Error generating AI response:", error);
    }
  };

  const resetChat = () => {
    const welcome = buildWelcomeMessage(currentUser?.name || profile.name, gapResult.targetRole.title);
    setWorkspaceData(prev => ({
      ...prev,
      chatMessages: [welcome]
    }));
  };

  const handleSuggestedAction = (action) => {
    if (action === 'NAV_ROADMAP') {
      setActiveTab('roadmap');
    } else if (action === 'NAV_PROFILE') {
      setActiveTab('profile');
    } else if (action === 'QUERY_GAPS') {
      sendChatMessage("Can you explain my skill gaps for my target role?");
    } else if (action === 'QUERY_TIME') {
      sendChatMessage("How many weeks will it take to finish this roadmap?");
    } else if (action === 'QUERY_PROJECTS') {
      sendChatMessage("Recommend a capstone project idea for my portfolio.");
    } else if (action === 'ADD_CAPSTONE') {
      toggleResourceCompletion('res-capstone-ai');
      sendChatMessage("Added the Capstone project to your active roadmap tracking!");
    }
  };

  return (
    <LearningContext.Provider value={{
      profile,
      setProfile,
      enrolledCourse,
      enrollInCourse,
      dsaStreak,
      isDsaSolvedToday,
      markDsaSolved,
      gapResult,
      activeRoadmap,
      completedResources,
      toggleResourceCompletion,
      activeTab,
      setActiveTab,
      updateTargetGoal,
      updateCurrentSkills,
      updatePreferences,
      chatMessages,
      sendChatMessage,
      resetChat,
      handleSuggestedAction,
      diagnosticOpen,
      setDiagnosticOpen,
      userStreak,
      studyLogs
    }}>
      {children}
    </LearningContext.Provider>
  );
};

export const useLearning = () => useContext(LearningContext);

