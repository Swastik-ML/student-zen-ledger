
import { useState, useEffect } from "react";
import { calculateFinancialSummary } from "@/utils/mockData";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/utils/types";
import { fetchStudents } from "@/services/studentService";
import { useToast } from "@/components/ui/use-toast";

export const OPENING_BALANCE = 1027277; // Static opening balance for 2022-2024

const FinancialReports = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const { toast } = useToast();
  
  useEffect(() => {
    const loadStudents = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStudents();
        setStudents(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading students:', error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load student data. Please try again later."
        });
      }
    };
    
    loadStudents();
  }, [toast]);
  
  // Calculate financial stats based on real data
  const stats = calculateFinancialSummary(students);

  // Colors for charts
  const COLORS = ['#9b87f5', '#8B5CF6', '#7E69AB', '#6E59A5', '#5D49A3'];

  // Generate monthly data from actual payments
  const generateMonthlyData = () => {
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
  const generateClassTypeData = () => {
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
  const getAvailableYears = () => {
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
  const generateTopStudentsData = () => {
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

  const monthlyData = generateMonthlyData();
  const classTypeData = generateClassTypeData();
  const topStudentsData = generateTopStudentsData();
  const paymentMethodData = Object.entries(stats.paymentsByMethod).map(
    ([method, amount]) => ({
      name: method,
      amount
    })
  ).filter(item => item.amount > 0);
  
  const availableYears = getAvailableYears();

  // Calculate total revenue including opening balance
  const totalRevenueWithOpeningBalance = stats.totalRevenue + OPENING_BALANCE;

  // Check if data exists for selected year
  const hasDataForYear = () => {
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
  const exportReportData = () => {
    // Get the selected year's data
    const yearData = generateMonthlyData();
    const classData = generateClassTypeData();
    const studentsData = generateTopStudentsData();
    const methodData = paymentMethodData;
    
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

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-teacher-500" />
          <h1 className="text-3xl font-bold text-teacher-700">Financial Reports</h1>
        </div>
        
        <Button className="flex items-center gap-1" onClick={exportReportData}>
          <Download className="h-4 w-4" />
          Export {selectedYear} Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teacher-600">{formatCurrency(totalRevenueWithOpeningBalance)}</p>
            <p className="text-sm text-gray-500">Including opening balance ₹{formatCurrency(OPENING_BALANCE)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Monthly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teacher-600">{formatCurrency(stats.monthlyRevenue)}</p>
            <p className="text-sm text-gray-500">Current month</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Yearly Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teacher-600">{formatCurrency(stats.yearlyRevenue)}</p>
            <p className="text-sm text-gray-500">Current year</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="monthly" className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <TabsList>
            <TabsTrigger value="monthly">Monthly Revenue</TabsTrigger>
            <TabsTrigger value="class">Class Revenue</TabsTrigger>
            <TabsTrigger value="students">Top 5 Students</TabsTrigger>
            <TabsTrigger value="method">Payment Methods</TabsTrigger>
          </TabsList>
          
          <div className="mt-4 md:mt-0">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Financial Analytics</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <TabsContent value="monthly">
              {isLoading ? (
                <div className="h-80 bg-gray-100 animate-pulse rounded" />
              ) : !hasDataForYear() ? (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">No data available for {selectedYear}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                    <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Revenue']} />
                    <Legend />
                    <Bar dataKey="amount" fill="#9b87f5" name="Monthly Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
            
            <TabsContent value="class">
              {isLoading ? (
                <div className="h-80 bg-gray-100 animate-pulse rounded" />
              ) : !hasDataForYear() ? (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">No data available for {selectedYear}</p>
                </div>
              ) : (
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={classTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                        >
                          {classTypeData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Revenue']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full md:w-1/2 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">Class Revenue Distribution</h3>
                    <div className="space-y-4">
                      {classTypeData.map((entry, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 mr-2 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm">{entry.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">₹{entry.value.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="students">
              {isLoading ? (
                <div className="h-80 bg-gray-100 animate-pulse rounded" />
              ) : !hasDataForYear() ? (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">No data available for {selectedYear}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart layout="vertical" data={topStudentsData} margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                    <YAxis dataKey="name" type="category" width={120} />
                    <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Total Revenue']} />
                    <Legend />
                    <Bar dataKey="amount" fill="#8B5CF6" name="Student Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
            
            <TabsContent value="method">
              {isLoading ? (
                <div className="h-80 bg-gray-100 animate-pulse rounded" />
              ) : !hasDataForYear() ? (
                <div className="h-80 flex items-center justify-center">
                  <p className="text-gray-500">No data available for {selectedYear}</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={paymentMethodData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `₹${value.toLocaleString()}`} />
                    <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Amount']} />
                    <Legend />
                    <Bar dataKey="amount" fill="#7E69AB" name="Payment Amount" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default FinancialReports;
