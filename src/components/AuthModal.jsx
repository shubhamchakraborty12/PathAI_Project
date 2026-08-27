import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Lock, Mail, User, ArrowRight, Sparkles, CheckCircle2, KeyRound } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, login, register, quickDemoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register' | 'demo'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Automatically reset all input fields whenever modal opens
  useEffect(() => {
    if (authModalOpen) {
      setName('');
      setEmail('');
      setPassword('');
      setErrorMsg('');
    }
  }, [authModalOpen]);

  const handleClose = () => {
    setAuthModalOpen(false);
    setErrorMsg('');
    setName('');
    setEmail('');
    setPassword('');
  };

  if (!authModalOpen) return null;

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login(email, password);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!name.trim()) {
      setErrorMsg("Please enter your full name.");
      return;
    }
    setIsSubmitting(true);
    try {
      await register(name, email, password);
      setName('');
      setEmail('');
      setPassword('');
    } catch (err) {
      setErrorMsg(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div className="modal-content auth-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-group">
            <Lock className="modal-icon text-indigo-400" />
            <div>
              <h3>Access Your Personal PathAI Workspace</h3>
              <p className="modal-subtitle">Log in or create a free account to generate personalized learning paths and track your progress.</p>
            </div>
          </div>
          <button className="btn-close" onClick={handleClose}><X size={20} /></button>
        </div>

        {/* Tab Selector */}
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setName(''); setEmail(''); setPassword(''); }}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setName(''); setEmail(''); setPassword(''); }}
          >
            Create New Account
          </button>
          <button 
            className={`auth-tab ${activeTab === 'demo' ? 'active' : ''}`}
            onClick={() => { setActiveTab('demo'); setErrorMsg(''); setName(''); setEmail(''); setPassword(''); }}
          >
            ⚡ Quick Demo Login
          </button>
        </div>

        {errorMsg && (
          <div className="auth-error-banner">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Sign In Form */}
        {activeTab === 'login' && (
          <form className="auth-form" onSubmit={handleLoginSubmit} autoComplete="off">
            <div className="input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="field-icon" />
                <input 
                  type="email" 
                  required 
                  placeholder="alex@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="off"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <KeyRound size={16} className="field-icon" />
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="auth-input"
                />
              </div>
            </div>

            <button type="submit" className="btn-primary w-full mt-4" disabled={isSubmitting}>
              <span>{isSubmitting ? 'Signing In...' : 'Sign In to Workspace'}</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Register Form */}
        {activeTab === 'register' && (
          <form className="auth-form" onSubmit={handleRegisterSubmit} autoComplete="off">
            <div className="input-group">
              <label>Full Name</label>
              <div className="input-with-icon">
                <User size={16} className="field-icon" />
                <input 
                  type="text" 
                  required 
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  autoComplete="off"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Email Address</label>
              <div className="input-with-icon">
                <Mail size={16} className="field-icon" />
                <input 
                  type="email" 
                  required 
                  placeholder="sarah@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete="off"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="input-group">
              <label>Password</label>
              <div className="input-with-icon">
                <KeyRound size={16} className="field-icon" />
                <input 
                  type="password" 
                  required 
                  placeholder="Choose password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="auth-input"
                />
              </div>
            </div>

            <div className="survey-notice-box">
              <Sparkles size={16} className="text-cyan-400" />
              <span>After signing up, you'll immediately take a quick 2-minute onboarding survey to customize your dashboard!</span>
            </div>

            <button type="submit" className="btn-primary w-full mt-4">
              <span>Create Account & Start Onboarding</span>
              <ArrowRight size={16} />
            </button>
          </form>
        )}

        {/* Demo Accounts Presets */}
        {activeTab === 'demo' && (
          <div className="demo-accounts-list">
            <p className="text-xs text-gray-400 mb-3">Click any pre-configured user profile to instantly test session isolation and custom roadmaps:</p>
            
            <button className="demo-user-card" onClick={() => quickDemoLogin('user-alex')}>
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" alt="Alex" className="demo-avatar" />
              <div>
                <span className="demo-name">Alex Chen</span>
                <span className="demo-role">Junior Web Dev → Full-Stack AI Engineer</span>
              </div>
              <ArrowRight size={16} className="ml-auto text-indigo-400" />
            </button>

            <button className="demo-user-card" onClick={() => quickDemoLogin('user-priya')}>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" alt="Priya" className="demo-avatar" />
              <div>
                <span className="demo-name">Priya Sharma</span>
                <span className="demo-role">Data Analyst → Data Scientist & ML Specialist</span>
              </div>
              <ArrowRight size={16} className="ml-auto text-indigo-400" />
            </button>

            <button className="demo-user-card" onClick={() => quickDemoLogin('user-david')}>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" alt="David" className="demo-avatar" />
              <div>
                <span className="demo-name">David Miller</span>
                <span className="demo-role">SysAdmin → Cloud DevOps Architect</span>
              </div>
              <ArrowRight size={16} className="ml-auto text-indigo-400" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
