"use client";

import * as React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}

export function Button({
  children,
  variant = "default",
  size = "default",
  className = "",
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
}: ButtonProps) {
  const variantStyles = {
    default:
      "bg-violet-600 text-white hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600",
    destructive:
      "bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600",
    outline:
      "border border-violet-200 bg-transparent hover:bg-violet-100 dark:border-violet-700 dark:hover:bg-violet-900 dark:text-violet-100",
    secondary:
      "bg-violet-100 text-violet-900 hover:bg-violet-200 dark:bg-violet-800 dark:text-violet-100 dark:hover:bg-violet-700",
    ghost:
      "hover:bg-violet-100 hover:text-violet-900 dark:hover:bg-violet-800 dark:hover:text-violet-100",
    link: "text-violet-600 underline-offset-4 hover:underline dark:text-violet-400",
  }[variant];

  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-8 text-base",
    icon: "h-10 w-10",
  }[size];

  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:opacity-50 disabled:pointer-events-none";

  return (
    <button
      type={type}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600 dark:border-violet-400 dark:border-t-violet-200 mr-2" />
          {children}
        </div>
      ) : (
        children
      )}
    </button>
  );
}
