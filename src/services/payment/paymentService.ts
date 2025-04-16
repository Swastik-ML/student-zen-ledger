
import { supabase } from "@/integrations/supabase/client";
import { Payment, PaymentMethod } from "@/types/common";

/**
 * Create a new payment record
 */
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
