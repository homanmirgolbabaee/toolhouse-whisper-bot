
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useChat } from "@/context/ChatContext";
import { Settings } from "lucide-react";

export function APIConfigDialog() {
  const { apiKeys, setApiKeys, isConfigured } = useChat();
  const [openaiKey, setOpenaiKey] = useState(apiKeys.openaiApiKey);
  const [toolhouseKey, setToolhouseKey] = useState(apiKeys.toolhouseApiKey);
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setApiKeys({
      openaiApiKey: openaiKey,
      toolhouseApiKey: toolhouseKey
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Settings className="h-5 w-5" />
          {!isConfigured && (
            <span className="absolute top-0 right-0 h-2.5 w-2.5 rounded-full bg-destructive animate-pulse" />
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="openai-api-key">OpenAI API Key</Label>
            <Input
              id="openai-api-key"
              type="password"
              value={openaiKey}
              onChange={(e) => setOpenaiKey(e.target.value)}
              placeholder="sk-..."
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="toolhouse-api-key">Toolhouse API Key</Label>
            <Input
              id="toolhouse-api-key"
              type="password"
              value={toolhouseKey}
              onChange={(e) => setToolhouseKey(e.target.value)}
              placeholder="th-..."
            />
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Configuration</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
