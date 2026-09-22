import React, { useEffect, useRef } from 'react';
import {
  FolderOpen,
  Eye,
  Terminal,
  Scissors,
  Copy,
  ClipboardPaste,
  Trash2,
  Edit2,
  Star,
  Download,
  Info,
  Sparkles,
  FolderPlus,
  FilePlus,
  Circle,
} from 'lucide-react';
import { FileItem, ColorTag, ThemeMode } from '../types';

interface ContextMenuProps {
  x: number;
  y: number;
  targetFile: FileItem | null;
  hasClipboard: boolean;
  onClose: () => void;
  onOpen: (file: FileItem) => void;
  onQuickLook: (file: FileItem) => void;
  onOpenInTerminal: (file?: FileItem) => void;
  onCut: (file: FileItem) => void;
  onCopy: (file: FileItem) => void;
  onPaste: () => void;
  onDelete: (file: FileItem) => void;
  onRename: (file: FileItem) => void;
  onToggleStar: (file: FileItem) => void;
  onSetTag: (file: FileItem, tag: ColorTag | null) => void;
  onDownload: (file: FileItem) => void;
  onProperties: (file: FileItem | null) => void;
  onAskAI: (file: FileItem, mode: 'quick' | 'thinking') => void;
  onNewFolder: () => void;
  onNewFile: () => void;
  themeMode: ThemeMode;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  targetFile,
  hasClipboard,
  onClose,
  onOpen,
  onQuickLook,
  onOpenInTerminal,
  onCut,
  onCopy,
  onPaste,
  onDelete,
  onRename,
  onToggleStar,
  onSetTag,
  onDownload,
  onProperties,
  onAskAI,
  onNewFolder,
  onNewFile,
  themeMode,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener('click', handleOutsideClick);
    window.addEventListener('contextmenu', handleOutsideClick);
    return () => {
      window.removeEventListener('click', handleOutsideClick);
      window.removeEventListener('contextmenu', handleOutsideClick);
    };
  }, [onClose]);

  // Adjust coordinates if menu would render offscreen
  const menuWidth = 230;
  const menuHeight = targetFile ? 390 : 210;
  const adjustedX = Math.min(x, window.innerWidth - menuWidth - 10);
  const adjustedY = Math.min(y, window.innerHeight - menuHeight - 10);

  const tags: { tag: ColorTag | null; color: string; label: string }[] = [
    { tag: 'orange', color: '#E95420', label: 'Orange' },
    { tag: 'purple', color: '#77216F', label: 'Purple' },
    { tag: 'green', color: '#38B44A', label: 'Green' },
    { tag: 'blue', color: '#19B6EE', label: 'Blue' },
    { tag: 'red', color: '#EF2929', label: 'Red' },
    { tag: null, color: '#666666', label: 'Clear' },
  ];

  return (
    <div
      ref={menuRef}
      id="nautilus-context-menu"
      style={{ left: adjustedX, top: adjustedY }}
      className="fixed z-50 w-56 bg-[#2B2B2B] text-white border border-[#444444] rounded-lg shadow-2xl py-1 text-xs select-none animate-in fade-in zoom-in-95 duration-100"
    >
      {targetFile ? (
        <>
          {/* File Context Menu */}
          <button
            onClick={() => {
              onOpen(targetFile);
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center gap-2.5 font-medium"
          >
            <FolderOpen size={14} className="opacity-70" />
            <span>Open</span>
          </button>

          <button
            onClick={() => {
              onQuickLook(targetFile);
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2.5">
              <Eye size={14} className="opacity-70" />
              <span>Quick Look Preview</span>
            </span>
            <span className="text-[10px] opacity-50">Space</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          {/* Ask AI Sub-actions */}
          <button
            onClick={() => {
              onAskAI(targetFile, 'quick');
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center gap-2.5 text-[#FF7538] hover:text-white"
          >
            <Sparkles size={14} />
            <span>⚡ AI Quick Summary</span>
          </button>

          <button
            onClick={() => {
              onAskAI(targetFile, 'thinking');
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center gap-2.5 text-[#19B6EE] hover:text-white"
          >
            <Sparkles size={14} />
            <span>🧠 AI Deep Thinking Analysis</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          {/* Cut / Copy */}
          <button
            onClick={() => {
              onCut(targetFile);
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2.5">
              <Scissors size={14} className="opacity-70" />
              <span>Cut</span>
            </span>
            <span className="text-[10px] opacity-50">Ctrl+X</span>
          </button>

          <button
            onClick={() => {
              onCopy(targetFile);
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2.5">
              <Copy size={14} className="opacity-70" />
              <span>Copy</span>
            </span>
            <span className="text-[10px] opacity-50">Ctrl+C</span>
          </button>

          <button
            onClick={() => {
              onRename(targetFile);
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2.5">
              <Edit2 size={14} className="opacity-70" />
              <span>Rename...</span>
            </span>
            <span className="text-[10px] opacity-50">F2</span>
          </button>

          <button
            onClick={() => {
              onToggleStar(targetFile);
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center gap-2.5"
          >
            <Star
              size={14}
              className={targetFile.isStarred ? 'fill-[#FF6309] text-[#FF6309]' : 'opacity-70'}
            />
            <span>{targetFile.isStarred ? 'Remove from Favorites' : 'Star as Favorite'}</span>
          </button>

          {/* Color Tags Selector */}
          <div className="px-3 py-1.5 flex items-center justify-between">
            <span className="text-[11px] text-white/50">Tag:</span>
            <div className="flex items-center gap-1.5">
              {tags.map((t, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSetTag(targetFile, t.tag);
                    onClose();
                  }}
                  title={t.label}
                  className="w-3.5 h-3.5 rounded-full hover:scale-125 transition-transform"
                  style={{ backgroundColor: t.color }}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              onDownload(targetFile);
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center gap-2.5"
          >
            <Download size={14} className="opacity-70" />
            <span>Download</span>
          </button>

          <button
            onClick={() => {
              onDelete(targetFile);
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#EF2929] transition-colors flex items-center justify-between text-[#EF2929] hover:text-white"
          >
            <span className="flex items-center gap-2.5">
              <Trash2 size={14} />
              <span>Move to Trash</span>
            </span>
            <span className="text-[10px] opacity-70">Del</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              onProperties(targetFile);
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center gap-2.5"
          >
            <Info size={14} className="opacity-70" />
            <span>Properties</span>
          </button>
        </>
      ) : (
        <>
          {/* Empty Space Canvas Context Menu */}
          <button
            onClick={() => {
              onNewFolder();
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2.5">
              <FolderPlus size={14} className="opacity-70" />
              <span>New Folder</span>
            </span>
            <span className="text-[10px] opacity-50">Ctrl+Shift+N</span>
          </button>

          <button
            onClick={() => {
              onNewFile();
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center gap-2.5"
          >
            <FilePlus size={14} className="opacity-70" />
            <span>New Text Document</span>
          </button>

          <button
            onClick={() => {
              onPaste();
              onClose();
            }}
            disabled={!hasClipboard}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] disabled:opacity-40 disabled:hover:bg-transparent transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2.5">
              <ClipboardPaste size={14} className="opacity-70" />
              <span>Paste</span>
            </span>
            <span className="text-[10px] opacity-50">Ctrl+V</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              onOpenInTerminal();
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center justify-between"
          >
            <span className="flex items-center gap-2.5">
              <Terminal size={14} className="opacity-70 text-[#4AF626]" />
              <span>Open in Terminal</span>
            </span>
            <span className="text-[10px] opacity-50">Ctrl+`</span>
          </button>

          <div className="h-px bg-white/10 my-1" />

          <button
            onClick={() => {
              onProperties(null);
              onClose();
            }}
            className="w-full text-left px-3 py-1.5 hover:bg-[#E95420] transition-colors flex items-center gap-2.5"
          >
            <Info size={14} className="opacity-70" />
            <span>Folder Properties</span>
          </button>
        </>
      )}
    </div>
  );
};
