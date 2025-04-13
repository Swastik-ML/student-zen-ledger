
import { useState, useEffect } from "react";
import StudentCard from "@/components/StudentCard";
import RecentPayments from "@/components/RecentPayments";
import FinancialSummary from "@/components/FinancialSummary";
import { calculateFinancialSummary } from "@/utils/mockData";
import { Student } from "@/utils/types";
import { BookOpen, Users, IndianRupee } from "lucide-react";
import { fetchStudents } from "@/services/studentService";
import { useToast } from "@/components/ui/use-toast";

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
  
  // Get active students (no end date)
  const activeStudents = students.filter(student => !student.endDate);

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-teacher-700">Student Dashboard</h1>

      {/* Stats Summary */}
      <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
        <div className="flex items-center p-6 bg-white rounded-lg shadow">
          <div className="p-3 mr-4 bg-teacher-100 rounded-full">
            <BookOpen className="w-6 h-6 text-teacher-500" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">Total Students</p>
            <p className="text-2xl font-semibold text-gray-700">{students.length}</p>
          </div>
        </div>
        
        <div className="flex items-center p-6 bg-white rounded-lg shadow">
          <div className="p-3 mr-4 bg-teacher-100 rounded-full">
            <Users className="w-6 h-6 text-teacher-500" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">Active Students</p>
            <p className="text-2xl font-semibold text-gray-700">{activeStudents.length}</p>
          </div>
        </div>
        
        <div className="flex items-center p-6 bg-white rounded-lg shadow">
          <div className="p-3 mr-4 bg-teacher-100 rounded-full">
            <IndianRupee className="w-6 h-6 text-teacher-500" />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium text-gray-600">Revenue (Monthly)</p>
            <p className="text-2xl font-semibold text-gray-700">₹{stats.monthlyRevenue.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-teacher-600">Recent Students</h2>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-100 animate-pulse h-40 rounded-lg"></div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {students.slice(0, 4).map((student) => (
                <StudentCard key={student.id} student={student} />
              ))}
            </div>
          )}
        </div>
        
        <div className="space-y-8">
          <FinancialSummary
            totalRevenue={stats.totalRevenue}
            monthlyRevenue={stats.monthlyRevenue}
            yearlyRevenue={stats.yearlyRevenue}
            studentCounts={stats.studentCounts}
          />
          
          <RecentPayments students={students} />
        </div>
      </div>
    </div>
  );
};

export default Index;
