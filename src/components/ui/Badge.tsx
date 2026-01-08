import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  size = "md",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-[#3a3a3a] text-[#B0B0B0]",
    success: "bg-[#4CAF50]/20 text-[#4CAF50]",
    warning: "bg-[#FF9800]/20 text-[#FF9800]",
    error: "bg-[#f44336]/20 text-[#f44336]",
    info: "bg-[#4A9EFF]/20 text-[#4A9EFF]",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
}
