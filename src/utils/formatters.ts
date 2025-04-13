
// Format a date to a readable string (DD/MM/YYYY)
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

// Format currency (INR)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};

// Get month name from date
export const getMonthName = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('default', { month: 'long' });
};

// Get year from date
export const getYear = (dateString: string): number => {
  return new Date(dateString).getFullYear();
};
