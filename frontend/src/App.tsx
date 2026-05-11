import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import OptimizationAdvisor from './pages/OptimizationAdvisor';
import History from './pages/History';
import Feed from './pages/Feed';
import Explore from './pages/Explore';
import Reels from './pages/Reels';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { AIProvider } from './context/AIContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <AIProvider>
        <Router>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#ffffff',
                color: '#1e293b',
                borderRadius: '16px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#a855f7',
                  secondary: '#ffffff',
                },
              },
              className: 'dark:!bg-zinc-900 dark:!text-zinc-100 dark:!border-zinc-800 dark:!border',
            }}
          />
          <Routes>
            <Route 
              path="/feed" 
              element={
                <Layout>
                  <Feed />
                </Layout>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-post" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <CreatePost />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/optimization-advisor" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <OptimizationAdvisor />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/history" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <History />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/explore" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Explore />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reels" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Reels />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<div className="p-8 text-center font-bold">Page coming soon!</div>} />
          </Routes>
        </Router>
      </AIProvider>
    </ThemeProvider>
  );
}

export default App;
