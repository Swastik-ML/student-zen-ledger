
import { Student, FinancialSummary } from "../utils/types";

export const calculateFinancialSummary = (students: Student[]): FinancialSummary => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  // Calculate counts for each class type
  const studentCounts = {
    "Ho'oponopo": 0,
    "Astrology": 0,
    "Pooja": 0
  };
  
  // Calculate payment totals by method
  const paymentsByMethod = {
    "Cash": 0,
    "Bank Transfer": 0,
    "UPI": 0,
    "Check": 0,
    "Other": 0
  };
  
  // Calculate the financial summary
  let totalRevenue = 0;
  let monthlyRevenue = 0;
  let yearlyRevenue = 0;
  
  // Process all students
  students.forEach(student => {
    // Count students by class type
    if (student.classType in studentCounts) {
      studentCounts[student.classType]++;
    }
    
    // Calculate total revenue from all fees
    totalRevenue += student.payment;
    
    // Calculate payment totals by method
    const studentPaymentMethod = student.paymentMethod;
    if (studentPaymentMethod in paymentsByMethod) {
      paymentsByMethod[studentPaymentMethod] += student.payment;
    }
    
    // Check if student started this month
    const studentStartDate = new Date(student.startDate);
    if (studentStartDate.getMonth() === currentMonth && 
        studentStartDate.getFullYear() === currentYear) {
      monthlyRevenue += student.payment;
    }
    
    // Check if student started this year
    if (studentStartDate.getFullYear() === currentYear) {
      yearlyRevenue += student.payment;
    }
    
    // Add payment history revenue
    student.paymentHistory.forEach(payment => {
      const paymentDate = new Date(payment.date);
      totalRevenue += payment.amount;
      
      if (paymentDate.getMonth() === currentMonth && 
          paymentDate.getFullYear() === currentYear) {
        monthlyRevenue += payment.amount;
      }
      
      if (paymentDate.getFullYear() === currentYear) {
        yearlyRevenue += payment.amount;
      }
      
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

// Helper function to determine if a student is active
export const isStudentActive = (student: Student): boolean => {
  if (!student.endDate) return true;
  
  const now = new Date();
  const endDate = new Date(student.endDate);
  return endDate >= now;
};
