
import { useChat } from "@/context/ChatContext";
import { MessageItem } from "./MessageItem";
import { useEffect, useRef } from "react";

export function ChatMessages() {
  const { messages, loading } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <div className="mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageItem className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h3 className="text-xl font-semibold">Whisper Bot</h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            Ask anything or use Toolhouse's powerful tools to help you analyze websites, 
            search the web, process data, and more!
          </p>
        </div>
      ) : (
        messages.map((message, index) => (
          <MessageItem key={index} message={message} />
        ))
      )}
      
      {loading && (
        <div className="flex items-center p-4 rounded-lg bg-muted/50">
          <div className="flex space-x-2">
            <div className="h-3 w-3 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "0ms" }}></div>
            <div className="h-3 w-3 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "300ms" }}></div>
            <div className="h-3 w-3 bg-primary/60 rounded-full animate-pulse" style={{ animationDelay: "600ms" }}></div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
