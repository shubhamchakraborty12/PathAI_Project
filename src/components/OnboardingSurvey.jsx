import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { CAREER_ROLES, LEARNING_STYLES } from '../data/skillTaxonomy';
import { TECH_SURVEY_QUESTIONS } from '../utils/surveyQuestions';
import { 
  Sparkles, 
  Target, 
  HelpCircle, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  BrainCircuit, 
  BookOpen 
} from 'lucide-react';

export const OnboardingSurvey = () => {
  const { onboardingSurveyOpen, completeOnboardingSurvey, currentUser } = useAuth();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [targetGoalId, setTargetGoalId] = useState('fullstack-ai');
  const [mcqAnswers, setMcqAnswers] = useState({});
  const [weeklyHours, setWeeklyHours] = useState(12);
  const [learningStyle, setLearningStyle] = useState('hands-on');
  const [isGenerating, setIsGenerating] = useState(false);

  if (!onboardingSurveyOpen || !currentUser) return null;

  const activeQuestions = TECH_SURVEY_QUESTIONS[targetGoalId] || TECH_SURVEY_QUESTIONS['fullstack-ai'];

  const handleSelectGoal = (goalId) => {
    setTargetGoalId(goalId);
    setMcqAnswers({});
  };

  const handleSelectMcq = (qId, optionObj) => {
    setMcqAnswers(prev => ({ ...prev, [qId]: optionObj }));
  };

  const handleFinishSurvey = () => {
    setIsGenerating(true);

    // Map MCQ answers to skills array
    const assessedSkills = [];
    const role = CAREER_ROLES.find(r => r.id === targetGoalId) || CAREER_ROLES[0];
    
    role.requiredSkills.forEach((reqSkill, idx) => {
      const qKey = Object.keys(mcqAnswers)[idx % Object.keys(mcqAnswers).length];
      const selectedOpt = mcqAnswers[qKey];
      const level = selectedOpt ? selectedOpt.level : 'Beginner';

      assessedSkills.push({
        id: reqSkill.id,
        name: reqSkill.name,
        level
      });
    });

    setTimeout(() => {
      setIsGenerating(false);
      completeOnboardingSurvey({
        targetGoalId,
        weeklyHours,
        learningStyle,
        assessedSkills
      });
    }, 1200);
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content survey-modal">
        <div className="modal-header">
          <div className="modal-title-group">
            <Sparkles className="modal-icon text-cyan-400" />
            <div>
              <h3>Welcome {currentUser.name}! Let's Build Your Learning Path</h3>
              <p className="modal-subtitle">Complete this 3-step diagnostic survey so PathAI can personalize your dashboard and learning roadmap.</p>
            </div>
          </div>
        </div>

        {!isGenerating ? (
          <div className="survey-body">
            {/* Step Stepper Progress */}
            <div className="stepper-bar">
              <div className={`step-node ${currentStep >= 1 ? 'active' : ''}`}>1. Technology Goal</div>
              <div className={`step-node ${currentStep >= 2 ? 'active' : ''}`}>2. MCQ Tech Quiz</div>
              <div className={`step-node ${currentStep >= 3 ? 'active' : ''}`}>3. Schedule & Style</div>
            </div>

            {/* Step 1: Technology Goal Selection */}
            {currentStep === 1 && (
              <div className="survey-step-content">
                <h4 className="step-heading">What technology domain or role do you want to learn?</h4>
                <div className="survey-roles-grid">
                  {CAREER_ROLES.map(role => {
                    const isSel = targetGoalId === role.id;
                    return (
                      <div 
                        key={role.id}
                        className={`survey-role-card ${isSel ? 'selected' : ''}`}
                        onClick={() => handleSelectGoal(role.id)}
                      >
                        {isSel && <div className="active-check"><CheckCircle2 size={16} /></div>}
                        <span className="survey-role-cat">{role.category}</span>
                        <h5 className="survey-role-title">{role.title}</h5>
                        <p className="survey-role-desc">{role.description}</p>
                      </div>
                    );
                  })}
                </div>

                <div className="survey-footer">
                  <button className="btn-primary ml-auto" onClick={() => setCurrentStep(2)}>
                    <span>Next: Technology Skill Quiz</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: MCQ Skill Diagnostic */}
            {currentStep === 2 && (
              <div className="survey-step-content">
                <h4 className="step-heading">Baseline Knowledge Quiz ({targetGoalId.replace('-', ' ').toUpperCase()})</h4>
                <p className="step-subheading">Answer these quick questions so we evaluate your baseline skill level:</p>

                <div className="mcq-list">
                  {activeQuestions.map((q, qIdx) => (
                    <div key={q.id} className="mcq-item-box">
                      <span className="q-number">Question {qIdx + 1}</span>
                      <h5 className="q-text">{q.question}</h5>
                      <div className="q-options-grid">
                        {q.options.map((opt, oIdx) => {
                          const isSel = mcqAnswers[q.id]?.label === opt.label;
                          return (
                            <button 
                              key={oIdx}
                              className={`mcq-option-btn ${isSel ? 'selected' : ''}`}
                              onClick={() => handleSelectMcq(q.id, opt)}
                            >
                              <div className={`radio-dot ${isSel ? 'active' : ''}`} />
                              <span>{opt.label}</span>
                              <span className="level-chip">{opt.level}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="survey-footer">
                  <button className="btn-secondary" onClick={() => setCurrentStep(1)}>Back</button>
                  <button 
                    className="btn-primary"
                    disabled={Object.keys(mcqAnswers).length < activeQuestions.length}
                    onClick={() => setCurrentStep(3)}
                  >
                    <span>Next: Pace & Preferences</span>
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Pace & Bandwidth */}
            {currentStep === 3 && (
              <div className="survey-step-content">
                <h4 className="step-heading">Your Learning Bandwidth & Preferences</h4>
                
                <div className="survey-pref-box">
                  <label className="font-semibold block mb-2">How many hours per week can you dedicate to learning?</label>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-indigo-400">{weeklyHours} Hours / week</span>
                    <input 
                      type="range" 
                      min="3" 
                      max="40" 
                      value={weeklyHours}
                      onChange={e => setWeeklyHours(parseInt(e.target.value, 10))}
                      className="range-slider flex-1"
                    />
                  </div>
                </div>

                <div className="survey-pref-box mt-4">
                  <label className="font-semibold block mb-2">Preferred Learning Format:</label>
                  <div className="styles-list">
                    {LEARNING_STYLES.map(style => {
                      const isSel = learningStyle === style.id;
                      return (
                        <button 
                          key={style.id}
                          className={`style-option ${isSel ? 'active' : ''}`}
                          onClick={() => setLearningStyle(style.id)}
                        >
                          <div className={`radio-dot ${isSel ? 'active' : ''}`} />
                          <div>
                            <span className="style-label">{style.label}</span>
                            <p className="style-desc">{style.description}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="survey-footer">
                  <button className="btn-secondary" onClick={() => setCurrentStep(2)}>Back</button>
                  <button className="btn-primary" onClick={handleFinishSurvey}>
                    <span>Generate My Personalized Dashboard</span>
                    <Sparkles size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="generating-box">
            <BrainCircuit size={54} className="text-purple-400 animate-pulse mx-auto mb-3" />
            <h3 className="text-xl font-bold">Analyzing Your Survey Responses...</h3>
            <p className="text-gray-400 text-sm mt-1">PathAI is calculating your skill gaps, sequencing prerequisites, and populating your personalized workspace dashboard.</p>
          </div>
        )}
      </div>
    </div>
  );
};
