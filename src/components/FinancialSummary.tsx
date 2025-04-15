
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { ClassType } from "@/utils/types";

interface FinancialSummaryProps {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  studentCounts: {
    [key in ClassType]: number;
  };
}

const FinancialSummary = ({
  totalRevenue,
  monthlyRevenue,
  yearlyRevenue,
  studentCounts
}: FinancialSummaryProps) => {
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-teacher-50 p-4 rounded-md">
            <p className="text-sm text-teacher-600">Monthly Revenue</p>
            <p className="text-2xl font-bold text-teacher-700">
              {formatCurrency(monthlyRevenue)}
            </p>
            <p className="text-xs text-gray-500">{currentMonth} {currentYear}</p>
          </div>
          
          <div className="bg-teacher-50 p-4 rounded-md">
            <p className="text-sm text-teacher-600">Yearly Revenue</p>
            <p className="text-2xl font-bold text-teacher-700">
              {formatCurrency(yearlyRevenue)}
            </p>
            <p className="text-xs text-gray-500">{currentYear}</p>
          </div>
          
          <div className="bg-teacher-50 p-4 rounded-md">
            <p className="text-sm text-teacher-600">Total Revenue</p>
            <p className="text-2xl font-bold text-teacher-700">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
          
          <div className="bg-teacher-50 p-4 rounded-md">
            <p className="text-sm text-teacher-600">Students by Type</p>
            <div className="mt-2 space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Ho'oponopo:</span>
                <span className="font-medium">{studentCounts["Ho'oponopo"]}</span>
              </div>
              <div className="flex justify-between">
                <span>Astrology:</span>
                <span className="font-medium">{studentCounts["Astrology"]}</span>
              </div>
              <div className="flex justify-between">
                <span>Pooja:</span>
                <span className="font-medium">{studentCounts["Pooja"]}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;
