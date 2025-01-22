"use client";

import { useState, FormEvent } from "react";
import { Pencil, Users } from "lucide-react";
import Link from "next/link";
import { z } from "zod";
import { Input } from "@repo/ui/input";
import { CreateUserSchema } from "@repo/common/schema";
import { Button } from "@repo/ui/button";
import axios from "axios";
import { HTTP_BACKEND } from "@/config";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof CreateUserSchema>;

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>(
    {}
  );

  const testimonials = [
    {
      content:
        "This collaborative drawing platform is a game-changer! It's easy to use, provides real-time collaboration, and has helped our team visualize ideas effectively. I highly recommend it.",
      author: "Sarah Chen",
      role: "Design Lead, Artify",
    },
    {
      content:
        "The real-time collaboration features are incredible. It's like having our entire team in the same room, sketching and ideating together.",
      author: "Marcus Rodriguez",
      role: "Product Manager, InnovateCo",
    },
    {
      content:
        "Perfect for remote design sprints and workshops. The infinite canvas and sharing capabilities make it our go-to tool for visual collaboration.",
      author: "Emily Watson",
      role: "UX Director, DesignFlow",
    },
  ];

  const validateForm = () => {
    try {
      CreateUserSchema.parse(formData);
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
      const response = await axios.post(`${HTTP_BACKEND}/register`, formData);

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      console.log("Form submitted:", response.data);
      setFormData({
        name: "",
        email: "",
        password: "",
      });
      setErrors({});
      router.push("/dashboard");
    } catch (error: any) {
      if (error.response?.data?.message) {
        setErrors({ email: error.response.data.message });
      } else {
        setErrors({ email: "Registration failed. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Section */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-r from-[#434343] to-black text-white p-12 relative">
        <div className="max-w-md mx-auto flex flex-col justify-between h-full">
          <div className="flex items-center absolute top-8 left-8 space-x-2">
            <Pencil className="size-5" />
            <span className="text-2xl font-bold">Portrait</span>
          </div>

          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <div>
              <h1 className="text-4xl text-center font-bold mb-4">
                Collaborate in Real-Time, Anywhere
              </h1>
              <p className="text-gray-400 text-center">
                Create, share, and collaborate on drawings with your team in
                real-time!
              </p>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-900 rounded-xl p-6">
                <p className="mb-4 text-gray-300">
                  {testimonials[currentSlide].content}
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {testimonials[currentSlide].author}
                    </p>
                    <p className="text-sm text-gray-400">
                      {testimonials[currentSlide].role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-2 h-2 rounded-full ${
                      currentSlide === index ? "bg-white" : "bg-gray-600"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div></div>
        </div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:!w-1/2 p-8 sm:p-12 flex items-center rounded-l-3xl">
        <div className="w-full max-w-md mx-auto space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-4xl font-bold text-center">
              Create an account
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <Button type="submit" className="w-full" size="lg">
              {loading ? "Creating Account..." : "Create an Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
