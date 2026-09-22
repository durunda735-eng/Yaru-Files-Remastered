import React from 'react';
import {
  Home,
  Monitor,
  FileText,
  Download,
  Music,
  Image as ImageIcon,
  Video,
  FolderGit2,
  Trash2,
  HardDrive,
  Usb,
  Star,
  Tag,
  Circle,
  Share2,
} from 'lucide-react';
import { ThemeMode, ColorTag } from '../types';

interface NautilusSidebarProps {
  currentFolderId: string;
  onSelectFolder: (folderId: string) => void;
  activeFilter: 'none' | 'starred' | ColorTag;
  onSelectFilter: (filter: 'none' | 'starred' | ColorTag) => void;
  themeMode: ThemeMode;
  trashCount: number;
}

export const NautilusSidebar: React.FC<NautilusSidebarProps> = ({
  currentFolderId,
  onSelectFolder,
  activeFilter,
  onSelectFilter,
  themeMode,
  trashCount,
}) => {
  const isDark = themeMode === 'dark' || themeMode === 'aubergine';

  const places = [
    { id: 'home', name: 'Home', icon: Home, badge: null },
    { id: 'folder-desktop', name: 'Desktop', icon: Monitor, badge: null },
    { id: 'folder-documents', name: 'Documents', icon: FileText, badge: null },
    { id: 'folder-downloads', name: 'Downloads', icon: Download, badge: null },
    { id: 'folder-music', name: 'Music', icon: Music, badge: null },
    { id: 'folder-pictures', name: 'Pictures', icon: ImageIcon, badge: null },
    { id: 'folder-videos', name: 'Videos', icon: Video, badge: null },
    { id: 'folder-projects', name: 'Projects', icon: FolderGit2, badge: null },
    { id: 'trash', name: 'Trash', icon: Trash2, badge: trashCount > 0 ? trashCount : null },
  ];

  const tags: { tag: ColorTag; label: string; color: string }[] = [
    { tag: 'orange', label: 'Orange', color: '#E95420' },
    { tag: 'purple', label: 'Ubuntu Purple', color: '#77216F' },
    { tag: 'green', label: 'Green', color: '#38B44A' },
    { tag: 'blue', label: 'Blue', color: '#19B6EE' },
    { tag: 'red', label: 'Red', color: '#EF2929' },
  ];

  return (
    <aside
      id="nautilus-sidebar"
      className={`w-56 h-full flex flex-col justify-between py-2 border-r select-none transition-colors overflow-y-auto ${
        isDark
          ? 'bg-[#222222] border-[#383838] text-white/90'
          : 'bg-[#F2F2F2] border-[#D8D8D8] text-[#333333]'
      }`}
    >
      <div className="space-y-4 px-2">
        {/* Places Section */}
        <div>
          <div className="px-2 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
            Places
          </div>
          <div className="space-y-0.5">
            {places.map((item) => {
              const Icon = item.icon;
              const isSelected = currentFolderId === item.id && activeFilter === 'none';
              return (
                <button
                  key={item.id}
                  id={`sidebar-item-${item.id}`}
                  onClick={() => {
                    onSelectFilter('none');
                    onSelectFolder(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#E95420] text-white shadow-xs font-semibold'
                      : isDark
                      ? 'hover:bg-white/10 active:bg-white/15 text-white/80'
                      : 'hover:bg-black/5 active:bg-black/10 text-[#333]'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    <Icon
                      size={15}
                      className={
                        isSelected
                          ? 'text-white'
                          : item.id === 'trash'
                          ? 'text-[#E95420]'
                          : 'opacity-70'
                      }
                    />
                    <span className="truncate">{item.name}</span>
                  </span>
                  {item.badge !== null && (
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected
                          ? 'bg-black/30 text-white'
                          : 'bg-[#E95420] text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Filters: Starred */}
        <div>
          <div className="px-2 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
            Favorites
          </div>
          <button
            id="sidebar-filter-starred"
            onClick={() => onSelectFilter(activeFilter === 'starred' ? 'none' : 'starred')}
            className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
              activeFilter === 'starred'
                ? 'bg-[#E95420] text-white shadow-xs font-semibold'
                : isDark
                ? 'hover:bg-white/10 text-white/80'
                : 'hover:bg-black/5 text-[#333]'
            }`}
          >
            <Star
              size={15}
              className={
                activeFilter === 'starred' ? 'fill-white text-white' : 'text-[#FF6309] fill-[#FF6309]/30'
              }
            />
            <span>Starred Files</span>
          </button>
        </div>

        {/* Tags Section */}
        <div>
          <div className="px-2 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-wider flex items-center justify-between">
            <span>Tags</span>
            <Tag size={12} className="opacity-50" />
          </div>
          <div className="space-y-0.5">
            {tags.map((t) => {
              const isSelected = activeFilter === t.tag;
              return (
                <button
                  key={t.tag}
                  id={`sidebar-tag-${t.tag}`}
                  onClick={() => onSelectFilter(isSelected ? 'none' : t.tag)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-[#E95420] text-white shadow-xs font-semibold'
                      : isDark
                      ? 'hover:bg-white/10 text-white/80'
                      : 'hover:bg-black/5 text-[#333]'
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Circle
                      size={10}
                      fill={t.color}
                      strokeWidth={0}
                      className="shadow-xs"
                    />
                    <span>{t.label}</span>
                  </span>
                  {isSelected && <span className="text-[10px] opacity-70">Active</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Other Locations */}
        <div>
          <div className="px-2 py-1 text-[11px] font-semibold text-white/40 uppercase tracking-wider">
            Drives & Network
          </div>
          <div className="space-y-0.5 text-xs text-white/70">
            <button
              onClick={() => {
                onSelectFilter('none');
                onSelectFolder('home');
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left"
            >
              <HardDrive size={15} className="opacity-70 text-[#E95420]" />
              <div className="truncate">
                <div className="font-medium text-white/90">Ubuntu 24.04 SSD</div>
                <div className="text-[10px] text-white/40">128 GB Storage</div>
              </div>
            </button>
            <button
              onClick={() => {
                onSelectFilter('none');
                onSelectFolder('folder-downloads');
              }}
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left"
            >
              <Usb size={15} className="opacity-70 text-[#19B6EE]" />
              <div className="truncate">
                <div className="font-medium text-white/90">Ubuntu Live USB</div>
                <div className="text-[10px] text-white/40">32 GB FAT32</div>
              </div>
            </button>
            <button
              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors text-left opacity-60"
            >
              <Share2 size={15} className="opacity-70" />
              <span className="truncate font-medium">Windows Network Share</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Storage Meter */}
      <div className="px-3 pt-3 pb-1 border-t border-white/10 mt-2">
        <div className="flex items-center justify-between text-[11px] mb-1 text-white/60">
          <span>Storage</span>
          <span className="font-medium text-white/90">58.4 GB / 128 GB</span>
        </div>
        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden">
          <div className="h-full bg-[#E95420] rounded-full w-[45%]" />
        </div>
        <div className="text-[10px] text-white/40 mt-1">69.6 GB free on root /</div>
      </div>
    </aside>
  );
};
