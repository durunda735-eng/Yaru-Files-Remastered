import React from 'react';
import { Star, ArrowUpDown } from 'lucide-react';
import { FileItem, SortField, SortOrder, ThemeMode } from '../types';
import { YaruFolder, YaruFileIcon } from './YaruIcons';
import { formatFileSize, formatDate } from '../utils/fileHelpers';

interface FileListProps {
  files: FileItem[];
  selectedIds: string[];
  onSelectFile: (file: FileItem, isMulti: boolean) => void;
  onOpenItem: (file: FileItem) => void;
  onContextMenu: (e: React.MouseEvent, file: FileItem) => void;
  onToggleStar: (file: FileItem, e: React.MouseEvent) => void;
  onDropOnFolder: (draggedId: string, targetFolderId: string) => void;
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  themeMode: ThemeMode;
}

export const FileList: React.FC<FileListProps> = ({
  files,
  selectedIds,
  onSelectFile,
  onOpenItem,
  onContextMenu,
  onToggleStar,
  onDropOnFolder,
  sortField,
  sortOrder,
  onSortChange,
  themeMode,
}) => {
  const isDark = themeMode === 'dark' || themeMode === 'aubergine';

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
        id="file-list-empty"
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
    <div id="file-list-container" className="w-full h-full overflow-x-auto select-none">
      <table className="w-full text-left border-collapse text-xs">
        {/* Table Header */}
        <thead
          className={`sticky top-0 z-10 border-b ${
            isDark
              ? 'bg-[#222222] border-[#383838] text-white/60'
              : 'bg-[#EDEDED] border-[#D0D0D0] text-[#555]'
          }`}
        >
          <tr>
            <th className="py-2 px-3 w-8 font-medium"></th>
            <th
              onClick={() => onSortChange('name')}
              className="py-2 px-3 font-semibold cursor-pointer hover:text-white"
            >
              <span className="flex items-center gap-1.5">
                <span>Name</span>
                {sortField === 'name' && (
                  <ArrowUpDown size={12} className="text-[#E95420]" />
                )}
              </span>
            </th>
            <th
              onClick={() => onSortChange('size')}
              className="py-2 px-3 font-semibold w-28 cursor-pointer hover:text-white"
            >
              <span className="flex items-center gap-1.5">
                <span>Size</span>
                {sortField === 'size' && (
                  <ArrowUpDown size={12} className="text-[#E95420]" />
                )}
              </span>
            </th>
            <th
              onClick={() => onSortChange('category')}
              className="py-2 px-3 font-semibold w-32 cursor-pointer hover:text-white hidden md:table-cell"
            >
              <span className="flex items-center gap-1.5">
                <span>Type</span>
                {sortField === 'category' && (
                  <ArrowUpDown size={12} className="text-[#E95420]" />
                )}
              </span>
            </th>
            <th
              onClick={() => onSortChange('modified')}
              className="py-2 px-3 font-semibold w-40 cursor-pointer hover:text-white"
            >
              <span className="flex items-center gap-1.5">
                <span>Modified</span>
                {sortField === 'modified' && (
                  <ArrowUpDown size={12} className="text-[#E95420]" />
                )}
              </span>
            </th>
            <th className="py-2 px-3 font-semibold w-28 hidden lg:table-cell">
              Permissions
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {files.map((file) => {
            const isSelected = selectedIds.includes(file.id);

            return (
              <tr
                key={file.id}
                id={`file-row-${file.id}`}
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
                className={`border-b transition-colors cursor-pointer group ${
                  isSelected
                    ? 'bg-[#E95420]/25 text-white font-medium'
                    : isDark
                    ? 'border-[#2C2C2C] hover:bg-white/5 text-white/80'
                    : 'border-[#E5E5E5] hover:bg-black/5 text-[#222]'
                }`}
              >
                {/* Star icon */}
                <td className="py-1.5 px-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleStar(file, e);
                    }}
                    className={`transition-opacity ${
                      file.isStarred
                        ? 'opacity-100 text-[#FF6309]'
                        : 'opacity-0 group-hover:opacity-60 text-white/50'
                    }`}
                  >
                    <Star
                      size={13}
                      className={file.isStarred ? 'fill-[#FF6309]' : ''}
                    />
                  </button>
                </td>

                {/* Name & Icon */}
                <td className="py-1.5 px-3">
                  <div className="flex items-center gap-2.5">
                    {file.type === 'folder' ? (
                      <YaruFolder size={24} />
                    ) : (
                      <YaruFileIcon
                        category={file.category}
                        extension={file.extension}
                        size={22}
                      />
                    )}
                    <span className="font-medium truncate max-w-sm">
                      {file.name}
                    </span>
                    {file.tag && (
                      <span
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
                </td>

                {/* Size */}
                <td className="py-1.5 px-3 text-white/60">
                  {file.type === 'folder' ? '—' : formatFileSize(file.size)}
                </td>

                {/* Type */}
                <td className="py-1.5 px-3 text-white/60 capitalize hidden md:table-cell">
                  {file.type === 'folder'
                    ? 'Folder'
                    : `${file.extension ? file.extension.toUpperCase() + ' ' : ''}${file.category}`}
                </td>

                {/* Modified */}
                <td className="py-1.5 px-3 text-white/60">
                  {formatDate(file.modified)}
                </td>

                {/* Permissions */}
                <td className="py-1.5 px-3 font-mono text-[11px] text-white/50 hidden lg:table-cell">
                  {file.permissions}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
