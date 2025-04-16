
import { supabase } from "@/integrations/supabase/client";
import { Student, Payment } from "@/types/student";
import { PaymentMethod, ClassType } from "@/types/common";

/**
 * Fetch all students with their payment history
 */
export async function fetchStudents(): Promise<Student[]> {
  try {
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .order('serial_number', { ascending: true });
    
    if (studentsError) {
      console.error('Error fetching students:', studentsError);
      throw studentsError;
    }

    // Fetch all payments
    const { data: paymentsData, error: paymentsError } = await supabase
      .from('payments')
      .select('*')
      .order('date', { ascending: false });
    
    if (paymentsError) {
      console.error('Error fetching payments:', paymentsError);
      throw paymentsError;
    }

    // Map and transform data to match our Student type
    const students: Student[] = studentsData.map(student => {
      // Filter payments for this student
      const studentPayments = paymentsData.filter(
        payment => payment.student_id === student.id
      ).map(payment => ({
        id: payment.id,
        studentId: payment.student_id,
        amount: payment.amount,
        date: payment.date,
        method: payment.method as PaymentMethod
      }));

      return {
        id: student.id,
        serialNumber: student.serial_number,
        name: student.name,
        studentId: student.student_id,
        startDate: student.start_date,
        endDate: student.end_date,
        payment: student.payment,
        paymentMethod: student.payment_method as PaymentMethod,
        classType: student.class_type as ClassType,
        pictureUrl: student.picture_url,
        paymentHistory: studentPayments,
        classTime: student.class_time,
        classSection: student.class_section
      };
    });

    return students;
  } catch (error) {
    console.error('Error in fetchStudents:', error);
    throw error;
  }
}

/**
 * Create a new student record
 */
export async function createStudent(student: Omit<Student, 'id' | 'paymentHistory'>): Promise<Student> {
  try {
    // Ensure all required fields are provided
    if (!student.name || !student.studentId || !student.startDate || 
        !student.classType || !student.paymentMethod || student.payment === undefined || 
        student.serialNumber === undefined) {
      throw new Error('Missing required student fields');
    }
    
    const { data, error } = await supabase
      .from('students')
      .insert({
        serial_number: student.serialNumber,
        name: student.name,
        student_id: student.studentId,
        start_date: student.startDate,
        end_date: student.endDate,
        payment: student.payment,
        payment_method: student.paymentMethod,
        class_type: student.classType,
        picture_url: student.pictureUrl,
        class_time: student.classTime,
        class_section: student.classSection
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating student:', error);
      throw error;
    }

    // Return the created student
    return {
      id: data.id,
      serialNumber: data.serial_number,
      name: data.name,
      studentId: data.student_id,
      startDate: data.start_date,
      endDate: data.end_date,
      payment: data.payment,
      paymentMethod: data.payment_method as PaymentMethod,
      classType: data.class_type as ClassType,
      pictureUrl: data.picture_url,
      paymentHistory: [],
      classTime: data.class_time,
      classSection: data.class_section
    };
  } catch (error) {
    console.error('Error in createStudent:', error);
    throw error;
  }
}

/**
 * Update an existing student record
 */
export async function updateStudent(student: Student): Promise<Student> {
  try {
    // Ensure all required fields are provided
    if (!student.id || !student.name || !student.studentId || !student.startDate || 
        !student.classType || !student.paymentMethod || student.payment === undefined || 
        student.serialNumber === undefined) {
      throw new Error('Missing required student fields for update');
    }
    
    const { data, error } = await supabase
      .from('students')
      .update({
        serial_number: student.serialNumber,
        name: student.name,
        student_id: student.studentId,
        start_date: student.startDate,
        end_date: student.endDate,
        payment: student.payment,
        payment_method: student.paymentMethod,
        class_type: student.classType,
        picture_url: student.pictureUrl,
        class_time: student.classTime,
        class_section: student.classSection
      })
      .eq('id', student.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating student:', error);
      throw error;
    }

    // Preserve the payment history from the original student object
    return {
      id: data.id,
      serialNumber: data.serial_number,
      name: data.name,
      studentId: data.student_id,
      startDate: data.start_date,
      endDate: data.end_date,
      payment: data.payment,
      paymentMethod: data.payment_method as PaymentMethod,
      classType: data.class_type as ClassType,
      pictureUrl: data.picture_url,
      paymentHistory: student.paymentHistory,
      classTime: data.class_time,
      classSection: data.class_section
    };
  } catch (error) {
    console.error('Error in updateStudent:', error);
    throw error;
  }
}
