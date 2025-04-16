
import { Student } from "@/utils/types";
import { isStudentActive } from "../mockData";

export const OPENING_BALANCE = 1027277; // Static opening balance for 2022-2024

// Calculate financial summary with proper monthly and yearly revenue
export const calculateFinancialSummary = (students: Student[]) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  
  let totalRevenue = 0;
  let monthlyRevenue = 0;
  let yearlyRevenue = 0;
  
  const studentCounts = {
    "Ho'oponopo": 0,
    "Astrology": 0,
    "Pooja": 0
  };
  
  const paymentsByMethod: Record<string, number> = {};
  
  // First, calculate total revenue from all students and their payments
  students.forEach(student => {
    // Add initial payment to total revenue
    totalRevenue += student.payment;
    
    // Calculate monthly and yearly revenue
    const startDate = new Date(student.startDate);
    if (startDate.getFullYear() === currentYear && startDate.getMonth() === currentMonth) {
      monthlyRevenue += student.payment;
    }
    
    if (startDate.getFullYear() === currentYear) {
      yearlyRevenue += student.payment;
    }
    
    // Count students by class type (only consider active or upcoming students)
    const isUpcomingOrActive = isStudentActive(student) || new Date(student.startDate) > currentDate;
    if (student.classType in studentCounts && isUpcomingOrActive) {
      studentCounts[student.classType]++;
    }
    
    // Count payments by method
    const method = student.paymentMethod;
    paymentsByMethod[method] = (paymentsByMethod[method] || 0) + student.payment;
    
    // Include payment history in calculations
    student.paymentHistory.forEach(payment => {
      // Add payment to total revenue
      totalRevenue += payment.amount;
      
      const paymentDate = new Date(payment.date);
      
      // Monthly revenue - include any payment made in the current month of the current year
      if (paymentDate.getFullYear() === currentYear && paymentDate.getMonth() === currentMonth) {
        monthlyRevenue += payment.amount;
      }
      
      // Yearly revenue - include any payment made in the current year
      if (paymentDate.getFullYear() === currentYear) {
        yearlyRevenue += payment.amount;
      }
      
      // Count payments by method
      const paymentMethod = payment.method;
      paymentsByMethod[paymentMethod] = (paymentsByMethod[paymentMethod] || 0) + payment.amount;
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
