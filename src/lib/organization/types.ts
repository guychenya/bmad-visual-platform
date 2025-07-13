// Virtual AI Organization Types and Interfaces

export interface AgentRole {
  id: string
  name: string
  title: string
  specialization: string[]
  description: string
  level: 'C-Level' | 'VP' | 'Director' | 'Manager' | 'Senior' | 'Specialist'
  icon: string
  color: string
  capabilities: string[]
  personality: string
  communicationStyle: 'formal' | 'casual' | 'technical' | 'strategic'
}

export interface OrganizationNode {
  agentId: string
  role: AgentRole
  reportsTo?: string
  directReports: string[]
  department: string
  teamSize?: number
  responsibilities: string[]
  delegationRules: DelegationRule[]
  collaborationPreferences: string[]
}

export interface DelegationRule {
  condition: string
  targetAgent?: string
  targetDepartment?: string
  escalationLevel: number
  priority: 'high' | 'medium' | 'low'
}

export interface Department {
  id: string
  name: string
  description: string
  color: string
  icon: string
  vpAgent: string
  focus: string[]
  kpis: string[]
  collaboratesWith: string[]
}

export interface Organization {
  id: string
  name: string
  description: string
  structure: 'hierarchical' | 'flat' | 'matrix' | 'network'
  ceo: string
  departments: Record<string, Department>
  agents: Record<string, OrganizationNode>
  workflowRules: WorkflowRule[]
  communicationChannels: CommunicationChannel[]
  created: string
  modified: string
}

export interface WorkflowRule {
  id: string
  trigger: string
  condition: string
  actions: WorkflowAction[]
  priority: number
}

export interface WorkflowAction {
  type: 'delegate' | 'escalate' | 'collaborate' | 'notify'
  target: string
  parameters: Record<string, any>
}

export interface CommunicationChannel {
  id: string
  name: string
  type: 'direct' | 'team' | 'department' | 'all-hands'
  participants: string[]
  purpose: string
}

export interface TaskDelegation {
  id: string
  task: string
  context: string
  fromAgent: string
  toAgent: string
  priority: 'urgent' | 'high' | 'medium' | 'low'
  deadline?: string
  requirements: string[]
  expectedOutputs: string[]
  status: 'pending' | 'in-progress' | 'completed' | 'escalated'
  delegatedAt: string
  completedAt?: string
}

export interface OrganizationTemplate {
  id: string
  name: string
  description: string
  type: 'startup' | 'enterprise' | 'agency' | 'consulting' | 'product' | 'custom'
  structure: Organization
  useCase: string[]
  benefits: string[]
}

// Pre-defined agent roles for templates
export const AGENT_ROLES: Record<string, AgentRole> = {
  'ceo': {
    id: 'ceo',
    name: 'Chief Executive Officer',
    title: 'CEO & Strategic Leader',
    specialization: ['Strategic Planning', 'Vision Setting', 'Executive Leadership', 'Stakeholder Management'],
    description: 'Provides overall strategic direction and coordinates all organizational activities',
    level: 'C-Level',
    icon: 'Crown',
    color: 'from-gold-500 to-yellow-500',
    capabilities: ['Strategic Vision', 'Team Coordination', 'Decision Making', 'Resource Allocation'],
    personality: 'Visionary and decisive leader',
    communicationStyle: 'strategic'
  },
  'cto': {
    id: 'cto',
    name: 'Chief Technology Officer',
    title: 'CTO & Technology Leader',
    specialization: ['Technology Strategy', 'Architecture Oversight', 'Innovation Leadership', 'Technical Vision'],
    description: 'Leads technology strategy and oversees all technical initiatives',
    level: 'C-Level',
    icon: 'Cpu',
    color: 'from-blue-600 to-indigo-600',
    capabilities: ['Technical Strategy', 'Architecture Review', 'Technology Evaluation', 'Innovation Management'],
    personality: 'Technical visionary and strategic thinker',
    communicationStyle: 'technical'
  },
  'product-vp': {
    id: 'product-vp',
    name: 'VP of Product',
    title: 'Product Strategy & Vision Leader',
    specialization: ['Product Strategy', 'Market Analysis', 'User Research', 'Product Roadmaps'],
    description: 'Defines product vision and strategy, leads product development initiatives',
    level: 'VP',
    icon: 'Target',
    color: 'from-purple-500 to-pink-500',
    capabilities: ['Product Vision', 'Market Research', 'User Experience Strategy', 'Product Analytics'],
    personality: 'Customer-focused and analytical',
    communicationStyle: 'strategic'
  },
  'engineering-vp': {
    id: 'engineering-vp',
    name: 'VP of Engineering',
    title: 'Engineering Leadership & Delivery',
    specialization: ['Engineering Management', 'Technical Leadership', 'Team Building', 'Delivery Excellence'],
    description: 'Leads engineering teams and ensures technical excellence in delivery',
    level: 'VP',
    icon: 'Code',
    color: 'from-green-500 to-emerald-500',
    capabilities: ['Technical Leadership', 'Team Management', 'Architecture Guidance', 'Quality Assurance'],
    personality: 'Technical leader focused on execution',
    communicationStyle: 'technical'
  },
  'solution-architect': {
    id: 'solution-architect',
    name: 'Solution Architect',
    title: 'Technical Architecture Specialist',
    specialization: ['System Architecture', 'Technology Selection', 'Integration Design', 'Scalability Planning'],
    description: 'Designs comprehensive technical solutions and system architectures',
    level: 'Senior',
    icon: 'Building',
    color: 'from-blue-500 to-cyan-500',
    capabilities: ['System Design', 'Technology Stack Selection', 'Performance Optimization', 'Security Architecture'],
    personality: 'Systematic and detail-oriented architect',
    communicationStyle: 'technical'
  },
  'product-manager': {
    id: 'product-manager',
    name: 'Product Manager',
    title: 'Product Development & Strategy',
    specialization: ['Product Planning', 'Feature Definition', 'User Stories', 'Market Requirements'],
    description: 'Manages product development lifecycle and defines product requirements',
    level: 'Manager',
    icon: 'Lightbulb',
    color: 'from-orange-500 to-red-500',
    capabilities: ['Requirements Gathering', 'User Story Creation', 'Product Analytics', 'Stakeholder Communication'],
    personality: 'Strategic and user-focused',
    communicationStyle: 'formal'
  },
  'senior-developer': {
    id: 'senior-developer',
    name: 'Senior Developer',
    title: 'Full-Stack Development Expert',
    specialization: ['Software Development', 'Code Architecture', 'Technical Implementation', 'Mentoring'],
    description: 'Implements complex software solutions and mentors development teams',
    level: 'Senior',
    icon: 'Code2',
    color: 'from-indigo-500 to-purple-500',
    capabilities: ['Full-Stack Development', 'Code Review', 'Technical Mentoring', 'Problem Solving'],
    personality: 'Practical and solution-oriented',
    communicationStyle: 'technical'
  },
  'ux-director': {
    id: 'ux-director',
    name: 'UX Director',
    title: 'User Experience Leadership',
    specialization: ['UX Strategy', 'Design Leadership', 'User Research', 'Experience Design'],
    description: 'Leads user experience strategy and design team initiatives',
    level: 'Director',
    icon: 'Palette',
    color: 'from-pink-500 to-rose-500',
    capabilities: ['UX Strategy', 'Design Systems', 'User Research', 'Design Leadership'],
    personality: 'Creative and user-empathetic',
    communicationStyle: 'casual'
  },
  'qa-director': {
    id: 'qa-director',
    name: 'QA Director',
    title: 'Quality Assurance Leadership',
    specialization: ['Quality Strategy', 'Test Planning', 'Process Optimization', 'Team Leadership'],
    description: 'Ensures quality standards and leads QA initiatives across all products',
    level: 'Director',
    icon: 'Shield',
    color: 'from-yellow-500 to-orange-500',
    capabilities: ['Quality Strategy', 'Test Automation', 'Process Improvement', 'Risk Management'],
    personality: 'Detail-oriented and systematic',
    communicationStyle: 'formal'
  },
  'data-scientist': {
    id: 'data-scientist',
    name: 'Data Scientist',
    title: 'Data Analytics & Insights Specialist',
    specialization: ['Data Analysis', 'Machine Learning', 'Statistical Modeling', 'Business Intelligence'],
    description: 'Provides data-driven insights and develops analytical models',
    level: 'Specialist',
    icon: 'BarChart',
    color: 'from-teal-500 to-blue-500',
    capabilities: ['Data Analysis', 'Predictive Modeling', 'Data Visualization', 'Statistical Analysis'],
    personality: 'Analytical and data-driven',
    communicationStyle: 'technical'
  },
  'devops-engineer': {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    title: 'Infrastructure & Deployment Specialist',
    specialization: ['CI/CD', 'Infrastructure Management', 'Automation', 'Monitoring'],
    description: 'Manages infrastructure, deployment pipelines, and operational excellence',
    level: 'Specialist',
    icon: 'Settings',
    color: 'from-gray-500 to-slate-600',
    capabilities: ['Infrastructure Automation', 'Deployment Management', 'Monitoring & Alerting', 'Security Operations'],
    personality: 'Systematic and reliability-focused',
    communicationStyle: 'technical'
  }
}