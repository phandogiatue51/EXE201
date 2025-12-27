import { redirect } from "next/navigation";

export default function AdminDashboardRedirect() {
  // Server-side redirect from /admin/dashboard to /admin
  redirect("/admin");
}
