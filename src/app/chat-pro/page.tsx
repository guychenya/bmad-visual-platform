'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MessageBubble } from '@/components/modern-chat/MessageBubble';
import { 
  Send, 
  Mic, 
  Paperclip, 
  Smile,
  Zap,
  Sparkles,
  Brain,
  Code,
  Search,
  Shield,
  Palette,
  BarChart3,
  Menu,
  X
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
  gradient: string;
  description: string;
  specialties: string[];
  isOnline: boolean;
}

const BMAD_AGENTS: BMadAgent[] = [
  {
    id: 'bmad-orchestrator',
    name: 'Orchestrator',
    title: 'BMad Master Orchestrator',
    icon: <Sparkles className="w-4 h-4" />,
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    description: 'Workflow coordination and multi-agent management',
    specialties: ['Coordination', 'Strategy', 'Workflows', 'Planning'],
    isOnline: true
  },
  {
    id: 'analyst',
    name: 'Mary',
    title: 'Business Analyst',
    icon: <BarChart3 className="w-4 h-4" />,
    gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    description: 'Business analysis, market research, and requirements engineering',
    specialties: ['Requirements', 'Analysis', 'Research', 'Strategy'],
    isOnline: true
  },
  {
    id: 'architect',
    name: 'Winston',
    title: 'System Architect',
    icon: <Brain className="w-4 h-4" />,
    gradient: 'bg-gradient-to-r from-emerald-500 to-teal-500',
    description: 'System architecture, technical design, and scalability planning',
    specialties: ['Architecture', 'Design', 'Scalability', 'Infrastructure'],
    isOnline: true
  },
  {
    id: 'dev',
    name: 'James',
    title: 'Full Stack Developer',
    icon: <Code className="w-4 h-4" />,
    gradient: 'bg-gradient-to-r from-orange-500 to-red-500',
    description: 'Full-stack development, implementation, and best practices',
    specialties: ['Development', 'Implementation', 'Testing', 'Debugging'],
    isOnline: true
  },
  {
    id: 'qa',
    name: 'Quinn',
    title: 'QA Engineer',
    icon: <Shield className="w-4 h-4" />,
    gradient: 'bg-gradient-to-r from-rose-500 to-pink-500',
    description: 'Quality assurance, testing strategies, and validation',
    specialties: ['Testing', 'Quality', 'Validation', 'Automation'],
    isOnline: true
  },
  {
    id: 'sm',
    name: 'Bob',
    title: 'Scrum Master',
    icon: <Search className="w-4 h-4" />,
    gradient: 'bg-gradient-to-r from-amber-500 to-orange-500',
    description: 'Agile project management, sprint planning, and team coordination',
    specialties: ['Agile', 'Planning', 'Coordination', 'Management'],
    isOnline: true
  },
  {
    id: 'ux-expert',
    name: 'Sally',
    title: 'UX Expert',
    icon: <Palette className="w-4 h-4" />,
    gradient: 'bg-gradient-to-r from-violet-500 to-purple-500',
    description: 'User experience design, accessibility, and design systems',
    specialties: ['UX/UI', 'Design', 'Accessibility', 'Prototyping'],
    isOnline: true
  }
];

const SAMPLE_CONVERSATIONS = [
  {
    id: '1',
    title: 'E-commerce Platform Architecture',
    lastMessage: 'Let me design a scalable microservices architecture...',
    timestamp: new Date(Date.now() - 3600000),
    agentId: 'architect'
  },
  {
    id: '2',
    title: 'User Research Analysis',
    lastMessage: 'Based on the survey data, I recommend...',
    timestamp: new Date(Date.now() - 7200000),
    agentId: 'analyst'
  },
  {
    id: '3',
    title: 'Sprint Planning Session',
    lastMessage: 'Here are the user stories for the next sprint...',
    timestamp: new Date(Date.now() - 86400000),
    agentId: 'sm'
  }
];

export default function ChatProPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<BMadAgent>(BMAD_AGENTS[0]);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [conversations] = useState(SAMPLE_CONVERSATIONS);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Add welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm **${selectedAgent.name}**, your ${selectedAgent.title}. 

I specialize in ${selectedAgent.description}.

**My expertise includes:**
${selectedAgent.specialties.map(s => `• ${s}`).join('\n')}

**Quick commands:**
• Type \`*help\` for available commands
• Type \`*switch\` to change agents
• Type \`*capabilities\` to see what I can do

How can I assist you today?`,
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
    setShowSidebar(false);
  };

  const simulateTyping = (text: string, messageId: string) => {
    setIsTyping(true);
    let index = 0;
    const interval = setInterval(() => {
      if (index < text.length) {
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, content: text.substring(0, index + 1) }
            : msg
        ));
        index++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
        setMessages(prev => prev.map(msg => 
          msg.id === messageId 
            ? { ...msg, isStreaming: false }
            : msg
        ));
      }
    }, 20);
  };

  const generateResponse = (userMessage: string, agent: BMadAgent) => {
    const responses = {
      'bmad-orchestrator': `As the BMad Orchestrator, I can help coordinate this project across multiple agents. Here's my recommended approach:

**🎯 Project Coordination Strategy:**
1. **Requirements Analysis** - I'll connect you with Mary (Analyst) for thorough business analysis
2. **Technical Architecture** - Winston (Architect) will design the system architecture
3. **Implementation Planning** - James (Developer) will handle the technical implementation
4. **Quality Assurance** - Quinn (QA) will ensure comprehensive testing
5. **Project Management** - Bob (Scrum Master) will organize the workflow

**📋 Next Steps:**
- Would you like me to create a detailed project plan?
- Should I schedule a multi-agent consultation?
- Do you need help prioritizing requirements?

**💡 Pro Tip:** Use \`*agent [name]\` to switch to a specific specialist, or \`*workflow\` to see available project workflows.`,

      'analyst': `Great question! As your Business Analyst, I'll help you understand the business implications and requirements. Let me analyze this:

**📊 Business Analysis:**
- **Market Context**: Understanding your competitive landscape
- **Stakeholder Impact**: Identifying key decision makers and users
- **Value Proposition**: Defining the business value and ROI
- **Risk Assessment**: Evaluating potential challenges and mitigation strategies

**🔍 Research Approach:**
1. **Requirements Gathering** - Structured interviews and workshops
2. **Competitive Analysis** - Market research and benchmarking
3. **User Story Development** - Creating actionable user requirements
4. **Success Metrics** - Defining KPIs and measurement criteria

**📈 Recommended Actions:**
- Conduct stakeholder interviews
- Perform competitive analysis
- Create user personas and journey maps
- Develop business requirements document

Would you like me to dive deeper into any of these areas? I can also help you create a comprehensive project brief.`,

      'architect': `Excellent technical challenge! As your System Architect, I'll design a robust, scalable solution. Here's my architectural approach:

**🏗️ System Architecture Overview:**
- **Scalability**: Designing for growth and high availability
- **Security**: Implementing best practices and compliance
- **Performance**: Optimizing for speed and efficiency
- **Maintainability**: Creating clean, modular architecture

**🔧 Technical Strategy:**
1. **Infrastructure Design** - Cloud-native, microservices approach
2. **Data Architecture** - Scalable database design and data flows
3. **API Design** - RESTful APIs with proper versioning
4. **Security Architecture** - Authentication, authorization, and encryption

**📋 Deliverables:**
- System architecture diagrams
- Technical specifications
- Infrastructure requirements
- Security and compliance documentation

**🚀 Technology Recommendations:**
- Modern tech stack selection
- Cloud platform optimization
- CI/CD pipeline design
- Monitoring and observability

Would you like me to create detailed architectural diagrams or dive into specific technical aspects?`,

      'dev': `Perfect! As your Full Stack Developer, I'm ready to implement this solution. Here's my development approach:

**💻 Development Strategy:**
- **Clean Code**: Following best practices and coding standards
- **Test-Driven Development**: Comprehensive testing at all levels
- **Agile Implementation**: Iterative development with regular feedback
- **Documentation**: Thorough code documentation and guides

**🛠️ Implementation Plan:**
1. **Environment Setup** - Development, staging, and production environments
2. **Core Development** - Backend services and database implementation
3. **Frontend Development** - User interface and user experience
4. **Integration** - API integration and third-party services
5. **Testing** - Unit, integration, and end-to-end testing

**📦 Technology Stack:**
- **Backend**: Modern frameworks and databases
- **Frontend**: Responsive, accessible user interfaces
- **DevOps**: Automated deployment and monitoring
- **Quality**: Code reviews and automated testing

**🔄 Development Workflow:**
- Feature branching and pull requests
- Continuous integration and deployment
- Code quality monitoring
- Performance optimization

Ready to start coding! What specific features would you like me to implement first?`,

      'qa': `Excellent! As your QA Engineer, I'll ensure the highest quality standards. Here's my comprehensive testing approach:

**🔍 Quality Assurance Strategy:**
- **Test Planning**: Comprehensive test strategy and execution plans
- **Automated Testing**: CI/CD integrated test automation
- **Performance Testing**: Load, stress, and scalability testing
- **Security Testing**: Vulnerability assessment and penetration testing

**🧪 Testing Framework:**
1. **Unit Testing** - Component-level testing with high coverage
2. **Integration Testing** - API and service integration validation
3. **End-to-End Testing** - Complete user journey testing
4. **Regression Testing** - Ensuring new changes don't break existing functionality

**📊 Quality Metrics:**
- **Test Coverage**: Aiming for 90%+ code coverage
- **Defect Detection**: Early identification and resolution
- **Performance Benchmarks**: Response time and throughput metrics
- **User Acceptance**: Usability and accessibility testing

**🛡️ Testing Tools & Processes:**
- Automated test suites
- Performance monitoring tools
- Security scanning integration
- Bug tracking and reporting

**📋 Quality Deliverables:**
- Test plans and test cases
- Automated test scripts
- Performance test reports
- Security assessment reports

What specific aspects would you like me to focus on first? I can create detailed test plans or start with automated testing setup.`,

      'sm': `Perfect! As your Scrum Master, I'll help organize this project using agile best practices. Here's my project management approach:

**📋 Agile Project Management:**
- **Sprint Planning**: Organized development cycles with clear goals
- **User Stories**: Well-defined requirements with acceptance criteria
- **Team Coordination**: Facilitating communication and collaboration
- **Progress Tracking**: Transparent reporting and metrics

**🎯 Sprint Organization:**
1. **Epic Breakdown** - High-level features into manageable stories
2. **Story Estimation** - Planning poker and velocity tracking
3. **Sprint Planning** - Capacity planning and commitment
4. **Daily Standups** - Progress updates and impediment resolution

**📊 Project Tracking:**
- **Burndown Charts**: Visual progress tracking
- **Velocity Metrics**: Team performance measurement
- **Impediment Log**: Issues tracking and resolution
- **Sprint Reviews**: Demo and retrospective sessions

**🔄 Agile Ceremonies:**
- Sprint planning sessions
- Daily standup meetings
- Sprint reviews and demos
- Sprint retrospectives

**📈 Success Metrics:**
- Sprint goal achievement
- Story completion rates
- Team velocity trends
- Stakeholder satisfaction

Would you like me to create user stories, plan the first sprint, or set up the project tracking system?`,

      'ux-expert': `Wonderful! As your UX Expert, I'll create an intuitive, user-centered design. Here's my design approach:

**🎨 User Experience Strategy:**
- **User Research**: Understanding user needs and behaviors
- **Design Systems**: Consistent, scalable design patterns
- **Accessibility**: Inclusive design for all users
- **Usability Testing**: Iterative design validation

**🔬 Design Process:**
1. **User Research** - Interviews, surveys, and behavioral analysis
2. **Information Architecture** - Content organization and navigation
3. **Wireframing** - Low-fidelity layout and flow design
4. **Prototyping** - Interactive mockups and user testing
5. **Visual Design** - High-fidelity designs and style guides

**🖼️ Design Deliverables:**
- User personas and journey maps
- Information architecture diagrams
- Wireframes and prototypes
- Visual design mockups
- Design system documentation

**♿ Accessibility Focus:**
- WCAG 2.1 compliance
- Screen reader optimization
- Keyboard navigation support
- Color contrast validation

**📱 Responsive Design:**
- Mobile-first approach
- Progressive enhancement
- Cross-browser compatibility
- Performance optimization

**🎯 User Testing:**
- Usability testing sessions
- A/B testing for optimization
- Analytics and user feedback
- Iterative design improvements

What aspect of the user experience would you like to focus on first? I can create user personas, wireframes, or start with user research.`
    };

    return responses[agent.id as keyof typeof responses] || `As ${agent.name}, I'm here to help with ${agent.description}. This is a demonstration of the BMad framework capabilities. In a real implementation, I would provide specialized assistance based on my expertise in ${agent.specialties.join(', ')}.`;
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const response = generateResponse(userMessage.content, selectedAgent);
      
      // Add assistant message with streaming
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
      simulateTyping(response, assistantMessage.id);
      
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add toast notification here
  };

  const handleRegenerate = (messageId: string) => {
    // Implement message regeneration
    console.log('Regenerating message:', messageId);
  };

  const handleEdit = (messageId: string) => {
    // Implement message editing
    console.log('Editing message:', messageId);
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex">
      {/* Sidebar */}
      <div className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-50 w-80 bg-gray-900 border-r border-gray-700/50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
          <h2 className="text-lg font-semibold text-white">BMad Framework</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSidebar(false)}
            className="text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Agents */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-400 mb-3">Available Agents</h3>
          <div className="space-y-2">
            {BMAD_AGENTS.map((agent) => (
              <div
                key={agent.id}
                onClick={() => handleAgentSwitch(agent)}
                className={`cursor-pointer p-3 rounded-lg transition-all duration-200 ${
                  selectedAgent.id === agent.id 
                    ? 'bg-blue-600/20 border border-blue-500/50' 
                    : 'bg-gray-800/50 hover:bg-gray-800/70 border border-gray-700/50'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full ${agent.gradient} flex items-center justify-center text-white relative`}>
                    {agent.icon}
                    {agent.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white">{agent.name}</h4>
                    <p className="text-sm text-gray-400">{agent.title}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">{agent.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {agent.specialties.slice(0, 2).map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="secondary"
                      className="text-xs bg-gray-700/50 text-gray-300"
                    >
                      {specialty}
                    </Badge>
                  ))}
                  {agent.specialties.length > 2 && (
                    <Badge variant="secondary" className="text-xs bg-gray-700/50 text-gray-300">
                      +{agent.specialties.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-700/50 bg-gray-900/50 backdrop-blur-md">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSidebar(true)}
                className="text-gray-400 hover:text-white hover:bg-gray-800 lg:hidden"
              >
                <Menu className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full ${selectedAgent.gradient} flex items-center justify-center text-white shadow-lg`}>
                  {selectedAgent.icon}
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-white">{selectedAgent.name}</h1>
                  <p className="text-sm text-gray-400">{selectedAgent.title}</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              agent={selectedAgent}
              isTyping={isTyping}
              onCopy={handleCopy}
              onRegenerate={handleRegenerate}
              onEdit={handleEdit}
            />
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${selectedAgent.gradient}`}>
                  {selectedAgent.icon}
                </div>
                <div className="bg-gray-800 rounded-2xl px-4 py-3 border border-gray-700">
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
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={`Message ${selectedAgent.name}...`}
                disabled={isLoading}
                className="bg-gray-800/50 border-gray-700/50 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-20 py-3 rounded-2xl"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage(e as any);
                  }
                }}
              />
              
              <div className="absolute right-2 bottom-2 flex items-center space-x-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white h-8 w-8 p-0"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white h-8 w-8 p-0 rounded-full"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>
          
          <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
            <div className="flex items-center space-x-4">
              <span>BMad Framework • {selectedAgent.name}</span>
              <div className="flex items-center space-x-1">
                <Zap className="w-3 h-3" />
                <span>Powered by AI</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span>Press Enter to send • Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}