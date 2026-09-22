import React from 'react';
import {
  FileText,
  FileCode,
  Image as ImageIcon,
  Music,
  Video,
  Archive,
  Terminal,
  File,
  Folder as FolderIcon,
  Home,
  Monitor,
  Download,
  FolderGit2,
} from 'lucide-react';
import { FileCategory } from '../types';

interface YaruFolderProps {
  className?: string;
  badge?: 'home' | 'desktop' | 'documents' | 'downloads' | 'music' | 'pictures' | 'videos' | 'projects' | null;
  size?: number;
}

export const YaruFolder: React.FC<YaruFolderProps> = ({ className = '', badge = null, size = 64 }) => {
  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform duration-150 select-none ${className}`}
      style={{ width: size, height: size * 0.85 }}
    >
      <svg
        viewBox="0 0 100 85"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Back tab gradient */}
          <linearGradient id="folderBackGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#DE4E1B" />
            <stop offset="100%" stop-color="#C23D10" />
          </linearGradient>
          {/* Front body gradient - signature Ubuntu Yaru orange */}
          <linearGradient id="folderFrontGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FF7538" />
            <stop offset="15%" stop-color="#FA6022" />
            <stop offset="70%" stop-color="#E95420" />
            <stop offset="100%" stop-color="#D6410E" />
          </linearGradient>
          {/* Subtle inside page paper */}
          <linearGradient id="paperGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#EAEAEA" />
          </linearGradient>
        </defs>

        {/* Back tab */}
        <path
          d="M 6 12 C 6 8, 9 5, 13 5 L 36 5 C 40 5, 43 8, 46 12 L 50 17 L 88 17 C 92 17, 95 20, 95 24 L 95 72 C 95 76, 92 79, 88 79 L 12 79 C 8 79, 5 76, 5 72 Z"
          fill="url(#folderBackGrad)"
        />

        {/* White inner page peek */}
        <rect
          x="12"
          y="15"
          width="76"
          height="55"
          rx="4"
          fill="url(#paperGrad)"
          opacity="0.9"
        />

        {/* Front flap */}
        <path
          d="M 5 28 C 5 24, 8 22, 12 22 L 88 22 C 92 22, 95 24, 95 28 L 95 73 C 95 77, 92 80, 88 80 L 12 80 C 8 80, 5 77, 5 73 Z"
          fill="url(#folderFrontGrad)"
        />

        {/* Top edge highlight line */}
        <path
          d="M 12 23 L 88 23"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />

        {/* Bottom subtle shadow */}
        <path
          d="M 10 78 L 90 78"
          stroke="rgba(0, 0, 0, 0.25)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>

      {/* Emblem Badge in center of folder */}
      {badge && (
        <div className="absolute inset-0 flex items-center justify-center pt-2 pointer-events-none text-white/90 drop-shadow">
          {badge === 'home' && <Home size={size * 0.3} strokeWidth={2.2} />}
          {badge === 'desktop' && <Monitor size={size * 0.3} strokeWidth={2.2} />}
          {badge === 'documents' && <FileText size={size * 0.3} strokeWidth={2.2} />}
          {badge === 'downloads' && <Download size={size * 0.3} strokeWidth={2.2} />}
          {badge === 'music' && <Music size={size * 0.3} strokeWidth={2.2} />}
          {badge === 'pictures' && <ImageIcon size={size * 0.3} strokeWidth={2.2} />}
          {badge === 'videos' && <Video size={size * 0.3} strokeWidth={2.2} />}
          {badge === 'projects' && <FolderGit2 size={size * 0.3} strokeWidth={2.2} />}
        </div>
      )}
    </div>
  );
};

interface YaruFileIconProps {
  category: FileCategory;
  extension?: string;
  size?: number;
  className?: string;
}

export const YaruFileIcon: React.FC<YaruFileIconProps> = ({
  category,
  extension,
  size = 56,
  className = '',
}) => {
  // Color profiles matching Yaru design specifications
  let accentColor = '#666666';
  let IconComponent = File;

  switch (category) {
    case 'document':
      accentColor = extension === 'pdf' ? '#DC2626' : '#2563EB';
      IconComponent = FileText;
      break;
    case 'code':
      accentColor = '#10B981';
      IconComponent = FileCode;
      break;
    case 'image':
      accentColor = '#8B5CF6';
      IconComponent = ImageIcon;
      break;
    case 'audio':
      accentColor = '#F59E0B';
      IconComponent = Music;
      break;
    case 'video':
      accentColor = '#EC4899';
      IconComponent = Video;
      break;
    case 'archive':
      accentColor = '#F97316';
      IconComponent = Archive;
      break;
    case 'system':
      accentColor = '#E95420';
      IconComponent = Terminal;
      break;
    default:
      accentColor = '#64748B';
      IconComponent = File;
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center transition-transform select-none ${className}`}
      style={{ width: size, height: size * 1.15 }}
    >
      <svg
        viewBox="0 0 75 90"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`fileGrad-${category}-${extension}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#FFFFFF" />
            <stop offset="100%" stop-color="#EDEDED" />
          </linearGradient>
          <linearGradient id={`cornerGrad-${category}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#D4D4D4" />
            <stop offset="100%" stop-color="#A3A3A3" />
          </linearGradient>
        </defs>

        {/* Paper body with folded top-right corner */}
        <path
          d="M 6 8 C 6 4, 9 2, 14 2 L 52 2 L 70 20 L 70 82 C 70 86, 67 88, 62 88 L 14 88 C 9 88, 6 86, 6 82 Z"
          fill={`url(#fileGrad-${category}-${extension})`}
          stroke="#D4D4D4"
          strokeWidth="1"
        />

        {/* Folded top-right triangle */}
        <path
          d="M 52 2 L 52 18 C 52 20, 54 20, 56 20 L 70 20 Z"
          fill={`url(#cornerGrad-${category})`}
        />

        {/* Subtle bottom shadow line */}
        <path
          d="M 12 85 L 64 85"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth="2"
        />
      </svg>

      {/* Main icon inside */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center pt-2"
        style={{ color: accentColor }}
      >
        <IconComponent size={size * 0.42} strokeWidth={2} />
        {extension && (
          <span
            className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 mt-1 rounded text-white shadow-xs max-w-[50px] truncate"
            style={{ backgroundColor: accentColor }}
          >
            {extension.slice(0, 4)}
          </span>
        )}
      </div>
    </div>
  );
};
