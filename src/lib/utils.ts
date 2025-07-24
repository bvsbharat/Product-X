import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility function to determine if a background is dark based on its CSS class or color value
export function isDarkBackground(bgValue: string): boolean {
  // Check for dark color classes
  const darkPatterns = [
    'bg-gray-800', 'bg-gray-900', 'bg-black',
    'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900',
    'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900',
    'bg-purple-500', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'bg-purple-900',
    'bg-violet-500', 'bg-violet-600', 'bg-violet-700', 'bg-violet-800', 'bg-violet-900',
    'bg-rose-500', 'bg-rose-600', 'bg-rose-700', 'bg-rose-800', 'bg-rose-900',
    'bg-orange-500', 'bg-orange-600', 'bg-orange-700', 'bg-orange-800', 'bg-orange-900',
    'bg-teal-500', 'bg-teal-600', 'bg-teal-700', 'bg-teal-800', 'bg-teal-900',
    'bg-emerald-500', 'bg-emerald-600', 'bg-emerald-700', 'bg-emerald-800', 'bg-emerald-900',
    'bg-indigo-500', 'bg-indigo-600', 'bg-indigo-700', 'bg-indigo-800', 'bg-indigo-900',
    'bg-slate-500', 'bg-slate-600', 'bg-slate-700', 'bg-slate-800', 'bg-slate-900'
  ];
  
  // Check for glass dark backgrounds
  if (bgValue.includes('bg-black/') || bgValue.includes('bg-gray-800') || bgValue.includes('bg-gray-900')) {
    return true;
  }
  
  // Check if any dark pattern matches
  return darkPatterns.some(pattern => bgValue.includes(pattern));
}

// Get appropriate text color class based on background
export function getTextColorForBackground(bgValue: string): string {
  return isDarkBackground(bgValue) ? 'text-white' : 'text-gray-700';
}

// Get appropriate icon color class based on background
export function getIconColorForBackground(bgValue: string): string {
  return isDarkBackground(bgValue) ? 'text-white' : 'text-gray-700';
}

// Get appropriate hover background class based on current background
export function getHoverBgForBackground(bgValue: string): string {
  if (isDarkBackground(bgValue)) {
    return 'hover:bg-white/10';
  }
  return 'hover:bg-gray-100/60';
}

// Get appropriate active background class based on current background
export function getActiveBgForBackground(bgValue: string): string {
  if (isDarkBackground(bgValue)) {
    return 'bg-white/20';
  }
  return 'bg-gray-900';
}

// Get appropriate active text color class based on current background
export function getActiveTextColorForBackground(bgValue: string): string {
  if (isDarkBackground(bgValue)) {
    return 'text-white';
  }
  return 'text-white';
}
