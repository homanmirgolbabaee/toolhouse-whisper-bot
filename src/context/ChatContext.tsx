
import React, { createContext, useContext, useState, useEffect } from "react";
import { Message, ChatSession, ApiKeys } from "../types";
import { apiService } from "../services/api";
import { toast } from "@/components/ui/sonner";

interface ChatContextType {
  apiKeys: ApiKeys;
  setApiKeys: (keys: ApiKeys) => void;
  currentSession: ChatSession | null;
  sessions: ChatSession[];
  messages: Message[];
  loading: boolean;
  sendMessage: (content: string) => Promise<void>;
  createNewSession: () => void;
  selectSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  isConfigured: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const LOCAL_STORAGE_KEYS = {
  API_KEYS: "whisper-bot-api-keys",
  SESSIONS: "whisper-bot-sessions",
  CURRENT_SESSION: "whisper-bot-current-session"
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apiKeys, setApiKeysState] = useState<ApiKeys>({
    openaiApiKey: "",
    toolhouseApiKey: ""
  });
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const isConfigured = !!(apiKeys.openaiApiKey && apiKeys.toolhouseApiKey);

  // Load data from local storage
  useEffect(() => {
    const loadedApiKeys = localStorage.getItem(LOCAL_STORAGE_KEYS.API_KEYS);
    const loadedSessions = localStorage.getItem(LOCAL_STORAGE_KEYS.SESSIONS);
    const loadedCurrentSession = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_SESSION);

    if (loadedApiKeys) {
      const keys = JSON.parse(loadedApiKeys);
      setApiKeysState(keys);
      
      // Initialize API service with loaded keys
      if (keys.openaiApiKey && keys.toolhouseApiKey) {
        apiService.initialize(keys.openaiApiKey, keys.toolhouseApiKey);
      }
    }

    if (loadedSessions) {
      const parsedSessions = JSON.parse(loadedSessions).map((session: any) => ({
        ...session,
        createdAt: new Date(session.createdAt),
        updatedAt: new Date(session.updatedAt)
      }));
      setSessions(parsedSessions);
    } else {
      // Create default session if none exist
      const defaultSession = createDefaultSession();
      setSessions([defaultSession]);
      setCurrentSessionId(defaultSession.id);
    }

    if (loadedCurrentSession) {
      setCurrentSessionId(loadedCurrentSession);
    }
  }, []);

  // Save data to local storage when it changes
  useEffect(() => {
    if (apiKeys.openaiApiKey && apiKeys.toolhouseApiKey) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.API_KEYS, JSON.stringify(apiKeys));
    }
  }, [apiKeys]);

  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
    }
  }, [sessions]);

  useEffect(() => {
    if (currentSessionId) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.CURRENT_SESSION, currentSessionId);
    }
  }, [currentSessionId]);

  // Set API keys and initialize service
  const setApiKeys = (keys: ApiKeys) => {
    setApiKeysState(keys);
    try {
      apiService.initialize(keys.openaiApiKey, keys.toolhouseApiKey);
      toast.success("API keys configured successfully");
    } catch (error) {
      toast.error("Failed to initialize API service");
    }
  };

  // Current session accessor
  const currentSession = currentSessionId 
    ? sessions.find(s => s.id === currentSessionId) || null 
    : sessions[0] || null;

  // Current messages accessor
  const messages = currentSession?.messages || [];

  // Create a new chat session
  const createDefaultSession = (): ChatSession => {
    const now = new Date();
    return {
      id: generateId(),
      name: `Chat ${sessions.length + 1}`,
      messages: [],
      createdAt: now,
      updatedAt: now
    };
  };

  const createNewSession = () => {
    const newSession = createDefaultSession();
    setSessions(prev => [...prev, newSession]);
    setCurrentSessionId(newSession.id);
  };

  // Select a session
  const selectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
  };

  // Delete a session
  const deleteSession = (sessionId: string) => {
    if (sessions.length === 1) {
      // Create a new session if this is the last one
      const newSession = createDefaultSession();
      setSessions([newSession]);
      setCurrentSessionId(newSession.id);
    } else {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSessionId === sessionId) {
        setCurrentSessionId(sessions.find(s => s.id !== sessionId)?.id || null);
      }
    }
  };

  // Send a message
  const sendMessage = async (content: string) => {
    if (!isConfigured) {
      toast.error("Please configure API keys first");
      return;
    }

    if (!currentSession) {
      toast.error("No active chat session");
      return;
    }

    try {
      setLoading(true);

      // Add user message to state
      const userMessage: Message = { role: "user", content };
      const newMessages = [...messages, userMessage];
      
      // Update session with user message
      const updatedSession = {
        ...currentSession,
        messages: newMessages,
        updatedAt: new Date()
      };
      
      setSessions(prev => 
        prev.map(s => s.id === currentSession.id ? updatedSession : s)
      );

      // Process message with API
      const responseMessages = await apiService.processMessage(newMessages);
      
      // Update session with API response
      const finalMessages = [...newMessages, ...responseMessages];
      const finalSession = {
        ...currentSession,
        messages: finalMessages,
        updatedAt: new Date()
      };
      
      setSessions(prev => 
        prev.map(s => s.id === currentSession.id ? finalSession : s)
      );
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const value = {
    apiKeys,
    setApiKeys,
    currentSession,
    sessions,
    messages,
    loading,
    sendMessage,
    createNewSession,
    selectSession,
    deleteSession,
    isConfigured
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};

// Helper function to generate unique IDs
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}
