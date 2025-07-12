import React from 'react';
import { Code2, Github, Play, Square } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { authenticateGitHub } from '../services/api';

export const Header: React.FC = () => {
  const { isRunning, setIsRunning, githubToken, setGithubToken } = useProjectStore();

  const handleRunProject = async () => {
    if (isRunning) {
      setIsRunning(false);
      // Stop the dev server
    } else {
      setIsRunning(true);
      // Start the dev server
      try {
        // This would integrate with WebContainer
        console.log('Starting dev server...');
      } catch (error) {
        console.error('Failed to start dev server:', error);
        setIsRunning(false);
      }
    }
  };

  const handleGitHubAuth = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (clientId) {
      authenticateGitHub(clientId);
    } else {
      console.error('GitHub Client ID not configured');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Code2 className="w-8 h-8 text-primary-500" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">HatchMate-Code</h1>
              <p className="text-sm text-gray-500">Code. Collaborate. Commit.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleRunProject}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              isRunning
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-green-500 hover:bg-green-600 text-white'
            }`}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4" />
                <span>Stop</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Run</span>
              </>
            )}
          </button>

          <button
            onClick={handleGitHubAuth}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
              githubToken
                ? 'bg-gray-200 text-gray-800'
                : 'bg-gray-900 hover:bg-gray-800 text-white'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>{githubToken ? 'Connected' : 'Connect GitHub'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};