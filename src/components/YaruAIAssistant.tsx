import React, { useState } from 'react';
import {
  Sparkles,
  Zap,
  Brain,
  X,
  Send,
  Loader2,
  Copy,
  Check,
  FileText,
  Clock,
  Code,
  ShieldAlert,
  FolderTree,
} from 'lucide-react';
import { FileItem, AIResponseState, ThemeMode } from '../types';

interface YaruAIAssistantProps {
  selectedFiles: FileItem[];
  currentPath: string;
  onClose: () => void;
  themeMode: ThemeMode;
  initialPrompt?: string;
}

export const YaruAIAssistant: React.FC<YaruAIAssistantProps> = ({
  selectedFiles,
  currentPath,
  onClose,
  themeMode,
  initialPrompt = '',
}) => {
  const [prompt, setPrompt] = useState(initialPrompt);
  const [mode, setMode] = useState<'quick' | 'thinking'>('quick');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<AIResponseState[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isDark = themeMode === 'dark' || themeMode === 'aubergine';

  const quickChips = [
    {
      label: 'Summarize file',
      prompt: 'Provide a concise overview and key highlights of the selected file(s).',
      preferredMode: 'quick' as const,
      icon: FileText,
    },
    {
      label: 'Security & Bug Audit',
      prompt: 'Perform a comprehensive code review, looking for logic bugs, vulnerabilities, and edge cases in the selected code.',
      preferredMode: 'thinking' as const,
      icon: ShieldAlert,
    },
    {
      label: 'Bash Automation Script',
      prompt: 'Write an idempotent Ubuntu bash shell script with proper error checking to manage or back up these files.',
      preferredMode: 'thinking' as const,
      icon: Code,
    },
    {
      label: 'Organize Directory',
      prompt: 'Suggest an optimal Linux directory structure and categorize these files efficiently.',
      preferredMode: 'quick' as const,
      icon: FolderTree,
    },
  ];

  const handleSubmit = async (overridePrompt?: string, overrideMode?: 'quick' | 'thinking') => {
    const textToSubmit = overridePrompt || prompt;
    const activeMode = overrideMode || mode;
    if (!textToSubmit.trim() || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    const startTime = performance.now();

    try {
      const endpoint = activeMode === 'thinking' ? '/api/ai/thinking' : '/api/ai/quick';

      let detailedContext = '';
      if (selectedFiles.length > 0) {
        detailedContext = selectedFiles
          .map((f) => `--- File: ${f.name} (${f.type}) ---\n${f.content || `(binary/no preview, size: ${f.size}B)`}`)
          .join('\n\n');
      }

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: textToSubmit,
          selectedFiles: selectedFiles.map((f) => ({
            id: f.id,
            name: f.name,
            type: f.type,
            size: f.size,
            category: f.category,
          })),
          currentPath,
          detailedContext,
        }),
      });

      const data = await res.json();
      const elapsed = Math.round(performance.now() - startTime);

      if (!res.ok) {
        throw new Error(data.error || data.hint || 'Failed to generate AI response');
      }

      const newEntry: AIResponseState = {
        prompt: textToSubmit,
        response: data.text || 'No response text received.',
        model: activeMode === 'thinking' ? 'gemini-3.1-pro-preview' : 'gemini-3.1-flash-lite',
        mode: activeMode,
        latencyMs: elapsed,
        timestamp: new Date().toLocaleTimeString(),
      };

      setHistory((prev) => [newEntry, ...prev]);
      setPrompt('');
    } catch (err: any) {
      console.error('AI assistant error:', err);
      setErrorMsg(
        err.message ||
          'Connection to AI service failed. Please check your GEMINI_API_KEY in Settings > Secrets.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div
      id="yaru-ai-assistant-drawer"
      className={`w-96 h-full border-l flex flex-col select-none transition-colors shadow-2xl z-30 ${
        isDark
          ? 'bg-[#242424] border-[#383838] text-white'
          : 'bg-[#F9F9F9] border-[#D0D0D0] text-[#222]'
      }`}
    >
      {/* Header */}
      <div className="p-3 bg-gradient-to-r from-[#2C001E] via-[#5E2750] to-[#E95420] text-white flex items-center justify-between border-b border-black/30">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-white/20 backdrop-blur-xs flex items-center justify-center">
            <Sparkles size={16} className="text-[#FF6309]" />
          </div>
          <div>
            <h3 className="text-xs font-bold tracking-wide">Yaru Intelligence</h3>
            <p className="text-[10px] text-white/70">
              {mode === 'quick' ? '⚡ Low-Latency Mode' : '🧠 High Thinking Reasoning'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-white/20 text-white/80 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Model Engine Selector Tabs */}
      <div className="p-2 border-b border-black/10 bg-black/10">
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/20 rounded-lg">
          <button
            id="ai-mode-quick-tab"
            onClick={() => setMode('quick')}
            className={`py-1.5 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              mode === 'quick'
                ? 'bg-[#E95420] text-white shadow-xs font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Zap size={13} className={mode === 'quick' ? 'text-white' : 'text-[#FF6309]'} />
            <span>Fast (Flash Lite)</span>
          </button>

          <button
            id="ai-mode-thinking-tab"
            onClick={() => setMode('thinking')}
            className={`py-1.5 px-2 rounded-md text-xs font-medium flex items-center justify-center gap-1.5 transition-all ${
              mode === 'thinking'
                ? 'bg-gradient-to-r from-[#77216F] to-[#E95420] text-white shadow-xs font-semibold'
                : 'text-white/60 hover:text-white'
            }`}
          >
            <Brain size={13} className={mode === 'thinking' ? 'text-white' : 'text-[#19B6EE]'} />
            <span>Deep Thinking (Pro)</span>
          </button>
        </div>

        <div className="mt-1.5 px-1 text-[10px] text-white/50 flex items-center justify-between">
          <span>
            {mode === 'quick'
              ? 'Model: gemini-3.1-flash-lite (Instant responses)'
              : 'Model: gemini-3.1-pro-preview (Thinking: HIGH)'}
          </span>
        </div>
      </div>

      {/* Selected Context Banner */}
      <div className="px-3 py-1.5 bg-black/15 border-b border-black/10 text-[11px] text-white/70 flex items-center justify-between">
        <span className="truncate">
          Path: <strong className="text-white/90 font-mono">{currentPath}</strong>
        </span>
        {selectedFiles.length > 0 && (
          <span className="px-1.5 py-0.5 rounded bg-[#E95420]/30 text-[#FF6309] font-semibold text-[10px]">
            {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
          </span>
        )}
      </div>

      {/* Action Chips */}
      <div className="p-2 border-b border-black/10 flex flex-wrap gap-1">
        {quickChips.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <button
              key={idx}
              onClick={() => {
                setMode(chip.preferredMode);
                handleSubmit(chip.prompt, chip.preferredMode);
              }}
              className="text-[11px] px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-white/80 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Icon size={12} className="opacity-70 text-[#FF6309]" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Chat / Responses Area */}
      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {errorMsg && (
          <div className="p-3 rounded-lg bg-[#EF2929]/20 border border-[#EF2929]/40 text-[#EF2929] text-xs">
            <div className="font-bold mb-1">AI Request Error:</div>
            <div>{errorMsg}</div>
          </div>
        )}

        {isLoading && (
          <div className="p-4 rounded-xl bg-black/20 border border-white/10 flex flex-col items-center justify-center text-center gap-2">
            <Loader2 size={24} className="animate-spin text-[#E95420]" />
            <div className="text-xs font-semibold text-white/90">
              {mode === 'thinking' ? 'Deep Reasoning in Progress...' : 'Processing Quick Query...'}
            </div>
            <p className="text-[11px] text-white/50 max-w-xs">
              {mode === 'thinking'
                ? 'gemini-3.1-pro-preview with ThinkingLevel.HIGH is analyzing structures, code, and systems logic.'
                : 'gemini-3.1-flash-lite is delivering sub-second response.'}
            </p>
          </div>
        )}

        {history.length === 0 && !isLoading && !errorMsg && (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-white/40">
            <Sparkles size={36} className="text-[#E95420] opacity-40 mb-2" />
            <p className="text-xs font-medium text-white/70 mb-1">
              Ubuntu Yaru Intelligence Ready
            </p>
            <p className="text-[11px] text-white/50 leading-relaxed">
              Ask questions about files, extract code snippets, debug shell scripts, or generate file summaries.
            </p>
          </div>
        )}

        {history.map((item, idx) => (
          <div
            key={idx}
            className="rounded-xl border border-white/10 bg-black/25 overflow-hidden text-xs shadow-sm"
          >
            {/* Prompt header */}
            <div className="px-3 py-2 bg-black/30 border-b border-white/5 flex items-center justify-between">
              <span className="font-semibold text-white/90 truncate mr-2">
                "{item.prompt}"
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono bg-white/10 text-white/70 flex items-center gap-1">
                  <Clock size={10} />
                  {item.latencyMs ? `${(item.latencyMs / 1000).toFixed(2)}s` : item.timestamp}
                </span>
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded font-semibold uppercase ${
                    item.mode === 'thinking'
                      ? 'bg-gradient-to-r from-[#77216F] to-[#E95420] text-white'
                      : 'bg-[#E95420] text-white'
                  }`}
                >
                  {item.mode === 'thinking' ? 'Deep' : 'Fast'}
                </span>
              </div>
            </div>

            {/* Response body */}
            <div className="p-3 text-white/90 leading-relaxed whitespace-pre-wrap select-text font-sans">
              {item.response}
            </div>

            {/* Footer with copy button */}
            <div className="px-3 py-1.5 bg-black/20 border-t border-white/5 flex items-center justify-between text-[10px] text-white/40">
              <span className="font-mono">{item.model}</span>
              <button
                onClick={() => handleCopy(item.response, idx)}
                className="flex items-center gap-1 text-white/70 hover:text-white transition-colors"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check size={11} className="text-[#38B44A]" />
                    <span className="text-[#38B44A]">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={11} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-black/20 bg-black/20">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="relative"
        >
          <textarea
            id="yaru-ai-input"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={
              mode === 'thinking'
                ? 'Ask a complex reasoning or code query...'
                : 'Ask a quick file question...'
            }
            rows={2}
            className={`w-full p-2.5 pr-10 text-xs rounded-xl border outline-none resize-none focus:ring-1 focus:ring-[#E95420] select-text ${
              isDark
                ? 'bg-[#181818] border-[#444] text-white placeholder-white/40'
                : 'bg-white border-[#CCC] text-black placeholder-black/40'
            }`}
          />
          <button
            type="submit"
            disabled={!prompt.trim() || isLoading}
            className="absolute right-2.5 bottom-3.5 p-1.5 rounded-lg bg-[#E95420] hover:bg-[#FF6309] disabled:opacity-30 disabled:hover:bg-[#E95420] text-white transition-all shadow-xs"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          </button>
        </form>
        <div className="mt-1 flex items-center justify-between text-[10px] text-white/40">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{mode === 'thinking' ? 'High Thinking' : 'Low Latency'}</span>
        </div>
      </div>
    </div>
  );
};
