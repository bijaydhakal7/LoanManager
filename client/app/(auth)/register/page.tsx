import Link from "next/link";
import { RegisterForm } from "@/features/auth/register-form";

export default function RegisterPage() {
  return (
    <div className="flex w-full flex-col items-center gap-6">
      <RegisterForm />
      <p className="text-sm text-slate-600">
        Already have an account?{" "}
        <Link className="font-medium text-blue-600 hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </div>
  );
}
