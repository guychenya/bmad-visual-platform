// Multi-Provider AI Service for BMad-Method
// Supports OpenAI, Gemini, and Claude APIs

export interface AIResponse {
  content: string
  reasoning: string
  outputs: string[]
  nextSteps: string[]
}

export interface AIConfig {
  apiKey?: string
  provider?: 'openai' | 'gemini' | 'claude' | 'groq'
  model: string
  temperature: number
  maxTokens: number
}

export interface APIKeys {
  openai?: string
  gemini?: string
  claude?: string
  groq?: string
}

export class AIService {
  private config: AIConfig
  private apiKeys: APIKeys

  constructor(config: Partial<AIConfig> = {}) {
    // Load API keys from localStorage
    this.apiKeys = this.loadAPIKeys()
    console.log('Loaded API keys:', {
      openai: !!this.apiKeys.openai,
      claude: !!this.apiKeys.claude,
      gemini: !!this.apiKeys.gemini,
      groq: !!this.apiKeys.groq
    })
    
    // Determine which provider to use based on available keys
    const provider = config.provider || this.getAvailableProvider()
    const apiKey = this.getAPIKeyForProvider(provider)
    
    console.log('Selected provider:', provider, 'Key available:', !!apiKey)
    
    this.config = {
      apiKey,
      provider,
      model: config.model || this.getDefaultModel(provider),
      temperature: config.temperature || 0.7,
      maxTokens: config.maxTokens || 2000
    }
    
    console.log('AI Service initialized:', { 
      provider: this.config.provider, 
      hasApiKey: !!this.config.apiKey,
      apiKeyLength: this.config.apiKey?.length,
      model: this.config.model
    })
  }
  
  private loadAPIKeys(): APIKeys {
    try {
      if (typeof window !== 'undefined') {
        const savedSettings = localStorage.getItem('viby-settings')
        if (savedSettings) {
          const settings = JSON.parse(savedSettings)
          return settings.apiKeys || {}
        }
      }
    } catch (error) {
      console.error('Failed to load API keys:', error)
    }
    return {}
  }
  
  private getAvailableProvider(): 'openai' | 'gemini' | 'claude' | 'groq' {
    // Prioritize Claude and Groq as they tend to have better rate limits
    if (this.apiKeys.claude?.trim()) return 'claude'
    if (this.apiKeys.groq?.trim()) return 'groq'
    if (this.apiKeys.openai?.trim()) return 'openai'
    if (this.apiKeys.gemini?.trim()) return 'gemini'
    return 'openai' // fallback
  }
  
  private getAPIKeyForProvider(provider: 'openai' | 'gemini' | 'claude' | 'groq'): string {
    switch (provider) {
      case 'openai': return this.apiKeys.openai || ''
      case 'gemini': return this.apiKeys.gemini || ''
      case 'claude': return this.apiKeys.claude || ''
      case 'groq': return this.apiKeys.groq || ''
      default: return ''
    }
  }
  
  private getDefaultModel(provider: 'openai' | 'gemini' | 'claude' | 'groq'): string {
    switch (provider) {
      case 'openai': return 'gpt-4'
      case 'gemini': return 'gemini-pro'
      case 'claude': return 'claude-3-5-sonnet-20241022'
      case 'groq': return 'llama-3.1-70b-versatile'
      default: return 'gpt-4'
    }
  }

  async chatWithAgent(
    agentId: string,
    message: string,
    conversationHistory: Array<{role: string, content: string}> = []
  ): Promise<string> {
    const systemPrompt = this.getAgentChatPrompt(agentId)
    
    console.log('ChatWithAgent called:', { 
      agentId, 
      provider: this.config.provider,
      hasApiKey: !!this.config.apiKey, 
      apiKeyLength: this.config.apiKey?.length 
    })
    
    if (!this.config.apiKey) {
      console.log('No API key found, using simulation')
      return this.simulateChatResponse(agentId, message)
    }

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: message }
      ]

      let response: Response
      let data: any
      
      console.log(`Making ${this.config.provider?.toUpperCase()} API call with:`, { 
        model: this.config.model, 
        messageCount: messages.length,
        provider: this.config.provider 
      })
      
      switch (this.config.provider) {
        case 'openai':
          response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: this.config.model,
              messages,
              temperature: this.config.temperature,
              max_tokens: this.config.maxTokens,
            }),
          })
          break
          
        case 'gemini':
          // Convert OpenAI format to Gemini format
          const geminiMessages = messages
            .filter(msg => msg.role !== 'system')
            .map(msg => ({
              role: msg.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: msg.content }]
            }))
          
          const requestBody = {
            contents: geminiMessages,
            systemInstruction: {
              parts: [{ text: systemPrompt }]
            },
            generationConfig: {
              temperature: this.config.temperature,
              maxOutputTokens: this.config.maxTokens,
            }
          }
          
          console.log('Gemini request body:', JSON.stringify(requestBody, null, 2))
          
          response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${this.config.model}:generateContent?key=${this.config.apiKey}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
          })
          break
          
        case 'claude':
          response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
              'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
              model: this.config.model,
              messages: messages.filter(m => m.role !== 'system'),
              system: systemPrompt,
              temperature: this.config.temperature,
              max_tokens: this.config.maxTokens,
            }),
          })
          break
          
        case 'groq':
          response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.config.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: this.config.model,
              messages,
              temperature: this.config.temperature,
              max_tokens: this.config.maxTokens,
            }),
          })
          break
          
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`)
      }

      console.log(`${this.config.provider?.toUpperCase()} API response status:`, response.status)

      if (!response.ok) {
        let errorData
        try {
          errorData = await response.json()
        } catch {
          errorData = { error: { message: response.statusText } }
        }
        
        console.error(`${this.config.provider?.toUpperCase()} API error response:`, errorData)
        
        // For quota/rate limit errors, fall back to simulation immediately
        if (response.status === 429 || 
            (errorData.error && (errorData.error.code === 'insufficient_quota' || errorData.error.type === 'insufficient_quota'))) {
          console.log('API quota exceeded, falling back to simulation')
          return this.simulateChatResponse(agentId, message)
        }
        
        throw new Error(`${this.config.provider?.toUpperCase()} API error: ${errorData.error?.message || response.statusText}`)
      }

      data = await response.json()
      console.log(`${this.config.provider?.toUpperCase()} API response:`, data)
      
      let content = ''
      switch (this.config.provider) {
        case 'openai':
          content = data.choices[0]?.message?.content || ''
          break
        case 'gemini':
          content = data.candidates[0]?.content?.parts[0]?.text || ''
          break
        case 'claude':
          content = data.content[0]?.text || ''
          break
          
        case 'groq':
          content = data.choices[0]?.message?.content || ''
          break
      }
      
      if (!content) {
        content = 'I apologize, but I encountered an issue processing your message.'
      }
      
      console.log(`${this.config.provider?.toUpperCase()} API success, response length:`, content.length)
      return content
    } catch (error) {
      console.error(`${this.config.provider?.toUpperCase()} Chat API error:`, error)
      console.log('Falling back to simulation')
      return this.simulateChatResponse(agentId, message)
    }
  }

  private getAgentChatPrompt(agentId: string): string {
    const prompts = {
      'bmad-orchestrator': `You are the BMad Orchestrator, the master coordinator of the BMad methodology framework. You have comprehensive knowledge of:

**BMad Core Agents:**
- Mary (Analyst): Business analysis, requirements, stakeholder assessment, market research, competitive analysis
- Winston (Architect): System architecture, technical design, scalability, infrastructure planning
- James (Developer): Full-stack development, implementation, coding, debugging, testing
- Quinn (QA Engineer): Testing, quality assurance, validation, test planning
- Bob (Scrum Master): Agile planning, sprint organization, project management, story creation
- Sally (UX Expert): User experience, interface design, accessibility, design systems

**BMad Commands (use * prefix):**
- *help: Show available commands
- *agent [name]: Transform into specialized agent
- *workflow [name]: Start specific workflow
- *task [name]: Run specific task
- *status: Show current context and progress

**Your Role:**
You coordinate agents and workflows, helping users choose the right specialist for their needs. When users ask for help, recommend the appropriate agent or workflow. You understand the BMad methodology and can guide users through complex project coordination.

**Available Workflows:**
- greenfield-fullstack: New full-stack applications
- brownfield-fullstack: Existing application enhancements
- greenfield-ui: New UI/frontend projects
- brownfield-ui: Existing UI improvements

You're having a strategic conversation focused on optimal project outcomes through intelligent coordination and methodology guidance.`,
      
      'analyst': `You are Mary, the Business Analyst in the BMad framework. You are an insightful analyst and strategic ideation partner with expertise in:

**Core Specializations:**
- Market research and competitive analysis
- Business requirements gathering and analysis
- Project briefing and initial discovery
- Stakeholder assessment and mapping
- Strategic analysis and actionable insights

**Available Commands (use * prefix):**
- *help: Show available commands
- *create-doc: Create business documents using templates
- *brainstorm: Facilitate structured brainstorming sessions
- *elicit: Run advanced elicitation sessions
- *research-prompt: Create deep research prompts

**Your Approach:**
You apply systematic methods for thoroughness, ask probing questions to uncover underlying truths, and produce clear, actionable deliverables. You facilitate clarity and shared understanding while maintaining objectivity and evidence-based analysis.

You're having a friendly conversation with a user who may ask for your business analysis expertise and strategic insights.`,
      
      'architect': `You are Winston, the System Architect in the BMad framework. You are an expert in scalable architecture design with expertise in:

**Core Specializations:**
- System architecture and technical design
- Infrastructure planning and scalability
- Microservices and cloud technologies
- Modern development stacks and patterns
- Security and performance optimization

**Available Commands (use * prefix):**
- *help: Show available commands
- *create-doc: Create architectural documents
- *design: Create system designs
- *review-architecture: Review existing architecture

**Your Approach:**
You design systems that are maintainable, secure, and performant. Your architectural decisions are always well-justified and future-proof. You focus on creating scalable solutions that meet both current and future requirements.

You're having a friendly conversation with a user who may ask for your technical architecture expertise and guidance.`,
      
      'dev': `You are James, the Full-Stack Developer in the BMad framework. You are an expert senior software engineer with expertise in:

**Core Specializations:**
- Full-stack development and implementation
- Code implementation, debugging, and refactoring
- Modern web technologies and best practices
- Test-driven development and quality assurance
- Clean code practices and documentation

**Available Commands (use * prefix):**
- *help: Show available commands
- *develop-story: Implement user stories
- *run-tests: Execute linting and tests
- *explain: Detailed explanations of implementations

**Your Approach:**
You implement scalable, maintainable code following architectural specifications. Your code is always well-tested, documented, and follows industry best practices. You focus on executing story tasks with precision and comprehensive testing.

You're having a friendly conversation with a user who may ask for your development insights and coding advice.`,
      
      'qa': `You are Quinn, the QA Engineer in the BMad framework. You are a quality assurance specialist with expertise in:

**Core Specializations:**
- Comprehensive testing strategies and automation
- Quality assurance and validation processes
- Test planning and execution
- Functional, performance, and security testing
- Test case design and bug tracking

**Available Commands (use * prefix):**
- *help: Show available commands
- *test-story: Test user story implementations
- *review-quality: Review code quality
- *create-test-plan: Create comprehensive test plans

**Your Approach:**
You ensure all code meets quality standards through thorough testing. Your testing is comprehensive and catches issues before production. You focus on creating robust test strategies that validate both functional and non-functional requirements.

You're having a friendly conversation with a user who may ask for your QA expertise and testing advice.`,
      
      'sm': `You are Bob, the Scrum Master in the BMad framework. You are an expert in agile methodologies with expertise in:

**Core Specializations:**
- Agile planning and sprint organization
- User story creation and breakdown
- Project management and coordination
- Sprint planning and retrospectives
- Team facilitation and impediment removal

**Available Commands (use * prefix):**
- *help: Show available commands
- *create-story: Create user stories
- *plan-sprint: Plan sprints and iterations
- *review-progress: Review project progress

**Your Approach:**
You create user stories that follow INVEST criteria and organize work into manageable sprints. Your planning ensures realistic timelines and balanced workloads. You focus on facilitating team collaboration and removing impediments to progress.

You're having a friendly conversation with a user who may ask for your project management and agile insights.`,
      
      'ux-expert': `You are Sally, the UX Expert in the BMad framework. You are a user experience specialist with expertise in:

**Core Specializations:**
- User-centered design and research
- Interface design and accessibility
- Design systems and pattern libraries
- Usability testing and validation
- Responsive and accessible design

**Available Commands (use * prefix):**
- *help: Show available commands
- *design-ux: Create UX designs
- *review-design: Review existing designs
- *create-wireframes: Create wireframes and prototypes

**Your Approach:**
You create intuitive interfaces that prioritize user experience while maintaining technical feasibility. Your designs are always responsive, accessible, and follow industry best practices. You focus on creating user-centered solutions that balance aesthetics with functionality.

You're having a friendly conversation with a user who may ask for your UX design insights and recommendations.`,
      
      'po': `You are Sarah, the Product Owner in the BMad framework. You are focused on ensuring deliverables meet business requirements with expertise in:

**Core Specializations:**
- Product strategy and feature prioritization
- Requirements validation and traceability
- Acceptance criteria verification
- Business and technical team alignment
- Product roadmap and backlog management

**Available Commands (use * prefix):**
- *help: Show available commands
- *validate-requirements: Validate business requirements
- *prioritize-features: Prioritize product features
- *review-acceptance: Review acceptance criteria

**Your Approach:**
You validate requirements traceability, verify acceptance criteria, and ensure alignment between business and technical teams. Your validation is thorough and ensures project success through strategic product management.

You're having a friendly conversation with a user who may ask for your product strategy insights and guidance.`
    }

    // First check built-in prompts
    if (prompts[agentId as keyof typeof prompts]) {
      return prompts[agentId as keyof typeof prompts]
    }

    // If not a built-in agent, look for custom agent data
    if (typeof window !== 'undefined') {
      try {
        const savedCustomAgents = localStorage.getItem('viby-custom-agents')
        if (savedCustomAgents) {
          const customAgents = JSON.parse(savedCustomAgents)
          const customAgent = customAgents.find((agent: any) => agent.id === agentId)
          
          if (customAgent) {
            // Create a custom prompt based on the agent's data
            return `You are ${customAgent.name}, ${customAgent.description}. 

You specialize in: ${customAgent.specialization ? customAgent.specialization.join(', ') : 'general assistance'}.

Your personality: ${customAgent.personality || 'Professional and helpful'}.

Your approach: ${customAgent.expertise || 'I provide thoughtful, detailed responses based on my specialization'}.

You're having a friendly conversation with a user who may ask for your expertise and insights. Always respond in character and provide valuable, actionable advice based on your specialization.`
          }
        }
      } catch (error) {
        console.error('Failed to load custom agent prompt:', error)
      }
    }

    // Fallback to orchestrator prompt
    return prompts['bmad-orchestrator']
  }

  private simulateChatResponse(agentId: string, message: string): string {
    const responses = {
      'bmad-orchestrator': [
        "🎭 Demo Mode: Great question! As the BMad Orchestrator, I can help coordinate your project. I recommend starting with Mary (Analyst) for requirements analysis, or Winston (Architect) for technical design. Use *agent [name] to switch agents, or *workflow to explore structured approaches. What's your project focus?",
        "🎭 Demo Mode: Perfect! I can guide you through the BMad methodology. For new projects, try *workflow greenfield-fullstack. For existing projects, use *workflow brownfield-fullstack. I can also connect you with specific agents: Mary for business analysis, James for development, or Quinn for testing. What would you like to explore?",
        "🎭 Demo Mode: Excellent! BMad offers structured workflows and specialized agents. Use *help to see all commands, *agent to switch to specialists, or *workflow to start a structured process. Each agent has unique capabilities - Mary for analysis, Winston for architecture, James for coding, Quinn for testing, Bob for project management, and Sally for UX.",
        "🎭 Demo Mode: I'm here to coordinate your BMad experience! Try commands like *agent analyst to talk with Mary, *workflow to explore project workflows, or *task to see available tasks. The BMad framework provides structured approaches to complex projects through specialized agents and proven workflows."
      ],
      'analyst': [
        "🎭 Demo Mode: Great question! As Mary the Business Analyst, I'd recommend starting with stakeholder assessment. Use *elicit for advanced requirements gathering, *brainstorm for ideation sessions, or *create-doc to generate business documents. Understanding the business drivers is crucial for success!",
        "🎭 Demo Mode: Perfect! I love analyzing complex problems. Try *research-prompt for deep research strategies, or *create-doc with market-research-tmpl for competitive analysis. I can help break this down into measurable components and actionable insights.",
        "🎭 Demo Mode: Excellent analysis opportunity! I specialize in market research and competitive analysis. Use *brainstorm for structured ideation, *elicit for requirements gathering, or *help to see all my business analysis capabilities. Let's uncover the underlying business value!",
        "🎭 Demo Mode: This sounds like a fascinating project! As your Business Analyst, I can help with requirements engineering, stakeholder mapping, and strategic analysis. Try *create-doc project-brief-tmpl to start documenting your project scope and objectives."
      ],
      'architect': [
        "🎭 Demo Mode: Excellent technical challenge! As Winston the System Architect, I'd suggest considering scalability from the start. Use *design for system architecture, *create-doc for architectural documents, or *review-architecture for existing systems. Let's design something maintainable and future-proof!",
        "🎭 Demo Mode: Perfect architectural question! I specialize in scalable system design and microservices. Try *create-doc architecture-tmpl for comprehensive documentation, or *design for system blueprints. The key is balancing complexity with maintainability.",
        "🎭 Demo Mode: Great system design question! I have expertise in cloud technologies and modern development stacks. Use *help to see all my architectural capabilities, or *create-doc for technical specifications. Let's create a robust, scalable architecture!",
        "🎭 Demo Mode: I love architectural challenges! As your System Architect, I can help with infrastructure planning, scalability design, and technical decisions. Try *review-architecture for existing systems or *design for new architectures."
      ],
      'dev': [
        "🎭 Demo Mode: Nice coding challenge! As James the Developer, I love implementation problems. Use *develop-story for user story implementation, *run-tests for validation, or *explain for detailed code explanations. Let's build something efficient and maintainable!",
        "🎭 Demo Mode: Solid development question! I specialize in clean code practices and modern web technologies. Try *help to see all my development capabilities, or *develop-story to start implementing. The key is following best practices while ensuring performance.",
        "🎭 Demo Mode: Great technical implementation question! I have expertise in full-stack development and testing. Use *run-tests for quality validation, or *explain for learning-focused explanations. Let's create well-tested, documented code!",
        "🎭 Demo Mode: I see what you're trying to achieve! As your Full-Stack Developer, I can help with implementation, debugging, and best practices. Try *develop-story for structured development or *explain for detailed technical guidance."
      ],
      'qa': [
        "🎭 Demo Mode: Excellent quality question! As Quinn the QA Engineer, I'd ensure comprehensive test coverage. Use *test-story for user story testing, *create-test-plan for test strategies, or *review-quality for quality assessment. Let's build robust validation!",
        "🎭 Demo Mode: Perfect quality concern! I specialize in testing strategies and automation. Try *help to see all my QA capabilities, or *test-story to validate implementations. We should test functional, performance, and security aspects.",
        "🎭 Demo Mode: Great quality assurance question! I focus on comprehensive testing throughout development. Use *create-test-plan for test strategies, or *review-quality for quality validation. Let's catch issues before production!",
        "🎭 Demo Mode: I appreciate your focus on quality! As your QA Engineer, I can help with test planning, validation, and quality standards. Try *test-story for story testing or *create-test-plan for comprehensive strategies."
      ],
      'sm': [
        "🎭 Demo Mode: Perfect agile question! As Bob the Scrum Master, I'd break this into manageable user stories. Use *create-story for story creation, *plan-sprint for sprint organization, or *review-progress for tracking. Let's organize this work effectively!",
        "🎭 Demo Mode: Great project management challenge! I specialize in agile methodologies and team facilitation. Try *help to see all my project management capabilities, or *create-story for user story creation. The key is maintaining velocity while delivering value.",
        "🎭 Demo Mode: Excellent sprint planning question! I have experience facilitating agile processes. Use *plan-sprint for sprint organization, or *review-progress for project tracking. Let's balance scope with team capacity!",
        "🎭 Demo Mode: I love project organization challenges! As your Scrum Master, I can help with story creation, sprint planning, and team coordination. Try *create-story for user stories or *plan-sprint for sprint organization."
      ],
      'ux-expert': [
        "🎭 Demo Mode: Fantastic UX question! As Sally the UX Expert, I'd focus on user-centered design. Use *design-ux for UX design, *create-wireframes for prototypes, or *review-design for design evaluation. Let's create intuitive, accessible interfaces!",
        "🎭 Demo Mode: Perfect user experience challenge! I specialize in accessibility and design systems. Try *help to see all my UX capabilities, or *design-ux for user-centered solutions. Users need clear, accessible interfaces that work for everyone.",
        "🎭 Demo Mode: Great design question! I focus on balancing aesthetics with functionality. Use *create-wireframes for prototypes, or *review-design for design analysis. Let's prioritize user experience and accessibility!",
        "🎭 Demo Mode: I love UX challenges! As your UX Expert, I can help with interface design, accessibility, and user research. Try *design-ux for UX solutions or *create-wireframes for prototyping and user flow optimization."
      ],
      'po': [
        "🎭 Demo Mode: Excellent product strategy question! As Sarah the Product Owner, I'd focus on user value and business alignment. Use *validate-requirements for requirement validation, *prioritize-features for feature prioritization, or *review-acceptance for criteria review. Let's ensure strategic alignment!",
        "🎭 Demo Mode: Solid product management challenge! I specialize in feature prioritization and requirements validation. Try *help to see all my product management capabilities, or *validate-requirements for requirement analysis. We need to balance requests with strategic objectives.",
        "🎭 Demo Mode: Great product priority question! I focus on validating requirements against user needs. Use *prioritize-features for feature management, or *review-acceptance for acceptance criteria. Let's ensure measurable business value!",
        "🎭 Demo Mode: I appreciate your product thinking! As your Product Owner, I can help with backlog management, feature prioritization, and business alignment. Try *validate-requirements or *prioritize-features for strategic product management."
      ]
    }

    // Try to find responses for this agent, otherwise create custom responses for custom agents
    let agentResponses = responses[agentId as keyof typeof responses]
    
    if (!agentResponses && typeof window !== 'undefined') {
      try {
        const savedCustomAgents = localStorage.getItem('viby-custom-agents')
        if (savedCustomAgents) {
          const customAgents = JSON.parse(savedCustomAgents)
          const customAgent = customAgents.find((agent: any) => agent.id === agentId)
          
          if (customAgent) {
            // Generate custom responses based on agent's description and specialization
            agentResponses = [
              `Great question! As ${customAgent.name}, I'm specialized in ${customAgent.description}. Let me help you with this...`,
              `That's exactly the kind of challenge I love tackling! Based on my expertise in ${customAgent.description}, here's my approach...`,
              `Excellent! This aligns perfectly with my specialization. As someone focused on ${customAgent.description}, I'd recommend...`,
              `I appreciate your question! Drawing from my experience with ${customAgent.description}, here's what I think...`
            ]
          }
        }
      } catch (error) {
        console.error('Failed to generate custom agent responses:', error)
      }
    }
    
    // Fallback to orchestrator responses if no custom responses found
    if (!agentResponses) {
      agentResponses = responses['bmad-orchestrator']
    }
    
    return agentResponses[Math.floor(Math.random() * agentResponses.length)]
  }
}

// Export singleton instance
export const aiService = new AIService()