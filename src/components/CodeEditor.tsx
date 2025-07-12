import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useProjectStore } from '../store/useProjectStore';

export const CodeEditor: React.FC = () => {
  const { files, currentFile, updateFile } = useProjectStore();
  const editorRef = useRef<any>(null);

  const currentFileContent = currentFile ? files[currentFile] || '' : '';

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleEditorChange = (value: string | undefined) => {
    if (currentFile && value !== undefined) {
      updateFile(currentFile, value);
    }
  };

  const getLanguage = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'js':
      case 'jsx':
        return 'javascript';
      case 'ts':
      case 'tsx':
        return 'typescript';
      case 'html':
        return 'html';
      case 'css':
        return 'css';
      case 'json':
        return 'json';
      case 'md':
        return 'markdown';
      case 'py':
        return 'python';
      case 'java':
        return 'java';
      case 'cpp':
      case 'cc':
      case 'cxx':
        return 'cpp';
      case 'c':
        return 'c';
      case 'go':
        return 'go';
      case 'rs':
        return 'rust';
      case 'php':
        return 'php';
      case 'rb':
        return 'ruby';
      case 'sh':
        return 'shell';
      case 'sql':
        return 'sql';
      case 'xml':
        return 'xml';
      case 'yaml':
      case 'yml':
        return 'yaml';
      default:
        return 'plaintext';
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-gray-50">
      {currentFile ? (
        <>
          <div className="bg-white border-b border-gray-200 px-4 py-2">
            <span className="text-sm font-medium text-gray-900">{currentFile}</span>
          </div>
          <div className="flex-1">
            <Editor
              height="100%"
              language={getLanguage(currentFile)}
              value={currentFileContent}
              onChange={handleEditorChange}
              onMount={handleEditorDidMount}
              theme="vs-light"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: 'on',
                contextmenu: true,
                selectOnLineNumbers: true,
              }}
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V8zm0 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No file selected</h3>
            <p className="text-gray-500">Select a file from the explorer to start editing</p>
          </div>
        </div>
      )}
    </div>
  );
};