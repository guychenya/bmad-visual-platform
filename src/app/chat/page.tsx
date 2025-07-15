'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Send, 
  Plus, 
  Settings, 
  User, 
  Bot, 
  Copy, 
  MoreHorizontal,
  Sparkles,
  Brain,
  Code,
  Zap,
  Shield,
  Palette,
  BarChart3,
  X,
  Key,
  Save,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Loader2,
  Wifi,
  WifiOff,
  Zap as Lightning,
  Search,
  Upload,
  FileText,
  Github,
  Image,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Check
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  isStreaming?: boolean;
  artifacts?: {
    type: 'code' | 'markdown' | 'html';
    content: string;
    language?: string;
  }[];
  searchResults?: {
    query: string;
    results: Array<{
      title: string;
      url: string;
      snippet: string;
      source: string;
    }>;
  };
  attachments?: {
    type: 'image' | 'file' | 'github';
    name: string;
    url: string;
    content?: string;
  }[];
}

interface BMadAgent {
  id: string;
  name: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  gradient: string;
  description: string;
  specialties: string[];
  avatar: string;
}

const BMAD_AGENTS: BMadAgent[] = [
  {
    id: 'bmad-orchestrator',
    name: 'Orchestrator',
    title: 'BMad Master Orchestrator',
    icon: <Sparkles className="w-4 h-4" />,
    color: 'from-purple-500 to-pink-500',
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    description: 'Workflow coordination and agent management',
    specialties: ['Coordination', 'Strategy', 'Workflows'],
    avatar: '🎭'
  },
  {
    id: 'analyst',
    name: 'Mary',
    title: 'Business Analyst',
    icon: <BarChart3 className="w-4 h-4" />,
    color: 'from-blue-500 to-cyan-500',
    gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    description: 'Business analysis and market research',
    specialties: ['Requirements', 'Analysis', 'Strategy'],
    avatar: '📊'
  },
  {
    id: 'architect',
    name: 'Winston',
    title: 'System Architect',
    icon: <Brain className="w-4 h-4" />,
    color: 'from-emerald-500 to-teal-500',
    gradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    description: 'System architecture and technical design',
    specialties: ['Architecture', 'Design', 'Scalability'],
    avatar: '🏗️'
  },
  {
    id: 'dev',
    name: 'James',
    title: 'Full Stack Developer',
    icon: <Code className="w-4 h-4" />,
    color: 'from-orange-500 to-red-500',
    gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
    description: 'Full-stack development and implementation',
    specialties: ['Development', 'Testing', 'Implementation'],
    avatar: '💻'
  },
  {
    id: 'qa',
    name: 'Quinn',
    title: 'QA Engineer',
    icon: <Shield className="w-4 h-4" />,
    color: 'from-rose-500 to-pink-500',
    gradient: 'bg-gradient-to-r from-rose-500 to-pink-500',
    description: 'Quality assurance and testing',
    specialties: ['Testing', 'Quality', 'Validation'],
    avatar: '🔍'
  },
  {
    id: 'sm',
    name: 'Bob',
    title: 'Scrum Master',
    icon: <Search className="w-4 h-4" />,
    color: 'from-amber-500 to-orange-500',
    gradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
    description: 'Agile project management',
    specialties: ['Agile', 'Planning', 'Coordination'],
    avatar: '📋'
  },
  {
    id: 'ux-expert',
    name: 'Sally',
    title: 'UX Expert',
    icon: <Palette className="w-4 h-4" />,
    color: 'from-violet-500 to-purple-500',
    gradient: 'bg-gradient-to-r from-violet-500 to-purple-500',
    description: 'User experience and design',
    specialties: ['UX/UI', 'Design', 'Accessibility'],
    avatar: '🎨'
  }
];

interface ApiStatus {
  status: 'loading' | 'ready' | 'error' | 'testing';
  message: string;
  hasApiKeys: boolean;
  providers: Array<{id: string; name: string; models: string[]}>;
  demoMode: boolean;
  activeProvider?: string;
  connectionQuality?: 'excellent' | 'good' | 'poor';
}

export default function ModernChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<BMadAgent>(BMAD_AGENTS[0]);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ 
    status: 'loading', 
    message: 'Initializing BMad system...', 
    hasApiKeys: false,
    providers: [],
    demoMode: true
  });
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [showSettings, setShowSettings] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    openai: '',
    claude: '',
    gemini: '',
    groq: ''
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    claude: false,
    gemini: false,
    groq: false
  });
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});
  const [testingProviders, setTestingProviders] = useState<{[key: string]: boolean}>({});
  const [darkMode, setDarkMode] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState<{[key: string]: boolean}>({});
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sound effects
  const playSound = (type: 'send' | 'receive') => {
    if (!soundEnabled) return;
    
    // Create audio context for sound effects
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (type === 'send') {
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    } else {
      oscillator.frequency.value = 600;
      gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + (type === 'send' ? 0.1 : 0.15));
  };

  // Copy to clipboard with feedback
  const copyToClipboard = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyFeedback(prev => ({ ...prev, [messageId]: true }));
      setTimeout(() => {
        setCopyFeedback(prev => ({ ...prev, [messageId]: false }));
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  // Web search function
  const performWebSearch = async (query: string) => {
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, maxResults: 5 })
      });

      const data = await response.json();
      return data.success ? data.results : [];
    } catch (error) {
      console.error('Web search error:', error);
      return [];
    }
  };

  const loadApiKeys = () => {
    if (typeof window !== 'undefined') {
      const savedKeys = localStorage.getItem('bmad-api-keys');
      if (savedKeys) {
        try {
          const keys = JSON.parse(savedKeys);
          setApiKeys(keys);
        } catch (error) {
          console.error('Error loading API keys:', error);
        }
      }
    }
  };

  const saveApiKeys = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('bmad-api-keys', JSON.stringify(apiKeys));
      setShowSettings(false);
      // Refresh API status after saving keys
      checkApiStatus();
    }
  };

  const handleApiKeyChange = (provider: string, value: string) => {
    setApiKeys(prev => ({
      ...prev,
      [provider]: value
    }));
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider as keyof typeof prev]
    }));
  };

  const testConnection = async (provider: string) => {
    const apiKey = apiKeys[provider as keyof typeof apiKeys];
    if (!apiKey?.trim()) {
      setTestResults(prev => ({
        ...prev,
        [provider]: { success: false, message: 'API key is required' }
      }));
      return;
    }

    setTestingProviders(prev => ({ ...prev, [provider]: true }));
    setApiStatus(prev => ({ ...prev, status: 'testing' }));

    try {
      const response = await fetch('/api/chat/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, apiKey })
      });

      const result = await response.json();
      setTestResults(prev => ({ ...prev, [provider]: result }));
      
      if (result.success) {
        // Update API status if this is the selected provider
        if (provider === selectedProvider) {
          setApiStatus(prev => ({
            ...prev,
            status: 'ready',
            message: `${result.provider} connected`,
            activeProvider: result.provider,
            connectionQuality: result.responseTime < 1000 ? 'excellent' : result.responseTime < 3000 ? 'good' : 'poor'
          }));
        }
      }
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [provider]: { success: false, message: 'Connection failed' }
      }));
    } finally {
      setTestingProviders(prev => ({ ...prev, [provider]: false }));
      if (apiStatus.status === 'testing') {
        setApiStatus(prev => ({ ...prev, status: 'ready' }));
      }
    }
  };

  useEffect(() => {
    const initializeBMad = async () => {
      loadApiKeys();
      await checkApiStatus();
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        role: 'assistant',
        content: `👋 Hello! I'm **${selectedAgent.name}**, your ${selectedAgent.title}. I specialize in ${selectedAgent.description}. 

**My key areas of expertise include:**
${selectedAgent.specialties.map(s => `• ${s}`).join('\n')}

**Quick commands:**
• Type \`*help\` for available commands
• Type \`*switch\` to change agents
• Type \`*capabilities\` to see what I can do
• Type \`search: your query\` for web search

${apiStatus.demoMode ? '🎭 **Demo Mode**: I\'m currently running in demo mode. Add API keys to enable real AI responses.' : '🚀 **Live AI**: Connected and ready to help!'}

How can I assist you today?`,
        timestamp: new Date(),
        agentId: selectedAgent.id,
        agentName: selectedAgent.name
      };
      setMessages([welcomeMessage]);
      
      // Focus input
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    
    initializeBMad();
  }, [selectedAgent]);

  const checkApiStatus = async () => {
    try {
      // Try POST with API keys first
      const response = await fetch('/api/chat/status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apiKeys })
      });
      
      let data;
      if (response.ok) {
        data = await response.json();
      } else {
        // Fallback to GET if POST fails
        const getResponse = await fetch('/api/chat/status');
        data = await getResponse.json();
      }
      
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
      } else {
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
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleAgentSwitch = (agent: BMadAgent) => {
    setSelectedAgent(agent);
    setShowAgentSelector(false);
  };

  const simulateTyping = (text: string, callback: (text: string) => void) => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        callback(text.substring(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
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
    setIsTyping(true);

    // Play send sound
    playSound('send');

    // Check if message contains web search request
    const searchMatch = inputValue.match(/^(search|find|look up|web search):?\s*(.+)/i);
    let searchResults = null;
    if (searchMatch) {
      const query = searchMatch[2];
      searchResults = await performWebSearch(query);
    }

    try {
      // Prepare conversation history
      const history = messages
        .filter(m => m.role !== 'system')
        .map(m => ({ role: m.role, content: m.content }));

      // Use streaming for supported providers (OpenAI, Groq)
      const useStreaming = ['openai', 'groq'].includes(selectedProvider);
      const endpoint = useStreaming ? '/api/chat/stream' : '/api/chat';
      
      const response = await fetch(endpoint, {
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
            role: selectedAgent.description
          },
          apiKeys: apiKeys
        })
      });

      if (useStreaming && response.ok) {
        // Handle streaming response
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date(),
          agentId: selectedAgent.id,
          agentName: selectedAgent.name,
          isStreaming: true,
          searchResults: searchResults ? { query: searchMatch![2], results: searchResults } : undefined
        };

        // Play receive sound when first token arrives
        let firstToken = true;
        
        setMessages(prev => [...prev, assistantMessage]);
        
        // Process streaming response
        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          let buffer = '';
          
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              
              buffer += decoder.decode(value, { stream: true });
              const lines = buffer.split('\n');
              
              // Keep the last incomplete line in buffer
              buffer = lines.pop() || '';
              
              for (const line of lines) {
                if (line.startsWith('data: ')) {
                  const data = line.slice(6);
                  if (data === '[DONE]') break;
                  
                  try {
                    const parsed = JSON.parse(data);
                    if (parsed.content) {
                      // Play receive sound on first token
                      if (firstToken) {
                        playSound('receive');
                        firstToken = false;
                      }
                      
                      setMessages(prev => prev.map(msg => 
                        msg.id === assistantMessage.id 
                          ? { ...msg, content: msg.content + parsed.content }
                          : msg
                      ));
                    }
                  } catch (e) {
                    // Skip invalid JSON
                  }
                }
              }
            }
          } catch (streamError) {
            console.error('Streaming error:', streamError);
          } finally {
            // Mark streaming as complete
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, isStreaming: false }
                : msg
            ));
          }
        }
      } else {
        // Handle non-streaming response
        const data = await response.json();
        
        if (data.success) {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: '',
            timestamp: new Date(),
            agentId: selectedAgent.id,
            agentName: selectedAgent.name,
            isStreaming: true
          };
          
          setMessages(prev => [...prev, assistantMessage]);
          
          // Simulate typing for non-streaming responses
          simulateTyping(data.response, (partialText) => {
            setMessages(prev => prev.map(msg => 
              msg.id === assistantMessage.id 
                ? { ...msg, content: partialText }
                : msg
            ));
          });
        } else {
          const errorMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: 'system',
            content: `❌ Error: ${data.error || 'Unknown error'}`,
            timestamp: new Date()
          };
          setMessages(prev => [...prev, errorMessage]);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'system',
        content: '❌ Failed to send message. Please check your connection.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };


  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`h-screen ${
      darkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
    } flex flex-col transition-colors duration-300`}>
      {/* Header */}
      <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-md">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-full ${selectedAgent.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                {selectedAgent.icon}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900"></div>
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{selectedAgent.name}</h1>
              <p className="text-sm text-gray-400">{selectedAgent.title}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAgentSelector(!showAgentSelector)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <User className="w-4 h-4 mr-2" />
              Switch Agent
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDarkMode(!darkMode)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowUploadPanel(!showUploadPanel)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Upload className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(true)}
              className="text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Agent Selector */}
        {showAgentSelector && (
          <div className="border-t border-gray-700/50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {BMAD_AGENTS.map((agent) => (
                <Card 
                  key={agent.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 bg-gray-800/50 border-gray-700/50 hover:border-gray-600 ${
                    selectedAgent.id === agent.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleAgentSwitch(agent)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full ${agent.gradient} flex items-center justify-center text-white`}>
                        {agent.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-white">{agent.name}</h3>
                        <p className="text-sm text-gray-400">{agent.title}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">{agent.description}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {agent.specialties.map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="secondary"
                          className="text-xs bg-gray-700/50 text-gray-300"
                        >
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Upload Panel */}
        {showUploadPanel && (
          <div className="border-t border-gray-700/50 p-4 bg-gray-800/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                <Image className="w-5 h-5 text-blue-400" />
                <div>
                  <div className="text-sm font-medium text-white">Upload Image</div>
                  <div className="text-xs text-gray-400">JPG, PNG, WebP</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                <FileText className="w-5 h-5 text-green-400" />
                <div>
                  <div className="text-sm font-medium text-white">Upload File</div>
                  <div className="text-xs text-gray-400">MD, TXT, CSV</div>
                </div>
              </div>
              <div className="flex items-center space-x-2 p-3 border border-gray-600 rounded-lg hover:bg-gray-700/50 cursor-pointer">
                <Github className="w-5 h-5 text-purple-400" />
                <div>
                  <div className="text-sm font-medium text-white">GitHub Repo</div>
                  <div className="text-xs text-gray-400">Paste URL</div>
                </div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500 text-center">
              🚧 File upload features coming soon! For now, you can use web search with &quot;search: your query&quot;
            </div>
          </div>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.role === 'user' 
                    ? 'bg-blue-500' 
                    : selectedAgent.gradient
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    selectedAgent.icon
                  )}
                </div>
                
                {/* Message Content */}
                <div className={`group ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`rounded-2xl px-4 py-3 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-100'
                  }`}>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                      {message.isStreaming && isTyping && (
                        <span className="inline-block w-2 h-4 bg-gray-400 ml-1 animate-pulse"></span>
                      )}
                    </div>

                    {/* Search Results */}
                    {message.searchResults && (
                      <div className="mt-3 pt-3 border-t border-gray-600">
                        <div className="flex items-center space-x-2 mb-2">
                          <Search className="w-4 h-4 text-blue-400" />
                          <span className="text-xs font-medium text-blue-400">
                            Web Search: &quot;{message.searchResults.query}&quot;
                          </span>
                        </div>
                        <div className="space-y-2">
                          {message.searchResults.results.slice(0, 3).map((result, idx) => (
                            <div key={idx} className="bg-gray-700 rounded-lg p-3">
                              <a
                                href={result.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-400 hover:text-blue-300 font-medium text-sm block mb-1"
                              >
                                {result.title}
                              </a>
                              <p className="text-xs text-gray-300 leading-relaxed">
                                {result.snippet}
                              </p>
                              <span className="text-xs text-gray-500 mt-1 block">
                                {result.source}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Message Actions */}
                  <div className={`flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content, message.id)}
                      className="text-gray-500 hover:text-gray-300 h-6 px-2 relative"
                    >
                      {copyFeedback[message.id] ? (
                        <Check className="w-3 h-3 text-green-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      {copyFeedback[message.id] && (
                        <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-2 py-1 rounded shadow-lg">
                          Copied!
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-gray-300 h-6 px-2"
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                    <span className="text-xs text-gray-500">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedAgent.gradient}`}>
                {selectedAgent.icon}
              </div>
              <div className="bg-gray-800 rounded-2xl px-4 py-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-700/50 bg-gray-900/50 backdrop-blur-md p-6">
        <form onSubmit={handleSendMessage} className="flex items-end space-x-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800 mb-2"
          >
            <Plus className="w-4 h-4" />
          </Button>
          
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message ${selectedAgent.name}...`}
              disabled={isLoading}
              className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 py-3 rounded-2xl resize-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                }
              }}
            />
            
            <Button
              type="submit"
              disabled={isLoading || !inputValue.trim()}
              className="absolute right-2 bottom-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 h-8 w-8"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </form>
        
        <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span>BMad Framework • {selectedAgent.name}</span>
            <div className="flex items-center space-x-2">
              {/* Status Icon */}
              {apiStatus.status === 'ready' && !apiStatus.demoMode ? (
                <div className="flex items-center space-x-1">
                  {apiStatus.connectionQuality === 'excellent' ? (
                    <Lightning className="w-3 h-3 text-green-400" />
                  ) : (
                    <Wifi className="w-3 h-3 text-green-400" />
                  )}
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              ) : apiStatus.status === 'testing' ? (
                <div className="flex items-center space-x-1">
                  <Loader2 className="w-3 h-3 text-blue-400 animate-spin" />
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                </div>
              ) : apiStatus.status === 'loading' ? (
                <div className="flex items-center space-x-1">
                  <Loader2 className="w-3 h-3 text-yellow-400 animate-spin" />
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                </div>
              ) : apiStatus.demoMode ? (
                <div className="flex items-center space-x-1">
                  <Bot className="w-3 h-3 text-purple-400" />
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                </div>
              ) : (
                <div className="flex items-center space-x-1">
                  <WifiOff className="w-3 h-3 text-red-400" />
                  <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                </div>
              )}
              
              {/* Status Text */}
              <span className="font-medium">
                {apiStatus.status === 'ready' && !apiStatus.demoMode 
                  ? `🔥 AI-LIVE ${apiStatus.activeProvider ? `(${apiStatus.activeProvider})` : ''}`
                  : apiStatus.status === 'testing' 
                  ? '🔍 TESTING CONNECTION...'
                  : apiStatus.status === 'loading' 
                  ? '⏳ INITIALIZING...' 
                  : apiStatus.demoMode 
                  ? '🎭 DEMO MODE'
                  : '❌ OFFLINE'
                }
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3" />
            <span>Press Enter to send</span>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <Key className="w-5 h-5 mr-2" />
                API Configuration
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSettings(false)}
                className="text-gray-400 hover:text-white hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-400 mb-4">
                Add your API keys to enable real AI responses. Keys are stored locally in your browser.
              </p>

              {/* OpenAI */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">OpenAI API Key</label>
                <div className="relative">
                  <Input
                    type={showKeys.openai ? 'text' : 'password'}
                    value={apiKeys.openai}
                    onChange={(e) => handleApiKeyChange('openai', e.target.value)}
                    placeholder="sk-..."
                    className="bg-gray-800 border-gray-700 text-white pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testConnection('openai')}
                      disabled={!apiKeys.openai?.trim() || testingProviders.openai}
                      className="text-gray-400 hover:text-white h-6 px-1"
                    >
                      {testingProviders.openai ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : testResults.openai?.success ? (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      ) : testResults.openai?.success === false ? (
                        <XCircle className="w-3 h-3 text-red-400" />
                      ) : (
                        <Wifi className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility('openai')}
                      className="text-gray-400 hover:text-white h-6 px-1"
                    >
                      {showKeys.openai ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                {testResults.openai && (
                  <div className={`text-xs ${testResults.openai.success ? 'text-green-400' : 'text-red-400'}`}>
                    {testResults.openai.message} {testResults.openai.responseTime && `(${testResults.openai.responseTime}ms)`}
                  </div>
                )}
              </div>

              {/* Claude */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Claude API Key</label>
                <div className="relative">
                  <Input
                    type={showKeys.claude ? 'text' : 'password'}
                    value={apiKeys.claude}
                    onChange={(e) => handleApiKeyChange('claude', e.target.value)}
                    placeholder="sk-ant-..."
                    className="bg-gray-800 border-gray-700 text-white pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testConnection('claude')}
                      disabled={!apiKeys.claude?.trim() || testingProviders.claude}
                      className="text-gray-400 hover:text-white h-6 px-1"
                    >
                      {testingProviders.claude ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : testResults.claude?.success ? (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      ) : testResults.claude?.success === false ? (
                        <XCircle className="w-3 h-3 text-red-400" />
                      ) : (
                        <Wifi className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility('claude')}
                      className="text-gray-400 hover:text-white h-6 px-1"
                    >
                      {showKeys.claude ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                {testResults.claude && (
                  <div className={`text-xs ${testResults.claude.success ? 'text-green-400' : 'text-red-400'}`}>
                    {testResults.claude.message} {testResults.claude.responseTime && `(${testResults.claude.responseTime}ms)`}
                  </div>
                )}
              </div>

              {/* Gemini */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Gemini API Key</label>
                <div className="relative">
                  <Input
                    type={showKeys.gemini ? 'text' : 'password'}
                    value={apiKeys.gemini}
                    onChange={(e) => handleApiKeyChange('gemini', e.target.value)}
                    placeholder="AI..."
                    className="bg-gray-800 border-gray-700 text-white pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testConnection('gemini')}
                      disabled={!apiKeys.gemini?.trim() || testingProviders.gemini}
                      className="text-gray-400 hover:text-white h-6 px-1"
                    >
                      {testingProviders.gemini ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : testResults.gemini?.success ? (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      ) : testResults.gemini?.success === false ? (
                        <XCircle className="w-3 h-3 text-red-400" />
                      ) : (
                        <Wifi className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility('gemini')}
                      className="text-gray-400 hover:text-white h-6 px-1"
                    >
                      {showKeys.gemini ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                {testResults.gemini && (
                  <div className={`text-xs ${testResults.gemini.success ? 'text-green-400' : 'text-red-400'}`}>
                    {testResults.gemini.message} {testResults.gemini.responseTime && `(${testResults.gemini.responseTime}ms)`}
                  </div>
                )}
              </div>

              {/* Groq */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 flex items-center">
                  Groq API Key <Lightning className="w-3 h-3 ml-1 text-yellow-400" /> <span className="text-xs text-yellow-400 ml-1">Super Fast!</span>
                </label>
                <div className="relative">
                  <Input
                    type={showKeys.groq ? 'text' : 'password'}
                    value={apiKeys.groq}
                    onChange={(e) => handleApiKeyChange('groq', e.target.value)}
                    placeholder="gsk_..."
                    className="bg-gray-800 border-gray-700 text-white pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => testConnection('groq')}
                      disabled={!apiKeys.groq?.trim() || testingProviders.groq}
                      className="text-gray-400 hover:text-white h-6 px-1"
                    >
                      {testingProviders.groq ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : testResults.groq?.success ? (
                        <CheckCircle className="w-3 h-3 text-green-400" />
                      ) : testResults.groq?.success === false ? (
                        <XCircle className="w-3 h-3 text-red-400" />
                      ) : (
                        <Lightning className="w-3 h-3" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleKeyVisibility('groq')}
                      className="text-gray-400 hover:text-white h-6 px-1"
                    >
                      {showKeys.groq ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                {testResults.groq && (
                  <div className={`text-xs ${testResults.groq.success ? 'text-green-400' : 'text-red-400'}`}>
                    {testResults.groq.message} {testResults.groq.responseTime && `(${testResults.groq.responseTime}ms)`}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={saveApiKeys}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Keys
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}