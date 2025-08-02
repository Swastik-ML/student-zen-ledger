import { Student } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar, BookOpen, IndianRupee } from "lucide-react";

interface ActiveStudentCardProps {
  student: Student;
}

const ActiveStudentCard = ({ student }: ActiveStudentCardProps) => {
  const formatTime = (timeString: string | null | undefined) => {
    if (!timeString) return "Not set";
    
    try {
      // Handle time format "HH:mm:ss" or "HH:mm"
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours, 10);
      const minute = parseInt(minutes, 10);
      
      const period = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      
      return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
    } catch (error) {
      return timeString;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card className="h-full hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-teacher-700">
              {student.name}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1">ID: {student.studentId}</p>
          </div>
          <Badge variant="outline" className="text-xs">
            {student.classType}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-sm text-gray-600">
          <Clock className="h-4 w-4 mr-2 text-teacher-500" />
          <span>Class Time: {formatTime(student.classTime)}</span>
        </div>
        
        {student.classSection && (
          <div className="flex items-center text-sm text-gray-600">
            <BookOpen className="h-4 w-4 mr-2 text-teacher-500" />
            <span>Section: {student.classSection}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 mr-2 text-teacher-500" />
          <span>Started: {formatDate(student.startDate)}</span>
        </div>
        
        {student.endDate && (
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-teacher-500" />
            <span>Ends: {formatDate(student.endDate)}</span>
          </div>
        )}
        
        <div className="flex items-center text-sm text-gray-600">
          <IndianRupee className="h-4 w-4 mr-2 text-teacher-500" />
          <span>Payment: ₹{student.payment.toLocaleString()}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActiveStudentCard;