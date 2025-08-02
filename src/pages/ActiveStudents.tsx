import { useState, useEffect } from "react";
import { Student } from "@/utils/types";
import { fetchStudents } from "@/services/studentService";
import { useToast } from "@/components/ui/use-toast";
import ActiveStudentCard from "@/components/active-students/ActiveStudentCard";
import DailyScheduleBoard from "@/components/active-students/DailyScheduleBoard";

const ActiveStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudents, setActiveStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to determine if a student is active
  const isStudentActive = (student: Student): boolean => {
    const currentDate = new Date();
    
    // Check if end date is null (ongoing) or in the future
    if (!student.endDate) return true;
    
    const endDate = new Date(student.endDate);
    return endDate >= currentDate;
  };

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setIsLoading(true);
        const data = await fetchStudents();
        setStudents(data);
        
        // Filter active students
        const active = data.filter(student => isStudentActive(student));
        setActiveStudents(active);
        
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

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-teacher-700">Active Students</h1>

      {/* Active Students Count */}
      <div className="mb-6">
        <p className="text-lg text-teacher-600">
          Total Active Students: <span className="font-semibold">{activeStudents.length}</span>
        </p>
      </div>

      {/* Daily Schedule Board */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-teacher-600">Daily Schedule</h2>
        <DailyScheduleBoard students={activeStudents} />
      </div>

      {/* Active Students Cards */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4 text-teacher-600">Active Students List</h2>
        
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-100 animate-pulse h-48 rounded-lg"></div>
            ))}
          </div>
        ) : activeStudents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeStudents.map((student) => (
              <ActiveStudentCard key={student.id} student={student} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No active students found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveStudents;