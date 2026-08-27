import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { getTodayDSAQuestion } from '../utils/dsaQuestions';
import { 
  Code2, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles, 
  Flame, 
  Building2, 
  Lightbulb, 
  ChevronDown, 
  ChevronUp, 
  ArrowUpRight 
} from 'lucide-react';

export const DailyDSAChallenge = ({ dsaStreak, isSolvedToday, onMarkSolved }) => {
  const [showHint, setShowHint] = useState(false);
  const question = getTodayDSAQuestion();

  const handleSolveClick = () => {
    onMarkSolved();
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const getDifficultyClass = (diff) => {
    switch (diff) {
      case 'Easy': return 'badge-green';
      case 'Medium': return 'badge-indigo';
      case 'Hard': return 'badge-purple';
      default: return 'badge-gray';
    }
  };

  return (
    <div className="dsa-challenge-card">
      <div className="dsa-card-header">
        <div className="dsa-header-left">
          <div className="dsa-icon-box bg-purple-500/20 text-purple-400">
            <Code2 size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">Daily DSA Practice Session</h3>
              <span className="badge badge-purple">At least 1 Problem / Day</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Regular problem solving for Tier-1 Product & Service company technical interview rounds.
            </p>
          </div>
        </div>

        <div className="dsa-streak-pill" title="DSA Daily Practice Streak">
          <Flame size={16} className="text-amber-400" />
          <span>{dsaStreak} Day DSA Streak</span>
        </div>
      </div>

      <div className="dsa-problem-box">
        <div className="problem-meta-row">
          <span className={`badge ${getDifficultyClass(question.difficulty)}`}>{question.difficulty}</span>
          <span className="badge badge-outline">{question.category}</span>
          <div className="company-tags-list">
            <Building2 size={13} className="text-gray-400" />
            <span className="text-xs text-gray-400 font-medium">Asked in:</span>
            {question.companies.map((comp, idx) => (
              <span key={idx} className="comp-tag">{comp}</span>
            ))}
          </div>
        </div>

        <h4 className="problem-title">{question.title}</h4>
        <p className="problem-desc">{question.description}</p>

        {/* Hint Accordion */}
        <div className="hint-wrapper">
          <button 
            className="btn-hint-toggle"
            onClick={() => setShowHint(!showHint)}
          >
            <Lightbulb size={14} className="text-amber-400" />
            <span>{showHint ? "Hide Problem Hint" : "Need a hint?"}</span>
            {showHint ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showHint && (
            <div className="hint-box">
              <p>💡 {question.hint}</p>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="dsa-actions-row">
          <a 
            href={question.leetcodeUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="btn-primary"
          >
            <span>Solve on LeetCode</span>
            <ArrowUpRight size={16} />
          </a>

          <button 
            className={`btn-complete-toggle ${isSolvedToday ? 'is-completed' : ''}`}
            onClick={handleSolveClick}
          >
            {isSolvedToday ? (
              <>
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>Solved Today! 🔥</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={18} />
                <span>Mark Solved Today</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
