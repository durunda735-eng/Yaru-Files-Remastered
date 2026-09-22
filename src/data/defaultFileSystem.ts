import { FileItem } from '../types';

export const INITIAL_FILES: FileItem[] = [
  // Top-level Places in /home/ubuntu
  {
    id: 'folder-desktop',
    name: 'Desktop',
    type: 'folder',
    category: 'folder',
    size: 4096,
    modified: '2026-09-22T08:00:00Z',
    created: '2026-09-01T10:00:00Z',
    permissions: 'drwxr-xr-x',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'home',
  },
  {
    id: 'folder-documents',
    name: 'Documents',
    type: 'folder',
    category: 'folder',
    size: 4096,
    modified: '2026-09-21T14:32:00Z',
    created: '2026-09-01T10:00:00Z',
    permissions: 'drwxr-xr-x',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'home',
  },
  {
    id: 'folder-downloads',
    name: 'Downloads',
    type: 'folder',
    category: 'folder',
    size: 4096,
    modified: '2026-09-22T07:15:00Z',
    created: '2026-09-01T10:00:00Z',
    permissions: 'drwxr-xr-x',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'home',
  },
  {
    id: 'folder-music',
    name: 'Music',
    type: 'folder',
    category: 'folder',
    size: 4096,
    modified: '2026-09-18T19:20:00Z',
    created: '2026-09-01T10:00:00Z',
    permissions: 'drwxr-xr-x',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'home',
  },
  {
    id: 'folder-pictures',
    name: 'Pictures',
    type: 'folder',
    category: 'folder',
    size: 4096,
    modified: '2026-09-20T11:45:00Z',
    created: '2026-09-01T10:00:00Z',
    permissions: 'drwxr-xr-x',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'home',
  },
  {
    id: 'folder-videos',
    name: 'Videos',
    type: 'folder',
    category: 'folder',
    size: 4096,
    modified: '2026-09-15T16:10:00Z',
    created: '2026-09-01T10:00:00Z',
    permissions: 'drwxr-xr-x',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'home',
  },
  {
    id: 'folder-projects',
    name: 'Projects',
    type: 'folder',
    category: 'folder',
    size: 4096,
    modified: '2026-09-22T09:30:00Z',
    created: '2026-09-02T12:00:00Z',
    permissions: 'drwxr-xr-x',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'home',
    isStarred: true,
  },

  // Files in Home Root
  {
    id: 'file-bashrc',
    name: '.bashrc',
    type: 'file',
    category: 'code',
    extension: 'sh',
    size: 3771,
    modified: '2026-09-01T10:00:00Z',
    created: '2026-09-01T10:00:00Z',
    permissions: '-rw-r--r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'home',
    isHidden: true,
    mimeType: 'text/x-shellscript',
    content: `# ~/.bashrc: executed by bash(1) for non-login shells.
export HISTCONTROL=ignoreboth
shopt -s histappend
HISTSIZE=1000
HISTFILESIZE=2000

# Ubuntu Yaru prompt configuration
if [ -n "$force_color_prompt" ]; then
    PS1='\\[\\e]0;\\u@\\h: \\w\\a\\]\\[\\033[01;32m\\]\\u@\\h\\[\\033[00m\\]:\\[\\033[01;34m\\]\\w\\[\\033[00m\\]\\$ '
fi

alias ll='ls -alF'
alias la='ls -A'
alias l='ls -CF'
alias alert='notify-send --urgency=low -i "$([ $? = 0 ] && echo terminal || echo error)" "$(history|tail -n1|sed -e '\''s/^\\s*[0-9]\\+\\s*//;s/[;&|]\\s*alert$//'\'')"'
`,
  },
  {
    id: 'file-welcome-txt',
    name: 'Welcome_to_Ubuntu_Yaru.txt',
    type: 'file',
    category: 'document',
    extension: 'txt',
    size: 1420,
    modified: '2026-09-22T08:12:00Z',
    created: '2026-09-01T10:00:00Z',
    permissions: '-rw-rw-r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'home',
    isStarred: true,
    tag: 'orange',
    mimeType: 'text/plain',
    content: `Welcome to Ubuntu Yaru Files (Nautilus)!
=========================================

This application brings the authentic Ubuntu desktop experience directly to the web, modeled after the signature Yaru GTK design system.

Key Highlights:
- Authentic Yaru Theme: Classic Ubuntu warm aubergine, dark charcoal, and Ubuntu orange (#E95420).
- Dual-Pane Browsing: Press [F3] or click the Dual Pane button to compare folders side by side.
- Quick Look Preview: Tap [Spacebar] or double-click to view markdown, code, images, audio, and documents.
- Integrated Bash Terminal: Press [Ctrl + ~] or click the Terminal icon to launch the live shell with Linux commands.
- Dual-Engine Gemini AI:
  * ⚡ Fast Mode: Low-latency responses powered by gemini-3.1-flash-lite.
  * 🧠 Deep Thinking Mode: High-reasoning analysis powered by gemini-3.1-pro-preview with ThinkingLevel.HIGH.

Enjoy discovering your Ubuntu workspace!
`,
  },

  // Desktop Files
  {
    id: 'file-desktop-readme',
    name: 'Ubuntu-Release-Notes.desktop',
    type: 'file',
    category: 'system',
    extension: 'desktop',
    size: 320,
    modified: '2026-09-20T10:00:00Z',
    created: '2026-09-01T10:00:00Z',
    permissions: '-rwxr-xr-x',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-desktop',
    mimeType: 'application/x-desktop',
    content: `[Desktop Entry]
Version=1.0
Name=Ubuntu Release Notes
Comment=Read what is new in Ubuntu 24.04 LTS
Exec=xdg-open https://discourse.ubuntu.com/t/noble-numbat-release-notes
Icon=ubuntu-logo
Terminal=false
Type=Application
Categories=Documentation;
`,
  },

  // Documents Files
  {
    id: 'file-noble-numbat-md',
    name: 'ubuntu_noble_numbat_guide.md',
    type: 'file',
    category: 'document',
    extension: 'md',
    size: 2840,
    modified: '2026-09-21T18:22:00Z',
    created: '2026-09-05T14:00:00Z',
    permissions: '-rw-rw-r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-documents',
    isStarred: true,
    tag: 'orange',
    mimeType: 'text/markdown',
    content: `# Ubuntu 24.04 LTS: Noble Numbat Architecture

Ubuntu 24.04 LTS (Noble Numbat) represents a milestone in performance, security, and developer ergonomics.

## System Highlights
- **Linux Kernel 6.8**: Enhanced CPU power management and modern hardware enablement.
- **GNOME 46 with Yaru Theme**: Redesigned Nautilus Files with global search, fluid animations, and high DPI icon rendering.
- **Netplan 1.0**: Declarative network configuration default with enhanced YAML schema validation.
- **Security Hardening**: Unprivileged user namespace restrictions, AppArmor 4, and enterprise Active Directory bridging.

## Nautilus Features in Yaru
1. **Interactive Path Bar**: Clickable breadcrumb tabs with quick toggle to raw URI typing.
2. **Integrated Starred & Tagged Items**: Easy access from the left navigation tree.
3. **Hardware Storage Indicators**: Live storage volume gauges.
`,
  },
  {
    id: 'file-quarterly-budget-csv',
    name: 'server_infrastructure_budget.csv',
    type: 'file',
    category: 'document',
    extension: 'csv',
    size: 1150,
    modified: '2026-09-19T11:05:00Z',
    created: '2026-09-10T09:00:00Z',
    permissions: '-rw-r--r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-documents',
    tag: 'green',
    mimeType: 'text/csv',
    content: `Server Name,Region,Cores,RAM (GB),Monthly Cost (USD),Status
noble-app-01,europe-west2,8,32,180.00,Active
noble-db-primary,europe-west2,16,64,360.00,Active
noble-redis-cache,europe-west2,4,16,95.00,Active
storage-bucket-yaru,europe-west2,-,500,25.00,Active
staging-worker-01,europe-west1,4,16,85.00,Standby
backup-cold-archive,europe-north1,-,2000,40.00,Active
`,
  },
  {
    id: 'file-meeting-notes',
    name: 'design_system_review.txt',
    type: 'file',
    category: 'document',
    extension: 'txt',
    size: 890,
    modified: '2026-09-17T15:40:00Z',
    created: '2026-09-17T14:00:00Z',
    permissions: '-rw-rw-r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-documents',
    mimeType: 'text/plain',
    content: `Ubuntu Yaru Design Review Meeting
Date: September 17, 2026
Attendees: Canonical Design Team, Community Contributors

Agenda:
1. Yaru Palette Balance:
   - Primary: Ubuntu Orange (#E95420)
   - Secondary: Dark Aubergine (#2C001E) & Warm Aubergine (#77216F)
   - Neutrals: #1E1E1E dark background, #262626 headerbar
2. Nautilus UX:
   - Keep touch targets at 44px minimum for hybrid laptops.
   - Dual-pane layout is loved by power users.
   - Breadcrumbs must truncate gracefully on narrow views.
`,
  },

  // Downloads Files
  {
    id: 'file-yaru-theme-archive',
    name: 'yaru-theme-24.04.1.tar.gz',
    type: 'file',
    category: 'archive',
    extension: 'tar.gz',
    size: 14258900,
    modified: '2026-09-22T06:40:00Z',
    created: '2026-09-22T06:40:00Z',
    permissions: '-rw-r--r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-downloads',
    tag: 'purple',
    mimeType: 'application/gzip',
  },
  {
    id: 'file-vscode-deb',
    name: 'code_1.94.0-arm64.deb',
    type: 'file',
    category: 'system',
    extension: 'deb',
    size: 98450120,
    modified: '2026-09-20T13:10:00Z',
    created: '2026-09-20T13:10:00Z',
    permissions: '-rw-r--r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-downloads',
    mimeType: 'application/vnd.debian.binary-package',
  },
  {
    id: 'file-wireguard-conf',
    name: 'corporate_vpn.conf',
    type: 'file',
    category: 'code',
    extension: 'conf',
    size: 420,
    modified: '2026-09-18T10:00:00Z',
    created: '2026-09-18T10:00:00Z',
    permissions: '-rw-------',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-downloads',
    mimeType: 'text/plain',
    content: `[Interface]
PrivateKey = aGVsbG93b3JsZGFpc3R1ZGlvc2VjcmV0a2V5MTIzNA==
Address = 10.14.0.5/24
DNS = 1.1.1.1, 8.8.8.8

[Peer]
PublicKey = bm9ibGVudW1iYXR5YXJ1ZmlsZXNhcHBsaWNhdGlvbjA=
Endpoint = vpn.canonical-cloud.internal:51820
AllowedIPs = 10.0.0.0/8, 172.16.0.0/12
PersistentKeepalive = 25
`,
  },

  // Pictures Files
  {
    id: 'file-wallpaper-svg',
    name: 'noble_numbat_canonical.svg',
    type: 'file',
    category: 'image',
    extension: 'svg',
    size: 4520,
    modified: '2026-09-14T12:00:00Z',
    created: '2026-09-14T12:00:00Z',
    permissions: '-rw-rw-r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-pictures',
    isStarred: true,
    tag: 'orange',
    mimeType: 'image/svg+xml',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="100%" height="100%">
  <defs>
    <radialGradient id="ubgrad" cx="70%" cy="30%" r="80%">
      <stop offset="0%" stop-color="#E95420" />
      <stop offset="45%" stop-color="#77216F" />
      <stop offset="85%" stop-color="#2C001E" />
      <stop offset="100%" stop-color="#11000B" />
    </radialGradient>
    <linearGradient id="numhead" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9" />
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0.2" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#ubgrad)" />
  <!-- Stylized Geometric Noble Numbat Mascot -->
  <g transform="translate(240, 140)">
    <circle cx="160" cy="160" r="140" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2" />
    <path d="M 60 200 C 90 120, 160 80, 240 100 C 290 115, 310 160, 290 210 C 270 250, 210 270, 140 250 Z" fill="none" stroke="#FF6309" stroke-width="4" />
    <circle cx="230" cy="140" r="10" fill="#FFFFFF" />
    <path d="M 120 180 L 80 190 M 140 160 L 100 170 M 160 140 L 120 150 M 180 125 L 150 140" stroke="rgba(255,255,255,0.7)" stroke-width="3" stroke-linecap="round" />
  </g>
  <text x="400" y="520" text-anchor="middle" font-family="'Ubuntu', sans-serif" font-size="28" font-weight="700" fill="#FFFFFF" letter-spacing="2">UBUNTU 24.04 LTS</text>
  <text x="400" y="550" text-anchor="middle" font-family="'Ubuntu', sans-serif" font-size="16" fill="rgba(255,255,255,0.7)">Noble Numbat • Yaru Desktop</text>
</svg>`,
  },
  {
    id: 'file-aubergine-art-svg',
    name: 'abstract_yaru_aubergine.svg',
    type: 'file',
    category: 'image',
    extension: 'svg',
    size: 2150,
    modified: '2026-09-12T16:20:00Z',
    created: '2026-09-12T16:20:00Z',
    permissions: '-rw-r--r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-pictures',
    tag: 'purple',
    mimeType: 'image/svg+xml',
    content: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="auberbg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#5E2750" />
      <stop offset="50%" stop-color="#2C001E" />
      <stop offset="100%" stop-color="#14000C" />
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#auberbg)" />
  <circle cx="200" cy="300" r="160" fill="none" stroke="#E95420" stroke-width="3" opacity="0.4" />
  <circle cx="450" cy="220" r="220" fill="none" stroke="#77216F" stroke-width="4" opacity="0.6" />
  <circle cx="600" cy="400" r="140" fill="none" stroke="#FF6309" stroke-width="2" opacity="0.3" />
</svg>`,
  },

  // Music Files
  {
    id: 'file-ubuntu-login-sound',
    name: 'ubuntu_login_chime.mp3',
    type: 'file',
    category: 'audio',
    extension: 'mp3',
    size: 245000,
    modified: '2026-09-01T10:00:00Z',
    created: '2026-09-01T10:00:00Z',
    permissions: '-rw-r--r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-music',
    mimeType: 'audio/mpeg',
  },
  {
    id: 'file-ambient-synth-mp3',
    name: 'noble_calm_ambient.mp3',
    type: 'file',
    category: 'audio',
    extension: 'mp3',
    size: 3820000,
    modified: '2026-09-18T14:15:00Z',
    created: '2026-09-18T14:15:00Z',
    permissions: '-rw-r--r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-music',
    mimeType: 'audio/mpeg',
  },

  // Videos Files
  {
    id: 'file-gnome-tour-mp4',
    name: 'ubuntu_desktop_tour.mp4',
    type: 'file',
    category: 'video',
    extension: 'mp4',
    size: 42100000,
    modified: '2026-09-10T11:20:00Z',
    created: '2026-09-10T11:20:00Z',
    permissions: '-rw-r--r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-videos',
    mimeType: 'video/mp4',
  },

  // Projects / YaruFiles Folder
  {
    id: 'folder-yarufiles-repo',
    name: 'YaruFiles',
    type: 'folder',
    category: 'folder',
    size: 4096,
    modified: '2026-09-22T09:45:00Z',
    created: '2026-09-02T12:00:00Z',
    permissions: 'drwxrwxr-x',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-projects',
    isStarred: true,
    tag: 'orange',
  },
  {
    id: 'file-server-ts',
    name: 'server.ts',
    type: 'file',
    category: 'code',
    extension: 'ts',
    size: 3410,
    modified: '2026-09-22T09:40:00Z',
    created: '2026-09-22T08:00:00Z',
    permissions: '-rw-rw-r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-yarufiles-repo',
    isStarred: true,
    mimeType: 'text/typescript',
    content: `// Ubuntu Yaru Files - Express Full-Stack Server
import express from 'express';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

const app = express();
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Low-latency endpoint
app.post('/api/ai/quick', async (req, res) => {
  const result = await ai.models.generateContent({
    model: 'gemini-3.1-flash-lite',
    contents: req.body.prompt,
  });
  res.json({ text: result.text });
});

// High-thinking endpoint
app.post('/api/ai/thinking', async (req, res) => {
  const result = await ai.models.generateContent({
    model: 'gemini-3.1-pro-preview',
    contents: req.body.prompt,
    config: {
      thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
    }
  });
  res.json({ text: result.text });
});
`,
  },
  {
    id: 'file-docker-compose',
    name: 'docker-compose.yml',
    type: 'file',
    category: 'code',
    extension: 'yml',
    size: 680,
    modified: '2026-09-22T09:10:00Z',
    created: '2026-09-02T12:00:00Z',
    permissions: '-rw-rw-r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-yarufiles-repo',
    mimeType: 'text/yaml',
    content: `version: '3.8'

services:
  yarufiles-app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    volumes:
      - ./data:/app/data
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/api/health"]
      interval: 30s
      timeout: 10s
      retries: 3
`,
  },
  {
    id: 'file-nginx-conf',
    name: 'nginx.conf',
    type: 'file',
    category: 'code',
    extension: 'conf',
    size: 920,
    modified: '2026-09-20T17:30:00Z',
    created: '2026-09-02T12:00:00Z',
    permissions: '-rw-r--r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'folder-yarufiles-repo',
    mimeType: 'text/plain',
    content: `server {
    listen 80;
    server_name files.ubuntu.local;

    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
`,
  },

  // Trash files
  {
    id: 'file-trash-old-kernel',
    name: 'kernel-panic-dump-2026-08.log',
    type: 'file',
    category: 'document',
    extension: 'log',
    size: 89400,
    modified: '2026-08-30T10:00:00Z',
    created: '2026-08-30T10:00:00Z',
    permissions: '-rw-r--r--',
    owner: 'ubuntu',
    group: 'ubuntu',
    parentId: 'trash',
    mimeType: 'text/plain',
    content: `[12345.678901] Linux version 6.8.0-22-generic (buildd@bos02-arm64-001)
[12345.678905] Command line: BOOT_IMAGE=/vmlinuz-6.8.0-22-generic root=UUID=7428... ro quiet splash
[12345.678912] RIP: 0010:test_module_init+0x12/0x30
[12345.678920] Call Trace:
[12345.678925]  do_one_initcall+0x5a/0x2f0
[12345.678930]  do_init_module+0x60/0x240
[12345.678935]  load_module+0x1ef0/0x21c0
`,
  },
];
