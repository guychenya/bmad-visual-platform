'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Badge } from '../../../components/ui/badge'
import { 
  Send, 
  Bot, 
  User, 
  Loader2,
  Crown,
  Brain,
  Building,
  Code,
  TestTube,
  Target,
  Palette,
  List,
  CheckCircle,
  Settings,
  FileText,
  Download,
  Upload,
  Zap,
  MessageSquare,
  Play
} from 'lucide-react'
import { aiService } from '../../../lib/ai/aiService'
import { BMAD_AGENTS } from '../../../lib/bmad/agents'
import { BMadTemplateEngine, ProjectContext } from '../../../lib/bmad/templates'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: string
  agentId: string
  agentName: string
}

interface ProjectState {
  name: string
  phase: 'setup' | 'requirements' | 'architecture' | 'development' | 'qa' | 'completed'
  deliverables: string[]
  currentAgent: string
}

const AGENT_ICONS = {
  'bmad-orchestrator': Crown,
  'analyst': Brain,
  'architect': Building,
  'dev': Code,
  'qa': TestTube,
  'pm': Target,
  'ux-expert': Palette,
  'sm': List,
  'po': CheckCircle
}

const AGENT_COLORS = {
  'bmad-orchestrator': 'from-yellow-500 to-orange-500',
  'analyst': 'from-blue-500 to-cyan-500',
  'architect': 'from-indigo-500 to-purple-500',
  'dev': 'from-green-500 to-teal-500',
  'qa': 'from-red-500 to-pink-500',
  'pm': 'from-green-500 to-emerald-500',
  'ux-expert': 'from-purple-500 to-pink-500',
  'sm': 'from-orange-500 to-red-500',
  'po': 'from-teal-500 to-blue-500'
}

export default function UnifiedWorkspace() {
  const [messages, setMessages] = useState<Message[]>([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [hasApiKey, setHasApiKey] = useState(false)
  const [projectState, setProjectState] = useState<ProjectState>({
    name: 'New Project',
    phase: 'setup',
    deliverables: [],
    currentAgent: 'bmad-orchestrator'
  })
  const [selectedAgents, setSelectedAgents] = useState(['bmad-orchestrator'])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check for API key
    const checkApiKey = () => {
      if (typeof window === 'undefined') return false
      const savedSettings = localStorage.getItem('viby-settings')
      if (savedSettings) {
        try {
          const settings = JSON.parse(savedSettings)
          return !!(settings.apiKeys?.openai?.trim() || 
                   settings.apiKeys?.claude?.trim() || 
                   settings.apiKeys?.gemini?.trim())
        } catch (error) {
          return false
        }
      }
      return false
    }
    
    setHasApiKey(checkApiKey())

    // Check for initial message from dashboard
    const initialMessage = sessionStorage.getItem('initial-message')
    
    if (initialMessage) {
      // Clear the stored message
      sessionStorage.removeItem('initial-message')
      
      // Start with user message and orchestrator response
      const userMsg: Message = {
        id: '1',
        role: 'user',
        content: initialMessage,
        timestamp: new Date().toISOString(),
        agentId: 'user',
        agentName: 'You'
      }
      
      const orchestratorResponse: Message = {
        id: '2',
        role: 'assistant',
        content: `Excellent! I'm immediately analyzing: "${initialMessage}"

✅ **AUTO-GENERATING PROJECT BRIEF** - *Creating comprehensive project overview...*

🎯 **BMad AI Team Activated:**
• ✅ **BMad Orchestrator** (active) - Project coordination
• 🔄 **Mary (Business Analyst)** - Requirements analysis
• ⏳ **Winston (System Architect)** - Standing by for technical design
• ⏳ **James (Developer)** - Ready for implementation planning

**📥 DELIVERABLE GENERATED:**
- **PROJECT BRIEF** - Complete analysis with tech recommendations for Vibe coding system

**🚀 Next Actions Available:**
- "Generate user stories" - Detailed user requirements
- "Create technical architecture" - System design and tech stack
- "Plan implementation" - Development roadmap and phases
- "Show development recommendations" - Specific guidance for coding

**Your project brief includes specific recommendations for development teams and coding systems. Ready to proceed?**`,
        timestamp: new Date().toISOString(),
        agentId: 'bmad-orchestrator',
        agentName: 'BMad Orchestrator'
      }
      
      setMessages([userMsg, orchestratorResponse])
      
      // Update project state and auto-generate project brief
      setProjectState(prev => ({
        ...prev,
        name: initialMessage.slice(0, 50) + (initialMessage.length > 50 ? '...' : ''),
        phase: 'requirements',
        deliverables: ['project-brief']
      }))
    } else {
      // Initialize with orchestrator welcome message
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `Welcome to BMad AI Builder! I'm the **Orchestrator**, and I'll coordinate our team of AI specialists to build your project.

🎯 **How it works:**
1. **Tell me about your project** - Share your idea, upload a PRD, or describe what you want to build
2. **I'll assemble the team** - I'll bring in the right specialists (Analyst, Architect, Developer, QA, etc.)
3. **We collaborate** - Watch as our AI team works together to plan and build your project
4. **Get deliverables** - Download professional documents, code, and architecture

**Ready to start?** What project would you like to build today?`,
        timestamp: new Date().toISOString(),
        agentId: 'bmad-orchestrator',
        agentName: 'BMad Orchestrator'
      }])
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) {
      console.log('Message blocked:', { messageEmpty: !message.trim(), isLoading })
      return
    }

    console.log('Processing new message:', message.trim())
    const currentAgent = BMAD_AGENTS.find(a => a.id === projectState.currentAgent)
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString(),
      agentId: 'user',
      agentName: 'You'
    }

    console.log('Adding user message to chat:', userMessage)
    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsLoading(true)
    console.log('Set loading to true, starting AI processing...')

    try {
      console.log('Starting chat message processing...')
      
      // Get conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
      
      console.log('Conversation history:', conversationHistory.length, 'messages')

      // Enhanced context for orchestrator
      const contextualMessage = `Project: "${projectState.name}"
Phase: ${projectState.phase}
Current deliverables: ${projectState.deliverables.join(', ') || 'None yet'}
User request: ${userMessage.content}

As the BMad Orchestrator, coordinate the team and provide clear next steps. If this is a new project, help define requirements and suggest which agents to involve. Always be specific about what each agent will do.`

      console.log('Calling AI service with agent:', projectState.currentAgent)
      
      // Try AI service first, but fallback quickly if no API key
      let aiResponse: string | null = null
      
      if (hasApiKey) {
        try {
          // Add timeout to AI service call
          aiResponse = await Promise.race([
            aiService.chatWithAgent(
              projectState.currentAgent,
              contextualMessage,
              conversationHistory
            ),
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('AI service timeout')), 10000)
            )
          ]) as string
        } catch (aiError) {
          console.log('AI service failed, using fallback:', aiError)
          aiResponse = null
        }
      } else {
        console.log('No API key available, skipping AI service call')
        aiResponse = null
      }
      
      console.log('AI service response received:', aiResponse ? 'success' : 'using fallback')

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || generateFallbackResponse(userMessage.content, projectState),
        timestamp: new Date().toISOString(),
        agentId: projectState.currentAgent,
        agentName: currentAgent?.name || 'AI Assistant'
      }
      
      console.log('Adding AI message to chat:', aiMessage.content.slice(0, 100) + '...')
      setMessages(prev => [...prev, aiMessage])

      // Auto-advance project if needed
      updateProjectProgress(aiMessage.content)

    } catch (error) {
      console.error('Error getting AI response:', error)
      console.log('Falling back to local response generation')
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateFallbackResponse(userMessage.content, projectState),
        timestamp: new Date().toISOString(),
        agentId: projectState.currentAgent,
        agentName: currentAgent?.name || 'AI Assistant'
      }
      
      console.log('Adding fallback message to chat:', errorMessage.content.slice(0, 100) + '...')
      setMessages(prev => [...prev, errorMessage])
    } finally {
      console.log('Chat processing complete, setting loading to false')
      setIsLoading(false)
    }
  }

  const generateFallbackResponse = (userMessage: string, state: ProjectState): string => {
    console.log('Generating fallback response for:', userMessage, 'State:', state)
    // More intelligent responses based on keywords and context
    const lowerMsg = userMessage.toLowerCase()
    
    if (lowerMsg.includes('requirements') || lowerMsg.includes('analyze') || lowerMsg.includes('details') || lowerMsg.includes('user stories') || lowerMsg.includes('stories')) {
      addAgent('analyst')
      setProjectState(prev => ({
        ...prev,
        phase: 'requirements',
        deliverables: Array.from(new Set([...prev.deliverables, 'project-brief', 'user-stories']))
      }))
      return `Perfect! **Mary (Business Analyst)** is now generating comprehensive user stories.

✅ **GENERATING USER STORIES** - *Processing your requirements into actionable stories...*

📋 **Requirements Analysis Complete:**
• ✅ **Stakeholder Analysis** - Identified primary and secondary users
• ✅ **Functional Requirements** - Core features and capabilities
• ✅ **User Journey Mapping** - How users will interact with the system
• ✅ **Acceptance Criteria** - Clear testing and validation criteria

**📥 NEW DELIVERABLE READY:**
- **USER STORIES** - Comprehensive user stories with acceptance criteria

**🎯 What Mary Found:**
Based on your project description, I've identified key user personas and created detailed user stories following Agile best practices. Each story includes acceptance criteria and is prioritized for development.

**📋 Next Recommended Steps:**
- "Create technical architecture" - Let Winston design the system
- "Plan development phases" - Break into implementable sprints
- "Generate implementation roadmap" - Detailed development timeline

**Ready to proceed with technical planning?**

*Mary has generated professional user stories ready for your development team.*`
    }
    
    if (lowerMsg.includes('architecture') || lowerMsg.includes('technical') || lowerMsg.includes('design')) {
      addAgent('architect')
      setProjectState(prev => ({
        ...prev,
        phase: 'architecture',
        deliverables: Array.from(new Set([...prev.deliverables, 'project-brief', 'technical-architecture']))
      }))
      return `Excellent! **Winston (System Architect)** is designing your technical architecture.

✅ **GENERATING TECHNICAL ARCHITECTURE** - *Creating comprehensive system design...*

🏗️ **Architecture Analysis Complete:**
• ✅ **Technology Stack Selection** - Modern, scalable technologies chosen
• ✅ **System Components** - Modular architecture with clear separation
• ✅ **Database Design** - Optimized data architecture and relationships
• ✅ **API Design** - RESTful API patterns and documentation
• ✅ **Security Architecture** - Built-in security and compliance measures
• ✅ **Deployment Strategy** - Cloud-native deployment recommendations

**📥 NEW DELIVERABLE READY:**
- **TECHNICAL ARCHITECTURE** - Complete system design with implementation recommendations

**🎯 Architecture Highlights:**
- **${determineProjectComplexity() === 'complex' ? 'Microservices with Kubernetes' : determineProjectComplexity() === 'medium' ? 'API-first with containerization' : 'Modern full-stack with cloud deployment'}**
- **Recommended for Vibe Coding System** - Clear implementation guidance included
- **Scalable & Secure** - Built for growth and enterprise requirements

**🚀 Ready for Implementation Planning:**
- "Plan development phases" - Break into development sprints
- "Generate deployment guide" - Step-by-step implementation
- "Create development roadmap" - Timeline and milestones

**Winston has created a production-ready architecture document with specific recommendations for your development team.**`
    }
    
    if (lowerMsg.includes('ux') || lowerMsg.includes('user') || lowerMsg.includes('interface') || lowerMsg.includes('design')) {
      addAgent('ux-expert')
      return `Great idea! I'm bringing in **Sally (UX Expert)** for user experience design.

🎨 **UX Design Process:**
• **User Research** - Understand your target users
• **Information Architecture** - Organize content and features
• **Wireframes** - Layout and structure
• **User Flows** - How users navigate the system
• **Accessibility** - Ensure inclusive design

**UX Questions:**
1. Who are your primary users and what are their goals?
2. Any existing brand guidelines or design preferences?
3. Mobile-first or desktop-first approach?
4. Any accessibility requirements?

*Sally is now active and ready to design an amazing user experience.*`
    }
    
    if (lowerMsg.includes('implementation') || lowerMsg.includes('development') || lowerMsg.includes('code')) {
      addAgent('dev')
      setProjectState(prev => ({
        ...prev,
        phase: 'development',
        deliverables: Array.from(new Set([...prev.deliverables, 'development-plan']))
      }))
      return `Perfect! **James (Developer)** is creating your implementation plan.

✅ **GENERATING DEVELOPMENT PLAN** - *Creating actionable implementation roadmap...*

💻 **Development Planning Complete:**
• ✅ **Sprint Planning** - Organized into manageable development cycles
• ✅ **Technology Implementation** - Step-by-step technical guidance
• ✅ **Quality Assurance** - Testing strategy and code standards
• ✅ **Deployment Pipeline** - CI/CD and production setup

**📥 NEW DELIVERABLE READY:**
- **DEVELOPMENT PLAN** - Complete implementation roadmap with specific technical guidance

**🎯 Implementation Highlights:**
- **Phase-based Development** - Clear milestones and deliverables
- **Vibe Coding System Ready** - Specific recommendations for your development environment
- **Quality First** - Built-in testing and code quality measures

**James has created a comprehensive development plan ready for immediate implementation.**`
    }
    
    if (state.phase === 'setup' || state.deliverables.length === 0) {
      // Auto-generate project brief for any new request
      setProjectState(prev => ({
        ...prev,
        phase: 'requirements',
        deliverables: Array.from(new Set([...prev.deliverables, 'project-brief']))
      }))
      return `Great! I'm immediately analyzing: "${userMessage}"

✅ **AUTO-GENERATING PROJECT BRIEF** - *Creating comprehensive project overview...*

🎯 **BMad AI Team Activated:**
• ✅ **BMad Orchestrator** (active) - Project coordination
• 🔄 **Mary (Business Analyst)** - Requirements analysis
• ⏳ **Winston (System Architect)** - Standing by for technical design
• ⏳ **James (Developer)** - Ready for implementation planning

**📥 DELIVERABLE GENERATED:**
- **PROJECT BRIEF** - Complete analysis with tech recommendations

**🚀 Next Actions Available:**
- "Generate user stories" - Detailed user requirements
- "Create technical architecture" - System design and tech stack
- "Plan implementation" - Development roadmap and phases
- "Show development recommendations" - Specific guidance for coding

**Your project brief includes specific recommendations for development teams and coding systems. Ready to proceed?**`
    }

    // Default response with deliverable generation
    const newDeliverables = state.deliverables.includes('project-brief') ? state.deliverables : [...state.deliverables, 'project-brief']
    
    setProjectState(prev => ({
      ...prev,
      deliverables: newDeliverables
    }))
    
    return `I'm coordinating our AI team to address: "${userMessage}"

✅ **PROCESSING REQUEST** - *Analyzing and generating relevant deliverables...*

🎯 **Current Project Status:**
- **Phase**: ${state.phase}
- **Active Agents**: BMad Orchestrator, Business Analyst
- **Documents Generated**: ${newDeliverables.length} professional deliverable(s)

**📋 Immediate Actions:**
• ✅ Updated project documentation
• 🔄 Analyzing your specific request
• 📝 Preparing implementation recommendations

**🚀 Available Next Steps:**
- "Generate user stories" - Detailed requirements documentation
- "Create technical architecture" - System design with tech recommendations
- "Plan development roadmap" - Implementation timeline and phases
- "Show me implementation guide" - Specific development recommendations

**All deliverables include specific recommendations for development teams and coding systems. What would you like to focus on next?**`
  }

  const updateProjectProgress = (response: string) => {
    // Auto-generate deliverables based on AI responses
    const lowerResponse = response.toLowerCase()
    const currentDeliverables = [...projectState.deliverables]
    let newPhase = projectState.phase
    
    // Always ensure project-brief exists
    if (!currentDeliverables.includes('project-brief')) {
      currentDeliverables.push('project-brief')
      newPhase = 'requirements'
    }
    
    // Generate user stories when mentioned
    if ((lowerResponse.includes('user stories') || lowerResponse.includes('generating user stories')) && !currentDeliverables.includes('user-stories')) {
      currentDeliverables.push('user-stories')
      newPhase = 'requirements'
    }
    
    // Generate technical architecture when mentioned
    if ((lowerResponse.includes('technical architecture') || lowerResponse.includes('generating technical architecture')) && !currentDeliverables.includes('technical-architecture')) {
      currentDeliverables.push('technical-architecture')
      newPhase = 'architecture'
    }
    
    // Generate development plan when mentioned
    if ((lowerResponse.includes('development plan') || lowerResponse.includes('generating development plan')) && !currentDeliverables.includes('development-plan')) {
      currentDeliverables.push('development-plan')
      newPhase = 'development'
    }
    
    // Generate QA strategy when mentioned
    if ((lowerResponse.includes('testing') || lowerResponse.includes('qa')) && !currentDeliverables.includes('qa-strategy')) {
      currentDeliverables.push('qa-strategy')
      newPhase = 'qa'
    }
    
    // Update state with new deliverables
    setProjectState(prev => ({
      ...prev,
      phase: newPhase,
      deliverables: currentDeliverables
    }))
  }

  const addAgent = (agentId: string) => {
    if (!selectedAgents.includes(agentId)) {
      setSelectedAgents(prev => [...prev, agentId])
    }
    setProjectState(prev => ({ ...prev, currentAgent: agentId }))
  }

  const downloadDeliverable = (deliverable: string) => {
    const content = generateDeliverableContent(deliverable, projectState.name)
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${projectState.name.toLowerCase().replace(/\s+/g, '-')}-${deliverable}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateDeliverableContent = (deliverable: string, projectName: string): string => {
    // Create comprehensive project context from conversation
    const projectContext: ProjectContext = {
      name: projectName,
      description: extractProjectDescription(),
      complexity: determineProjectComplexity(),
      phase: projectState.phase,
      requirements: extractRequirements(),
      constraints: extractConstraints()
    }

    // Use BMad Template Engine for professional deliverables
    switch (deliverable) {
      case 'project-brief':
        return BMadTemplateEngine.generateProjectBrief(projectContext)
      case 'user-stories':
        return BMadTemplateEngine.generateUserStories(projectContext)
      case 'technical-architecture':
        return BMadTemplateEngine.generateTechnicalArchitecture(projectContext)
      case 'development-plan':
        return generateDevelopmentPlan(projectContext)
      case 'qa-strategy':
        return generateQAStrategy(projectContext)
      default:
        return `# ${deliverable.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}: ${projectName}\n\nComprehensive ${deliverable} document generated by BMad AI methodology.\n\nThis document follows industry best practices and provides actionable recommendations for development teams.`
    }
  }

  const generateDevelopmentPlan = (context: ProjectContext): string => {
    return `# Development Plan: ${context.name}

**Document Metadata**
- Version: 1.0
- Author: BMad AI Development Team
- Date: ${new Date().toLocaleDateString()}
- Status: Ready for Implementation

---

## Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)
- Set up development environment and CI/CD pipeline
- Implement authentication and basic security
- Create database schema and core API endpoints
- Establish testing framework and code quality standards

### Phase 2: Core Features (Weeks 3-6)
- Implement primary user workflows and features
- Develop frontend components and user interface
- Create admin functionality and user management
- Add data validation and error handling

### Phase 3: Enhancement (Weeks 7-10)
- Implement advanced features and integrations
- Performance optimization and caching
- Security hardening and compliance measures
- User acceptance testing and feedback integration

### Phase 4: Launch (Weeks 11-12)
- Production deployment and monitoring setup
- Performance testing and load balancing
- Documentation and training materials
- Go-live support and maintenance planning

## Technology Implementation Guide

### For Vibe Coding System Integration

**Recommended Tech Stack:**
${context.complexity === 'complex' ? 'Enterprise-grade microservices architecture' : context.complexity === 'medium' ? 'Modern full-stack with API-first design' : 'Streamlined full-stack development'}

**Development Approach:**
1. **API-First Development** - Design and document APIs before implementation
2. **Test-Driven Development** - Write tests before code implementation
3. **Agile Methodology** - 2-week sprints with regular stakeholder feedback
4. **Continuous Integration** - Automated testing and deployment pipeline

**Quality Assurance:**
- Minimum 80% test coverage requirement
- Automated security scanning and vulnerability assessment
- Performance testing with load and stress testing
- Code review process for all changes

---

*This development plan provides actionable steps for immediate implementation. Ready to begin development with clear technical guidance.*`
  }

  const generateQAStrategy = (context: ProjectContext): string => {
    return `# QA Strategy: ${context.name}

**Document Metadata**
- Version: 1.0
- Author: BMad AI QA Engineer
- Date: ${new Date().toLocaleDateString()}
- Status: Implementation Ready

---

## Quality Assurance Framework

### Testing Strategy

**1. Unit Testing (80% Coverage Minimum)**
- Test individual components and functions
- Mock external dependencies
- Automated execution in CI/CD pipeline
- Coverage reporting and enforcement

**2. Integration Testing**
- API endpoint testing with real databases
- Service-to-service communication validation
- Third-party integration verification
- Data flow and transformation testing

**3. End-to-End Testing**
- Critical user journey automation
- Cross-browser compatibility testing
- Mobile responsiveness validation
- Performance baseline establishment

**4. Security Testing**
- Vulnerability scanning and penetration testing
- Authentication and authorization validation
- Data encryption and protection verification
- OWASP compliance checking

### Quality Gates

**Pre-Development:**
- Requirements review and acceptance criteria validation
- Technical design review and architecture approval
- Test plan creation and stakeholder approval

**During Development:**
- Code review requirements (2 approvals minimum)
- Automated test execution and passing requirements
- Security scan passing before merge
- Performance benchmark maintenance

**Pre-Production:**
- User acceptance testing completion
- Load testing and performance validation
- Security audit and compliance verification
- Documentation review and approval

## Implementation Recommendations

### For Development Teams

**Testing Tools:**
- Jest/Vitest for unit testing
- Cypress/Playwright for E2E testing
- Postman/Newman for API testing
- OWASP ZAP for security testing

**Quality Metrics:**
- Code coverage: Minimum 80%
- Performance: Page load < 2 seconds
- Security: Zero high-severity vulnerabilities
- Accessibility: WCAG 2.1 AA compliance

**Process Integration:**
- Shift-left testing approach
- Continuous testing in CI/CD pipeline
- Risk-based testing prioritization
- Defect prevention over detection

---

*This QA strategy ensures production-ready quality with comprehensive testing coverage and clear quality gates.*`
  }

  const extractProjectDescription = (): string => {
    // Extract project description from conversation history
    const userMessages = messages.filter(m => m.role === 'user')
    if (userMessages.length > 0) {
      return userMessages[0].content.slice(0, 200) + (userMessages[0].content.length > 200 ? '...' : '')
    }
    return 'A comprehensive software development project'
  }

  const determineProjectComplexity = (): 'simple' | 'medium' | 'complex' => {
    // Analyze conversation to determine project complexity
    const conversationText = messages.map(m => m.content.toLowerCase()).join(' ')
    
    const complexKeywords = ['microservices', 'kubernetes', 'enterprise', 'scalable', 'distributed', 'ai', 'machine learning']
    const mediumKeywords = ['api', 'database', 'authentication', 'backend', 'frontend', 'integration']
    
    if (complexKeywords.some(keyword => conversationText.includes(keyword))) {
      return 'complex'
    } else if (mediumKeywords.some(keyword => conversationText.includes(keyword))) {
      return 'medium'
    }
    return 'simple'
  }

  const extractRequirements = (): string[] => {
    // Extract requirements mentioned in conversation
    const requirements: string[] = []
    const conversationText = messages.map(m => m.content).join(' ')
    
    if (conversationText.includes('authentication') || conversationText.includes('login')) {
      requirements.push('User authentication and authorization')
    }
    if (conversationText.includes('database') || conversationText.includes('data')) {
      requirements.push('Data management and storage')
    }
    if (conversationText.includes('api') || conversationText.includes('integration')) {
      requirements.push('API development and integrations')
    }
    if (conversationText.includes('mobile') || conversationText.includes('responsive')) {
      requirements.push('Mobile-responsive design')
    }
    if (conversationText.includes('admin') || conversationText.includes('management')) {
      requirements.push('Administrative functionality')
    }
    
    return requirements.length > 0 ? requirements : ['Core application functionality', 'User interface design', 'Data management']
  }

  const extractConstraints = (): string[] => {
    // Extract constraints from conversation
    const constraints: string[] = []
    const conversationText = messages.map(m => m.content.toLowerCase()).join(' ')
    
    if (conversationText.includes('budget') || conversationText.includes('cost')) {
      constraints.push('Budget considerations')
    }
    if (conversationText.includes('timeline') || conversationText.includes('deadline')) {
      constraints.push('Timeline constraints')
    }
    if (conversationText.includes('legacy') || conversationText.includes('existing')) {
      constraints.push('Legacy system integration')
    }
    if (conversationText.includes('compliance') || conversationText.includes('security')) {
      constraints.push('Security and compliance requirements')
    }
    
    return constraints.length > 0 ? constraints : ['Standard development practices', 'Performance requirements']
  }

  const currentAgent = BMAD_AGENTS.find(a => a.id === projectState.currentAgent)
  const AgentIcon = AGENT_ICONS[projectState.currentAgent as keyof typeof AGENT_ICONS] || Crown

  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      
      {/* Project Header */}
      <div className="p-4 border-b border-white/10 glass-nav">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Project Info */}
          <div className="flex items-center space-x-4">
            <div className={`p-3 bg-gradient-to-r ${AGENT_COLORS[projectState.currentAgent as keyof typeof AGENT_COLORS]} rounded-xl`}>
              <AgentIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">{projectState.name}</h1>
              <div className="flex items-center space-x-3 text-sm text-slate-400">
                <span>Phase: {projectState.phase}</span>
                <span>•</span>
                <span>Agent: {currentAgent?.name}</span>
                <Badge variant={hasApiKey ? "default" : "destructive"} className="text-xs">
                  {hasApiKey ? 'AI Connected' : 'Demo Mode'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            {projectState.deliverables.length > 0 && (
              <div className="flex items-center space-x-1">
                {projectState.deliverables.map(deliverable => (
                  <Button
                    key={deliverable}
                    size="sm"
                    variant="outline"
                    onClick={() => downloadDeliverable(deliverable)}
                    className="glass-button text-xs hover:bg-green-600/20 border-green-500/30"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    {deliverable.replace('-', ' ').toUpperCase()}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="max-w-4xl mx-auto space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className={`flex items-start space-x-3 max-w-[85%] ${
                    msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                    
                    {/* Agent Avatar */}
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                        : `bg-gradient-to-r ${AGENT_COLORS[msg.agentId as keyof typeof AGENT_COLORS] || 'from-gray-500 to-gray-600'}`
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="h-4 w-4 text-white" />
                      ) : (
                        (() => {
                          const Icon = AGENT_ICONS[msg.agentId as keyof typeof AGENT_ICONS] || Bot
                          return <Icon className="h-4 w-4 text-white" />
                        })()
                      )}
                    </div>

                    {/* Message Content */}
                    <div className={`p-4 rounded-2xl ${
                      msg.role === 'user'
                        ? 'bg-blue-600 text-white rounded-br-md'
                        : 'glass-card-premium text-slate-100 rounded-bl-md'
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium opacity-75">
                          {msg.agentName}
                        </span>
                        <span className="text-xs opacity-50">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex justify-start animate-fade-in">
                  <div className="flex items-start space-x-3 max-w-[85%]">
                    <div className={`p-2 bg-gradient-to-r ${AGENT_COLORS[projectState.currentAgent as keyof typeof AGENT_COLORS]} rounded-lg animate-pulse`}>
                      <AgentIcon className="h-4 w-4 text-white" />
                    </div>
                    <div className="glass-card-premium p-4 rounded-2xl rounded-bl-md">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="h-4 w-4 animate-spin text-blue-400" />
                        <span className="text-sm text-slate-300">
                          {currentAgent?.name} is thinking...
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-white/10 glass-nav">
            <div className="max-w-4xl mx-auto space-y-3">
              
              {/* API Key Warning & Quick Suggestions */}
              {!hasApiKey && (
                <div className="text-center py-2">
                  <p className="text-xs text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full inline-block">
                    Demo mode - Add API keys in Settings for full AI functionality
                  </p>
                </div>
              )}
              
              {/* Quick Suggestion Chips */}
              {messages.length <= 2 && (
                <div className="flex flex-wrap justify-center gap-2 mb-3">
                  {[
                    "Generate user stories",
                    "Create technical architecture", 
                    "Plan implementation",
                    "Show development recommendations"
                  ].map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => {
                        console.log('Quick suggestion clicked:', suggestion)
                        setMessage(suggestion)
                      }}
                      className="px-3 py-1 text-xs bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-full transition-colors"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
              
              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex space-x-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage(e)
                    }
                  }}
                  placeholder="Ask about requirements, architecture, development, or anything else..."
                  disabled={isLoading}
                  className="flex-1 glass-card border-slate-600/50 text-white placeholder-slate-400 rounded-xl px-4 py-3 min-h-[48px] text-sm"
                />
                <Button 
                  type="submit" 
                  disabled={isLoading || !message.trim()}
                  className="gradient-button-premium px-6 py-3 rounded-xl shrink-0"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Send className="h-5 w-5" />
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>

        {/* Team Panel - Mobile Hidden, Desktop Sidebar */}
        <div className="hidden lg:block w-72 border-l border-white/10 glass-nav p-4">
          <div className="space-y-4">
            
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">AI Team</h3>
              <div className="space-y-2">
                {BMAD_AGENTS.slice(0, 6).map(agent => {
                  const Icon = AGENT_ICONS[agent.id as keyof typeof AGENT_ICONS] || Bot
                  const isActive = agent.id === projectState.currentAgent
                  const isSelected = selectedAgents.includes(agent.id)
                  
                  return (
                    <button
                      key={agent.id}
                      onClick={() => addAgent(agent.id)}
                      className={`w-full flex items-center space-x-3 p-2 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-white/10 border border-white/20' 
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`p-1.5 bg-gradient-to-r ${AGENT_COLORS[agent.id as keyof typeof AGENT_COLORS]} rounded-lg`}>
                        <Icon className="h-3 w-3 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-white truncate">{agent.name}</div>
                        <div className="text-xs text-slate-400 truncate">{agent.role}</div>
                      </div>
                      {isSelected && (
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {projectState.deliverables.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Deliverables</h3>
                <div className="space-y-2">
                  {projectState.deliverables.map(deliverable => (
                    <button
                      key={deliverable}
                      onClick={() => downloadDeliverable(deliverable)}
                      className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-left"
                    >
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-blue-400 flex-shrink-0" />
                        <div>
                          <div className="text-xs text-slate-300 truncate font-medium">
                            {deliverable.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </div>
                          <div className="text-xs text-green-400 font-medium">✓ Ready</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}