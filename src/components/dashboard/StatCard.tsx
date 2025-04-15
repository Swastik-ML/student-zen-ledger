
import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  title: string;
  value: string | number;
}

const StatCard = ({ icon, title, value }: StatCardProps) => {
  return (
    <div className="flex items-center p-6 bg-white rounded-lg shadow">
      <div className="p-3 mr-4 bg-teacher-100 rounded-full">
        {icon}
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-semibold text-gray-700">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
