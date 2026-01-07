export function formatDate(date: string | Date | undefined | null) {
  if (!date) return "Chưa có";
  return new Date(date).toLocaleDateString("vi-VN");
}

export function formatDateTime(date: string | Date | undefined | null) {
  if (!date) return "Chưa có";
  const d = new Date(date);

  const datePart = d.toLocaleDateString("vi-VN");
  const timePart = d.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  }); 

  return `${datePart} ${timePart}`;
}