export interface FileNode {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  children?: FileNode[];
  path: string;
}

export interface ProjectState {
  files: Record<string, string>;
  currentFile: string | null;
  isRunning: boolean;
  terminalOutput: string[];
  previewUrl: string | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface GitHubRepo {
  name: string;
  description?: string;
  private?: boolean;
}

export interface GenerateCodeRequest {
  prompt: string;
  context?: Record<string, string>;
}

export interface GenerateCodeResponse {
  files: Record<string, string>;
  message: string;
}