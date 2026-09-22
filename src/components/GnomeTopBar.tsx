import React, { useState, useEffect } from 'react';
import {
  Wifi,
  Volume2,
  BatteryCharging,
  Moon,
  Sun,
  Terminal,
  Settings,
  Sparkles,
  Info,
  Maximize,
  Minimize,
  ChevronDown,
  Calendar as CalendarIcon,
  Columns3,
  Palette,
} from 'lucide-react';
import { ThemeMode, AccentColor } from '../types';

interface GnomeTopBarProps {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  accentColor?: string;
  onOpenSettings: () => void;
  onOpenThemeShowcase?: () => void;
  onToggleTerminal?: () => void;
  onToggleDualPane?: () => void;
  onToggleAI?: () => void;
  onNewFolder?: () => void;
  isTerminalOpen?: boolean;
  isDualPane?: boolean;
}

export const GnomeTopBar: React.FC<GnomeTopBarProps> = ({
  themeMode,
  onToggleTheme,
  onOpenSettings,
  onOpenThemeShowcase = () => {},
  onToggleTerminal = () => {},
  onToggleDualPane = () => {},
  onToggleAI = () => {},
  onNewFolder = () => {},
  isTerminalOpen = false,
  isDualPane = false,
}) => {
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [showQuickSettings, setShowQuickSettings] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFilesMenu, setShowFilesMenu] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })
      );
      setCurrentDate(
        now.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsFullscreen(false);
    }
  };

  return (
    <header
      id="gnome-top-bar"
      className="h-7 w-full bg-[#111111]/95 text-[#f7f7f7] backdrop-blur-md px-3 flex items-center justify-between text-xs font-medium border-b border-black/40 z-50 select-none"
    >
      {/* Left: Activities & Active App name */}
      <div className="flex items-center gap-1">
        <button
          id="activities-btn"
          className="px-2.5 py-0.5 rounded hover:bg-white/10 active:bg-white/20 transition-colors font-medium text-white/90"
        >
          Activities
        </button>

        <div className="relative">
          <button
            id="files-app-menu-btn"
            onClick={() => setShowFilesMenu(!showFilesMenu)}
            className="flex items-center gap-1.5 px-2.5 py-0.5 rounded hover:bg-white/10 active:bg-white/20 transition-colors text-white font-semibold"
          >
            <span>Files</span>
            <ChevronDown size={12} className="opacity-70" />
          </button>

          {showFilesMenu && (
            <div
              id="files-app-dropdown"
              className="absolute left-0 mt-1 w-52 bg-[#2D2D2D] border border-[#444444] rounded-md shadow-2xl py-1 text-xs text-white z-50 animate-in fade-in duration-100"
            >
              <button
                onClick={() => {
                  onNewFolder();
                  setShowFilesMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center justify-between"
              >
                <span>New Folder</span>
                <span className="text-[10px] opacity-60">Ctrl+Shift+N</span>
              </button>
              <button
                onClick={() => {
                  onToggleDualPane();
                  setShowFilesMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center justify-between"
              >
                <span>Dual Pane View</span>
                <span className="text-[10px] opacity-60">F3</span>
              </button>
              <button
                onClick={() => {
                  onToggleTerminal();
                  setShowFilesMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center justify-between"
              >
                <span>Open in Terminal</span>
                <span className="text-[10px] opacity-60">Ctrl+`</span>
              </button>
              <div className="h-px bg-[#444444] my-1" />
              <button
                onClick={() => {
                  onOpenThemeShowcase();
                  setShowFilesMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center gap-2"
              >
                <Palette size={13} className="text-[#FF7043]" />
                <span>Community Themes...</span>
              </button>
              <button
                onClick={() => {
                  onOpenSettings();
                  setShowFilesMenu(false);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center gap-2"
              >
                <Settings size={13} />
                <span>Preferences</span>
              </button>
              <div className="h-px bg-[#444444] my-1" />
              <div className="px-3 py-1 text-[11px] text-white/50">
                Ubuntu Yaru Files 24.04 (Nautilus)
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Date & Clock */}
      <div className="relative">
        <button
          id="gnome-clock-btn"
          onClick={() => setShowCalendar(!showCalendar)}
          className="px-3 py-0.5 rounded hover:bg-white/10 active:bg-white/20 transition-colors text-white/95 font-medium tracking-wide flex items-center gap-1.5"
        >
          <span>{currentDate}</span>
          <span className="font-semibold">{currentTime}</span>
        </button>

        {showCalendar && (
          <div
            id="gnome-calendar-popup"
            className="absolute left-1/2 -translate-x-1/2 mt-1 w-72 bg-[#2D2D2D] border border-[#444444] rounded-lg shadow-2xl p-4 text-xs text-white z-50 animate-in fade-in duration-100"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#444444] mb-3">
              <div className="flex items-center gap-2">
                <CalendarIcon size={16} className="text-[#E95420]" />
                <span className="font-bold text-sm">{currentDate}</span>
              </div>
              <span className="font-mono text-sm text-[#E95420] font-bold">{currentTime}</span>
            </div>
            <div className="text-center text-white/70 py-4 border border-white/5 rounded bg-[#222222]">
              <div className="font-semibold text-white mb-1">Ubuntu Noble Numbat 24.04 LTS</div>
              <div className="text-[11px] text-white/50">All system services active and nominal</div>
            </div>
          </div>
        )}
      </div>

      {/* Right: Quick Settings Pill */}
      <div className="relative flex items-center">
        <button
          id="gnome-status-area-btn"
          onClick={() => setShowQuickSettings(!showQuickSettings)}
          className="flex items-center gap-2 px-2.5 py-0.5 rounded-full hover:bg-white/10 active:bg-white/20 transition-colors text-white/90"
        >
          <Wifi size={13} className="text-white/80" />
          <Volume2 size={13} className="text-white/80" />
          <BatteryCharging size={14} className="text-[#38B44A]" />
        </button>

        {showQuickSettings && (
          <div
            id="gnome-quick-settings-menu"
            className="absolute right-0 mt-1 top-full w-64 bg-[#2D2D2D] border border-[#444444] rounded-xl shadow-2xl p-3 text-xs text-white z-50 animate-in fade-in duration-100"
          >
            <div className="grid grid-cols-2 gap-2 mb-3">
              <button
                onClick={() => {
                  onToggleTheme();
                }}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  themeMode === 'dark' ? 'bg-[#E95420] text-white' : 'bg-[#3A3A3A] text-white/90'
                }`}
              >
                {themeMode === 'dark' ? <Moon size={14} /> : <Sun size={14} />}
                <span className="font-medium capitalize">{themeMode} Mode</span>
              </button>

              <button
                onClick={() => {
                  onToggleTerminal();
                  setShowQuickSettings(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  isTerminalOpen ? 'bg-[#E95420] text-white' : 'bg-[#3A3A3A] text-white/90'
                }`}
              >
                <Terminal size={14} />
                <span className="font-medium">Terminal</span>
              </button>

              <button
                onClick={() => {
                  onToggleDualPane();
                  setShowQuickSettings(false);
                }}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  isDualPane ? 'bg-[#E95420] text-white' : 'bg-[#3A3A3A] text-white/90'
                }`}
              >
                <Columns3 size={14} />
                <span className="font-medium">Dual Pane</span>
              </button>

              <button
                onClick={() => {
                  onToggleAI();
                  setShowQuickSettings(false);
                }}
                className="flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r from-[#77216F] to-[#E95420] text-white font-medium shadow-sm hover:brightness-110"
              >
                <Sparkles size={14} />
                <span>Yaru AI</span>
              </button>
            </div>

            <div className="h-px bg-[#444444] my-2" />

            <div className="space-y-1">
              <button
                onClick={() => {
                  toggleFullscreen();
                  setShowQuickSettings(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors"
              >
                <span className="flex items-center gap-2">
                  {isFullscreen ? <Minimize size={13} /> : <Maximize size={13} />}
                  <span>Fullscreen View</span>
                </span>
                <span className="text-[10px] text-white/40">F11</span>
              </button>

              <button
                onClick={() => {
                  onOpenThemeShowcase();
                  setShowQuickSettings(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors text-white"
              >
                <Palette size={13} className="text-[#E95420]" />
                <span>Community Themes Showcase</span>
              </button>

              <button
                onClick={() => {
                  onOpenSettings();
                  setShowQuickSettings(false);
                }}
                className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors"
              >
                <Settings size={13} />
                <span>Yaru Desktop Settings</span>
              </button>
            </div>

            <div className="h-px bg-[#444444] my-2" />

            <div className="flex items-center justify-between px-1 text-[11px] text-white/50">
              <span className="flex items-center gap-1">
                <Info size={12} />
                Ubuntu 24.04 LTS
              </span>
              <span className="text-[#38B44A]">Active</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
