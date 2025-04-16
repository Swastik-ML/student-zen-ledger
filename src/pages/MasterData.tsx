
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EditStudentForm from "@/components/student/EditStudentForm";
import FilterBar from "@/components/student/master-data/FilterBar";
import StudentTable from "@/components/student/master-data/StudentTable";
import ExportMenu from "@/components/student/master-data/ExportMenu";
import { useMasterData } from "@/hooks/student/useMasterData";

const MasterData = () => {
  const {
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
  } = useMasterData();

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
      <div className="flex flex-col md:flex-row justify-between mb-6">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Master Data</h1>
        <ExportMenu onExport={exportData} />
      </div>
      
      <FilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        classFilter={classFilter}
        setClassFilter={setClassFilter}
        studentIdFilter={studentIdFilter}
        setStudentIdFilter={setStudentIdFilter}
      />
      
      <StudentTable 
        students={filteredStudents} 
        onEditClick={handleEditClick} 
      />

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Student Information</DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <EditStudentForm 
              student={selectedStudent} 
              onComplete={handleEditComplete} 
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MasterData;
