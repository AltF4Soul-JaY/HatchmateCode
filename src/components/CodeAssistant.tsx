import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CodeBlock } from './CodeBlock';
import { Send, RotateCcw, Trash2, Code, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Together from 'together-ai';

export const CodeAssistant = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('together-api-key') || '');
  const [showSettings, setShowSettings] = useState(!apiKey);
  const { toast } = useToast();

  const saveApiKey = () => {
    localStorage.setItem('together-api-key', apiKey);
    setShowSettings(false);
    toast({
      title: "API Key Saved",
      description: "Your Together AI API key has been saved locally.",
    });
  };

  const generateCode = async () => {
    if (!apiKey) {
      setShowSettings(true);
      toast({
        title: "API Key Required",
        description: "Please enter your Together AI API key to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!prompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a coding prompt.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const together = new Together({
        apiKey: apiKey
      });

      const completion = await together.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are a helpful coding assistant. Provide clear, well-commented code examples and explanations. Format your response with proper code blocks and explanations."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        model: "deepseek-ai/DeepSeek-V3",
        max_tokens: 2000,
        temperature: 0.1
      });

      const result = completion.choices[0]?.message?.content || 'No response generated.';
      setResponse(result);
      
      toast({
        title: "Code Generated",
        description: "Your code has been generated successfully!",
      });
    } catch (error) {
      console.error('Error generating code:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate code. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const regenerateCode = () => {
    if (prompt.trim()) {
      generateCode();
    }
  };

  const clearAll = () => {
    setPrompt('');
    setResponse('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      generateCode();
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2">
            <Code className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">CodeCraft AI</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Your AI-powered coding assistant using DeepSeek-V3
          </p>
        </div>

        {/* Settings Panel */}
        {showSettings && (
          <Card className="border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">Together AI API Key</Label>
                <Input
                  id="apiKey"
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Together AI API key"
                />
                <p className="text-sm text-muted-foreground">
                  Your API key is stored locally and never sent to our servers.
                </p>
              </div>
              <Button onClick={saveApiKey} disabled={!apiKey.trim()}>
                Save API Key
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Enter Your Coding Prompt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me anything about coding! For example:
- Write a Python function to reverse a string
- Explain merge sort with code
- Create a responsive navbar in HTML/CSS
- Show me how to use React hooks"
                className="min-h-[200px] resize-none"
              />
              <div className="flex gap-2">
                <Button 
                  onClick={generateCode} 
                  disabled={isLoading || !prompt.trim()}
                  className="flex-1"
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isLoading ? 'Generating...' : 'Generate Code'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={regenerateCode}
                  disabled={isLoading || !prompt.trim()}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={clearAll}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Tip: Press Cmd/Ctrl + Enter to generate code quickly
              </p>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Generated Code</CardTitle>
                {!showSettings && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowSettings(true)}
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {response ? (
                <CodeBlock content={response} />
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Your generated code will appear here</p>
                  <p className="text-sm mt-2">Start by entering a coding prompt</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Example Prompts */}
        <Card>
          <CardHeader>
            <CardTitle>Example Prompts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                "Write a Python function to reverse a string",
                "Create a responsive navbar in HTML/CSS", 
                "Explain bubble sort with JavaScript code",
                "Build a React component for a todo list",
                "Write a SQL query to find duplicate records",
                "Create a REST API endpoint in Node.js"
              ].map((example, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto p-3 whitespace-normal"
                  onClick={() => setPrompt(example)}
                >
                  {example}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};