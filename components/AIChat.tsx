import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { ScrollArea } from './ui/scroll-area';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatProps {
  isVisible: boolean;
  onClose: () => void;
  initialContext?: string;
}

export function AIChat({ isVisible, onClose, initialContext }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      // Initialize with welcome message
      const welcomeMessage: Message = {
        id: '1',
        content: initialContext
          ? `I see you're looking to appraise "${initialContext}". I'll help you get the most accurate valuation. Can you tell me more about the item? For example:\n\n• What's the approximate age or era?\n• Do you know the metal type (gold, silver, platinum)?\n• Are there any gemstones? If so, what kind?\n• Do you have any certificates or documentation?\n• What's the item's condition?`
          : "Hello! I'm your jewelry appraisal assistant. I'll help you get the most accurate valuation for your item. Can you tell me more details about the jewelry you'd like appraised?",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [isVisible, initialContext]);

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('diamond') || lowerMessage.includes('carat')) {
      return "Great! For diamond appraisal, I need to know the 4 C's:\n\n• **Carat**: What's the weight?\n• **Cut**: Round, princess, emerald, etc.?\n• **Color**: Any color grading (D-Z scale)?\n• **Clarity**: Any visible inclusions?\n\nAlso, do you have a GIA or other certification?";
    }
    
    if (lowerMessage.includes('gold') || lowerMessage.includes('silver') || lowerMessage.includes('platinum')) {
      return "Perfect! For precious metal jewelry:\n\n• What's the karat (for gold: 10K, 14K, 18K, 24K)?\n• What's the approximate weight?\n• Are there any hallmarks or stamps?\n• What's the current condition?\n• Is it a specific style or designer piece?";
    }
    
    if (lowerMessage.includes('watch') || lowerMessage.includes('rolex') || lowerMessage.includes('omega')) {
      return "Excellent! For watch appraisal I need:\n\n• Brand and model number\n• Serial number (if available)\n• Year of manufacture\n• Condition of case, dial, and movement\n• Original box and papers?\n• Recent service history?";
    }
    
    if (lowerMessage.includes('vintage') || lowerMessage.includes('antique')) {
      return "Vintage pieces are fascinating! Please tell me:\n\n• Approximate age or era (Art Deco, Victorian, etc.)\n• Any maker's marks or signatures\n• Materials used\n• Provenance or history\n• Current condition\n• Any documentation or certificates?";
    }
    
    if (lowerMessage.includes('certificate') || lowerMessage.includes('gia') || lowerMessage.includes('documentation')) {
      return "Excellent! Certificates greatly help with accuracy. Can you:\n\n• Upload the certificate if possible\n• Tell me the certifying body (GIA, EGL, AGS, etc.)\n• Share the certificate number\n• Confirm the details match your item\n\nThis will significantly improve the appraisal accuracy.";
    }

    // Default response
    return "Thank you for that information! Based on what you've told me, I'm building a comprehensive profile for your jewelry appraisal. \n\nIs there anything else specific about the item's history, condition, or unique features that might affect its value? \n\nOnce I have enough details, I'll provide you with a detailed price estimate and market analysis.";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: simulateAIResponse(inputMessage),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          <span>Appraisal Assistant</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}>
          ×
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-3 whitespace-pre-wrap ${
                  message.sender === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                {message.content}
              </div>
              {message.sender === 'user' && (
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-secondary-foreground" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Bot className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="bg-muted rounded-lg p-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything about your jewelry..."
            className="flex-1"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}