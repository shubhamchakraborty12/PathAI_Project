import React from 'react';
import { useLearning } from '../context/LearningContext';
import { DailyDSAChallenge } from './DailyDSAChallenge';
import { Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { 
  Award, 
  CheckCircle2, 
  Clock, 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Target, 
  BookOpen, 
  TrendingUp, 
  Layers,
  GraduationCap
} from 'lucide-react';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

export const Dashboard = () => {
  const { 
    profile, 
    enrolledCourse, 
    dsaStreak, 
    isDsaSolvedToday, 
    markDsaSolved, 
    gapResult, 
    activeRoadmap, 
    toggleResourceCompletion, 
    setActiveTab, 
    userStreak, 
    studyLogs 
  } = useLearning();

  const safeRoadmap = activeRoadmap || {};
  const targetRole = safeRoadmap.targetRole || { title: 'Target Role', category: 'Tech' };
  const phases = safeRoadmap.phases || [];
  const totalDurationHours = safeRoadmap.totalDurationHours || 0;
  const estimatedWeeks = safeRoadmap.estimatedWeeks || 0;

  const totalItems = safeRoadmap.totalResourcesCount || 1;
  const completedCount = safeRoadmap.completedResourcesCount || 0;
  const progressPercent = Math.round((completedCount / totalItems) * 100);

  // Find immediate next pending resource
  let nextUpResource = null;
  if (Array.isArray(phases)) {
    for (const phase of phases) {
      if (phase && Array.isArray(phase.items)) {
        for (const item of phase.items) {
          if (!item.completed) {
            nextUpResource = item;
            break;
          }
        }
      }
      if (nextUpResource) break;
    }
  }

  // Prepare Radar Chart Data for Skill Balance
  const gapAnalysisList = gapResult?.gapAnalysis || [];
  const radarLabels = gapAnalysisList.map(g => g.name);
  const userScores = gapAnalysisList.map(g => g.userScore);
  const targetScores = gapAnalysisList.map(g => g.targetScore);

  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: 'Current Skill Mastery',
        data: userScores,
        backgroundColor: 'rgba(99, 102, 241, 0.25)',
        borderColor: '#6366f1',
        borderWidth: 2,
        pointBackgroundColor: '#6366f1',
        pointBorderColor: '#fff',
      },
      {
        label: `Target (${targetRole.title || 'Target Role'})`,
        data: targetScores,
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderColor: '#06b6d4',
        borderWidth: 2,
        borderDash: [4, 4],
        pointBackgroundColor: '#06b6d4',
        pointBorderColor: '#fff',
      }
    ]
  };

  const radarOptions = {
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { color: '#9ca3af', font: { size: 11 } },
        ticks: { display: false, max: 3, min: 0 }
      }
    },
    plugins: {
      legend: {
        labels: { color: '#f3f4f6', font: { family: 'Plus Jakarta Sans', size: 12 } }
      }
    },
    maintainAspectRatio: false
  };

  // Study Hours Bar Chart Data
  const barData = {
    labels: studyLogs.map(l => l.date),
    datasets: [
      {
        label: 'Study Hours',
        data: studyLogs.map(l => l.hours),
        backgroundColor: '#8b5cf6',
        borderRadius: 6
      }
    ]
  };

  const barOptions = {
    scales: {
      x: { grid: { display: false }, ticks: { color: '#9ca3af' } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } }
    },
    plugins: {
      legend: { display: false }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="dashboard-container">
      {/* Dashboard Top Hero Greeting */}
      <div className="dash-hero-card">
        <div className="hero-left">
          <div className="hero-welcome">
            <img src={profile.avatar} alt={profile.name} className="hero-avatar" />
            <div>
              <span className="welcome-tag">Welcome Back, {profile.name} 👋</span>
              <h2 className="hero-goal-title">Target Goal: <span className="gradient-text">{targetRole.title}</span></h2>
              {enrolledCourse ? (
                <div className="enrolled-status-chip mt-2">
                  <GraduationCap size={14} className="text-cyan-400" />
                  <span>Enrolled Course: <strong>{enrolledCourse.title}</strong></span>
                </div>
              ) : (
                <p className="hero-bio">{profile.bio}</p>
              )}
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="progress-ring-card">
            <div className="circle-progress">
              <span className="progress-val-text">{progressPercent}%</span>
              <span className="progress-lbl-text">Completed</span>
            </div>
            <div className="progress-details">
              <span><strong>{completedCount}</strong> of <strong>{totalItems}</strong> Milestones Done</span>
              <button className="btn-primary-sm mt-2" onClick={() => setActiveTab('roadmap')}>
                <span>Continue Roadmap</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Daily DSA Problem Practice Challenge Widget */}
      <DailyDSAChallenge 
        dsaStreak={dsaStreak}
        isSolvedToday={isDsaSolvedToday}
        onMarkSolved={markDsaSolved}
      />

      {/* Metrics Row */}
      <div className="dash-stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper bg-indigo-500/20 text-indigo-400">
            <Award size={24} />
          </div>
          <div>
            <span className="stat-value">{gapResult.readinessPercentage}%</span>
            <span className="stat-label">Role Readiness Score</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-amber-500/20 text-amber-400">
            <Flame size={24} />
          </div>
          <div>
            <span className="stat-value">{userStreak} Days</span>
            <span className="stat-label">Daily Study Streak</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-cyan-500/20 text-cyan-400">
            <Clock size={24} />
          </div>
          <div>
            <span className="stat-value">{totalDurationHours} hrs</span>
            <span className="stat-label">Estimated Path Effort</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper bg-purple-500/20 text-purple-400">
            <TrendingUp size={24} />
          </div>
          <div>
            <span className="stat-value">~{estimatedWeeks} Weeks</span>
            <span className="stat-label">Target Completion</span>
          </div>
        </div>
      </div>

      {/* Next Recommended Action Banner */}
      {nextUpResource && (
        <div className="next-action-card">
          <div className="next-action-badge">
            <Sparkles size={16} className="text-amber-400" />
            <span>AI Recommended Next Step</span>
          </div>

          <div className="next-action-body">
            <div>
              <span className="next-type-tag">{nextUpResource.type} • {nextUpResource.level}</span>
              <h3 className="next-title">{nextUpResource.title}</h3>
              <p className="next-desc">{nextUpResource.description}</p>
              <div className="next-rationale font-medium text-indigo-300 mt-2">
                💡 Why now: {nextUpResource.aiRationale?.primaryReason}
              </div>
            </div>

            <div className="next-cta-group">
              {nextUpResource.url && (
                <a href={nextUpResource.url} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <span>Start Learning Now</span>
                  <ArrowRight size={16} />
                </a>
              )}
              <button 
                className="btn-secondary"
                onClick={() => toggleResourceCompletion(nextUpResource.id)}
              >
                Mark Complete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visual Analytics Grid */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Skill Proficiency Radar Diagnostic</h3>
            <span className="text-xs text-gray-400">Comparing baseline vs required goal</span>
          </div>
          <div className="chart-body radar-container">
            <Radar data={radarData} options={radarOptions} />
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Weekly Learning Hours Log</h3>
            <span className="text-xs text-emerald-400">Streak Active! 🔥</span>
          </div>
          <div className="chart-body bar-container">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
};
