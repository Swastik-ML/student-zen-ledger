
// Class types supported by the application
export type ClassType = 'Ho\'oponopo' | 'Astrology' | 'Pooja';

// Payment methods supported by the application
export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'UPI' | 'Check' | 'Other';

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
