import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { CAREER_ROLES, SKILL_LEVELS, LEARNING_STYLES } from '../data/skillTaxonomy';
import { 
  UserCheck, 
  Target, 
  Sliders, 
  Sparkles, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  BrainCircuit, 
  Clock, 
  BookOpen
} from 'lucide-react';

export const ProfileEditor = () => {
  const { profile, updateTargetGoal, updateCurrentSkills, updatePreferences, gapResult, setDiagnosticOpen } = useLearning();

  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [successMsg, setSuccessMsg] = useState('');

  const handleTargetRoleChange = (roleId) => {
    updateTargetGoal(roleId);
    showNotice('Target career goal updated! AI Learning Roadmap has been re-generated.');
  };

  const handleSkillLevelChange = (skillId, newLevel) => {
    const updated = profile.currentSkills.map(s => 
      s.id === skillId ? { ...s, level: newLevel } : s
    );
    updateCurrentSkills(updated);
  };

  const handleRemoveSkill = (skillId) => {
    const updated = profile.currentSkills.filter(s => s.id !== skillId);
    updateCurrentSkills(updated);
  };

  const handleAddCustomSkill = (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const id = newSkillName.toLowerCase().replace(/\s+/g, '-');
    const updated = [...profile.currentSkills, { id, name: newSkillName.trim(), level: newSkillLevel }];
    updateCurrentSkills(updated);
    setNewSkillName('');
    showNotice(`Added custom skill: ${newSkillName}`);
  };

  const showNotice = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="profile-editor-container">
      {/* Top Banner Notice */}
      {successMsg && (
        <div className="toast-success">
          <Sparkles size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Target Goal Selector Section */}
      <section className="profile-section">
        <div className="section-title-group">
          <Target className="section-icon text-indigo-400" />
          <div>
            <h3>1. Target Career Role & Learning Objective</h3>
            <p className="section-subtitle">Select your primary career aspiration. The AI engine uses this to calculate required baseline competencies.</p>
          </div>
        </div>

        <div className="roles-grid">
          {CAREER_ROLES.map(role => {
            const isSelected = profile.targetGoalId === role.id;
            return (
              <div 
                key={role.id}
                className={`role-option-card ${isSelected ? 'selected' : ''}`}
                onClick={() => handleTargetRoleChange(role.id)}
              >
                {isSelected && <div className="active-dot"><CheckCircle2 size={16} /></div>}
                <span className="role-category">{role.category}</span>
                <h4 className="role-title">{role.title}</h4>
                <p className="role-desc">{role.description}</p>
                <div className="role-meta">
                  <span className="salary-tag">Est. {role.avgSalary}</span>
                  <span className="demand-tag">Demand: {role.demand}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Current Skill Baseline & Gap Matrix Section */}
      <section className="profile-section">
        <div className="section-title-group">
          <BrainCircuit className="section-icon text-cyan-400" />
          <div>
            <h3>2. Learner Skill Baseline & Skill-Gap Analysis</h3>
            <p className="section-subtitle">Manage your current skill levels. Below is a live diagnostic comparing your skills to your target goal.</p>
          </div>

          <button className="btn-secondary-sm ml-auto" onClick={() => setDiagnosticOpen(true)}>
            <Sparkles size={14} />
            <span>Take Skill Quiz</span>
          </button>
        </div>

        {/* Skill Gap Matrix Visualization */}
        <div className="gap-analysis-card">
          <div className="gap-header">
            <h4>Live Skill Gap Diagnostic for {gapResult.targetRole.title}</h4>
            <span className="readiness-score font-bold text-cyan-400">
              Readiness Score: {gapResult.readinessPercentage}%
            </span>
          </div>

          <div className="gap-table">
            <div className="gap-table-header">
              <span>Required Competency</span>
              <span>Importance</span>
              <span>Current Level</span>
              <span>Target Level</span>
              <span>Gap Status</span>
            </div>

            {gapResult.gapAnalysis.map(gap => (
              <div key={gap.id} className="gap-table-row">
                <span className="font-medium text-white">{gap.name}</span>
                <span>
                  <span className={`importance-tag ${gap.importance.toLowerCase()}`}>
                    {gap.importance}
                  </span>
                </span>
                <span>
                  <select 
                    value={gap.currentLevel}
                    onChange={(e) => handleSkillLevelChange(gap.id, e.target.value)}
                    className="level-select-inline"
                  >
                    <option value="None">None</option>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </span>
                <span className="text-gray-300 font-semibold">{gap.targetLevel}</span>
                <span>
                  <span className={`status-pill status-${gap.status.toLowerCase().replace(/\s+/g, '-')}`}>
                    {gap.status}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Add Custom Skill Form */}
        <form className="add-skill-form" onSubmit={handleAddCustomSkill}>
          <input 
            type="text" 
            placeholder="Add custom skill (e.g. GraphQL, Tailwind, Rust)..."
            value={newSkillName}
            onChange={e => setNewSkillName(e.target.value)}
            className="input-field"
          />
          <select 
            value={newSkillLevel} 
            onChange={e => setNewSkillLevel(e.target.value)}
            className="select-field"
          >
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
          <button type="submit" className="btn-primary-sm">
            <Plus size={16} />
            <span>Add Skill</span>
          </button>
        </form>
      </section>

      {/* Preferences Section: Hours & Learning Style */}
      <section className="profile-section">
        <div className="section-title-group">
          <Sliders className="section-icon text-purple-400" />
          <div>
            <h3>3. Learning Pace & Preferred Format</h3>
            <p className="section-subtitle">Set your available weekly study hours and preferred media format so the engine optimizes your timeline.</p>
          </div>
        </div>

        <div className="preferences-grid">
          {/* Weekly Hours Slider */}
          <div className="pref-card">
            <div className="pref-header">
              <Clock className="text-indigo-400" size={20} />
              <h4>Weekly Study Bandwidth</h4>
            </div>
            <div className="hours-display">
              <span className="hours-val">{profile.weeklyHours}</span>
              <span className="hours-unit">Hours per week</span>
            </div>
            <input 
              type="range" 
              min="3" 
              max="40" 
              value={profile.weeklyHours}
              onChange={e => updatePreferences(parseInt(e.target.value, 10), profile.learningStyle)}
              className="range-slider"
            />
            <span className="slider-hint">
              At {profile.weeklyHours} hrs/week, recommended pace is ~{Math.ceil(gapResult.targetRole.requiredSkills.length * 2.5)} weeks.
            </span>
          </div>

          {/* Preferred Style Options */}
          <div className="pref-card">
            <div className="pref-header">
              <BookOpen className="text-cyan-400" size={20} />
              <h4>Preferred Learning Format</h4>
            </div>

            <div className="styles-list">
              {LEARNING_STYLES.map(style => {
                const isSel = profile.learningStyle === style.id;
                return (
                  <button 
                    key={style.id}
                    className={`style-option ${isSel ? 'active' : ''}`}
                    onClick={() => updatePreferences(profile.weeklyHours, style.id)}
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
        </div>
      </section>
    </div>
  );
};
