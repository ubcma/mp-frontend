import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')     
    .replace(/-+/g, '-');    
}

export function getInitials(name: string | undefined): string {
  if (name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  } else {
    return "";
  }
}

export type EventStatus = "Upcoming" | "Ongoing" | "Past"

export const getEventStatus = (date: Date) => {
  const today = new Date()
  const eventDate = new Date(date)

  if (eventDate > today) {
    return "Upcoming"
  } else if (eventDate.toDateString() === today.toDateString()) {
    return "Ongoing"
  } else {
    return "Past"
  }
}