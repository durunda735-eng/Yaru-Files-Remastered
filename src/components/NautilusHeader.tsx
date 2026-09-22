import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  LayoutGrid,
  List,
  Columns3,
  Terminal,
  Sparkles,
  FolderPlus,
  Menu,
  X,
  Minus,
  Square,
  Eye,
  ArrowUpDown,
  Check,
  Upload,
  Palette,
} from 'lucide-react';
import { ViewMode, SortField, SortOrder, BreadcrumbItem, ThemeMode } from '../types';

interface NautilusHeaderProps {
  currentPath: string;
  breadcrumbs: BreadcrumbItem[];
  onNavigateBreadcrumb: (folderId: string) => void;
  canGoBack: boolean;
  canGoForward: boolean;
  onGoBack: () => void;
  onGoForward: () => void;
  viewMode: ViewMode;
  onToggleViewMode: (mode: ViewMode) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onToggleSearch: () => void;
  isSearchOpen: boolean;
  isDualPane: boolean;
  onToggleDualPane: () => void;
  isTerminalOpen: boolean;
  onToggleTerminal: () => void;
  isAIOpen: boolean;
  onToggleAI: () => void;
  onNewFolder: () => void;
  onUploadFile: (e: React.ChangeEvent<HTMLInputElement>) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  showHiddenFiles: boolean;
  onToggleHiddenFiles: () => void;
  iconScale: 'small' | 'medium' | 'large';
  onIconScaleChange: (scale: 'small' | 'medium' | 'large') => void;
  themeMode: ThemeMode;
  onSelectAll: () => void;
  onOpenThemeShowcase?: () => void;
  customHeaderColor?: string;
}

export const NautilusHeader: React.FC<NautilusHeaderProps> = ({
  currentPath,
  breadcrumbs,
  onNavigateBreadcrumb,
  canGoBack,
  canGoForward,
  onGoBack,
  onGoForward,
  viewMode,
  onToggleViewMode,
  searchQuery,
  onSearchChange,
  isSearchOpen,
  onToggleSearch,
  isDualPane,
  onToggleDualPane,
  isTerminalOpen,
  onToggleTerminal,
  isAIOpen,
  onToggleAI,
  onNewFolder,
  onUploadFile,
  sortField,
  sortOrder,
  onSortChange,
  showHiddenFiles,
  onToggleHiddenFiles,
  iconScale,
  onIconScaleChange,
  themeMode,
  onSelectAll,
  onOpenThemeShowcase = () => {},
  customHeaderColor,
}) => {
  const [isEditingPath, setIsEditingPath] = useState(false);
  const [manualPathInput, setManualPathInput] = useState(currentPath);
  const [showViewOptionsMenu, setShowViewOptionsMenu] = useState(false);

  const handlePathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsEditingPath(false);
  };

  const isDark = themeMode === 'dark' || themeMode === 'aubergine';

  return (
    <div
      id="nautilus-header-bar"
      style={customHeaderColor ? { backgroundColor: customHeaderColor } : undefined}
      className={`h-13 px-3 flex items-center justify-between border-b select-none transition-colors ${
        isDark
          ? 'bg-[#262626] border-[#383838] text-white'
          : 'bg-[#EAEAEA] border-[#D0D0D0] text-[#222222]'
      }`}
    >
      {/* Left controls: Navigation arrows & Breadcrumb path */}
      <div className="flex items-center gap-2 flex-1 min-w-0 mr-2">
        <div className="flex items-center rounded-lg border border-black/20 p-0.5 bg-black/10">
          <button
            id="nav-back-btn"
            onClick={onGoBack}
            disabled={!canGoBack}
            title="Back (Alt+Left)"
            className="p-1 rounded hover:bg-white/10 active:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            id="nav-forward-btn"
            onClick={onGoForward}
            disabled={!canGoForward}
            title="Forward (Alt+Right)"
            className="p-1 rounded hover:bg-white/10 active:bg-white/20 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Path bar: Breadcrumb mode or Text input mode */}
        {isEditingPath ? (
          <form onSubmit={handlePathSubmit} className="flex-1 max-w-xl">
            <input
              id="raw-path-input"
              type="text"
              value={manualPathInput}
              onChange={(e) => setManualPathInput(e.target.value)}
              onBlur={() => setIsEditingPath(false)}
              autoFocus
              className={`w-full px-3 py-1 text-xs rounded-md border font-mono outline-none focus:ring-1 focus:ring-[#E95420] ${
                isDark
                  ? 'bg-[#1C1C1C] border-[#444] text-white'
                  : 'bg-white border-[#CCC] text-black'
              }`}
            />
          </form>
        ) : (
          <div
            id="nautilus-breadcrumbs"
            onDoubleClick={() => {
              setManualPathInput(currentPath);
              setIsEditingPath(true);
            }}
            className={`flex items-center gap-0.5 px-1 py-0.5 rounded-lg border overflow-x-auto max-w-xl ${
              isDark ? 'border-white/10 bg-black/20' : 'border-black/10 bg-black/5'
            }`}
          >
            {breadcrumbs.map((crumb, idx) => (
              <React.Fragment key={crumb.id}>
                <button
                  id={`breadcrumb-${crumb.id}`}
                  onClick={() => onNavigateBreadcrumb(crumb.id)}
                  className={`px-2 py-0.5 rounded text-xs font-medium transition-colors whitespace-nowrap hover:bg-white/10 active:bg-white/20 ${
                    idx === breadcrumbs.length - 1
                      ? isDark
                        ? 'text-white font-semibold'
                        : 'text-black font-semibold'
                      : 'opacity-70'
                  }`}
                >
                  {crumb.name}
                </button>
                {idx < breadcrumbs.length - 1 && (
                  <span className="text-xs opacity-40">/</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-1.5">
        {/* Search Bar / Search Toggle */}
        <div className="relative flex items-center">
          {isSearchOpen ? (
            <div className="relative flex items-center animate-in fade-in zoom-in-95 duration-150">
              <input
                id="nautilus-search-input"
                type="text"
                placeholder="Search current folder..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className={`w-48 sm:w-60 pl-8 pr-7 py-1 text-xs rounded-lg border outline-none focus:ring-1 focus:ring-[#E95420] ${
                  isDark
                    ? 'bg-[#1A1A1A] border-[#444] text-white placeholder-white/40'
                    : 'bg-white border-[#CCC] text-black placeholder-black/40'
                }`}
              />
              <Search
                size={14}
                className="absolute left-2.5 opacity-50 pointer-events-none"
              />
              {searchQuery ? (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-2 opacity-60 hover:opacity-100"
                >
                  <X size={13} />
                </button>
              ) : (
                <button
                  onClick={onToggleSearch}
                  className="absolute right-2 opacity-60 hover:opacity-100"
                >
                  <X size={13} />
                </button>
              )}
            </div>
          ) : (
            <button
              id="nautilus-search-toggle"
              onClick={onToggleSearch}
              title="Search files (Ctrl+F)"
              className="p-1.5 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
            >
              <Search size={16} />
            </button>
          )}
        </div>

        {/* View mode switcher (Grid / List) */}
        <div className="flex items-center rounded-lg border border-black/20 p-0.5 bg-black/10">
          <button
            id="view-mode-grid"
            onClick={() => onToggleViewMode('grid')}
            title="Grid View"
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-[#E95420] text-white shadow-xs'
                : 'hover:bg-white/10 opacity-70'
            }`}
          >
            <LayoutGrid size={15} />
          </button>
          <button
            id="view-mode-list"
            onClick={() => onToggleViewMode('list')}
            title="List View"
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-[#E95420] text-white shadow-xs'
                : 'hover:bg-white/10 opacity-70'
            }`}
          >
            <List size={15} />
          </button>
        </div>

        {/* Dual Pane Toggle button */}
        <button
          id="dual-pane-header-toggle"
          onClick={onToggleDualPane}
          title="Dual Pane (F3)"
          className={`p-1.5 rounded-lg transition-colors hidden sm:flex items-center gap-1 ${
            isDualPane
              ? 'bg-[#E95420] text-white'
              : 'hover:bg-white/10 opacity-80'
          }`}
        >
          <Columns3 size={16} />
        </button>

        {/* Terminal toggle */}
        <button
          id="terminal-header-toggle"
          onClick={onToggleTerminal}
          title="Ubuntu Terminal (Ctrl+`)"
          className={`p-1.5 rounded-lg transition-colors hidden sm:flex items-center gap-1 ${
            isTerminalOpen
              ? 'bg-[#300A24] text-[#4AF626] border border-[#77216F]'
              : 'hover:bg-white/10 opacity-80'
          }`}
        >
          <Terminal size={16} />
        </button>

        {/* Ask Yaru AI button */}
        <button
          id="ask-yaru-ai-header-btn"
          onClick={onToggleAI}
          title="Ask Yaru AI (Low Latency & High Thinking)"
          className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all shadow-xs ${
            isAIOpen
              ? 'bg-gradient-to-r from-[#77216F] to-[#E95420] text-white ring-1 ring-white/30'
              : 'bg-white/10 hover:bg-gradient-to-r hover:from-[#77216F] hover:to-[#E95420] text-white'
          }`}
        >
          <Sparkles size={14} className="text-[#FF6309]" />
          <span className="hidden md:inline font-semibold">Yaru AI</span>
        </button>

        {/* New Folder & Upload File */}
        <button
          id="new-folder-header-btn"
          onClick={onNewFolder}
          title="New Folder (Ctrl+Shift+N)"
          className="p-1.5 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors opacity-80 hover:opacity-100"
        >
          <FolderPlus size={16} />
        </button>

        <label
          id="upload-file-header-label"
          title="Upload File into current folder"
          className="p-1.5 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors opacity-80 hover:opacity-100 cursor-pointer"
        >
          <Upload size={16} />
          <input
            type="file"
            multiple
            onChange={onUploadFile}
            className="hidden"
          />
        </label>

        {/* Community Themes Showcase Quick Button */}
        <button
          id="theme-showcase-header-btn"
          onClick={onOpenThemeShowcase}
          title="Yaru Community Themes Showcase &amp; Upload"
          className="p-1.5 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors text-[#FF7043] hover:text-[#E95420]"
        >
          <Palette size={16} />
        </button>

        {/* View Options Menu (Hamburger) */}
        <div className="relative">
          <button
            id="view-options-menu-btn"
            onClick={() => setShowViewOptionsMenu(!showViewOptionsMenu)}
            title="View Options"
            className="p-1.5 rounded-lg hover:bg-white/10 active:bg-white/20 transition-colors"
          >
            <Menu size={16} />
          </button>

          {showViewOptionsMenu && (
            <div
              id="view-options-dropdown"
              className="absolute right-0 mt-2 w-64 bg-[#2D2D2D] border border-[#444] rounded-lg shadow-2xl p-2 text-xs text-white z-50 animate-in fade-in duration-100"
            >
              <div className="px-2 py-1 font-semibold text-white/50 uppercase tracking-wider text-[10px]">
                Sort By
              </div>
              {(['name', 'size', 'modified', 'category'] as SortField[]).map((field) => (
                <button
                  key={field}
                  onClick={() => {
                    onSortChange(field);
                    setShowViewOptionsMenu(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors capitalize text-left"
                >
                  <span className="flex items-center gap-2">
                    <ArrowUpDown size={12} className="opacity-60" />
                    {field === 'category' ? 'Type' : field}
                  </span>
                  {sortField === field && (
                    <span className="flex items-center gap-1 text-[#E95420] font-semibold">
                      <Check size={12} />
                      <span className="text-[10px] uppercase">{sortOrder}</span>
                    </span>
                  )}
                </button>
              ))}

              <div className="h-px bg-white/10 my-1.5" />

              <div className="px-2 py-1 font-semibold text-white/50 uppercase tracking-wider text-[10px]">
                Icon Size
              </div>
              <div className="grid grid-cols-3 gap-1 px-2 py-1">
                {(['small', 'medium', 'large'] as const).map((scale) => (
                  <button
                    key={scale}
                    onClick={() => onIconScaleChange(scale)}
                    className={`py-1 rounded text-center capitalize transition-colors ${
                      iconScale === scale
                        ? 'bg-[#E95420] text-white font-medium'
                        : 'bg-white/5 hover:bg-white/10 text-white/70'
                    }`}
                  >
                    {scale}
                  </button>
                ))}
              </div>

              <div className="h-px bg-white/10 my-1.5" />

              <button
                onClick={() => {
                  onToggleHiddenFiles();
                  setShowViewOptionsMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors text-left"
              >
                <span className="flex items-center gap-2">
                  <Eye size={13} className="opacity-60" />
                  <span>Show Hidden Files</span>
                </span>
                <span className="text-[10px] opacity-60">Ctrl+H</span>
              </button>

              <button
                onClick={() => {
                  onSelectAll();
                  setShowViewOptionsMenu(false);
                }}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-white/10 transition-colors text-left"
              >
                <span>Select All Files</span>
                <span className="text-[10px] opacity-60">Ctrl+A</span>
              </button>
            </div>
          )}
        </div>

        {/* Window controls (Ubuntu CSD style on top right) */}
        <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
          <button
            title="Minimize"
            className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center transition-colors text-white/70"
          >
            <Minus size={11} strokeWidth={2.5} />
          </button>
          <button
            title="Maximize"
            className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 active:bg-white/30 flex items-center justify-center transition-colors text-white/70"
          >
            <Square size={9} strokeWidth={2.5} />
          </button>
          <button
            title="Close"
            className="w-5 h-5 rounded-full bg-white/10 hover:bg-[#E95420] active:bg-[#C23D10] hover:text-white flex items-center justify-center transition-colors text-white/70"
          >
            <X size={11} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};
