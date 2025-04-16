
import { Student } from "@/utils/types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isStudentActive, isStudentUpcoming } from "@/utils/mockData";
import { Clock } from "lucide-react";

interface StudentCardProps {
  student: Student;
}

const StudentCard = ({ student }: StudentCardProps) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Background color based on class type
  const getBadgeColor = (classType: string) => {
    switch (classType) {
      case "Ho'oponopo":
        return "bg-purple-100 text-purple-800";
      case "Astrology":
        return "bg-blue-100 text-blue-800";
      case "Pooja":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format class time to 12-hour format with AM/PM
  const formatClassTime = (time: string | undefined | null) => {
    if (!time) return "";
    
    // Split the time string (e.g., "14:30") into hours and minutes
    const [hours, minutes] = time.split(':').map(Number);
    
    // Convert to 12-hour format and determine AM/PM
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert 0 to 12 for 12 AM
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  const active = isStudentActive(student);
  const upcoming = isStudentUpcoming(student);

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        <div className="p-4 flex items-center space-x-4">
          <Avatar className="h-12 w-12 border-2 border-teacher-100">
            <AvatarImage src={student.pictureUrl || undefined} alt={student.name} />
            <AvatarFallback className="bg-teacher-300 text-white">
              {getInitials(student.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-medium text-gray-900 truncate">{student.name}</h3>
            <p className="text-sm text-gray-500">ID: {student.studentId}</p>
          </div>
        </div>
        
        <div className="px-4 pb-4">
          <div className="text-sm mb-2">
            <span className="text-gray-500">Start Date:</span>{" "}
            <span className="font-medium">{formatDate(student.startDate)}</span>
          </div>
          {student.classTime && (
            <div className="text-sm mb-2 flex items-center">
              <Clock className="h-3 w-3 mr-1 text-gray-500" />
              <span className="text-gray-500">Class Time:</span>{" "}
              <span className="font-medium ml-1">
                {formatClassTime(student.classTime)}
              </span>
            </div>
          )}
          <div className="text-sm">
            <span className="text-gray-500">Payment:</span>{" "}
            <span className="font-medium text-teacher-600">
              {formatCurrency(student.payment)}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-4 py-2 flex justify-between items-center">
        <Badge className={getBadgeColor(student.classType)}>{student.classType}</Badge>
        {upcoming ? (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Upcoming
          </span>
        ) : (
          <span className="text-xs text-gray-500">
            {active ? "Active" : "Completed"}
          </span>
        )}
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
