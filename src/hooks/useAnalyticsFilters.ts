import { useState, useEffect } from "react";
import { Student } from "@/utils/types";
import { 
  generateMonthlyData, 
  generateClassTypeData, 
  generateTopStudentsData, 
  hasDataForYear, 
  getAvailableYears 
} from "@/utils/financialUtils";

interface AnalyticsFiltersResult {
  selectedYear: string;
  availableYears: number[];
  monthlyData: Array<{ name: string; amount: number }>;
  classTypeData: Array<{ name: string; value: number }>;
  topStudentsData: Array<{ name: string; amount: number }>;
  paymentMethodData: Array<{ name: string; amount: number }>;
  hasData: boolean;
  setSelectedYear: (year: string) => void;
}

/**
 * Custom hook for filtering analytics data by year
 */
export const useAnalyticsFilters = (students: Student[]): AnalyticsFiltersResult => {
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const availableYears = getAvailableYears(students);
  
  // Generate filtered data based on selected year
  const monthlyData = generateMonthlyData(students, selectedYear);
  const classTypeData = generateClassTypeData(students);
  const topStudentsData = generateTopStudentsData(students);
  
  // Calculate payment method data
  const paymentMethods: Record<string, number> = {};
  
  students.forEach(student => {
    const startYear = new Date(student.startDate).getFullYear().toString();
    
    if (startYear === selectedYear) {
      const method = student.paymentMethod;
      paymentMethods[method] = (paymentMethods[method] || 0) + student.payment;
    }
    
    student.paymentHistory.forEach(payment => {
      const paymentYear = new Date(payment.date).getFullYear().toString();
      
      if (paymentYear === selectedYear) {
        const method = payment.method;
        paymentMethods[method] = (paymentMethods[method] || 0) + payment.amount;
      }
    });
  });
  
  const paymentMethodData = Object.entries(paymentMethods).map(
    ([name, amount]) => ({ name, amount })
  ).filter(item => item.amount > 0);
  
  // Check if data exists for the selected year
  const hasData = hasDataForYear(students, selectedYear);
  
  return {
    selectedYear,
    availableYears,
    monthlyData,
    classTypeData,
    topStudentsData,
    paymentMethodData,
    hasData,
    setSelectedYear,
  };
};
