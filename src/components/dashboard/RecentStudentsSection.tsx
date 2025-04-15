
import StudentCard from "@/components/StudentCard";
import { Student } from "@/utils/types";

interface RecentStudentsSectionProps {
  students: Student[];
  isLoading: boolean;
}

const RecentStudentsSection = ({ students, isLoading }: RecentStudentsSectionProps) => {
  return (
    <>
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
    </>
  );
};

export default RecentStudentsSection;
