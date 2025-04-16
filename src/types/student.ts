
import { ClassType, PaymentMethod } from "./common";

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
