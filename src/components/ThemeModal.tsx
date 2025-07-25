import React from "react";
import { X, Palette, Check, Container, FileText, Database, RefreshCw } from "lucide-react";
import {
  useThemeStore,
  ThemeOption,
  ContainerBgOption,
  MainContentBgOption,
} from "../store/useThemeStore";
import { useStore } from "../store/useStore";

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ThemeModal: React.FC<ThemeModalProps> = ({ isOpen, onClose }) => {
  const {
    currentTheme,
    themes,
    setTheme,
    currentContainerBg,
    containerBgOptions,
    setContainerBg,
    currentMainContentBg,
    mainContentBgOptions,
    setMainContentBg,
  } = useThemeStore();
  
  const {
    cacheEnabled,
    useMockData,
    setCacheEnabled,
    setUseMockData,
    clearEventsCache,
  } = useStore();

  const handleThemeSelect = (theme: ThemeOption) => {
    setTheme(theme);
  };

  const handleContainerBgSelect = (containerBg: ContainerBgOption) => {
    setContainerBg(containerBg);
  };

  const handleMainContentBgSelect = (mainContentBg: MainContentBgOption) => {
    setMainContentBg(mainContentBg);
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
              <Palette className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                App Settings
              </h2>
              <p className="text-sm text-gray-600">
                Customize theme and data preferences
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
            aria-label="Close theme settings"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-8">
          {/* Background Themes Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                Background Themes
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {themes.map((theme) => {
                const isSelected = currentTheme.id === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => handleThemeSelect(theme)}
                    className={`relative group p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-200 hover:border-gray-300 bg-white/50"
                    }`}
                    aria-label={`Select ${theme.name} theme`}
                  >
                    {/* Theme Preview */}
                    <div
                      className="w-full h-16 rounded-lg mb-3 border border-gray-200/50"
                      style={{ background: theme.preview }}
                    />

                    {/* Theme Name */}
                    <div className="text-sm font-medium text-gray-900 mb-1">
                      {theme.name}
                    </div>

                    {/* Theme Type */}
                    <div className="text-xs text-gray-500 capitalize">
                      {theme.type}
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 p-1 bg-blue-500 rounded-full">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Container Background Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Container className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                Container Background
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {containerBgOptions.map((containerBg) => {
                const isSelected = currentContainerBg.id === containerBg.id;
                return (
                  <button
                    key={containerBg.id}
                    onClick={() => handleContainerBgSelect(containerBg)}
                    className={`relative group p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? "border-purple-500 bg-purple-50/50"
                        : "border-gray-200 hover:border-gray-300 bg-white/50"
                    }`}
                    aria-label={`Select ${containerBg.name} container background`}
                  >
                    {/* Container Preview */}
                    <div
                      className="w-full h-12 rounded-lg mb-2 border border-gray-200/50"
                      style={{
                        background: containerBg.preview.includes("gradient")
                          ? containerBg.preview
                          : containerBg.preview.includes("rgba")
                          ? `${containerBg.preview} url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="10" height="10" fill="%23f3f4f6"/><rect x="10" y="10" width="10" height="10" fill="%23f3f4f6"/></svg>')`
                          : containerBg.preview,
                      }}
                    />

                    {/* Container Name */}
                    <div className="text-xs font-medium text-gray-900">
                      {containerBg.name}
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 p-1 bg-purple-500 rounded-full">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Background Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                Main Content Background
              </h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {mainContentBgOptions.map((mainContentBg) => {
                const isSelected = currentMainContentBg.id === mainContentBg.id;
                return (
                  <button
                    key={mainContentBg.id}
                    onClick={() => handleMainContentBgSelect(mainContentBg)}
                    className={`relative group p-3 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                      isSelected
                        ? "border-green-500 bg-green-50/50"
                        : "border-gray-200 hover:border-gray-300 bg-white/50"
                    }`}
                    aria-label={`Select ${mainContentBg.name} main content background`}
                  >
                    {/* Main Content Preview */}
                    <div
                      className="w-full h-10 rounded-lg mb-2 border border-gray-200/50"
                      style={{
                        background: mainContentBg.preview.includes("gradient")
                          ? mainContentBg.preview
                          : mainContentBg.preview.includes("rgba")
                          ? `${mainContentBg.preview} url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><rect width="10" height="10" fill="%23f3f4f6"/><rect x="10" y="10" width="10" height="10" fill="%23f3f4f6"/></svg>')`
                          : mainContentBg.preview,
                      }}
                    />

                    {/* Main Content Name */}
                    <div className="text-xs font-medium text-gray-900">
                      {mainContentBg.name}
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 p-1 bg-green-500 rounded-full">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Data Settings Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Database className="w-5 h-5 text-gray-700" />
              <h3 className="text-lg font-semibold text-gray-900">
                Data Settings
              </h3>
            </div>
            <div className="space-y-4">
              {/* Cache Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3">
                  <RefreshCw className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Enable Caching
                    </div>
                    <div className="text-xs text-gray-500">
                      Cache data locally for faster loading
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCacheEnabled(!cacheEnabled);
                    if (!cacheEnabled) {
                      clearEventsCache();
                    }
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    cacheEnabled ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                  aria-label={`${cacheEnabled ? 'Disable' : 'Enable'} caching`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      cacheEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              
              {/* Mock Data Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl border border-gray-200">
                <div className="flex items-center space-x-3">
                  <Database className="w-5 h-5 text-gray-600" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      Use Mock Data
                    </div>
                    <div className="text-xs text-gray-500">
                      Show sample data instead of real data
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setUseMockData(!useMockData);
                    clearEventsCache();
                  }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                    useMockData ? 'bg-orange-600' : 'bg-gray-300'
                  }`}
                  aria-label={`${useMockData ? 'Disable' : 'Enable'} mock data`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      useMockData ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200/50 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                Theme:{" "}
                <span className="font-medium text-gray-900">
                  {currentTheme.name}
                </span>
              </div>
              <div>
                Container:{" "}
                <span className="font-medium text-gray-900">
                  {currentContainerBg.name}
                </span>
              </div>
              <div>
                Content:{" "}
                <span className="font-medium text-gray-900">
                  {currentMainContentBg.name}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200 mt-2">
                <div>
                  Cache:{" "}
                  <span className={`font-medium ${
                    cacheEnabled ? 'text-blue-600' : 'text-gray-500'
                  }`}>
                    {cacheEnabled ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
                <div>
                  Data Source:{" "}
                  <span className={`font-medium ${
                    useMockData ? 'text-orange-600' : 'text-green-600'
                  }`}>
                    {useMockData ? 'Mock Data' : 'Real Data'}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThemeModal;
