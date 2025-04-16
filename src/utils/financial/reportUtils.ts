
import { Student } from "@/utils/types";
import { generateMonthlyData, generateClassTypeData, generateTopStudentsData } from "./chartDataGenerators";
import { calculateFinancialSummary } from "./financialCalculations";

// Check if data exists for selected year
export const hasDataForYear = (students: Student[], selectedYear: string) => {
  const currentYear = parseInt(selectedYear);
  
  // Check if there are any students who started in the selected year
  const hasStudentStartsInYear = students.some(student => {
    const startDate = new Date(student.startDate);
    return startDate.getFullYear() === currentYear;
  });
  
  // Check if there are any payments in the selected year
  const hasPaymentsInYear = students.some(student => {
    return student.paymentHistory.some(payment => {
      const paymentDate = new Date(payment.date);
      return paymentDate.getFullYear() === currentYear;
    });
  });
  
  return hasStudentStartsInYear || hasPaymentsInYear;
};

// Get available years from the payment data
export const getAvailableYears = (students: Student[]) => {
  const years = new Set<number>();
  const currentYear = new Date().getFullYear();
  
  // Add current year and previous years as default options
  years.add(currentYear);
  years.add(currentYear - 1);
  years.add(currentYear - 2);
  
  // Add years from actual payment data
  students.forEach(student => {
    const startYear = new Date(student.startDate).getFullYear();
    years.add(startYear);
    
    student.paymentHistory.forEach(payment => {
      const paymentYear = new Date(payment.date).getFullYear();
      years.add(paymentYear);
    });
  });
  
  return Array.from(years).sort((a, b) => b - a);
};

// Function to export data as CSV
export const exportReportData = (students: Student[], selectedYear: string) => {
  // Get the selected year's data
  const yearData = generateMonthlyData(students, selectedYear);
  const classData = generateClassTypeData(students);
  const studentsData = generateTopStudentsData(students);
  const stats = calculateFinancialSummary(students);
  
  const methodData = Object.entries(stats.paymentsByMethod).map(
    ([method, amount]) => ({
      name: method,
      amount
    })
  ).filter(item => item.amount > 0);
  
  // Create CSV content
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Add monthly revenue data
  csvContent += "Monthly Revenue Data\r\n";
  csvContent += "Month,Amount\r\n";
  yearData.forEach(item => {
    csvContent += `${item.name},${item.amount}\r\n`;
  });
  
  csvContent += "\r\nClass Revenue Data\r\n";
  csvContent += "Class Type,Revenue\r\n";
  classData.forEach(item => {
    csvContent += `${item.name},${item.value}\r\n`;
  });
  
  csvContent += "\r\nTop Students Data\r\n";
  csvContent += "Student Name,Total Revenue\r\n";
  studentsData.forEach(item => {
    csvContent += `${item.name},${item.amount}\r\n`;
  });
  
  csvContent += "\r\nPayment Method Data\r\n";
  csvContent += "Method,Amount\r\n";
  methodData.forEach(item => {
    csvContent += `${item.name},${item.amount}\r\n`;
  });
  
  // Create download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `financial_report_${selectedYear}.csv`);
  document.body.appendChild(link);
  
  // Trigger download
  link.click();
  
  // Clean up
  document.body.removeChild(link);
};
