
import { ClassType, Payment, PaymentMethod, Student } from "./types";

// Generate a random student ID
const generateStudentId = (): string => {
  return `STD-${Math.floor(10000 + Math.random() * 90000)}`;
};

// Generate payments for a student
const generatePayments = (studentId: string, payment: number): Payment[] => {
  const payments: Payment[] = [];
  const methods: PaymentMethod[] = ['Cash', 'Bank Transfer', 'UPI', 'Check'];
  
  // Generate between 1-5 payments
  const numPayments = Math.floor(1 + Math.random() * 5);
  
  for (let i = 0; i < numPayments; i++) {
    const paymentDate = new Date();
    paymentDate.setMonth(paymentDate.getMonth() - i);
    
    payments.push({
      id: `payment-${studentId}-${i}`,
      studentId,
      amount: payment,
      date: paymentDate.toISOString().split('T')[0],
      method: methods[Math.floor(Math.random() * methods.length)]
    });
  }
  
  return payments;
};

// Sample profile pictures (placeholder URLs)
const profilePictures = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200&h=200",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200",
  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200&h=200",
  null
];

// Class types
const classTypes: ClassType[] = ['Ho\'oponopo', 'Astrology', 'Pooja'];

// Payment methods
const paymentMethods: PaymentMethod[] = ['Cash', 'Bank Transfer', 'UPI', 'Check', 'Other'];

// Generate sample students
const generateStudents = (): Student[] => {
  const students: Student[] = [];
  
  for (let i = 1; i <= 15; i++) {
    const studentId = generateStudentId();
    const payment = Math.floor(500 + Math.random() * 10000);
    const classType = classTypes[Math.floor(Math.random() * classTypes.length)];
    const paymentMethod = paymentMethods[Math.floor(Math.random() * paymentMethods.length)];
    
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 12));
    
    const endDate = Math.random() > 0.7 
      ? new Date(startDate.getTime() + (Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0]
      : null;
    
    students.push({
      id: `student-${i}`,
      serialNumber: i,
      name: `Student ${i}`,
      studentId,
      startDate: startDate.toISOString().split('T')[0],
      endDate,
      payment,
      paymentMethod,
      classType,
      pictureUrl: profilePictures[Math.floor(Math.random() * profilePictures.length)],
      paymentHistory: generatePayments(studentId, payment)
    });
  }
  
  return students;
};

// Export the mock data
export const mockStudents = generateStudents();

// Calculate financial summary
export const calculateFinancialSummary = (students: Student[]) => {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  let totalRevenue = 0;
  let monthlyRevenue = 0;
  let yearlyRevenue = 0;
  
  const studentCounts = {
    'Ho\'oponopo': 0,
    'Astrology': 0,
    'Pooja': 0
  };
  
  const paymentsByMethod = {
    'Cash': 0,
    'Bank Transfer': 0,
    'UPI': 0,
    'Check': 0,
    'Other': 0
  };
  
  students.forEach(student => {
    // Count by class type
    studentCounts[student.classType]++;
    
    // Process payment history
    student.paymentHistory.forEach(payment => {
      const paymentDate = new Date(payment.date);
      totalRevenue += payment.amount;
      
      // Count by payment method
      paymentsByMethod[payment.method] += payment.amount;
      
      // Check if payment is from current month
      if (paymentDate.getMonth() === currentMonth && 
          paymentDate.getFullYear() === currentYear) {
        monthlyRevenue += payment.amount;
      }
      
      // Check if payment is from current year
      if (paymentDate.getFullYear() === currentYear) {
        yearlyRevenue += payment.amount;
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
