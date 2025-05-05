
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useChat } from "@/context/ChatContext";
import { FileText, Link, Loader2 } from "lucide-react";

export function ContentCreationTools() {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const { sendMessage, loading } = useChat();
  
  const handleCreateFromText = async () => {
    if (!text.trim()) return;
    await sendMessage(`HEY TOOLHOUSE MAKE CONTENT ${text}`);
    setText("");
  };
  
  const handleCreateFromUrl = async () => {
    if (!url.trim()) return;
    await sendMessage(`HEY TOOLHOUSE MAKE CONTENT FROM ${url}`);
    setUrl("");
  };
  
  return (
    <div className="p-4 border rounded-lg bg-background mb-4 shadow-sm">
      <h2 className="text-lg font-medium mb-3">Content Creator Tools</h2>
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid grid-cols-2 mb-2">
          <TabsTrigger value="text">
            <FileText className="w-4 h-4 mr-2" />
            From Text
          </TabsTrigger>
          <TabsTrigger value="url">
            <Link className="w-4 h-4 mr-2" />
            From URL
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="text" className="space-y-3">
          <Textarea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your content here..."
            className="min-h-[120px] resize-none"
          />
          <Button 
            onClick={handleCreateFromText} 
            className="w-full"
            disabled={!text.trim() || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Content...
              </>
            ) : (
              <>Generate Blog Post</>
            )}
          </Button>
        </TabsContent>
        
        <TabsContent value="url" className="space-y-3">
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL (e.g. https://example.com)"
          />
          <Button 
            onClick={handleCreateFromUrl}
            className="w-full"
            disabled={!url.trim() || loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing URL...
              </>
            ) : (
              <>Generate Blog Post from URL</>
            )}
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}
