import { FileCategory, FileItem, SortField, SortOrder, BreadcrumbItem } from '../types';

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function getFileCategory(filename: string, isFolder: boolean): FileCategory {
  if (isFolder) return 'folder';
  const ext = filename.split('.').pop()?.toLowerCase();
  if (!ext) return 'generic';

  switch (ext) {
    case 'pdf':
    case 'txt':
    case 'md':
    case 'csv':
    case 'doc':
    case 'docx':
    case 'odt':
    case 'log':
      return 'document';
    case 'js':
    case 'ts':
    case 'jsx':
    case 'tsx':
    case 'py':
    case 'sh':
    case 'html':
    case 'css':
    case 'json':
    case 'yml':
    case 'yaml':
    case 'sql':
    case 'conf':
      return 'code';
    case 'png':
    case 'jpg':
    case 'jpeg':
    case 'svg':
    case 'gif':
    case 'webp':
      return 'image';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
    case 'm4a':
      return 'audio';
    case 'mp4':
    case 'webm':
    case 'mkv':
    case 'mov':
      return 'video';
    case 'zip':
    case 'tar':
    case 'gz':
    case 'bz2':
    case 'xz':
    case '7z':
    case 'rar':
      return 'archive';
    case 'deb':
    case 'desktop':
    case 'bin':
      return 'system';
    default:
      return 'generic';
  }
}

export const detectCategory = (filename: string): FileCategory => {
  return getFileCategory(filename, false);
};

export function getTagColorClass(tag?: string | null): string {
  switch (tag) {
    case 'orange':
      return 'bg-[#E95420] text-white';
    case 'purple':
      return 'bg-[#77216F] text-white';
    case 'green':
      return 'bg-[#38B44A] text-white';
    case 'blue':
      return 'bg-[#19B6EE] text-white';
    case 'red':
      return 'bg-[#EF2929] text-white';
    default:
      return '';
  }
}

export function downloadFileContent(file: FileItem) {
  const content = file.content || `Binary file: ${file.name} (${formatFileSize(file.size)})`;
  const blob = new Blob([content], { type: file.mimeType || 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateId(): string {
  return 'file-' + Math.random().toString(36).substring(2, 10);
}

export function sortFiles(files: FileItem[], field: SortField, order: SortOrder): FileItem[] {
  return [...files].sort((a, b) => {
    // Keep folders grouped on top
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;

    let comparison = 0;
    switch (field) {
      case 'name':
        comparison = a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'modified':
        comparison = new Date(a.modified).getTime() - new Date(b.modified).getTime();
        break;
      case 'category':
        comparison = a.category.localeCompare(b.category);
        break;
      default:
        comparison = 0;
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

export interface FilterOptions {
  searchQuery?: string;
  showHidden?: boolean;
  filterType?: 'none' | 'starred' | string;
}

export function filterFiles(
  files: FileItem[],
  optionsOrQuery: FilterOptions | string,
  maybeShowHidden?: boolean
): FileItem[] {
  let query = '';
  let showHidden = false;
  let filterType = 'none';

  if (typeof optionsOrQuery === 'string') {
    query = optionsOrQuery;
    showHidden = !!maybeShowHidden;
  } else {
    query = optionsOrQuery.searchQuery || '';
    showHidden = !!optionsOrQuery.showHidden;
    filterType = optionsOrQuery.filterType || 'none';
  }

  return files.filter((f) => {
    // Hidden files filter
    if (!showHidden && (f.isHidden || f.name.startsWith('.'))) {
      return false;
    }

    // Starred or Tag filter
    if (filterType === 'starred' && !f.isStarred) {
      return false;
    }
    if (
      filterType !== 'none' &&
      filterType !== 'starred' &&
      f.tag !== filterType
    ) {
      return false;
    }

    // Search query filter
    if (query.trim()) {
      const q = query.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        (f.extension && f.extension.toLowerCase().includes(q)) ||
        (f.category && f.category.toLowerCase().includes(q))
      );
    }
    return true;
  });
}

export function getBreadcrumbs(currentFolderId: string, allFiles: FileItem[]): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [];

  if (currentFolderId === 'trash') {
    return [
      { id: 'home', name: 'Home', path: '/home/ubuntu' },
      { id: 'trash', name: 'Trash', path: '/home/ubuntu/.local/share/Trash' },
    ];
  }

  let curr: FileItem | undefined = allFiles.find((f) => f.id === currentFolderId);
  const pathItems: { id: string; name: string }[] = [];

  while (curr) {
    pathItems.unshift({ id: curr.id, name: curr.name });
    if (curr.parentId === 'home' || curr.parentId === 'root' || !curr.parentId) {
      break;
    }
    curr = allFiles.find((f) => f.id === curr?.parentId);
  }

  crumbs.push({ id: 'home', name: 'Home', path: '/home/ubuntu' });

  let accPath = '/home/ubuntu';
  pathItems.forEach((item) => {
    if (item.id !== 'home') {
      accPath += `/${item.name}`;
      crumbs.push({ id: item.id, name: item.name, path: accPath });
    }
  });

  return crumbs;
}

export const buildBreadcrumbs = getBreadcrumbs;

export function getPathForFolder(folderId: string, allFiles: FileItem[]): string {
  const crumbs = getBreadcrumbs(folderId, allFiles);
  return crumbs[crumbs.length - 1]?.path || '/home/ubuntu';
}

export const resolveFolderPath = getPathForFolder;
