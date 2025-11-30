export interface QueueStatusDto {
  currentServing: number;
  windowNumber?: number;
  windowName?: string;
  waitingCount: number;
  completedCount: number;
  totalBookings: number;
  date: string;
  isActive: boolean;
  lastRecallTime?: string;
}

