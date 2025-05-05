
import { Button } from "@/components/ui/button";
import { useChat } from "@/context/ChatContext";
import { APIConfigDialog } from "./APIConfigDialog";
import { History, MessageSquare } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ChatSessions } from "./ChatSessions";

export function ChatHeader() {
  const { createNewSession, currentSession, isConfigured } = useChat();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <header className="flex items-center justify-between p-4 border-b">
      <div className="flex items-center gap-2">
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <History className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[350px]">
            <ChatSessions onSelectSession={() => setSidebarOpen(false)} />
          </SheetContent>
        </Sheet>
        <h1 className="text-xl font-semibold">
          {currentSession?.name || "Whisper Bot"}
        </h1>
        {!isConfigured && (
          <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
            Setup Required
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={createNewSession}
          className="flex items-center gap-1"
        >
          <MessageSquare className="h-4 w-4" />
          <span className="hidden sm:inline">New Chat</span>
        </Button>
        <APIConfigDialog />
      </div>
    </header>
  );
}
