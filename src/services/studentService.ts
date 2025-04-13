
import { supabase } from "@/integrations/supabase/client";
import { Student, Payment, ClassType, PaymentMethod } from "@/utils/types";

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
        paymentHistory: studentPayments
      };
    });

    return students;
  } catch (error) {
    console.error('Error in fetchStudents:', error);
    throw error;
  }
}

export async function createStudent(student: Omit<Student, 'id' | 'paymentHistory'>): Promise<Student> {
  try {
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
        picture_url: student.pictureUrl
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
      paymentHistory: []
    };
  } catch (error) {
    console.error('Error in createStudent:', error);
    throw error;
  }
}

export async function createPayment(payment: Omit<Payment, 'id'>): Promise<Payment> {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert({
        student_id: payment.studentId,
        amount: payment.amount,
        date: payment.date,
        method: payment.method
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating payment:', error);
      throw error;
    }

    // Return the created payment
    return {
      id: data.id,
      studentId: data.student_id,
      amount: data.amount,
      date: data.date,
      method: data.method as PaymentMethod
    };
  } catch (error) {
    console.error('Error in createPayment:', error);
    throw error;
  }
}
