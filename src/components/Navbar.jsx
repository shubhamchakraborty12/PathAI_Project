import React, { useState } from 'react';
import { useLearning } from '../context/LearningContext';
import { useAuth } from '../context/AuthContext';
import { 
  BrainCircuit, 
  LayoutDashboard, 
  Map, 
  GitFork,
  UserCheck, 
  BookOpen, 
  MessageSquareCode, 
  Sparkles, 
  Flame,
  Download,
  Lock,
  LogOut,
  ChevronDown,
  Home,
  UserPlus
} from 'lucide-react';

export const Navbar = () => {
  const { activeTab, setActiveTab, profile, userStreak, setDiagnosticOpen } = useLearning();
  const { currentUser, isAuthenticated, setAuthModalOpen, setOnboardingSurveyOpen, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <header className="app-navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'landing')}>
          <div className="brand-icon-wrapper">
            <BrainCircuit className="brand-icon" />
          </div>
          <div className="brand-text">
            <span className="brand-name">Path<span className="brand-accent">AI</span></span>
            <span className="brand-tagline">Personalized Learning Recommender</span>
          </div>
        </div>

        {/* Primary Navigation Tabs */}
        <nav className="navbar-nav">
          {!isAuthenticated ? (
            <>
              <button 
                className={`nav-link ${activeTab === 'landing' ? 'active' : ''}`}
                onClick={() => setActiveTab('landing')}
              >
                <Home className="nav-icon" />
                <span>Home</span>
              </button>

              <button 
                className={`nav-link ${activeTab === 'catalog' ? 'active' : ''}`}
                onClick={() => setActiveTab('catalog')}
              >
                <BookOpen className="nav-icon" />
                <span>Browse Catalog</span>
              </button>
            </>
          ) : (
            <>
              <button 
                className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <LayoutDashboard className="nav-icon" />
                <span>Dashboard</span>
              </button>

              <button 
                className={`nav-link ${activeTab === 'flowchart' ? 'active' : ''}`}
                onClick={() => setActiveTab('flowchart')}
              >
                <GitFork className="nav-icon" />
                <span>Flowchart Graph</span>
                <span className="nav-badge">NEW</span>
              </button>

              <button 
                className={`nav-link ${activeTab === 'roadmap' ? 'active' : ''}`}
                onClick={() => setActiveTab('roadmap')}
              >
                <Map className="nav-icon" />
                <span>Visual Roadmap</span>
              </button>

              <button 
                className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                onClick={() => setActiveTab('profile')}
              >
                <UserCheck className="nav-icon" />
                <span>Profile & Skills</span>
              </button>

              <button 
                className={`nav-link ${activeTab === 'catalog' ? 'active' : ''}`}
                onClick={() => setActiveTab('catalog')}
              >
                <BookOpen className="nav-icon" />
                <span>Catalog</span>
              </button>

              <button 
                className={`nav-link ${activeTab === 'chat' ? 'active' : ''}`}
                onClick={() => setActiveTab('chat')}
              >
                <MessageSquareCode className="nav-icon" />
                <span>AI Assistant</span>
              </button>
            </>
          )}
        </nav>

        {/* Right Auth / User Menu */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <div className="streak-badge" title="Daily Learning Streak">
                <Flame className="streak-icon" />
                <span>{userStreak} Day Streak</span>
              </div>

              <button 
                className="btn-icon-only"
                onClick={handleExportPDF}
                title="Export / Print Roadmap Report"
              >
                <Download size={18} />
              </button>

              {/* User Dropdown */}
              <div className="user-dropdown-wrapper">
                <div 
                  className="persona-pill" 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <img src={currentUser.avatar || profile.avatar} alt={currentUser.name} className="persona-avatar" />
                  <div className="persona-info">
                    <span className="persona-name">{currentUser.name}</span>
                    <span className="persona-role">{profile.targetGoalId.replace('-', ' ').toUpperCase()}</span>
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </div>

                {dropdownOpen && (
                  <div className="dropdown-menu">
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        setDropdownOpen(false);
                        setOnboardingSurveyOpen(true);
                      }}
                    >
                      <Sparkles size={14} className="text-cyan-400" />
                      <span>Retake Tech Survey</span>
                    </button>

                    <button 
                      className="dropdown-item text-red-400"
                      onClick={() => {
                        setDropdownOpen(false);
                        logout();
                      }}
                    >
                      <LogOut size={14} />
                      <span>Log Out Session</span>
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="guest-actions">
              <button 
                className="btn-secondary-sm"
                onClick={() => setAuthModalOpen(true)}
              >
                <Lock size={14} />
                <span>Sign In</span>
              </button>

              <button 
                className="btn-primary-sm"
                onClick={() => setAuthModalOpen(true)}
              >
                <UserPlus size={14} />
                <span>Get Started</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
