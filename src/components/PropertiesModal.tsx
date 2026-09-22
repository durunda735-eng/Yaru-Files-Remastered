import React, { useState } from 'react';
import { X, HardDrive, Shield, Calendar, User, Tag } from 'lucide-react';
import { FileItem, ColorTag, ThemeMode } from '../types';
import { YaruFolder, YaruFileIcon } from './YaruIcons';
import { formatFileSize, formatDate } from '../utils/fileHelpers';

interface PropertiesModalProps {
  file: FileItem | null;
  currentPath: string;
  folderItemCount?: number;
  onClose: () => void;
  onUpdateTag: (fileId: string, tag: ColorTag | null) => void;
  themeMode: ThemeMode;
}

export const PropertiesModal: React.FC<PropertiesModalProps> = ({
  file,
  currentPath,
  folderItemCount = 0,
  onClose,
  onUpdateTag,
  themeMode,
}) => {
  const [activeTab, setActiveTab] = useState<'basic' | 'permissions'>('basic');

  const isDark = themeMode === 'dark' || themeMode === 'aubergine';

  const tags: { tag: ColorTag | null; color: string; label: string }[] = [
    { tag: 'orange', color: '#E95420', label: 'Orange' },
    { tag: 'purple', color: '#77216F', label: 'Purple' },
    { tag: 'green', color: '#38B44A', label: 'Green' },
    { tag: 'blue', color: '#19B6EE', label: 'Blue' },
    { tag: 'red', color: '#EF2929', label: 'Red' },
    { tag: null, color: '#666666', label: 'None' },
  ];

  const titleName = file ? file.name : currentPath.split('/').pop() || 'Folder';

  return (
    <div
      id="properties-modal-overlay"
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="properties-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-xl shadow-2xl border flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 ${
          isDark ? 'bg-[#2D2D2D] border-[#444] text-white' : 'bg-white border-[#D0D0D0] text-[#222]'
        }`}
      >
        {/* Header */}
        <div className="h-11 px-4 flex items-center justify-between border-b border-black/20 bg-black/10 select-none">
          <span className="text-xs font-bold truncate">{titleName} Properties</span>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-black/20 px-4 bg-black/5 select-none">
          <button
            onClick={() => setActiveTab('basic')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'basic'
                ? 'border-[#E95420] text-[#E95420]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => setActiveTab('permissions')}
            className={`py-2 px-3 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'permissions'
                ? 'border-[#E95420] text-[#E95420]'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            Permissions
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 text-xs">
          {activeTab === 'basic' ? (
            <>
              {/* Icon & Name */}
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                {file ? (
                  file.type === 'folder' ? (
                    <YaruFolder size={48} />
                  ) : (
                    <YaruFileIcon
                      category={file.category}
                      extension={file.extension}
                      size={44}
                    />
                  )
                ) : (
                  <YaruFolder size={48} />
                )}
                <div className="truncate">
                  <div className="font-bold text-sm text-white/95 truncate">
                    {file ? file.name : currentPath}
                  </div>
                  <div className="text-[11px] text-white/50">
                    {file
                      ? file.type === 'folder'
                        ? 'Folder'
                        : `${file.category.toUpperCase()} File (${formatFileSize(file.size)})`
                      : `Current Folder (${folderItemCount} items)`}
                  </div>
                </div>
              </div>

              {/* Details grid */}
              <div className="space-y-2 text-white/80">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Type:</span>
                  <span className="font-medium">
                    {file ? file.mimeType || `${file.category} file` : 'inode/directory'}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Size:</span>
                  <span className="font-mono">
                    {file ? `${formatFileSize(file.size)} (${file.size} bytes)` : `${folderItemCount * 4} KB`}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Location:</span>
                  <span className="font-mono text-white/70 truncate max-w-[200px]">
                    {currentPath}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-white/50">Modified:</span>
                  <span>{file ? formatDate(file.modified) : 'Today'}</span>
                </div>
              </div>

              {/* Tag Selection */}
              {file && (
                <div className="pt-2">
                  <div className="text-white/50 text-[11px] mb-2 flex items-center gap-1">
                    <Tag size={12} />
                    <span>Emblem Tag:</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {tags.map((t, idx) => (
                      <button
                        key={idx}
                        onClick={() => onUpdateTag(file.id, t.tag)}
                        className={`px-2.5 py-1 rounded text-[11px] flex items-center gap-1.5 transition-all ${
                          file.tag === t.tag
                            ? 'ring-1 ring-white bg-white/20 font-bold'
                            : 'bg-white/5 hover:bg-white/10'
                        }`}
                      >
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                        <span>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Permissions Tab */
            <div className="space-y-3">
              <div className="p-3 bg-black/20 rounded-lg border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 flex items-center gap-1.5">
                    <User size={13} />
                    <span>Owner:</span>
                  </span>
                  <span className="font-mono text-white/90">
                    {file ? file.owner : 'ubuntu'} (User ID: 1000)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/50">Access:</span>
                  <span className="text-[#38B44A] font-semibold">Read and write</span>
                </div>
              </div>

              <div className="p-3 bg-black/20 rounded-lg border border-white/5 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-white/50 flex items-center gap-1.5">
                    <Shield size={13} />
                    <span>Group:</span>
                  </span>
                  <span className="font-mono text-white/90">
                    {file ? file.group : 'ubuntu'} (Group ID: 1000)
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white/50">Access:</span>
                  <span className="text-white/80">Read-only</span>
                </div>
              </div>

              <div className="flex justify-between items-center p-3 bg-black/20 rounded-lg border border-white/5">
                <span className="text-white/50">Others:</span>
                <span className="text-white/80">Read-only</span>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px] text-white/50 font-mono">
                <span>Unix Mode:</span>
                <span className="px-2 py-0.5 rounded bg-black/40 text-[#4AF626]">
                  {file ? file.permissions : 'drwxr-xr-x'} (0755)
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-black/20 border-t border-black/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#E95420] hover:bg-[#FF6309] text-white text-xs font-semibold shadow-sm transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
