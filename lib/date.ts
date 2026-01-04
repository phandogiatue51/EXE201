export function formatDate(date: string | Date | undefined | null) {
  if (!date) return "Chưa có";
  return new Date(date).toLocaleDateString("vi-VN");
}

export function formatDateTime(date: string | Date | undefined | null) {
  if (!date) return "Chưa có";
  return new Date(date).toLocaleString("vi-VN");
}