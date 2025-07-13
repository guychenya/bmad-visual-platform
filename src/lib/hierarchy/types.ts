// Hierarchical Project Management System Types
// Three-Tier Structure: Organization → Project → Workflow

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: UserRole
  organizationIds: string[]
  permissions: Permission[]
  createdAt: string
  lastActive: string
}

export interface UserRole {
  id: string
  name: string
  level: 'admin' | 'manager' | 'member' | 'viewer'
  permissions: string[]
}

export interface Permission {
  action: string
  resource: string
  scope: 'organization' | 'project' | 'workflow'
  resourceId?: string
}

// TIER 1: ORGANIZATION LEVEL
export interface Organization {
  id: string
  name: string
  description: string
  type: 'enterprise' | 'startup' | 'agency' | 'nonprofit' | 'custom'
  logo?: string
  settings: OrganizationSettings
  members: OrganizationMember[]
  projects: string[] // Project IDs
  created: string
  modified: string
  createdBy: string
  status: 'active' | 'inactive' | 'archived'
  metadata: {
    totalProjects: number
    activeWorkflows: number
    teamSize: number
    subscription?: SubscriptionTier
  }
}

export interface OrganizationSettings {
  timezone: string
  workingHours: WorkingHours
  defaultProjectTemplate: string
  approvalWorkflow: boolean
  notifications: NotificationSettings
  integrations: Integration[]
  branding: BrandingSettings
}

export interface OrganizationMember {
  userId: string
  role: 'owner' | 'admin' | 'manager' | 'member' | 'viewer'
  permissions: Permission[]
  joinedAt: string
  department?: string
  title?: string
}

// TIER 2: PROJECT LEVEL
export interface Project {
  id: string
  name: string
  description: string
  organizationId: string
  type: 'greenfield' | 'brownfield' | 'integration' | 'research' | 'custom'
  status: 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'critical'
  
  // Project Structure
  workflows: ProjectWorkflow[]
  teams: ProjectTeam[]
  deliverables: Deliverable[]
  milestones: Milestone[]
  
  // Tracking
  progress: ProjectProgress
  timeline: ProjectTimeline
  budget?: ProjectBudget
  
  // Context
  stakeholders: Stakeholder[]
  requirements: Requirement[]
  risks: Risk[]
  
  // Metadata
  created: string
  modified: string
  createdBy: string
  assignedTo: string[]
  tags: string[]
  
  // Settings
  settings: ProjectSettings
}

export interface ProjectWorkflow {
  id: string
  name: string
  type: 'bmad-methodology' | 'agile' | 'waterfall' | 'kanban' | 'custom'
  status: 'draft' | 'active' | 'paused' | 'completed'
  phases: WorkflowPhase[]
  currentPhase: string
  assignedAgents: string[]
  startDate: string
  expectedEndDate: string
  actualEndDate?: string
  progress: number
  deliverables: string[] // Deliverable IDs
  dependencies: WorkflowDependency[]
}

// TIER 3: WORKFLOW LEVEL
export interface WorkflowInstance {
  id: string
  projectId: string
  workflowId: string
  name: string
  description: string
  type: WorkflowType
  status: WorkflowStatus
  
  // Execution
  phases: WorkflowPhaseInstance[]
  currentPhase: string
  progress: WorkflowProgress
  
  // Outputs
  deliverables: DeliverableInstance[]
  artifacts: WorkflowArtifact[]
  reports: WorkflowReport[]
  
  // Team
  assignedAgents: AgentAssignment[]
  humanCollaborators: string[]
  
  // Tracking
  timeline: WorkflowTimeline
  authorizations: Authorization[]
  
  // Context
  inputs: WorkflowInput[]
  context: WorkflowContext
  
  created: string
  modified: string
  createdBy: string
}

export interface WorkflowPhaseInstance {
  id: string
  name: string
  description: string
  status: 'pending' | 'in-progress' | 'review' | 'approved' | 'completed' | 'blocked'
  startDate?: string
  endDate?: string
  estimatedHours: number
  actualHours: number
  assignedAgents: string[]
  deliverables: string[]
  dependencies: string[]
  approvals: Authorization[]
  artifacts: WorkflowArtifact[]
}

// DELIVERABLES AND OUTPUTS
export interface Deliverable {
  id: string
  name: string
  type: 'document' | 'code' | 'design' | 'analysis' | 'presentation' | 'dataset'
  description: string
  status: 'planned' | 'in-progress' | 'review' | 'approved' | 'delivered'
  priority: 'low' | 'medium' | 'high' | 'critical'
  
  // Tracking
  progress: number
  dueDate: string
  completedDate?: string
  
  // Content
  content?: string
  files: DeliverableFile[]
  metadata: Record<string, any>
  
  // Assignment
  assignedTo: string
  reviewers: string[]
  approvers: string[]
  
  // Dependencies
  dependencies: string[]
  blockers: string[]
  
  // Quality
  qualityCriteria: QualityCriterion[]
  testResults: TestResult[]
  
  created: string
  modified: string
}

export interface DeliverableInstance extends Deliverable {
  workflowInstanceId: string
  phaseId: string
  actualDeliveryDate?: string
  qualityScore?: number
  revisionHistory: DeliverableRevision[]
}

// AUTHORIZATION AND APPROVAL SYSTEM
export interface Authorization {
  id: string
  type: 'approval' | 'review' | 'sign-off' | 'gate'
  name: string
  description: string
  required: boolean
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  
  // Approval Details
  approvers: Approver[]
  conditions: ApprovalCondition[]
  deadline?: string
  
  // Results
  decision?: 'approved' | 'rejected' | 'conditional'
  comments: ApprovalComment[]
  decidedAt?: string
  decidedBy?: string
  
  // Context
  resourceType: 'project' | 'workflow' | 'deliverable' | 'phase'
  resourceId: string
  
  created: string
  modified: string
}

export interface Approver {
  userId: string
  role: string
  required: boolean
  weight: number // For weighted approvals
  status: 'pending' | 'approved' | 'rejected'
  comments?: string
  decidedAt?: string
}

// AGENT INTEGRATION
export interface AgentAssignment {
  agentId: string
  role: 'lead' | 'contributor' | 'reviewer' | 'observer'
  responsibilities: string[]
  permissions: Permission[]
  workloadAllocation: number // Percentage
  startDate: string
  endDate?: string
  status: 'assigned' | 'active' | 'completed' | 'unassigned'
}

export interface WorkflowContext {
  organizationId: string
  projectId: string
  projectType: string
  stakeholders: Stakeholder[]
  requirements: Requirement[]
  constraints: Constraint[]
  assumptions: string[]
  environment: 'development' | 'staging' | 'production'
  chatHistory: ChatMessage[]
}

export interface ChatMessage {
  id: string
  type: 'human' | 'agent'
  senderId: string
  content: string
  context: 'project' | 'workflow' | 'deliverable'
  contextId: string
  timestamp: string
  attachments?: ChatAttachment[]
  reactions?: ChatReaction[]
}

// PROGRESS AND ANALYTICS
export interface ProjectProgress {
  overall: number
  byPhase: Record<string, number>
  byDeliverable: Record<string, number>
  timeline: ProgressPoint[]
  velocity: number
  burndown: BurndownPoint[]
  health: 'green' | 'yellow' | 'red'
  risks: string[]
  blockers: string[]
  lastUpdated: string
}

export interface WorkflowProgress {
  overall: number
  currentPhase: string
  completedPhases: string[]
  remainingPhases: string[]
  estimatedCompletion: string
  actualHours: number
  estimatedHours: number
  efficiency: number
  quality: number
  health: 'on-track' | 'at-risk' | 'delayed' | 'blocked'
  metrics: WorkflowMetric[]
}

export interface WorkflowMetric {
  name: string
  value: number
  unit: string
  trend: 'up' | 'down' | 'stable'
  target?: number
  description: string
}

// SUPPORTING TYPES
export interface WorkingHours {
  start: string
  end: string
  timezone: string
  workdays: number[]
}

export interface NotificationSettings {
  email: boolean
  slack: boolean
  inApp: boolean
  frequency: 'immediate' | 'daily' | 'weekly'
}

export interface Integration {
  type: 'slack' | 'github' | 'jira' | 'figma' | 'notion'
  enabled: boolean
  config: Record<string, any>
}

export interface BrandingSettings {
  primaryColor: string
  secondaryColor: string
  logo: string
  favicon: string
}

export interface SubscriptionTier {
  plan: 'free' | 'pro' | 'enterprise'
  limits: {
    projects: number
    workflows: number
    teamMembers: number
    storage: number
  }
}

export interface ProjectTimeline {
  startDate: string
  plannedEndDate: string
  actualEndDate?: string
  milestones: Milestone[]
  phases: TimelinePhase[]
}

export interface Milestone {
  id: string
  name: string
  description: string
  date: string
  status: 'upcoming' | 'current' | 'completed' | 'delayed'
  deliverables: string[]
  dependencies: string[]
}

export interface Stakeholder {
  id: string
  name: string
  role: string
  email: string
  influence: 'high' | 'medium' | 'low'
  interest: 'high' | 'medium' | 'low'
  type: 'sponsor' | 'user' | 'team' | 'vendor' | 'regulator'
}

export interface Requirement {
  id: string
  title: string
  description: string
  type: 'functional' | 'non-functional' | 'business' | 'technical'
  priority: 'must-have' | 'should-have' | 'could-have' | 'wont-have'
  status: 'draft' | 'approved' | 'implemented' | 'tested' | 'delivered'
  source: string
  acceptanceCriteria: string[]
  dependencies: string[]
  risks: string[]
}

export interface Risk {
  id: string
  title: string
  description: string
  probability: 'low' | 'medium' | 'high'
  impact: 'low' | 'medium' | 'high'
  status: 'identified' | 'mitigated' | 'occurred' | 'resolved'
  mitigation: string
  owner: string
  reviewDate: string
}

export interface WorkflowArtifact {
  id: string
  name: string
  type: 'document' | 'code' | 'image' | 'video' | 'data'
  url: string
  size: number
  mimeType: string
  created: string
  createdBy: string
  version: string
  checksum: string
}

export interface WorkflowReport {
  id: string
  name: string
  type: 'progress' | 'quality' | 'performance' | 'summary'
  format: 'pdf' | 'html' | 'json' | 'csv'
  content: string
  generated: string
  generatedBy: string
  recipients: string[]
}

// ENUMS AND CONSTANTS
export type WorkflowType = 
  | 'bmad-methodology'
  | 'agile-scrum'
  | 'agile-kanban'
  | 'waterfall'
  | 'design-thinking'
  | 'lean-startup'
  | 'custom'

export type WorkflowStatus = 
  | 'draft'
  | 'approved'
  | 'active'
  | 'paused'
  | 'blocked'
  | 'completed'
  | 'cancelled'

export type ProjectSettings = {
  visibility: 'public' | 'private' | 'internal'
  allowExternalCollaborators: boolean
  requireApprovals: boolean
  autoArchive: boolean
  notifications: NotificationSettings
  integrations: Integration[]
}

export type WorkflowPhase = {
  id: string
  name: string
  description: string
  order: number
  estimatedDuration: number
  deliverables: string[]
  gates: Authorization[]
  agents: string[]
}

export type WorkflowDependency = {
  type: 'phase' | 'deliverable' | 'external'
  dependsOn: string
  dependencyType: 'finish-to-start' | 'start-to-start' | 'finish-to-finish'
}

export type QualityCriterion = {
  name: string
  description: string
  weight: number
  threshold: number
  metric: string
}

export type TestResult = {
  criterion: string
  score: number
  passed: boolean
  comments: string
  tester: string
  testDate: string
}

export type DeliverableRevision = {
  version: string
  changes: string
  author: string
  timestamp: string
  approved: boolean
}

export type ApprovalCondition = {
  type: 'threshold' | 'dependency' | 'custom'
  description: string
  value?: any
  met: boolean
}

export type ApprovalComment = {
  author: string
  comment: string
  timestamp: string
  type: 'general' | 'concern' | 'suggestion'
}

export type ProjectTeam = {
  id: string
  name: string
  role: 'core' | 'extended' | 'advisory'
  members: string[]
  lead: string
  responsibilities: string[]
}

export type ProjectBudget = {
  total: number
  spent: number
  remaining: number
  currency: string
  breakdown: BudgetLine[]
  approvals: Authorization[]
}

export type BudgetLine = {
  category: string
  allocated: number
  spent: number
  description: string
}

export type ProgressPoint = {
  date: string
  progress: number
  milestone?: string
}

export type BurndownPoint = {
  date: string
  remaining: number
  planned: number
}

export type TimelinePhase = {
  name: string
  startDate: string
  endDate: string
  progress: number
  status: 'upcoming' | 'current' | 'completed' | 'delayed'
}

export type WorkflowTimeline = {
  startDate: string
  plannedEndDate: string
  actualEndDate?: string
  phases: TimelinePhase[]
  milestones: Milestone[]
}

export type WorkflowInput = {
  name: string
  type: 'text' | 'file' | 'data' | 'reference'
  value: any
  required: boolean
  source: string
}

export type Constraint = {
  type: 'time' | 'budget' | 'resource' | 'technical' | 'regulatory'
  description: string
  impact: 'low' | 'medium' | 'high'
  mitigation?: string
}

export type ChatAttachment = {
  type: 'file' | 'image' | 'link' | 'deliverable'
  url: string
  name: string
  size?: number
}

export type ChatReaction = {
  emoji: string
  users: string[]
  count: number
}

export type DeliverableFile = {
  id: string
  name: string
  url: string
  type: string
  size: number
  uploaded: string
  uploadedBy: string
  version: string
}