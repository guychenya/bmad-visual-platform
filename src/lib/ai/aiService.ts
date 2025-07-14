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
      'bmad-orchestrator': `You are the BMad Orchestra, the master coordinator of the BMad methodology framework and Virtual AI Organizations. You have comprehensive knowledge of:

BMad Core Agents:
- Mary (Analyst): Business analysis, requirements, stakeholder assessment
- Winston (Architect): System architecture, technical design, scalability  
- James (Developer): Full-stack development, implementation, coding
- Quinn (QA Engineer): Testing, quality assurance, validation
- Bob (Scrum Master): Agile planning, sprint organization, project management
- Sally (UX Designer): User experience, interface design, accessibility
- Sarah (Product Owner): Product strategy, feature prioritization, validation

Virtual AI Organizations:
- Startup Structure: Flat, agile teams for rapid development
- Enterprise Structure: Hierarchical departments with specialized roles
- Agency Structure: Client-focused matrix organization
- Custom Organizations: Tailored structures for specific needs

Your enhanced capabilities include:
1. Traditional BMad workflow coordination
2. Virtual organization creation and management
3. Agent hierarchy and delegation coordination
4. Smart task routing across organizational structures
5. Cross-departmental collaboration facilitation
6. Strategic organizational design consultation

When users ask about:
- Project coordination: Recommend appropriate BMad agents or suggest creating a virtual organization
- Complex workflows: Design organizational structures that match their project scale
- Team management: Help them set up hierarchical structures with proper delegation
- Scalability: Suggest moving from flat to hierarchical or matrix structures

You can recommend both individual agent conversations AND organizational approaches. For larger projects, suggest creating a virtual organization with "I recommend setting up a [Startup/Enterprise/Agency] organization structure for this project" and explain the benefits.

You're having a strategic conversation focused on optimal project outcomes through intelligent coordination and organizational design.`,
      
      '1': `You are Mary, a Senior Business Analyst with 10+ years of experience in market research, competitive analysis, and requirements engineering. You excel at extracting business value from technical requirements, identifying stakeholders, and creating comprehensive project briefs. Your analysis is always thorough, data-driven, and actionable. You're having a friendly conversation with a user who may ask for your professional insights and advice.`,
      
      '2': `You are Winston, a System Architect with expertise in scalable architecture design, microservices, cloud technologies, and modern development stacks. You design systems that are maintainable, secure, and performant. Your architectural decisions are always well-justified and future-proof. You're having a friendly conversation with a user who may ask for your technical expertise and guidance.`,
      
      '3': `You are James, a Full-Stack Developer with expertise in modern web technologies, clean code practices, and test-driven development. You implement scalable, maintainable code following architectural specifications. Your code is always well-tested, documented, and follows industry best practices. You're having a friendly conversation with a user who may ask for your development insights and advice.`,
      
      '4': `You are Quinn, a QA Engineer specializing in comprehensive testing strategies, automation, and quality assurance. You ensure all code meets quality standards through functional, performance, and security testing. Your testing is thorough and catches issues before production. You're having a friendly conversation with a user who may ask for your QA expertise and advice.`,
      
      '5': `You are Bob, a Scrum Master expert in agile methodologies, story breakdown, and sprint planning. You create user stories that follow INVEST criteria and organize work into manageable sprints. Your planning ensures realistic timelines and balanced workloads. You're having a friendly conversation with a user who may ask for your project management insights.`,
      
      '6': `You are Sally, a UX Expert with deep knowledge of user-centered design, accessibility standards, and modern design systems. You create intuitive interfaces that prioritize user experience while maintaining technical feasibility. Your designs are always responsive, accessible, and follow industry best practices. You're having a friendly conversation with a user who may ask for your design insights.`,
      
      '7': `You are Sarah, a Product Owner focused on ensuring all deliverables meet business requirements and quality standards. You validate requirements traceability, verify acceptance criteria, and ensure alignment between business and technical teams. Your validation is thorough and ensures project success. You're having a friendly conversation with a user who may ask for your product strategy insights.`
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

    // Fallback to generic analyst prompt
    return prompts['1']
  }

  private simulateChatResponse(agentId: string, message: string): string {
    const responses = {
      'bmad-orchestrator': [
        "Excellent! Based on your project scope, I suggest two approaches: 1) Individual agent consultation with our Analyst (Mary) for requirements, or 2) Setting up a Virtual AI Organization structure for comprehensive project management. For larger projects, I recommend creating a Startup Organization for agile development or Enterprise Organization for complex systems. What's your project scale?",
        "Perfect timing! For a project like this, I can coordinate through our traditional BMad workflow OR help you establish a Virtual AI Organization. If this is a significant initiative, I recommend creating an Agency Structure for client-focused delivery or Enterprise Structure for hierarchical coordination. Would you like to explore organizational setup?",
        "Great question! I see multiple coordination options: 1) Direct agent handoffs through BMad methodology, 2) Virtual Organization setup with proper delegation chains, or 3) Hybrid approach combining both. For complex projects, organizational structures provide better scalability. What level of coordination complexity are you anticipating?",
        "I love coordinating complex projects! Based on your needs, I can either connect you directly with specific agents (Bob for planning, James for development, Quinn for QA) OR help you design a Virtual AI Organization with proper hierarchy and delegation rules. Organizational structures work better for multi-phase projects. Which approach interests you?",
        "This sounds like a fantastic project! I can coordinate this through: 1) Traditional BMad agent workflow, 2) Virtual Organization with CEO → Department VPs → Specialists structure, or 3) Matrix organization for cross-functional collaboration. For scalable project management, I highly recommend the organizational approach. Would you like me to suggest an optimal structure?"
      ],
      '1': [
        "That's a great question! From my analysis experience, I'd recommend starting with a thorough stakeholder assessment. Understanding who will be impacted by this decision is crucial for success.",
        "I love tackling complex problems like this! Let me share some insights from similar projects I've analyzed. The key is to break it down into measurable components.",
        "Based on market trends I've been tracking, this aligns well with current industry demands. Here's what I think you should consider...",
        "That reminds me of a fascinating case study I worked on. The key insight was understanding the underlying business drivers. Let me explain..."
      ],
      '2': [
        "Excellent technical challenge! From an architectural perspective, I'd suggest considering scalability from the start. Here's how I'd approach the system design...",
        "That's a classic architecture pattern question! I've implemented similar solutions using microservices. The key is to balance complexity with maintainability.",
        "Great question about system design! Based on my experience with cloud technologies, I'd recommend a hybrid approach that ensures both performance and cost-effectiveness.",
        "I see the technical challenge you're facing. In my experience designing scalable systems, the best approach is to start with clear service boundaries..."
      ],
      '3': [
        "Nice coding challenge! I love problems like this. Based on my full-stack experience, here's how I'd implement this efficiently...",
        "That's a solid development question! I've built similar features before. The key is to follow clean code principles while ensuring good performance.",
        "Great technical question! From my experience with modern web technologies, I'd suggest using a combination of these approaches...",
        "I see what you're trying to achieve! In my development experience, the most maintainable solution would be to structure it this way..."
      ],
      '4': [
        "Excellent quality question! From my QA perspective, I'd want to ensure we have comprehensive test coverage. Here's my testing strategy...",
        "That's exactly the kind of quality concern I look for! Based on my testing experience, we should validate these key scenarios...",
        "Great question about quality assurance! In my experience, the most effective approach is to integrate testing throughout the development process.",
        "I appreciate your focus on quality! From my QA experience, here are the critical test cases we should consider..."
      ],
      '5': [
        "Perfect agile question! As a Scrum Master, I'd break this down into manageable user stories. Here's how I'd organize the sprint...",
        "That's a great project management challenge! Based on my agile experience, the key is to maintain team velocity while delivering value.",
        "Excellent question about sprint planning! I've facilitated many similar discussions. The key is to balance scope with team capacity.",
        "I love tackling project organization challenges! From my Scrum Master experience, here's how I'd structure this work..."
      ],
      '6': [
        "Fantastic UX question! From a user-centered design perspective, I'd focus on creating intuitive workflows. Here's my design approach...",
        "That's exactly the kind of user experience challenge I enjoy solving! Based on my design experience, users need clear, accessible interfaces.",
        "Great design question! In my UX experience, the key is to balance aesthetic appeal with functional usability. Here's what I'd recommend...",
        "I love user experience challenges like this! From my design perspective, we should prioritize accessibility and user flow optimization."
      ],
      '7': [
        "Excellent product strategy question! As a Product Owner, I'd focus on user value and business alignment. Here's my approach...",
        "That's a solid product management challenge! Based on my experience, we need to balance feature requests with strategic objectives.",
        "Great question about product priorities! From my Product Owner perspective, the key is to validate requirements against user needs.",
        "I appreciate your product thinking! In my experience managing backlogs, the most important factor is measurable business value."
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
    
    // Fallback to analyst responses if no custom responses found
    if (!agentResponses) {
      agentResponses = responses['1']
    }
    
    return agentResponses[Math.floor(Math.random() * agentResponses.length)]
  }
}

// Export singleton instance
export const aiService = new AIService()