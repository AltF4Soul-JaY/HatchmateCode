import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
  content: string;
}

export const CodeBlock = ({ content }: CodeBlockProps) => {
  const [copiedBlocks, setCopiedBlocks] = useState<Set<number>>(new Set());
  const { toast } = useToast();

  // Parse the content to separate text and code blocks
  const parseContent = (text: string) => {
    const parts = [];
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index).trim();
        if (textBefore) {
          parts.push({ type: 'text', content: textBefore });
        }
      }

      // Add code block
      const language = match[1] || 'text';
      const code = match[2].trim();
      parts.push({ type: 'code', language, content: code });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      const remainingText = text.slice(lastIndex).trim();
      if (remainingText) {
        parts.push({ type: 'text', content: remainingText });
      }
    }

    return parts.length > 0 ? parts : [{ type: 'text', content: text }];
  };

  const copyToClipboard = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedBlocks(prev => new Set(prev).add(index));
      setTimeout(() => {
        setCopiedBlocks(prev => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
      
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  const parts = parseContent(content);

  return (
    <div className="space-y-4 max-h-[600px] overflow-y-auto">
      {parts.map((part, index) => (
        <div key={index}>
          {part.type === 'text' ? (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {part.content.split('\n').map((line, lineIndex) => (
                <p key={lineIndex} className="mb-2">
                  {line}
                </p>
              ))}
            </div>
          ) : (
            <div className="relative group">
              <div className="flex items-center justify-between bg-muted px-4 py-2 rounded-t-lg border">
                <span className="text-sm font-medium text-muted-foreground uppercase">
                  {part.language}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(part.content, index)}
                  className={cn(
                    "opacity-0 group-hover:opacity-100 transition-opacity",
                    copiedBlocks.has(index) && "opacity-100"
                  )}
                >
                  {copiedBlocks.has(index) ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <SyntaxHighlighter
                language={part.language}
                style={vscDarkPlus}
                customStyle={{
                  margin: 0,
                  borderRadius: '0 0 0.5rem 0.5rem',
                  border: '1px solid hsl(var(--border))',
                  borderTop: 'none',
                }}
                wrapLines
                wrapLongLines
              >
                {part.content}
              </SyntaxHighlighter>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};