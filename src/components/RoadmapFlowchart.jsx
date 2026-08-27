import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { 
  GitFork, 
  CheckCircle2, 
  MapPin, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Layers, 
  Zap, 
  Play, 
  Check, 
  GraduationCap,
  Circle
} from 'lucide-react';

export const RoadmapFlowchart = () => {
  const { activeRoadmap, profile, toggleResourceCompletion, enrolledCourse, setActiveTab } = useLearning();
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  const safeRoadmap = activeRoadmap || {};
  const targetRole = safeRoadmap.targetRole || { title: 'Target Goal', category: 'Tech' };
  const phases = safeRoadmap.phases || [];
  const totalDurationHours = safeRoadmap.totalDurationHours || 0;
  const estimatedWeeks = safeRoadmap.estimatedWeeks || 0;

  // Flatten all items across phases into a sequential node path
  const allNodes = [];
  if (Array.isArray(phases)) {
    phases.forEach(phase => {
      if (phase && Array.isArray(phase.items)) {
        phase.items.forEach(item => {
          allNodes.push({
            ...item,
            phaseNumber: phase.phaseNumber,
            phaseTitle: phase.title
          });
        });
      }
    });
  }

  // Determine current active node (the first uncompleted item in the sequence)
  const currentActiveIndex = allNodes.findIndex(n => !n.completed);
  const currentActiveNode = currentActiveIndex >= 0 ? allNodes[currentActiveIndex] : null;
  const nextNode = currentActiveIndex >= 0 && currentActiveIndex + 1 < allNodes.length 
    ? allNodes[currentActiveIndex + 1] 
    : null;

  const activeSelected = selectedNodeId 
    ? allNodes.find(n => n.id === selectedNodeId) 
    : (currentActiveNode || allNodes[0]);

  return (
    <div className="flowchart-view-container">
      {/* Header Banner */}
      <div className="flowchart-header-card">
        <div className="flowchart-header-row">
          <div className="flowchart-header-left">
            <div className="flowchart-badge-group">
              <span className="badge badge-purple">Interactive Visual Graph</span>
              {enrolledCourse && (
                <span className="badge badge-cyan flex items-center gap-1">
                  <GraduationCap size={12} /> {enrolledCourse.title}
                </span>
              )}
            </div>
            <h2 className="flowchart-title">{targetRole.title} Flowchart</h2>
            <p className="flowchart-subtitle">
              Visual node-by-node sequence illustrating your completed milestones, current position, and next recommended steps.
            </p>
          </div>

          {currentActiveNode && (
            <div className="you-are-here-card">
              <div className="here-tag-row">
                <MapPin size={16} className="text-amber-400 animate-bounce" />
                <span className="here-tag-text">You Are Here (Step {currentActiveIndex + 1})</span>
              </div>
              <h4 className="current-node-name">{currentActiveNode.title}</h4>
            </div>
          )}
        </div>
      </div>

      {/* Main Graph Grid: Flowchart Left + Node Inspector Right */}
      <div className="flowchart-main-grid">
        {/* Left Column: Visual Flowchart Tree */}
        <div className="flowchart-tree-card">
          <div className="tree-header">
            <h3>Sequential Learning Nodes</h3>
            <span className="text-xs text-gray-400">Click any node to inspect details</span>
          </div>

          <div className="tree-nodes-container">
            {allNodes.map((node, index) => {
              const isCompleted = node.completed;
              const isCurrent = currentActiveNode && currentActiveNode.id === node.id;
              const isNext = nextNode && nextNode.id === node.id;
              const isSelected = activeSelected && activeSelected.id === node.id;

              let nodeStatusClass = 'node-upcoming';
              if (isCompleted) nodeStatusClass = 'node-completed';
              else if (isCurrent) nodeStatusClass = 'node-current';
              else if (isNext) nodeStatusClass = 'node-next';

              return (
                <React.Fragment key={node.id}>
                  {/* Node Connector Line */}
                  {index > 0 && (
                    <div className={`flow-connector ${index <= currentActiveIndex ? 'connector-active' : ''}`}>
                      <div className="connector-line" />
                      <ArrowRight size={14} className="connector-arrow" />
                    </div>
                  )}

                  {/* Flowchart Node Card */}
                  <div 
                    className={`flow-node-card ${nodeStatusClass} ${isSelected ? 'is-selected' : ''}`}
                    onClick={() => setSelectedNodeId(node.id)}
                  >
                    <div className="node-step-pill">
                      <span>Step {index + 1}</span>
                    </div>

                    <div className="node-icon-wrapper">
                      {isCompleted ? (
                        <CheckCircle2 size={22} className="text-emerald-400" />
                      ) : isCurrent ? (
                        <MapPin size={22} className="text-amber-400 animate-bounce" />
                      ) : isNext ? (
                        <Zap size={22} className="text-cyan-400" />
                      ) : (
                        <Circle size={20} className="text-gray-500" />
                      )}
                    </div>

                    <div className="node-info">
                      <div className="flex items-center gap-2">
                        <span className="node-phase-tag">Phase {node.phaseNumber}</span>
                        {isCurrent && <span className="current-badge">YOU ARE HERE</span>}
                        {isNext && <span className="next-badge">NEXT STEP</span>}
                        {isCompleted && <span className="completed-badge">COMPLETED</span>}
                      </div>
                      <h4 className="node-title">{node.title}</h4>
                      <span className="node-duration">⏱️ {node.duration} • {node.type}</span>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Selected Node Inspector Panel */}
        {activeSelected && (
          <div className="node-inspector-card">
            <div className="inspector-header">
              <span className="inspector-tag">{activeSelected.type} • {activeSelected.level}</span>
              <h3 className="inspector-title">{activeSelected.title}</h3>
              <span className="inspector-provider">by {activeSelected.provider}</span>
            </div>

            <div className="inspector-body">
              <p className="inspector-desc">{activeSelected.description}</p>

              <div className="inspector-meta-grid">
                <div className="meta-box">
                  <Clock size={16} className="text-cyan-400" />
                  <div>
                    <span className="meta-val">{activeSelected.duration}</span>
                    <span className="meta-lbl">Est. Duration</span>
                  </div>
                </div>

                <div className="meta-box">
                  <Sparkles size={16} className="text-purple-400" />
                  <div>
                    <span className="meta-val">{activeSelected.aiRationale?.relevanceScore || 95}%</span>
                    <span className="meta-lbl">Relevance</span>
                  </div>
                </div>
              </div>

              {/* Why Recommended AI Box */}
              <div className="inspector-rationale-box">
                <span className="text-xs font-bold text-indigo-300 block mb-1">💡 AI Recommendation Rationale:</span>
                <p className="text-xs text-gray-300">{activeSelected.aiRationale?.primaryReason}</p>
              </div>

              {/* Action Buttons */}
              <div className="inspector-actions">
                {activeSelected.url && (
                  <a 
                    href={activeSelected.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-primary w-full justify-center"
                  >
                    <Play size={16} />
                    <span>Launch Step Learning</span>
                  </a>
                )}

                <button 
                  className={`btn-secondary w-full justify-center ${activeSelected.completed ? 'is-completed' : ''}`}
                  onClick={() => toggleResourceCompletion(activeSelected.id)}
                >
                  {activeSelected.completed ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      <span>Mark Step Incomplete</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Mark Step Solved / Complete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
