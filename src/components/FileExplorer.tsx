import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { FileNode } from '../types';

interface FileTreeItemProps {
  node: FileNode;
  level: number;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({ node, level }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { currentFile, setCurrentFile } = useProjectStore();

  const handleClick = () => {
    if (node.type === 'file') {
      setCurrentFile(node.path);
    } else {
      setIsExpanded(!isExpanded);
    }
  };

  const isSelected = currentFile === node.path;

  return (
    <div>
      <div
        className={`flex items-center space-x-2 px-2 py-1 cursor-pointer hover:bg-gray-100 ${
          isSelected ? 'bg-primary-50 text-primary-700' : 'text-gray-700'
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          <div className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? (
              <ChevronDown className="w-3 h-3" />
            ) : (
              <ChevronRight className="w-3 h-3" />
            )}
          </div>
        )}
        
        <div className="w-4 h-4 flex items-center justify-center">
          {node.type === 'folder' ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-blue-500" />
            ) : (
              <Folder className="w-4 h-4 text-blue-500" />
            )
          ) : (
            <File className="w-4 h-4 text-gray-500" />
          )}
        </div>
        
        <span className="text-sm truncate">{node.name}</span>
      </div>

      {node.type === 'folder' && isExpanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const FileExplorer: React.FC = () => {
  const { getFileTree } = useProjectStore();
  const fileTree = getFileTree();

  return (
    <div className="bg-white border-r border-gray-200 w-64 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">Explorer</h2>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {fileTree.length === 0 ? (
          <div className="p-4 text-sm text-gray-500 text-center">
            No files yet. Start by generating code with AI!
          </div>
        ) : (
          <div className="py-2">
            {fileTree.map((node) => (
              <FileTreeItem key={node.path} node={node} level={0} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};