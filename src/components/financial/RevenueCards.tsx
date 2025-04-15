
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/utils/formatters";
import { OPENING_BALANCE } from "@/utils/financialUtils";

interface RevenueCardsProps {
  totalRevenue: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

const RevenueCards = ({ totalRevenue, monthlyRevenue, yearlyRevenue }: RevenueCardsProps) => {
  const totalRevenueWithOpeningBalance = totalRevenue + OPENING_BALANCE;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-500">Total Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-teacher-600">{formatCurrency(totalRevenueWithOpeningBalance)}</p>
          <p className="text-sm text-gray-500">Including opening balance ₹{formatCurrency(OPENING_BALANCE)}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-500">Monthly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-teacher-600">{formatCurrency(monthlyRevenue)}</p>
          <p className="text-sm text-gray-500">{new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg text-gray-500">Yearly Revenue</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-teacher-600">{formatCurrency(yearlyRevenue)}</p>
          <p className="text-sm text-gray-500">{new Date().getFullYear()}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default RevenueCards;
