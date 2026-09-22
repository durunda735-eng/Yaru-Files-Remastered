import React from 'react';
import {
  Terminal,
  Settings,
  Trash2,
  LayoutGrid,
  Sparkles,
  Columns3,
  Palette,
} from 'lucide-react';
import { YaruFolder } from './YaruIcons';

interface UbuntuDockProps {
  onToggleTerminal: () => void;
  onToggleDualPane: () => void;
  onToggleAI: () => void;
  onOpenSettings: () => void;
  onOpenTrash: () => void;
  onOpenThemeShowcase?: () => void;
  isTerminalOpen: boolean;
  isDualPane: boolean;
  isAIOpen: boolean;
  trashCount: number;
  customDockColor?: string;
  isThemeShowcaseOpen?: boolean;
}

export const UbuntuDock: React.FC<UbuntuDockProps> = ({
  onToggleTerminal,
  onToggleDualPane,
  onToggleAI,
  onOpenSettings,
  onOpenTrash,
  onOpenThemeShowcase,
  isTerminalOpen,
  isDualPane,
  isAIOpen,
  trashCount,
  customDockColor,
  isThemeShowcaseOpen,
}) => {
  return (
    <aside
      id="ubuntu-dock"
      style={customDockColor ? { backgroundColor: customDockColor } : undefined}
      className="w-14 h-full bg-[#111111]/90 backdrop-blur-md border-r border-black/40 flex flex-col items-center py-3 justify-between z-40 select-none shadow-xl transition-colors duration-200"
    >
      {/* Top App Icons */}
      <div className="flex flex-col items-center gap-3">
        {/* Files App (Active) */}
        <div className="relative group">
          <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-[#E95420] rounded-r-sm" />
          <button
            id="dock-files-app"
            title="Files (Nautilus)"
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/15 active:scale-95 transition-all flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105"
          >
            <YaruFolder size={32} badge="home" />
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#222222] border border-[#444] rounded text-white text-[11px] whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Files
          </div>
        </div>

        {/* Community Themes Showcase Launcher */}
        <div className="relative group">
          {isThemeShowcaseOpen && (
            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-[#E95420] rounded-r-sm" />
          )}
          <button
            id="dock-theme-showcase"
            onClick={onOpenThemeShowcase}
            title="Yaru Community Themes &amp; Showcase"
            className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 ${
              isThemeShowcaseOpen
                ? 'bg-[#E95420] text-white'
                : 'bg-gradient-to-br from-[#77216F]/40 to-[#E95420]/40 hover:from-[#77216F] hover:to-[#E95420] text-white border border-white/10'
            }`}
          >
            <Palette size={18} />
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#222222] border border-[#444] rounded text-white text-[11px] whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Community Themes
          </div>
        </div>

        {/* Ubuntu Terminal */}
        <div className="relative group">
          {isTerminalOpen && (
            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-[#E95420] rounded-r-sm" />
          )}
          <button
            id="dock-terminal-app"
            onClick={onToggleTerminal}
            title="Ubuntu Bash Terminal (Ctrl+`)"
            className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 ${
              isTerminalOpen
                ? 'bg-[#300A24] border border-[#77216F]'
                : 'bg-black/60 hover:bg-black/80'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-[#300A24] border border-[#5E2750] flex items-center justify-center text-[#4AF626]">
              <Terminal size={18} strokeWidth={2.2} />
            </div>
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#222222] border border-[#444] rounded text-white text-[11px] whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Ubuntu Terminal (Ctrl+`)
          </div>
        </div>

        {/* Yaru AI Assistant */}
        <div className="relative group">
          {isAIOpen && (
            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-[#E95420] rounded-r-sm" />
          )}
          <button
            id="dock-ai-assistant"
            onClick={onToggleAI}
            title="Yaru AI Assistant (Fast & Deep Thinking)"
            className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center shadow-md group-hover:scale-105 ${
              isAIOpen
                ? 'bg-gradient-to-tr from-[#77216F] to-[#E95420] ring-2 ring-[#E95420]'
                : 'bg-gradient-to-tr from-[#5E2750] to-[#2C001E] hover:from-[#77216F] hover:to-[#E95420]'
            }`}
          >
            <Sparkles size={20} className="text-white drop-shadow" />
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#222222] border border-[#444] rounded text-white text-[11px] whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Yaru AI Assistant (Fast & High-Thinking)
          </div>
        </div>

        {/* Dual Pane Toggle */}
        <div className="relative group">
          {isDualPane && (
            <div className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-1.5 h-3 bg-[#E95420] rounded-r-sm" />
          )}
          <button
            id="dock-dual-pane"
            onClick={onToggleDualPane}
            title="Dual Pane View (F3)"
            className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 ${
              isDualPane ? 'bg-[#E95420] text-white' : 'bg-white/10 hover:bg-white/20 text-white/80'
            }`}
          >
            <Columns3 size={18} />
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#222222] border border-[#444] rounded text-white text-[11px] whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Dual Pane (F3)
          </div>
        </div>

        {/* Settings */}
        <div className="relative group">
          <button
            id="dock-settings"
            onClick={onOpenSettings}
            title="Yaru Appearance & Settings"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-white/80 group-hover:scale-105 shadow-sm"
          >
            <Settings size={18} />
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#222222] border border-[#444] rounded text-white text-[11px] whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Appearance & Preferences
          </div>
        </div>
      </div>

      {/* Bottom: Trash & 9-dots App Grid */}
      <div className="flex flex-col items-center gap-3">
        {/* Trash */}
        <div className="relative group">
          <button
            id="dock-trash"
            onClick={onOpenTrash}
            title="Trash"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-white/80 group-hover:scale-105 shadow-sm relative"
          >
            <Trash2 size={18} />
            {trashCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#E95420] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center border border-[#111111]">
                {trashCount}
              </span>
            )}
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#222222] border border-[#444] rounded text-white text-[11px] whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Trash ({trashCount} items)
          </div>
        </div>

        {/* 9 Dots App Grid Button */}
        <div className="relative group">
          <button
            id="dock-app-grid"
            title="Show Applications"
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 active:scale-95 transition-all flex items-center justify-center text-white/80 group-hover:scale-105 shadow-sm"
          >
            <LayoutGrid size={20} />
          </button>
          <div className="absolute left-14 top-1/2 -translate-y-1/2 px-2 py-1 bg-[#222222] border border-[#444] rounded text-white text-[11px] whitespace-nowrap shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
            Applications
          </div>
        </div>
      </div>
    </aside>
  );
};
