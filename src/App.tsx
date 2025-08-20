import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { AuthProvider } from './contexts/AuthContext';
import { CollaborationProvider } from './contexts/CollaborationContext';
import { useCollaboration } from './contexts/CollaborationContext';
import ErrorBoundary from './components/ErrorBoundary';
import { ConnectionStatus } from './components/Loading';
import Navigation from './components/Navigation';
import LiveCursors from './components/collaboration/LiveCursors';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Ideation from './pages/Ideation';
import Strategy from './pages/Strategy';
import Library from './pages/Library';
import Analytics from './pages/Analytics';
import Collaboration from './pages/Collaboration';

// Component to handle connection status
const AppContent: React.FC = () => {
  const { isConnected, isLoading, reconnectAttempts, retry } = useCollaboration();

  return (
    <>
      <ConnectionStatus
        isConnected={isConnected}
        isReconnecting={isLoading}
        reconnectAttempts={reconnectAttempts}
        onRetry={retry}
      />
      <div className="min-h-screen bg-cream">
        <Navigation />
        <LiveCursors />
        <main className="transition-all duration-300 ease-in-out">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/ideation" element={<Ideation />} />
            <Route path="/strategy" element={<Strategy />} />
            <Route path="/library" element={<Library />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/collaboration" element={<Collaboration />} />
          </Routes>
        </main>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <DatabaseProvider>
        <CollaborationProvider>
          <DndProvider backend={HTML5Backend}>
            <Router>
              <div className="min-h-screen bg-cream">
                <Navigation />
                <LiveCursors />
                <main className="transition-all duration-300 ease-in-out">
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/ideation" element={<Ideation />} />
                    <Route path="/strategy" element={<Strategy />} />
                    <Route path="/library" element={<Library />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/collaboration" element={<Collaboration />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </DndProvider>
        </CollaborationProvider>
      </DatabaseProvider>
    </AuthProvider>
  );
}

export default App;
