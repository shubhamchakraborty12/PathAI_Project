import { CAREER_ROLES } from '../data/skillTaxonomy';
import { COURSE_CATALOG } from '../data/courseCatalog';

/**
 * Perform a detailed skill-gap analysis comparing current user skills against target role requirements.
 */
export function analyzeSkillGaps(currentSkills = [], targetRoleId = 'fullstack-ai') {
  const targetRole = CAREER_ROLES.find(r => r.id === targetRoleId) || CAREER_ROLES[0];
  
  const userSkillMap = new Map();
  currentSkills.forEach(s => {
    const levelScore = s.level === 'Advanced' ? 3 : s.level === 'Intermediate' ? 2 : 1;
    userSkillMap.set(s.id, { level: s.level, score: levelScore });
  });

  const gapAnalysis = targetRole.requiredSkills.map(reqSkill => {
    const userSkill = userSkillMap.get(reqSkill.id);
    const userScore = userSkill ? userSkill.score : 0;
    const targetScore = reqSkill.targetLevel === 'Advanced' ? 3 : reqSkill.targetLevel === 'Intermediate' ? 2 : 1;
    const gapScore = Math.max(0, targetScore - userScore);
    
    let status = 'Missing';
    if (userScore >= targetScore) {
      status = 'Mastered';
    } else if (userScore > 0) {
      status = 'Needs Improvement';
    }

    return {
      ...reqSkill,
      currentLevel: userSkill ? userSkill.level : 'None',
      userScore,
      targetScore,
      gapScore,
      status
    };
  });

  const totalRequired = targetRole.requiredSkills.length;
  const masteredCount = gapAnalysis.filter(g => g.status === 'Mastered').length;
  const gapPercentage = Math.round(((totalRequired - masteredCount) / totalRequired) * 100);

  return {
    targetRole,
    gapAnalysis,
    masteredCount,
    totalRequired,
    readinessPercentage: 100 - gapPercentage
  };
}

/**
 * Generate a personalized learning roadmap with phases, milestones, and prerequisites based on learner profile.
 */
export function generatePersonalizedRoadmap(profile = {}, completedResourceIds = []) {
  const safeProfile = profile || {};
  const { targetGoalId = 'fullstack-ai', currentSkills = [], weeklyHours = 12, learningStyle = 'mixed' } = safeProfile;
  const gapResult = analyzeSkillGaps(currentSkills, targetGoalId);
  const { gapAnalysis, targetRole } = gapResult;

  const relevantSkillIds = new Set(targetRole.requiredSkills.map(s => s.id));
  let candidateResources = COURSE_CATALOG.filter(res => relevantSkillIds.has(res.skillId));

  if (learningStyle === 'visual') {
    candidateResources.sort((a, b) => (b.format.includes('Video') ? 1 : 0) - (a.format.includes('Video') ? 1 : 0));
  } else if (learningStyle === 'hands-on') {
    candidateResources.sort((a, b) => (b.type === 'Project' ? 1 : 0) - (a.type === 'Project' ? 1 : 0));
  }

  const phases = [
    {
      id: "phase-1",
      phaseNumber: 1,
      title: "Foundations & Baseline Prerequisites",
      subtitle: "Address critical missing baseline skills to establish core fundamentals",
      badgeColor: "emerald",
      items: []
    },
    {
      id: "phase-2",
      phaseNumber: 2,
      title: "Core Domain Mastery",
      subtitle: "Deep-dive into essential frameworks, tools, and algorithms for " + targetRole.title,
      badgeColor: "indigo",
      items: []
    },
    {
      id: "phase-3",
      phaseNumber: 3,
      title: "Advanced Specialization & Infrastructure",
      subtitle: "Master high-level architecture, evaluation, MLOps/DevOps & production tooling",
      badgeColor: "purple",
      items: []
    },
    {
      id: "phase-4",
      phaseNumber: 4,
      title: "Applied Capstone & Portfolio Readiness",
      subtitle: "Build end-to-end real world capstone project and validate competencies",
      badgeColor: "amber",
      items: []
    }
  ];

  let totalDurationHours = 0;

  candidateResources.forEach(resource => {
    const gapInfo = gapAnalysis.find(g => g.id === resource.skillId);
    if (!gapInfo) return;

    const isMastered = gapInfo.status === 'Mastered';
    const isCompleted = completedResourceIds.includes(resource.id) || isMastered;

    const rationale = generateAIRationale(resource, gapInfo, profile);

    const hoursMatch = resource.duration.match(/\d+/);
    const durationHours = hoursMatch ? parseInt(hoursMatch[0], 10) : 10;
    if (!isCompleted) {
      totalDurationHours += durationHours;
    }

    const roadmapItem = {
      ...resource,
      completed: isCompleted,
      durationHours,
      skillGapInfo: gapInfo,
      aiRationale: rationale
    };

    if (resource.type === 'Project' && resource.level === 'Advanced') {
      phases[3].items.push(roadmapItem);
    } else if (resource.level === 'Beginner' || gapInfo.status === 'Missing' && resource.level !== 'Advanced') {
      phases[0].items.push(roadmapItem);
    } else if (resource.level === 'Intermediate') {
      phases[1].items.push(roadmapItem);
    } else {
      phases[2].items.push(roadmapItem);
    }
  });

  const estimatedWeeks = Math.ceil(totalDurationHours / Math.max(1, weeklyHours));

  return {
    targetRole,
    gapResult,
    phases,
    totalDurationHours,
    estimatedWeeks,
    totalResourcesCount: candidateResources.length,
    completedResourcesCount: candidateResources.filter(r => completedResourceIds.includes(r.id)).length
  };
}

function generateAIRationale(resource, gapInfo, profile) {
  const reasons = [];

  if (gapInfo.status === 'Missing') {
    reasons.push(`Identified a critical skill gap in ${gapInfo.name} (Target level: ${gapInfo.targetLevel}).`);
  } else if (gapInfo.status === 'Needs Improvement') {
    reasons.push(`Upgrades your current level (${gapInfo.currentLevel}) to required target (${gapInfo.targetLevel}).`);
  } else {
    reasons.push(`Refreshes and solidifies existing expertise in ${gapInfo.name}.`);
  }

  if (profile.learningStyle === 'hands-on' && resource.type === 'Project') {
    reasons.push(`Matches your preferred Hands-on learning style with real-world repository building.`);
  } else if (profile.learningStyle === 'visual' && resource.format.includes('Video')) {
    reasons.push(`Tailored to your preference for Visual & Video-based learning formats.`);
  }

  return {
    primaryReason: reasons[0] || `Fulfills core competency requirement for ${gapInfo.name}.`,
    allReasons: reasons,
    relevanceScore: gapInfo.importance === 'Critical' ? 98 : gapInfo.importance === 'High' ? 92 : 85
  };
}

/**
 * Helper utility to retrieve Groq API Key from environment variables (import.meta.env.VITE_GROQ_API_KEY).
 */
export function getGroqApiKey() {
  return (import.meta && import.meta.env && import.meta.env.VITE_GROQ_API_KEY) || '';
}

/**
 * Convert any tabular pipe/tab data into humanized, well-aligned bullet points.
 */
export function convertTablesToHumanizedPoints(text) {
  if (!text || typeof text !== 'string') return '';

  const cleanText = text.replace(/<br\s*\/?>/gi, '\n');
  const lines = cleanText.split('\n');
  const outputLines = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i].trim();

    const isPipeLine = line.includes('|') && line.split('|').filter(c => c.trim()).length >= 2;
    const isTabLine = line.includes('\t') && line.split('\t').filter(c => c.trim()).length >= 2;

    if (isPipeLine || isTabLine) {
      const tableLines = [];
      while (i < lines.length) {
        const l = lines[i].trim();
        const pCount = l.split('|').filter(c => c.trim()).length;
        const tCount = l.split('\t').filter(c => c.trim()).length;
        if (!l || (pCount < 2 && tCount < 2 && !/^\|?[\s:\-|\+]+\|?$/.test(l))) break;
        tableLines.push(l);
        i++;
      }

      const rawRows = [];
      for (const tLine of tableLines) {
        if (/^\|?[\s:\-|\+]+\|?$/.test(tLine)) continue;
        let cells = [];
        if (tLine.includes('|')) {
          cells = tLine.split('|').map(c => c.trim());
          if (cells.length > 0 && cells[0] === '') cells.shift();
          if (cells.length > 0 && cells[cells.length - 1] === '') cells.pop();
        } else if (tLine.includes('\t')) {
          cells = tLine.split('\t').map(c => c.trim()).filter(Boolean);
        }
        if (cells.length >= 2) rawRows.push(cells);
      }

      if (rawRows.length > 0) {
        const headers = rawRows[0].map(h => h.replace(/<[^>]+>/g, '').trim());
        const rows = rawRows.slice(1);

        rows.forEach(rowCells => {
          if (rowCells.length === 0) return;

          const title = rowCells[0].replace(/<[^>]+>/g, '').replace(/^[•\-]\s*/, '').trim();
          outputLines.push(`**${title}**`);

          for (let colIdx = 1; colIdx < rowCells.length; colIdx++) {
            const cellVal = rowCells[colIdx].replace(/<[^>]+>/g, '').trim();
            if (!cellVal) continue;

            const label = headers[colIdx] || `Detail`;
            const subItems = cellVal.split('\n').map(s => s.trim()).filter(Boolean);

            if (subItems.length > 1) {
              outputLines.push(`• **${label}**:`);
              subItems.forEach(sub => {
                const subClean = sub.replace(/^[•\-]\s*/, '');
                outputLines.push(`  • ${subClean}`);
              });
            } else {
              const singleClean = cellVal.replace(/^[•\-]\s*/, '');
              outputLines.push(`• **${label}**: ${singleClean}`);
            }
          }
          outputLines.push('');
        });
      }
    } else {
      outputLines.push(lines[i]);
      i++;
    }
  }

  return outputLines.join('\n');
}

/**
 * Clean up redundant symbols, raw hashtags, robotic filler, and sanitize AI text.
 */
export function humanizeAndCleanResponseText(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';

  let cleaned = rawText;

  // 1. Convert any tabular markdown/tab data into humanized bullet points
  cleaned = convertTablesToHumanizedPoints(cleaned);

  // 2. Remove robotic introductory filler phrases
  cleaned = cleaned.replace(/^(as an ai (language model|assistant|learning assistant),?|here (is|are) (a|your) (detailed|tailored|requested)? (analysis|response|breakdown|roadmap):?)/gi, '');

  // 3. Convert markdown headers like ### Header or ## Header into clean **Header**
  cleaned = cleaned.replace(/^#{1,6}\s*(.+)$/gm, '**$1**');

  // 4. Remove excessive or redundant asterisks like ****bold**** or ***italic***
  cleaned = cleaned.replace(/\*{3,}/g, '**');

  // 5. Standardize bullet points outside tables
  const lines = cleaned.split('\n');
  const processedLines = lines.map(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('|')) {
      return line;
    }
    return line.replace(/^[ \t]*[*•-][ \t]+/g, '• ');
  });
  cleaned = processedLines.join('\n');

  // 6. Clean up multiple empty newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  return cleaned.trim();
}

/**
 * Perform direct API call to Groq Cloud OpenAI-compatible completions endpoint
 * passing complete user profile and dashboard context in system prompt.
 */
export async function fetchGroqChatCompletion(userMessage, currentContext, apiKey) {
  const { targetRole, gapResult, activeRoadmap, profile, enrolledCourse, userStreak, dsaStreak, isDsaSolvedToday, studyLogs, chatMessages } = currentContext;

  const missingSkills = gapResult?.gapAnalysis?.filter(g => g.status !== 'Mastered') || [];
  const masteredSkills = gapResult?.gapAnalysis?.filter(g => g.status === 'Mastered') || [];

  let nextUpResource = null;
  if (activeRoadmap?.phases) {
    for (const phase of activeRoadmap.phases) {
      for (const item of phase.items) {
        if (!item.completed) {
          nextUpResource = item;
          break;
        }
      }
      if (nextUpResource) break;
    }
  }

  const studyLogSummary = studyLogs ? studyLogs.map(l => `${l.date}: ${l.hours}h`).join(', ') : 'N/A';

  const systemPrompt = `You are PathAI, an executive tech career mentor.
Tone: Warm, conversational, highly encouraging, and natural — write like an experienced engineering lead speaking directly to a colleague.

FORMATTING & STYLE RULES:
- Write in clean, natural human language without clutter or redundant symbols.
- STRICT NO-TABLE RULE: Do NOT format your response as Markdown tables or pipe tables (| Header | Header |).
- Summarize all topics, Pillars, concepts, and comparisons into clean, humanized bullet point sections with bold category headers (**Section Name**) and bullet points with proper alignment.
- DO NOT use robotic introductory filler (e.g. "As an AI...", "Here is your requested analysis:").
- DO NOT use markdown hashtag headers (###, ##). Use bold titles (**Section Name**).
- DO NOT include raw HTML tags like <br> or <span> in responses.
- Seamlessly integrate the learner's dashboard data (${profile?.name || 'Learner'}, ${gapResult?.readinessPercentage || 0}% readiness score, target goal ${targetRole?.title}, ${userStreak || 1}-day streak, enrolled course: ${enrolledCourse ? enrolledCourse.title : 'None'}).

### USER DASHBOARD DATA:
- **Learner**: ${profile?.name || 'Learner'}
- **Target Role**: ${targetRole?.title || 'Tech Specialist'} (${targetRole?.description || ''})
- **Readiness Score**: ${gapResult?.readinessPercentage || 0}%
- **Enrolled Course**: ${enrolledCourse ? enrolledCourse.title : 'None enrolled yet'}
- **Weekly Bandwidth**: ${profile?.weeklyHours || 12} hours/week
- **Learning Style**: ${profile?.learningStyle || 'hands-on'}
- **Daily Streak**: ${userStreak || 1} days | DSA Streak: ${dsaStreak || 1} days (Solved today: ${isDsaSolvedToday ? 'Yes' : 'No'})
- **Recent Study Hours**: ${studyLogSummary}

### SKILL MATRIX & GAPS:
- **Mastered Skills**: ${masteredSkills.map(m => m.name).join(', ') || 'None yet'}
- **Gaps to Address**:
${missingSkills.map(m => `  • ${m.name} (Current: ${m.currentLevel} ➔ Target: ${m.targetLevel}, Priority: ${m.importance})`).join('\n')}

### ROADMAP PROGRESS:
- **Milestones**: ${activeRoadmap?.completedResourcesCount || 0} / ${activeRoadmap?.totalResourcesCount || 0} completed (~${activeRoadmap?.estimatedWeeks || 0} weeks left at ${profile?.weeklyHours || 12} hrs/week)
- **Next Milestone**: ${nextUpResource ? `${nextUpResource.title} (${nextUpResource.type})` : 'All roadmap items completed!'}`;

  const conversation = [
    { role: 'system', content: systemPrompt }
  ];

  if (Array.isArray(chatMessages)) {
    const recent = chatMessages.slice(-4);
    recent.forEach(msg => {
      if (msg.sender === 'user') {
        conversation.push({ role: 'user', content: msg.text });
      } else if (msg.sender === 'ai' && !msg.isError) {
        conversation.push({ role: 'assistant', content: msg.text });
      }
    });
  }

  const lastMsg = conversation[conversation.length - 1];
  if (!lastMsg || lastMsg.role !== 'user' || lastMsg.content !== userMessage) {
    conversation.push({ role: 'user', content: userMessage });
  }

  const candidateModels = [
    'openai/gpt-oss-120b',
    'qwen/qwen3.6-27b',
    'openai/gpt-oss-20b',
    'llama3-70b-8192',
    'llama3-8b-8192',
    'mixtral-8x7b-32768'
  ];

  let successfulData = null;
  let usedModel = '';
  let lastError = null;

  for (const model of candidateModels) {
    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: conversation,
          temperature: 0.7,
          max_tokens: 1024
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        lastError = new Error(`Groq API request failed (${model}) with status ${response.status}: ${errorText}`);
        if (response.status === 404) {
          console.warn(`Groq model ${model} not available (404), trying next model...`);
          continue;
        }
        throw lastError;
      }

      successfulData = await response.json();
      usedModel = model;
      break;
    } catch (err) {
      lastError = err;
      if (err.message && err.message.includes('404')) {
        continue;
      }
      throw err;
    }
  }

  if (!successfulData) {
    throw lastError || new Error('All candidate Groq AI models failed');
  }

  const rawReplyContent = successfulData.choices && successfulData.choices[0] && successfulData.choices[0].message ? successfulData.choices[0].message.content : '';

  if (!rawReplyContent) {
    throw new Error('Received empty response content from Groq API');
  }

  const replyContent = humanizeAndCleanResponseText(rawReplyContent);

  const queryLower = userMessage.toLowerCase();
  const replyLower = replyContent.toLowerCase();
  const suggestedActions = [];

  if (queryLower.includes('gap') || queryLower.includes('skill') || replyLower.includes('skill gap')) {
    suggestedActions.push({ label: "View Gap Matrix", action: "NAV_PROFILE" });
  }
  if (queryLower.includes('roadmap') || queryLower.includes('phase') || replyLower.includes('roadmap')) {
    suggestedActions.push({ label: "View Visual Roadmap", action: "NAV_ROADMAP" });
  }
  if (queryLower.includes('hour') || queryLower.includes('time') || queryLower.includes('week')) {
    suggestedActions.push({ label: "Adjust Bandwidth", action: "NAV_PROFILE" });
  }
  if (queryLower.includes('project') || queryLower.includes('capstone') || replyLower.includes('capstone')) {
    suggestedActions.push({ label: "Add Capstone to Roadmap", action: "ADD_CAPSTONE" });
  }

  if (suggestedActions.length === 0) {
    suggestedActions.push(
      { label: "Analyze my skill gaps", action: "QUERY_GAPS" },
      { label: "View Visual Roadmap", action: "NAV_ROADMAP" }
    );
  }

  return {
    id: "msg-ai-" + Date.now(),
    sender: "ai",
    text: replyContent,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions,
    isGroq: true,
    modelName: 'PathAI Engine'
  };
}

/**
 * Async chat response generator: tries Cloud API first (if API Key available),
 * gracefully falls back to local AI template generator.
 */
export async function generateAIChatResponseAsync(userMessage, currentContext, apiKey) {
  const activeKey = apiKey || getGroqApiKey();
  
  if (activeKey && activeKey.trim()) {
    try {
      const groqReply = await fetchGroqChatCompletion(userMessage, currentContext, activeKey.trim());
      if (groqReply && groqReply.text) {
        return groqReply;
      }
    } catch (err) {
      console.warn("AI API call error, falling back to local AI engine:", err);
      const fallback = generateAIChatResponse(userMessage, currentContext);
      fallback.text = `⚠️ *(Cloud AI notice: ${err.message || 'Connection failed'}. Displaying local AI response)*\n\n` + fallback.text;
      return fallback;
    }
  }

  const fallback = generateAIChatResponse(userMessage, currentContext);
  fallback.isFallback = true;
  return fallback;
}

/**
 * Intelligent Conversational Assistant response generator with clean formatting (local fallback).
 */
export function generateAIChatResponse(userMessage, currentContext) {
  const query = userMessage.toLowerCase();
  const { targetRole, gapResult, activeRoadmap, profile } = currentContext;

  let replyText = "";
  let suggestedActions = [];

  if (query.includes("skill gap") || query.includes("missing") || query.includes("what do i need")) {
    const missing = gapResult.gapAnalysis.filter(g => g.status !== 'Mastered');
    replyText = `Based on your goal to become a **${targetRole.title}**, here is your tailored skill gap analysis:\n\n` +
      missing.map(m => `• **${m.name}**: Current level is *${m.currentLevel}*, target is *${m.targetLevel}* (${m.importance} Priority)`).join('\n') +
      `\n\nI recommend prioritizing Phase 1 of your roadmap to bridge these core gaps effectively.`;
    suggestedActions = [{ label: "View Gap Matrix", action: "NAV_PROFILE" }, { label: "Go to Phase 1", action: "NAV_ROADMAP" }];
  } else if (query.includes("why") && (query.includes("recommend") || query.includes("suggest") || query.includes("docker") || query.includes("prerequisites"))) {
    replyText = `Every course and project in your learning path is calculated by analyzing:\n` +
      `• Your target career requirements (**${targetRole.title}**)\n` +
      `• Your self-assessed current skill proficiency\n` +
      `• Your weekly study bandwidth (**${profile.weeklyHours} hours/week**)\n\n` +
      `Prerequisites are structured sequentially so you master foundational skills before tackling complex architecture.`;
    suggestedActions = [{ label: "See Recommendation Rationale", action: "NAV_ROADMAP" }];
  } else if (query.includes("how long") || query.includes("weeks") || query.includes("time")) {
    replyText = `At your target pace of **${profile.weeklyHours} hours/week**, your estimated time to complete the roadmap is **${activeRoadmap.estimatedWeeks} weeks** (~${activeRoadmap.totalDurationHours} total learning hours).\n\nIncreasing your weekly commitment to 20 hours would accelerate your completion to ~${Math.ceil(activeRoadmap.totalDurationHours / 20)} weeks!`;
    suggestedActions = [{ label: "Adjust Bandwidth", action: "NAV_PROFILE" }];
  } else if (query.includes("capstone") || query.includes("project idea") || query.includes("portfolio")) {
    replyText = `For a **${targetRole.title}**, an impactful portfolio capstone project would be:\n\n` +
      `• **Autonomous Enterprise AI Knowledge Base Agent**\n` +
      `• **Frontend**: React / Next.js with streaming chat UI\n` +
      `• **Backend**: FastAPI with async Python\n` +
      `• **AI Infrastructure**: LangChain, RAG with Pinecone Vector DB, and OpenAI/Claude APIs\n` +
      `• **DevOps**: Dockerized container deployment\n\n` +
      `Building this project demonstrates production mastery across 80% of your target requirements.`;
    suggestedActions = [{ label: "Add Capstone to Roadmap", action: "ADD_CAPSTONE" }];
  } else {
    replyText = `I am your **PathAI Executive Learning Assistant**. Tailored to your goal as a **${targetRole.title}**, I can help you with:\n\n` +
      `• Detailed skill gap analysis and prerequisite guidance\n` +
      `• Transparent explanations for every recommendation\n` +
      `• Industry-standard portfolio capstone project ideas\n` +
      `• Timeline and weekly study pace adjustments\n\nHow can I assist your learning path today?`;
    suggestedActions = [
      { label: "Analyze my skill gaps", action: "QUERY_GAPS" },
      { label: "Estimate time to complete", action: "QUERY_TIME" },
      { label: "Give project recommendations", action: "QUERY_PROJECTS" }
    ];
  }

  return {
    id: "msg-" + Date.now(),
    sender: "ai",
    text: replyText,
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    suggestedActions
  };
}

