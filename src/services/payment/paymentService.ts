
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentMethod } from "@/types/student";

/**
 * Fetch all payments from the database
 */
export const fetchPayments = async (): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from("payments")
    .select("*");

  if (error) {
    console.error("Error fetching payments:", error.message);
    throw new Error("Failed to fetch payments");
  }

  // Transform the snake_case response to camelCase for our app types
  return (data || []).map(item => ({
    id: item.id,
    studentId: item.student_id,
    amount: item.amount,
    date: item.date,
    method: item.method as PaymentMethod
  }));
};

/**
 * Fetch payments for a specific student
 */
export const fetchPaymentsByStudentId = async (studentId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", studentId);

  if (error) {
    console.error(`Error fetching payments for student ${studentId}:`, error.message);
    throw new Error("Failed to fetch student payments");
  }

  // Transform the snake_case response to camelCase for our app types
  return (data || []).map(item => ({
    id: item.id,
    studentId: item.student_id,
    amount: item.amount,
    date: item.date,
    method: item.method as PaymentMethod
  }));
};

/**
 * Add a new payment record
 */
export const addPayment = async (payment: Omit<Payment, "id">): Promise<Payment> => {
  // Convert from our app's camelCase to DB's snake_case
  const { data, error } = await supabase
    .from("payments")
    .insert({
      student_id: payment.studentId,
      amount: payment.amount,
      date: payment.date,
      method: payment.method
    })
    .select()
    .single();

  if (error) {
    console.error("Error adding payment:", error.message);
    throw new Error("Failed to add payment");
  }

  // Transform back to our app's type format
  return {
    id: data.id,
    studentId: data.student_id,
    amount: data.amount,
    date: data.date,
    method: data.method as PaymentMethod
  };
};

/**
 * Update an existing payment record
 */
export const updatePayment = async (payment: Payment): Promise<Payment> => {
  const { data, error } = await supabase
    .from("payments")
    .update({
      student_id: payment.studentId,
      amount: payment.amount,
      date: payment.date,
      method: payment.method
    })
    .eq("id", payment.id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating payment ${payment.id}:`, error.message);
    throw new Error("Failed to update payment");
  }

  // Transform back to our app's type format
  return {
    id: data.id,
    studentId: data.student_id,
    amount: data.amount,
    date: data.date,
    method: data.method as PaymentMethod
  };
};

/**
 * Delete a payment record
 */
export const deletePayment = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("payments")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting payment ${id}:`, error.message);
    throw new Error("Failed to delete payment");
  }
};
