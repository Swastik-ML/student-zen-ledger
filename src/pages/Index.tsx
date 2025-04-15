
import { useState, useEffect } from "react";
import { calculateFinancialSummary } from "@/utils/financialUtils";
import { Student } from "@/utils/types";
import { fetchStudents } from "@/services/studentService";
import { useToast } from "@/components/ui/use-toast";
import StatsSummary from "@/components/dashboard/StatsSummary";
import RecentStudentsSection from "@/components/dashboard/RecentStudentsSection";
import FinancialSummary from "@/components/FinancialSummary";

const Index = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  // Calculate summary statistics
  const stats = calculateFinancialSummary(students);
  
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-teacher-700">Student Dashboard</h1>

      {/* Stats Summary */}
      <StatsSummary 
        students={students} 
        totalRevenue={stats.totalRevenue} 
      />

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <RecentStudentsSection 
            students={students} 
            isLoading={isLoading} 
          />
        </div>
        
        <div className="space-y-8">
          <FinancialSummary
            totalRevenue={stats.totalRevenue}
            monthlyRevenue={stats.monthlyRevenue}
            yearlyRevenue={stats.yearlyRevenue}
            studentCounts={stats.studentCounts}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
