import React from 'react';
import { X, Palette, Sparkles, Check, Monitor, Sliders, Shield } from 'lucide-react';
import { ThemeMode } from '../types';

interface SettingsModalProps {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  accentColor: string;
  onAccentColorChange: (color: string) => void;
  showHiddenFiles: boolean;
  onToggleHiddenFiles: () => void;
  onClose: () => void;
  onOpenThemeShowcase?: () => void;
  activeCustomThemeName?: string;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  themeMode,
  onThemeChange,
  accentColor,
  onAccentColorChange,
  showHiddenFiles,
  onToggleHiddenFiles,
  onClose,
  onOpenThemeShowcase,
  activeCustomThemeName,
}) => {
  const isDark = themeMode === 'dark' || themeMode === 'aubergine';

  const accents = [
    { name: 'Ubuntu Orange', value: '#E95420' },
    { name: 'Ubuntu Purple', value: '#77216F' },
    { name: 'Viridian Green', value: '#38B44A' },
    { name: 'Prussian Blue', value: '#19B6EE' },
    { name: 'Canonical Red', value: '#EF2929' },
    { name: 'Yaru Gold', value: '#F5C211' },
  ];

  return (
    <div
      id="settings-modal-overlay"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="settings-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-lg rounded-xl shadow-2xl border flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 ${
          isDark ? 'bg-[#2D2D2D] border-[#444] text-white' : 'bg-white border-[#D0D0D0] text-[#222]'
        }`}
      >
        {/* Header */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-black/20 bg-black/10 select-none">
          <div className="flex items-center gap-2">
            <Sliders size={16} className="text-[#E95420]" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Yaru Appearance &amp; Preferences
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 text-xs overflow-y-auto max-h-[500px]">
          {/* Style / Theme selector */}
          <div className="space-y-2.5">
            <label className="text-white/60 font-semibold uppercase tracking-wider text-[11px] block">
              Style
            </label>
            <div className="grid grid-cols-3 gap-3">
              {/* Dark */}
              <button
                onClick={() => onThemeChange('dark')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  themeMode === 'dark'
                    ? 'border-[#E95420] ring-1 ring-[#E95420] bg-black/40 font-bold'
                    : 'border-white/10 bg-black/20 hover:bg-black/30'
                }`}
              >
                <div className="w-16 h-10 rounded-md bg-[#242424] border border-[#444] flex items-center justify-center shadow-inner">
                  <div className="w-8 h-2 bg-[#E95420] rounded-sm" />
                </div>
                <span>Dark</span>
              </button>

              {/* Light */}
              <button
                onClick={() => onThemeChange('light')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  themeMode === 'light'
                    ? 'border-[#E95420] ring-1 ring-[#E95420] bg-black/40 font-bold'
                    : 'border-white/10 bg-black/20 hover:bg-black/30'
                }`}
              >
                <div className="w-16 h-10 rounded-md bg-[#F2F2F2] border border-[#CCC] flex items-center justify-center shadow-inner">
                  <div className="w-8 h-2 bg-[#E95420] rounded-sm" />
                </div>
                <span>Light</span>
              </button>

              {/* Aubergine (Signature Ubuntu) */}
              <button
                onClick={() => onThemeChange('aubergine')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${
                  themeMode === 'aubergine'
                    ? 'border-[#E95420] ring-1 ring-[#E95420] bg-black/40 font-bold'
                    : 'border-white/10 bg-black/20 hover:bg-black/30'
                }`}
              >
                <div className="w-16 h-10 rounded-md bg-[#2C001E] border border-[#77216F] flex items-center justify-center shadow-inner">
                  <div className="w-8 h-2 bg-[#E95420] rounded-sm" />
                </div>
                <span>Aubergine</span>
              </button>
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-2.5">
            <label className="text-white/60 font-semibold uppercase tracking-wider text-[11px] block">
              Color Accent
            </label>
            <div className="flex items-center gap-3">
              {accents.map((acc) => (
                <button
                  key={acc.value}
                  onClick={() => onAccentColorChange(acc.value)}
                  title={acc.name}
                  className="w-7 h-7 rounded-full flex items-center justify-center transition-transform hover:scale-110 relative"
                  style={{ backgroundColor: acc.value }}
                >
                  {accentColor === acc.value && (
                    <Check size={14} className="text-white drop-shadow" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Community Themes Showcase Banner */}
          <div className="p-3.5 rounded-xl border border-[#E95420]/30 bg-gradient-to-r from-[#E95420]/15 via-[#77216F]/15 to-transparent flex items-center justify-between gap-3">
            <div className="space-y-0.5">
              <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                <Palette size={14} className="text-[#E95420]" />
                <span>Yaru Community Themes</span>
                {activeCustomThemeName && (
                  <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#E95420] text-white">
                    {activeCustomThemeName}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/60">
                Browse community-created Ubuntu palettes or upload &amp; share your own themes.
              </p>
            </div>
            {onOpenThemeShowcase && (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenThemeShowcase();
                }}
                className="px-3 py-1.5 rounded-lg bg-[#E95420] hover:bg-[#D34310] text-white text-xs font-semibold whitespace-nowrap shadow-xs transition-colors shrink-0"
              >
                Browse Themes
              </button>
            )}
          </div>

          {/* Files Options */}
          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <label className="text-white/60 font-semibold uppercase tracking-wider text-[11px] block">
              Files Preferences
            </label>

            <div className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-white/5">
              <div>
                <div className="font-semibold text-white/90">Show Hidden Files</div>
                <div className="text-[11px] text-white/50">
                  Display dotfiles (e.g. .bashrc, .profile) in lists and grids
                </div>
              </div>
              <input
                type="checkbox"
                checked={showHiddenFiles}
                onChange={onToggleHiddenFiles}
                className="w-4 h-4 accent-[#E95420] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* AI Engines Info */}
          <div className="space-y-2.5 pt-2 border-t border-white/10">
            <label className="text-white/60 font-semibold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Sparkles size={13} className="text-[#FF6309]" />
              <span>Integrated AI Engines</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#38B44A]" />
                  <span>Low-Latency Mode</span>
                </div>
                <div className="font-mono text-[11px] text-[#FF6309]">gemini-3.1-flash-lite</div>
                <p className="text-[10px] text-white/50">
                  Instant response times for fast directory summaries and search lookups.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-1">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#19B6EE]" />
                  <span>High Thinking Mode</span>
                </div>
                <div className="font-mono text-[11px] text-[#19B6EE]">gemini-3.1-pro-preview</div>
                <p className="text-[10px] text-white/50">
                  ThinkingLevel.HIGH for multi-step reasoning, architectural code audits, and bash automation.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/20 border-t border-black/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#E95420] hover:bg-[#FF6309] text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
