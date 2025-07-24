import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Cloud,
  Calendar,
  Dumbbell,
  Camera,
  Plus,
  Search,
  HelpCircle,
  Clock,
  Settings,
  Bell,
} from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import ThemeModal from "./ThemeModal";
import {
  getIconColorForBackground,
  getTextColorForBackground,
  getHoverBgForBackground,
  getActiveBgForBackground,
  getActiveTextColorForBackground,
  isDarkBackground,
} from "../lib/utils";
// REMOVE: import { Scrollbar } from 'react-scrollbars-custom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const {
    currentTheme,
    currentContainerBg,
    currentMainContentBg,
    getMainContentTextColor,
    getMainContentSecondaryTextColor,
    getMainContentMutedTextColor,
  } = useThemeStore();
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);

  // Dynamic color classes based on backgrounds
  const containerIconColor = getIconColorForBackground(
    currentContainerBg.value
  );
  const containerTextColor = getTextColorForBackground(
    currentContainerBg.value
  );
  const containerHoverBg = getHoverBgForBackground(currentContainerBg.value);
  const containerActiveBg = getActiveBgForBackground(currentContainerBg.value);
  const containerActiveTextColor = getActiveTextColorForBackground(
    currentContainerBg.value
  );

  const mainContentIconColor = getIconColorForBackground(
    currentMainContentBg.value
  );
  const mainContentTextColor = getTextColorForBackground(
    currentMainContentBg.value
  );

  const isContainerDark = isDarkBackground(currentContainerBg.value);
  const isMainContentDark = isDarkBackground(currentMainContentBg.value);

  const handleSettingsClick = () => {
    setIsThemeModalOpen(true);
  };

  const handleCloseThemeModal = () => {
    setIsThemeModalOpen(false);
  };

  const menuItems = [
    {
      path: "/",
      icon: Plus,
      label: "Add",
      isActive: location.pathname === "/",
    },
    {
      path: "/search",
      icon: Search,
      label: "Search",
      isActive: location.pathname === "/search",
    },
    {
      path: "/help",
      icon: HelpCircle,
      label: "Help",
      isActive: location.pathname === "/help",
    },
    {
      path: "/home",
      icon: Home,
      label: "Home",
      isActive: location.pathname === "/home",
    },
    {
      path: "/recent",
      icon: Clock,
      label: "Recent",
      isActive: location.pathname === "/recent",
    },
  ];

  return (
    <div
      className={`min-h-screen ${currentTheme.value} relative overflow-hidden flex items-center justify-center transition-all duration-500`}
    >
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-blue-400/30 to-purple-600/30 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-br from-pink-400/30 to-orange-600/30 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2 animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-[300px] h-[300px] bg-gradient-to-br from-emerald-400/20 to-cyan-600/20 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
      </div>

      {/* Fixed Header Icons - Outside Container */}
      <div className="fixed top-6 right-6 z-50 flex items-center space-x-4">
        <button
          onClick={handleSettingsClick}
          className={`p-3 ${
            isContainerDark
              ? "bg-white/10 hover:bg-white/20 border-white/10"
              : "bg-white/80 hover:bg-white/90 border-white/20"
          } backdrop-blur-md rounded-xl shadow-lg transition-all duration-200 border hover:scale-105`}
          aria-label="Open theme settings"
        >
          <Settings
            className={`w-5 h-5 ${
              isContainerDark ? "text-white" : "text-gray-700"
            }`}
          />
        </button>
        <button
          className={`p-3 ${
            isContainerDark
              ? "bg-white/10 hover:bg-white/20 border-white/10"
              : "bg-white/80 hover:bg-white/90 border-white/20"
          } backdrop-blur-md rounded-xl shadow-lg transition-all duration-200 border`}
        >
          <Bell
            className={`w-5 h-5 ${
              isContainerDark ? "text-white" : "text-gray-700"
            }`}
          />
        </button>
      </div>

      {/* Centered Main Content with Sidebar */}
      <div className="flex flex-row items-center justify-center w-full max-w-7xl mx-auto">
        <div className="relative z-20 w-full max-w-5xl mx-auto">
          <div
            className={`${currentContainerBg.value} rounded-3xl shadow-2xl overflow-hidden flex h-[80vh]`}
          >
            {/* Side Navigation - Minimal Vertical Sidebar INSIDE Card */}
            <div className="flex flex-col items-center justify-between py-6 px-3 h-full">
              {/* Navigation Menu at Top */}
              <nav className="space-y-3 flex flex-col items-center">
                {menuItems.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={index}
                      to={item.path}
                      className={`flex items-center justify-center w-10 h-10 transition-all duration-200 ${
                        item.isActive && index === 0
                          ? `${containerActiveBg} rounded-xl`
                          : item.isActive
                          ? `${containerActiveBg} rounded-xl`
                          : `bg-transparent rounded-full ${containerHoverBg}`
                      }`}
                      title={item.label}
                    >
                      <IconComponent
                        className={`w-5 h-5 ${
                          item.isActive
                            ? containerActiveTextColor
                            : containerIconColor
                        }`}
                      />
                    </Link>
                  );
                })}
              </nav>
              {/* Logo Placeholder at Bottom */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full ${
                    isContainerDark ? "bg-white/20" : "bg-black"
                  } flex items-center justify-center`}
                >
                  <span
                    className={`${
                      isContainerDark ? "text-white" : "text-white"
                    } text-2xl font-bold`}
                  >
                    N
                  </span>
                </div>
              </div>
            </div>
            {/* Main Content Area */}
            <div
              className={`flex-1 h-full overflow-y-auto p-8 flex flex-col ${currentMainContentBg.value} rounded-3xl scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent`}
              style={
                {
                  "--dynamic-text-primary": getMainContentTextColor().replace(
                    "text-",
                    ""
                  ),
                  "--dynamic-text-secondary":
                    getMainContentSecondaryTextColor().replace("text-", ""),
                  "--dynamic-text-muted":
                    getMainContentMutedTextColor().replace("text-", ""),
                } as React.CSSProperties
              }
            >
              <div
                className={`w-full h-full dynamic-content ${getMainContentTextColor()}`}
              >
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Theme Modal */}
      <ThemeModal isOpen={isThemeModalOpen} onClose={handleCloseThemeModal} />
    </div>
  );
};

export default Layout;
