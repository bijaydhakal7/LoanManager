"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginValues } from "@/features/auth/auth-schemas";
import { useLogin } from "@/features/auth/auth-mutations";
import { getApiErrorMessage } from "@/lib/api/errors";
import { useAuthStore } from "@/lib/auth/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const LoginForm = () => {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { mutateAsync, isPending, error } = useLogin();

  const form = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginValues) => {
    const result = await mutateAsync(values);
    setAuth(result.accessToken, result.user);
    router.replace("/dashboard");
  };

  return (
    <Card className="w-full max-w-md border-slate-200 bg-white/95 shadow-xl">
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <p className="text-sm text-slate-500">Sign in to manage your loans and expenses.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@company.com" {...form.register("email")} />
            {form.formState.errors.email ? (
              <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" {...form.register("password")} />
            {form.formState.errors.password ? (
              <p className="text-sm text-red-600">{form.formState.errors.password.message}</p>
            ) : null}
          </div>
          {error ? (
            <p className="text-sm text-red-600">{getApiErrorMessage(error, "Login failed. Please try again.")}</p>
          ) : null}
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
