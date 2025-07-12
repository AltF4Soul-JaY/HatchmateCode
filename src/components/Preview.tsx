import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';

export const Preview: React.FC = () => {
  const { previewUrl, isRunning } = useProjectStore();

  const handleRefresh = () => {
    // Refresh the iframe
    const iframe = document.getElementById('preview-iframe') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  const handleOpenExternal = () => {
    if (previewUrl) {
      window.open(previewUrl, '_blank');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-900">Preview</span>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            disabled={!previewUrl}
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={handleOpenExternal}
            className="p-1 text-gray-500 hover:text-gray-700 transition-colors"
            disabled={!previewUrl}
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1">
        {isRunning && previewUrl ? (
          <iframe
            id="preview-iframe"
            src={previewUrl}
            className="w-full h-full border-0"
            title="App Preview"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No preview available</h3>
              <p className="text-gray-500">
                {isRunning ? 'Starting development server...' : 'Click "Run" to start the development server'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};