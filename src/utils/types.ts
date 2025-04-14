export type ClassType = 'Ho\'oponopo' | 'Astrology' | 'Pooja';

export type PaymentMethod = 'Cash' | 'Bank Transfer' | 'UPI' | 'Check' | 'Other';

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

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  method: PaymentMethod;
}

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
