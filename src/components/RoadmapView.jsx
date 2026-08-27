import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { ResourceCard } from './ResourceCard';
import { 
  Map, 
  Sparkles, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  Filter, 
  Plus, 
  Layers, 
  ArrowRight, 
  Bot, 
  Info
} from 'lucide-react';

export const RoadmapView = () => {
  const { activeRoadmap, profile, setActiveTab, sendChatMessage } = useLearning();
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'pending' | 'completed'
  const [filterType, setFilterType] = useState('all');     // 'all' | 'Course' | 'Project'
  const [activePhaseId, setActivePhaseId] = useState('all');

  const safeRoadmap = activeRoadmap || {};
  const targetRole = safeRoadmap.targetRole || { title: 'Target Path', category: 'Tech' };
  const phases = safeRoadmap.phases || [];
  const totalDurationHours = safeRoadmap.totalDurationHours || 0;
  const estimatedWeeks = safeRoadmap.estimatedWeeks || 0;
  const completedResourcesCount = safeRoadmap.completedResourcesCount || 0;
  const totalResourcesCount = safeRoadmap.totalResourcesCount || 0;

  const progressPercent = totalResourcesCount > 0 ? Math.round((completedResourcesCount / totalResourcesCount) * 100) : 0;

  const handleAskAIAboutRoadmap = () => {
    setActiveTab('chat');
    sendChatMessage(`Can you explain the sequence of my roadmap for ${targetRole.title || 'my target path'}? Why is Phase 1 structured this way?`);
  };

  return (
    <div className="roadmap-view-container">
      {/* Target Goal Summary Banner */}
      <div className="roadmap-header-card">
        <div className="header-badge-row">
          <span className="badge badge-purple">AI Generated Path</span>
          <span className="badge badge-cyan">{targetRole.category}</span>
          <span className="badge badge-outline">Bandwidth: {profile.weeklyHours} hrs/week</span>
        </div>

        <div className="header-main-content">
          <div>
            <h2 className="roadmap-title">{targetRole.title} Path</h2>
            <p className="roadmap-subtitle">{targetRole.description}</p>
          </div>

          <button className="btn-ai-prompt" onClick={handleAskAIAboutRoadmap}>
            <Bot size={18} />
            <span>Ask AI Assistant About Path</span>
          </button>
        </div>

        {/* Key Metrics Stats */}
        <div className="roadmap-metrics-grid">
          <div className="metric-box">
            <Clock className="metric-icon text-indigo-400" />
            <div>
              <span className="metric-val">{totalDurationHours} Hours</span>
              <span className="metric-lbl">Total Estimated Effort</span>
            </div>
          </div>

          <div className="metric-box">
            <Calendar className="metric-icon text-cyan-400" />
            <div>
              <span className="metric-val">~{estimatedWeeks} Weeks</span>
              <span className="metric-lbl">Est. Completion (@ {profile.weeklyHours}h/wk)</span>
            </div>
          </div>

          <div className="metric-box">
            <CheckCircle2 className="metric-icon text-emerald-400" />
            <div>
              <span className="metric-val">{completedResourcesCount} / {totalResourcesCount} Done</span>
              <span className="metric-lbl">Milestones Completed</span>
            </div>
          </div>

          <div className="metric-box progress-box">
            <div className="flex justify-between items-center w-full mb-1">
              <span className="metric-lbl">Path Progress</span>
              <span className="font-bold text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Roadmap Controls & Filter Bar */}
      <div className="roadmap-controls-bar">
        <div className="filter-group">
          <Filter size={16} className="text-gray-400" />
          <span className="filter-label">Filter Status:</span>
          <button 
            className={`chip-btn ${filterStatus === 'all' ? 'active' : ''}`}
            onClick={() => setFilterStatus('all')}
          >
            All Items
          </button>
          <button 
            className={`chip-btn ${filterStatus === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterStatus('pending')}
          >
            Pending
          </button>
          <button 
            className={`chip-btn ${filterStatus === 'completed' ? 'active' : ''}`}
            onClick={() => setFilterStatus('completed')}
          >
            Completed
          </button>
        </div>

        <div className="filter-group">
          <span className="filter-label">Resource Format:</span>
          <button 
            className={`chip-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Types
          </button>
          <button 
            className={`chip-btn ${filterType === 'Course' ? 'active' : ''}`}
            onClick={() => setFilterType('Course')}
          >
            Courses
          </button>
          <button 
            className={`chip-btn ${filterType === 'Project' ? 'active' : ''}`}
            onClick={() => setFilterType('Project')}
          >
            Projects
          </button>
        </div>

        <div className="phase-select-group">
          <Layers size={16} className="text-purple-400" />
          <select 
            value={activePhaseId} 
            onChange={e => setActivePhaseId(e.target.value)}
            className="phase-dropdown"
          >
            <option value="all">All Learning Phases</option>
            {phases.map(p => (
              <option key={p.id} value={p.id}>Phase {p.phaseNumber}: {p.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Multi-Phase Timeline View */}
      <div className="phases-timeline-list">
        {phases
          .filter(phase => activePhaseId === 'all' || activePhaseId === phase.id)
          .map((phase) => {
            // Apply filtering to items within the phase
            const filteredItems = phase.items.filter(item => {
              if (filterStatus === 'pending' && item.completed) return false;
              if (filterStatus === 'completed' && !item.completed) return false;
              if (filterType !== 'all' && item.type !== filterType) return false;
              return true;
            });

            if (filteredItems.length === 0 && filterStatus !== 'all') return null;

            return (
              <div key={phase.id} className="phase-card">
                {/* Phase Title Banner */}
                <div className="phase-header">
                  <div className="phase-badge-pill">
                    <span className="phase-num">Phase {phase.phaseNumber}</span>
                  </div>
                  <div>
                    <h3 className="phase-title">{phase.title}</h3>
                    <p className="phase-subtitle">{phase.subtitle}</p>
                  </div>
                </div>

                {/* Phase Items Grid */}
                <div className="phase-items-grid">
                  {filteredItems.length > 0 ? (
                    filteredItems.map(item => (
                      <ResourceCard key={item.id} resource={item} showPhaseNumber={phase.phaseNumber} />
                    ))
                  ) : (
                    <div className="empty-phase-notice">
                      <Info size={18} />
                      <span>No matching resources found for the current filters in this phase.</span>
                    </div>
                  )}
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
};
