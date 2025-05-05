
import { Message } from "@/types";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { User } from "lucide-react";

interface MessageItemProps {
  message?: Message;
  className?: string;
}

export function MessageItem({ message, className }: MessageItemProps) {
  if (!message) {
    return <User className={cn("h-6 w-6", className)} />;
  }

  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-lg",
        isUser 
          ? "bg-chatbot-user border-chatbot-border" 
          : "bg-chatbot-assistant border-chatbot-border"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 rounded-full",
        isUser ? "bg-primary/10" : "bg-muted"
      )}>
        <User className="h-5 w-5 text-foreground/80" />
      </Avatar>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="font-semibold mb-1">
          {isUser ? "You" : "Whisper Bot"}
        </div>
        <div className="markdown prose-sm max-w-none">
          <ReactMarkdown
            components={{
              code({ node, inline, className, children, ...props }) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <SyntaxHighlighter
                    style={dracula}
                    language={match[1]}
                    PreTag="div"
                    {...props}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content as string}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
