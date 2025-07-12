import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';

export const Terminal: React.FC = () => {
  const { terminalOutput, clearTerminalOutput } = useProjectStore();
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalOutput]);

  return (
    <div className="bg-gray-900 text-green-400 h-64 flex flex-col">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4" />
          <span className="text-sm font-medium">Terminal</span>
        </div>
        <button
          onClick={clearTerminalOutput}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto font-mono text-sm"
      >
        {terminalOutput.length === 0 ? (
          <div className="text-gray-500">
            Terminal ready. Run commands to see output here.
          </div>
        ) : (
          terminalOutput.map((line, index) => (
            <div key={index} className="mb-1">
              {line}
            </div>
          ))
        )}
      </div>
    </div>
  );
};