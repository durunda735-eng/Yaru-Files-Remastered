import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Palette,
  Upload,
  Heart,
  Download,
  Check,
  Search,
  Sliders,
  Sparkles,
  Share2,
  FileCode,
  Tag,
  User,
  ShieldCheck,
  Layers,
  ArrowRight,
  Eye,
  RefreshCw,
  Folder,
  FileText,
} from 'lucide-react';
import { YaruTheme, ThemeMode } from '../types';
import { INITIAL_COMMUNITY_THEMES } from '../data/defaultThemes';

interface ThemeShowcaseModalProps {
  currentTheme: YaruTheme | null;
  onApplyTheme: (theme: YaruTheme) => void;
  onClose: () => void;
  themeMode: ThemeMode;
}

export const ThemeShowcaseModal: React.FC<ThemeShowcaseModalProps> = ({
  currentTheme,
  onApplyTheme,
  onClose,
  themeMode,
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'creator' | 'current'>('gallery');
  const [themes, setThemes] = useState<YaruTheme[]>(INITIAL_COMMUNITY_THEMES);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBaseMode, setSelectedBaseMode] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'name'>('popular');
  const [likedThemeIds, setLikedThemeIds] = useState<Set<string>>(new Set());
  const [previewingTheme, setPreviewingTheme] = useState<YaruTheme | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Form State for Theme Creator
  const [creatorForm, setCreatorForm] = useState<{
    name: string;
    author: string;
    description: string;
    version: string;
    baseMode: ThemeMode;
    accentColor: string;
    headerColor: string;
    sidebarColor: string;
    windowBg: string;
    dockColor: string;
    borderRadius: number;
    tagsInput: string;
  }>({
    name: '',
    author: 'Ubuntu Enthusiast',
    description: '',
    version: '1.0.0',
    baseMode: 'dark',
    accentColor: '#E95420',
    headerColor: '#2D2D2D',
    sidebarColor: '#242424',
    windowBg: '#1E1E1E',
    dockColor: 'rgba(17, 17, 17, 0.95)',
    borderRadius: 12,
    tagsInput: 'custom, ubuntu',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Presets for quick accent selection in the designer
  const accentPresets = [
    { name: 'Ubuntu Orange', value: '#E95420' },
    { name: 'Ubuntu Purple', value: '#77216F' },
    { name: 'Viridian Green', value: '#38B44A' },
    { name: 'Prussian Blue', value: '#19B6EE' },
    { name: 'Sunset Amber', value: '#F5C211' },
    { name: 'Cyber Magenta', value: '#E954A8' },
    { name: 'Nord Cyan', value: '#88C0D0' },
    { name: 'Tokyo Indigo', value: '#7AA2F7' },
    { name: 'Crimson Red', value: '#EF2929' },
    { name: 'Slate Gray', value: '#9E9E9E' },
  ];

  // Fetch themes from backend API
  const fetchThemes = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedBaseMode !== 'all') params.append('mode', selectedBaseMode);
      params.append('sort', sortBy);

      const res = await fetch(`/api/themes?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.themes && Array.isArray(data.themes)) {
          setThemes(data.themes);
        }
      }
    } catch (err) {
      console.warn('Could not load themes from API, using cached state:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchThemes();
  }, [searchQuery, selectedBaseMode, sortBy]);

  // Handle Like/Upvote
  const handleLikeTheme = async (themeId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (likedThemeIds.has(themeId)) return;

    // Optimistic UI update
    setLikedThemeIds((prev) => new Set(prev).add(themeId));
    setThemes((prev) =>
      prev.map((t) => (t.id === themeId ? { ...t, likes: t.likes + 1 } : t))
    );

    try {
      const res = await fetch(`/api/themes/${themeId}/like`, { method: 'POST' });
      if (!res.ok) {
        throw new Error('Failed to like');
      }
    } catch (err) {
      console.error('Error liking theme:', err);
    }
  };

  // Handle Theme Export / Download
  const handleDownloadTheme = (theme: YaruTheme, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const safeFilename = `${theme.name.replace(/[^a-zA-Z0-9_-]/g, '_').toLowerCase()}_yaru_theme.json`;
    const blob = new Blob([JSON.stringify(theme, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = safeFilename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Call server to increment downloads
    fetch(`/api/themes/${theme.id}/export`).catch(() => {});

    setStatusMessage({
      text: `Exported "${theme.name}" as JSON!`,
      type: 'success',
    });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  // Handle Upload / File Import
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);

        if (!parsed.name || !parsed.accentColor) {
          throw new Error('Theme file must include at least "name" and "accentColor" properties.');
        }

        // Fill designer form
        setCreatorForm({
          name: parsed.name || 'Imported Theme',
          author: parsed.author || 'Community Contributor',
          description: parsed.description || 'Imported custom Yaru theme',
          version: parsed.version || '1.0.0',
          baseMode: parsed.baseMode || 'dark',
          accentColor: parsed.accentColor || '#E95420',
          headerColor: parsed.headerColor || '#2D2D2D',
          sidebarColor: parsed.sidebarColor || '#242424',
          windowBg: parsed.windowBg || '#1E1E1E',
          dockColor: parsed.dockColor || 'rgba(17, 17, 17, 0.95)',
          borderRadius: parsed.borderRadius || 12,
          tagsInput: Array.isArray(parsed.tags) ? parsed.tags.join(', ') : 'imported, custom',
        });

        setActiveTab('creator');
        setStatusMessage({
          text: `Loaded "${parsed.name}" into Theme Studio! Review and publish below.`,
          type: 'success',
        });
        setTimeout(() => setStatusMessage(null), 4000);
      } catch (err: any) {
        setStatusMessage({
          text: `Invalid theme file: ${err.message}`,
          type: 'error',
        });
        setTimeout(() => setStatusMessage(null), 5000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Publish New Theme to Community
  const handlePublishTheme = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!creatorForm.name.trim()) {
      setStatusMessage({ text: 'Please enter a name for your theme.', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    const tags = creatorForm.tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    const payload = {
      name: creatorForm.name.trim(),
      author: creatorForm.author.trim() || 'Ubuntu Contributor',
      description: creatorForm.description.trim() || 'Custom Yaru theme published to the gallery.',
      version: creatorForm.version.trim() || '1.0.0',
      baseMode: creatorForm.baseMode,
      accentColor: creatorForm.accentColor,
      headerColor: creatorForm.headerColor,
      sidebarColor: creatorForm.sidebarColor,
      windowBg: creatorForm.windowBg,
      dockColor: creatorForm.dockColor,
      borderRadius: Number(creatorForm.borderRadius) || 12,
      tags: tags.length > 0 ? tags : ['custom', 'yaru'],
    };

    try {
      const res = await fetch('/api/themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to publish theme');
      }

      const data = await res.json();
      const publishedTheme: YaruTheme = data.theme;

      // Update state
      setThemes((prev) => [publishedTheme, ...prev]);
      onApplyTheme(publishedTheme);
      setActiveTab('gallery');

      setStatusMessage({
        text: `Theme "${publishedTheme.name}" published to the showcase and activated!`,
        type: 'success',
      });
      setTimeout(() => setStatusMessage(null), 4000);

      // Reset form
      setCreatorForm({
        name: '',
        author: 'Ubuntu Enthusiast',
        description: '',
        version: '1.0.0',
        baseMode: 'dark',
        accentColor: '#E95420',
        headerColor: '#2D2D2D',
        sidebarColor: '#242424',
        windowBg: '#1E1E1E',
        dockColor: 'rgba(17, 17, 17, 0.95)',
        borderRadius: 12,
        tagsInput: 'custom, ubuntu',
      });
    } catch (err: any) {
      setStatusMessage({
        text: err.message || 'Error publishing theme',
        type: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDark = themeMode === 'dark' || themeMode === 'aubergine';

  return (
    <div
      id="theme-showcase-overlay"
      className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="theme-showcase-modal"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-5xl h-[90vh] max-h-[760px] rounded-2xl shadow-2xl border flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 ${
          isDark
            ? 'bg-[#242424] border-[#444] text-[#F7F7F7]'
            : 'bg-[#F9F9F9] border-[#CCC] text-[#222]'
        }`}
      >
        {/* GNOME-style Window Header Bar */}
        <div className="h-14 px-5 flex items-center justify-between border-b border-black/20 bg-black/15 select-none shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E95420] to-[#77216F] flex items-center justify-center text-white shadow-sm">
              <Palette size={18} />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight flex items-center gap-2">
                <span>Yaru Community Themes</span>
                <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-[#E95420]/20 text-[#FF7043] border border-[#E95420]/30">
                  Ubuntu 24.04
                </span>
              </h2>
              <p className="text-[11px] text-white/50">
                Explore custom community designs or craft, upload, and share your own theme
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 bg-black/25 p-1 rounded-xl border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'gallery'
                  ? 'bg-[#E95420] text-white shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Layers size={14} />
              <span>Showcase</span>
              <span className="ml-1 text-[10px] px-1.5 py-0.2 bg-black/30 rounded-full font-bold">
                {themes.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('creator')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'creator'
                  ? 'bg-[#E95420] text-white shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <Upload size={14} />
              <span>Upload &amp; Share</span>
            </button>

            {currentTheme && (
              <button
                onClick={() => setActiveTab('current')}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'current'
                    ? 'bg-[#E95420] text-white shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                <Sparkles size={14} />
                <span>Active Theme</span>
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Global Toast Notification */}
        {statusMessage && (
          <div
            className={`px-4 py-2.5 text-xs font-medium flex items-center justify-between transition-all ${
              statusMessage.type === 'success'
                ? 'bg-[#38B44A]/90 text-white'
                : 'bg-[#EF2929]/90 text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              {statusMessage.type === 'success' ? <Check size={14} /> : <X size={14} />}
              <span>{statusMessage.text}</span>
            </div>
            <button
              onClick={() => setStatusMessage(null)}
              className="text-white/80 hover:text-white"
            >
              ✕
            </button>
          </div>
        )}

        {/* Modal Main Body */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* TAB 1: SHOWCASE & GALLERY */}
          {activeTab === 'gallery' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Filter & Search Bar */}
              <div className="p-4 border-b border-black/20 bg-black/10 flex flex-wrap items-center justify-between gap-3 shrink-0">
                {/* Search */}
                <div className="relative flex-1 min-w-[220px] max-w-md">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search themes by title, author, or tag (#cyber, #nord)..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-black/30 border border-white/10 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-[#E95420] focus:ring-1 focus:ring-[#E95420]"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-3">
                  {/* Mode Filter */}
                  <div className="flex items-center gap-1 text-xs bg-black/30 p-1 rounded-lg border border-white/10">
                    {['all', 'dark', 'light', 'aubergine'].map((m) => (
                      <button
                        key={m}
                        onClick={() => setSelectedBaseMode(m)}
                        className={`px-2.5 py-1 rounded capitalize transition-colors text-[11px] ${
                          selectedBaseMode === m
                            ? 'bg-[#E95420] text-white font-semibold'
                            : 'text-white/60 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  {/* Sort Filter */}
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-white/50 text-[11px]">Sort:</span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-black/30 border border-white/10 text-white text-xs rounded-lg px-2.5 py-1.5 outline-none focus:border-[#E95420]"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="newest">Newest Added</option>
                      <option value="name">Alphabetical</option>
                    </select>
                  </div>

                  {/* Quick Upload action */}
                  <button
                    onClick={() => setActiveTab('creator')}
                    className="px-3 py-1.5 rounded-lg bg-[#E95420] hover:bg-[#D34310] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <Upload size={13} />
                    <span>Upload Theme</span>
                  </button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="flex-1 overflow-y-auto p-4 md:p-6">
                {isLoading ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-2 text-white/50">
                    <RefreshCw size={24} className="animate-spin text-[#E95420]" />
                    <span className="text-xs">Loading community themes...</span>
                  </div>
                ) : themes.length === 0 ? (
                  <div className="h-64 flex flex-col items-center justify-center gap-3 text-white/50 text-center">
                    <Palette size={36} className="opacity-30" />
                    <p className="text-sm font-semibold text-white/80">No themes match your criteria</p>
                    <p className="text-xs text-white/50 max-w-sm">
                      Try searching with different keywords or create and publish the very first theme in this style!
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedBaseMode('all');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white/10 text-xs hover:bg-white/20 text-white"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {themes.map((theme) => {
                      const isActive = currentTheme?.id === theme.id;
                      const isLiked = likedThemeIds.has(theme.id);

                      return (
                        <div
                          key={theme.id}
                          className={`rounded-xl border flex flex-col overflow-hidden transition-all duration-200 group relative ${
                            isActive
                              ? 'border-[#E95420] ring-2 ring-[#E95420]/50 bg-black/40 shadow-lg'
                              : 'border-white/10 bg-black/20 hover:border-white/25 hover:bg-black/30'
                          }`}
                        >
                          {/* Mini Ubuntu Desktop Live Preview */}
                          <div
                            className="h-32 p-2.5 relative flex flex-col justify-between border-b border-black/30 overflow-hidden"
                            style={{
                              backgroundColor: theme.windowBg,
                              color: theme.baseMode === 'light' ? '#222' : '#FFF',
                            }}
                          >
                            {/* Mini Gnome Top Bar */}
                            <div className="h-4 px-2 rounded-sm bg-black/60 flex items-center justify-between text-[8px] text-white/90 select-none">
                              <span className="font-semibold">Activities</span>
                              <span className="opacity-70 font-mono">14:04</span>
                              <div className="flex items-center gap-1 opacity-70">
                                <span>●</span>
                                <span>▲</span>
                              </div>
                            </div>

                            {/* Mini Nautilus Window */}
                            <div
                              className="flex-1 mt-1.5 rounded-md border flex overflow-hidden shadow-md"
                              style={{
                                borderColor: 'rgba(255,255,255,0.15)',
                                backgroundColor: theme.sidebarColor,
                              }}
                            >
                              {/* Mini Dock */}
                              <div
                                className="w-5 flex flex-col items-center gap-1.5 py-1.5 border-r border-black/20"
                                style={{ backgroundColor: theme.dockColor }}
                              >
                                <div
                                  className="w-2.5 h-2.5 rounded-xs"
                                  style={{ backgroundColor: theme.accentColor }}
                                />
                                <div className="w-2 h-2 rounded-xs bg-white/40" />
                                <div className="w-2 h-2 rounded-xs bg-white/40" />
                              </div>

                              {/* Mini Main Window */}
                              <div
                                className="flex-1 flex flex-col"
                                style={{ backgroundColor: theme.windowBg }}
                              >
                                {/* Header bar */}
                                <div
                                  className="h-4 px-2 flex items-center justify-between border-b border-black/20"
                                  style={{ backgroundColor: theme.headerColor }}
                                >
                                  <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#EF2929]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#F5C211]" />
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#38B44A]" />
                                  </div>
                                  <span className="text-[8px] font-medium opacity-80">
                                    Home
                                  </span>
                                  <div
                                    className="w-2.5 h-2.5 rounded-full"
                                    style={{ backgroundColor: theme.accentColor }}
                                  />
                                </div>

                                {/* Content area with icons */}
                                <div className="flex-1 p-2 grid grid-cols-3 gap-1 items-center justify-items-center">
                                  <div className="flex flex-col items-center">
                                    <Folder size={12} style={{ color: theme.accentColor }} />
                                    <span className="text-[6px] opacity-70">Docs</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <Folder size={12} style={{ color: theme.accentColor }} />
                                    <span className="text-[6px] opacity-70">Pics</span>
                                  </div>
                                  <div className="flex flex-col items-center">
                                    <FileText size={12} className="opacity-60" />
                                    <span className="text-[6px] opacity-70">Code</span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Active badge overlay */}
                            {isActive && (
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#E95420] text-white text-[9px] font-bold shadow-md flex items-center gap-1">
                                <Check size={10} />
                                <span>ACTIVE</span>
                              </div>
                            )}

                            {/* Official badge */}
                            {theme.isOfficial && !isActive && (
                              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white text-[9px] font-semibold flex items-center gap-1 border border-white/20">
                                <ShieldCheck size={10} className="text-[#38B44A]" />
                                <span>Canonical</span>
                              </div>
                            )}
                          </div>

                          {/* Theme Info & Actions */}
                          <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                            <div>
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-bold text-sm text-white group-hover:text-[#FF7043] transition-colors">
                                  {theme.name}
                                </h3>
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-white/60 font-mono">
                                  v{theme.version}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5 text-[11px] text-white/50 mt-0.5">
                                <User size={11} />
                                <span>by {theme.author}</span>
                              </div>

                              <p className="text-xs text-white/70 mt-2 line-clamp-2 leading-relaxed">
                                {theme.description}
                              </p>
                            </div>

                            {/* Color Swatches Palette */}
                            <div className="space-y-1.5 pt-1">
                              <div className="flex items-center justify-between text-[10px] text-white/50">
                                <span>Palette</span>
                                <span className="font-mono">{theme.accentColor}</span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <div
                                  className="w-5 h-5 rounded-md border border-white/20 shadow-xs"
                                  style={{ backgroundColor: theme.accentColor }}
                                  title={`Accent: ${theme.accentColor}`}
                                />
                                <div
                                  className="w-5 h-5 rounded-md border border-white/20 shadow-xs"
                                  style={{ backgroundColor: theme.headerColor }}
                                  title={`Header: ${theme.headerColor}`}
                                />
                                <div
                                  className="w-5 h-5 rounded-md border border-white/20 shadow-xs"
                                  style={{ backgroundColor: theme.sidebarColor }}
                                  title={`Sidebar: ${theme.sidebarColor}`}
                                />
                                <div
                                  className="w-5 h-5 rounded-md border border-white/20 shadow-xs"
                                  style={{ backgroundColor: theme.windowBg }}
                                  title={`Canvas: ${theme.windowBg}`}
                                />
                                <div className="ml-auto text-[10px] font-medium uppercase px-2 py-0.5 rounded bg-white/5 text-white/60">
                                  {theme.baseMode}
                                </div>
                              </div>
                            </div>

                            {/* Tags list */}
                            <div className="flex flex-wrap gap-1">
                              {theme.tags.slice(0, 3).map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-white/50 border border-white/5"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>

                            {/* Card Footer: Metrics & Apply Button */}
                            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-2">
                              {/* Likes & Downloads */}
                              <div className="flex items-center gap-3 text-xs">
                                <button
                                  onClick={(e) => handleLikeTheme(theme.id, e)}
                                  className={`flex items-center gap-1 transition-colors ${
                                    isLiked ? 'text-[#EF2929]' : 'text-white/60 hover:text-[#EF2929]'
                                  }`}
                                  title="Like this theme"
                                >
                                  <Heart
                                    size={13}
                                    fill={isLiked ? 'currentColor' : 'none'}
                                  />
                                  <span className="font-semibold text-[11px]">{theme.likes}</span>
                                </button>

                                <button
                                  onClick={(e) => handleDownloadTheme(theme, e)}
                                  className="flex items-center gap-1 text-white/60 hover:text-white transition-colors"
                                  title="Download theme JSON"
                                >
                                  <Download size={13} />
                                  <span className="text-[11px]">{theme.downloads}</span>
                                </button>
                              </div>

                              {/* Apply Button */}
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => onApplyTheme(theme)}
                                  disabled={isActive}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                                    isActive
                                      ? 'bg-white/10 text-white/40 cursor-default'
                                      : 'bg-[#E95420] hover:bg-[#D34310] text-white shadow-sm active:scale-95'
                                  }`}
                                >
                                  {isActive ? (
                                    <>
                                      <Check size={13} />
                                      <span>Applied</span>
                                    </>
                                  ) : (
                                    <>
                                      <span>Apply</span>
                                      <ArrowRight size={13} />
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: UPLOAD & SHARE THEME (STUDIO & FILE UPLOADER) */}
          {activeTab === 'creator' && (
            <div className="flex-1 overflow-y-auto p-4 md:p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Method 1: Dropzone File Import */}
                <div className="p-4 rounded-xl border border-dashed border-white/20 bg-black/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#E95420]/20 text-[#E95420] flex items-center justify-center shrink-0">
                      <FileCode size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                        Have an existing Yaru Theme JSON file?
                      </h4>
                      <p className="text-[11px] text-white/50">
                        Upload your custom theme configuration file to immediately preview, refine, and publish.
                      </p>
                    </div>
                  </div>

                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="theme-file-input"
                    />
                    <label
                      htmlFor="theme-file-input"
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <Upload size={14} />
                      <span>Choose .json File</span>
                    </label>
                  </div>
                </div>

                {/* Method 2: Live Theme Studio Form */}
                <form onSubmit={handlePublishTheme} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Metadata & Color Controls */}
                    <div className="lg:col-span-7 space-y-5">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center gap-2">
                        <Sliders size={14} className="text-[#E95420]" />
                        <span>Theme Details &amp; Aesthetics</span>
                      </h3>

                      {/* Theme Name & Version */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1">
                          <label className="text-[11px] font-semibold text-white/70">
                            Theme Name *
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="e.g., Cyber Savannah"
                            value={creatorForm.name}
                            onChange={(e) =>
                              setCreatorForm((prev) => ({ ...prev, name: e.target.value }))
                            }
                            className="w-full px-3 py-2 bg-black/30 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-[#E95420]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-white/70">
                            Version
                          </label>
                          <input
                            type="text"
                            placeholder="1.0.0"
                            value={creatorForm.version}
                            onChange={(e) =>
                              setCreatorForm((prev) => ({ ...prev, version: e.target.value }))
                            }
                            className="w-full px-3 py-2 bg-black/30 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-[#E95420]"
                          />
                        </div>
                      </div>

                      {/* Author & Tags */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-white/70">
                            Creator Name
                          </label>
                          <input
                            type="text"
                            placeholder="Ubuntu Community"
                            value={creatorForm.author}
                            onChange={(e) =>
                              setCreatorForm((prev) => ({ ...prev, author: e.target.value }))
                            }
                            className="w-full px-3 py-2 bg-black/30 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-[#E95420]"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-white/70">
                            Tags (comma separated)
                          </label>
                          <input
                            type="text"
                            placeholder="neon, dark, retro"
                            value={creatorForm.tagsInput}
                            onChange={(e) =>
                              setCreatorForm((prev) => ({ ...prev, tagsInput: e.target.value }))
                            }
                            className="w-full px-3 py-2 bg-black/30 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-[#E95420]"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-white/70">
                          Description
                        </label>
                        <textarea
                          rows={2}
                          placeholder="A brief summary describing the mood, visual inspiration, and details of this Yaru theme..."
                          value={creatorForm.description}
                          onChange={(e) =>
                            setCreatorForm((prev) => ({ ...prev, description: e.target.value }))
                          }
                          className="w-full px-3 py-2 bg-black/30 border border-white/15 rounded-lg text-xs text-white focus:outline-none focus:border-[#E95420] resize-none"
                        />
                      </div>

                      {/* Base Mode Switcher */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-semibold text-white/70">
                          Base Atmosphere
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {(['dark', 'light', 'aubergine'] as ThemeMode[]).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => {
                                setCreatorForm((prev) => ({
                                  ...prev,
                                  baseMode: mode,
                                  headerColor: mode === 'light' ? '#F2F2F2' : mode === 'aubergine' ? '#3B0F33' : '#2D2D2D',
                                  sidebarColor: mode === 'light' ? '#E8E8E8' : mode === 'aubergine' ? '#2B0B25' : '#242424',
                                  windowBg: mode === 'light' ? '#FAFAFA' : mode === 'aubergine' ? '#1F061A' : '#1E1E1E',
                                }));
                              }}
                              className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-all ${
                                creatorForm.baseMode === mode
                                  ? 'border-[#E95420] bg-[#E95420]/20 text-white ring-1 ring-[#E95420]'
                                  : 'border-white/10 bg-black/20 text-white/60 hover:text-white'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Accent Color Presets & Picker */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-white/70">
                            Accent Color (Buttons, Focus Rings, Starred Files)
                          </label>
                          <span className="font-mono text-xs text-[#E95420] font-bold">
                            {creatorForm.accentColor}
                          </span>
                        </div>

                        {/* Presets */}
                        <div className="flex flex-wrap gap-2">
                          {accentPresets.map((p) => (
                            <button
                              key={p.value}
                              type="button"
                              onClick={() =>
                                setCreatorForm((prev) => ({ ...prev, accentColor: p.value }))
                              }
                              className={`w-7 h-7 rounded-lg border flex items-center justify-center transition-all ${
                                creatorForm.accentColor.toLowerCase() === p.value.toLowerCase()
                                  ? 'ring-2 ring-white scale-110 border-white'
                                  : 'border-white/20 hover:scale-105'
                              }`}
                              style={{ backgroundColor: p.value }}
                              title={p.name}
                            >
                              {creatorForm.accentColor.toLowerCase() === p.value.toLowerCase() && (
                                <Check size={12} className="text-white drop-shadow" />
                              )}
                            </button>
                          ))}
                          <div className="relative flex items-center">
                            <input
                              type="color"
                              value={creatorForm.accentColor}
                              onChange={(e) =>
                                setCreatorForm((prev) => ({ ...prev, accentColor: e.target.value }))
                              }
                              className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border border-white/20 p-0"
                              title="Custom Color"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Individual Color Tone Pickers */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="space-y-1">
                          <label className="text-[10px] text-white/60 font-semibold">
                            Header Bar Color
                          </label>
                          <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg p-1.5">
                            <input
                              type="color"
                              value={creatorForm.headerColor}
                              onChange={(e) =>
                                setCreatorForm((prev) => ({ ...prev, headerColor: e.target.value }))
                              }
                              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                            />
                            <input
                              type="text"
                              value={creatorForm.headerColor}
                              onChange={(e) =>
                                setCreatorForm((prev) => ({ ...prev, headerColor: e.target.value }))
                              }
                              className="w-full bg-transparent text-xs text-white font-mono outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-white/60 font-semibold">
                            Workspace Canvas Bg
                          </label>
                          <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg p-1.5">
                            <input
                              type="color"
                              value={creatorForm.windowBg}
                              onChange={(e) =>
                                setCreatorForm((prev) => ({ ...prev, windowBg: e.target.value }))
                              }
                              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                            />
                            <input
                              type="text"
                              value={creatorForm.windowBg}
                              onChange={(e) =>
                                setCreatorForm((prev) => ({ ...prev, windowBg: e.target.value }))
                              }
                              className="w-full bg-transparent text-xs text-white font-mono outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-white/60 font-semibold">
                            Places Sidebar Color
                          </label>
                          <div className="flex items-center gap-2 bg-black/30 border border-white/10 rounded-lg p-1.5">
                            <input
                              type="color"
                              value={creatorForm.sidebarColor}
                              onChange={(e) =>
                                setCreatorForm((prev) => ({ ...prev, sidebarColor: e.target.value }))
                              }
                              className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent"
                            />
                            <input
                              type="text"
                              value={creatorForm.sidebarColor}
                              onChange={(e) =>
                                setCreatorForm((prev) => ({ ...prev, sidebarColor: e.target.value }))
                              }
                              className="w-full bg-transparent text-xs text-white font-mono outline-none"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-white/60 font-semibold">
                            Corner Roundness ({creatorForm.borderRadius}px)
                          </label>
                          <input
                            type="range"
                            min="4"
                            max="20"
                            value={creatorForm.borderRadius}
                            onChange={(e) =>
                              setCreatorForm((prev) => ({
                                ...prev,
                                borderRadius: Number(e.target.value),
                              }))
                            }
                            className="w-full accent-[#E95420] mt-2"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right: Live Interactive Theme Studio Preview */}
                    <div className="lg:col-span-5 flex flex-col space-y-4">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-white/70 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <Eye size={14} className="text-[#38B44A]" />
                          <span>Live Studio Preview</span>
                        </span>
                        <span className="text-[10px] text-white/40 font-mono">Real-time</span>
                      </h3>

                      {/* Mockup Desktop Window */}
                      <div
                        className="rounded-xl border p-3 flex-1 flex flex-col justify-between shadow-2xl relative overflow-hidden min-h-[300px]"
                        style={{
                          backgroundColor: creatorForm.windowBg,
                          borderRadius: `${creatorForm.borderRadius}px`,
                          borderColor: 'rgba(255,255,255,0.15)',
                        }}
                      >
                        {/* Mini GNOME top bar */}
                        <div className="h-5 px-2 bg-black/60 rounded flex items-center justify-between text-[9px] text-white select-none">
                          <span className="font-semibold">Activities</span>
                          <span className="font-mono">14:04</span>
                          <span className="text-emerald-400 font-bold">100%</span>
                        </div>

                        {/* Nautilus Window */}
                        <div
                          className="flex-1 mt-2 rounded-lg border flex overflow-hidden shadow-lg"
                          style={{
                            borderColor: 'rgba(255,255,255,0.1)',
                            borderRadius: `${Math.max(creatorForm.borderRadius - 4, 4)}px`,
                            backgroundColor: creatorForm.sidebarColor,
                          }}
                        >
                          {/* Mini Dock */}
                          <div
                            className="w-8 flex flex-col items-center gap-2 py-2 border-r border-black/30"
                            style={{ backgroundColor: creatorForm.dockColor }}
                          >
                            <div
                              className="w-4 h-4 rounded-md shadow-xs flex items-center justify-center text-white"
                              style={{ backgroundColor: creatorForm.accentColor }}
                            >
                              <Folder size={10} />
                            </div>
                            <div className="w-4 h-4 rounded-md bg-white/20" />
                            <div className="w-4 h-4 rounded-md bg-white/20" />
                          </div>

                          {/* Mini Main Nautilus Pane */}
                          <div
                            className="flex-1 flex flex-col"
                            style={{ backgroundColor: creatorForm.windowBg }}
                          >
                            {/* Window Header */}
                            <div
                              className="h-6 px-2 flex items-center justify-between border-b border-black/20"
                              style={{ backgroundColor: creatorForm.headerColor }}
                            >
                              <div className="flex items-center gap-1.5">
                                <div className="w-2 h-2 rounded-full bg-[#EF2929]" />
                                <div className="w-2 h-2 rounded-full bg-[#F5C211]" />
                                <div className="w-2 h-2 rounded-full bg-[#38B44A]" />
                              </div>
                              <span
                                className="text-[9px] font-bold"
                                style={{
                                  color: creatorForm.baseMode === 'light' ? '#222' : '#FFF',
                                }}
                              >
                                {creatorForm.name || 'Untitled Yaru'}
                              </span>
                              <div
                                className="w-3.5 h-3.5 rounded flex items-center justify-center text-white text-[8px]"
                                style={{ backgroundColor: creatorForm.accentColor }}
                              >
                                +
                              </div>
                            </div>

                            {/* Window Body Items */}
                            <div className="flex-1 p-3 grid grid-cols-2 gap-2">
                              <div
                                className="p-2 rounded flex items-center gap-2 border"
                                style={{
                                  borderColor: creatorForm.accentColor,
                                  backgroundColor: 'rgba(233, 84, 32, 0.12)',
                                }}
                              >
                                <Folder size={14} style={{ color: creatorForm.accentColor }} />
                                <div className="flex flex-col">
                                  <span
                                    className="text-[9px] font-bold"
                                    style={{
                                      color: creatorForm.baseMode === 'light' ? '#222' : '#FFF',
                                    }}
                                  >
                                    Projects
                                  </span>
                                  <span className="text-[7px] opacity-60">Selected</span>
                                </div>
                              </div>

                              <div className="p-2 rounded bg-black/10 flex items-center gap-2 border border-white/5">
                                <FileText size={14} className="opacity-70" />
                                <div className="flex flex-col">
                                  <span
                                    className="text-[9px] font-medium"
                                    style={{
                                      color: creatorForm.baseMode === 'light' ? '#222' : '#FFF',
                                    }}
                                  >
                                    README.md
                                  </span>
                                  <span className="text-[7px] opacity-60">4.2 KB</span>
                                </div>
                              </div>
                            </div>

                            {/* Active Action Button */}
                            <div className="p-2 border-t border-black/15 flex justify-end">
                              <button
                                type="button"
                                className="px-2 py-0.5 rounded text-[8px] font-bold text-white shadow-xs"
                                style={{
                                  backgroundColor: creatorForm.accentColor,
                                  borderRadius: `${Math.max(creatorForm.borderRadius - 6, 2)}px`,
                                }}
                              >
                                Test Action
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Immediate Live Preview Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const tempTheme: YaruTheme = {
                            id: 'temp-preview',
                            name: creatorForm.name || 'Custom Studio Theme',
                            author: creatorForm.author,
                            description: creatorForm.description,
                            version: creatorForm.version,
                            baseMode: creatorForm.baseMode,
                            accentColor: creatorForm.accentColor,
                            headerColor: creatorForm.headerColor,
                            sidebarColor: creatorForm.sidebarColor,
                            windowBg: creatorForm.windowBg,
                            dockColor: creatorForm.dockColor,
                            borderRadius: creatorForm.borderRadius,
                            tags: ['preview'],
                            likes: 0,
                            downloads: 0,
                            createdAt: new Date().toISOString(),
                          };
                          onApplyTheme(tempTheme);
                          setStatusMessage({
                            text: 'Applied temporary live preview to your desktop!',
                            type: 'success',
                          });
                        }}
                        className="w-full py-2 px-3 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <Eye size={13} />
                        <span>Test Live on Current Desktop</span>
                      </button>
                    </div>
                  </div>

                  {/* Submission Row */}
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => {
                        const themeData = {
                          name: creatorForm.name || 'Custom Yaru Theme',
                          author: creatorForm.author,
                          description: creatorForm.description,
                          version: creatorForm.version,
                          baseMode: creatorForm.baseMode,
                          accentColor: creatorForm.accentColor,
                          headerColor: creatorForm.headerColor,
                          sidebarColor: creatorForm.sidebarColor,
                          windowBg: creatorForm.windowBg,
                          dockColor: creatorForm.dockColor,
                          borderRadius: creatorForm.borderRadius,
                          tags: creatorForm.tagsInput.split(',').map((s) => s.trim()),
                        };
                        const blob = new Blob([JSON.stringify(themeData, null, 2)], {
                          type: 'application/json',
                        });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${(creatorForm.name || 'theme').toLowerCase().replace(/\s+/g, '_')}.json`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-2 transition-colors"
                    >
                      <Download size={14} />
                      <span>Download JSON Spec</span>
                    </button>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-6 py-2.5 rounded-lg bg-[#E95420] hover:bg-[#D34310] disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-md active:scale-95"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={14} className="animate-spin" />
                          <span>Publishing...</span>
                        </>
                      ) : (
                        <>
                          <Share2 size={14} />
                          <span>Publish &amp; Share to Community Showcase</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: CURRENT ACTIVE THEME INSPECTOR */}
          {activeTab === 'current' && currentTheme && (
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-center">
              <div className="max-w-md w-full p-6 rounded-2xl border border-white/20 bg-black/30 space-y-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md"
                    style={{ backgroundColor: currentTheme.accentColor }}
                  >
                    <Palette size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-white">{currentTheme.name}</h3>
                    <p className="text-xs text-white/50">by {currentTheme.author} • v{currentTheme.version}</p>
                  </div>
                </div>

                <p className="text-xs text-white/70 leading-relaxed">
                  {currentTheme.description}
                </p>

                <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Accent Tone:</span>
                    <span className="font-mono text-white font-bold">{currentTheme.accentColor}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Base Mode:</span>
                    <span className="capitalize font-semibold text-white">{currentTheme.baseMode}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Border Radius:</span>
                    <span className="font-mono text-white">{currentTheme.borderRadius}px</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50">Community Likes:</span>
                    <span className="text-[#EF2929] font-bold">♥ {currentTheme.likes}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={(e) => handleDownloadTheme(currentTheme, e)}
                    className="flex-1 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download size={14} />
                    <span>Export Theme JSON</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
