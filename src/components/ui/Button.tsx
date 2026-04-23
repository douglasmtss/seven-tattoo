"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#0d0d0d] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary:
        "bg-[var(--gold)] text-[#0d0d0d] hover:bg-[var(--gold-light)] focus:ring-[var(--gold)] border border-[var(--gold)]",
      secondary:
        "bg-transparent text-[var(--gold)] border border-[var(--gold)] hover:bg-[var(--gold)] hover:text-[#0d0d0d] focus:ring-[var(--gold)]",
      ghost:
        "bg-transparent text-[var(--foreground)] border border-[var(--border)] hover:border-[var(--gold)] hover:text-[var(--gold)] focus:ring-[var(--border)]",
      danger:
        "bg-red-700 text-white hover:bg-red-600 focus:ring-red-700 border border-red-700",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-sm rounded",
      md: "px-5 py-2.5 text-base rounded-md",
      lg: "px-8 py-3.5 text-lg rounded-md tracking-wide",
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
