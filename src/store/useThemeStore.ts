import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ThemeOption {
  id: string;
  name: string;
  type: 'gradient' | 'wallpaper';
  value: string;
  preview: string;
}

export interface ContainerBgOption {
  id: string;
  name: string;
  value: string;
  preview: string;
}

export interface MainContentBgOption {
  id: string;
  name: string;
  value: string;
  preview: string;
}

interface ThemeState {
  currentTheme: ThemeOption;
  currentContainerBg: ContainerBgOption;
  currentMainContentBg: MainContentBgOption;
  themes: ThemeOption[];
  containerBgOptions: ContainerBgOption[];
  mainContentBgOptions: MainContentBgOption[];
  setTheme: (theme: ThemeOption) => void;
  setContainerBg: (containerBg: ContainerBgOption) => void;
  setMainContentBg: (mainContentBg: MainContentBgOption) => void;
  getMainContentTextColor: () => string;
  getMainContentSecondaryTextColor: () => string;
  getMainContentMutedTextColor: () => string;
}

const defaultThemes: ThemeOption[] = [
  {
    id: 'default',
    name: 'Default Blue',
    type: 'gradient',
    value: 'bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100',
    preview: 'linear-gradient(135deg, #f1f5f9 0%, #dbeafe 50%, #e0e7ff 100%)'
  },
  {
    id: 'purple',
    name: 'Purple Dream',
    type: 'gradient',
    value: 'bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100',
    preview: 'linear-gradient(135deg, #f3e8ff 0%, #fdf2f8 50%, #e0e7ff 100%)'
  },
  {
    id: 'green',
    name: 'Nature Green',
    type: 'gradient',
    value: 'bg-gradient-to-br from-green-100 via-emerald-50 to-teal-100',
    preview: 'linear-gradient(135deg, #dcfce7 0%, #ecfdf5 50%, #ccfbf1 100%)'
  },
  {
    id: 'orange',
    name: 'Sunset Orange',
    type: 'gradient',
    value: 'bg-gradient-to-br from-orange-100 via-amber-50 to-yellow-100',
    preview: 'linear-gradient(135deg, #fed7aa 0%, #fffbeb 50%, #fefce8 100%)'
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    type: 'gradient',
    value: 'bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900',
    preview: 'linear-gradient(135deg, #111827 0%, #1e293b 50%, #111827 100%)'
  },
  {
    id: 'ocean',
    name: 'Ocean Blue',
    type: 'gradient',
    value: 'bg-gradient-to-br from-blue-200 via-cyan-100 to-teal-200',
    preview: 'linear-gradient(135deg, #bfdbfe 0%, #cffafe 50%, #a7f3d0 100%)'
  },
  {
     id: 'lavender',
     name: 'Lavender Fields',
     type: 'gradient',
     value: 'bg-gradient-to-br from-violet-200 via-purple-100 to-fuchsia-200',
     preview: 'linear-gradient(135deg, #ddd6fe 0%, #f3e8ff 50%, #f5d0fe 100%)'
   },
   {
    id: 'rose',
    name: 'Rose Gold',
    type: 'gradient',
    value: 'bg-gradient-to-br from-rose-100 via-pink-50 to-orange-100',
    preview: 'linear-gradient(135deg, #ffe4e6 0%, #fdf2f8 50%, #fed7aa 100%)'
  }
];

const defaultContainerBgOptions: ContainerBgOption[] = [
  {
    id: 'glass-light',
    name: 'Glass Light',
    value: 'bg-white/20 backdrop-blur-xl border border-white/30',
    preview: 'rgba(255, 255, 255, 0.2)'
  },
  {
    id: 'glass-dark',
    name: 'Glass Dark',
    value: 'bg-black/20 backdrop-blur-xl border border-white/20',
    preview: 'rgba(0, 0, 0, 0.2)'
  },
  {
    id: 'solid-white',
    name: 'Solid White',
    value: 'bg-white border border-gray-200',
    preview: '#ffffff'
  },
  {
    id: 'solid-gray',
    name: 'Light Gray',
    value: 'bg-gray-50 border border-gray-200',
    preview: '#f9fafb'
  },
  {
    id: 'solid-dark',
    name: 'Dark',
    value: 'bg-gray-900 border border-gray-700',
    preview: '#111827'
  },
  {
    id: 'gradient-blue',
    name: 'Blue Gradient',
    value: 'bg-gradient-to-br from-blue-50 to-indigo-100 border border-blue-200',
    preview: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)'
  },
  {
    id: 'gradient-purple',
    name: 'Purple Gradient',
    value: 'bg-gradient-to-br from-purple-50 to-pink-100 border border-purple-200',
    preview: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)'
  },
  {
    id: 'gradient-green',
    name: 'Green Gradient',
    value: 'bg-gradient-to-br from-green-50 to-emerald-100 border border-green-200',
    preview: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)'
  }
];

const defaultMainContentBgOptions: MainContentBgOption[] = [
  // Glass Effects
  {
    id: 'content-glass-light',
    name: 'Glass Light',
    value: 'bg-white/30 backdrop-blur-lg',
    preview: 'rgba(255, 255, 255, 0.3)'
  },
  {
    id: 'content-glass-dark',
    name: 'Glass Dark',
    value: 'bg-black/30 backdrop-blur-lg',
    preview: 'rgba(0, 0, 0, 0.3)'
  },
  // Neutral Solid Colors
  {
    id: 'content-solid-white',
    name: 'Pure White',
    value: 'bg-white',
    preview: '#ffffff'
  },
  {
    id: 'content-solid-gray-50',
    name: 'Light Gray',
    value: 'bg-gray-50',
    preview: '#f9fafb'
  },
  {
    id: 'content-solid-gray-100',
    name: 'Soft Gray',
    value: 'bg-gray-100',
    preview: '#f3f4f6'
  },
  {
    id: 'content-solid-gray-200',
    name: 'Medium Gray',
    value: 'bg-gray-200',
    preview: '#e5e7eb'
  },
  {
    id: 'content-solid-gray-800',
    name: 'Dark Gray',
    value: 'bg-gray-800 text-white',
    preview: '#1f2937'
  },
  {
    id: 'content-solid-gray-900',
    name: 'Charcoal',
    value: 'bg-gray-900 text-white',
    preview: '#111827'
  },
  // Blue Solid Colors
  {
    id: 'content-solid-blue-50',
    name: 'Light Blue',
    value: 'bg-blue-50',
    preview: '#eff6ff'
  },
  {
    id: 'content-solid-blue-100',
    name: 'Soft Blue',
    value: 'bg-blue-100',
    preview: '#dbeafe'
  },
  {
    id: 'content-solid-blue-500',
    name: 'Blue',
    value: 'bg-blue-500 text-white',
    preview: '#3b82f6'
  },
  {
    id: 'content-solid-blue-600',
    name: 'Deep Blue',
    value: 'bg-blue-600 text-white',
    preview: '#2563eb'
  },
  // Green Solid Colors
  {
    id: 'content-solid-green-50',
    name: 'Light Green',
    value: 'bg-green-50',
    preview: '#f0fdf4'
  },
  {
    id: 'content-solid-green-100',
    name: 'Soft Green',
    value: 'bg-green-100',
    preview: '#dcfce7'
  },
  {
    id: 'content-solid-green-500',
    name: 'Green',
    value: 'bg-green-500 text-white',
    preview: '#22c55e'
  },
  {
    id: 'content-solid-emerald-500',
    name: 'Emerald',
    value: 'bg-emerald-500 text-white',
    preview: '#10b981'
  },
  // Purple Solid Colors
  {
    id: 'content-solid-purple-50',
    name: 'Light Purple',
    value: 'bg-purple-50',
    preview: '#faf5ff'
  },
  {
    id: 'content-solid-purple-100',
    name: 'Soft Purple',
    value: 'bg-purple-100',
    preview: '#f3e8ff'
  },
  {
    id: 'content-solid-purple-500',
    name: 'Purple',
    value: 'bg-purple-500 text-white',
    preview: '#a855f7'
  },
  {
    id: 'content-solid-violet-500',
    name: 'Violet',
    value: 'bg-violet-500 text-white',
    preview: '#8b5cf6'
  },
  // Pink/Rose Solid Colors
  {
    id: 'content-solid-pink-50',
    name: 'Light Pink',
    value: 'bg-pink-50',
    preview: '#fdf2f8'
  },
  {
    id: 'content-solid-pink-100',
    name: 'Soft Pink',
    value: 'bg-pink-100',
    preview: '#fce7f3'
  },
  {
    id: 'content-solid-rose-500',
    name: 'Rose',
    value: 'bg-rose-500 text-white',
    preview: '#f43f5e'
  },
  // Orange/Yellow Solid Colors
  {
    id: 'content-solid-orange-50',
    name: 'Light Orange',
    value: 'bg-orange-50',
    preview: '#fff7ed'
  },
  {
    id: 'content-solid-orange-100',
    name: 'Soft Orange',
    value: 'bg-orange-100',
    preview: '#fed7aa'
  },
  {
    id: 'content-solid-orange-500',
    name: 'Orange',
    value: 'bg-orange-500 text-white',
    preview: '#f97316'
  },
  {
    id: 'content-solid-amber-100',
    name: 'Soft Amber',
    value: 'bg-amber-100',
    preview: '#fef3c7'
  },
  {
    id: 'content-solid-yellow-100',
    name: 'Soft Yellow',
    value: 'bg-yellow-100',
    preview: '#fef9c3'
  },
  // Cyan/Teal Solid Colors
  {
    id: 'content-solid-cyan-50',
    name: 'Light Cyan',
    value: 'bg-cyan-50',
    preview: '#ecfeff'
  },
  {
    id: 'content-solid-cyan-100',
    name: 'Soft Cyan',
    value: 'bg-cyan-100',
    preview: '#cffafe'
  },
  {
    id: 'content-solid-teal-500',
    name: 'Teal',
    value: 'bg-teal-500 text-white',
    preview: '#14b8a6'
  },
  // Gradients (keeping existing ones)
  {
    id: 'content-gradient-blue',
    name: 'Blue Gradient',
    value: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    preview: 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)'
  },
  {
    id: 'content-gradient-purple',
    name: 'Purple Gradient',
    value: 'bg-gradient-to-br from-purple-50 to-pink-100',
    preview: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)'
  },
  {
    id: 'content-gradient-green',
    name: 'Green Gradient',
    value: 'bg-gradient-to-br from-green-50 to-emerald-100',
    preview: 'linear-gradient(135deg, #f0fdf4 0%, #d1fae5 100%)'
  },
  {
    id: 'content-gradient-warm',
    name: 'Warm Gradient',
    value: 'bg-gradient-to-br from-orange-50 to-amber-100',
    preview: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 100%)'
  },
  {
    id: 'content-gradient-cool',
    name: 'Cool Gradient',
    value: 'bg-gradient-to-br from-cyan-50 to-blue-100',
    preview: 'linear-gradient(135deg, #ecfeff 0%, #dbeafe 100%)'
  }
];

export const useThemeStore = create<ThemeState>()(persist(
  (set, get) => ({
    currentTheme: defaultThemes[0],
    currentContainerBg: defaultContainerBgOptions[0],
    currentMainContentBg: defaultMainContentBgOptions[0],
    themes: defaultThemes,
    containerBgOptions: defaultContainerBgOptions,
    mainContentBgOptions: defaultMainContentBgOptions,
    setTheme: (theme) => set({ currentTheme: theme }),
    setContainerBg: (containerBg) => set({ currentContainerBg: containerBg }),
    setMainContentBg: (mainContentBg) => set({ currentMainContentBg: mainContentBg }),
    // Utility functions for dynamic colors
    getMainContentTextColor: () => {
      const { currentMainContentBg } = get();
      const darkPatterns = [
        'bg-gray-800', 'bg-gray-900', 'bg-black',
        'bg-blue-500', 'bg-blue-600', 'bg-green-500', 'bg-purple-500',
        'bg-violet-500', 'bg-rose-500', 'bg-orange-500', 'bg-teal-500',
        'bg-emerald-500'
      ];
      const isDark = darkPatterns.some(pattern => currentMainContentBg.value.includes(pattern)) ||
                     currentMainContentBg.value.includes('bg-black/');
      return isDark ? 'text-white' : 'text-gray-900';
    },
    getMainContentSecondaryTextColor: () => {
      const { currentMainContentBg } = get();
      const darkPatterns = [
        'bg-gray-800', 'bg-gray-900', 'bg-black',
        'bg-blue-500', 'bg-blue-600', 'bg-green-500', 'bg-purple-500',
        'bg-violet-500', 'bg-rose-500', 'bg-orange-500', 'bg-teal-500',
        'bg-emerald-500'
      ];
      const isDark = darkPatterns.some(pattern => currentMainContentBg.value.includes(pattern)) ||
                     currentMainContentBg.value.includes('bg-black/');
      return isDark ? 'text-gray-300' : 'text-gray-600';
    },
    getMainContentMutedTextColor: () => {
      const { currentMainContentBg } = get();
      const darkPatterns = [
        'bg-gray-800', 'bg-gray-900', 'bg-black',
        'bg-blue-500', 'bg-blue-600', 'bg-green-500', 'bg-purple-500',
        'bg-violet-500', 'bg-rose-500', 'bg-orange-500', 'bg-teal-500',
        'bg-emerald-500'
      ];
      const isDark = darkPatterns.some(pattern => currentMainContentBg.value.includes(pattern)) ||
                     currentMainContentBg.value.includes('bg-black/');
      return isDark ? 'text-gray-400' : 'text-gray-500';
    }
  }),
  {
    name: 'theme-storage',
  }
));