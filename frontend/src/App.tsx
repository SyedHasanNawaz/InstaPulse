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
import { ThemeProvider } from './context/ThemeContext';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 5000,
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
            // Dark mode overrides
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
          {/* Public Routes (No Layout) */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          {/* Protected Routes (With Layout) */}
          <Route 
            path="/dashboard" 
            element={
              <Layout>
                <Dashboard />
              </Layout>
            } 
          />
          <Route 
            path="/create-post" 
            element={
              <Layout>
                <CreatePost />
              </Layout>
            } 
          />
          <Route 
            path="/optimization-advisor" 
            element={
              <Layout>
                <OptimizationAdvisor />
              </Layout>
            } 
          />
          <Route 
            path="/history" 
            element={
              <Layout>
                <History />
              </Layout>
            } 
          />

          <Route 
            path="/explore" 
            element={
              <Layout>
                <Explore />
              </Layout>
            } 
          />

          <Route 
            path="/reels" 
            element={
              <Layout>
                <Reels />
              </Layout>
            } 
          />

          <Route 
            path="/profile" 
            element={
              <Layout>
                <Profile />
              </Layout>
            } 
          />

          <Route 
            path="/settings" 
            element={
              <Layout>
                <Settings />
              </Layout>
            } 
          />

          {/* Catch-all */}
          <Route path="*" element={<div className="p-8 text-center font-bold">Page coming soon!</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
