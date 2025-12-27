import { redirect } from "next/navigation";

export default function LoginRedirect() {
  // Server-side redirect from /login to /auth/login
  redirect("/auth/login");
}
