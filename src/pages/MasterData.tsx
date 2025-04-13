
import { useState, useEffect } from "react";
import { mockStudents } from "@/utils/mockData";
import { Student } from "@/utils/types";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search, ArrowUpDown, Edit, Trash2, Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const MasterData = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterClassType, setFilterClassType] = useState<string>("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Student | '';
    direction: 'ascending' | 'descending';
  }>({ key: '', direction: 'ascending' });

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setStudents(mockStudents);
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Generate initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  // Handle sort
  const handleSort = (key: keyof Student) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    
    setSortConfig({ key, direction });
  };
  
  // Handle filter and sort
  const filteredAndSortedStudents = () => {
    // First filter the students
    let result = students;
    
    if (searchTerm) {
      result = result.filter(
        student => 
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.studentId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterClassType) {
      result = result.filter(
        student => student.classType === filterClassType
      );
    }
    
    // Then sort the filtered results
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    
    return result;
  };

  // Handle delete (simulated)
  const handleDelete = (id: string, name: string) => {
    // In a real app, would make an API call here
    toast({
      title: "Student Deleted",
      description: `${name} has been deleted from your records.`,
    });
    
    // Filter out the deleted student
    setStudents(students.filter(student => student.id !== id));
  };

  // Prepare the filtered and sorted data
  const displayedStudents = filteredAndSortedStudents();

  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <FileText className="h-6 w-6 mr-2 text-teacher-500" />
        <h1 className="text-3xl font-bold text-teacher-700">Master Data</h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-0">
          <CardTitle>Students Master Database</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 py-4">
            <div className="relative flex-1">
              <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select
              value={filterClassType}
              onValueChange={setFilterClassType}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-classes">All Classes</SelectItem>
                <SelectItem value="Ho'oponopo">Ho'oponopo</SelectItem>
                <SelectItem value="Astrology">Astrology</SelectItem>
                <SelectItem value="Pooja">Pooja</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('serialNumber')}>
                <div className="flex items-center">
                  S.No
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('studentId')}>
                <div className="flex items-center">
                  Student ID
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('startDate')}>
                <div className="flex items-center">
                  Start Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('payment')}>
                <div className="flex items-center">
                  Payment
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </div>
              </TableHead>
              <TableHead>Payment Method</TableHead>
              <TableHead>Class Type</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [1, 2, 3, 4, 5].map((index) => (
                <TableRow key={index}>
                  <TableCell colSpan={9}>
                    <div className="h-12 bg-gray-100 animate-pulse rounded"></div>
                  </TableCell>
                </TableRow>
              ))
            ) : displayedStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  No students found matching your search.
                </TableCell>
              </TableRow>
            ) : (
              displayedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={student.pictureUrl || undefined} alt={student.name} />
                        <AvatarFallback className="bg-teacher-300 text-white">
                          {getInitials(student.name)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{student.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{student.serialNumber}</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{formatDate(student.startDate)}</TableCell>
                  <TableCell>{formatDate(student.endDate)}</TableCell>
                  <TableCell className="font-medium">{formatCurrency(student.payment)}</TableCell>
                  <TableCell>{student.paymentMethod}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        student.classType === "Ho'oponopo"
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          : student.classType === "Astrology"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : "bg-orange-100 text-orange-800 hover:bg-orange-200"
                      }
                    >
                      {student.classType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDelete(student.id, student.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MasterData;
