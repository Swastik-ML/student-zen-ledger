
import { useState, useEffect } from "react";
import { calculateFinancialSummary } from "@/utils/mockData";
import { Button } from "@/components/ui/button";
import { BarChart3, Download } from "lucide-react";
import { Student } from "@/utils/types";
import { fetchStudents } from "@/services/studentService";
import { useToast } from "@/components/ui/use-toast";
import { 
  getAvailableYears, 
  exportReportData 
} from "@/utils/financialUtils";
import RevenueCards from "@/components/financial/RevenueCards";
import FinancialCharts from "@/components/financial/FinancialCharts";

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
  const availableYears = getAvailableYears(students);

  // Handle export button click
  const handleExportReport = () => {
    exportReportData(students, selectedYear);
  };

  return (
    <div className="container py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <BarChart3 className="h-6 w-6 mr-2 text-teacher-500" />
          <h1 className="text-3xl font-bold text-teacher-700">Financial Reports</h1>
        </div>
        
        <Button className="flex items-center gap-1" onClick={handleExportReport}>
          <Download className="h-4 w-4" />
          Export {selectedYear} Report
        </Button>
      </div>
      
      <RevenueCards
        totalRevenue={stats.totalRevenue}
        monthlyRevenue={stats.monthlyRevenue}
        yearlyRevenue={stats.yearlyRevenue}
      />
      
      <FinancialCharts
        students={students}
        selectedYear={selectedYear}
        isLoading={isLoading}
        onYearChange={setSelectedYear}
        availableYears={availableYears}
      />
    </div>
  );
};

export default FinancialReports;
