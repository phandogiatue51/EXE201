export function formatDate(date: string | Date) {
  if (!date) return "Chưa có";
  return new Date(date).toLocaleDateString("vi-VN");
}

export function formatDateTime(date: string | Date) {
  if (!date) return "Chưa có";
  return new Date(date).toLocaleString("vi-VN");
}
