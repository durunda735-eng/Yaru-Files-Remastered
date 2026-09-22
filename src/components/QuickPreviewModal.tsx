import React, { useState } from 'react';
import {
  X,
  Download,
  Sparkles,
  FileText,
  Volume2,
  Calendar,
  HardDrive,
  Copy,
  Check,
} from 'lucide-react';
import { FileItem, ThemeMode } from '../types';
import { YaruFileIcon } from './YaruIcons';
import { formatFileSize, formatDate, downloadFileContent } from '../utils/fileHelpers';

interface QuickPreviewModalProps {
  file: FileItem | null;
  onClose: () => void;
  onAskAI: (file: FileItem) => void;
  themeMode: ThemeMode;
}

export const QuickPreviewModal: React.FC<QuickPreviewModalProps> = ({
  file,
  onClose,
  onAskAI,
  themeMode,
}) => {
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!file) return null;

  const isDark = themeMode === 'dark' || themeMode === 'aubergine';

  const handleCopyContent = () => {
    if (file.content) {
      navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const renderContent = () => {
    if (file.category === 'image' && file.content && file.extension === 'svg') {
      return (
        <div className="w-full flex flex-col items-center justify-center p-6 bg-black/30 rounded-lg min-h-[300px]">
          <div
            className="w-full max-h-[380px] flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: file.content }}
          />
        </div>
      );
    }

    if (file.category === 'audio') {
      return (
        <div className="w-full p-8 flex flex-col items-center justify-center bg-black/30 rounded-lg">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#77216F] to-[#E95420] flex items-center justify-center text-white mb-4 shadow-lg animate-pulse">
            <Volume2 size={36} />
          </div>
          <h4 className="text-base font-semibold text-white mb-1">{file.name}</h4>
          <p className="text-xs text-white/50 mb-4">{formatFileSize(file.size)} • Audio Track</p>
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="px-6 py-2 rounded-full bg-[#E95420] hover:bg-[#FF6309] text-white text-xs font-semibold shadow-md transition-colors"
          >
            {isPlayingAudio ? 'Pause Sound' : 'Play Sound Simulation'}
          </button>
        </div>
      );
    }

    if (file.category === 'code' || file.category === 'document') {
      const content = file.content || 'File content unavailable for direct preview.';
      const lines = content.split('\n');

      return (
        <div className="w-full border border-black/20 rounded-lg overflow-hidden bg-[#1E1E1E]">
          <div className="flex items-center justify-between px-3 py-1.5 bg-[#262626] border-b border-[#383838] text-xs text-white/60">
            <span>{lines.length} lines • {file.extension?.toUpperCase() || 'Text'}</span>
            <button
              onClick={handleCopyContent}
              className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-white/10 text-white/80 transition-colors"
            >
              {copied ? <Check size={12} className="text-[#38B44A]" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <div className="p-3 font-mono text-xs overflow-x-auto max-h-[360px] text-white/90 leading-relaxed">
            {lines.map((line, idx) => (
              <div key={idx} className="flex">
                <span className="w-8 select-none text-right pr-3 text-white/30 font-mono">
                  {idx + 1}
                </span>
                <span className="flex-1 whitespace-pre">{line}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className="w-full p-8 flex flex-col items-center justify-center bg-black/20 rounded-lg text-center">
        <YaruFileIcon category={file.category} extension={file.extension} size={72} />
        <h4 className="text-sm font-semibold text-white/90 mt-3">{file.name}</h4>
        <p className="text-xs text-white/50 mt-1 max-w-xs">
          Binary or packaged file format. You can download it directly or ask Yaru AI to examine its purpose.
        </p>
      </div>
    );
  };

  return (
    <div
      id="quick-preview-modal-overlay"
      className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        id="quick-preview-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-2xl rounded-xl shadow-2xl border flex flex-col overflow-hidden animate-in zoom-in-95 duration-150 ${
          isDark ? 'bg-[#2B2B2B] border-[#444444] text-white' : 'bg-white border-[#D0D0D0] text-[#222]'
        }`}
      >
        {/* Header Bar */}
        <div className="h-12 px-4 flex items-center justify-between border-b border-black/20 bg-black/10 select-none">
          <div className="flex items-center gap-2.5 truncate">
            <YaruFileIcon category={file.category} extension={file.extension} size={22} />
            <h3 className="text-sm font-semibold truncate">{file.name}</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-mono">
              {formatFileSize(file.size)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAskAI(file)}
              className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-[#77216F] to-[#E95420] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:brightness-110 transition-all"
            >
              <Sparkles size={13} />
              <span>Ask AI</span>
            </button>

            <button
              onClick={() => downloadFileContent(file)}
              title="Download file"
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70"
            >
              <Download size={16} />
            </button>

            <button
              onClick={onClose}
              title="Close (Esc)"
              className="p-1.5 rounded-lg hover:bg-[#E95420] hover:text-white transition-colors text-white/70"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="p-4 flex-1 overflow-y-auto">
          {renderContent()}
        </div>

        {/* Footer Metadata */}
        <div className="px-4 py-2.5 bg-black/20 border-t border-black/20 flex flex-wrap items-center justify-between text-xs text-white/60">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar size={13} className="opacity-70" />
              <span>Modified: {formatDate(file.modified)}</span>
            </span>
            <span className="font-mono text-[11px]">
              Perms: {file.permissions} ({file.owner}:{file.group})
            </span>
          </div>
          <span className="font-mono text-[11px] opacity-50">
            {file.mimeType || 'application/octet-stream'}
          </span>
        </div>
      </div>
    </div>
  );
};
