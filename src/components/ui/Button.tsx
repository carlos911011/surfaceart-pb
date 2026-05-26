"use client";

import { forwardRef } from "react";
import Spinner from "./Spinner";

type Variant = "primary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  children: React.ReactNode;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-gold hover:bg-gold-light text-carbon font-semibold border border-transparent",
  ghost:
    "bg-transparent hover:bg-white/10 text-warm-white border border-warm-white/40 hover:border-warm-white/70",
  outline:
    "bg-transparent hover:bg-gold/10 text-gold border border-gold hover:border-gold-light",
  danger:
    "bg-red-600 hover:bg-red-500 text-white font-semibold border border-transparent",
};

const sizeClasses: Record<Size, string> = {
  sm: "px-4 py-1.5 text-sm rounded-lg",
  md: "px-6 py-2.5 text-base rounded-xl",
  lg: "px-8 py-3.5 text-lg rounded-xl",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      children,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={[
          "inline-flex items-center justify-center gap-2 transition-all duration-200",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2",
          variantClasses[variant],
          sizeClasses[size],
          className,
        ].join(" ")}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
