
import { BookOpen, Users, IndianRupee } from "lucide-react";
import StatCard from "./StatCard";
import { Student } from "@/utils/types";
import { isStudentActive } from "@/utils/mockData";

interface StatsSummaryProps {
  students: Student[];
  totalRevenue: number;
}

const StatsSummary = ({ students, totalRevenue }: StatsSummaryProps) => {
  // Get active students (no end date or end date in future)
  const activeStudents = students.filter(student => isStudentActive(student));

  return (
    <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-3">
      <StatCard 
        icon={<BookOpen className="w-6 h-6 text-teacher-500" />}
        title="Total Students"
        value={students.length}
      />
      
      <StatCard 
        icon={<Users className="w-6 h-6 text-teacher-500" />}
        title="Active Students"
        value={activeStudents.length}
      />
      
      <StatCard 
        icon={<IndianRupee className="w-6 h-6 text-teacher-500" />}
        title="Total Payments"
        value={`₹${totalRevenue.toLocaleString()}`}
      />
    </div>
  );
};

export default StatsSummary;
