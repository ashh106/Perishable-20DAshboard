import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  Brain,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiCall } from "@/hooks/useAuth";

interface ChatMessage {
  id: string;
  type: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface AIChatbotProps {
  currentPage?: string;
  contextData?: any;
}

export function AIChatbot({
  currentPage = "dashboard",
  contextData,
}: AIChatbotProps) {
  const { user } = useAuth() || {
    user: { storeId: "1234", name: "Demo User", role: "associate" },
  };
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hi there! I'm your Walmart AI Assistant. Ask me anything: how to use Expiry Watch, dynamic pricing logic, or check stock levels.",
      timestamp: new Date(),
    },
  ]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateContextPrompt = () => {
    const context = {
      page: currentPage,
      storeId: user?.storeId,
      userRole: user?.role,
      userName: user?.name,
      ...contextData,
    };

    return `Context: User ${context.userName} (${context.userRole}) is on the ${context.page} page of store ${context.storeId}. ${
      contextData ? `Current data: ${JSON.stringify(contextData)}` : ""
    }`;
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: currentMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setCurrentMessage("");
    setIsLoading(true);

    try {
      // Call the AI chat endpoint with context
      const response = await apiCall("/chat", {
        method: "POST",
        body: JSON.stringify({
          message: currentMessage,
          context: generateContextPrompt(),
          conversationHistory: messages.slice(-3), // Last 3 messages for context
        }),
      });

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          response.message ||
          response.response ||
          "I apologize, but I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);

      // Fallback responses based on keywords
      let fallbackResponse =
        "I'm here to help! You can ask me about inventory management, pricing strategies, or how to use the dashboard features.";

      const message = currentMessage.toLowerCase();
      if (message.includes("expiry") || message.includes("expire")) {
        fallbackResponse =
          "The Expiry Watch feature helps you track items approaching expiration. Look for the 💡 AI Rec icon next to items with 3 or fewer days left - it provides smart markdown recommendations!";
      } else if (
        message.includes("price") ||
        message.includes("discount") ||
        message.includes("markdown")
      ) {
        fallbackResponse =
          "Our AI suggests optimal discounts based on days to expiry: 30% for 1 day, 20% for 2 days, 15% for 3 days. You can adjust these with the slider and apply them with one click!";
      } else if (message.includes("stock") || message.includes("inventory")) {
        fallbackResponse = `You currently have inventory items across different categories. Check the Dashboard Home for real-time stock levels and the Expiry Watch for items needing attention.`;
      } else if (message.includes("help") || message.includes("how")) {
        fallbackResponse =
          "I can help you with: 📊 Reading dashboard metrics, ⚠️ Managing expiring items, 💰 Setting optimal prices, 🔄 Understanding real-time updates, 📱 Using mobile features. What would you like to know more about?";
      }

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: fallbackResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full bg-walmart-blue hover:bg-walmart-blue/90 shadow-lg hover:shadow-xl transition-all duration-300 group"
          size="icon"
        >
          <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform" />
          <div className="absolute -top-2 -right-2 h-4 w-4 bg-walmart-teal rounded-full animate-pulse" />
        </Button>

        {/* Tooltip */}
        <div className="absolute bottom-full right-0 mb-2 hidden group-hover:block">
          <div className="bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Ask AI Assistant
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Card
        className={`bg-white border-gray-200 shadow-xl transition-all duration-300 ${
          isMinimized ? "w-80 h-16" : "w-96 h-96"
        }`}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 py-3 px-4 border-b border-gray-200 bg-gradient-to-r from-walmart-blue to-walmart-teal">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-white/20 rounded-lg">
              <Brain className="h-4 w-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold text-white">
                AI Assistant
              </CardTitle>
              {!isMinimized && (
                <p className="text-xs text-white/80">Powered by GenAI</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMinimized(!isMinimized)}
              className="h-6 w-6 text-white hover:bg-white/20"
            >
              {isMinimized ? (
                <Maximize2 className="h-3 w-3" />
              ) : (
                <Minimize2 className="h-3 w-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 text-white hover:bg-white/20"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="flex-1 overflow-hidden p-0">
              <div className="h-64 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.type === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        message.type === "user"
                          ? "bg-walmart-blue text-white"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      {message.type === "user" ? (
                        <User className="h-3 w-3" />
                      ) : (
                        <Bot className="h-3 w-3" />
                      )}
                    </div>

                    <div
                      className={`flex-1 max-w-xs ${
                        message.type === "user" ? "text-right" : ""
                      }`}
                    >
                      <div
                        className={`p-3 rounded-lg text-sm ${
                          message.type === "user"
                            ? "bg-walmart-blue text-white ml-auto"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        {message.content}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Bot className="h-3 w-3" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-100" />
                        <div className="w-1 h-1 bg-gray-400 rounded-full animate-bounce delay-200" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </CardContent>

            <div className="border-t border-gray-200 p-3">
              <div className="flex items-center gap-2">
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about the dashboard..."
                  className="flex-1 h-8 text-sm"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!currentMessage.trim() || isLoading}
                  className="h-8 w-8 bg-walmart-blue hover:bg-walmart-blue/90"
                  size="icon"
                >
                  <Send className="h-3 w-3" />
                </Button>
              </div>

              {currentPage && (
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    📍 {currentPage} • Store {user?.storeId}
                  </Badge>
                </div>
              )}
            </div>
          </>
        )}
      </Card>
    </div>
  );
}
