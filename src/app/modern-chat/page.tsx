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
  Search,
  Zap,
  Shield,
  Palette,
  BarChart3
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  agentId?: string;
  agentName?: string;
  isStreaming?: boolean;
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

export default function ModernChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<BMadAgent>(BMAD_AGENTS[0]);
  const [showAgentSelector, setShowAgentSelector] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `👋 Hello! I'm ${selectedAgent.name}, your ${selectedAgent.title}. I specialize in ${selectedAgent.description}. 

My key areas of expertise include:
${selectedAgent.specialties.map(s => `• ${s}`).join('\n')}

How can I help you today?`,
      timestamp: new Date(),
      agentId: selectedAgent.id,
      agentName: selectedAgent.name
    };
    setMessages([welcomeMessage]);
    
    // Focus input
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [selectedAgent]);

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

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const responses = [
        `Great question! As ${selectedAgent.name}, I'd approach this by first understanding your specific requirements. Let me break this down:

1. **Current Situation Analysis**: We need to assess where you are now
2. **Goal Definition**: What exactly are you trying to achieve?
3. **Resource Evaluation**: What tools and constraints do we have?
4. **Action Plan**: Step-by-step approach to get there

Would you like me to dive deeper into any of these areas? I can also help you create a structured plan tailored to your specific needs.`,
        
        `Excellent! This is exactly the kind of challenge I love working on. Based on my experience with ${selectedAgent.description}, here's my recommendation:

**Key Considerations:**
• **Best Practices**: Following industry standards and proven methodologies
• **Scalability**: Ensuring your solution can grow with your needs  
• **Efficiency**: Optimizing for both speed and quality
• **Sustainability**: Creating maintainable, long-term solutions

Let me know what specific aspect you'd like to focus on first, and I'll provide detailed guidance tailored to your situation.`,
        
        `Perfect timing for this question! As your ${selectedAgent.title}, I can help you navigate this effectively. Here's my strategic approach:

**Phase 1**: Discovery & Assessment
**Phase 2**: Planning & Design  
**Phase 3**: Implementation & Testing
**Phase 4**: Deployment & Optimization

Each phase has specific deliverables and success criteria. Would you like me to elaborate on any particular phase, or shall we start with a deep dive into your current situation?`
      ];
      
      const response = responses[Math.floor(Math.random() * responses.length)];
      
      // Add assistant message with typing simulation
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
      
      // Simulate typing
      simulateTyping(response, (partialText) => {
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, content: partialText }
            : msg
        ));
      });
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex flex-col">
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
                  </div>
                  
                  {/* Message Actions */}
                  <div className={`flex items-center space-x-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(message.content)}
                      className="text-gray-500 hover:text-gray-300 h-6 px-2"
                    >
                      <Copy className="w-3 h-3" />
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
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Online</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap className="w-3 h-3" />
            <span>Press Enter to send</span>
          </div>
        </div>
      </div>
    </div>
  );
}