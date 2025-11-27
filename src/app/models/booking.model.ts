export interface BookingDto {
  name: string;
  phone: string;
  email?: string;
  bookingDateSelection: string;
}

export interface BookingResponseDto {
  id: number;
  name: string;
  phone: string;
  email?: string;
  bookingDate: string;
  queueNumber: number;
  status: string;
  windowNumber?: number;
  displayName: string;
}

export interface DashboardStatsDto {
  totalToday: number;
  waiting: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  employeeStats: EmployeeStatsDto[];
  timeStats?: TimeStatsDto;
}

export interface EmployeeStatsDto {
  name: string;
  count: number;
  completed: number;
  cancelled: number;
  averageTime: string;
  minTime: string;
  maxTime: string;
}

export interface TimeStatsDto {
  average: string;
  min: string;
  max: string;
  totalCompleted: number;
}

