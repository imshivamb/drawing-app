"use client";
import { AuthLayout } from "@/components/AuthPage";
import { Input } from "@repo/ui/input";
import { Button } from "@repo/ui/button";
import { useState } from "react";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Handle login logic here
    setIsLoading(false);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your account to continue"
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          label="Full Name"
          type="text"
          placeholder="Enter your Name"
          required
        />
        <Input
          label="Email"
          type="email"
          placeholder="Enter your email"
          required
          autoComplete="email"
        />
        <Input
          label="Password"
          type="password"
          required
          autoComplete="password"
          placeholder="Enter your password"
        />
        <Button type="submit" isLoading={isLoading}>
          Sign in
        </Button>
      </form>
    </AuthLayout>
  );
}
