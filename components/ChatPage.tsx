import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Image as ImageIcon, FileText, Search, Globe, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  images?: File[];
  files?: File[];
  isResearching?: boolean;
  researchType?: 'item-analysis' | 'market-research' | 'historical-research' | 'confirmation';
}

interface ChatPageProps {
  onBack: () => void;
  onGetAppraisal: () => void;
  initialContext?: string;
  initialFiles?: File[];
}

export function ChatPage({ onBack, onGetAppraisal, initialContext, initialFiles = [] }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>(initialFiles);
  const [conversationStage, setConversationStage] = useState(0);
  const [isResearching, setIsResearching] = useState(false);
  const [researchComplete, setResearchComplete] = useState(false);
  const [itemDetails, setItemDetails] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize conversation
    const welcomeMessage: Message = {
      id: '1',
      content: `Welcome to JewelAI's professional appraisal consultation! ${initialContext ? `I see you're interested in appraising "${initialContext}".` : ''}\n\nI'll guide you through a comprehensive appraisal process that includes:\n\n🔍 **Item Analysis** - Detailed examination of your jewelry\n🌐 **Market Research** - Current pricing and trends\n📚 **Historical Research** - Cultural and historical significance\n✅ **Confirmation** - Verify all details before final appraisal\n\n${uploadedFiles.length > 0 ? `I can see you've uploaded ${uploadedFiles.length} file(s) which will help with the analysis.` : ''}\n\nLet's start! Can you describe your jewelry piece in detail? Include any information about materials, age, origin, or special features.`,
      sender: 'ai',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  }, [initialContext, uploadedFiles.length]);

  const getImageUrl = (file: File): string => {
    return URL.createObjectURL(file);
  };

  const simulateResearch = async (type: 'item-analysis' | 'market-research' | 'historical-research', itemInfo: string) => {
    setIsResearching(true);
    
    const researchMessage: Message = {
      id: `research-${Date.now()}`,
      content: '',
      sender: 'ai',
      timestamp: new Date(),
      isResearching: true,
      researchType: type
    };

    setMessages(prev => [...prev, researchMessage]);

    // Simulate research time
    await new Promise(resolve => setTimeout(resolve, 3000 + Math.random() * 2000));

    setIsResearching(false);

    // Remove research message and add results
    setMessages(prev => prev.filter(msg => msg.id !== researchMessage.id));

    let researchResults = '';
    
    switch (type) {
      case 'item-analysis':
        researchResults = `🔍 **Item Analysis Complete**\n\nBased on your description and uploaded images, I've identified:\n\n• **Item Type**: ${itemInfo.includes('ring') ? 'Ring' : itemInfo.includes('necklace') ? 'Necklace' : itemInfo.includes('watch') ? 'Watch' : 'Jewelry piece'}\n• **Estimated Era**: ${Math.floor(Math.random() * 50) + 1970}s-${Math.floor(Math.random() * 20) + 2000}s\n• **Construction**: ${['Hand-crafted', 'Machine-made', 'Mixed techniques'][Math.floor(Math.random() * 3)]}\n• **Style**: ${['Art Deco', 'Victorian', 'Modern', 'Contemporary', 'Vintage'][Math.floor(Math.random() * 5)]}\n\nNow I'll research the current market for similar pieces...`;
        break;
      
      case 'market-research':
        researchResults = `🌐 **Market Research Complete**\n\nI've analyzed current market data:\n\n• **Market Trend**: ${['Strong upward trend', 'Stable market', 'Slight decline'][Math.floor(Math.random() * 3)]}\n• **Demand Level**: ${['High', 'Moderate', 'Strong'][Math.floor(Math.random() * 3)]}\n• **Recent Sales**: Found ${Math.floor(Math.random() * 15) + 5} comparable pieces\n• **Price Range**: $${Math.floor(Math.random() * 5000) + 1000} - $${Math.floor(Math.random() * 8000) + 5000}\n• **Regional Preference**: ${['North America', 'Europe', 'Global'][Math.floor(Math.random() * 3)]} markets show strong interest\n\nNext, I'll research the historical and cultural significance...`;
        break;
      
      case 'historical-research':
        researchResults = `📚 **Historical Research Complete**\n\nI've discovered fascinating background information:\n\n• **Historical Period**: ${['Art Deco era (1920s-1930s)', 'Victorian era (1837-1901)', 'Retro period (1940s-1950s)', 'Contemporary era (1960s-present)'][Math.floor(Math.random() * 4)]}\n• **Cultural Significance**: ${['Symbol of luxury and status', 'Traditional ceremonial piece', 'Fashion statement piece', 'Investment grade jewelry'][Math.floor(Math.random() * 4)]}\n• **Design Influence**: ${['European craftsmanship', 'American design', 'Asian artistry', 'Global fusion'][Math.floor(Math.random() * 4)]}\n• **Rarity Factor**: ${['Common design', 'Moderately rare', 'Rare piece', 'Highly collectible'][Math.floor(Math.random() * 4)]}\n\nResearch phase complete! Let me confirm all the details before proceeding...`;
        break;
    }

    const resultMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: researchResults,
      sender: 'ai',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, resultMessage]);
    return resultMessage;
  };

  const getAIResponse = async (userMessage: string, stage: number): Promise<{ message: string; nextStage: number }> => {
    const lowerMessage = userMessage.toLowerCase();
    
    switch (stage) {
      case 0: // Initial information gathering
        // Simulate item analysis research
        await simulateResearch('item-analysis', lowerMessage);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await simulateResearch('market-research', lowerMessage);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await simulateResearch('historical-research', lowerMessage);
        
        return {
          message: "Excellent! I've completed my comprehensive research on your jewelry piece. Now I need to gather some additional details to ensure the most accurate appraisal:\n\n**Physical Condition Assessment:**\n\n• How would you rate the overall condition? (excellent/good/fair/needs repair)\n• Are there any visible scratches, dents, or damage?\n• Are all stones secure and original?\n• Any repairs or modifications done?\n\n**Provenance & Documentation:**\n\n• Do you have purchase receipts or certificates?\n• Any previous appraisals?\n• Family heirloom or recent purchase?\n• Any maker's marks or signatures visible?",
          nextStage: 1
        };

      case 1: // Detailed follow-up after research
        return {
          message: "Thank you for those important details! Based on my research and your information, I'm building a comprehensive profile.\n\n**Additional Specifications Needed:**\n\n• **Weight**: Do you know the approximate weight?\n• **Measurements**: Can you provide dimensions?\n• **Special Features**: Any unique characteristics or engravings?\n• **Storage History**: How has it been stored/maintained?\n• **Usage**: Frequently worn or stored?\n\nI'm also cross-referencing this with my database of similar pieces...",
          nextStage: 2
        };

      case 2: // Final confirmation stage
        setItemDetails({
          description: userMessage,
          condition: 'good', // Mock data
          authenticated: true
        });
        
        return {
          message: "Perfect! Let me confirm all the details I've gathered:\n\n**📋 APPRAISAL SUMMARY**\n\n**Item Details:**\n• Type: Based on your description\n• Materials: As specified\n• Condition: As assessed\n• Era/Style: From research analysis\n\n**Research Findings:**\n• ✅ Market analysis completed\n• ✅ Historical research completed\n• ✅ Comparable sales identified\n• ✅ Current trends analyzed\n\n**Documentation:**\n• Images analyzed: " + (uploadedFiles.filter(f => f.type.startsWith('image/')).length) + "\n• Documents reviewed: " + (uploadedFiles.filter(f => !f.type.startsWith('image/')).length) + "\n\n**Are these details correct?** If yes, I'm ready to generate your comprehensive professional appraisal report with current market valuation.",
          nextStage: 3
        };

      case 3: // Ready for appraisal
        setResearchComplete(true);
        return {
          message: "Excellent! All information has been verified and confirmed. \n\n🎯 **Ready for Professional Appraisal**\n\nI now have comprehensive data including:\n• Detailed item analysis\n• Current market research\n• Historical context\n• Condition assessment\n• Visual documentation\n\n**Click 'Generate Professional Appraisal' to receive your detailed valuation report with:**\n• Market value range\n• Insurance valuation\n• Comparable sales data\n• Market trend analysis\n• Professional recommendations\n\nThis appraisal will be suitable for insurance, resale, or personal records.",
          nextStage: 4
        };

      default:
        return {
          message: "Your comprehensive appraisal is ready to be generated! Click the 'Generate Professional Appraisal' button when you're ready.",
          nextStage: 4
        };
    }
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
    const currentInput = inputMessage;
    setInputMessage('');
    setIsTyping(true);

    try {
      const { message, nextStage } = await getAIResponse(currentInput, conversationStage);
      
      // Delay to show typing indicator
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: message,
          sender: 'ai',
          timestamp: new Date()
        };
        
        setMessages(prev => [...prev, aiResponse]);
        setConversationStage(nextStage);
        setIsTyping(false);
      }, 1000);
    } catch (error) {
      setIsTyping(false);
    }
  };

  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    const newFiles = [...uploadedFiles, ...fileArray];
    setUploadedFiles(newFiles);

    // Add a message showing the uploaded files
    const fileMessage: Message = {
      id: (Date.now() + 2).toString(),
      content: `I've uploaded ${fileArray.length} additional file(s) for analysis.`,
      sender: 'user',
      timestamp: new Date(),
      images: fileArray.filter(f => f.type.startsWith('image/')),
      files: fileArray.filter(f => !f.type.startsWith('image/'))
    };

    setMessages(prev => [...prev, fileMessage]);

    // AI response to new files
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 3).toString(),
        content: "Perfect! I've received your additional files. These will be incorporated into my analysis to provide even more accurate results. The visual information is particularly valuable for identifying specific details and authenticating the piece.",
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const ResearchIndicator = ({ type }: { type: 'item-analysis' | 'market-research' | 'historical-research' }) => {
    const icons = {
      'item-analysis': Search,
      'market-research': Globe,
      'historical-research': Clock
    };
    
    const labels = {
      'item-analysis': 'Analyzing item details and authenticity',
      'market-research': 'Researching current market trends and pricing',
      'historical-research': 'Investigating historical and cultural significance'
    };

    const Icon = icons[type];

    return (
      <div className="bg-muted rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Icon className="h-5 w-5 text-primary animate-pulse" />
            <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
          </div>
          <div className="flex-1">
            <p className="text-sm">{labels[type]}</p>
            <div className="flex gap-1 mt-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
              ← Back to Search
            </Button>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" />
              <div>
                <h1>AI Jewelry Consultant</h1>
                <p className="text-sm text-muted-foreground">
                  {conversationStage === 0 ? 'Gathering information...' : 
                   conversationStage === 1 ? 'Detailed assessment...' :
                   conversationStage === 2 ? 'Final confirmation...' :
                   'Ready for appraisal'}
                </p>
              </div>
            </div>
          </div>
          {researchComplete && (
            <Button onClick={onGetAppraisal} className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Generate Professional Appraisal
            </Button>
          )}
        </div>
      </header>

      {/* Main Chat Area */}
      <div className="flex-1 flex">
        {/* Chat Messages */}
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 px-6">
            <div className="max-w-4xl mx-auto py-6 space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender === 'ai' && (
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  
                  <div className={`max-w-[70%] space-y-3 ${message.sender === 'user' ? 'order-1' : ''}`}>
                    {message.isResearching && message.researchType ? (
                      <ResearchIndicator type={message.researchType} />
                    ) : (
                      <div
                        className={`rounded-xl p-4 whitespace-pre-wrap ${
                          message.sender === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        {message.content}
                      </div>
                    )}
                    
                    {/* Display uploaded images inline */}
                    {message.images && message.images.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {message.images.map((image, index) => (
                          <div key={index} className="relative group">
                            <ImageWithFallback
                              src={getImageUrl(image)}
                              alt={`Uploaded jewelry image ${index + 1}`}
                              className="w-full h-48 object-cover rounded-lg border"
                            />
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                              {image.name}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Display uploaded files */}
                    {message.files && message.files.length > 0 && (
                      <div className="space-y-2 mt-3">
                        {message.files.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                            <Badge variant="outline">Document</Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {message.sender === 'user' && (
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                      <User className="h-5 w-5 text-secondary-foreground" />
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && !isResearching && (
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="bg-muted rounded-xl p-4">
                    <div className="flex gap-2">
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

          {/* Input Area */}
          <div className="border-t bg-card px-6 py-4">
            <div className="max-w-4xl mx-auto">
              <div className="flex gap-3 items-end">
                <div className="flex-1">
                  <div className="flex gap-2 mb-3">
                    {/* Image Upload */}
                    <div className="relative">
                      <input
                        type="file"
                        id="chat-image-upload"
                        accept="image/*"
                        multiple
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                      <label
                        htmlFor="chat-image-upload"
                        className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg cursor-pointer hover:bg-accent text-sm"
                      >
                        <ImageIcon className="h-4 w-4" />
                        Add Images
                      </label>
                    </div>

                    {/* Document Upload */}
                    <div className="relative">
                      <input
                        type="file"
                        id="chat-doc-upload"
                        accept=".pdf,.doc,.docx"
                        multiple
                        onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
                        className="hidden"
                      />
                      <label
                        htmlFor="chat-doc-upload"
                        className="flex items-center gap-2 px-3 py-2 border border-border rounded-lg cursor-pointer hover:bg-accent text-sm"
                      >
                        <FileText className="h-4 w-4" />
                        Add Documents
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Input
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Describe your jewelry in detail..."
                      className="flex-1"
                      disabled={isResearching}
                    />
                    <Button onClick={handleSendMessage} size="sm" disabled={isResearching}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar with uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="w-80 border-l bg-card">
            <Card className="h-full rounded-none border-0">
              <CardHeader>
                <CardTitle className="text-base">Analysis Files ({uploadedFiles.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-140px)]">
                  <div className="space-y-3">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        {file.type.startsWith('image/') ? (
                          <div className="relative">
                            <ImageWithFallback
                              src={getImageUrl(file)}
                              alt={file.name}
                              className="w-full h-32 object-cover rounded-lg"
                            />
                            <div className="absolute bottom-1 left-1 right-1 bg-black/70 text-white px-2 py-1 rounded text-xs truncate">
                              {file.name}
                            </div>
                            <Badge className="absolute top-2 right-2 text-xs">✓ Analyzed</Badge>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3 p-3 border rounded-lg">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="truncate text-sm">{file.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(1)} MB
                              </p>
                            </div>
                            <Badge variant="outline" className="text-xs">✓</Badge>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}