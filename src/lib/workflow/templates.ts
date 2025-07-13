import { Code, Users, Building, Palette, Target, Briefcase, Smartphone, Globe, Database, ShoppingCart } from 'lucide-react'

export interface WorkflowTemplate {
  id: string
  name: string
  description: string
  type: 'greenfield' | 'brownfield' | 'custom'
  agents: string[]
  structure: string
  estimatedDuration: number
  phases: WorkflowPhase[]
}

export interface WorkflowPhase {
  id: string
  name: string
  description: string
  agentId: string
  estimatedDuration: number
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

export interface ProjectTemplate {
  id: string
  name: string
  description: string
  type: 'web-app' | 'mobile-app' | 'api' | 'dashboard' | 'e-commerce' | 'saas' | 'custom'
  icon: any
  color: string
  workflow: WorkflowTemplate
  features: string[]
  techStack: string[]
  complexity: 'simple' | 'medium' | 'complex'
  category: string
}

export const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    id: 'greenfield-complete',
    name: 'Complete Greenfield Development',
    description: 'Full end-to-end development workflow for new projects',
    type: 'greenfield',
    agents: ['bmad-orchestrator', 'analyst', 'pm', 'ux-expert', 'architect', 'po', 'sm', 'dev', 'qa'],
    structure: 'sequential',
    estimatedDuration: 1800,
    phases: [
      {
        id: 'orchestration',
        name: 'Project Orchestration',
        description: 'Initialize workflow and coordinate agents',
        agentId: 'bmad-orchestrator',
        estimatedDuration: 60,
        dependencies: [],
        outputs: ['workflow-plan', 'agent-coordination-matrix'],
        tasks: [
          {
            id: 'analyze-requirements',
            name: 'Analyze Requirements',
            description: 'Process project requirements and determine workflow',
            instructions: [
              'Parse project requirements and scope',
              'Determine optimal workflow path',
              'Initialize agent coordination',
              'Set up quality gates'
            ],
            estimatedTime: 30,
            outputs: ['requirements-analysis', 'workflow-plan']
          }
        ]
      },
      {
        id: 'business-analysis',
        name: 'Business Analysis',
        description: 'Extract requirements and create project brief',
        agentId: 'analyst',
        estimatedDuration: 180,
        dependencies: ['workflow-plan'],
        outputs: ['project-brief', 'stakeholder-analysis'],
        tasks: [
          {
            id: 'requirements-extraction',
            name: 'Extract Business Requirements',
            description: 'Analyze and extract core business requirements',
            instructions: [
              'Parse requirements document',
              'Identify stakeholders and user personas',
              'Define business objectives',
              'Create project brief'
            ],
            estimatedTime: 90,
            outputs: ['business-requirements', 'stakeholder-map']
          }
        ]
      }
    ]
  },
  {
    id: 'mobile-workflow',
    name: 'Mobile App Development',
    description: 'Mobile-focused development workflow',
    type: 'greenfield',
    agents: ['bmad-orchestrator', 'analyst', 'pm', 'ux-expert', 'architect', 'dev', 'qa'],
    structure: 'mobile-optimized',
    estimatedDuration: 1500,
    phases: []
  },
  {
    id: 'api-workflow',
    name: 'API Development',
    description: 'Backend-focused development workflow',
    type: 'greenfield',
    agents: ['bmad-orchestrator', 'analyst', 'architect', 'dev', 'qa'],
    structure: 'backend-focused',
    estimatedDuration: 1000,
    phases: []
  }
]

export const PROJECT_TEMPLATES: ProjectTemplate[] = [
  {
    id: 'web-app-template',
    name: 'Modern Web Application',
    description: 'Full-stack web application with React frontend and Node.js backend',
    type: 'web-app',
    icon: Code,
    color: 'from-blue-500 to-cyan-500',
    category: 'Web Development',
    workflow: WORKFLOW_TEMPLATES[0],
    features: ['User Authentication', 'Dashboard', 'API Integration', 'Responsive Design'],
    techStack: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    complexity: 'medium'
  },
  {
    id: 'mobile-app-template',
    name: 'Cross-Platform Mobile App',
    description: 'React Native mobile application for iOS and Android',
    type: 'mobile-app',
    icon: Smartphone,
    color: 'from-purple-500 to-pink-500',
    category: 'Mobile Development',
    workflow: WORKFLOW_TEMPLATES[1],
    features: ['Native Performance', 'Offline Support', 'Push Notifications', 'Cross-Platform'],
    techStack: ['React Native', 'TypeScript', 'Firebase', 'Redux'],
    complexity: 'complex'
  },
  {
    id: 'api-template',
    name: 'REST API Service',
    description: 'Scalable backend API with authentication and documentation',
    type: 'api',
    icon: Building,
    color: 'from-green-500 to-emerald-500',
    category: 'Backend Development',
    workflow: WORKFLOW_TEMPLATES[2],
    features: ['RESTful Endpoints', 'Authentication', 'Rate Limiting', 'Documentation'],
    techStack: ['Node.js', 'Express', 'MongoDB', 'Swagger'],
    complexity: 'simple'
  },
  {
    id: 'dashboard-template',
    name: 'Analytics Dashboard',
    description: 'Data visualization dashboard with real-time analytics',
    type: 'dashboard',
    icon: Target,
    color: 'from-yellow-500 to-orange-500',
    category: 'Data & Analytics',
    workflow: WORKFLOW_TEMPLATES[0],
    features: ['Real-time Charts', 'Data Export', 'User Management', 'Custom Reports'],
    techStack: ['React', 'D3.js', 'Python', 'Redis'],
    complexity: 'medium'
  },
  {
    id: 'ecommerce-template',
    name: 'E-commerce Platform',
    description: 'Full-featured online store with payment processing',
    type: 'e-commerce',
    icon: ShoppingCart,
    color: 'from-red-500 to-pink-500',
    category: 'E-commerce',
    workflow: WORKFLOW_TEMPLATES[0],
    features: ['Product Catalog', 'Shopping Cart', 'Payment Processing', 'Order Management'],
    techStack: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
    complexity: 'complex'
  },
  {
    id: 'saas-template',
    name: 'SaaS Application',
    description: 'Multi-tenant SaaS platform with subscription management',
    type: 'saas',
    icon: Globe,
    color: 'from-indigo-500 to-purple-500',
    category: 'SaaS',
    workflow: WORKFLOW_TEMPLATES[0],
    features: ['Multi-tenancy', 'Subscription Billing', 'User Management', 'Analytics'],
    techStack: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    complexity: 'complex'
  }
]

export function getTemplateById(id: string): ProjectTemplate | undefined {
  return PROJECT_TEMPLATES.find(template => template.id === id)
}

export function getTemplatesByCategory(category: string): ProjectTemplate[] {
  return PROJECT_TEMPLATES.filter(template => template.category === category)
}

export function getAllCategories(): string[] {
  const categories = PROJECT_TEMPLATES.map(template => template.category)
  return Array.from(new Set(categories))
}

export function getWorkflowTemplateById(id: string): WorkflowTemplate | undefined {
  return WORKFLOW_TEMPLATES.find(workflow => workflow.id === id)
}