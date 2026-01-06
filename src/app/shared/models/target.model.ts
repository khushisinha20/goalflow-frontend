export interface Target {
  id: number;
  title: string;
  description?: string;
  targetDate: string;
  categoryId?: number;
  categoryName?: string;
  categoryColor?: string;
  executionStatus: ExecutionStatus;
  completionTime?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TargetRequest {
  title: string;
  description?: string;
  targetDate: string;
  categoryId?: number;
}

export enum ExecutionStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED',
  MISSED = 'MISSED'
}

export interface DailyStats {
  date: string;
  totalTargets: number;
  completedTargets: number;
  skippedTargets: number;
  missedTargets: number;
  pendingTargets: number;
  completionPercentage: number;
}

export interface ExecutionRequest {
  notes?: string;
}

export interface Streak {
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate?: string;
}