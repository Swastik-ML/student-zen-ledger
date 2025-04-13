
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Student, ClassType } from "@/utils/types";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchStudents } from "@/services/studentService";

const MasterData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        setLoading(true);
        const data = await fetchStudents();
        setStudents(data);
        setFilteredStudents(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading students:", err);
        setError("Failed to load students. Please try again later.");
        setLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load students. Please try again later."
        });
      }
    };

    loadStudents();
  }, [toast]);

  useEffect(() => {
    // Filter students based on search term and class filter
    const result = students.filter(student => {
      const matchesSearch = searchTerm === "" || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        student.studentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = classFilter === "" || student.classType === classFilter;
      
      return matchesSearch && matchesClass;
    });
    
    setFilteredStudents(result);
  }, [searchTerm, classFilter, students]);

  if (loading) {
    return (
      <div className="container py-8 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-teacher-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-teacher-500">Loading student data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          <h3 className="font-bold">Error</h3>
          <p>{error}</p>
          <Button 
            variant="outline" 
            className="mt-4" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Master Data</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            placeholder="Search by name or student ID" 
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
              <SelectItem value="">All Classes</SelectItem>
              <SelectItem value="Ho'oponopo">Ho'oponopo</SelectItem>
              <SelectItem value="Astrology">Astrology</SelectItem>
              <SelectItem value="Pooja">Pooja</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableCaption>List of all registered students</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>S.No</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Student ID</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Class Type</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Payment Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>{student.serialNumber}</TableCell>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.studentId}</TableCell>
                  <TableCell>{new Date(student.startDate).toLocaleDateString()}</TableCell>
                  <TableCell>{student.classType}</TableCell>
                  <TableCell>{student.payment}</TableCell>
                  <TableCell>{student.paymentMethod}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  {students.length === 0 ? "No students found in the database." : "No students match your search criteria."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default MasterData;
