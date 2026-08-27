import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { 
  CheckCircle2, 
  Circle, 
  Sparkles, 
  ExternalLink, 
  Clock, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  BookOpen, 
  Layers, 
  Award,
  ArrowUpRight,
  GraduationCap,
  Briefcase,
  Copy,
  Check,
  Code2
} from 'lucide-react';

export const ResourceCard = ({ resource }) => {
  const { toggleResourceCompletion, enrolledCourse, enrollInCourse } = useLearning();
  const [showAIExplanation, setShowAIExplanation] = useState(false);
  const [showRecruiterGuidance, setShowRecruiterGuidance] = useState(false);
  const [copiedResumeBullet, setCopiedResumeBullet] = useState(false);
  const [confirmSwitch, setConfirmSwitch] = useState(false);

  const {
    id,
    title,
    provider,
    type,
    format,
    duration,
    level,
    rating,
    url,
    completed,
    tags = [],
    description,
    aiRationale,
    recruiterGuidance
  } = resource;

  const isEnrolled = enrolledCourse && enrolledCourse.id === id;

  const handleEnrollClick = () => {
    if (enrolledCourse && enrolledCourse.id !== id) {
      setConfirmSwitch(true);
    } else {
      enrollInCourse(resource);
    }
  };

  const handleConfirmEnroll = () => {
    enrollInCourse(resource);
    setConfirmSwitch(false);
  };

  const handleCopyBullet = () => {
    if (recruiterGuidance?.resumeBullet) {
      navigator.clipboard.writeText(recruiterGuidance.resumeBullet);
      setCopiedResumeBullet(true);
      setTimeout(() => setCopiedResumeBullet(false), 2500);
    }
  };

  const getLevelBadgeClass = (lvl) => {
    switch (lvl) {
      case 'Beginner': return 'badge-green';
      case 'Intermediate': return 'badge-indigo';
      case 'Advanced': return 'badge-purple';
      default: return 'badge-gray';
    }
  };

  return (
    <div className={`resource-card ${completed ? 'completed' : ''} ${isEnrolled ? 'is-enrolled-border' : ''}`}>
      {/* Top Card Header */}
      <div className="card-top">
        <div className="card-meta">
          <span className={`badge ${getLevelBadgeClass(level)}`}>{level}</span>
          <span className="badge badge-outline">{type}</span>
          {isEnrolled && (
            <span className="badge badge-emerald-glow">
              <GraduationCap size={12} /> Active Enrolled Course
            </span>
          )}
        </div>

        {/* Completion Checkbox */}
        <button 
          className={`btn-complete-toggle ${completed ? 'is-completed' : ''}`}
          onClick={() => toggleResourceCompletion(id)}
          title={completed ? "Mark as Incomplete" : "Mark as Completed"}
        >
          {completed ? (
            <>
              <CheckCircle2 size={18} className="text-emerald-400" />
              <span>Completed</span>
            </>
          ) : (
            <>
              <Circle size={18} />
              <span>Mark Done</span>
            </>
          )}
        </button>
      </div>

      {/* Main Title & Provider */}
      <div className="card-main">
        <h4 className="card-title">{title}</h4>
        <span className="card-provider">by {provider}</span>
        <p className="card-desc">{description}</p>
      </div>

      {/* Tags List */}
      <div className="card-tags">
        {tags.map((tag, idx) => (
          <span key={idx} className="tag-chip">#{tag}</span>
        ))}
      </div>

      {/* Card Info Footer */}
      <div className="card-info-row">
        <div className="info-item">
          <Clock size={14} />
          <span>{duration}</span>
        </div>
        <div className="info-item">
          <Star size={14} className="text-amber-400 fill-amber-400" />
          <span>{rating} / 5.0</span>
        </div>

        {type === 'Course' && (
          <div className="ml-auto flex items-center gap-2">
            {!isEnrolled ? (
              <button 
                className="btn-enroll-sm"
                onClick={handleEnrollClick}
              >
                <GraduationCap size={14} />
                <span>Enroll in Course</span>
              </button>
            ) : (
              <span className="enrolled-check-pill">
                <CheckCircle2 size={14} /> Enrolled
              </span>
            )}
          </div>
        )}

        {url && type !== 'Course' && (
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn-external-link">
            <span>Open Resource</span>
            <ArrowUpRight size={14} />
          </a>
        )}
      </div>

      {/* Confirmation modal prompt if switching active course */}
      {confirmSwitch && (
        <div className="confirm-switch-box">
          <p className="text-xs font-semibold text-amber-300">
            ⚠️ You are currently enrolled in <strong>"{enrolledCourse?.title}"</strong>.
            Enrolling in this course will switch your active learning roadmap. (1 active course at a time)
          </p>
          <div className="flex gap-2 mt-2">
            <button className="btn-primary-sm" onClick={handleConfirmEnroll}>
              Confirm Switch & Enroll
            </button>
            <button className="btn-secondary-sm" onClick={() => setConfirmSwitch(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Recruiter Showcase & Portfolio Guidance Drawer */}
      {recruiterGuidance && (
        <div className="recruiter-guidance-wrapper">
          <button 
            className="btn-toggle-recruiter"
            onClick={() => setShowRecruiterGuidance(!showRecruiterGuidance)}
          >
            <Briefcase size={14} className="text-emerald-400" />
            <span>Recruiter Showcase & Resume Guidance</span>
            {showRecruiterGuidance ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showRecruiterGuidance && (
            <div className="recruiter-guidance-box">
              {/* Copyable Resume Bullet Point */}
              <div className="guidance-section">
                <div className="flex items-center justify-between mb-1">
                  <span className="guidance-label">📄 Resume Ready Bullet Point:</span>
                  <button className="btn-copy-bullet" onClick={handleCopyBullet}>
                    {copiedResumeBullet ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                    <span>{copiedResumeBullet ? "Copied!" : "Copy for Resume"}</span>
                  </button>
                </div>
                <p className="resume-bullet-text">"{recruiterGuidance.resumeBullet}"</p>
              </div>

              {/* GitHub Repository Tips */}
              <div className="guidance-section mt-2">
                <span className="guidance-label">🐙 GitHub Repository Best Practices:</span>
                <p className="github-tips-text">{recruiterGuidance.githubTips}</p>
              </div>

              {/* Architecture Highlights */}
              {recruiterGuidance.keyHighlights && (
                <div className="guidance-section mt-2">
                  <span className="guidance-label">⚡ Interview Discussion Highlights:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {recruiterGuidance.keyHighlights.map((hl, i) => (
                      <span key={i} className="highlight-tag">{hl}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* AI Recommendation Explanation Drawer */}
      <div className="ai-explanation-wrapper">
        <button 
          className="btn-toggle-ai"
          onClick={() => setShowAIExplanation(!showAIExplanation)}
        >
          <Sparkles size={14} className="text-purple-400" />
          <span>Why was this recommended?</span>
          {showAIExplanation ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {showAIExplanation && (
          <div className="ai-explanation-box">
            <p className="primary-reason font-medium">{aiRationale?.primaryReason || `Essential core module for ${title}`}</p>
          </div>
        )}
      </div>
    </div>
  );
};
