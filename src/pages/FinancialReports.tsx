
import { useState, useEffect } from "react";
import { mockStudents, calculateFinancialSummary } from "@/utils/mockData";
import { formatCurrency } from "@/utils/formatters";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, Download } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Student } from "@/utils/types";

const FinancialReports = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  
  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStudents(mockStudents);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Calculate financial stats
  const stats = calculateFinancialSummary(students);

  // Prepare data for charts
  const classTypeData = [
    { name: "Ho'oponopo", value: stats.studentCounts["Ho'oponopo"] },
    { name: "Astrology", value: stats.studentCounts["Astrology"] },
    { name: "Pooja", value: stats.studentCounts["Pooja"] }
  ];

  const paymentMethodData = Object.entries(stats.paymentsByMethod).map(
    ([method, amount]) => ({
      name: method,
      amount
    })
  ).filter(item => item.amount > 0);

  // Colors for pie chart
  const COLORS = ['#9b87f5', '#8B5CF6', '#7E69AB', '#6E59A5'];

  // Generate payment history by month (simulated data)
  const generateMonthlyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => {
      // Create a semi-random but consistent pattern
      const randomValue = Math.floor(10000 + Math.random() * 50000);
      return {
        name: month,
        amount: randomValue
      };
    });
  };

  // Get available years from the payment data
  const getAvailableYears = () => {
    const currentYear = new Date().getFullYear();
    return [currentYear - 2, currentYear - 1, currentYear];
  };

  // Generate student-wise payment data
  const generateStudentPaymentData = () => {
    return students
      .map(student => {
        const totalPayment = student.paymentHistory.reduce(
          (sum, payment) => sum + payment.amount, 0
        );
        
        return {
          name: student.name,
          amount: totalPayment
        };
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10); // Get top 10 students by payment
  };

  const monthlyData = generateMonthlyData();
  const studentPaymentData = generateStudentPaymentData();
  const availableYears = getAvailableYears();

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-teacher-500" />
          <h1 className="text-3xl font-bold text-teacher-700">Financial Reports</h1>
        </div>
        
        <Button className="flex items-center gap-1">
          <Download className="h-4 w-4" />
          Export Report
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-teacher-600">{formatCurrency(stats.totalRevenue)}</p>
            <p className="text-sm text-gray-500">All-time revenue</p>
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
            <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
            <TabsTrigger value="student">Student-wise</TabsTrigger>
            <TabsTrigger value="class">Class-wise</TabsTrigger>
            <TabsTrigger value="method">Payment Method</TabsTrigger>
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
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="amount" fill="#9b87f5" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
            
            <TabsContent value="student">
              {isLoading ? (
                <div className="h-80 bg-gray-100 animate-pulse rounded" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart layout="vertical" data={studentPaymentData} margin={{ top: 20, right: 30, left: 70, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={60} />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="amount" fill="#8B5CF6" name="Total Payment" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
            
            <TabsContent value="class">
              {isLoading ? (
                <div className="h-80 bg-gray-100 animate-pulse rounded" />
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
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {classTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [value, 'Students']} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="w-full md:w-1/2 pt-6">
                    <h3 className="text-lg font-semibold mb-4 text-center">Class Distribution</h3>
                    <div className="space-y-4">
                      {classTypeData.map((item, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div
                              className="w-4 h-4 mr-2 rounded-full"
                              style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="text-sm">{item.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">{item.value} students</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="method">
              {isLoading ? (
                <div className="h-80 bg-gray-100 animate-pulse rounded" />
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={paymentMethodData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(value as number)} />
                    <Legend />
                    <Bar dataKey="amount" fill="#7E69AB" name="Payment Amount" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
      
      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            Payment history details will be displayed here.
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;
