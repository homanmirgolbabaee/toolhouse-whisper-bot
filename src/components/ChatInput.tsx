
import { useState, FormEvent, KeyboardEvent } from "react";
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { toast } from "@/components/ui/sonner";

export function ChatInput() {
  const [input, setInput] = useState("");
  const { sendMessage, loading, isConfigured } = useChat();
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    if (!isConfigured) {
      toast.error("Please configure your API keys first");
      return;
    }
    
    try {
      await sendMessage(input);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="border-t p-4 bg-background sticky bottom-0"
    >
      <div className="flex gap-2 relative">
        <Textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask a question or use available tools..."
          disabled={loading}
          className="min-h-[60px] resize-none pr-14"
        />
        <Button 
          size="icon"
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute bottom-2.5 right-2.5"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
}
