import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CodeBlockProps {
  title?: string;
  language?: string;
  code: string;
  className?: string;
}

export function CodeBlock({
  title,
  language = "javascript",
  code,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Code copied",
        description: "Code has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="relative">
      <Button
        size="sm"
        variant="ghost"
        onClick={copyToClipboard}
        className="absolute top-2 right-2 h-8 w-8 p-0 z-10"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-600" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </Button>

      <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
