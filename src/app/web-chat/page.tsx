'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

interface Provider {
  id: string;
  name: string;
  models: string[];
}

interface ApiStatus {
  status: 'loading' | 'ready' | 'error';
  message: string;
  hasApiKeys: boolean;
  providers: Provider[];
  recommended?: Provider;
  demoMode: boolean;
}

export default function WebChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ 
    status: 'loading', 
    message: 'Checking API status...', 
    hasApiKeys: false,
    providers: [],
    demoMode: true
  });
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      // Add initial system message
      addSystemMessage('🌐 Welcome to Web AI Chat! Checking API providers...');
      await checkApiStatus();
    };
    
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkApiStatus = async () => {
    try {
      const response = await fetch('/api/chat/status');
      const data = await response.json();
      
      setApiStatus({
        status: data.success ? 'ready' : 'error',
        message: data.success ? 'API providers checked' : 'Failed to check API status',
        hasApiKeys: data.hasApiKeys,
        providers: data.providers || [],
        recommended: data.recommended,
        demoMode: data.demoMode
      });
      
      if (data.hasApiKeys && data.providers.length > 0) {
        const recommended = data.recommended || data.providers[0];
        setSelectedProvider(recommended.id);
        setSelectedModel(recommended.models[0]);
        addSystemMessage(`🚀 Connected to ${recommended.name}! Ready to chat.`);
      } else {
        addSystemMessage('⚠️ No API keys configured. Running in demo mode.');
        setError('No API keys configured. Add API keys to enable real AI chat.');
      }
    } catch (error) {
      console.error('Error checking API status:', error);
      setApiStatus({
        status: 'error',
        message: 'Failed to check API status',
        hasApiKeys: false,
        providers: [],
        demoMode: true
      });
      addSystemMessage('❌ Failed to check API providers.');
    }
  };

  const refreshProviders = async () => {
    await checkApiStatus();
  };

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    const provider = apiStatus.providers.find(p => p.id === providerId);
    if (provider && provider.models.length > 0) {
      setSelectedModel(provider.models[0]);
    }
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: 'system',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, systemMessage]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading || !selectedProvider || !selectedModel) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);
    setError('');

    try {
      // Prepare conversation history
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: selectedProvider,
          model: selectedModel,
          message: userMessage.content,
          history
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        setError(data.error || 'Failed to get response');
        addSystemMessage(`❌ Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      addSystemMessage('❌ Failed to send message. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e as any);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-500';
      case 'loading': return 'bg-yellow-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🌐</span>
                <span>Web AI Chat</span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(apiStatus.status)}`} />
                  <span className="text-sm text-gray-300">
                    {apiStatus.status === 'loading' && 'Checking...'}
                    {apiStatus.status === 'ready' && (apiStatus.hasApiKeys ? 'Ready' : 'Demo Mode')}
                    {apiStatus.status === 'error' && 'Error'}
                  </span>
                </div>
                
                {/* Provider Selector */}
                <select 
                  className="bg-gray-800 text-white px-3 py-1 rounded border border-purple-500/30 text-sm"
                  value={selectedProvider} 
                  onChange={(e) => handleProviderChange(e.target.value)}
                  disabled={apiStatus.status !== 'ready'}
                >
                  <option value="">Select provider...</option>
                  {apiStatus.providers.map(provider => (
                    <option key={provider.id} value={provider.id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
                
                {/* Model Selector */}
                <select 
                  className="bg-gray-800 text-white px-3 py-1 rounded border border-purple-500/30 text-sm"
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={apiStatus.status !== 'ready' || !selectedProvider}
                >
                  <option value="">Select model...</option>
                  {selectedProvider && apiStatus.providers.find(p => p.id === selectedProvider)?.models.map(model => (
                    <option key={model} value={model}>
                      {model}
                    </option>
                  ))}
                </select>
                
                <Button 
                  onClick={refreshProviders}
                  disabled={apiStatus.status !== 'ready'}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  Refresh
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-4 border-red-500/30 bg-red-900/20">
            <CardContent className="p-4">
              <div className="text-red-300 flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chat Container */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20 h-[600px] flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && apiStatus.status === 'ready' && (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-4">🤖</div>
                  <div className="text-lg">Welcome to Web AI Chat!</div>
                  <div className="text-sm mt-2">
                    {apiStatus.hasApiKeys 
                      ? "Select a provider and model above to start chatting with AI." 
                      : "Running in demo mode. Add API keys to enable real AI responses."}
                  </div>
                </div>
              )}
              
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : message.role === 'assistant'
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-800 text-gray-300 border border-gray-600'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-700 text-white rounded-lg p-3 max-w-[80%]">
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-purple-500/20 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={
                    apiStatus.status === 'ready' 
                      ? selectedProvider && selectedModel 
                        ? `Message ${selectedProvider} ${selectedModel}... (Press Enter to send)`
                        : "Please select a provider and model first..."
                      : "Checking API providers..."
                  }
                  disabled={isLoading || apiStatus.status !== 'ready' || !selectedProvider || !selectedModel}
                  className="flex-1 bg-gray-800 border-purple-500/30 text-white placeholder-gray-400"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim() || apiStatus.status !== 'ready' || !selectedProvider || !selectedModel}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Provider Info */}
        {selectedProvider && selectedModel && (
          <Card className="mt-4 bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-4">
              <div className="text-white">
                <div className="text-sm font-medium mb-2">Current Configuration:</div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {apiStatus.providers.find(p => p.id === selectedProvider)?.name || selectedProvider}
                  </Badge>
                  <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                    {selectedModel}
                  </Badge>
                  {apiStatus.demoMode && (
                    <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                      Demo Mode
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}