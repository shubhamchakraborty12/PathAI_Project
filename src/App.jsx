import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LearningProvider, useLearning } from './context/LearningContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Navbar } from './components/Navbar';
import { PublicLanding } from './components/PublicLanding';
import { AuthModal } from './components/AuthModal';
import { OnboardingSurvey } from './components/OnboardingSurvey';
import { Dashboard } from './components/Dashboard';
import { RoadmapView } from './components/RoadmapView';
import { RoadmapFlowchart } from './components/RoadmapFlowchart';
import { ProfileEditor } from './components/ProfileEditor';
import { CatalogView } from './components/CatalogView';
import { ChatAssistant } from './components/ChatAssistant';
import { SkillDiagnostic } from './components/SkillDiagnostic';

const MainAppContent = () => {
  const { activeTab, setActiveTab } = useLearning();
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        {!isAuthenticated && (
          <>
            {activeTab === 'catalog' ? (
              <CatalogView />
            ) : (
              <PublicLanding onExploreCatalog={() => setActiveTab('catalog')} />
            )}
          </>
        )}

        {isAuthenticated && (
          <>
            {(activeTab === 'dashboard' || activeTab === 'landing') && <Dashboard />}
            {activeTab === 'flowchart' && <RoadmapFlowchart />}
            {activeTab === 'roadmap' && <RoadmapView />}
            {activeTab === 'profile' && <ProfileEditor />}
            {activeTab === 'catalog' && <CatalogView />}
            {activeTab === 'chat' && <ChatAssistant />}
          </>
        )}
      </main>

      <AuthModal />
      <OnboardingSurvey />
      <SkillDiagnostic />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <LearningProvider>
          <MainAppContent />
        </LearningProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
