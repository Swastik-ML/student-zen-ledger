
import { Student, FinancialSummary, Payment } from './types';

export const isStudentActive = (student: Student): boolean => {
  if (!student.endDate) return true;
  
  const now = new Date();
  const endDate = new Date(student.endDate);
  return endDate > now;
};

export const calculateFinancialSummary = (students: Student[]): FinancialSummary => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  let totalRevenue = 0;
  let monthlyRevenue = 0;
  let yearlyRevenue = 0;
  
  // Initialize counters for each class type
  const studentCounts = {
    "Ho'oponopo": 0,
    "Astrology": 0,
    "Pooja": 0
  };
  
  // Initialize counters for each payment method
  const paymentsByMethod = {
    "Cash": 0,
    "Bank Transfer": 0,
    "UPI": 0,
    "Check": 0,
    "Other": 0
  };
  
  // Process all students
  students.forEach(student => {
    // Count students by class type
    if (student.classType in studentCounts) {
      studentCounts[student.classType]++;
    }
    
    // Calculate total revenue and track payments by method
    totalRevenue += student.payment;
    
    // Add payment method totals
    if (student.paymentMethod in paymentsByMethod) {
      paymentsByMethod[student.paymentMethod] += student.payment;
    }
    
    // Process payment history
    student.paymentHistory.forEach(payment => {
      const paymentDate = new Date(payment.date);
      
      // Monthly revenue calculation
      if (paymentDate.getMonth() === currentMonth && paymentDate.getFullYear() === currentYear) {
        monthlyRevenue += payment.amount;
      }
      
      // Yearly revenue calculation
      if (paymentDate.getFullYear() === currentYear) {
        yearlyRevenue += payment.amount;
      }
      
      // Add to payment method totals from payment history
      if (payment.method in paymentsByMethod) {
        paymentsByMethod[payment.method] += payment.amount;
      }
    });
  });
  
  return {
    totalRevenue,
    monthlyRevenue,
    yearlyRevenue,
    studentCounts,
    paymentsByMethod
  };
};
