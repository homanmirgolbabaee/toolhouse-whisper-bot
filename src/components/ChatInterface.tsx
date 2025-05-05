
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatInput } from "./ChatInput";
import { ChatSessions } from "./ChatSessions";
import { ContentCreationTools } from "./ContentCreationTools";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChat } from "@/context/ChatContext";

export function ChatInterface() {
  const { isConfigured } = useChat();
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden lg:flex lg:w-64 xl:w-80 border-r h-full">
        <ChatSessions />
      </div>
      
      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full">
        <ChatHeader />
        <ScrollArea className="flex-1">
          {isConfigured && <ContentCreationTools />}
          <ChatMessages />
        </ScrollArea>
        <ChatInput />
      </div>
    </div>
  );
}
