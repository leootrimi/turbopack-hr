"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface TabOption {
  id: string;
  label: string;
  icon?: ReactNode;
}

interface TabsProps {
  options: readonly TabOption[] | readonly string[];
  value: string;
  onChange: (value: string) => void;
  variant?: "pill" | "underline";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: "px-4 py-1.5 text-xs",
  md: "px-6 py-2 text-sm",
  lg: "px-8 py-2.5 text-base",
};

export function Tabs({
  options,
  value,
  onChange,
  variant = "pill",
  size = "md",
  fullWidth = false,
  className = "",
}: TabsProps) {
  // Normalize options to array of objects
  const normalizedOptions = options.map((opt) =>
    typeof opt === "string" ? { id: opt, label: opt } : opt
  );

  return (
    <div
      className={`relative flex bg-slate-100/80 p-1 rounded-xl ${
        fullWidth ? "w-full" : "w-max"
      } ${className}`}
    >
      {normalizedOptions.map((option) => {
        const isActive = value === option.id;
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={`
              relative flex items-center justify-center gap-2 font-medium transition-all duration-200
              ${sizeClasses[size]}
              ${isActive ? "text-slate-800" : "text-slate-500 hover:text-slate-700"}
              ${fullWidth ? "flex-1" : ""}
              rounded-lg
            `}
          >
            {option.icon && (
              <span className={`${isActive ? "opacity-100" : "opacity-70"} transition-opacity`}>
                {option.icon}
              </span>
            )}
            <span>{option.label}</span>

            {variant === "underline" && isActive && (
              <motion.div
                layoutId="active-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full"
                transition={{ type: "spring", duration: 0.3 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}