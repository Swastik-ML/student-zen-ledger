
export const isStudentActive = (student: Student): boolean => {
  if (!student.endDate) return true;
  
  const now = new Date();
  const endDate = new Date(student.endDate);
  return endDate > now;
};
