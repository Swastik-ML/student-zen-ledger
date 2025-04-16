
import { supabase } from "@/integrations/supabase/client";
import { Payment } from "@/utils/types";

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

  return data || [];
};

/**
 * Fetch payments for a specific student
 */
export const fetchPaymentsByStudentId = async (studentId: string): Promise<Payment[]> => {
  const { data, error } = await supabase
    .from("payments")
    .select("*")
    .eq("studentId", studentId);

  if (error) {
    console.error(`Error fetching payments for student ${studentId}:`, error.message);
    throw new Error("Failed to fetch student payments");
  }

  return data || [];
};

/**
 * Add a new payment record
 */
export const addPayment = async (payment: Omit<Payment, "id">): Promise<Payment> => {
  const { data, error } = await supabase
    .from("payments")
    .insert(payment)
    .select()
    .single();

  if (error) {
    console.error("Error adding payment:", error.message);
    throw new Error("Failed to add payment");
  }

  return data;
};

/**
 * Update an existing payment record
 */
export const updatePayment = async (payment: Payment): Promise<Payment> => {
  const { data, error } = await supabase
    .from("payments")
    .update(payment)
    .eq("id", payment.id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating payment ${payment.id}:`, error.message);
    throw new Error("Failed to update payment");
  }

  return data;
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
