
import { Student, Payment } from "./types";
import { isStudentActive } from "./mockData";

export const OPENING_BALANCE = 1027277; // Static opening balance for 2022-2024

// Generate monthly data from actual payments
export const generateMonthlyData = (students: Student[], selectedYear: string) => {
  const currentYear = parseInt(selectedYear);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Initialize with zero amounts for all months
  const monthlyData = months.map((month, index) => ({
    name: month,
    amount: 0
  }));
  
  // Aggregate actual payments by month
  students.forEach(student => {
    const startDate = new Date(student.startDate);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    
    if (startYear === currentYear) {
      monthlyData[startMonth].amount += student.payment;
    }
    
    student.paymentHistory.forEach(payment => {
      const paymentDate = new Date(payment.date);
      const paymentYear = paymentDate.getFullYear();
      const paymentMonth = paymentDate.getMonth();
      
      if (paymentYear === currentYear) {
        monthlyData[paymentMonth].amount += payment.amount;
      }
    });
  });
  
  return monthlyData;
};

// Generate class-wise revenue data
export const generateClassTypeData = (students: Student[]) => {
  const classRevenue = {
    "Ho'oponopo": 0,
    "Astrology": 0,
    "Pooja": 0
  };
  
  students.forEach(student => {
    if (student.classType in classRevenue) {
      classRevenue[student.classType] += student.payment;
    }
    
    student.paymentHistory.forEach(payment => {
      const matchingStudent = students.find(s => s.id === payment.studentId);
      if (matchingStudent && matchingStudent.classType in classRevenue) {
        classRevenue[matchingStudent.classType] += payment.amount;
      }
    });
  });
  
  return Object.entries(classRevenue).map(([name, value]) => ({ name, value }));
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

// Generate top 5 students by total revenue
export const generateTopStudentsData = (students: Student[]) => {
  // Create a map to aggregate payments by student ID
  const studentRevenue = new Map<string, {id: string, name: string, total: number}>();
  
  students.forEach(student => {
    // Initialize or update with base payment
    if (!studentRevenue.has(student.id)) {
      studentRevenue.set(student.id, {
        id: student.id,
        name: student.name,
        total: student.payment
      });
    } else {
      const current = studentRevenue.get(student.id)!;
      current.total += student.payment;
    }
    
    // Add all payments from payment history
    student.paymentHistory.forEach(payment => {
      if (payment.studentId === student.id) {
        const current = studentRevenue.get(student.id)!;
        current.total += payment.amount;
      }
    });
  });
  
  // Convert to array, sort by total, and take top 5
  return Array.from(studentRevenue.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)
    .map(item => ({
      name: item.name,
      amount: item.total
    }));
};

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
    
    // Count students by class type
    if (student.classType in studentCounts && isStudentActive(student)) {
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
