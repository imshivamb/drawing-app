"use client";

import * as React from "react";

interface InputProps {
  type?: "text" | "email" | "password" | "number" | "tel" | "url";
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  id?: string;
  name?: string;
  autoComplete?: string;
  size?: "default" | "sm" | "lg";
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  type = "text",
  placeholder,
  value,
  onChange,
  label,
  error,
  disabled = false,
  required = false,
  className = "",
  id,
  name,
  autoComplete,
  size = "default",
  leftIcon,
  rightIcon,
}: InputProps) {
  // Styles based on size
  const sizeStyles = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
  }[size];

  // Base styles that are always applied
  const baseStyles =
    "w-full rounded-md border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-600 dark:focus:ring-violet-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900 disabled:cursor-not-allowed disabled:opacity-50";

  // Error styles
  const errorStyles = error
    ? "border-red-500 dark:border-red-400 focus:ring-red-600 dark:focus:ring-red-400"
    : "border-gray-200 dark:border-gray-700";

  // Icon padding adjustments
  const iconPadding = {
    left: leftIcon ? "pl-10" : "",
    right: rightIcon ? "pr-10" : "",
  };

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200"
        >
          {label}
          {required && (
            <span className="text-red-500 dark:text-red-400 ml-1">*</span>
          )}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}

        <input
          type={type}
          id={id}
          name={name}
          className={`${baseStyles} ${sizeStyles} ${errorStyles} ${iconPadding.left} ${iconPadding.right} ${className}`}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
        />

        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
