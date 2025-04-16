
import { Student } from "@/utils/types";

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
