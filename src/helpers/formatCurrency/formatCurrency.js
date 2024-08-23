export const formatCurrency = (value) => {
  return value.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}