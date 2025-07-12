import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { FileExplorer } from './components/FileExplorer';
import { CodeEditor } from './components/CodeEditor';
import { Preview } from './components/Preview';
import { Terminal } from './components/Terminal';
import { ChatPanel } from './components/ChatPanel';
import { useProjectStore } from './store/useProjectStore';

function App() {
  const { setGithubToken } = useProjectStore();

  useEffect(() => {
    // Check for GitHub OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    
    if (code) {
      // Exchange code for token (this would be done via backend)
      console.log('GitHub OAuth code received:', code);
      // For demo purposes, we'll simulate a token
      // In production, this would be handled by the backend
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [setGithubToken]);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <FileExplorer />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <CodeEditor />
            <Preview />
          </div>
          <Terminal />
        </div>
        
        <ChatPanel />
      </div>
    </div>
  );
}

export default App;