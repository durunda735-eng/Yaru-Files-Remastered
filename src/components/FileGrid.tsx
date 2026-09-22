import React from 'react';
import { Star, Circle } from 'lucide-react';
import { FileItem, ThemeMode } from '../types';
import { YaruFolder, YaruFileIcon } from './YaruIcons';
import { formatFileSize, getTagColorClass } from '../utils/fileHelpers';

interface FileGridProps {
  files: FileItem[];
  selectedIds: string[];
  onSelectFile: (file: FileItem, isMulti: boolean) => void;
  onOpenItem: (file: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, file: FileItem) => void;
  onToggleStar: (file: FileItem, e: React.MouseEvent) => void;
  onDropOnFolder: (draggedId: string, targetFolderId: string) => void;
  iconScale: 'small' | 'medium' | 'large';
  themeMode: ThemeMode;
}

export const FileGrid: React.FC<FileGridProps> = ({
  files,
  selectedIds,
  onSelectFile,
  onOpenItem,
  onContextMenu,
  onToggleStar,
  onDropOnFolder,
  iconScale,
  themeMode,
}) => {
  const isDark = themeMode === 'dark' || themeMode === 'aubergine';

  const folderSizeMap: Record<'small' | 'medium' | 'large', number> = {
    small: 52,
    medium: 68,
    large: 88,
  };

  const currentFolderSize = folderSizeMap[iconScale];

  const handleDragStart = (e: React.DragEvent, file: FileItem) => {
    e.dataTransfer.setData('text/plain', file.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetItem: FileItem) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId && targetItem.type === 'folder' && draggedId !== targetItem.id) {
      onDropOnFolder(draggedId, targetItem.id);
    }
  };

  if (files.length === 0) {
    return (
      <div
        id="file-grid-empty"
        className="w-full h-full flex flex-col items-center justify-center text-center p-8 select-none"
      >
        <div className="opacity-40 mb-3">
          <YaruFolder size={80} />
        </div>
        <h3 className="text-base font-semibold text-white/80 mb-1">Folder is Empty</h3>
        <p className="text-xs text-white/50 max-w-sm">
          No files or folders here. You can create a new folder, upload files, or ask Yaru AI.
        </p>
      </div>
    );
  }

  return (
    <div
      id="file-grid-container"
      className="p-4 grid gap-3 auto-rows-max"
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${
          iconScale === 'small' ? '90px' : iconScale === 'medium' ? '115px' : '145px'
        }, 1fr))`,
      }}
    >
      {files.map((file) => {
        const isSelected = selectedIds.includes(file.id);

        return (
          <div
            key={file.id}
            id={`file-item-${file.id}`}
            draggable
            onDragStart={(e) => handleDragStart(e, file)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, file)}
            onClick={(e) => {
              onSelectFile(file, e.shiftKey || e.ctrlKey || e.metaKey);
            }}
            onDoubleClick={() => onOpenItem(file)}
            onContextMenu={(e) => {
              e.preventDefault();
              onContextMenu(e, file);
            }}
            className={`group relative flex flex-col items-center p-2 rounded-lg cursor-pointer transition-all duration-100 select-none ${
              isSelected
                ? 'bg-[#E95420]/25 ring-1 ring-[#E95420] shadow-sm'
                : isDark
                ? 'hover:bg-white/5'
                : 'hover:bg-black/5'
            }`}
          >
            {/* Top badges: Star and Tag */}
            <div className="w-full flex items-center justify-between px-1 h-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStar(file, e);
                }}
                className={`transition-opacity ${
                  file.isStarred
                    ? 'opacity-100 text-[#FF6309]'
                    : 'opacity-0 group-hover:opacity-60 hover:!opacity-100 text-white/60'
                }`}
                title={file.isStarred ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star
                  size={12}
                  className={file.isStarred ? 'fill-[#FF6309]' : ''}
                />
              </button>

              {file.tag && (
                <span
                  title={`Tag: ${file.tag}`}
                  className="w-2 h-2 rounded-full shadow-xs"
                  style={{
                    backgroundColor:
                      file.tag === 'orange'
                        ? '#E95420'
                        : file.tag === 'purple'
                        ? '#77216F'
                        : file.tag === 'green'
                        ? '#38B44A'
                        : file.tag === 'blue'
                        ? '#19B6EE'
                        : '#EF2929',
                  }}
                />
              )}
            </div>

            {/* Icon */}
            <div className="my-1.5 flex items-center justify-center">
              {file.type === 'folder' ? (
                <YaruFolder
                  size={currentFolderSize}
                  badge={
                    file.name === 'Desktop'
                      ? 'desktop'
                      : file.name === 'Documents'
                      ? 'documents'
                      : file.name === 'Downloads'
                      ? 'downloads'
                      : file.name === 'Music'
                      ? 'music'
                      : file.name === 'Pictures'
                      ? 'pictures'
                      : file.name === 'Videos'
                      ? 'videos'
                      : file.name === 'Projects' || file.name === 'YaruFiles'
                      ? 'projects'
                      : null
                  }
                />
              ) : (
                <YaruFileIcon
                  category={file.category}
                  extension={file.extension}
                  size={currentFolderSize * 0.9}
                />
              )}
            </div>

            {/* File Name */}
            <div className="w-full text-center px-1">
              <span
                className={`text-xs block truncate rounded px-1 font-medium ${
                  isSelected
                    ? 'bg-[#E95420] text-white font-semibold shadow-xs'
                    : isDark
                    ? 'text-white/90 group-hover:text-white'
                    : 'text-[#222222]'
                }`}
                title={file.name}
              >
                {file.name}
              </span>
              <span className="text-[10px] text-white/40 block mt-0.5">
                {file.type === 'folder' ? 'Folder' : formatFileSize(file.size)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
