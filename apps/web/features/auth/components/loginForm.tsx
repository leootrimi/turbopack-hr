// components/login-form.tsx
"use client";

import { Button } from "@/components/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/components/ui/card";
import { Input } from "@/components/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { LoginBody } from "@repo/types";
import { useLoginMutation } from "../hooks/queries";
import { useAuth } from "../hooks/useAuth";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();
  const { login } = useAuth();
  const { mutateAsync: loginMutation, isPending } = useLoginMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload: LoginBody = { email, password };
      const data = await loginMutation(payload);
      
      if (data.access_token) {
        login(data.access_token);
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-[#004466] p-4">
      <div className="mb-8 flex flex-col justify-center items-center gap">
        <div className="w-20 h-20 bg-linear-to-t from-[#004466] to-sidebar-accent rounded-full flex items-center justify-center border-6 border-white shadow-lg">
          <span className="text-white font-bold text-lg">C</span>
        </div>
      </div>

      {/* Login Card */}
      <Card className="w-full max-w-md border border-[#004466]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Sign in</CardTitle>
          <CardDescription className="text-center text-primary-foreground">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isPending}
                className="placeholder:text-gray-300"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <a
                  href="#"
                  className="text-sm text-sidebar-primary hover:text-blue-500 hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isPending}
                className="placeholder:text-gray-300"
              />
            </div>
            <Button type="submit" className="w-full text-white" disabled={isPending}>
              {isPending ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-white" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don&apos;t have an account?{" "}
            <a
              href="#"
              className="text-sidebar-primary hover:text-blue-500 hover:underline"
            >
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
