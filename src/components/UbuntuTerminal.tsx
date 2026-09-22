import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, X, Maximize2, Minimize2, Trash2 } from 'lucide-react';
import { FileItem } from '../types';
import { formatFileSize } from '../utils/fileHelpers';

interface UbuntuTerminalProps {
  currentPath: string;
  files: FileItem[];
  allFiles: FileItem[];
  onNavigate: (folderId: string) => void;
  onCreateFile: (name: string, content?: string) => void;
  onCreateFolder: (name: string) => void;
  onDeleteFile: (fileId: string) => void;
  onAskAI: (prompt: string) => void;
  onClose: () => void;
}

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
}

export const UbuntuTerminal: React.FC<UbuntuTerminalProps> = ({
  currentPath,
  files,
  allFiles,
  onNavigate,
  onCreateFile,
  onCreateFolder,
  onDeleteFile,
  onAskAI,
  onClose,
}) => {
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'uname -a',
      output: (
        <span className="text-white/80">
          Linux noble-numbat 6.8.0-24-generic #24-Ubuntu SMP PREEMPT_DYNAMIC x86_64 GNU/Linux
        </span>
      ),
    },
    {
      command: 'echo "Type \'help\' to see available bash commands or \'ai <prompt>\'"',
      output: (
        <span className="text-[#38B44A]">
          Type 'help' to see available bash commands or 'ai &lt;prompt&gt;'
        </span>
      ),
    },
  ]);
  const [currentInput, setCurrentInput] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    let output: React.ReactNode = null;

    switch (cmd) {
      case 'help':
        output = (
          <div className="space-y-1 text-white/80 font-mono text-xs">
            <div>Ubuntu Yaru Shell Commands:</div>
            <div>• <span className="text-[#4AF626]">ls / ll / ls -la</span> - List directory contents</div>
            <div>• <span className="text-[#4AF626]">cd &lt;dir&gt;</span> - Change directory (e.g. cd Documents, cd ..)</div>
            <div>• <span className="text-[#4AF626]">pwd</span> - Print working directory</div>
            <div>• <span className="text-[#4AF626]">cat &lt;file&gt;</span> - Output file contents</div>
            <div>• <span className="text-[#4AF626]">mkdir &lt;name&gt;</span> - Create new directory</div>
            <div>• <span className="text-[#4AF626]">touch &lt;file&gt;</span> - Create new empty file</div>
            <div>• <span className="text-[#4AF626]">rm &lt;file&gt;</span> - Remove file</div>
            <div>• <span className="text-[#4AF626]">neofetch</span> - Show Ubuntu system specifications</div>
            <div>• <span className="text-[#4AF626]">ai &lt;question&gt;</span> - Query Yaru Gemini AI assistant</div>
            <div>• <span className="text-[#4AF626]">clear</span> - Clear screen</div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        return;

      case 'pwd':
        output = <div className="text-white/90">{currentPath}</div>;
        break;

      case 'whoami':
        output = <div className="text-[#4AF626]">ubuntu</div>;
        break;

      case 'date':
        output = <div className="text-white/90">{new Date().toUTCString()}</div>;
        break;

      case 'ls':
      case 'll':
      case 'dir': {
        const isLong = cmd === 'll' || args.includes('-l') || args.includes('-la');
        if (files.length === 0) {
          output = <div className="text-white/40">(empty directory)</div>;
        } else if (isLong) {
          output = (
            <div className="font-mono text-xs space-y-0.5">
              <div className="text-white/50">total {files.length * 4}</div>
              {files.map((f) => (
                <div key={f.id} className="flex gap-4">
                  <span className="text-white/50">{f.permissions}</span>
                  <span className="text-white/50">{f.owner}</span>
                  <span className="text-white/50">{f.group}</span>
                  <span className="text-right w-16 text-white/70">
                    {f.type === 'folder' ? '4096' : f.size}
                  </span>
                  <span
                    className={
                      f.type === 'folder'
                        ? 'text-[#19B6EE] font-bold'
                        : f.category === 'code'
                        ? 'text-[#4AF626]'
                        : 'text-white'
                    }
                  >
                    {f.name}
                  </span>
                </div>
              ))}
            </div>
          );
        } else {
          output = (
            <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-xs">
              {files.map((f) => (
                <span
                  key={f.id}
                  className={
                    f.type === 'folder'
                      ? 'text-[#19B6EE] font-bold'
                      : f.category === 'code'
                      ? 'text-[#4AF626]'
                      : 'text-white'
                  }
                >
                  {f.name}
                </span>
              ))}
            </div>
          );
        }
        break;
      }

      case 'cd': {
        const target = args[0];
        if (!target || target === '~' || target === '/home/ubuntu') {
          onNavigate('home');
          output = null;
        } else if (target === '..') {
          onNavigate('home');
          output = null;
        } else {
          const match = files.find(
            (f) => f.type === 'folder' && f.name.toLowerCase() === target.toLowerCase()
          );
          if (match) {
            onNavigate(match.id);
            output = null;
          } else {
            output = (
              <span className="text-[#EF2929]">
                bash: cd: {target}: No such file or directory
              </span>
            );
          }
        }
        break;
      }

      case 'cat': {
        const filename = args[0];
        if (!filename) {
          output = <span className="text-[#EF2929]">cat: missing file operand</span>;
        } else {
          const target = files.find(
            (f) => f.name.toLowerCase() === filename.toLowerCase()
          );
          if (!target) {
            output = (
              <span className="text-[#EF2929]">
                cat: {filename}: No such file or directory
              </span>
            );
          } else if (target.type === 'folder') {
            output = (
              <span className="text-[#EF2929]">cat: {filename}: Is a directory</span>
            );
          } else {
            output = (
              <div className="whitespace-pre-wrap text-white/90 font-mono text-xs bg-black/30 p-2 rounded border border-white/5">
                {target.content || `[Binary stream: ${target.name} (${formatFileSize(target.size)})]`}
              </div>
            );
          }
        }
        break;
      }

      case 'mkdir': {
        const name = args[0];
        if (!name) {
          output = <span className="text-[#EF2929]">mkdir: missing operand</span>;
        } else {
          onCreateFolder(name);
          output = <span className="text-[#38B44A]">Created directory: {name}</span>;
        }
        break;
      }

      case 'touch': {
        const name = args[0];
        if (!name) {
          output = <span className="text-[#EF2929]">touch: missing file operand</span>;
        } else {
          onCreateFile(name, '');
          output = <span className="text-[#38B44A]">Created file: {name}</span>;
        }
        break;
      }

      case 'rm': {
        const name = args[0];
        const match = files.find(
          (f) => f.name.toLowerCase() === name?.toLowerCase()
        );
        if (!match) {
          output = (
            <span className="text-[#EF2929]">
              rm: cannot remove '{name}': No such file or directory
            </span>
          );
        } else {
          onDeleteFile(match.id);
          output = <span className="text-[#E95420]">Removed '{name}'</span>;
        }
        break;
      }

      case 'neofetch':
        output = (
          <div className="flex gap-4 font-mono text-xs py-1">
            <div className="text-[#E95420] font-bold leading-tight select-none">
              <pre>{`         _
     ---(_)
 _/  ---  \\
(_) |   |
  \\  --- _/
     ---(_)
`}</pre>
            </div>
            <div className="space-y-0.5">
              <div>
                <span className="text-[#4AF626] font-bold">ubuntu</span>
                <span className="text-white/60">@</span>
                <span className="text-[#4AF626] font-bold">noble-numbat</span>
              </div>
              <div className="text-white/40">---------------------</div>
              <div><span className="text-[#E95420] font-bold">OS:</span> Ubuntu 24.04 LTS (Noble Numbat) x86_64</div>
              <div><span className="text-[#E95420] font-bold">Host:</span> AI Studio Cloud Run Container</div>
              <div><span className="text-[#E95420] font-bold">Kernel:</span> 6.8.0-24-generic</div>
              <div><span className="text-[#E95420] font-bold">DE:</span> GNOME 46.0 (Yaru Suite)</div>
              <div><span className="text-[#E95420] font-bold">Theme:</span> Yaru-Aubergine-Dark [GTK3/4]</div>
              <div><span className="text-[#E95420] font-bold">Icons:</span> Yaru [GTK3/4]</div>
              <div><span className="text-[#E95420] font-bold">Terminal:</span> gnome-terminal</div>
              <div><span className="text-[#E95420] font-bold">AI Models:</span> Gemini 3.1 Flash Lite &amp; Pro Preview</div>
            </div>
          </div>
        );
        break;

      case 'ai': {
        const query = args.join(' ');
        if (!query) {
          output = <span className="text-[#EF2929]">ai: missing prompt query</span>;
        } else {
          onAskAI(query);
          output = (
            <span className="text-[#FF6309]">
              Sent query to Yaru AI Assistant: "{query}"
            </span>
          );
        }
        break;
      }

      default:
        output = (
          <span className="text-[#EF2929]">
            bash: {cmd}: command not found. Type 'help' for available commands.
          </span>
        );
    }

    setHistory((prev) => [...prev, { command: trimmed, output }]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommand(currentInput);
      setCurrentInput('');
    }
  };

  return (
    <div
      id="ubuntu-terminal-drawer"
      className={`border-t border-[#5E2750] bg-[#300A24] text-white font-mono flex flex-col transition-all duration-150 select-text ${
        isExpanded ? 'h-96' : 'h-56'
      }`}
    >
      {/* Terminal Titlebar */}
      <div className="h-8 px-3 bg-[#24051B] border-b border-[#5E2750] flex items-center justify-between select-none text-xs text-white/80">
        <div className="flex items-center gap-2">
          <TerminalIcon size={14} className="text-[#4AF626]" />
          <span className="font-semibold text-white">ubuntu@noble-numbat: {currentPath}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setHistory([])}
            title="Clear Terminal"
            className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            <Trash2 size={13} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? 'Contract terminal' : 'Expand terminal'}
            className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          </button>
          <button
            onClick={onClose}
            title="Close Terminal (Ctrl+`)"
            className="p-1 rounded hover:bg-[#E95420] text-white/60 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Terminal Content Scroll */}
      <div
        className="flex-1 p-3 overflow-y-auto space-y-2 text-xs leading-relaxed"
        onClick={() => inputRef.current?.focus()}
      >
        {history.map((item, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#4AF626] font-bold">ubuntu@noble-numbat</span>
              <span className="text-white/60">:</span>
              <span className="text-[#19B6EE] font-bold">{currentPath}</span>
              <span className="text-white/60">$</span>
              <span className="text-white font-bold ml-1">{item.command}</span>
            </div>
            {item.output && <div className="pl-4">{item.output}</div>}
          </div>
        ))}

        {/* Active Command Input Line */}
        <div className="flex items-center gap-1.5 flex-wrap pt-1">
          <span className="text-[#4AF626] font-bold">ubuntu@noble-numbat</span>
          <span className="text-white/60">:</span>
          <span className="text-[#19B6EE] font-bold">{currentPath}</span>
          <span className="text-white/60">$</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none outline-none font-mono text-xs text-white pl-1 min-w-[200px]"
            autoFocus
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
