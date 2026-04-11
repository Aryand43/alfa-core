import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes } from "react";

const base =
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

const variants: Record<string, string> = {
  primary: "bg-sky-600 text-white hover:bg-sky-500",
  outline: "border border-slate-700 text-slate-200 hover:bg-slate-800 hover:text-white",
  ghost: "text-slate-300 hover:bg-slate-800 hover:text-white",
};

const sizes: Record<string, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-9 px-4 text-sm",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md";
  asChild?: boolean;
}

export default function Button({
  variant = "primary",
  size = "md",
  asChild = false,
  className = "",
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    />
  );
}
