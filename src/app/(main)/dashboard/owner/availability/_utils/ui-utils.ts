export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: "TND",
  }).format(amount);
};