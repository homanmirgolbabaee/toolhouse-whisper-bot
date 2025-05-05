
import { useChat } from "@/context/ChatContext";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { MessageSquare, Trash } from "lucide-react";

interface ChatSessionsProps {
  onSelectSession?: () => void;
}

export function ChatSessions({ onSelectSession }: ChatSessionsProps) {
  const { sessions, currentSession, selectSession, deleteSession, createNewSession } = useChat();

  const handleSelectSession = (sessionId: string) => {
    selectSession(sessionId);
    if (onSelectSession) {
      onSelectSession();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <Button 
          onClick={createNewSession} 
          className="w-full flex gap-2 justify-center"
        >
          <MessageSquare className="h-4 w-4" />
          New Chat
        </Button>
      </div>
      <div className="flex-1 overflow-auto">
        <div className="p-2 space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              className={`p-3 rounded-md cursor-pointer hover:bg-secondary flex justify-between ${
                currentSession?.id === session.id
                  ? "bg-secondary border border-primary/20"
                  : "bg-transparent"
              }`}
              onClick={() => handleSelectSession(session.id)}
            >
              <div className="flex-1 min-w-0">
                <h3 className="font-medium truncate">{session.name}</h3>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(session.updatedAt), "MMM d, yyyy • h:mm a")}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
