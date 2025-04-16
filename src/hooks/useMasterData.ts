
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Student } from "@/utils/types";
import { fetchStudents } from "@/services/studentService";
import { format } from "date-fns";

export const useMasterData = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [classFilter, setClassFilter] = useState<string>("all");
  const [studentIdFilter, setStudentIdFilter] = useState<string>("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
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
    // Filter students based on search term, class filter, and student ID filter
    const result = students.filter(student => {
      const matchesSearch = searchTerm === "" || 
        student.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesClass = classFilter === "all" || student.classType === classFilter;
      
      const matchesStudentId = studentIdFilter === "" || 
        student.studentId.toLowerCase().includes(studentIdFilter.toLowerCase());
      
      return matchesSearch && matchesClass && matchesStudentId;
    });
    
    setFilteredStudents(result);
  }, [searchTerm, classFilter, studentIdFilter, students]);

  const handleEditClick = (student: Student) => {
    setSelectedStudent(student);
    setIsEditDialogOpen(true);
  };

  const handleEditComplete = (updatedStudent: Student) => {
    // Update the students list with the edited student
    setStudents(prevStudents => 
      prevStudents.map(s => s.id === updatedStudent.id ? updatedStudent : s)
    );
    setIsEditDialogOpen(false);
    toast({
      title: "Student Updated",
      description: "Student information has been successfully updated.",
    });
  };

  const exportData = (period: 'all' | 'year' | 'month') => {
    let dataToExport = filteredStudents;
    const currentDate = new Date();
    let filename = 'student_data';

    if (period === 'year') {
      const currentYear = currentDate.getFullYear();
      dataToExport = filteredStudents.filter(student => {
        const startDate = new Date(student.startDate);
        return startDate.getFullYear() === currentYear;
      });
      filename = `student_data_${currentYear}`;
    } else if (period === 'month') {
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth();
      dataToExport = filteredStudents.filter(student => {
        const startDate = new Date(student.startDate);
        return startDate.getFullYear() === currentYear && startDate.getMonth() === currentMonth;
      });
      filename = `student_data_${format(currentDate, 'MMM_yyyy')}`;
    }

    // Convert data to CSV format
    const headers = ['Serial Number', 'Name', 'Student ID', 'Start Date', 'Class Type', 'Payment', 'Payment Method'];
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(student => [
        student.serialNumber,
        `"${student.name.replace(/"/g, '""')}"`, // Handle quotes in names
        student.studentId,
        new Date(student.startDate).toLocaleDateString(),
        student.classType,
        student.payment,
        student.paymentMethod
      ].join(','))
    ].join('\n');
    
    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return {
    loading,
    error,
    filteredStudents,
    searchTerm,
    setSearchTerm,
    classFilter,
    setClassFilter,
    studentIdFilter,
    setStudentIdFilter,
    selectedStudent,
    isEditDialogOpen,
    setIsEditDialogOpen,
    handleEditClick,
    handleEditComplete,
    exportData
  };
};
