
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface FilterBarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  classFilter: string;
  setClassFilter: (value: string) => void;
  studentIdFilter: string;
  setStudentIdFilter: (value: string) => void;
}

const FilterBar = ({ 
  searchTerm, 
  setSearchTerm, 
  classFilter, 
  setClassFilter, 
  studentIdFilter, 
  setStudentIdFilter 
}: FilterBarProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search by name" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <div className="w-full md:w-64">
        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="Ho'oponopo">Ho'oponopo</SelectItem>
            <SelectItem value="Astrology">Astrology</SelectItem>
            <SelectItem value="Pooja">Pooja</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="relative w-full md:w-64">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
        <Input 
          placeholder="Search by student ID" 
          value={studentIdFilter}
          onChange={(e) => setStudentIdFilter(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default FilterBar;
