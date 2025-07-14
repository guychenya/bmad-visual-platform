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

interface Model {
  name: string;
  size: number;
  family: string;
  parameter_size: string;
  quantization: string;
}

interface OllamaStatus {
  status: 'loading' | 'ready' | 'error';
  message: string;
  running: boolean;
  version?: string;
  host?: string;
}

export default function WebChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<OllamaStatus>({ 
    status: 'loading', 
    message: 'Checking Ollama status...', 
    running: false 
  });
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeChat = async () => {
      // Add initial system message
      addSystemMessage('🌐 Welcome to Web LLM Chat! Checking Ollama connection...');
      await checkOllamaStatus();
    };
    
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const checkOllamaStatus = async () => {
    try {
      const response = await fetch('/api/llm/status');
      const data = await response.json();
      
      setOllamaStatus(data);
      
      if (data.running) {
        addSystemMessage('🚀 Connected to Ollama! Loading available models...');
        loadAvailableModels();
      } else {
        addSystemMessage('❌ Ollama is not running. Please start Ollama service.');
        setError(data.message || 'Ollama service is not available');
      }
    } catch (error) {
      console.error('Error checking Ollama status:', error);
      setOllamaStatus({
        status: 'error',
        message: 'Failed to check Ollama status',
        running: false
      });
      addSystemMessage('❌ Failed to connect to Ollama service.');
    }
  };

  const loadAvailableModels = async () => {
    try {
      const response = await fetch('/api/llm/models');
      const data = await response.json();
      
      if (data.success) {
        setAvailableModels(data.models);
        
        if (data.models.length > 0) {
          // Auto-select a good default model
          const defaultModel = data.models.find((m: Model) => m.name.includes('llama3.2:3b')) || 
                              data.models.find((m: Model) => m.name.includes('llama')) || 
                              data.models[0];
          setSelectedModel(defaultModel.name);
          addSystemMessage(`✅ Found ${data.models.length} available models. Selected: ${defaultModel.name}`);
        } else {
          addSystemMessage('⚠️ No models found. Please pull a model using: ollama pull llama3.2:3b');
        }
      } else {
        setError(data.error || 'Failed to load models');
        addSystemMessage('❌ Failed to load available models.');
      }
    } catch (error) {
      console.error('Error loading models:', error);
      setError('Failed to load available models');
      addSystemMessage('❌ Error loading models. Please check your connection.');
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
    
    if (!inputValue.trim() || isLoading || !selectedModel) return;
    
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

      const response = await fetch('/api/llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
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

  const formatModelSize = (size: number) => {
    if (size >= 1e9) return `${(size / 1e9).toFixed(1)}GB`;
    if (size >= 1e6) return `${(size / 1e6).toFixed(1)}MB`;
    return `${size} bytes`;
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
                <span>Web LLM Chat</span>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Status Indicator */}
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(ollamaStatus.status)}`} />
                  <span className="text-sm text-gray-300">
                    {ollamaStatus.status === 'loading' && 'Connecting...'}
                    {ollamaStatus.status === 'ready' && 'Connected'}
                    {ollamaStatus.status === 'error' && 'Error'}
                  </span>
                </div>
                
                {/* Model Selector */}
                <select 
                  className="bg-gray-800 text-white px-3 py-1 rounded border border-purple-500/30 text-sm"
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)}
                  disabled={ollamaStatus.status !== 'ready'}
                >
                  <option value="">Select model...</option>
                  {availableModels.map(model => (
                    <option key={model.name} value={model.name}>
                      {model.name} ({formatModelSize(model.size)})
                    </option>
                  ))}
                </select>
                
                <Button 
                  onClick={loadAvailableModels}
                  disabled={ollamaStatus.status !== 'ready'}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  Refresh Models
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
              {messages.length === 0 && ollamaStatus.status === 'ready' && (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-4">🤖</div>
                  <div className="text-lg">Welcome to Web LLM Chat!</div>
                  <div className="text-sm mt-2">Select a model above and start chatting with your local AI assistant.</div>
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
                    ollamaStatus.status === 'ready' 
                      ? selectedModel 
                        ? `Message ${selectedModel}... (Press Enter to send)`
                        : "Please select a model first..."
                      : "Connecting to Ollama..."
                  }
                  disabled={isLoading || ollamaStatus.status !== 'ready' || !selectedModel}
                  className="flex-1 bg-gray-800 border-purple-500/30 text-white placeholder-gray-400"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim() || ollamaStatus.status !== 'ready' || !selectedModel}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Model Info */}
        {selectedModel && availableModels.length > 0 && (
          <Card className="mt-4 bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-4">
              <div className="text-white">
                <div className="text-sm font-medium mb-2">Current Model:</div>
                {availableModels.find(m => m.name === selectedModel) && (
                  <div className="flex flex-wrap gap-2 text-xs">
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                      {selectedModel}
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                      {formatModelSize(availableModels.find(m => m.name === selectedModel)?.size || 0)}
                    </Badge>
                    <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                      {availableModels.find(m => m.name === selectedModel)?.family}
                    </Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}