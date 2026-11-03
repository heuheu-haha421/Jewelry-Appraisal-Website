import React, { useState } from 'react';
import { SearchInterface } from './components/SearchInterface';
import { AIChat } from './components/AIChat';
import { ChatPage } from './components/ChatPage';
import { AppraisalResults } from './components/AppraisalResults';
import { Button } from './components/ui/button';
import { MessageCircle, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

type AppState = 'search' | 'chat' | 'results' | 'loading';

interface AppraisalData {
  item: string;
  estimatedValue: {
    low: number;
    high: number;
    average: number;
  };
  marketTrend: 'up' | 'down' | 'stable';
  confidence: number;
  lastUpdated: Date;
  factors: {
    material: string;
    craftsmanship: string;
    rarity: string;
    condition: string;
    marketDemand: string;
  };
  comparables: Array<{
    item: string;
    soldPrice: number;
    soldDate: string;
    similarity: number;
  }>;
}

export default function App() {
  const [appState, setAppState] = useState<AppState>('search');
  const [searchQuery, setSearchQuery] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [showChat, setShowChat] = useState(false);
  const [appraisalData, setAppraisalData] = useState<AppraisalData | null>(null);

  // Mock data generator for demo purposes
  const generateMockAppraisal = (query: string, files: File[]): AppraisalData => {
    const baseValue = Math.floor(Math.random() * 10000) + 1000;
    const variance = baseValue * 0.3;
    
    return {
      item: query || 'Jewelry Item',
      estimatedValue: {
        low: Math.floor(baseValue - variance),
        high: Math.floor(baseValue + variance),
        average: baseValue
      },
      marketTrend: ['up', 'down', 'stable'][Math.floor(Math.random() * 3)] as 'up' | 'down' | 'stable',
      confidence: Math.floor(Math.random() * 20) + 80,
      lastUpdated: new Date(),
      factors: {
        material: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)],
        craftsmanship: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)],
        rarity: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)],
        condition: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)],
        marketDemand: ['excellent', 'good', 'fair'][Math.floor(Math.random() * 3)]
      },
      comparables: [
        {
          item: 'Similar Diamond Ring',
          soldPrice: baseValue + Math.floor(Math.random() * 1000) - 500,
          soldDate: 'Dec 2024',
          similarity: 92
        },
        {
          item: 'Comparable Gold Piece',
          soldPrice: baseValue + Math.floor(Math.random() * 1000) - 500,
          soldDate: 'Nov 2024',
          similarity: 87
        },
        {
          item: 'Related Vintage Item',
          soldPrice: baseValue + Math.floor(Math.random() * 1000) - 500,
          soldDate: 'Oct 2024',
          similarity: 84
        }
      ]
    };
  };

  // Updated to go to chat instead of loading
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setAppState('chat'); // Go directly to chat for detailed consultation
    
    toast('Starting detailed consultation...', {
      description: 'Our AI will gather comprehensive information about your jewelry'
    });
  };

  const handleFileUpload = (files: FileList) => {
    const fileArray = Array.from(files);
    setUploadedFiles(prev => [...prev, ...fileArray]);
    
    toast.success(`Uploaded ${fileArray.length} file(s)`, {
      description: 'Files will be analyzed during consultation'
    });

    // Navigate to chat page when files are uploaded
    setAppState('chat');
  };

  const handleChatToAppraisal = () => {
    setAppState('loading');
    
    toast('Generating your comprehensive appraisal...', {
      description: 'Processing all research and information gathered'
    });

    // Simulate API call with chat context - longer time for comprehensive analysis
    setTimeout(() => {
      const mockData = generateMockAppraisal(searchQuery, uploadedFiles);
      setAppraisalData(mockData);
      setAppState('results');
      
      toast.success('Professional appraisal complete!', {
        description: 'Your detailed jewelry valuation report is ready'
      });
    }, 4000); // Longer loading time to simulate comprehensive analysis
  };

  const handleBackToSearch = () => {
    setAppState('search');
    setAppraisalData(null);
    setSearchQuery('');
    setUploadedFiles([]);
    setShowChat(false);
  };

  const handleStartChat = () => {
    setAppState('chat');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Render based on app state */}
      {appState === 'search' && (
        <>
          {/* Header */}
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <div className="flex-1"></div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 py-8">
            <SearchInterface
              onSearch={handleSearch}
              onFileUpload={handleFileUpload}
            />
          </main>

          {/* AI Chat Overlay */}
          <AIChat
            isVisible={showChat}
            onClose={() => setShowChat(false)}
            initialContext={searchQuery}
          />

          {/* Floating Chat Button */}
          {!showChat && (
            <Button
              className="fixed bottom-4 right-4 rounded-full w-14 h-14 shadow-lg"
              onClick={() => setShowChat(true)}
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          )}
        </>
      )}

      {appState === 'chat' && (
        <ChatPage
          onBack={handleBackToSearch}
          onGetAppraisal={handleChatToAppraisal}
          initialContext={searchQuery}
          initialFiles={uploadedFiles}
        />
      )}

      {appState === 'loading' && (
        <>
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Button variant="ghost" onClick={handleBackToSearch} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                New Appraisal
              </Button>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <h2 className="mb-2">Comprehensive Analysis in Progress</h2>
              <p className="text-muted-foreground">
                Analyzing market data, historical trends, and cultural significance...
              </p>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <p>✓ Processing uploaded images and documents</p>
                <p>✓ Researching comparable sales data</p>
                <p>✓ Analyzing current market trends</p>
                <p className="animate-pulse">🔍 Finalizing valuation report...</p>
              </div>
            </div>
          </main>
        </>
      )}

      {appState === 'results' && appraisalData && (
        <>
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
              <Button variant="ghost" onClick={handleBackToSearch} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                New Appraisal
              </Button>
              <div className="flex-1"></div>
              <Button 
                variant="outline" 
                onClick={handleStartChat}
                className="flex items-center gap-2"
              >
                <MessageCircle className="h-4 w-4" />
                Ask Questions
              </Button>
            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            <AppraisalResults
              data={appraisalData}
              uploadedFiles={uploadedFiles}
            />
          </main>
        </>
      )}
    </div>
  );
}