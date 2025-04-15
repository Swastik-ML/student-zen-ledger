
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Student } from "@/utils/types";
import { hasDataForYear } from "@/utils/financialUtils";
import { useAnalyticsFilters } from "@/hooks/useAnalyticsFilters";

interface FinancialChartsProps {
  students: Student[];
  selectedYear: string;
  isLoading: boolean;
  onYearChange: (year: string) => void;
  availableYears: number[];
}

const FinancialCharts = ({ 
  students, 
  selectedYear, 
  isLoading, 
  onYearChange, 
  availableYears 
}: FinancialChartsProps) => {
  // Colors for charts
  const COLORS = ['#9b87f5', '#8B5CF6', '#7E69AB', '#6E59A5', '#5D49A3'];

  // Get chart data from custom hook
  const {
    monthlyData,
    classTypeData,
    topStudentsData,
    paymentMethodData,
    hasData
  } = useAnalyticsFilters(students);

  return (
    <Tabs defaultValue="monthly" className="mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Revenue</TabsTrigger>
          <TabsTrigger value="class">Class Revenue</TabsTrigger>
          <TabsTrigger value="students">Top 5 Students</TabsTrigger>
          <TabsTrigger value="method">Payment Methods</TabsTrigger>
        </TabsList>
        
        <div className="mt-4 md:mt-0">
          <Select value={selectedYear} onValueChange={onYearChange}>
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
            ) : !hasData ? (
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
            ) : !hasData ? (
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
            ) : !hasData ? (
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
            ) : !hasData ? (
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
  );
};

export default FinancialCharts;
