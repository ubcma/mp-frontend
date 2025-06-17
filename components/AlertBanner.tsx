"use client";

import { cn } from "@/lib/utils";
import { AlertCircleIcon } from "lucide-react";

type AlertBannerProps = {
  children: React.ReactNode;
  color?: "red" | "green" | "yellow" | "blue";
};

const colorClasses = {
  red: "bg-red-100 text-red-800 border-red-300",
  green: "bg-green-100 text-green-800 border-green-300",
  yellow: "bg-yellow-100 text-yellow-800 border-yellow-300",
  blue: "bg-blue-100 text-blue-800 border-blue-300",
};

export function AlertBanner({ children, color = "blue" }: AlertBannerProps) {
  return (
    <div
      className={cn(
        "w-full flex flex-row items-center gap-2 px-4 py-3 border text-sm font-medium shadow-sm rounded-md",
        colorClasses[color]
      )}
      role="alert"
    >
      <AlertCircleIcon/>
      {children}
    </div>
  );
}
