'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
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
  Volume2,
  VolumeX,
  Check,
  Moon,
  Sun,
  Mic,
  Paperclip,
  Camera,
  FileImage,
  Video,
  MessageSquare,
  Users,
  Lightbulb,
  Building2,
  Code2,
  TestTube,
  Rocket,
  ShieldCheck,
  BarChart,
  Target
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
    type: 'image' | 'document' | 'video' | 'file' | 'github';
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
  connectedProviders: string[];
  failoverActive: boolean;
  lastFailover: { from: string; to: string; timestamp: Date } | null;
  validatedConnections: Record<string, { 
    isValid: boolean; 
    lastTested: Date; 
    responseTime: number; 
    priority: number; 
  }>;
}

export default function ModernChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [showSlashCommands, setShowSlashCommands] = useState(false);
  const [agentPickerPosition, setAgentPickerPosition] = useState({ x: 0, y: 0 });
  const [slashCommandsPosition, setSlashCommandsPosition] = useState({ x: 0, y: 0 });
  const [selectedAgentIndex, setSelectedAgentIndex] = useState(0);
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0);
  const [selectedAgent, setSelectedAgent] = useState<BMadAgent>(BMAD_AGENTS[0]);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [apiStatus, setApiStatus] = useState<ApiStatus>({ 
    status: 'loading', 
    message: 'Initializing BMad system...', 
    hasApiKeys: false,
    providers: [],
    demoMode: true,
    connectedProviders: [],
    failoverActive: false,
    lastFailover: null,
    validatedConnections: {}
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
  const [currentAttachments, setCurrentAttachments] = useState<{
    type: 'image' | 'document' | 'video' | 'file';
    name: string;
    url: string;
    content: string;
    size: number;
    mimeType: string;
  }[]>([]);

  const [chatReferences, setChatReferences] = useState<{
    id: string;
    title: string;
    messageCount: number;
    agent: BMadAgent;
    timestamp: Date;
    summary: string;
  }[]>([]);

  // Chat history and navigation state
  const [chatHistory, setChatHistory] = useState<{
    id: string;
    title: string;
    timestamp: Date;
    messages: Message[];
    stage: 'discovery' | 'analysis' | 'development' | 'testing' | 'deployment' | 'completed';
    deliverables: {
      type: 'document' | 'code' | 'report' | 'specification';
      title: string;
      content: string;
      downloadUrl?: string;
      isReady: boolean;
    }[];
    agent: BMadAgent;
  }[]>([
    // Demo chat for testing drag and drop
    {
      id: 'demo-1',
      title: 'Project Planning Discussion',
      timestamp: new Date(Date.now() - 86400000), // 1 day ago
      messages: [
        {
          id: 'demo-msg-1',
          role: 'user',
          content: 'I need help planning a new web application project.',
          timestamp: new Date(Date.now() - 86400000),
        },
        {
          id: 'demo-msg-2', 
          role: 'assistant',
          content: 'I\'d be happy to help you plan your web application! Let\'s start by understanding your requirements and goals.',
          timestamp: new Date(Date.now() - 86400000 + 60000),
        }
      ],
      stage: 'discovery' as const,
      deliverables: [
        {
          type: 'document' as const,
          title: 'Project Requirements',
          content: 'Initial project scope and requirements',
          isReady: true
        }
      ],
      agent: BMAD_AGENTS[0] // Use first agent as default
    },
    {
      id: 'demo-2', 
      title: 'UI/UX Design Chat',
      timestamp: new Date(Date.now() - 172800000), // 2 days ago
      messages: [
        {
          id: 'demo-msg-3',
          role: 'user', 
          content: 'Can you help me improve the user interface design?',
          timestamp: new Date(Date.now() - 172800000),
        },
        {
          id: 'demo-msg-4',
          role: 'assistant',
          content: 'Absolutely! Let\'s discuss your current design challenges and explore some modern UI patterns that could work well for your project.',
          timestamp: new Date(Date.now() - 172800000 + 30000),
        }
      ],
      stage: 'analysis' as const,
      deliverables: [
        {
          type: 'document' as const,
          title: 'UI Design Guidelines',
          content: 'Design system and component guidelines',
          isReady: true
        }
      ],
      agent: BMAD_AGENTS[1] || BMAD_AGENTS[0] // Use second agent or fallback
    }
  ]);
  
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [showChatHistory, setShowChatHistory] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragOverType, setDragOverType] = useState<'chat' | 'file' | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Chat history management
  const createNewChat = () => {
    const newChatId = Date.now().toString();
    const newChat = {
      id: newChatId,
      title: `Chat with ${selectedAgent.name}`,
      timestamp: new Date(),
      messages: [],
      stage: 'discovery' as const,
      deliverables: [],
      agent: selectedAgent
    };
    
    setChatHistory(prev => {
      const updatedHistory = [newChat, ...prev];
      saveChatHistory(updatedHistory);
      return updatedHistory;
    });
    setCurrentChatId(newChatId);
    setMessages([]);
    
    // Auto-focus input for new chat
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  const saveCurrentChat = useCallback(() => {
    if (!currentChatId) return;
    
    setChatHistory(prev => {
      const updatedHistory = prev.map(chat => 
        chat.id === currentChatId 
          ? { ...chat, messages: [...messages], timestamp: new Date() }
          : chat
      );
      saveChatHistory(updatedHistory);
      return updatedHistory;
    });
  }, [currentChatId, messages]);

  const loadChat = (chatId: string) => {
    const chat = chatHistory.find(c => c.id === chatId);
    if (chat) {
      setCurrentChatId(chatId);
      setMessages(chat.messages);
      setSelectedAgent(chat.agent);
      
      // Auto-focus input when loading chat
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const generateDeliverables = (messages: Message[], stage: string) => {
    const deliverables = [];
    
    if (stage === 'analysis' || stage === 'development') {
      const requirements = messages.filter(m => 
        m.content.toLowerCase().includes('requirement') || 
        m.content.toLowerCase().includes('need') ||
        m.content.toLowerCase().includes('feature')
      );
      
      if (requirements.length > 0) {
        deliverables.push({
          type: 'document' as const,
          title: 'Requirements Document',
          content: requirements.map(m => `- ${m.content}`).join('\n'),
          isReady: true
        });
      }
    }
    
    if (stage === 'development' || stage === 'testing') {
      const codeMessages = messages.filter(m => m.content.includes('```'));
      if (codeMessages.length > 0) {
        deliverables.push({
          type: 'code' as const,
          title: 'Code Implementation',
          content: codeMessages.map(m => m.content).join('\n\n'),
          isReady: true
        });
      }
    }
    
    if (stage === 'testing' || stage === 'deployment') {
      const testMessages = messages.filter(m => 
        m.content.toLowerCase().includes('test') || 
        m.content.toLowerCase().includes('verify')
      );
      
      if (testMessages.length > 0) {
        deliverables.push({
          type: 'report' as const,
          title: 'Test Report',
          content: testMessages.map(m => `- ${m.content}`).join('\n'),
          isReady: true
        });
      }
    }
    
    return deliverables;
  };

  const determineStage = (messages: Message[]): 'discovery' | 'analysis' | 'development' | 'testing' | 'deployment' | 'completed' => {
    const messageCount = messages.length;
    const hasCodeContent = messages.some(m => m.content.includes('```'));
    const hasTestingKeywords = messages.some(m => m.content.toLowerCase().includes('test'));
    
    if (messageCount < 5) return 'discovery';
    if (messageCount < 10 && !hasCodeContent) return 'analysis';
    if (hasCodeContent && !hasTestingKeywords) return 'development';
    if (hasTestingKeywords) return 'testing';
    return 'deployment';
  };

  const downloadDeliverable = (deliverable: any) => {
    const blob = new Blob([deliverable.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${deliverable.title}.${deliverable.type === 'code' ? 'js' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Intelligent failover system
  const attemptFailover = async (failedProvider: string): Promise<string | null> => {
    console.log(`Attempting failover from ${failedProvider}`);
    
    const validConnections = Object.entries(apiStatus.validatedConnections)
      .filter(([provider, config]) => 
        config.isValid && 
        provider !== failedProvider &&
        apiStatus.connectedProviders.includes(provider)
      )
      .sort((a, b) => a[1].priority - b[1].priority);

    if (validConnections.length === 0) {
      console.log('No valid connections available for failover');
      return null;
    }

    const fallbackProvider = validConnections[0][0];
    console.log(`Failing over to ${fallbackProvider}`);
    
    setApiStatus(prev => ({
      ...prev,
      failoverActive: true,
      lastFailover: {
        from: failedProvider,
        to: fallbackProvider,
        timestamp: new Date()
      }
    }));

    setSelectedProvider(fallbackProvider);
    return fallbackProvider;
  };

  const updateConnectionStatus = (provider: string, isValid: boolean, responseTime: number = 0) => {
    setApiStatus(prev => ({
      ...prev,
      validatedConnections: {
        ...prev.validatedConnections,
        [provider]: {
          isValid,
          lastTested: new Date(),
          responseTime,
          priority: ['groq', 'openai', 'claude', 'gemini'].indexOf(provider) + 1
        }
      },
      connectedProviders: isValid 
        ? [...prev.connectedProviders.filter(p => p !== provider), provider]
        : prev.connectedProviders.filter(p => p !== provider)
    }));
  };

  // Handle input change for @ and / triggers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart || 0;
    
    setInputValue(value);
    
    // Check for @ symbol to show agent picker
    const atIndex = value.lastIndexOf('@', cursorPosition - 1);
    
    console.log('@ Detection Debug:', {
      value,
      cursorPosition,
      atIndex,
      showAgentPicker
    });
    
    if (atIndex !== -1) {
      // More flexible @ detection - allow @ at start or after space/newline
      const charBeforeAt = atIndex > 0 ? value[atIndex - 1] : ' ';
      const isValidTrigger = /[\s\n\r]/.test(charBeforeAt) || atIndex === 0;
      
      if (isValidTrigger) {
        const afterAt = value.substring(atIndex + 1, cursorPosition);
        // Only show picker if we haven't typed a space after @
        if (!afterAt.includes(' ') && !afterAt.includes('\n')) {
          console.log('Showing agent picker!', { afterAt });
          setShowAgentPicker(true);
          setSelectedAgentIndex(0); // Reset selection when showing picker
          
          // Position picker with enhanced safety checks
          const rect = e.target.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          const viewportWidth = window.innerWidth;
          const modalWidth = Math.min(500, viewportWidth * 0.9); // Match actual modal width
          // Calculate actual modal height based on content
          // Header: ~60px, Grid: 9 agents in 2 cols = 5 rows * 70px = 350px, Footer: ~50px, Padding: ~32px
          const modalHeight = Math.min(492, viewportHeight * 0.8); // Total ~492px or 80% of viewport
          
          console.log('Input rect:', rect);
          console.log('Viewport:', { viewportWidth, viewportHeight });
          console.log('Modal dimensions:', { modalWidth, modalHeight });
          
          // Center the popup horizontally on screen
          let x = Math.max(20, (viewportWidth - modalWidth) / 2);
          
          // Calculate optimal y position - prioritize showing full modal
          let y = rect.top - modalHeight - 60; // Space above input
          
          // If modal would be cut off at top, try below input first
          if (y < 20) {
            y = rect.bottom + 20; // Below input with margin
            
            // If still doesn't fit below, use center positioning
            if (y + modalHeight > viewportHeight - 40) {
              y = Math.max(20, (viewportHeight - modalHeight) / 2);
              
              // Final fallback - ensure at least it starts visible
              if (y < 20) {
                y = 20;
              }
            }
          }
          
          // Ensure modal doesn't extend beyond bottom of viewport
          if (y + modalHeight > viewportHeight - 40) {
            y = Math.max(20, viewportHeight - modalHeight - 40);
          }
          
          console.log('Final position:', { x, y });
          setAgentPickerPosition({ x, y });
        }
      }
    }
    
    // Only hide if we're clearly not in an @ context
    if (atIndex === -1 || cursorPosition <= atIndex) {
      if (showAgentPicker) {
        console.log('Hiding agent picker');
        setShowAgentPicker(false);
      }
    }
    
    // Check for / symbol to show slash commands
    const slashIndex = value.lastIndexOf('/', cursorPosition - 1);
    if (slashIndex !== -1 && (slashIndex === 0 || value[slashIndex - 1] === ' ')) {
      const afterSlash = value.substring(slashIndex + 1, cursorPosition);
      if (!afterSlash.includes(' ')) {
        setShowSlashCommands(true);
        setSelectedSlashIndex(0); // Reset selection when showing commands
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
  // File input refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Handle file attachment
  const handleFileAttachment = (file: File, type: 'image' | 'document' | 'video' | 'file') => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const content = e.target?.result as string;
      
      // Create attachment object
      const attachment = {
        type: type,
        name: file.name,
        url: content,
        content: content,
        size: file.size,
        mimeType: file.type
      };
      
      // Add to current attachments
      setCurrentAttachments(prev => [...prev, attachment]);
      
      // Add file reference to input value
      const fileReference = `📎 ${file.name}`;
      const currentInput = inputValue.trim();
      const newInput = currentInput ? `${currentInput}\n\n${fileReference}` : fileReference;
      
      setInputValue(newInput);
      
      console.log('File attached:', attachment);
    };
    
    // Read file based on type
    if (type === 'image' || type === 'video') {
      reader.readAsDataURL(file);
    } else {
      reader.readAsText(file);
    }
  };

  const attachmentOptions = [
    {
      name: 'Photo',
      description: 'Upload an image',
      icon: <Camera className="w-4 h-4" />,
      action: () => {
        setShowAttachmentMenu(false);
        imageInputRef.current?.click();
      }
    },
    {
      name: 'Document',
      description: 'Upload a file',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        setShowAttachmentMenu(false);
        fileInputRef.current?.click();
      }
    },
    {
      name: 'Image',
      description: 'Upload from gallery',
      icon: <FileImage className="w-4 h-4" />,
      action: () => {
        setShowAttachmentMenu(false);
        imageInputRef.current?.click();
      }
    },
    {
      name: 'Video',
      description: 'Record or upload video',
      icon: <Video className="w-4 h-4" />,
      action: () => {
        setShowAttachmentMenu(false);
        videoInputRef.current?.click();
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

  const loadChatHistory = () => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('bmad-chat-history');
      if (savedHistory) {
        try {
          const history = JSON.parse(savedHistory);
          // Convert timestamp strings back to Date objects
          const processedHistory = history.map((chat: any) => ({
            ...chat,
            timestamp: new Date(chat.timestamp),
            messages: chat.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp)
            }))
          }));
          setChatHistory(processedHistory);
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      }
    }
  };

  const saveChatHistory = useCallback((history: typeof chatHistory) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('bmad-chat-history', JSON.stringify(history));
      } catch (error) {
        console.error('Error saving chat history:', error);
      }
    }
  }, []);

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

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const types = Array.from(e.dataTransfer.types);
    console.log('Drag over - types:', types); // Debug log
    
    if (types.includes('application/chat-history')) {
      setDragOverType('chat');
    } else if (types.includes('Files')) {
      setDragOverType('file');
    } else {
      setDragOverType('chat'); // Default to chat for text/plain
    }
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Use a timeout to prevent flicker when dragging over child elements
    setTimeout(() => {
      setIsDragOver(false);
      setDragOverType(null);
    }, 100);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    console.log('Drop event triggered!', e.dataTransfer.types); // Debug log

    // Handle chat history drop
    const chatData = e.dataTransfer.getData('application/chat-history');
    console.log('Chat data:', chatData); // Debug log
    
    if (chatData) {
      try {
        const chat = JSON.parse(chatData);
        
        // Create a chat reference card instead of pasting text
        const chatReference = {
          id: chat.id,
          title: chat.title,
          messageCount: chat.messages.length,
          agent: chat.agent || BMAD_AGENTS[0],
          timestamp: new Date(chat.timestamp || Date.now()),
          summary: chat.messages.length > 0 ? chat.messages[0].content.substring(0, 100) + '...' : 'No messages'
        };
        
        setChatReferences(prev => [...prev, chatReference]);
        setDragOverType(null);
        console.log('Chat reference added!'); // Debug log
        return;
      } catch (error) {
        console.error('Error parsing chat data:', error);
      }
    }

    // Handle file drop
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      files.forEach(file => handleFileUpload(file));
      setDragOverType(null);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      alert('File size too large. Please select a file under 50MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const attachment = {
        type: file.type.startsWith('image/') ? 'image' as const :
              file.type.startsWith('video/') ? 'video' as const :
              'document' as const,
        name: file.name,
        url: result,
        content: file.type.startsWith('text/') ? result : `File: ${file.name}`,
        size: file.size,
        mimeType: file.type
      };
      
      setCurrentAttachments(prev => [...prev, attachment]);
      
      // Don't add to input - just show as attachment card
    };
    
    if (file.type.startsWith('text/')) {
      reader.readAsText(file);
    } else if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      reader.readAsDataURL(file);
    } else {
      // For other files, just create a reference
      const attachment = {
        type: 'document' as const,
        name: file.name,
        url: '',
        content: `File: ${file.name}`,
        size: file.size,
        mimeType: file.type
      };
      
      setCurrentAttachments(prev => [...prev, attachment]);
      // Don't add to input - just show as attachment card
    }
  };

  const removeChatReference = (id: string) => {
    setChatReferences(prev => prev.filter(ref => ref.id !== id));
  };

  const deleteChat = (chatId: string) => {
    setChatHistory(prev => {
      const updatedHistory = prev.filter(chat => chat.id !== chatId);
      saveChatHistory(updatedHistory);
      return updatedHistory;
    });
    // If the deleted chat was the current one, clear the current chat
    if (currentChatId === chatId) {
      setCurrentChatId(null);
      setMessages([]);
    }
    setShowChatMenu(null);
  };

  // Get icon for agent based on their role
  const getAgentIcon = (agent: BMadAgent) => {
    const iconClass = "w-8 h-8";
    switch (agent.id) {
      case 'bmad-orchestrator':
        return <Users className={iconClass} />;
      case 'analyst':
        return <BarChart className={iconClass} />;
      case 'architect':
        return <Building2 className={iconClass} />;
      case 'dev':
        return <Code2 className={iconClass} />;
      case 'qa':
        return <TestTube className={iconClass} />;
      case 'sm':
        return <Target className={iconClass} />;
      case 'deploy':
        return <Rocket className={iconClass} />;
      case 'security':
        return <ShieldCheck className={iconClass} />;
      case 'ui-ux':
        return <Palette className={iconClass} />;
      default:
        return <Lightbulb className={iconClass} />;
    }
  };

  useEffect(() => {
    const initializeBMad = async () => {
      loadApiKeys();
      loadChatHistory();
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
  }, [selectedAgent, apiStatus.demoMode]);

  const checkApiStatus = useCallback(async () => {
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
        demoMode: data.demoMode,
        connectedProviders: [],
        failoverActive: false,
        lastFailover: null,
        validatedConnections: {}
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
        demoMode: true,
        connectedProviders: [],
        failoverActive: false,
        lastFailover: null,
        validatedConnections: {}
      });
    }
  }, [apiKeys]);

  useEffect(() => {
    scrollToBottom();
    
    // Auto-save current chat when messages change
    if (currentChatId && messages.length > 0) {
      saveCurrentChat();
      
      // Update chat stage based on conversation progress
      const stage = determineStage(messages);
      const deliverables = generateDeliverables(messages, stage);
      
      setChatHistory(prev => {
        const updatedHistory = prev.map(chat => 
          chat.id === currentChatId 
            ? { ...chat, stage, messages: [...messages], deliverables }
            : chat
        );
        saveChatHistory(updatedHistory);
        return updatedHistory;
      });
    }
  }, [messages, currentChatId, saveCurrentChat]);

  // Close chat menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowChatMenu(null);
    };

    if (showChatMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showChatMenu]);

  // Global ESC key handler to close all popups
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowAgentPicker(false);
        setShowSlashCommands(false);
        setShowAttachmentMenu(false);
        setShowChatMenu(null);
        setShowSettings(false);
        
        // Refocus input after closing popups
        requestAnimationFrame(() => {
          inputRef.current?.focus();
        });
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

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
    
    // Prepare chat context from references
    let messageContent = inputValue.trim();
    
    // Add visual chat reference cards to the message content for LLM processing
    if (chatReferences.length > 0) {
      const referencesContent = chatReferences.map(ref => `
📋 **Referenced Conversation: "${ref.title}"**
- Agent: ${ref.agent.name}
- Messages: ${ref.messageCount}
- Summary: ${ref.summary}
- Timestamp: ${ref.timestamp.toLocaleString()}
---`).join('\n');
      
      messageContent = `${referencesContent}\n\n${messageContent}`;
    }
    
    // Add file attachment information to message content for LLM processing
    if (currentAttachments.length > 0) {
      const attachmentsContent = currentAttachments.map(att => `
📎 **Attached File: "${att.name}"**
- Type: ${att.type}
- Size: ${(att.size / 1024).toFixed(1)} KB
- MIME Type: ${att.mimeType}
${att.content ? `- Content: ${att.content.substring(0, 200)}${att.content.length > 200 ? '...' : ''}` : ''}
---`).join('\n');
      
      messageContent = `${attachmentsContent}\n\n${messageContent}`;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
      attachments: currentAttachments.length > 0 ? currentAttachments.map(att => ({
        type: att.type,
        name: att.name,
        url: att.url,
        content: att.content
      })) : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setCurrentAttachments([]);
    setChatReferences([]);
    setIsLoading(true);
    setIsTyping(true);

    // Auto-focus input for rapid-fire conversations - immediate focus
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);

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
      
      let currentProvider = selectedProvider;
      let response: Response;
      
      // Try primary provider first, then failover if needed
      try {
        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            provider: currentProvider,
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
            apiKeys: apiKeys,
            attachments: userMessage.attachments
          })
        });
        
        // If primary provider fails, attempt failover
        if (!response.ok) {
          const fallbackProvider = await attemptFailover(currentProvider);
          if (fallbackProvider) {
            currentProvider = fallbackProvider;
            const fallbackEndpoint = ['openai', 'groq'].includes(fallbackProvider) ? '/api/chat/stream' : '/api/chat';
            
            response = await fetch(fallbackEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                provider: fallbackProvider,
                model: selectedModel,
                message: processedMessage,
                history,
                agentId: targetAgent.id,
                agentContext: {
                  name: targetAgent.name,
                  title: targetAgent.title,
                  role: targetAgent.description,
                  specialties: targetAgent.specialties,
                  capabilities: targetAgent.specialties,
                  persona: `I am ${targetAgent.name}, ${targetAgent.title}. ${targetAgent.description}`,
                  bmadFramework: true
                },
                originalMessage: userMessage.content,
                mentionedAgent: agentMentionMatch ? targetAgent.id : null,
                apiKeys: apiKeys,
                attachments: userMessage.attachments
              })
            });
          }
        }
      } catch (error) {
        console.error('Primary provider failed:', error);
        const fallbackProvider = await attemptFailover(currentProvider);
        if (fallbackProvider) {
          currentProvider = fallbackProvider;
          // Retry with fallback provider
          response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              provider: fallbackProvider,
              model: selectedModel,
              message: processedMessage,
              history,
              agentId: targetAgent.id,
              agentContext: {
                name: targetAgent.name,
                title: targetAgent.title,
                role: targetAgent.description,
                specialties: targetAgent.specialties,
                capabilities: targetAgent.specialties,
                persona: `I am ${targetAgent.name}, ${targetAgent.title}. ${targetAgent.description}`,
                bmadFramework: true
              },
              originalMessage: userMessage.content,
              mentionedAgent: agentMentionMatch ? targetAgent.id : null,
              apiKeys: apiKeys,
              attachments: userMessage.attachments
            })
          });
        } else {
          throw error;
        }
      }

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
            
            // Ensure focus returns to input after streaming completes
            setTimeout(() => {
              inputRef.current?.focus();
            }, 300);
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
      
      // Auto-focus input after AI response is complete for rapid-fire conversations
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 200);
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
      {/* Main Chat Interface */}
      <div className="flex-1 flex overflow-hidden">
      {/* Left Sidebar - Chat History */}
      <div className={`${showChatHistory ? 'w-80' : 'w-12'} transition-all duration-300 border-r ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-slate-200 bg-slate-50/80 backdrop-blur-sm'
      } flex flex-col relative`}>
        {/* Sidebar Header */}
        <div className={`p-3 border-b ${darkMode ? 'border-gray-700/50' : 'border-slate-200'}`}>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowChatHistory(!showChatHistory)}
            className={`w-full justify-start transition-all duration-200 ${
              darkMode 
                ? 'hover:bg-gray-700 text-gray-200 hover:text-white hover:shadow-md' 
                : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 hover:border-slate-400 hover:shadow-sm'
            } ${!showChatHistory ? 'animate-pulse bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20' : ''}`}
            title={showChatHistory ? 'Collapse chat history' : 'Expand chat history'}
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            {showChatHistory && <span className="text-sm font-medium">Chat History</span>}
          </Button>
        </div>

        {showChatHistory && (
          <>
            {/* New Chat Button */}
            <div className="p-3 border-b border-gray-700/50">
              <Button
                onClick={createNewChat}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>

            {/* Chat History Tree */}
            <div className="p-2 text-xs text-center text-gray-500">
              🫴 Drag chats below into the input field
            </div>
            <div className="flex-1 overflow-y-auto">
              {chatHistory.map((chat) => (
                <div key={chat.id} className="p-2 border-b border-gray-700/30">
                  <div 
                    className={`group flex items-center justify-between p-2 rounded-lg cursor-grab active:cursor-grabbing transition-colors ${
                      currentChatId === chat.id 
                        ? 'bg-blue-500/20 border border-blue-500/50' 
                        : darkMode ? 'hover:bg-gray-700' : 'hover:bg-slate-200'
                    } ${isDragging ? 'opacity-50' : ''}`}
                    onClick={(e) => {
                      if (!isDragging) {
                        loadChat(chat.id);
                      }
                    }}
                    draggable={true}
                    onDragStart={(e) => {
                      console.log('Drag started for chat:', chat.title); // Debug log
                      setIsDragging(true);
                      const chatContent = chat.messages.map(m => m.content).join('\n\n');
                      e.dataTransfer.setData('text/plain', chatContent);
                      e.dataTransfer.setData('application/chat-history', JSON.stringify({
                        id: chat.id,
                        title: chat.title,
                        messages: chat.messages
                      }));
                      e.dataTransfer.effectAllowed = 'copy';
                      console.log('Data set for transfer:', chat.title); // Debug log
                    }}
                    onDragEnd={() => {
                      console.log('Drag ended'); // Debug log
                      setTimeout(() => setIsDragging(false), 100); // Small delay to prevent click
                    }}
                    title="🫴 Drag to input field to reference this conversation"
                    style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                  >
                    <div className="flex items-center space-x-2 flex-1 min-w-0">
                      <div className={`w-6 h-6 flex items-center justify-center ${
                        darkMode ? 'text-gray-400' : 'text-slate-600'
                      }`}>
                        {React.cloneElement(getAgentIcon(chat.agent), { className: 'w-5 h-5' })}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium truncate ${
                          darkMode ? 'text-gray-200' : 'text-slate-900'
                        }`}>
                          {chat.title}
                        </div>
                        <div className={`text-xs ${
                          darkMode ? 'text-gray-500' : 'text-slate-500'
                        }`}>
                          {chat.timestamp.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-2 h-2 rounded-full ${
                        chat.stage === 'discovery' ? 'bg-blue-500' :
                        chat.stage === 'analysis' ? 'bg-yellow-500' :
                        chat.stage === 'development' ? 'bg-orange-500' :
                        chat.stage === 'testing' ? 'bg-purple-500' :
                        chat.stage === 'deployment' ? 'bg-green-500' :
                        'bg-gray-500'
                      }`} />
                      
                      {/* Chat Menu Button */}
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setShowChatMenu(showChatMenu === chat.id ? null : chat.id);
                          }}
                          className={`h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity ${
                            darkMode ? 'hover:bg-gray-600 text-gray-400 hover:text-white' : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'
                          }`}
                        >
                          <MoreHorizontal className="w-3 h-3" />
                        </Button>
                        
                        {/* Dropdown Menu */}
                        {showChatMenu === chat.id && (
                          <div className={`absolute right-0 top-8 rounded-md shadow-lg border py-1 min-w-32 z-50 ${
                            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-slate-200'
                          }`}>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteChat(chat.id);
                              }}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors ${
                                darkMode 
                                  ? 'text-red-400 hover:bg-gray-700 hover:text-red-300' 
                                  : 'text-red-600 hover:bg-red-50 hover:text-red-700'
                              }`}
                            >
                              🗑️ Delete Chat
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Deliverables */}
                  {chat.deliverables.length > 0 && (
                    <div className="mt-2 ml-4 space-y-1">
                      {chat.deliverables.map((deliverable, idx) => (
                        <div key={idx} className={`flex items-center space-x-2 text-xs ${
                          darkMode ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          <FileText className="w-3 h-3" />
                          <span className="truncate">{deliverable.title}</span>
                          {deliverable.isReady && (
                            <button 
                              onClick={() => downloadDeliverable(deliverable)}
                              className="text-blue-400 hover:text-blue-300"
                              title="Download deliverable"
                            >
                              <Upload className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.pdf,.doc,.docx,.json,.csv,.md"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileAttachment(file, 'document');
          }
        }}
      />
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileAttachment(file, 'image');
          }
        }}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileAttachment(file, 'video');
          }
        }}
      />
      {/* Header */}
      <div className={`border-b backdrop-blur-md transition-colors duration-200 ${
        darkMode
          ? 'border-gray-700 bg-gray-800/95'
          : 'border-slate-200 bg-white/95'
      }`}>
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'
              }`}>
                {React.cloneElement(getAgentIcon(selectedAgent), { className: 'w-7 h-7' })}
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
            {/* Enhanced API Status */}
            <div className="flex items-center space-x-2">
              <Badge 
                className={`flex items-center space-x-2 px-3 py-1 rounded-full font-medium ${
                  apiStatus.status === 'ready' 
                    ? (apiStatus.demoMode ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-green-50 text-green-700 border border-green-200')
                    : apiStatus.status === 'testing'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200 animate-pulse'
                    : 'bg-slate-50 text-slate-800 border border-slate-300'
                }`}
              >
                {apiStatus.status === 'ready' && !apiStatus.demoMode && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <Wifi className="w-3 h-3" />
                  </div>
                )}
                {apiStatus.status === 'ready' && apiStatus.demoMode && <WifiOff className="w-3 h-3" />}
                {apiStatus.status === 'testing' && <Loader2 className="w-3 h-3 animate-spin" />}
                {apiStatus.status === 'disconnected' && <XCircle className="w-3 h-3" />}
                <span className="text-xs">
                  {apiStatus.status === 'ready' && !apiStatus.demoMode && (
                    <div className="flex items-center space-x-1">
                      <span>{selectedProvider.toUpperCase()}</span>
                      {apiStatus.failoverActive && (
                        <span className="text-orange-600">↻</span>
                      )}
                    </div>
                  )}
                  {apiStatus.status === 'ready' && apiStatus.demoMode && 'DEMO'}
                  {apiStatus.status === 'testing' && 'TESTING'}
                  {apiStatus.status === 'disconnected' && 'OFFLINE'}
                </span>
              </Badge>
              
              {/* Connection Quality Indicator */}
              {apiStatus.status === 'ready' && !apiStatus.demoMode && (
                <div className="text-xs text-gray-500">
                  {apiStatus.connectionQuality === 'excellent' && '●●●'}
                  {apiStatus.connectionQuality === 'good' && '●●○'}
                  {apiStatus.connectionQuality === 'poor' && '●○○'}
                </div>
              )}
            </div>
            
            {/* Essential Controls */}
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDarkMode(!darkMode)}
                className={`h-10 w-10 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className={`h-10 w-10 rounded-lg transition-all duration-200 ${
                  darkMode
                    ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Agent Selector */}
        {showAgentSelector && (
          <div className="border-t border-gray-700/50 p-3 max-h-80 overflow-y-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {BMAD_AGENTS.map((agent) => (
                <Card 
                  key={agent.id}
                  className={`cursor-pointer transition-all duration-200 hover:scale-105 bg-gray-800 border-gray-700 hover:bg-gray-700 ${
                    selectedAgent.id === agent.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => handleAgentSwitch(agent)}
                >
                  <CardContent className="p-3">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <div className={`w-8 h-8 rounded-full ${agent.gradient} flex items-center justify-center text-white`}>
                        {agent.icon}
                      </div>
                      <div>
                        <h3 className="font-medium text-white text-sm">{agent.name}</h3>
                        <p className="text-xs text-gray-400 truncate">{agent.title}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2 justify-center">
                      {agent.specialties.slice(0, 2).map((specialty) => (
                        <Badge
                          key={specialty}
                          variant="secondary"
                          className="text-[10px] px-1 py-0 bg-gray-700 text-gray-300"
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
                    React.cloneElement(getAgentIcon(selectedAgent), { className: 'w-4 h-4 text-white' })
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

                    {/* Attachments */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.attachments.map((attachment, index) => (
                          <div
                            key={index}
                            className={`flex items-center space-x-2 p-2 rounded-lg ${
                              darkMode ? 'bg-gray-800/50' : 'bg-slate-100/50'
                            }`}
                          >
                            {attachment.type === 'image' ? (
                              <>
                                <FileImage className="w-4 h-4 text-blue-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium truncate">{attachment.name}</div>
                                  <Image
                                    src={attachment.url}
                                    alt={attachment.name}
                                    width={200}
                                    height={128}
                                    className="mt-1 max-w-full h-32 object-cover rounded-md"
                                  />
                                </div>
                              </>
                            ) : attachment.type === 'video' ? (
                              <>
                                <Video className="w-4 h-4 text-red-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium truncate">{attachment.name}</div>
                                  <video
                                    src={attachment.url}
                                    controls
                                    className="mt-1 max-w-full h-32 rounded-md"
                                  />
                                </div>
                              </>
                            ) : attachment.type === 'github' ? (
                              <>
                                <Github className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium truncate">{attachment.name}</div>
                                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                    GitHub file
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <FileText className="w-4 h-4 text-green-500 flex-shrink-0" />
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium truncate">{attachment.name}</div>
                                  <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                                    {attachment.type === 'document' ? 'Document' : 'File'} attached
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

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
                              <p className={`text-xs leading-relaxed ${
                darkMode ? 'text-gray-300' : 'text-slate-700'
              }`}>
                                {result.snippet}
                              </p>
                              <span className={`text-xs mt-1 block ${
                darkMode ? 'text-gray-500' : 'text-slate-600'
              }`}>
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
                      className={`h-6 px-2 relative transition-colors ${
                        darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-slate-500 hover:text-slate-700'
                      }`}
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm ${
                darkMode ? 'bg-gray-700' : 'bg-slate-200'
              }`}>
                {React.cloneElement(getAgentIcon(selectedAgent), { className: 'w-4 h-4 text-white' })}
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
      <div 
        className={`border-t p-4 transition-colors duration-200 relative ${
          darkMode 
            ? 'border-gray-700 bg-gray-800' 
            : 'border-slate-200 bg-white'
        } ${isDragOver ? (darkMode ? 'bg-gray-700 border-blue-500' : 'bg-blue-50 border-blue-400') : ''}`}
        onDragEnter={handleDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {/* Drag overlay */}
        {isDragOver && (
          <div className={`absolute inset-0 rounded-lg border-2 border-dashed flex items-center justify-center z-50 ${
            dragOverType === 'chat' 
              ? 'bg-blue-100/80 border-blue-400' 
              : 'bg-green-100/80 border-green-400'
          } ${darkMode ? 'bg-opacity-20' : ''}`}>
            <div className={`text-center p-4 ${
              dragOverType === 'chat' 
                ? 'text-blue-700' 
                : 'text-green-700'
            } ${darkMode ? 'text-opacity-90' : ''}`}>
              <div className="text-lg font-semibold mb-1">
                {dragOverType === 'chat' ? '💬 Drop Chat History' : '📁 Drop Files'}
              </div>
              <div className="text-sm">
                {dragOverType === 'chat' 
                  ? 'Release to add chat history to your message' 
                  : 'Release to attach files to your message'
                }
              </div>
            </div>
          </div>
        )}

        {/* File Attachments */}
        {currentAttachments.length > 0 && (
          <div className="mb-3">
            <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Attached Files:
            </div>
            <div className="flex flex-wrap gap-2">
              {currentAttachments.map((attachment, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 border-dashed transition-all duration-200 max-w-xs ${
                    darkMode 
                      ? 'bg-green-900/20 border-green-500/50 hover:bg-green-800/30' 
                      : 'bg-green-50 border-green-300 hover:bg-green-100'
                  }`}
                >
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <FileText className={`w-4 h-4 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                      {attachment.name}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      {attachment.type} • {(attachment.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentAttachments(prev => prev.filter((_, i) => i !== index));
                    }}
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      darkMode 
                        ? 'hover:bg-gray-600 text-gray-400 hover:text-white' 
                        : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'
                    }`}
                    title="Remove file"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Chat References */}
        {chatReferences.length > 0 && (
          <div className="mb-3">
            <div className={`text-xs font-medium mb-2 ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
              Referenced Conversations:
            </div>
            <div className="flex flex-wrap gap-2">
              {chatReferences.map((ref) => (
                <div
                  key={ref.id}
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 border-dashed transition-all duration-200 max-w-xs ${
                    darkMode 
                      ? 'bg-blue-900/20 border-blue-500/50 hover:bg-blue-800/30' 
                      : 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                  }`}
                >
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <MessageSquare className={`w-4 h-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                    <div className={`w-5 h-5 flex items-center justify-center ${
                      darkMode ? 'text-gray-400' : 'text-slate-600'
                    }`}>
                      {React.cloneElement(getAgentIcon(ref.agent), { className: 'w-4 h-4' })}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${darkMode ? 'text-gray-200' : 'text-slate-800'}`}>
                      {ref.title}
                    </div>
                    <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                      {ref.messageCount} messages • {ref.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                  <button
                    onClick={() => removeChatReference(ref.id)}
                    className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
                      darkMode 
                        ? 'hover:bg-gray-600 text-gray-400 hover:text-white' 
                        : 'hover:bg-slate-200 text-slate-500 hover:text-slate-700'
                    }`}
                    title="Remove reference"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

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
          
          <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-slate-600'}`}>
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
                {attachmentOptions.map((option) => (
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
              placeholder={isLoading ? `${selectedAgent.name} is typing...` : `Message ${selectedAgent.name}... (@ for agents, / for apps)`}
              disabled={false}
              onDragOver={handleDragOver}
              onDragEnter={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`transition-all duration-200 pr-16 py-3 rounded-2xl ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                  : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
              } ${isDragOver ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isLoading && inputValue.trim()) {
                  e.preventDefault();
                  handleSendMessage(e as any);
                  return;
                }
                if (e.key === 'Escape') {
                  setShowAgentPicker(false);
                  setShowSlashCommands(false);
                  setShowAttachmentMenu(false);
                } else if (showAgentPicker) {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedAgentIndex(prev => (prev + 1) % BMAD_AGENTS.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedAgentIndex(prev => (prev - 1 + BMAD_AGENTS.length) % BMAD_AGENTS.length);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAgentSelect(BMAD_AGENTS[selectedAgentIndex]);
                  }
                } else if (showSlashCommands) {
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setSelectedSlashIndex(prev => (prev + 1) % slashCommands.length);
                  } else if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setSelectedSlashIndex(prev => (prev - 1 + slashCommands.length) % slashCommands.length);
                  } else if (e.key === 'Enter') {
                    e.preventDefault();
                    const command = slashCommands[selectedSlashIndex];
                    handleSlashCommand(command.name, command.action);
                  }
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
              <h2 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Settings
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(false)}
                className={`h-10 w-10 rounded-lg ${darkMode ? 'hover:bg-gray-800 text-gray-400 hover:text-white' : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'} transition-colors`}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              
              {/* API Configuration Section */}
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  API Keys
                </h3>
                
                <Button
                  onClick={() => setShowSettings(true)}
                  className={`w-full py-3 rounded-lg font-medium transition-colors ${
                    darkMode 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200'
                  }`}
                >
                  <Key className="w-5 h-5 mr-2" />
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
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  Settings
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-base ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                      Dark Mode
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDarkMode(!darkMode)}
                      className={`h-6 w-11 rounded-full transition-colors ${
                        darkMode ? 'bg-blue-500' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        darkMode ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className={`text-base ${darkMode ? 'text-gray-200' : 'text-slate-700'}`}>
                      Sound Effects
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSoundEnabled(!soundEnabled)}
                      className={`h-6 w-11 rounded-full transition-colors ${
                        soundEnabled ? 'bg-blue-500' : darkMode ? 'bg-gray-700' : 'bg-slate-300'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white transition-transform duration-200 ${
                        soundEnabled ? 'translate-x-5' : 'translate-x-0.5'
                      }`} />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Current Agent */}
              <div>
                <h3 className={`text-sm font-semibold uppercase tracking-wider mb-4 ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                  Active Agent
                </h3>
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium ${
                    darkMode ? 'bg-gray-700 text-gray-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {React.cloneElement(getAgentIcon(selectedAgent), { className: 'w-5 h-5' })}
                  </div>
                  <div>
                    <div className={`text-base font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {selectedAgent.name}
                    </div>
                    <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-slate-500'}`}>
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
          className={`fixed z-[9999] rounded-xl shadow-2xl w-[500px] max-w-[90vw] max-h-[80vh] overflow-y-auto transition-all duration-200 border-2 ${
            darkMode
              ? 'bg-gray-800 border-blue-500'
              : 'bg-white border-blue-500'
          }`}
          style={{ 
            left: agentPickerPosition.x, 
            top: agentPickerPosition.y,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(59, 130, 246, 0.5)'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            {/* Debug indicator */}
            <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              AGENT PICKER VISIBLE
            </div>
            
            <div className={`text-sm font-medium uppercase tracking-wider mb-4 px-2 flex items-center ${
              darkMode ? 'text-gray-400' : 'text-slate-500'
            }`}>
              <User className="w-4 h-4 mr-2" />
              Select Agent
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BMAD_AGENTS.map((agent, index) => (
                <div
                  key={agent.id}
                  onClick={() => handleAgentSelect(agent)}
                  className={`flex flex-col items-center p-4 rounded-lg cursor-pointer transition-all duration-150 ${
                    selectedAgentIndex === index
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 border border-blue-300 text-blue-900'
                      : darkMode
                        ? 'hover:bg-gray-700 active:bg-gray-600'
                        : 'hover:bg-slate-50 active:bg-slate-100'
                  }`}
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <div className={`flex items-center justify-center mb-3 ${
                    selectedAgentIndex === index
                      ? darkMode ? 'text-white' : 'text-blue-600'
                      : darkMode ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    {getAgentIcon(agent)}
                  </div>
                  <div className="text-center">
                    <div className={`text-sm font-semibold ${
                      darkMode ? 'text-gray-100' : 'text-slate-900'
                    }`}>
                      {agent.name}
                    </div>
                    <div className={`text-xs ${
                      darkMode ? 'text-gray-400' : 'text-slate-500'
                    }`}>
                      {agent.title}
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
                    selectedSlashIndex === index
                      ? darkMode
                        ? 'bg-blue-600 text-white'
                        : 'bg-blue-100 border border-blue-300 text-blue-900'
                      : darkMode
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
      </div>
      
      {/* Version Indicator */}
      <div className={`text-xs py-2 px-4 text-center border-t ${
        darkMode 
          ? 'text-gray-500 border-gray-700 bg-gray-800' 
          : 'text-slate-400 border-slate-200 bg-slate-50'
      }`}>
        v1.1.0 • BMad Visual Platform
      </div>
    </div>
  );
}