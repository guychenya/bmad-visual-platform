'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
}

interface BMadAgent {
  id: string;
  name: string;
  title: string;
  icon: string;
  whenToUse: string;
  commands: string[];
}

interface ApiStatus {
  status: 'loading' | 'ready' | 'error';
  message: string;
  hasApiKeys: boolean;
  providers: Array<{id: string; name: string; models: string[]}>;
  demoMode: boolean;
}

const BMAD_AGENTS: BMadAgent[] = [
  {
    id: 'bmad-orchestrator',
    name: 'BMad Orchestrator',
    title: 'BMad Master Orchestrator',
    icon: '🎭',
    whenToUse: 'Use for workflow coordination, multi-agent tasks, role switching guidance, and when unsure which specialist to consult',
    commands: ['*help', '*agent', '*workflow', '*task', '*status', '*chat-mode']
  },
  {
    id: 'analyst',
    name: 'Mary',
    title: 'Business Analyst',
    icon: '📊',
    whenToUse: 'Use for market research, brainstorming, competitive analysis, creating project briefs, initial project discovery',
    commands: ['*help', '*create-doc', '*brainstorm', '*elicit', '*research-prompt']
  },
  {
    id: 'architect',
    name: 'Winston',
    title: 'System Architect',
    icon: '🏗️',
    whenToUse: 'Use for system architecture, technical design, infrastructure planning, and architectural decisions',
    commands: ['*help', '*create-doc', '*design', '*review-architecture']
  },
  {
    id: 'dev',
    name: 'James',
    title: 'Full Stack Developer',
    icon: '💻',
    whenToUse: 'Use for code implementation, debugging, refactoring, and development best practices',
    commands: ['*help', '*develop-story', '*run-tests', '*explain']
  },
  {
    id: 'qa',
    name: 'Quinn',
    title: 'QA Engineer',
    icon: '🔍',
    whenToUse: 'Use for testing strategies, quality assurance, test planning, and validation',
    commands: ['*help', '*test-story', '*review-quality', '*create-test-plan']
  },
  {
    id: 'sm',
    name: 'Bob',
    title: 'Scrum Master',
    icon: '📋',
    whenToUse: 'Use for project management, story creation, sprint planning, and agile workflows',
    commands: ['*help', '*create-story', '*plan-sprint', '*review-progress']
  },
  {
    id: 'ux-expert',
    name: 'Sally',
    title: 'UX Expert',
    icon: '🎨',
    whenToUse: 'Use for user experience design, UI/UX analysis, accessibility, and design systems',
    commands: ['*help', '*design-ux', '*review-design', '*create-wireframes']
  }
];

export default function BMadChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<BMadAgent>(BMAD_AGENTS[0]); // Default to orchestrator
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ 
    status: 'loading', 
    message: 'Initializing BMad system...', 
    hasApiKeys: false,
    providers: [],
    demoMode: true
  });
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  // const [activeTab, setActiveTab] = useState('chat');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const initializeBMad = async () => {
      addSystemMessage('🎭 BMad Framework Initializing...');
      await checkApiStatus();
      addSystemMessage(`✨ Welcome to BMad Chat! Currently connected to: ${selectedAgent.name} (${selectedAgent.title})`);
      addSystemMessage('💡 Pro tip: Use commands like *help to see available options, or switch agents using the tabs above!');
    };
    
    initializeBMad();
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
        message: data.success ? 'BMad system ready' : 'Failed to initialize BMad system',
        hasApiKeys: data.hasApiKeys,
        providers: data.providers || [],
        demoMode: data.demoMode
      });
      
      if (data.hasApiKeys && data.providers.length > 0) {
        const recommended = data.recommended || data.providers[0];
        setSelectedProvider(recommended.id);
        setSelectedModel(recommended.models[0]);
        addSystemMessage(`🚀 AI Provider: ${recommended.name} (${data.demoMode ? 'Demo Mode' : 'Live'})!`);
      } else {
        addSystemMessage('🎭 Running in Demo Mode - AI responses will be simulated');
        setSelectedProvider('demo');
        setSelectedModel('demo-model');
      }
    } catch (error) {
      console.error('Error checking API status:', error);
      setApiStatus({
        status: 'error',
        message: 'Failed to initialize BMad system',
        hasApiKeys: false,
        providers: [],
        demoMode: true
      });
      addSystemMessage('❌ Failed to initialize BMad system - running in offline mode');
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

  const handleAgentSwitch = (agentId: string) => {
    const agent = BMAD_AGENTS.find(a => a.id === agentId);
    if (agent) {
      setSelectedAgent(agent);
      addSystemMessage(`🔄 Switching to ${agent.name} (${agent.title})`);
      addSystemMessage(`📝 ${agent.whenToUse}`);
      addSystemMessage(`⚡ Available commands: ${agent.commands.join(', ')}`);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Check if it's a BMad command
      if (userMessage.content.startsWith('*')) {
        const command = userMessage.content.slice(1).toLowerCase();
        
        if (command === 'help') {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `🎭 **${selectedAgent.name} (${selectedAgent.title})** Help

**Available Commands:**
${selectedAgent.commands.map(cmd => `• ${cmd}`).join('\n')}

**About This Agent:**
${selectedAgent.whenToUse}

**BMad Framework:**
• Switch agents using tabs above
• Use * prefix for commands (e.g., *help)
• Each agent has specialized capabilities
• Commands are contextual to the active agent

**Current Status:** ${apiStatus.demoMode ? 'Demo Mode' : 'Live AI'} | Provider: ${selectedProvider}`,
            timestamp: new Date(),
            agentId: selectedAgent.id,
            agentName: selectedAgent.name
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          setIsLoading(false);
          return;
        }
      }

      // Prepare conversation history
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      // Send to appropriate API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: selectedProvider,
          model: selectedModel,
          message: userMessage.content,
          history,
          agentId: selectedAgent.id,
          agentContext: {
            name: selectedAgent.name,
            title: selectedAgent.title,
            role: selectedAgent.whenToUse
          }
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          agentId: selectedAgent.id,
          agentName: selectedAgent.name
        };
        setMessages(prev => [...prev, assistantMessage]);
        
        if (data.isSimulation) {
          addSystemMessage('🎭 Note: This was a simulated response. Add API keys for real AI.');
        }
      } else {
        addSystemMessage(`❌ Error: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      addSystemMessage('❌ Failed to send message. Please check your connection.');
    } finally {
      setIsLoading(false);
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎭</span>
                <span>BMad Framework Chat</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(apiStatus.status)}`} />
                  <span className="text-sm text-gray-300">
                    {apiStatus.status === 'loading' && 'Initializing...'}
                    {apiStatus.status === 'ready' && (apiStatus.hasApiKeys ? 'Live AI' : 'Demo Mode')}
                    {apiStatus.status === 'error' && 'Offline'}
                  </span>
                </div>
                
                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                  {selectedAgent.icon} {selectedAgent.name}
                </Badge>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Agent Selection Buttons */}
        <Card className="mb-6 bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {BMAD_AGENTS.map((agent) => (
                <Button
                  key={agent.id}
                  variant={selectedAgent.id === agent.id ? "default" : "outline"}
                  size="sm"
                  className={`text-xs ${
                    selectedAgent.id === agent.id 
                      ? 'bg-purple-600 text-white' 
                      : 'border-purple-500/30 text-purple-300 hover:bg-purple-500/20'
                  }`}
                  onClick={() => handleAgentSwitch(agent.id)}
                >
                  <span className="mr-1">{agent.icon}</span>
                  {agent.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chat Container */}
        <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20 h-[600px] flex flex-col">
          <CardContent className="p-0 flex-1 flex flex-col">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 && (
                <div className="text-center text-gray-400 py-8">
                  <div className="text-4xl mb-4">{selectedAgent.icon}</div>
                  <div className="text-lg">Welcome to BMad Framework Chat!</div>
                  <div className="text-sm mt-2">
                    Start by typing a message or use *help for available commands
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
                    {message.role === 'assistant' && message.agentName && (
                      <div className="text-xs opacity-70 mb-1">
                        {BMAD_AGENTS.find(a => a.id === message.agentId)?.icon} {message.agentName}
                      </div>
                    )}
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
                      <span className="text-sm">{selectedAgent.icon}</span>
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-sm">{selectedAgent.name} is thinking...</span>
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
                  placeholder={`Message ${selectedAgent.name} (${selectedAgent.title})... Try *help for commands`}
                  disabled={isLoading}
                  className="flex-1 bg-gray-800 border-purple-500/30 text-white placeholder-gray-400"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>

        {/* Agent Info */}
        <Card className="mt-4 bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-4">
            <div className="text-white">
              <div className="text-sm font-medium mb-2">Active Agent: {selectedAgent.icon} {selectedAgent.name}</div>
              <div className="text-xs text-gray-300 mb-2">{selectedAgent.whenToUse}</div>
              <div className="flex flex-wrap gap-2 text-xs">
                <Badge variant="outline" className="border-purple-500/30 text-purple-300">
                  {selectedAgent.title}
                </Badge>
                {apiStatus.demoMode && (
                  <Badge variant="outline" className="border-amber-500/30 text-amber-300">
                    Demo Mode
                  </Badge>
                )}
                <Badge variant="outline" className="border-blue-500/30 text-blue-300">
                  {selectedAgent.commands.length} commands available
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}