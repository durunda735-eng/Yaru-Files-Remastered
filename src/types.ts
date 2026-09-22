export type ItemType = 'file' | 'folder';

export type FileCategory =
  | 'folder'
  | 'document'
  | 'code'
  | 'image'
  | 'audio'
  | 'video'
  | 'archive'
  | 'system'
  | 'generic'
  | 'other';

export type ColorTag = 'orange' | 'purple' | 'green' | 'blue' | 'red';

export interface FileItem {
  id: string;
  name: string;
  type: ItemType;
  category: FileCategory;
  extension?: string;
  size: number; // in bytes
  modified: string; // ISO string
  created: string;
  permissions: string; // e.g. "-rw-r--r--" or "drwxr-xr-x"
  owner: string;
  group: string;
  parentId: string; // folder ID or 'root'
  content?: string;
  mimeType?: string;
  isStarred?: boolean;
  tag?: ColorTag | null;
  isProtected?: boolean;
  isHidden?: boolean;
  isInTrash?: boolean;
  thumbnail?: string;
}

export type ViewMode = 'grid' | 'list';
export type SortField = 'name' | 'size' | 'modified' | 'category';
export type SortOrder = 'asc' | 'desc';
export type ThemeMode = 'dark' | 'light' | 'aubergine';
export type AccentColor = 'orange' | 'aubergine' | 'green' | 'blue' | 'magenta';

export interface BreadcrumbItem {
  id: string;
  name: string;
  path: string;
}

export interface ClipboardState {
  items: FileItem[];
  action: 'copy' | 'cut' | null;
}

export interface AIResponseState {
  prompt: string;
  response: string;
  model: 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview';
  mode: 'quick' | 'thinking';
  latencyMs?: number;
  timestamp: string;
}
