import { Student } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Clock, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ActiveStudentsSummaryProps {
  students: Student[];
  isLoading: boolean;
}

const ActiveStudentsSummary = ({ students, isLoading }: ActiveStudentsSummaryProps) => {
  // Function to determine if a student is active
  const isStudentActive = (student: Student): boolean => {
    const currentDate = new Date();
    
    // Check if end date is null (ongoing) or in the future
    if (!student.endDate) return true;
    
    const endDate = new Date(student.endDate);
    return endDate >= currentDate;
  };

  const activeStudents = students.filter(student => isStudentActive(student));

  // Get students with scheduled classes today
  const studentsWithSchedule = activeStudents.filter(student => student.classTime);

  // Group by class type
  const classCounts = activeStudents.reduce((acc, student) => {
    acc[student.classType] = (acc[student.classType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-teacher-500" />
            Active Students Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-gray-100 animate-pulse h-4 rounded w-3/4"></div>
            <div className="bg-gray-100 animate-pulse h-4 rounded w-1/2"></div>
            <div className="bg-gray-100 animate-pulse h-4 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Users className="h-5 w-5 mr-2 text-teacher-500" />
            Active Students Summary
          </div>
          <Link to="/active-students">
            <Button variant="outline" size="sm">
              View All
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Active Students */}
        <div className="flex items-center justify-between p-3 bg-teacher-50 rounded-lg">
          <span className="font-medium text-teacher-700">Total Active Students</span>
          <Badge variant="secondary" className="bg-teacher-100 text-teacher-700">
            {activeStudents.length}
          </Badge>
        </div>

        {/* Students with Schedule */}
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">With Scheduled Classes</span>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            {studentsWithSchedule.length}
          </Badge>
        </div>

        {/* Class Type Breakdown */}
        <div className="space-y-2">
          <div className="flex items-center mb-2">
            <BookOpen className="h-4 w-4 mr-2 text-teacher-500" />
            <span className="text-sm font-medium text-teacher-700">By Class Type</span>
          </div>
          {Object.entries(classCounts).map(([classType, count]) => (
            <div key={classType} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{classType}</span>
              <Badge variant="outline" className="text-xs">
                {count}
              </Badge>
            </div>
          ))}
        </div>

        {/* Quick Stats */}
        {activeStudents.length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Recent Active Students:</p>
            <div className="space-y-1">
              {activeStudents.slice(0, 3).map((student) => (
                <div key={student.id} className="flex items-center justify-between text-xs">
                  <span className="font-medium text-gray-700">{student.name}</span>
                  <span className="text-gray-500">{student.classType}</span>
                </div>
              ))}
              {activeStudents.length > 3 && (
                <p className="text-xs text-gray-400 text-center pt-1">
                  +{activeStudents.length - 3} more students
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActiveStudentsSummary;