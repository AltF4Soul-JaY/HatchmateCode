import { create } from 'zustand';
import { ProjectState, FileNode, ChatMessage } from '../types';

interface ProjectStore extends ProjectState {
  // File management
  setFiles: (files: Record<string, string>) => void;
  updateFile: (path: string, content: string) => void;
  setCurrentFile: (path: string | null) => void;
  
  // Terminal and preview
  setIsRunning: (running: boolean) => void;
  addTerminalOutput: (output: string) => void;
  clearTerminalOutput: () => void;
  setPreviewUrl: (url: string | null) => void;
  
  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  clearChat: () => void;
  
  // GitHub
  githubToken: string | null;
  setGithubToken: (token: string | null) => void;
  
  // File tree helpers
  getFileTree: () => FileNode[];
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // Initial state
  files: {},
  currentFile: null,
  isRunning: false,
  terminalOutput: [],
  previewUrl: null,
  chatMessages: [],
  githubToken: null,

  // File management
  setFiles: (files) => set({ files }),
  
  updateFile: (path, content) => set((state) => ({
    files: { ...state.files, [path]: content }
  })),
  
  setCurrentFile: (path) => set({ currentFile: path }),

  // Terminal and preview
  setIsRunning: (running) => set({ isRunning: running }),
  
  addTerminalOutput: (output) => set((state) => ({
    terminalOutput: [...state.terminalOutput, output]
  })),
  
  clearTerminalOutput: () => set({ terminalOutput: [] }),
  
  setPreviewUrl: (url) => set({ previewUrl: url }),

  // Chat
  addChatMessage: (message) => set((state) => ({
    chatMessages: [...state.chatMessages, {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    }]
  })),
  
  clearChat: () => set({ chatMessages: [] }),

  // GitHub
  setGithubToken: (token) => set({ githubToken: token }),

  // File tree helpers
  getFileTree: () => {
    const { files } = get();
    const tree: FileNode[] = [];
    const pathMap = new Map<string, FileNode>();

    // Sort paths to ensure parent directories are processed first
    const sortedPaths = Object.keys(files).sort();

    for (const path of sortedPaths) {
      const parts = path.split('/');
      let currentPath = '';
      
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        const parentPath = currentPath;
        currentPath = currentPath ? `${currentPath}/${part}` : part;
        
        if (!pathMap.has(currentPath)) {
          const isFile = i === parts.length - 1;
          const node: FileNode = {
            name: part,
            type: isFile ? 'file' : 'folder',
            path: currentPath,
            content: isFile ? files[path] : undefined,
            children: isFile ? undefined : []
          };
          
          pathMap.set(currentPath, node);
          
          if (parentPath) {
            const parent = pathMap.get(parentPath);
            if (parent && parent.children) {
              parent.children.push(node);
            }
          } else {
            tree.push(node);
          }
        }
      }
    }

    return tree;
  }
}));