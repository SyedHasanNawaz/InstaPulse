import React, { createContext, useContext, useState, ReactNode } from 'react';
import { apiService } from '../services/api';

interface AIContextType {
  dashboardData: any;
  advisorData: any;
  historyData: any;
  loadingDashboard: boolean;
  loadingAdvisor: boolean;
  loadingHistory: boolean;
  advisorForm: {
    category: string;
    mediaType: string;
    followers: number;
    day: string;
    hour: number;
  };
  setAdvisorForm: (form: any) => void;
  getDashboardData: (force?: boolean) => Promise<void>;
  getAdvisorData: (category?: string, mediaType?: string, followers?: number, day?: string, hour?: number, force?: boolean) => Promise<void>;
  getHistoryData: (force?: boolean) => Promise<void>;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export const AIProvider = ({ children }: { children: ReactNode }) => {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [advisorData, setAdvisorData] = useState<any>(null);
  const [historyData, setHistoryData] = useState<any[] | null>(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [loadingAdvisor, setLoadingAdvisor] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  
  // Persistent Form State
  const [advisorForm, setAdvisorForm] = useState({
    category: "Technology",
    mediaType: "reel",
    followers: 5000,
    day: "Monday",
    hour: 12
  });

  const getDashboardData = async (force: boolean = false) => {
    if (dashboardData && !force) return;
    setLoadingDashboard(true);
    try {
      const data = await apiService.getDashboardData();
      setDashboardData(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoadingDashboard(false);
    }
  };

  const getAdvisorData = async (
    category: string = advisorForm.category, 
    mediaType: string = advisorForm.mediaType, 
    followers: number = advisorForm.followers,
    day: string = advisorForm.day,
    hour: number = advisorForm.hour,
    force: boolean = false
  ) => {
    if (advisorData && !force) return;
    setLoadingAdvisor(true);
    try {
      const data = await apiService.getOptimizationAdvice(category, mediaType, followers, day, hour);
      console.log('AI Advisor Response:', data);
      setAdvisorData(data);
    } catch (error) {
      console.error('Error fetching optimization advice:', error);
    } finally {
      setLoadingAdvisor(false);
    }
  };

  const getHistoryData = async (force: boolean = false) => {
    if (historyData && !force) return;
    setLoadingHistory(true);
    try {
      const data = await apiService.getHistory();
      setHistoryData(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoadingHistory(false);
    }
  };

  return (
    <AIContext.Provider value={{ 
      dashboardData, 
      advisorData, 
      historyData,
      loadingDashboard, 
      loadingAdvisor, 
      loadingHistory,
      advisorForm,
      setAdvisorForm,
      getDashboardData, 
      getAdvisorData,
      getHistoryData
    }}>
      {children}
    </AIContext.Provider>
  );
};

export const useAI = () => {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
};
