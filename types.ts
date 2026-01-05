
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

// Added Task interface to fix missing import errors in related components
export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
}

export interface Habit {
  id: string;
  name: string;
  goal: number; // monthly target
  completedDays: number[]; // Array of day numbers (1-31)
  category: string;
  createdAt: number;
}

export interface DailyMetrics {
  date: string; // YYYY-MM-DD
  screenTime: number; // minutes
  mood: number; // 1-10
  energy: number; // 1-10
  achievement?: string;
}

export interface DailyStats {
  date: string;
  completed: number;
  total: number;
}

export interface AIInsights {
  productivityScore: number;
  summary: string;
  suggestions: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  picture: string;
}
