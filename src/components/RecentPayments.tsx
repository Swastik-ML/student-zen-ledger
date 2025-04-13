
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Student, Payment } from "@/utils/types";

interface RecentPaymentsProps {
  students: Student[];
}

const RecentPayments = ({ students }: RecentPaymentsProps) => {
  // Get all payments from all students
  const getAllPayments = (): (Payment & { studentName: string })[] => {
    const allPayments: (Payment & { studentName: string })[] = [];
    
    students.forEach(student => {
      student.paymentHistory.forEach(payment => {
        allPayments.push({
          ...payment,
          studentName: student.name
        });
      });
    });
    
    // Sort by date (most recent first)
    return allPayments.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 5);  // Only return the 5 most recent payments
  };
  
  const recentPayments = getAllPayments();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Recent Payments</CardTitle>
      </CardHeader>
      <CardContent>
        {recentPayments.length > 0 ? (
          <div className="space-y-4">
            {recentPayments.map((payment) => (
              <div 
                key={payment.id} 
                className="flex justify-between items-center p-3 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium text-sm">{payment.studentName}</p>
                  <p className="text-xs text-gray-500">{formatDate(payment.date)} • {payment.method}</p>
                </div>
                <p className="font-semibold text-teacher-600">
                  {formatCurrency(payment.amount)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No recent payments</p>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentPayments;
