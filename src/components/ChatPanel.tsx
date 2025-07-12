import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Github, Upload } from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { generateCode, createGitHubRepo, pushFilesToGitHub } from '../services/api';

export const ChatPanel: React.FC = () => {
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    chatMessages,
    addChatMessage,
    files,
    setFiles,
    githubToken,
    setCurrentFile
  } = useProjectStore();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;

    const userMessage = input.trim();
    setInput('');
    
    addChatMessage({
      role: 'user',
      content: userMessage
    });

    setIsGenerating(true);

    try {
      const response = await generateCode({
        prompt: userMessage,
        context: files
      });

      addChatMessage({
        role: 'assistant',
        content: response.message
      });

      if (response.files && Object.keys(response.files).length > 0) {
        setFiles(response.files);
        
        // Auto-select the first file
        const firstFile = Object.keys(response.files)[0];
        setCurrentFile(firstFile);
      }
    } catch (error) {
      console.error('Error generating code:', error);
      addChatMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error while generating code. Please try again.'
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateRepo = async () => {
    if (!githubToken || Object.keys(files).length === 0) return;

    setIsDeploying(true);

    try {
      // Create repository
      const repoName = `hatchmate-project-${Date.now()}`;
      await createGitHubRepo({
        name: repoName,
        description: 'Generated with HatchMate-Code',
        private: false
      }, githubToken);

      // Push files
      await pushFilesToGitHub(repoName, files, githubToken);

      addChatMessage({
        role: 'assistant',
        content: `🎉 Successfully created repository "${repoName}" and pushed your code to GitHub!`
      });
    } catch (error) {
      console.error('Error deploying to GitHub:', error);
      addChatMessage({
        role: 'assistant',
        content: 'Sorry, I encountered an error while deploying to GitHub. Please try again.'
      });
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-900">AI Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.length === 0 && (
          <div className="text-center text-gray-500 text-sm">
            <Bot className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>Hi! I'm your AI coding assistant.</p>
            <p>Tell me what you'd like to build!</p>
          </div>
        )}

        {chatMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-3 py-2 ${
                message.role === 'user'
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="flex items-start space-x-2">
                {message.role === 'assistant' && (
                  <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                {message.role === 'user' && (
                  <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                )}
                <div className="text-sm whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          </div>
        ))}

        {isGenerating && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-lg px-3 py-2">
              <div className="flex items-center space-x-2">
                <Bot className="w-4 h-4" />
                <div className="text-sm">Generating code...</div>
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {Object.keys(files).length > 0 && githubToken && (
        <div className="px-4 py-2 border-t border-gray-200">
          <button
            onClick={handleCreateRepo}
            disabled={isDeploying}
            className="w-full flex items-center justify-center space-x-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeploying ? (
              <>
                <Upload className="w-4 h-4 animate-spin" />
                <span>Deploying...</span>
              </>
            ) : (
              <>
                <Github className="w-4 h-4" />
                <span>Push to GitHub</span>
              </>
            )}
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe what you want to build..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            disabled={isGenerating}
          />
          <button
            type="submit"
            disabled={!input.trim() || isGenerating}
            className="bg-primary-500 hover:bg-primary-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};