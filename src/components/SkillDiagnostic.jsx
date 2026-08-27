import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { X, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

const DIAGNOSTIC_QUESTIONS = [
  {
    id: 1,
    skillId: "python",
    question: "How comfortable are you with Python's asynchronous programming (`async/await`) and object-oriented inheritance?",
    options: [
      { label: "Never used Python or only basic syntax", level: "Beginner" },
      { label: "Used functions and classes, but not async/await", level: "Intermediate" },
      { label: "Built async APIs with FastAPI or asyncio in production", level: "Advanced" }
    ]
  },
  {
    id: 2,
    skillId: "react",
    question: "What is your proficiency level with React.js state management and custom hooks?",
    options: [
      { label: "No prior experience or basic HTML/JS only", level: "Beginner" },
      { label: "Built React apps using useState, useEffect, and props", level: "Intermediate" },
      { label: "Mastered Context API, custom hooks, and server components", level: "Advanced" }
    ]
  },
  {
    id: 3,
    skillId: "docker",
    question: "Have you packaged apps using Docker container images and Docker Compose?",
    options: [
      { label: "No experience with containerization", level: "Beginner" },
      { label: "Can write basic Dockerfiles and run images", level: "Intermediate" },
      { label: "Architect multi-stage Docker builds and production clusters", level: "Advanced" }
    ]
  }
];

export const SkillDiagnostic = () => {
  const { diagnosticOpen, setDiagnosticOpen, profile, updateCurrentSkills } = useLearning();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [quizFinished, setQuizFinished] = useState(false);

  if (!diagnosticOpen) return null;

  const handleSelectOption = (skillId, level) => {
    setAnswers(prev => ({ ...prev, [skillId]: level }));
  };

  const handleNext = () => {
    if (currentStep < DIAGNOSTIC_QUESTIONS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Calculate updated skills
      const updatedSkills = [...profile.currentSkills];
      Object.entries(answers).forEach(([sId, lvl]) => {
        const existingIdx = updatedSkills.findIndex(s => s.id === sId);
        if (existingIdx >= 0) {
          updatedSkills[existingIdx] = { ...updatedSkills[existingIdx], level: lvl };
        } else {
          updatedSkills.push({ id: sId, name: sId.toUpperCase(), level: lvl });
        }
      });
      updateCurrentSkills(updatedSkills);
      setQuizFinished(true);
    }
  };

  const handleClose = () => {
    setDiagnosticOpen(false);
    setCurrentStep(0);
    setAnswers({});
    setQuizFinished(false);
  };

  const activeQ = DIAGNOSTIC_QUESTIONS[currentStep];

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content diagnostic-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Sparkles className="modal-icon text-cyan-400" />
            <div>
              <h3>AI Skill Diagnostic Assessment</h3>
              <p className="modal-subtitle">Calibrate your baseline skills so the recommendation engine generates precise roadmaps.</p>
            </div>
          </div>
          <button className="btn-close" onClick={handleClose}><X size={20} /></button>
        </div>

        {!quizFinished ? (
          <div className="diagnostic-body">
            <div className="diagnostic-progress-bar">
              <div 
                className="diagnostic-progress-fill" 
                style={{ width: `${((currentStep + 1) / DIAGNOSTIC_QUESTIONS.length) * 100}%` }} 
              />
            </div>

            <span className="step-counter">Question {currentStep + 1} of {DIAGNOSTIC_QUESTIONS.length}</span>
            
            <h4 className="diagnostic-question">{activeQ.question}</h4>

            <div className="options-list">
              {activeQ.options.map((opt, idx) => {
                const isSelected = answers[activeQ.skillId] === opt.level;
                return (
                  <button 
                    key={idx}
                    className={`option-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleSelectOption(activeQ.skillId, opt.level)}
                  >
                    <div className={`radio-dot ${isSelected ? 'active' : ''}`} />
                    <div className="option-content">
                      <span className="option-label">{opt.label}</span>
                      <span className="option-badge">{opt.level}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="diagnostic-footer">
              <button className="btn-secondary" onClick={handleClose}>Cancel</button>
              <button 
                className="btn-primary" 
                disabled={!answers[activeQ.skillId]} 
                onClick={handleNext}
              >
                <span>{currentStep === DIAGNOSTIC_QUESTIONS.length - 1 ? 'Finish Assessment' : 'Next Question'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz-results">
            <CheckCircle2 size={48} className="text-emerald-400 mx-auto mb-3" />
            <h3>Diagnostic Complete!</h3>
            <p>Your skill baseline profile has been updated. The recommendation engine has automatically re-calculated your personalized roadmap prerequisites and timelines.</p>
            
            <div className="results-summary-box">
              {Object.entries(answers).map(([sId, lvl]) => (
                <div key={sId} className="result-row">
                  <span className="result-skill font-semibold">{sId.toUpperCase()}</span>
                  <span className="result-level-badge">{lvl}</span>
                </div>
              ))}
            </div>

            <button className="btn-primary w-full mt-4" onClick={handleClose}>
              View Re-calculated Roadmap
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
