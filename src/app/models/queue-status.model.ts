export interface QueueStatusDto {
  currentServing: number;
  windowNumber?: number;
  waitingCount: number;
  completedCount: number;
  totalBookings: number;
  date: string;
  isActive: boolean;
  lastRecallTime?: string;
}

