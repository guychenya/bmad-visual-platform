export interface WorkflowStep {
  id: string
  agentId: string
  name: string
  description: string
  estimatedDuration: number // in seconds
  dependencies: string[]
  outputs: string[]
  tasks: WorkflowTask[]
}

export interface WorkflowTask {
  id: string
  name: string
  description: string
  instructions: string[]
  estimatedTime: number
  outputs: string[]
}

export interface Workflow {
  id: string
  name: string
  description: string
  type: 'greenfield' | 'brownfield'
  steps: WorkflowStep[]
  totalEstimatedTime: number
}

export const BMAD_WORKFLOWS: Workflow[] = [
  {
    id: 'greenfield-complete',
    name: 'Complete Greenfield Development',
    description: 'Full end-to-end development workflow for new projects',
    type: 'greenfield',
    totalEstimatedTime: 1800, // 30 minutes total
    steps: [
      {
        id: 'orchestration',
        agentId: 'bmad-orchestrator',
        name: 'Project Orchestration',
        description: 'Initialize workflow and coordinate agents',
        estimatedDuration: 60,
        dependencies: ['uploaded-prd'],
        outputs: ['workflow-plan', 'agent-coordination-matrix'],
        tasks: [
          {
            id: 'analyze-prd',
            name: 'Analyze PRD Upload',
            description: 'Process and analyze uploaded PRD document',
            instructions: [
              'Parse uploaded document content and structure',
              'Identify document type and complexity level',
              'Extract key project indicators and scope',
              'Determine optimal workflow path based on content analysis',
              'Initialize project state tracking system'
            ],
            estimatedTime: 30,
            outputs: ['document-analysis', 'complexity-assessment']
          },
          {
            id: 'setup-workflow',
            name: 'Setup Project Workflow',
            description: 'Configure workflow and agent sequence',
            instructions: [
              'Select appropriate workflow template based on project type',
              'Configure agent sequence and dependencies',
              'Set up quality gates and validation checkpoints',
              'Initialize project tracking and monitoring systems',
              'Prepare handoff protocols between agents'
            ],
            estimatedTime: 30,
            outputs: ['workflow-configuration', 'quality-gates']
          }
        ]
      },
      {
        id: 'business-analysis',
        agentId: 'analyst',
        name: 'Business Analysis',
        description: 'Extract requirements and create project brief',
        estimatedDuration: 180,
        dependencies: ['workflow-plan'],
        outputs: ['project-brief', 'stakeholder-analysis', 'competitive-analysis'],
        tasks: [
          {
            id: 'requirements-extraction',
            name: 'Extract Business Requirements',
            description: 'Analyze PRD and extract core business requirements',
            instructions: [
              'Parse PRD document for functional and non-functional requirements',
              'Categorize requirements by priority and complexity',
              'Identify implicit requirements and assumptions',
              'Extract business objectives and success criteria',
              'Document requirement traceability matrix'
            ],
            estimatedTime: 60,
            outputs: ['requirements-matrix', 'business-objectives']
          },
          {
            id: 'stakeholder-analysis',
            name: 'Stakeholder Analysis',
            description: 'Identify and analyze project stakeholders',
            instructions: [
              'Identify primary and secondary stakeholders',
              'Analyze stakeholder interests and influence levels',
              'Define user personas and target demographics',
              'Map stakeholder communication requirements',
              'Create stakeholder engagement strategy'
            ],
            estimatedTime: 60,
            outputs: ['stakeholder-map', 'user-personas']
          },
          {
            id: 'competitive-analysis',
            name: 'Competitive Analysis',
            description: 'Research market and competitive landscape',
            instructions: [
              'Identify direct and indirect competitors',
              'Analyze competitive features and positioning',
              'Assess market opportunities and threats',
              'Define competitive advantages and differentiators',
              'Create market positioning strategy'
            ],
            estimatedTime: 60,
            outputs: ['competitive-landscape', 'market-positioning']
          }
        ]
      },
      {
        id: 'product-management',
        agentId: 'pm',
        name: 'Product Management',
        description: 'Create detailed product requirements and roadmap',
        estimatedDuration: 200,
        dependencies: ['project-brief'],
        outputs: ['product-requirements', 'feature-backlog', 'product-roadmap'],
        tasks: [
          {
            id: 'prd-creation',
            name: 'Create Product Requirements Document',
            description: 'Transform business brief into detailed product requirements',
            instructions: [
              'Convert business requirements into detailed product specifications',
              'Define functional requirements with clear acceptance criteria',
              'Specify non-functional requirements (performance, security, usability)',
              'Create detailed feature descriptions and user flows',
              'Establish product metrics and KPIs'
            ],
            estimatedTime: 80,
            outputs: ['detailed-prd', 'acceptance-criteria']
          },
          {
            id: 'feature-prioritization',
            name: 'Feature Prioritization',
            description: 'Prioritize features using MoSCoW methodology',
            instructions: [
              'Apply MoSCoW prioritization to all features',
              'Balance user value against development complexity',
              'Consider technical dependencies and constraints',
              'Define minimum viable product (MVP) scope',
              'Create feature priority matrix and justification'
            ],
            estimatedTime: 60,
            outputs: ['feature-priorities', 'mvp-definition']
          },
          {
            id: 'roadmap-planning',
            name: 'Product Roadmap Planning',
            description: 'Create comprehensive product roadmap and release planning',
            instructions: [
              'Design phased delivery approach with clear milestones',
              'Plan feature releases based on dependencies and priorities',
              'Define release criteria and success metrics',
              'Create timeline with realistic estimates',
              'Plan beta and production release strategies'
            ],
            estimatedTime: 60,
            outputs: ['product-roadmap', 'release-plan']
          }
        ]
      },
      {
        id: 'ux-design',
        agentId: 'ux-expert',
        name: 'UX Design',
        description: 'Create user experience design and interface specifications',
        estimatedDuration: 240,
        dependencies: ['product-requirements'],
        outputs: ['wireframes', 'design-system', 'ui-specifications'],
        tasks: [
          {
            id: 'user-journey-mapping',
            name: 'User Journey Mapping',
            description: 'Map complete user journeys and interaction flows',
            instructions: [
              'Create detailed user journey maps for all personas',
              'Map user flows for key feature interactions',
              'Identify pain points and optimization opportunities',
              'Design seamless navigation and interaction patterns',
              'Validate flows against user stories and acceptance criteria'
            ],
            estimatedTime: 80,
            outputs: ['user-journeys', 'interaction-flows']
          },
          {
            id: 'wireframe-design',
            name: 'Wireframe Design',
            description: 'Create detailed wireframes for all key interfaces',
            instructions: [
              'Design wireframes for all major application screens',
              'Focus on information architecture and layout structure',
              'Ensure responsive design principles for all screen sizes',
              'Include interactive elements and navigation patterns',
              'Validate wireframes against functional requirements'
            ],
            estimatedTime: 100,
            outputs: ['wireframes', 'responsive-layouts']
          },
          {
            id: 'design-system',
            name: 'Design System Creation',
            description: 'Develop comprehensive design system and component library',
            instructions: [
              'Create consistent color palette and typography system',
              'Design reusable UI components and patterns',
              'Define spacing, sizing, and layout grid systems',
              'Establish accessibility standards and guidelines',
              'Create design system documentation and usage guidelines'
            ],
            estimatedTime: 60,
            outputs: ['design-system', 'component-library']
          }
        ]
      },
      {
        id: 'system-architecture',
        agentId: 'architect',
        name: 'System Architecture',
        description: 'Design technical architecture and system specifications',
        estimatedDuration: 280,
        dependencies: ['ui-specifications'],
        outputs: ['system-architecture', 'technology-stack', 'database-schema'],
        tasks: [
          {
            id: 'architecture-design',
            name: 'System Architecture Design',
            description: 'Design overall system architecture and components',
            instructions: [
              'Design scalable system architecture supporting all requirements',
              'Define system components and their interactions',
              'Plan for scalability, reliability, and maintainability',
              'Design integration patterns and communication protocols',
              'Create architecture diagrams and documentation'
            ],
            estimatedTime: 100,
            outputs: ['architecture-diagrams', 'component-specifications']
          },
          {
            id: 'technology-selection',
            name: 'Technology Stack Selection',
            description: 'Select optimal technology stack and tools',
            instructions: [
              'Evaluate technology options against project requirements',
              'Consider factors: performance, scalability, team expertise, ecosystem',
              'Select frontend, backend, database, and deployment technologies',
              'Plan development tools, testing frameworks, and CI/CD pipeline',
              'Document technology choices with justifications'
            ],
            estimatedTime: 80,
            outputs: ['technology-selections', 'tool-recommendations']
          },
          {
            id: 'database-design',
            name: 'Database Design',
            description: 'Design database schema and data models',
            instructions: [
              'Analyze data requirements from product specifications',
              'Design normalized database schema with proper relationships',
              'Plan indexing strategy for optimal performance',
              'Design data access patterns and query optimization',
              'Include data migration and backup strategies'
            ],
            estimatedTime: 60,
            outputs: ['database-schema', 'data-models']
          },
          {
            id: 'api-specification',
            name: 'API Specification',
            description: 'Design RESTful API endpoints and specifications',
            instructions: [
              'Design RESTful API endpoints supporting all frontend needs',
              'Create comprehensive API documentation with examples',
              'Plan authentication and authorization mechanisms',
              'Design error handling and response formats',
              'Include rate limiting and security considerations'
            ],
            estimatedTime: 40,
            outputs: ['api-specifications', 'security-design']
          }
        ]
      },
      {
        id: 'validation',
        agentId: 'po',
        name: 'Product Validation',
        description: 'Validate all artifacts and approve development progression',
        estimatedDuration: 120,
        dependencies: ['system-architecture'],
        outputs: ['validation-report', 'development-approval'],
        tasks: [
          {
            id: 'artifact-validation',
            name: 'Artifact Validation',
            description: 'Validate all deliverables for completeness and consistency',
            instructions: [
              'Review all artifacts from previous phases for completeness',
              'Validate consistency between business requirements and technical design',
              'Ensure traceability from requirements through to technical specifications',
              'Verify that all acceptance criteria are addressed in design',
              'Check alignment between UX design and technical architecture'
            ],
            estimatedTime: 60,
            outputs: ['validation-checklist', 'consistency-report']
          },
          {
            id: 'feasibility-assessment',
            name: 'Technical Feasibility Assessment',
            description: 'Assess technical feasibility and resource requirements',
            instructions: [
              'Validate technical feasibility of proposed architecture',
              'Assess resource requirements and timeline estimates',
              'Identify potential technical risks and mitigation strategies',
              'Verify that scope aligns with available resources and timeline',
              'Provide recommendations for scope adjustments if needed'
            ],
            estimatedTime: 60,
            outputs: ['feasibility-report', 'risk-assessment']
          }
        ]
      },
      {
        id: 'story-creation',
        agentId: 'sm',
        name: 'Story Creation',
        description: 'Break down requirements into development stories',
        estimatedDuration: 180,
        dependencies: ['validation-report'],
        outputs: ['user-stories', 'sprint-plan', 'development-backlog'],
        tasks: [
          {
            id: 'story-breakdown',
            name: 'User Story Breakdown',
            description: 'Convert requirements into granular user stories',
            instructions: [
              'Break down product requirements into implementable user stories',
              'Ensure stories follow INVEST criteria (Independent, Negotiable, Valuable, Estimable, Small, Testable)',
              'Create detailed acceptance criteria for each story',
              'Include definition of done criteria for all stories',
              'Organize stories by feature areas and dependencies'
            ],
            estimatedTime: 90,
            outputs: ['user-story-cards', 'acceptance-criteria']
          },
          {
            id: 'story-estimation',
            name: 'Story Estimation',
            description: 'Estimate story points and complexity',
            instructions: [
              'Estimate story complexity using planning poker methodology',
              'Consider technical complexity, uncertainty, and effort required',
              'Validate estimates against available development capacity',
              'Identify stories requiring further breakdown or research',
              'Create estimation confidence intervals and assumptions'
            ],
            estimatedTime: 60,
            outputs: ['story-estimates', 'estimation-notes']
          },
          {
            id: 'sprint-planning',
            name: 'Sprint Planning',
            description: 'Organize stories into sprint iterations',
            instructions: [
              'Group stories into logical sprint iterations',
              'Ensure each sprint has clear objectives and deliverables',
              'Balance sprint capacity with story estimates',
              'Plan integration and testing activities within sprints',
              'Create release plan with sprint milestones'
            ],
            estimatedTime: 30,
            outputs: ['sprint-plans', 'release-timeline']
          }
        ]
      },
      {
        id: 'development',
        agentId: 'dev',
        name: 'Development',
        description: 'Implement code and build the application',
        estimatedDuration: 400,
        dependencies: ['development-backlog'],
        outputs: ['source-code', 'deployed-application'],
        tasks: [
          {
            id: 'setup-development',
            name: 'Development Environment Setup',
            description: 'Set up development environment and project structure',
            instructions: [
              'Initialize project structure following architecture specifications',
              'Set up development environment with selected technology stack',
              'Configure build tools, testing frameworks, and CI/CD pipeline',
              'Implement project scaffolding and directory structure',
              'Set up code quality tools and development standards'
            ],
            estimatedTime: 60,
            outputs: ['project-setup', 'development-environment']
          },
          {
            id: 'backend-development',
            name: 'Backend Development',
            description: 'Implement backend services and APIs',
            instructions: [
              'Implement database models and data access layers',
              'Create API endpoints following specification',
              'Implement authentication and authorization systems',
              'Add business logic and data validation',
              'Include comprehensive error handling and logging'
            ],
            estimatedTime: 160,
            outputs: ['backend-services', 'api-implementation']
          },
          {
            id: 'frontend-development',
            name: 'Frontend Development',
            description: 'Implement user interface and client-side functionality',
            instructions: [
              'Implement UI components following design system',
              'Create responsive layouts for all screen sizes',
              'Implement client-side routing and navigation',
              'Add form validation and user interaction handling',
              'Integrate with backend APIs and state management'
            ],
            estimatedTime: 140,
            outputs: ['frontend-application', 'ui-components']
          },
          {
            id: 'integration-testing',
            name: 'Integration and Testing',
            description: 'Integrate components and implement testing',
            instructions: [
              'Integrate frontend and backend components',
              'Implement unit tests for all major components',
              'Create integration tests for API endpoints',
              'Add end-to-end tests for critical user journeys',
              'Set up automated testing and continuous integration'
            ],
            estimatedTime: 40,
            outputs: ['integrated-application', 'test-suite']
          }
        ]
      },
      {
        id: 'quality-assurance',
        agentId: 'qa',
        name: 'Quality Assurance',
        description: 'Test application and ensure quality standards',
        estimatedDuration: 200,
        dependencies: ['source-code'],
        outputs: ['test-results', 'quality-report', 'production-ready-app'],
        tasks: [
          {
            id: 'functional-testing',
            name: 'Functional Testing',
            description: 'Execute comprehensive functional testing',
            instructions: [
              'Test all user stories against acceptance criteria',
              'Verify all features work as specified',
              'Test edge cases and error conditions',
              'Validate user flows and navigation',
              'Ensure all requirements are properly implemented'
            ],
            estimatedTime: 80,
            outputs: ['functional-test-results', 'defect-reports']
          },
          {
            id: 'non-functional-testing',
            name: 'Non-Functional Testing',
            description: 'Test performance, security, and usability',
            instructions: [
              'Conduct performance testing and optimization',
              'Perform security testing and vulnerability assessment',
              'Test usability and accessibility compliance',
              'Validate responsive design across devices',
              'Test browser compatibility and cross-platform functionality'
            ],
            estimatedTime: 60,
            outputs: ['performance-results', 'security-assessment']
          },
          {
            id: 'code-review',
            name: 'Code Review and Quality Assessment',
            description: 'Review code quality and architecture compliance',
            instructions: [
              'Conduct comprehensive code review for quality and standards',
              'Verify architecture compliance and design patterns',
              'Check code documentation and maintainability',
              'Validate security best practices implementation',
              'Ensure test coverage meets quality standards'
            ],
            estimatedTime: 40,
            outputs: ['code-review-report', 'quality-metrics']
          },
          {
            id: 'production-readiness',
            name: 'Production Readiness Assessment',
            description: 'Validate application is ready for production deployment',
            instructions: [
              'Verify all quality gates are satisfied',
              'Validate deployment and configuration procedures',
              'Test backup and recovery mechanisms',
              'Confirm monitoring and alerting systems',
              'Generate final quality and readiness report'
            ],
            estimatedTime: 20,
            outputs: ['readiness-assessment', 'deployment-approval']
          }
        ]
      }
    ]
  }
]

export function getWorkflowById(id: string): Workflow | undefined {
  return BMAD_WORKFLOWS.find(workflow => workflow.id === id)
}

export function getWorkflowSteps(workflowId: string): WorkflowStep[] {
  const workflow = getWorkflowById(workflowId)
  return workflow ? workflow.steps : []
}

export function getNextStep(workflowId: string, currentStepId: string): WorkflowStep | undefined {
  const steps = getWorkflowSteps(workflowId)
  const currentIndex = steps.findIndex(step => step.id === currentStepId)
  return currentIndex !== -1 && currentIndex < steps.length - 1 ? steps[currentIndex + 1] : undefined
}