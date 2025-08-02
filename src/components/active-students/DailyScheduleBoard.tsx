import { Student } from "@/utils/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DailyScheduleBoardProps {
  students: Student[];
}

const DailyScheduleBoard = ({ students }: DailyScheduleBoardProps) => {
  // Generate time slots from 6 AM to 11 PM in 30-minute intervals
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 6; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const period = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
        const displayTime = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
        
        slots.push({
          timeString,
          displayTime,
          hour,
          minute
        });
      }
    }
    return slots;
  };

  // Function to parse time and match with slots
  const getStudentsForTimeSlot = (slotHour: number, slotMinute: number) => {
    return students.filter(student => {
      if (!student.classTime) return false;
      
      try {
        const [hours, minutes] = student.classTime.split(':');
        const studentHour = parseInt(hours, 10);
        const studentMinute = parseInt(minutes, 10);
        
        // Check if student's time falls within this 30-minute slot
        const slotStartMinutes = slotHour * 60 + slotMinute;
        const slotEndMinutes = slotStartMinutes + 30;
        const studentMinutes = studentHour * 60 + studentMinute;
        
        return studentMinutes >= slotStartMinutes && studentMinutes < slotEndMinutes;
      } catch (error) {
        return false;
      }
    });
  };

  const timeSlots = generateTimeSlots();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl text-teacher-700">Daily Class Schedule</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2 max-h-96 overflow-y-auto">
          {timeSlots.map((slot) => {
            const studentsInSlot = getStudentsForTimeSlot(slot.hour, slot.minute);
            
            return (
              <div
                key={slot.timeString}
                className={`flex items-center p-3 rounded-lg border ${
                  studentsInSlot.length > 0 
                    ? 'bg-teacher-50 border-teacher-200' 
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                <div className="w-20 text-sm font-medium text-gray-700">
                  {slot.displayTime}
                </div>
                <div className="flex-1 ml-4">
                  {studentsInSlot.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {studentsInSlot.map((student) => (
                        <Badge
                          key={student.id}
                          variant="secondary"
                          className="text-xs bg-teacher-100 text-teacher-700 hover:bg-teacher-200"
                        >
                          {student.name} ({student.classType})
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">No classes scheduled</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyScheduleBoard;