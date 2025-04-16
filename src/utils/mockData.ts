// Mock data for students (replace with actual data fetching from API)
import { Student } from "./types";

/**
 * Determines if a student is active based on start and end dates
 */
export const isStudentActive = (student: Student): boolean => {
  const currentDate = new Date();
  const startDate = new Date(student.startDate);
  
  // If start date is in the future, student is not yet active
  if (startDate > currentDate) {
    return false;
  }
  
  // If there's no end date, student is still active
  if (!student.endDate) return true;
  
  // Check if end date is in future (still active) or past (inactive)
  const endDate = new Date(student.endDate);
  return endDate >= currentDate;
};

/**
 * Determines if a student is upcoming (start date is in the future)
 */
export const isStudentUpcoming = (student: Student): boolean => {
  const currentDate = new Date();
  const startDate = new Date(student.startDate);
  return startDate > currentDate;
};
