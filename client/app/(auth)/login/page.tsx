import Link from "next/link";
import { LoginForm } from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <LoginForm />
      <p className="text-sm text-slate-600">
        New here?{" "}
        <Link className="font-medium text-blue-600 hover:underline" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}
