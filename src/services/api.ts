
import { Toolhouse } from "@toolhouseai/sdk";
import OpenAI from "openai";
import { Message } from "../types";

export const MODEL = "gpt-4o-mini";

export class ApiService {
  private toolhouse: Toolhouse | null = null;
  private openai: OpenAI | null = null;
  private tools: OpenAI.Chat.Completions.ChatCompletionTool[] | null = null;

  constructor(openaiApiKey?: string, toolhouseApiKey?: string) {
    if (openaiApiKey && toolhouseApiKey) {
      this.initialize(openaiApiKey, toolhouseApiKey);
    }
  }

  initialize(openaiApiKey: string, toolhouseApiKey: string) {
    this.toolhouse = new Toolhouse({
      apiKey: toolhouseApiKey,
      metadata: {
        id: "user",
        timezone: "0"
      }
    });

    this.openai = new OpenAI({
      apiKey: openaiApiKey,
      dangerouslyAllowBrowser: true // Note: In production, use server-side handling
    });
  }

  isInitialized(): boolean {
    return !!this.toolhouse && !!this.openai;
  }

  async loadTools(): Promise<OpenAI.Chat.Completions.ChatCompletionTool[]> {
    if (!this.isInitialized()) {
      throw new Error("API service not initialized");
    }
    
    if (!this.tools) {
      this.tools = await this.toolhouse!.getTools() as OpenAI.Chat.Completions.ChatCompletionTool[];
    }
    
    return this.tools;
  }

  async processMessage(messages: Message[]): Promise<Message[]> {
    if (!this.isInitialized()) {
      throw new Error("API service not initialized");
    }

    const tools = await this.loadTools();
    
    // First call to get initial completion with potential tool calls
    const chatCompletion = await this.openai!.chat.completions.create({
      messages,
      model: MODEL,
      tools
    });

    // Run the tools if needed
    const processedMessages = await this.toolhouse!.runTools(chatCompletion) as Message[];
    
    // Second call with the processed messages
    const newMessages = [...messages, ...processedMessages];
    const finalCompletion = await this.openai!.chat.completions.create({
      messages: newMessages,
      model: MODEL
    });

    // Return only the new messages (the ones added during this process)
    return [
      ...processedMessages,
      finalCompletion.choices[0].message as Message
    ];
  }
}

export const apiService = new ApiService();
