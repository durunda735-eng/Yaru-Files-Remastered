import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_FILES } from './data/defaultFileSystem';
import {
  FileItem,
  ViewMode,
  SortField,
  SortOrder,
  ColorTag,
  ClipboardState,
  ThemeMode,
  AccentColor,
  BreadcrumbItem,
  YaruTheme,
} from './types';
import {
  sortFiles,
  filterFiles,
  getBreadcrumbs,
  generateId,
  detectCategory,
  getPathForFolder,
  downloadFileContent,
} from './utils/fileHelpers';
import { GnomeTopBar } from './components/GnomeTopBar';
import { UbuntuDock } from './components/UbuntuDock';
import { NautilusHeader } from './components/NautilusHeader';
import { NautilusSidebar } from './components/NautilusSidebar';
import { FileGrid } from './components/FileGrid';
import { FileList } from './components/FileList';
import { UbuntuTerminal } from './components/UbuntuTerminal';
import { YaruAIAssistant } from './components/YaruAIAssistant';
import { QuickPreviewModal } from './components/QuickPreviewModal';
import { PropertiesModal } from './components/PropertiesModal';
import { ContextMenu } from './components/ContextMenu';
import { SettingsModal } from './components/SettingsModal';
import { ThemeShowcaseModal } from './components/ThemeShowcaseModal';

export const App: React.FC = () => {
  // Theme & Appearance State
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark');
  const [accentColor, setAccentColor] = useState<AccentColor>('orange');
  const [currentCustomTheme, setCurrentCustomTheme] = useState<YaruTheme | null>(null);
  const [showHiddenFiles, setShowHiddenFiles] = useState(false);
  const [iconScale, setIconScale] = useState<'small' | 'medium' | 'large'>('medium');

  // File System State
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);

  // Primary Pane Navigation State
  const [currentFolderId, setCurrentFolderId] = useState<string>('home');
  const [history, setHistory] = useState<string[]>(['home']);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  // Secondary Pane Navigation State (for Dual-Pane F3)
  const [isDualPane, setIsDualPane] = useState<boolean>(false);
  const [secondaryFolderId, setSecondaryFolderId] = useState<string>('folder-documents');

  // View & Filter State
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [activeFilter, setActiveFilter] = useState<'none' | 'starred' | ColorTag>('none');

  // Selection & Clipboard
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [clipboard, setClipboard] = useState<ClipboardState>({ items: [], action: null });

  // Drawers & Modals
  const [isTerminalOpen, setIsTerminalOpen] = useState<boolean>(false);
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string>('');
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [propertiesFile, setPropertiesFile] = useState<FileItem | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isThemeShowcaseOpen, setIsThemeShowcaseOpen] = useState<boolean>(false);

  // Apply custom community or created Yaru theme
  const handleApplyTheme = useCallback((theme: YaruTheme) => {
    setCurrentCustomTheme(theme);
    setThemeMode(theme.baseMode);

    // Sync CSS Variables for deep styling consistency
    document.documentElement.style.setProperty('--yaru-accent', theme.accentColor);
    document.documentElement.style.setProperty('--yaru-header', theme.headerColor);
    document.documentElement.style.setProperty('--yaru-sidebar', theme.sidebarColor);
    document.documentElement.style.setProperty('--yaru-canvas', theme.windowBg);
    document.documentElement.style.setProperty('--yaru-dock', theme.dockColor);
    document.documentElement.style.setProperty('--yaru-radius', `${theme.borderRadius}px`);
  }, []);

  // Context Menu State
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    targetFile: FileItem | null;
  } | null>(null);

  // Trash count calculation
  const trashCount = useMemo(() => {
    return files.filter((f) => f.parentId === 'trash').length;
  }, [files]);

  // Current folder item & path
  const currentFolder = useMemo(() => {
    return files.find((f) => f.id === currentFolderId);
  }, [files, currentFolderId]);

  const currentPath = useMemo(() => {
    return getPathForFolder(currentFolderId, files);
  }, [currentFolderId, files]);

  // Breadcrumbs calculation
  const breadcrumbs: BreadcrumbItem[] = useMemo(() => {
    return getBreadcrumbs(currentFolderId, files);
  }, [currentFolderId, files]);

  // Visible files in the active primary folder
  const currentFolderFiles = useMemo(() => {
    return files.filter((f) => {
      // In Trash folder
      if (currentFolderId === 'trash') {
        return f.parentId === 'trash';
      }
      // If filtering by Starred
      if (activeFilter === 'starred') {
        return f.isStarred && f.parentId !== 'trash';
      }
      // If filtering by Tag
      if (activeFilter !== 'none') {
        return f.tag === activeFilter && f.parentId !== 'trash';
      }
      return f.parentId === currentFolderId;
    });
  }, [files, currentFolderId, activeFilter]);

  // Filtered & Sorted files for primary pane
  const processedFiles = useMemo(() => {
    const filtered = filterFiles(currentFolderFiles, searchQuery, showHiddenFiles);
    return sortFiles(filtered, sortField, sortOrder);
  }, [currentFolderFiles, searchQuery, showHiddenFiles, sortField, sortOrder]);

  // Secondary Pane Files (when dual-pane is open)
  const secondaryFiles = useMemo(() => {
    const raw = files.filter((f) => f.parentId === secondaryFolderId);
    const filtered = filterFiles(raw, '', showHiddenFiles);
    return sortFiles(filtered, 'name', 'asc');
  }, [files, secondaryFolderId, showHiddenFiles]);

  // Selected file items
  const selectedFileItems = useMemo(() => {
    return files.filter((f) => selectedIds.includes(f.id));
  }, [files, selectedIds]);

  // Navigation handlers
  const navigateToFolder = useCallback((folderId: string) => {
    if (folderId === currentFolderId) return;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(folderId);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentFolderId(folderId);
    setSelectedIds([]);
    setSearchQuery('');
  }, [currentFolderId, history, historyIndex]);

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setCurrentFolderId(history[newIndex]);
      setSelectedIds([]);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setCurrentFolderId(history[newIndex]);
      setSelectedIds([]);
    }
  };

  // Keyboard shortcuts (Nautilus style: Space for preview, F2 rename, Ctrl+F search, F3 dual pane, Ctrl+` terminal, Ctrl+H hidden)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if focus is inside an input/textarea
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

      // Space: Quick Preview
      if (e.code === 'Space' && selectedIds.length === 1) {
        e.preventDefault();
        const selected = files.find((f) => f.id === selectedIds[0]);
        if (selected) {
          setPreviewFile(previewFile ? null : selected);
        }
      }

      // F3: Toggle Dual Pane
      if (e.key === 'F3') {
        e.preventDefault();
        setIsDualPane((prev) => !prev);
      }

      // Ctrl + ` or F12: Toggle Terminal
      if ((e.ctrlKey && e.key === '`') || e.key === 'F12') {
        e.preventDefault();
        setIsTerminalOpen((prev) => !prev);
      }

      // Ctrl + H: Show hidden files
      if (e.ctrlKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setShowHiddenFiles((prev) => !prev);
      }

      // Ctrl + F: Search
      if (e.ctrlKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }

      // Ctrl + A: Select All
      if (e.ctrlKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setSelectedIds(processedFiles.map((f: FileItem) => f.id));
      }

      // Delete: Move selected to trash
      if (e.key === 'Delete' && selectedIds.length > 0) {
        e.preventDefault();
        handleDeleteSelected();
      }

      // Esc: Clear selection or close modals
      if (e.key === 'Escape') {
        if (previewFile) setPreviewFile(null);
        else if (propertiesFile) setPropertiesFile(null);
        else if (contextMenu) setContextMenu(null);
        else setSelectedIds([]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIds, files, previewFile, propertiesFile, contextMenu, processedFiles]);

  // Selection handler
  const handleSelectFile = (file: FileItem, isMulti: boolean) => {
    if (isMulti) {
      setSelectedIds((prev) =>
        prev.includes(file.id) ? prev.filter((id) => id !== file.id) : [...prev, file.id]
      );
    } else {
      setSelectedIds([file.id]);
    }
  };

  // Open item (Folder navigation or File Quick Preview)
  const handleOpenItem = (file: FileItem) => {
    if (file.type === 'folder') {
      navigateToFolder(file.id);
    } else {
      setPreviewFile(file);
    }
  };

  // Star toggle
  const handleToggleStar = (file: FileItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, isStarred: !f.isStarred } : f))
    );
  };

  // Tag color setter
  const handleSetTag = (file: FileItem, tag: ColorTag | null) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, tag: tag || undefined } : f))
    );
  };

  // Delete / Trash
  const handleDeleteSelected = () => {
    setFiles((prev) =>
      prev.map((f) => (selectedIds.includes(f.id) ? { ...f, parentId: 'trash' } : f))
    );
    setSelectedIds([]);
  };

  const handleDeleteSingle = (file: FileItem) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === file.id ? { ...f, parentId: 'trash' } : f))
    );
    setSelectedIds((prev) => prev.filter((id) => id !== file.id));
  };

  // Empty Trash
  const handleEmptyTrash = () => {
    if (window.confirm('Are you sure you want to permanently delete all items in Trash?')) {
      setFiles((prev) => prev.filter((f) => f.parentId !== 'trash'));
    }
  };

  // Clipboard: Cut / Copy / Paste
  const handleCut = (file: FileItem) => {
    setClipboard({ items: [file], action: 'cut' });
  };

  const handleCopy = (file: FileItem) => {
    setClipboard({ items: [file], action: 'copy' });
  };

  const handlePaste = () => {
    if (clipboard.items.length === 0) return;

    if (clipboard.action === 'cut') {
      setFiles((prev) =>
        prev.map((f) => {
          const matched = clipboard.items.find((item) => item.id === f.id);
          return matched ? { ...f, parentId: currentFolderId } : f;
        })
      );
      setClipboard({ items: [], action: null });
    } else if (clipboard.action === 'copy') {
      const newItems: FileItem[] = clipboard.items.map((item) => ({
        ...item,
        id: generateId(),
        name: `Copy of ${item.name}`,
        parentId: currentFolderId,
        created: new Date().toISOString(),
        modified: new Date().toISOString(),
      }));
      setFiles((prev) => [...prev, ...newItems]);
    }
  };

  // Rename
  const handleRename = (file: FileItem) => {
    const newName = window.prompt('Enter new name:', file.name);
    if (newName && newName.trim() && newName !== file.name) {
      setFiles((prev) =>
        prev.map((f) => (f.id === file.id ? { ...f, name: newName.trim() } : f))
      );
    }
  };

  // Create new folder
  const handleNewFolder = () => {
    const name = window.prompt('New Folder Name:', 'Untitled Folder');
    if (!name || !name.trim()) return;

    const newFolder: FileItem = {
      id: generateId(),
      name: name.trim(),
      type: 'folder',
      parentId: currentFolderId,
      size: 4096,
      category: 'folder',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      permissions: 'drwxr-xr-x',
      owner: 'ubuntu',
      group: 'ubuntu',
    };

    setFiles((prev) => [...prev, newFolder]);
    setSelectedIds([newFolder.id]);
  };

  // Create new file
  const handleNewFile = () => {
    const name = window.prompt('New Document Name:', 'new_document.txt');
    if (!name || !name.trim()) return;

    const ext = name.includes('.') ? name.split('.').pop()?.toLowerCase() : 'txt';

    const newFile: FileItem = {
      id: generateId(),
      name: name.trim(),
      type: 'file',
      extension: ext,
      parentId: currentFolderId,
      size: 0,
      category: detectCategory(name.trim()),
      content: '',
      created: new Date().toISOString(),
      modified: new Date().toISOString(),
      permissions: '-rw-r--r--',
      owner: 'ubuntu',
      group: 'ubuntu',
    };

    setFiles((prev) => [...prev, newFile]);
    setSelectedIds([newFile.id]);
  };

  // Upload file from local machine into current folder
  const handleUploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploaded = e.target.files;
    if (!uploaded || uploaded.length === 0) return;

    Array.from(uploaded).forEach((file) => {
      const reader = new FileReader();
      const isText =
        file.type.startsWith('text/') ||
        file.name.endsWith('.md') ||
        file.name.endsWith('.ts') ||
        file.name.endsWith('.js') ||
        file.name.endsWith('.json') ||
        file.name.endsWith('.svg');

      reader.onload = (event) => {
        const content = event.target?.result as string;
        const ext = file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() : '';

        const newFileItem: FileItem = {
          id: generateId(),
          name: file.name,
          type: 'file',
          extension: ext,
          parentId: currentFolderId,
          size: file.size,
          category: detectCategory(file.name),
          content: isText ? content : undefined,
          mimeType: file.type,
          created: new Date().toISOString(),
          modified: new Date(file.lastModified).toISOString(),
          permissions: '-rw-r--r--',
          owner: 'ubuntu',
          group: 'ubuntu',
        };

        setFiles((prev) => [...prev, newFileItem]);
      };

      if (isText) {
        reader.readAsText(file);
      } else {
        reader.readAsArrayBuffer(file);
      }
    });
  };

  // Drag and Drop files onto folder to move them
  const handleDropOnFolder = (draggedId: string, targetFolderId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === draggedId ? { ...f, parentId: targetFolderId } : f))
    );
  };

  // Ask Yaru AI hands-off
  const handleAskAIWithFile = (file: FileItem, mode: 'quick' | 'thinking' = 'quick') => {
    setSelectedIds([file.id]);
    setIsAIOpen(true);
    setAiInitialPrompt(
      mode === 'thinking'
        ? `Perform an in-depth analysis and logic review of ${file.name}.`
        : `Summarize the content and structure of ${file.name}.`
    );
  };

  // Sort change
  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Theme styling calculation
  const getThemeWrapperClass = () => {
    if (themeMode === 'light') return 'bg-[#EAEAEA] text-[#222222] font-ubuntu';
    if (themeMode === 'aubergine') return 'bg-[#2C001E] text-white font-ubuntu';
    return 'bg-[#1E1E1E] text-white font-ubuntu';
  };

  return (
    <div
      id="ubuntu-desktop-root"
      className={`w-screen h-screen overflow-hidden flex flex-col select-none transition-colors duration-200 ${getThemeWrapperClass()}`}
    >
      {/* 1. GNOME Shell Top Bar */}
      <GnomeTopBar
        themeMode={themeMode}
        onToggleTheme={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
        accentColor={accentColor}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenThemeShowcase={() => setIsThemeShowcaseOpen(true)}
        onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
        onToggleDualPane={() => setIsDualPane((prev) => !prev)}
        onToggleAI={() => setIsAIOpen((prev) => !prev)}
        onNewFolder={handleNewFolder}
        isTerminalOpen={isTerminalOpen}
        isDualPane={isDualPane}
      />

      {/* 2. Workspace: Ubuntu Dock + Nautilus Window */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Ubuntu Dock (left launcher) */}
        <UbuntuDock
          onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
          onToggleDualPane={() => setIsDualPane((prev) => !prev)}
          onToggleAI={() => setIsAIOpen((prev) => !prev)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenThemeShowcase={() => setIsThemeShowcaseOpen(true)}
          isThemeShowcaseOpen={isThemeShowcaseOpen}
          customDockColor={currentCustomTheme?.dockColor}
          onOpenTrash={() => {
            setActiveFilter('none');
            navigateToFolder('trash');
          }}
          isTerminalOpen={isTerminalOpen}
          isDualPane={isDualPane}
          isAIOpen={isAIOpen}
          trashCount={trashCount}
        />

        {/* Main Nautilus File Manager Window */}
        <main
          id="nautilus-window-frame"
          style={currentCustomTheme ? { backgroundColor: currentCustomTheme.windowBg } : undefined}
          className="flex-1 flex flex-col overflow-hidden bg-transparent"
        >
          {/* Nautilus Header Bar (CSD) */}
          <NautilusHeader
            currentPath={currentPath}
            breadcrumbs={breadcrumbs}
            onNavigateBreadcrumb={navigateToFolder}
            canGoBack={historyIndex > 0}
            canGoForward={historyIndex < history.length - 1}
            onGoBack={goBack}
            onGoForward={goForward}
            viewMode={viewMode}
            onToggleViewMode={setViewMode}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            isSearchOpen={isSearchOpen}
            onToggleSearch={() => setIsSearchOpen((prev) => !prev)}
            isDualPane={isDualPane}
            onToggleDualPane={() => setIsDualPane((prev) => !prev)}
            isTerminalOpen={isTerminalOpen}
            onToggleTerminal={() => setIsTerminalOpen((prev) => !prev)}
            isAIOpen={isAIOpen}
            onToggleAI={() => setIsAIOpen((prev) => !prev)}
            onNewFolder={handleNewFolder}
            onUploadFile={handleUploadFile}
            sortField={sortField}
            sortOrder={sortOrder}
            onSortChange={handleSortChange}
            showHiddenFiles={showHiddenFiles}
            onToggleHiddenFiles={() => setShowHiddenFiles((prev) => !prev)}
            iconScale={iconScale}
            onIconScaleChange={setIconScale}
            themeMode={themeMode}
            onSelectAll={() => setSelectedIds(processedFiles.map((f: FileItem) => f.id))}
            onOpenThemeShowcase={() => setIsThemeShowcaseOpen(true)}
            customHeaderColor={currentCustomTheme?.headerColor}
          />

          {/* Nautilus Body: Places Sidebar + File Viewer (+ Optional Dual Pane) */}
          <div className="flex-1 flex overflow-hidden">
            {/* Places Sidebar */}
            <NautilusSidebar
              currentFolderId={currentFolderId}
              onSelectFolder={navigateToFolder}
              activeFilter={activeFilter}
              onSelectFilter={setActiveFilter}
              themeMode={themeMode}
              trashCount={trashCount}
              customSidebarColor={currentCustomTheme?.sidebarColor}
              customAccentColor={currentCustomTheme?.accentColor}
            />

            {/* Primary View Pane */}
            <div
              id="nautilus-primary-pane"
              style={currentCustomTheme ? { backgroundColor: currentCustomTheme.windowBg } : undefined}
              onClick={() => {
                setSelectedIds([]);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                setContextMenu({ x: e.clientX, y: e.clientY, targetFile: null });
              }}
              className="flex-1 flex flex-col overflow-y-auto relative"
            >
              {/* Trash Banner if in Trash */}
              {currentFolderId === 'trash' && (
                <div className="px-4 py-2 bg-[#E95420]/15 border-b border-[#E95420]/30 flex items-center justify-between text-xs">
                  <span className="text-[#FF6309] font-medium">
                    Trash contains {currentFolderFiles.length} item{currentFolderFiles.length === 1 ? '' : 's'}.
                  </span>
                  <button
                    onClick={handleEmptyTrash}
                    disabled={currentFolderFiles.length === 0}
                    className="px-3 py-1 bg-[#EF2929] hover:bg-[#D32F2F] text-white rounded font-medium disabled:opacity-40 transition-colors"
                  >
                    Empty Trash
                  </button>
                </div>
              )}

              {/* Files Area (Grid or List) */}
              <div className="flex-1 overflow-y-auto">
                {viewMode === 'grid' ? (
                  <FileGrid
                    files={processedFiles}
                    selectedIds={selectedIds}
                    onSelectFile={handleSelectFile}
                    onOpenItem={handleOpenItem}
                    onContextMenu={(e, file) => {
                      setContextMenu({ x: e.clientX, y: e.clientY, targetFile: file });
                    }}
                    onToggleStar={handleToggleStar}
                    onDropOnFolder={handleDropOnFolder}
                    iconScale={iconScale}
                    themeMode={themeMode}
                  />
                ) : (
                  <FileList
                    files={processedFiles}
                    selectedIds={selectedIds}
                    onSelectFile={handleSelectFile}
                    onOpenItem={handleOpenItem}
                    onContextMenu={(e, file) => {
                      setContextMenu({ x: e.clientX, y: e.clientY, targetFile: file });
                    }}
                    onToggleStar={handleToggleStar}
                    onDropOnFolder={handleDropOnFolder}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                    themeMode={themeMode}
                  />
                )}
              </div>

              {/* Status bar */}
              <div className="h-6 px-3 bg-black/15 border-t border-black/15 flex items-center justify-between text-[11px] text-white/50 select-none">
                <span>
                  {selectedIds.length > 0
                    ? `${selectedIds.length} item${selectedIds.length > 1 ? 's' : ''} selected`
                    : `${processedFiles.length} item${processedFiles.length === 1 ? '' : 's'}`}
                </span>
                <span className="font-mono text-[10px]">
                  F3: Dual Pane • Ctrl+`: Terminal • Space: Preview
                </span>
              </div>
            </div>

            {/* Secondary View Pane (Dual Pane mode F3) */}
            {isDualPane && (
              <div
                id="nautilus-secondary-pane"
                className="flex-1 flex flex-col border-l border-white/10 overflow-y-auto relative bg-black/10"
              >
                {/* Secondary Pane Header */}
                <div className="h-9 px-3 bg-black/20 border-b border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white/90">Secondary Pane:</span>
                    <select
                      value={secondaryFolderId}
                      onChange={(e) => setSecondaryFolderId(e.target.value)}
                      className="bg-[#2B2B2B] text-white border border-[#444] rounded px-2 py-0.5 text-xs outline-none"
                    >
                      <option value="home">Home (~)</option>
                      <option value="folder-desktop">Desktop</option>
                      <option value="folder-documents">Documents</option>
                      <option value="folder-downloads">Downloads</option>
                      <option value="folder-pictures">Pictures</option>
                      <option value="folder-projects">Projects</option>
                    </select>
                  </div>
                  <button
                    onClick={() => setIsDualPane(false)}
                    className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {/* Secondary File List */}
                <div className="flex-1 overflow-y-auto">
                  <FileGrid
                    files={secondaryFiles}
                    selectedIds={[]}
                    onSelectFile={(f) => {
                      if (f.type === 'folder') setSecondaryFolderId(f.id);
                      else setPreviewFile(f);
                    }}
                    onOpenItem={(f) => {
                      if (f.type === 'folder') setSecondaryFolderId(f.id);
                      else setPreviewFile(f);
                    }}
                    onContextMenu={() => {}}
                    onToggleStar={() => {}}
                    onDropOnFolder={handleDropOnFolder}
                    iconScale="small"
                    themeMode={themeMode}
                  />
                </div>
              </div>
            )}

            {/* Yaru AI Assistant Drawer */}
            {isAIOpen && (
              <YaruAIAssistant
                selectedFiles={selectedFileItems}
                currentPath={currentPath}
                onClose={() => setIsAIOpen(false)}
                themeMode={themeMode}
                initialPrompt={aiInitialPrompt}
              />
            )}
          </div>

          {/* Ubuntu Terminal Drawer */}
          {isTerminalOpen && (
            <UbuntuTerminal
              currentPath={currentPath}
              files={processedFiles}
              allFiles={files}
              onNavigate={navigateToFolder}
              onCreateFile={(name) => {
                const newF: FileItem = {
                  id: generateId(),
                  name,
                  type: 'file',
                  parentId: currentFolderId,
                  size: 0,
                  category: detectCategory(name),
                  created: new Date().toISOString(),
                  modified: new Date().toISOString(),
                  permissions: '-rw-r--r--',
                  owner: 'ubuntu',
                  group: 'ubuntu',
                };
                setFiles((prev) => [...prev, newF]);
              }}
              onCreateFolder={(name) => {
                const newF: FileItem = {
                  id: generateId(),
                  name,
                  type: 'folder',
                  parentId: currentFolderId,
                  size: 4096,
                  category: 'folder',
                  created: new Date().toISOString(),
                  modified: new Date().toISOString(),
                  permissions: 'drwxr-xr-x',
                  owner: 'ubuntu',
                  group: 'ubuntu',
                };
                setFiles((prev) => [...prev, newF]);
              }}
              onDeleteFile={(id) => {
                setFiles((prev) => prev.map((f) => (f.id === id ? { ...f, parentId: 'trash' } : f)));
              }}
              onAskAI={(q) => {
                setIsAIOpen(true);
                setAiInitialPrompt(q);
              }}
              onClose={() => setIsTerminalOpen(false)}
            />
          )}
        </main>
      </div>

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          targetFile={contextMenu.targetFile}
          hasClipboard={clipboard.items.length > 0}
          onClose={() => setContextMenu(null)}
          onOpen={handleOpenItem}
          onQuickLook={(f: FileItem) => setPreviewFile(f)}
          onOpenInTerminal={() => setIsTerminalOpen(true)}
          onCut={handleCut}
          onCopy={handleCopy}
          onPaste={handlePaste}
          onDelete={handleDeleteSingle}
          onRename={handleRename}
          onToggleStar={handleToggleStar}
          onSetTag={handleSetTag}
          onDownload={downloadFileContent}
          onProperties={(f: FileItem | null) => setPropertiesFile(f || currentFolder || null)}
          onAskAI={handleAskAIWithFile}
          onNewFolder={handleNewFolder}
          onNewFile={handleNewFile}
          themeMode={themeMode}
        />
      )}

      {/* Quick Look Preview Modal */}
      {previewFile && (
        <QuickPreviewModal
          file={previewFile}
          onClose={() => setPreviewFile(null)}
          onAskAI={(f) => handleAskAIWithFile(f, 'quick')}
          themeMode={themeMode}
        />
      )}

      {/* Properties Modal */}
      {propertiesFile && (
        <PropertiesModal
          file={propertiesFile}
          currentPath={currentPath}
          folderItemCount={currentFolderFiles.length}
          onClose={() => setPropertiesFile(null)}
          onUpdateTag={(fileId: string, tag: ColorTag | null) => {
            setFiles((prev) =>
              prev.map((f) => (f.id === fileId ? { ...f, tag: tag || undefined } : f))
            );
          }}
          themeMode={themeMode}
        />
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <SettingsModal
          themeMode={themeMode}
          onThemeChange={setThemeMode}
          accentColor={accentColor}
          onAccentColorChange={(c) => setAccentColor(c as AccentColor)}
          showHiddenFiles={showHiddenFiles}
          onToggleHiddenFiles={() => setShowHiddenFiles((prev) => !prev)}
          onClose={() => setIsSettingsOpen(false)}
          onOpenThemeShowcase={() => setIsThemeShowcaseOpen(true)}
          activeCustomThemeName={currentCustomTheme?.name}
        />
      )}

      {/* Yaru Community Themes Showcase & Creator Modal */}
      {isThemeShowcaseOpen && (
        <ThemeShowcaseModal
          currentTheme={currentCustomTheme}
          onApplyTheme={handleApplyTheme}
          onClose={() => setIsThemeShowcaseOpen(false)}
          themeMode={themeMode}
        />
      )}
    </div>
  );
};

export default App;
