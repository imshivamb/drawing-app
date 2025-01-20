"use client";

import { type JSX } from "react";
import { Card } from "@repo/ui/card";
import { Paintbrush2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function AuthLayout({
  children,
  title,
  description,
  className = "",
}: AuthLayoutProps): JSX.Element {
  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="mb-8 flex items-center gap-2">
        <Paintbrush2 className="h-10 w-10 text-violet-600" />
        <span className="text-3xl font-bold text-gray-900">Portrait</span>
      </div>

      <Card
        className={`w-full max-w-md rounded-lg border bg-white p-6 shadow-sm ${className}`}
        title={title}
        href="#"
      >
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-500">{description}</p>
          {children}
        </div>
      </Card>

      <footer className="mt-8 text-sm text-gray-500 text-center">
        <p>© 2024 Portrait. All rights reserved.</p>
      </footer>
    </div>
  );
}
