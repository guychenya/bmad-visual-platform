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
  Check,
  Moon,
  Sun,
  Mic,
  Paperclip,
  Camera,
  FileImage,
  Video
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
  status: 'loading' | 'ready' | 'error' | 'testing' | 'disconnected';
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
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [agentPickerPosition, setAgentPickerPosition] = useState({ x: 0, y: 0 });
  const [slashCommandsPosition, setSlashCommandsPosition] = useState({ x: 0, y: 0 });
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
  // Removed darkMode - using clean white design
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copyFeedback, setCopyFeedback] = useState<{[key: string]: boolean}>({});
  const [showUploadPanel, setShowUploadPanel] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle input change for @ and / triggers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    setInputValue(value);
    
    // Check for @ symbol to show agent picker
    const atIndex = value.lastIndexOf('@', cursorPosition - 1);
    if (atIndex !== -1 && (atIndex === 0 || value[atIndex - 1] === ' ')) {
      const afterAt = value.substring(atIndex + 1, cursorPosition);
      if (!afterAt.includes(' ')) {
        setShowAgentPicker(true);
        // Position picker above input, WhatsApp style
        const rect = e.target.getBoundingClientRect();
        setAgentPickerPosition({ 
          x: rect.left + 10, 
          y: rect.top - 320 // More space for WhatsApp-style list
        });
      }
    } else {
      setShowAgentPicker(false);
    }
    
    // Check for / symbol to show slash commands
    const slashIndex = value.lastIndexOf('/', cursorPosition - 1);
    if (slashIndex !== -1 && (slashIndex === 0 || value[slashIndex - 1] === ' ')) {
      const afterSlash = value.substring(slashIndex + 1, cursorPosition);
      if (!afterSlash.includes(' ')) {
        setShowSlashCommands(true);
        // Position commands relative to input
        const rect = e.target.getBoundingClientRect();
        setSlashCommandsPosition({ x: rect.left + 10, y: rect.top - 200 });
      }
    } else {
      setShowSlashCommands(false);
    }
  };
  
  // Handle agent selection from picker
  const handleAgentSelect = (agent: BMadAgent) => {
    const atIndex = inputValue.lastIndexOf('@');
    if (atIndex !== -1) {
      const beforeAt = inputValue.substring(0, atIndex);
      const afterAt = inputValue.substring(inputValue.indexOf(' ', atIndex) === -1 ? inputValue.length : inputValue.indexOf(' ', atIndex));
      setInputValue(beforeAt + `@${agent.name} ` + afterAt);
    }
    setShowAgentPicker(false);
    inputRef.current?.focus();
  };
  
  // Handle slash command selection
  const handleSlashCommand = (command: string, action: () => void) => {
    const slashIndex = inputValue.lastIndexOf('/');
    if (slashIndex !== -1) {
      const beforeSlash = inputValue.substring(0, slashIndex);
      const afterSlash = inputValue.substring(inputValue.indexOf(' ', slashIndex) === -1 ? inputValue.length : inputValue.indexOf(' ', slashIndex));
      setInputValue(beforeSlash + `/${command} ` + afterSlash);
    }
    setShowSlashCommands(false);
    inputRef.current?.focus();
    action();
  };
  
  // Handle GitHub integration
  const handleGitHubIntegration = async () => {
    try {
      const response = await fetch('/api/integrations/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect' })
      });
      
      const data = await response.json();
      if (data.success) {
        const integrationMessage: Message = {
          id: Date.now().toString(),
          role: 'system',
          content: `🔗 **GitHub Integration**\n\n${data.message}\n\n${data.features.map((f: string) => `• ${f}`).join('\n')}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, integrationMessage]);
      }
    } catch (error) {
      console.error('GitHub integration error:', error);
    }
  };

  // Handle Google Drive integration
  const handleDriveIntegration = async () => {
    try {
      const response = await fetch('/api/integrations/drive', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect' })
      });
      
      const data = await response.json();
      if (data.success) {
        const integrationMessage: Message = {
          id: Date.now().toString(),
          role: 'system',
          content: `📁 **Google Drive Integration**\n\n${data.message}\n\n${data.features.map((f: string) => `• ${f}`).join('\n')}`,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, integrationMessage]);
      }
    } catch (error) {
      console.error('Google Drive integration error:', error);
    }
  };

  // Voice recording functionality
  const handleVoiceRecording = async () => {
    if (isRecording) {
      setIsRecording(false);
      // Stop recording and process audio
      console.log('Stopping voice recording...');
      playSound('receive');
      
      // TODO: Process recorded audio and convert to text
      const simulatedTranscription = "Voice message transcribed successfully";
      setInputValue(simulatedTranscription);
    } else {
      try {
        // Check if browser supports speech recognition
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          alert('Speech recognition not supported in this browser. Try Chrome or Edge.');
          return;
        }
        
        setIsRecording(true);
        playSound('send');
        console.log('Starting voice recording...');
        
        // TODO: Implement actual speech recognition
        // For now, just simulate recording for 3 seconds
        setTimeout(() => {
          if (isRecording) {
            handleVoiceRecording();
          }
        }, 3000);
      } catch (error) {
        console.error('Voice recording error:', error);
        setIsRecording(false);
      }
    }
  };

  // Attachment menu options
  const attachmentOptions = [
    {
      name: 'Photo',
      description: 'Upload an image',
      icon: <Camera className="w-4 h-4" />,
      action: () => {
        setShowAttachmentMenu(false);
        // TODO: Open camera/photo picker
        console.log('Opening photo picker...');
      }
    },
    {
      name: 'Document',
      description: 'Upload a file',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        setShowAttachmentMenu(false);
        // TODO: Open file picker
        console.log('Opening file picker...');
      }
    },
    {
      name: 'Image',
      description: 'Upload from gallery',
      icon: <FileImage className="w-4 h-4" />,
      action: () => {
        setShowAttachmentMenu(false);
        // TODO: Open image gallery
        console.log('Opening image gallery...');
      }
    },
    {
      name: 'Video',
      description: 'Record or upload video',
      icon: <Video className="w-4 h-4" />,
      action: () => {
        setShowAttachmentMenu(false);
        // TODO: Open video recorder
        console.log('Opening video recorder...');
      }
    }
  ];

  // Slash commands definitions
  const slashCommands = [
    {
      name: 'github',
      description: 'Connect to GitHub repository',
      icon: <Github className="w-4 h-4" />,
      action: handleGitHubIntegration
    },
    {
      name: 'drive',
      description: 'Connect to Google Drive',
      icon: <FileText className="w-4 h-4" />,
      action: handleDriveIntegration
    },
    {
      name: 'search',
      description: 'Web search',
      icon: <Search className="w-4 h-4" />,
      action: () => {
        // Auto-fill search command
        setInputValue(inputValue.replace(/\/\w*$/, 'search: '));
      }
    },
    {
      name: 'attach',
      description: 'Attach files or media',
      icon: <Paperclip className="w-4 h-4" />,
      action: () => {
        setShowAttachmentMenu(true);
      }
    }
  ];

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
    
    // Parse message for agent mentions
    const agentMentionMatch = inputValue.match(/@(\w+)/g);
    let targetAgent = selectedAgent;
    let processedMessage = inputValue.trim();
    
    // If agent is mentioned, switch to that agent or orchestrator coordination
    if (agentMentionMatch) {
      const mentionedAgentName = agentMentionMatch[0].substring(1);
      const mentionedAgent = BMAD_AGENTS.find(agent => 
        agent.name.toLowerCase().includes(mentionedAgentName.toLowerCase())
      );
      
      if (mentionedAgent && mentionedAgent.id !== selectedAgent.id) {
        // If it's the orchestrator or we're not currently on orchestrator, switch to orchestrator for coordination
        if (mentionedAgent.id === 'bmad-orchestrator' || selectedAgent.id !== 'bmad-orchestrator') {
          targetAgent = BMAD_AGENTS.find(agent => agent.id === 'bmad-orchestrator') || selectedAgent;
          // Add coordination context to the message
          processedMessage = `User wants to involve ${mentionedAgent.name} (${mentionedAgent.title}). Original message: ${processedMessage}`;
        } else {
          targetAgent = mentionedAgent;
        }
      }
    }
    
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
          message: processedMessage,
          history,
          agentId: targetAgent.id,
          agentContext: {
            name: targetAgent.name,
            title: targetAgent.title,
            role: targetAgent.description,
            specialties: targetAgent.specialties,
            capabilities: targetAgent.specialties, // Use specialties as capabilities for now
            persona: `I am ${targetAgent.name}, ${targetAgent.title}. ${targetAgent.description}`,
            bmadFramework: true
          },
          originalMessage: userMessage.content,
          mentionedAgent: agentMentionMatch ? targetAgent.id : null,
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
          agentId: targetAgent.id,
          agentName: targetAgent.name,
          isStreaming: true,
          searchResults: searchResults ? { query: searchMatch![2], results: searchResults } : undefined
        };
        
        // Switch to target agent if different
        if (targetAgent.id !== selectedAgent.id) {
          setSelectedAgent(targetAgent);
        }

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
            agentId: targetAgent.id,
            agentName: targetAgent.name,
            isStreaming: true
          };
          
          // Switch to target agent if different
          if (targetAgent.id !== selectedAgent.id) {
            setSelectedAgent(targetAgent);
          }
          
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
    <div className={`h-screen flex flex-col transition-colors duration-200 ${
      darkMode 
        ? 'bg-gray-900' 
        : 'bg-white'
    }`}>
      {/* Header */}
      <div className={`border-b backdrop-blur-md transition-colors duration-200 ${
        darkMode
          ? 'border-gray-700 bg-gray-800/95'
          : 'border-slate-200 bg-white/95'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl ${selectedAgent.gradient} flex items-center justify-center text-white font-bold shadow-lg`}>
                {selectedAgent.avatar}
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className={`text-xl font-bold transition-colors duration-200 ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}>BMad Chat</h1>
              <div className="flex items-center space-x-2">
                <span className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>{selectedAgent.name}</span>
                <span className={`transition-colors duration-200 ${
                  darkMode ? 'text-gray-500' : 'text-slate-400'
                }`}>•</span>
                <span className={`text-sm transition-colors duration-200 ${
                  darkMode ? 'text-gray-300' : 'text-slate-600'
                }`}>{selectedAgent.title}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* API Status */}
            <Badge 
              className={`flex items-center space-x-2 px-4 py-2 rounded-full font-medium ${
                apiStatus.status === 'ready' 
                  ? (apiStatus.demoMode ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-green-50 text-green-700 border border-green-200')
                  : apiStatus.status === 'testing'
                  ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                  : 'bg-slate-50 text-slate-700 border border-slate-200'
              }`}
            >
              {apiStatus.status === 'ready' && !apiStatus.demoMode && <Wifi className="w-4 h-4" />}
              {apiStatus.status === 'ready' && apiStatus.demoMode && <WifiOff className="w-4 h-4" />}
              {apiStatus.status === 'testing' && <Loader2 className="w-4 h-4 animate-spin" />}
              {apiStatus.status === 'disconnected' && <XCircle className="w-4 h-4" />}
              <span className="text-sm">
                {apiStatus.status === 'ready' && !apiStatus.demoMode && 'AI LIVE'}
                {apiStatus.status === 'ready' && apiStatus.demoMode && 'DEMO MODE'}
                {apiStatus.status === 'testing' && 'TESTING'}
                {apiStatus.status === 'disconnected' && 'OFFLINE'}
              </span>
            </Badge>
            
            {/* Essential Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className={`h-9 w-9 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className={`h-9 w-9 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
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

      </div>

      {/* Messages */}
      <div className={`flex-1 overflow-y-auto p-6 space-y-6 transition-colors duration-200 ${
        darkMode ? 'bg-gray-800' : 'bg-slate-50'
      }`}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
              <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
                  message.role === 'user' 
                    ? 'bg-blue-500' 
                    : selectedAgent.gradient
                }`}>
                  {message.role === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <span className="text-white font-medium">{selectedAgent.avatar}</span>
                  )}
                </div>
                
                {/* Message Content */}
                <div className={`group ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                  <div className={`rounded-2xl px-4 py-3 shadow-sm transition-colors duration-200 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : darkMode
                      ? 'bg-gray-700 text-gray-100 border border-gray-600'
                      : 'bg-white text-slate-900 border border-slate-200'
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${selectedAgent.gradient}`}>
                <span className="text-white font-medium">{selectedAgent.avatar}</span>
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area with Embedded Controls */}
      <div className={`border-t p-4 transition-colors duration-200 ${
        darkMode 
          ? 'border-gray-700 bg-gray-800' 
          : 'border-slate-200 bg-white'
      }`}>
        {/* Chat Controls Row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-3">
            {/* Agent Switch Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAgentSelector(!showAgentSelector)}
              className={`h-8 px-3 rounded-lg transition-all duration-200 ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              <User className="w-3 h-3 mr-2" />
              <span className="text-xs">Switch Agent</span>
            </Button>
            
          </div>
          
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
            {selectedAgent.name} • 
            {apiStatus.demoMode ? (
              <button 
                onClick={() => setShowSidebar(true)}
                className={`ml-1 underline hover:no-underline transition-colors ${
                  darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-500'
                }`}
              >
                Demo Mode - Setup API
              </button>
            ) : (
              <span className="ml-1">Live AI</span>
            )}
          </div>
        </div>

        {/* Input Row */}
        <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
          {/* Attachment Button */}
          <div className="relative">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
              className={`h-10 w-10 rounded-full transition-all duration-200 ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white'
                  : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'
              }`}
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            
            {/* Attachment Menu */}
            {showAttachmentMenu && (
              <div className={`absolute bottom-12 left-0 rounded-xl shadow-lg border p-2 min-w-48 z-50 ${
                darkMode
                  ? 'bg-gray-800 border-gray-700'
                  : 'bg-white border-slate-200'
              }`}>
                <div className={`text-xs font-medium uppercase tracking-wider mb-2 px-2 ${
                  darkMode ? 'text-gray-400' : 'text-slate-500'
                }`}>
                  Attach
                </div>
                {attachmentOptions.map((option, index) => (
                  <div
                    key={option.name}
                    onClick={option.action}
                    className={`flex items-center space-x-3 p-2 rounded-lg cursor-pointer transition-all duration-150 ${
                      darkMode
                        ? 'hover:bg-gray-700 text-gray-300'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      darkMode ? 'bg-gray-700' : 'bg-slate-100'
                    }`}>
                      {option.icon}
                    </div>
                    <div>
                      <div className="text-sm font-medium">{option.name}</div>
                      <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                        {option.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Input Field */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              placeholder={`Message ${selectedAgent.name}... (@ for agents, / for apps)`}
              disabled={isLoading}
              className={`transition-all duration-200 pr-16 py-3 rounded-2xl ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              }`}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  setShowAgentPicker(false);
                  setShowSlashCommands(false);
                  setShowAttachmentMenu(false);
                }
              }}
            />
            
            {/* Microphone Button - Inside Input */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleVoiceRecording}
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full transition-all duration-200 ${
                isRecording
                  ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg'
                  : darkMode
                  ? 'hover:bg-gray-600 text-gray-400 hover:text-white'
                  : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'
              }`}
              title={isRecording ? 'Stop recording' : 'Start voice recording'}
            >
              <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
              {isRecording && (
                <div className="absolute inset-0 rounded-full border-2 border-red-300 animate-ping"></div>
              )}
            </Button>
          </div>
          
          {/* Send Button */}
          <Button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 h-10 w-10 shadow-sm transition-all duration-200 hover:shadow-md flex-shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </form>
      </div>

      {/* Claude/OpenAI Style Floating Sidebar */}
      {showSidebar && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={() => setShowSidebar(false)}
          />
          
          {/* Sidebar */}
          <div className={`fixed left-0 top-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out ${
            showSidebar ? 'translate-x-0' : '-translate-x-full'
          } ${darkMode ? 'bg-gray-900' : 'bg-white'} border-r ${darkMode ? 'border-gray-700' : 'border-slate-200'} shadow-xl`}>
            
            {/* Sidebar Header */}
            <div className={`flex items-center justify-between p-5 border-b ${darkMode ? 'border-gray-700/50' : 'border-slate-200/50'}`}>
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Settings
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
                className={`h-8 w-8 rounded-md ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'} transition-colors`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* API Configuration Section */}
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  API Keys
                </h3>
                
                <Button
                  onClick={() => setShowSettings(true)}
                  className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Key className="w-4 h-4 mr-2" />
                  {apiStatus.demoMode ? 'Setup API Keys' : 'Manage Keys'}
                </Button>
                
                {!apiStatus.demoMode && (
                  <div className={`mt-3 text-xs ${darkMode ? 'text-gray-500' : 'text-slate-500'}`}>
                    ✓ API keys configured
                  </div>
                )}
              </div>

              {/* Settings */}
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                      Dark Mode
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDarkMode(!darkMode)}
                      className={`h-5 w-9 rounded-full transition-colors ${
                        darkMode ? 'bg-blue-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${
                        darkMode ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                      Sound Effects
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`h-5 w-9 rounded-full transition-colors ${
                        soundEnabled ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-3 h-3 rounded-full bg-white transition-transform duration-200 ${
                        soundEnabled ? 'translate-x-4' : 'translate-x-0.5'
                      }`} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Current Agent */}
              <div>
                <h3 className={`text-xs font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  Active Agent
                </h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg ${selectedAgent.gradient} flex items-center justify-center text-white text-sm font-medium`}>
                    {selectedAgent.avatar}
                  </div>
                  <div>
                    <div className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {selectedAgent.name}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      {selectedAgent.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Original Settings Modal */}
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
      
      {/* Agent Picker Modal - WhatsApp Style */}
      {showAgentPicker && (
        <div 
          className={`fixed z-50 rounded-xl shadow-xl max-w-sm w-80 transition-colors duration-200 ${
            darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-slate-200'
          }`}
          style={{ left: agentPickerPosition.x, top: agentPickerPosition.y }}
        >
          <div className="p-2">
            <div className={`text-xs font-medium uppercase tracking-wider mb-2 px-3 py-2 flex items-center ${
              darkMode ? 'text-gray-400' : 'text-slate-500'
            }`}>
              <User className="w-3 h-3 mr-2" />
              BMad Agents
            </div>
            <div className="space-y-1 max-h-72 overflow-y-auto">
              {BMAD_AGENTS.map((agent, index) => (
                <div
                  key={agent.id}
                  onClick={() => handleAgentSelect(agent)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-150 ${
                    darkMode
                      ? 'hover:bg-gray-700 active:bg-gray-600'
                      : 'hover:bg-slate-50 active:bg-slate-100'
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className={`w-10 h-10 rounded-full ${agent.gradient} flex items-center justify-center text-white text-lg font-medium shadow-md`}>
                    {agent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold ${
                      darkMode ? 'text-gray-100' : 'text-slate-900'
                    }`}>
                      {agent.name}
                    </div>
                    <div className={`text-xs truncate ${
                      darkMode ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      {agent.title}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {agent.specialties.slice(0, 2).map((specialty, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            darkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`text-xs ${
                    darkMode ? 'text-gray-500' : 'text-slate-400'
                  }`}>
                    @{agent.name.toLowerCase()}
                  </div>
                </div>
              ))}
            </div>
            <div className={`text-xs p-3 text-center border-t mt-2 ${
              darkMode 
                ? 'text-gray-500 border-gray-700' 
                : 'text-slate-400 border-slate-200'
            }`}>
              Type @ followed by agent name
            </div>
          </div>
        </div>
      )}
      
      {/* Slash Commands Modal */}
      {showSlashCommands && (
        <div 
          className={`fixed z-50 rounded-xl shadow-xl max-w-sm w-80 transition-colors duration-200 ${
            darkMode
              ? 'bg-gray-800 border border-gray-700'
              : 'bg-white border border-slate-200'
          }`}
          style={{ left: slashCommandsPosition.x, top: slashCommandsPosition.y }}
        >
          <div className="p-2">
            <div className={`text-xs font-medium uppercase tracking-wider mb-2 px-3 py-2 flex items-center ${
              darkMode ? 'text-gray-400' : 'text-slate-500'
            }`}>
              <Zap className="w-3 h-3 mr-2" />
              Quick Actions
            </div>
            <div className="space-y-1">
              {slashCommands.map((command, index) => (
                <div
                  key={command.name}
                  onClick={() => handleSlashCommand(command.name, command.action)}
                  className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-150 ${
                    darkMode
                      ? 'hover:bg-gray-700 active:bg-gray-600'
                      : 'hover:bg-slate-50 active:bg-slate-100'
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${
                    darkMode
                      ? 'bg-gray-700 text-gray-300'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {command.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold ${
                      darkMode ? 'text-gray-100' : 'text-slate-900'
                    }`}>
                      /{command.name}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      {command.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={`text-xs p-3 text-center border-t mt-2 ${
              darkMode 
                ? 'text-gray-500 border-gray-700' 
                : 'text-slate-400 border-slate-200'
            }`}>
              Type / for quick actions
            </div>
          </div>
        </div>
      )}
    </div>
  );
}