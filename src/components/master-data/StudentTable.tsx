
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Student } from "@/utils/types";
import { Pencil } from "lucide-react";

interface StudentTableProps {
  students: Student[];
  onEditClick: (student: Student) => void;
}

const StudentTable = ({ students, onEditClick }: StudentTableProps) => {
  return (
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
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.length > 0 ? (
            students.map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.serialNumber}</TableCell>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.studentId}</TableCell>
                <TableCell>{new Date(student.startDate).toLocaleDateString()}</TableCell>
                <TableCell>{student.classType}</TableCell>
                <TableCell>{student.payment}</TableCell>
                <TableCell>{student.paymentMethod}</TableCell>
                <TableCell>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onEditClick(student)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                {students.length === 0 ? "No students found in the database." : "No students match your search criteria."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentTable;
