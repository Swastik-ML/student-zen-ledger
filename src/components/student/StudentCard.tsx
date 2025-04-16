import { Student } from "@/types/student";

interface StudentCardProps {
  student: Student;
}

// Moving StudentCard to student directory
const StudentCard = ({ student }: StudentCardProps) => {
  const { name, classType, pictureUrl } = student;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <img
        className="w-full h-32 object-cover"
        src={pictureUrl || "https://via.placeholder.com/150"} // Default placeholder image
        alt={name}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{name}</h3>
        <p className="text-sm text-gray-600">Class: {classType}</p>
        {/* You can add more student details here */}
      </div>
    </div>
  );
};

export default StudentCard;
