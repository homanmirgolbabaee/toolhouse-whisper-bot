
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";

export type Message = ChatCompletionMessageParam;

export interface ChatSession {
  id: string;
  name: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiKeys {
  openaiApiKey: string;
  toolhouseApiKey: string;
}
