"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";
import { z } from "zod";
import { Input } from "@repo/ui/input";
import { CreateUserSchema, SignInUserSchema } from "@repo/common/schema";
import { Button } from "@repo/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type FormData = z.infer<typeof CreateUserSchema>;

interface AuthFormProps {
  isLogin: boolean;
}

export default function AuthForm({ isLogin }: AuthFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { register, login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const validateForm = () => {
    try {
      if (isLogin) {
        SignInUserSchema.parse(formData);
      } else {
        CreateUserSchema.parse(formData);
      }
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const formErrors: Partial<Record<keyof FormData, string>> = {};
        error.errors.forEach((err) => {
          formErrors[err.path[0] as keyof FormData] = err.message;
        });
        setErrors(formErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password, formData.name);
      }
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      setErrors({});
      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrors({
          email: isLogin
            ? `Login failed: ${error.message}`
            : `Registration failed: ${error.message}`,
        });
      } else {
        setErrors({
          email: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold">
          {isLogin ? "Welcome Back" : "Create an Account"}
        </h2>
        <p className="text-gray-600">
          {isLogin
            ? "Sign in to your account to continue"
            : "Get started with your account"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div>
            <Input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.name ? "border-red-500" : "border-gray-300"
              } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
              error={errors.name}
            />
          </div>
        )}

        <div>
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
            error={errors.email}
          />
        </div>

        <div>
          <Input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none`}
            error={errors.password}
          />
        </div>

        <Button type="submit" className="w-full" size="lg" isLoading={loading}>
          {isLogin ? "Sign in" : "Create an Account"}
        </Button>
      </form>

      <p className="text-center text-sm text-gray-600">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Link
          href={isLogin ? "/register" : "/login"}
          className="dark:text-white text-purple-600 hover:underline"
        >
          {isLogin ? "Register" : "Log in"}
        </Link>
      </p>
    </div>
  );
}
