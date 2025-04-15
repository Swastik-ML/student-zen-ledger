
// Class types supported by the application
export type ClassType = 'Ho\'oponopo' | 'Astrology' | 'Pooja';

// Payment methods supported by the application
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'UPI' | 'Check' | 'Other';

/**
 * Represents a student in the system
 */
export interface Student {
  id: string;
  serialNumber: number;
  name: string;
  studentId: string;
  startDate: string;
  endDate: string | null;
  payment: number;
  paymentMethod: PaymentMethod;
  classType: ClassType;
  pictureUrl: string | null;
  paymentHistory: Payment[];
  classTime?: string | null;
  classSection?: string | null;
}

/**
 * Represents a payment record
 */
export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
}

/**
 * Financial summary for analytics
 */
export interface FinancialSummary {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  studentCounts: {
    [key in ClassType]: number;
  };
  paymentsByMethod: {
    [key in PaymentMethod]: number;
  };
}

/**
 * Period filter for analytics
 */
export type PeriodFilter = 'day' | 'week' | 'month' | 'year' | 'all';

/**
 * Chart data point
 */
export interface ChartDataPoint {
  name: string;
  value: number;
}
