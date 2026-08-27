import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CAREER_ROLES } from '../data/skillTaxonomy';
import { 
  BrainCircuit, 
  Sparkles, 
  MapPin, 
  Target, 
  UserCheck, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  BookOpen, 
  Bot, 
  BarChart3, 
  Lock, 
  Zap 
} from 'lucide-react';

export const PublicLanding = ({ onExploreCatalog, onSwitchTab }) => {
  const { setAuthModalOpen, isAuthenticated } = useAuth();

  return (
    <div className="landing-page-container">
      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-badge-pill">
          <Sparkles size={14} className="text-cyan-400" />
          <span>Next-Generation Personalized Learning Engine</span>
        </div>

        <h1 className="hero-headline">
          Master Any Technology with <br />
          <span className="gradient-text">AI-Powered Personalized Roadmaps</span>
        </h1>

        <p className="hero-subtext">
          Stop struggling with generic one-size-fits-all courses. PathAI analyzes your skill baseline, identifies technical skill gaps via interactive diagnostic surveys, and crafts tailored step-by-step roadmaps.
        </p>

        <div className="hero-cta-buttons">
          <button 
            className="btn-primary-hero"
            onClick={() => setAuthModalOpen(true)}
          >
            <Zap size={18} />
            <span>Create Free Account & Start Survey</span>
          </button>

          <button 
            className="btn-secondary-hero"
            onClick={onExploreCatalog}
          >
            <BookOpen size={18} />
            <span>Explore Course Catalog</span>
          </button>
        </div>

        {/* Feature Highlights Banner */}
        <div className="hero-highlights-row">
          <div className="highlight-item">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>AI Skill Gap Diagnostics</span>
          </div>
          <div className="highlight-item">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Interactive MCQ Onboarding Quiz</span>
          </div>
          <div className="highlight-item">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Isolated Personal Workspace</span>
          </div>
          <div className="highlight-item">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>Transparent "Why Recommended" AI Tags</span>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-tag">AUTOMATED LEARNING ENGINE</span>
          <h2 className="section-title">How PathAI Builds Your Customized Path</h2>
          <p className="section-desc">Experience a seamless workflow from initial survey to career role mastery.</p>
        </div>

        <div className="steps-cards-grid">
          <div className="step-card">
            <div className="step-number">01</div>
            <div className="step-icon-wrapper bg-indigo-500/20 text-indigo-400">
              <UserCheck size={28} />
            </div>
            <h4>1. Secure Login & Diagnostic Survey</h4>
            <p>Create your private account. Complete an initial MCQ tech quiz to benchmark your current Python, JS, Cloud, or Data skill baseline.</p>
          </div>

          <div className="step-card">
            <div className="step-number">02</div>
            <div className="step-icon-wrapper bg-purple-500/20 text-purple-400">
              <BrainCircuit size={28} />
            </div>
            <h4>2. AI Skill Gap Calculation</h4>
            <p>Our recommendation engine maps your survey responses against target industry requirements to pinpoint exact skill gaps.</p>
          </div>

          <div className="step-card">
            <div className="step-number">03</div>
            <div className="step-icon-wrapper bg-cyan-500/20 text-cyan-400">
              <BarChart3 size={28} />
            </div>
            <h4>3. Dynamic Structured Roadmap</h4>
            <p>Receive a multi-phase visual timeline complete with prerequisites, video courses, capstone projects, and clear AI rationales.</p>
          </div>

          <div className="step-card">
            <div className="step-number">04</div>
            <div className="step-icon-wrapper bg-emerald-500/20 text-emerald-400">
              <Bot size={28} />
            </div>
            <h4>4. Private AI Study Assistant</h4>
            <p>Ask queries in natural language, request alternative recommendations, and track daily study streaks in your private workspace.</p>
          </div>
        </div>
      </section>

      {/* Featured Technology Career Tracks */}
      <section className="landing-section">
        <div className="section-header-center">
          <span className="section-tag">POPULAR LEARNING TRACKS</span>
          <h2 className="section-title">Choose Your Target Technology Goal</h2>
          <p className="section-desc">Select from high-demand technical career paths curated by industry experts.</p>
        </div>

        <div className="tracks-landing-grid">
          {CAREER_ROLES.map(role => (
            <div key={role.id} className="track-landing-card">
              <div className="track-card-header">
                <span className="track-category">{role.category}</span>
                <h3 className="track-title">{role.title}</h3>
              </div>

              <p className="track-desc">{role.description}</p>

              <div className="track-skills-tags">
                {role.requiredSkills.slice(0, 4).map(s => (
                  <span key={s.id} className="track-skill-chip">{s.name}</span>
                ))}
                {role.requiredSkills.length > 4 && (
                  <span className="track-skill-chip count">+{role.requiredSkills.length - 4} skills</span>
                )}
              </div>

              <div className="track-card-footer">
                <span className="salary-info">{role.avgSalary}</span>
                <button 
                  className="btn-track-cta"
                  onClick={() => setAuthModalOpen(true)}
                >
                  <span>Build This Path</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Login CTA Banner */}
      <section className="landing-cta-banner">
        <div className="cta-banner-content">
          <h2>Ready to transform your tech learning journey?</h2>
          <p>Join thousands of developers using PathAI to generate personalized learning paths and achieve career breakthroughs.</p>
          <button 
            className="btn-primary-hero mt-4"
            onClick={() => setAuthModalOpen(true)}
          >
            <span>Sign In or Create Account</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
};
