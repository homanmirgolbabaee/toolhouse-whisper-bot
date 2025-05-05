
import { ChatProvider } from "@/context/ChatContext";
import { ChatInterface } from "@/components/ChatInterface";

const Index = () => {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
};

export default Index;
