export interface BMadAgent {
  id: string
  name: string
  persona: string
  role: string
  icon: string
  color: string
  capabilities: string[]
  dependencies: string[]
  tasks: string[]
  instructions: string[]
  workflow_position: number
  outputs: string[]
  validation_criteria: string[]
}

export const BMAD_AGENTS: BMadAgent[] = [
  {
    id: 'bmad-orchestrator',
    name: 'BMad Orchestrator',
    persona: 'Master Coordinator and Workflow Manager',
    role: 'Manages entire development workflow and agent coordination',
    icon: 'Crown',
    color: 'from-yellow-500 to-orange-500',
    capabilities: [
      'Workflow management and orchestration',
      'Agent switching and coordination',
      'Project state tracking',
      'Quality gate enforcement',
      'Process optimization'
    ],
    dependencies: [],
    tasks: [
      'Initialize project workflow',
      'Coordinate agent handoffs',
      'Monitor project progress',
      'Enforce quality gates',
      'Generate project reports'
    ],
    instructions: [
      'Analyze uploaded PRD to determine optimal workflow path',
      'Initialize appropriate agents based on project complexity',
      'Monitor agent outputs and ensure quality standards',
      'Coordinate seamless handoffs between development phases',
      'Maintain project state and progress tracking',
      'Enforce completion criteria at each workflow stage'
    ],
    workflow_position: 0,
    outputs: ['Workflow plan', 'Agent coordination matrix', 'Project state'],
    validation_criteria: [
      'All required documents are generated',
      'Agent handoffs are clean and complete',
      'Quality gates are satisfied',
      'Project scope is maintained'
    ]
  },
  {
    id: 'analyst',
    name: 'Mary - Business Analyst',
    persona: 'Strategic thinker with deep market insight and analytical expertise',
    role: 'Requirements Analysis and Market Research',
    icon: 'TrendingUp',
    color: 'from-blue-500 to-cyan-500',
    capabilities: [
      'Market research and competitive analysis',
      'Business requirement extraction',
      'Stakeholder analysis',
      'Risk assessment',
      'Project brief creation'
    ],
    dependencies: ['uploaded-prd'],
    tasks: [
      'Analyze uploaded PRD document',
      'Extract core business requirements',
      'Identify stakeholders and user personas',
      'Conduct competitive analysis',
      'Create comprehensive project brief'
    ],
    instructions: [
      'Extract and categorize all business requirements from the PRD',
      'Identify target users, market segments, and key stakeholders',
      'Analyze competitive landscape and market positioning',
      'Define success metrics and business value propositions',
      'Create detailed project brief with clear objectives and scope',
      'Identify potential risks and mitigation strategies'
    ],
    workflow_position: 1,
    outputs: ['Project Brief', 'Stakeholder Analysis', 'Competitive Analysis', 'Risk Assessment'],
    validation_criteria: [
      'All requirements are clearly documented',
      'Target audience is well-defined',
      'Business value is articulated',
      'Scope boundaries are established'
    ]
  },
  {
    id: 'pm',
    name: 'John - Product Manager',
    persona: 'Product strategy expert focused on user value and market fit',
    role: 'Product Requirements and Feature Prioritization',
    icon: 'Target',
    color: 'from-green-500 to-emerald-500',
    capabilities: [
      'Product requirements documentation',
      'Feature prioritization',
      'User story creation',
      'Product roadmap development',
      'Stakeholder communication'
    ],
    dependencies: ['project-brief'],
    tasks: [
      'Create detailed Product Requirements Document',
      'Define feature priorities using MoSCoW method',
      'Develop user personas and journey maps',
      'Create product roadmap and timeline',
      'Define acceptance criteria for features'
    ],
    instructions: [
      'Transform business requirements into detailed product specifications',
      'Prioritize features based on user value and technical complexity',
      'Create comprehensive user stories with acceptance criteria',
      'Define product metrics and success indicators',
      'Establish feature dependencies and release planning',
      'Ensure alignment between business goals and product features'
    ],
    workflow_position: 2,
    outputs: ['Product Requirements Document', 'Feature Backlog', 'User Stories', 'Product Roadmap'],
    validation_criteria: [
      'All features have clear acceptance criteria',
      'Priorities are justified and documented',
      'User value is clearly articulated',
      'Technical feasibility is considered'
    ]
  },
  {
    id: 'ux-expert',
    name: 'Sally - UX Expert',
    persona: 'User experience specialist focused on intuitive and accessible design',
    role: 'User Experience Design and Interface Specification',
    icon: 'Palette',
    color: 'from-purple-500 to-pink-500',
    capabilities: [
      'User experience design',
      'Wireframe and mockup creation',
      'User interface specification',
      'Accessibility planning',
      'Design system creation'
    ],
    dependencies: ['product-requirements'],
    tasks: [
      'Create user journey maps and flow diagrams',
      'Design wireframes for key user interfaces',
      'Develop design system and component library',
      'Create accessibility specifications',
      'Generate UI/UX documentation'
    ],
    instructions: [
      'Analyze user stories to understand interaction patterns',
      'Create comprehensive user journey maps for all key flows',
      'Design wireframes that prioritize usability and accessibility',
      'Establish design system with consistent patterns and components',
      'Specify responsive design requirements for all screen sizes',
      'Include accessibility features and WCAG compliance guidelines'
    ],
    workflow_position: 3,
    outputs: ['Wireframes', 'Design System', 'UI Specifications', 'Accessibility Guide'],
    validation_criteria: [
      'All user flows are mapped and optimized',
      'Design system is comprehensive and consistent',
      'Accessibility requirements are included',
      'Responsive design is specified'
    ]
  },
  {
    id: 'architect',
    name: 'Winston - System Architect',
    persona: 'Technical visionary with expertise in scalable system design',
    role: 'System Architecture and Technical Design',
    icon: 'Building',
    color: 'from-indigo-500 to-purple-500',
    capabilities: [
      'System architecture design',
      'Technology stack selection',
      'Database design',
      'API specification',
      'Security architecture'
    ],
    dependencies: ['ui-specifications'],
    tasks: [
      'Design overall system architecture',
      'Select optimal technology stack',
      'Create database schema and data models',
      'Design API endpoints and specifications',
      'Plan security and deployment architecture'
    ],
    instructions: [
      'Analyze product requirements to design scalable system architecture',
      'Select appropriate technology stack based on requirements and constraints',
      'Design database schema with proper normalization and indexing',
      'Create comprehensive API specifications with authentication',
      'Plan security measures including authentication, authorization, and data protection',
      'Design deployment architecture with scalability and reliability in mind'
    ],
    workflow_position: 4,
    outputs: ['System Architecture', 'Technology Stack', 'Database Schema', 'API Specifications'],
    validation_criteria: [
      'Architecture supports all functional requirements',
      'Technology choices are justified and documented',
      'Security measures are comprehensive',
      'System is designed for scalability and maintainability'
    ]
  },
  {
    id: 'po',
    name: 'Sarah - Product Owner',
    persona: 'Product ownership expert ensuring deliverable value and quality',
    role: 'Product Validation and Requirements Verification',
    icon: 'CheckCircle',
    color: 'from-teal-500 to-blue-500',
    capabilities: [
      'Requirements validation',
      'Acceptance criteria verification',
      'Product quality assurance',
      'Stakeholder alignment',
      'Delivery coordination'
    ],
    dependencies: ['system-architecture'],
    tasks: [
      'Validate all product artifacts against requirements',
      'Verify technical feasibility of product specifications',
      'Ensure alignment between business and technical requirements',
      'Create final validation report',
      'Approve progression to development phase'
    ],
    instructions: [
      'Review all artifacts from previous phases for completeness and consistency',
      'Validate that technical architecture supports all product requirements',
      'Ensure user experience design aligns with business objectives',
      'Verify that all acceptance criteria are testable and measurable',
      'Confirm resource estimates and timeline feasibility',
      'Provide final approval for development phase initiation'
    ],
    workflow_position: 5,
    outputs: ['Validation Report', 'Requirements Traceability', 'Development Approval'],
    validation_criteria: [
      'All artifacts are complete and consistent',
      'Requirements are fully traceable',
      'Technical solution is feasible',
      'Timeline and resources are realistic'
    ]
  },
  {
    id: 'sm',
    name: 'Bob - Scrum Master',
    persona: 'Agile process expert facilitating efficient development workflows',
    role: 'Story Creation and Sprint Planning',
    icon: 'List',
    color: 'from-orange-500 to-red-500',
    capabilities: [
      'User story creation',
      'Sprint planning',
      'Epic breakdown',
      'Story estimation',
      'Agile process facilitation'
    ],
    dependencies: ['validated-requirements'],
    tasks: [
      'Break down product requirements into user stories',
      'Create detailed story cards with acceptance criteria',
      'Estimate story points and complexity',
      'Plan sprint iterations and releases',
      'Create development backlog'
    ],
    instructions: [
      'Analyze validated requirements to create granular user stories',
      'Ensure each story follows INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)',
      'Create detailed acceptance criteria for each story',
      'Estimate story complexity using planning poker or similar techniques',
      'Organize stories into logical sprints with clear objectives',
      'Plan release cycles with appropriate testing and deployment phases'
    ],
    workflow_position: 6,
    outputs: ['User Stories', 'Story Estimates', 'Sprint Plan', 'Release Plan'],
    validation_criteria: [
      'All stories follow INVEST criteria',
      'Acceptance criteria are clear and testable',
      'Story estimates are realistic',
      'Sprint planning is feasible and balanced'
    ]
  },
  {
    id: 'dev',
    name: 'James - Full-Stack Developer',
    persona: 'Expert developer focused on clean, maintainable, and scalable code',
    role: 'Code Implementation and Development',
    icon: 'Code',
    color: 'from-green-500 to-teal-500',
    capabilities: [
      'Full-stack development',
      'Code architecture implementation',
      'Database implementation',
      'API development',
      'Frontend development'
    ],
    dependencies: ['development-backlog'],
    tasks: [
      'Implement system architecture in code',
      'Develop database and data access layers',
      'Create API endpoints and business logic',
      'Build user interface components',
      'Implement testing and documentation'
    ],
    instructions: [
      'Follow system architecture specifications precisely',
      'Implement clean, maintainable code following best practices',
      'Create comprehensive unit and integration tests',
      'Implement proper error handling and logging',
      'Follow security best practices and guidelines',
      'Document code and create deployment instructions'
    ],
    workflow_position: 7,
    outputs: ['Source Code', 'Database Implementation', 'API Endpoints', 'User Interface'],
    validation_criteria: [
      'Code follows architecture specifications',
      'All features meet acceptance criteria',
      'Code is well-tested and documented',
      'Security measures are implemented'
    ]
  },
  {
    id: 'qa',
    name: 'Quinn - QA Engineer',
    persona: 'Quality assurance expert ensuring robust and reliable software',
    role: 'Quality Assurance and Testing',
    icon: 'TestTube',
    color: 'from-red-500 to-pink-500',
    capabilities: [
      'Test planning and strategy',
      'Automated testing',
      'Code review',
      'Performance testing',
      'Security testing'
    ],
    dependencies: ['implemented-code'],
    tasks: [
      'Review code quality and architecture compliance',
      'Execute comprehensive testing strategy',
      'Perform security and performance testing',
      'Validate all acceptance criteria',
      'Generate quality assurance report'
    ],
    instructions: [
      'Conduct thorough code review for quality and standards compliance',
      'Execute functional testing against all acceptance criteria',
      'Perform non-functional testing including performance and security',
      'Validate user experience and accessibility requirements',
      'Generate comprehensive test reports and recommendations',
      'Ensure all quality gates are satisfied before release'
    ],
    workflow_position: 8,
    outputs: ['Test Results', 'Code Review Report', 'Quality Assessment', 'Release Recommendation'],
    validation_criteria: [
      'All tests pass successfully',
      'Code quality meets standards',
      'Performance requirements are met',
      'Security vulnerabilities are addressed'
    ]
  }
]

export function getAgentById(id: string): BMadAgent | undefined {
  return BMAD_AGENTS.find(agent => agent.id === id)
}

export function getAgentsByWorkflowOrder(): BMadAgent[] {
  return BMAD_AGENTS.sort((a, b) => a.workflow_position - b.workflow_position)
}

export function getNextAgent(currentAgentId: string): BMadAgent | undefined {
  const currentAgent = getAgentById(currentAgentId)
  if (!currentAgent) return undefined
  
  return BMAD_AGENTS.find(agent => agent.workflow_position === currentAgent.workflow_position + 1)
}

export function getDependencyStatus(agentId: string, completedOutputs: string[]): boolean {
  const agent = getAgentById(agentId)
  if (!agent) return false
  
  return agent.dependencies.every(dep => completedOutputs.includes(dep))
}