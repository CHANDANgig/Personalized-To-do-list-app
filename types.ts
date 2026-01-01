
export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH'
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  category: string;
  createdAt: number;
  completedAt?: number;
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
