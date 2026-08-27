import React from 'react';
import { useLearning } from '../context/LearningContext';
import { PRESET_PERSONAS } from '../data/defaultProfiles';
import { X, Check, Users, Sparkles } from 'lucide-react';

export const PersonaSelector = ({ isOpen, onClose }) => {
  const { profile, loadPersona } = useLearning();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content persona-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Users className="modal-icon text-indigo-400" />
            <div>
              <h3>Select Learner Persona</h3>
              <p className="modal-subtitle">Experience how PathAI adapts recommendations for different learner backgrounds and skill levels.</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="persona-grid">
          {PRESET_PERSONAS.map(p => {
            const isSelected = profile.id === p.id;
            return (
              <div 
                key={p.id} 
                className={`persona-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  loadPersona(p.id);
                  onClose();
                }}
              >
                {isSelected && (
                  <div className="selected-badge">
                    <Check size={14} /> Active Persona
                  </div>
                )}
                <div className="persona-card-header">
                  <img src={p.avatar} alt={p.name} className="persona-card-avatar" />
                  <div>
                    <h4 className="persona-card-name">{p.name}</h4>
                    <span className="persona-card-role">{p.role}</span>
                  </div>
                </div>

                <p className="persona-card-bio">{p.bio}</p>

                <div className="persona-card-details">
                  <div className="detail-tag">
                    <Sparkles size={13} /> Target: <strong>{p.targetGoalId.replace('-', ' ').toUpperCase()}</strong>
                  </div>
                  <div className="detail-tag">
                    ⏰ {p.weeklyHours} hrs/week
                  </div>
                  <div className="detail-tag capitalize">
                    🎯 {p.learningStyle} style
                  </div>
                </div>

                <div className="persona-skills-preview">
                  <span className="skills-label">Baseline Skills:</span>
                  <div className="skills-chips">
                    {p.currentSkills.map(s => (
                      <span key={s.id} className="skill-chip">
                        {s.name} ({s.level})
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};
