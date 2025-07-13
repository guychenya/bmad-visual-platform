// Pre-defined Organization Templates

import { Organization, OrganizationTemplate, Department, OrganizationNode, AGENT_ROLES } from './types'

export const ORGANIZATION_TEMPLATES: Record<string, OrganizationTemplate> = {
  'startup': {
    id: 'startup',
    name: 'Startup Organization',
    description: 'Lean, agile structure perfect for early-stage companies focusing on rapid development and market validation',
    type: 'startup',
    useCase: ['MVP Development', 'Rapid Prototyping', 'Market Validation', 'Lean Operations'],
    benefits: ['Fast decision making', 'Direct communication', 'Flexible roles', 'Resource efficient'],
    structure: {
      id: 'startup-org',
      name: 'BMad Startup',
      description: 'Agile startup organization with minimal hierarchy',
      structure: 'flat',
      ceo: 'ceo',
      departments: {
        'product': {
          id: 'product',
          name: 'Product & Strategy',
          description: 'Product development and strategic planning',
          color: 'from-purple-500 to-pink-500',
          icon: 'Target',
          vpAgent: 'product-manager',
          focus: ['Product Strategy', 'User Research', 'Market Analysis'],
          kpis: ['User Acquisition', 'Product-Market Fit', 'Feature Adoption'],
          collaboratesWith: ['engineering', 'design']
        },
        'engineering': {
          id: 'engineering',
          name: 'Engineering',
          description: 'Technical development and implementation',
          color: 'from-green-500 to-emerald-500',
          icon: 'Code',
          vpAgent: 'senior-developer',
          focus: ['MVP Development', 'Technical Implementation', 'DevOps'],
          kpis: ['Development Velocity', 'Code Quality', 'System Reliability'],
          collaboratesWith: ['product', 'design']
        },
        'design': {
          id: 'design',
          name: 'Design & UX',
          description: 'User experience and visual design',
          color: 'from-pink-500 to-rose-500',
          icon: 'Palette',
          vpAgent: 'ux-director',
          focus: ['User Experience', 'UI Design', 'User Research'],
          kpis: ['User Satisfaction', 'Design System Adoption', 'Usability Metrics'],
          collaboratesWith: ['product', 'engineering']
        }
      },
      agents: {
        'ceo': {
          agentId: 'ceo',
          role: AGENT_ROLES.ceo,
          directReports: ['product-manager', 'senior-developer', 'ux-director'],
          department: 'executive',
          responsibilities: ['Strategic Vision', 'Team Coordination', 'Investor Relations', 'Product Direction'],
          delegationRules: [
            { condition: 'product_strategy', targetDepartment: 'product', escalationLevel: 1, priority: 'high' },
            { condition: 'technical_architecture', targetDepartment: 'engineering', escalationLevel: 1, priority: 'high' },
            { condition: 'user_experience', targetDepartment: 'design', escalationLevel: 1, priority: 'medium' }
          ],
          collaborationPreferences: ['weekly_all_hands', 'daily_standup', 'strategic_planning']
        },
        'product-manager': {
          agentId: 'product-manager',
          role: AGENT_ROLES['product-manager'],
          reportsTo: 'ceo',
          directReports: [],
          department: 'product',
          responsibilities: ['Product Roadmap', 'User Stories', 'Market Research', 'Feature Prioritization'],
          delegationRules: [
            { condition: 'technical_feasibility', targetAgent: 'senior-developer', escalationLevel: 0, priority: 'high' },
            { condition: 'user_research', targetAgent: 'ux-director', escalationLevel: 0, priority: 'medium' }
          ],
          collaborationPreferences: ['product_planning', 'user_feedback_review', 'sprint_planning']
        },
        'senior-developer': {
          agentId: 'senior-developer',
          role: AGENT_ROLES['senior-developer'],
          reportsTo: 'ceo',
          directReports: [],
          department: 'engineering',
          responsibilities: ['Technical Implementation', 'Architecture Decisions', 'Code Quality', 'DevOps'],
          delegationRules: [
            { condition: 'complex_architecture', targetAgent: 'ceo', escalationLevel: 1, priority: 'high' },
            { condition: 'ui_implementation', targetAgent: 'ux-director', escalationLevel: 0, priority: 'medium' }
          ],
          collaborationPreferences: ['technical_review', 'sprint_planning', 'architecture_discussion']
        },
        'ux-director': {
          agentId: 'ux-director',
          role: AGENT_ROLES['ux-director'],
          reportsTo: 'ceo',
          directReports: [],
          department: 'design',
          responsibilities: ['User Experience Strategy', 'UI Design', 'User Research', 'Design Systems'],
          delegationRules: [
            { condition: 'user_research', targetAgent: 'product-manager', escalationLevel: 0, priority: 'medium' },
            { condition: 'technical_constraints', targetAgent: 'senior-developer', escalationLevel: 0, priority: 'low' }
          ],
          collaborationPreferences: ['design_review', 'user_research', 'product_planning']
        }
      },
      workflowRules: [
        {
          id: 'product_development',
          trigger: 'new_feature_request',
          condition: 'feature_complexity > medium',
          actions: [
            { type: 'delegate', target: 'product-manager', parameters: { task: 'requirements_analysis' } },
            { type: 'collaborate', target: 'senior-developer', parameters: { task: 'technical_feasibility' } },
            { type: 'collaborate', target: 'ux-director', parameters: { task: 'user_experience_design' } }
          ],
          priority: 1
        }
      ],
      communicationChannels: [
        { id: 'all_hands', name: 'All Hands', type: 'all-hands', participants: ['ceo', 'product-manager', 'senior-developer', 'ux-director'], purpose: 'Strategic alignment and updates' },
        { id: 'product_team', name: 'Product Team', type: 'team', participants: ['product-manager', 'ux-director'], purpose: 'Product planning and user research' },
        { id: 'dev_team', name: 'Development Team', type: 'team', participants: ['senior-developer', 'ux-director'], purpose: 'Technical implementation and design collaboration' }
      ],
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }
  },

  'enterprise': {
    id: 'enterprise',
    name: 'Enterprise Organization',
    description: 'Comprehensive enterprise structure with specialized departments and clear hierarchies for large-scale operations',
    type: 'enterprise',
    useCase: ['Large Scale Projects', 'Complex Systems', 'Enterprise Solutions', 'Compliance & Governance'],
    benefits: ['Clear accountability', 'Specialized expertise', 'Scalable processes', 'Risk management'],
    structure: {
      id: 'enterprise-org',
      name: 'BMad Enterprise',
      description: 'Enterprise-grade organization with specialized departments',
      structure: 'hierarchical',
      ceo: 'ceo',
      departments: {
        'product': {
          id: 'product',
          name: 'Product Management',
          description: 'Product strategy, planning, and lifecycle management',
          color: 'from-purple-500 to-pink-500',
          icon: 'Target',
          vpAgent: 'product-vp',
          focus: ['Product Strategy', 'Market Analysis', 'Product Portfolio'],
          kpis: ['Revenue Growth', 'Market Share', 'Customer Satisfaction'],
          collaboratesWith: ['engineering', 'design', 'data']
        },
        'engineering': {
          id: 'engineering',
          name: 'Engineering',
          description: 'Software development, architecture, and technical operations',
          color: 'from-green-500 to-emerald-500',
          icon: 'Code',
          vpAgent: 'engineering-vp',
          focus: ['Software Development', 'System Architecture', 'Technical Operations'],
          kpis: ['Code Quality', 'System Reliability', 'Development Velocity'],
          collaboratesWith: ['product', 'qa', 'data']
        },
        'design': {
          id: 'design',
          name: 'Design & UX',
          description: 'User experience, interface design, and design systems',
          color: 'from-pink-500 to-rose-500',
          icon: 'Palette',
          vpAgent: 'ux-director',
          focus: ['User Experience', 'Design Systems', 'Brand Consistency'],
          kpis: ['User Satisfaction', 'Design Consistency', 'Accessibility Compliance'],
          collaboratesWith: ['product', 'engineering']
        },
        'qa': {
          id: 'qa',
          name: 'Quality Assurance',
          description: 'Quality control, testing, and compliance management',
          color: 'from-yellow-500 to-orange-500',
          icon: 'Shield',
          vpAgent: 'qa-director',
          focus: ['Quality Control', 'Test Automation', 'Compliance'],
          kpis: ['Defect Rate', 'Test Coverage', 'Compliance Score'],
          collaboratesWith: ['engineering', 'product']
        },
        'data': {
          id: 'data',
          name: 'Data & Analytics',
          description: 'Data science, analytics, and business intelligence',
          color: 'from-teal-500 to-blue-500',
          icon: 'BarChart',
          vpAgent: 'data-scientist',
          focus: ['Data Analytics', 'Business Intelligence', 'Machine Learning'],
          kpis: ['Data Quality', 'Insight Generation', 'Model Accuracy'],
          collaboratesWith: ['product', 'engineering']
        }
      },
      agents: {
        'ceo': {
          agentId: 'ceo',
          role: AGENT_ROLES.ceo,
          directReports: ['cto', 'product-vp'],
          department: 'executive',
          responsibilities: ['Strategic Leadership', 'Organizational Vision', 'Stakeholder Management'],
          delegationRules: [
            { condition: 'strategic_decision', targetAgent: 'cto', escalationLevel: 1, priority: 'high' },
            { condition: 'product_strategy', targetAgent: 'product-vp', escalationLevel: 1, priority: 'high' }
          ],
          collaborationPreferences: ['executive_review', 'strategic_planning', 'board_meetings']
        },
        'cto': {
          agentId: 'cto',
          role: AGENT_ROLES.cto,
          reportsTo: 'ceo',
          directReports: ['engineering-vp', 'qa-director', 'data-scientist'],
          department: 'technology',
          responsibilities: ['Technology Strategy', 'Technical Leadership', 'Innovation Management'],
          delegationRules: [
            { condition: 'engineering_management', targetAgent: 'engineering-vp', escalationLevel: 0, priority: 'high' },
            { condition: 'quality_assurance', targetAgent: 'qa-director', escalationLevel: 0, priority: 'high' },
            { condition: 'data_strategy', targetAgent: 'data-scientist', escalationLevel: 0, priority: 'medium' }
          ],
          collaborationPreferences: ['tech_leadership', 'architecture_review', 'innovation_planning']
        },
        'product-vp': {
          agentId: 'product-vp',
          role: AGENT_ROLES['product-vp'],
          reportsTo: 'ceo',
          directReports: ['product-manager', 'ux-director'],
          department: 'product',
          responsibilities: ['Product Vision', 'Market Strategy', 'Product Portfolio Management'],
          delegationRules: [
            { condition: 'product_management', targetAgent: 'product-manager', escalationLevel: 0, priority: 'high' },
            { condition: 'user_experience', targetAgent: 'ux-director', escalationLevel: 0, priority: 'high' }
          ],
          collaborationPreferences: ['product_strategy', 'market_analysis', 'user_research']
        },
        'engineering-vp': {
          agentId: 'engineering-vp',
          role: AGENT_ROLES['engineering-vp'],
          reportsTo: 'cto',
          directReports: ['solution-architect', 'senior-developer', 'devops-engineer'],
          department: 'engineering',
          responsibilities: ['Engineering Leadership', 'Technical Delivery', 'Team Management'],
          delegationRules: [
            { condition: 'system_architecture', targetAgent: 'solution-architect', escalationLevel: 0, priority: 'high' },
            { condition: 'development_tasks', targetAgent: 'senior-developer', escalationLevel: 0, priority: 'medium' },
            { condition: 'infrastructure', targetAgent: 'devops-engineer', escalationLevel: 0, priority: 'medium' }
          ],
          collaborationPreferences: ['engineering_planning', 'technical_review', 'team_development']
        },
        'solution-architect': {
          agentId: 'solution-architect',
          role: AGENT_ROLES['solution-architect'],
          reportsTo: 'engineering-vp',
          directReports: [],
          department: 'engineering',
          responsibilities: ['System Architecture', 'Technical Design', 'Integration Planning'],
          delegationRules: [],
          collaborationPreferences: ['architecture_design', 'technical_review', 'solution_planning']
        },
        'product-manager': {
          agentId: 'product-manager',
          role: AGENT_ROLES['product-manager'],
          reportsTo: 'product-vp',
          directReports: [],
          department: 'product',
          responsibilities: ['Product Planning', 'Requirements Management', 'Stakeholder Communication'],
          delegationRules: [],
          collaborationPreferences: ['product_planning', 'requirements_review', 'stakeholder_meetings']
        },
        'senior-developer': {
          agentId: 'senior-developer',
          role: AGENT_ROLES['senior-developer'],
          reportsTo: 'engineering-vp',
          directReports: [],
          department: 'engineering',
          responsibilities: ['Software Development', 'Code Review', 'Technical Mentoring'],
          delegationRules: [],
          collaborationPreferences: ['code_review', 'technical_discussion', 'development_planning']
        },
        'ux-director': {
          agentId: 'ux-director',
          role: AGENT_ROLES['ux-director'],
          reportsTo: 'product-vp',
          directReports: [],
          department: 'design',
          responsibilities: ['UX Strategy', 'Design Leadership', 'User Research'],
          delegationRules: [],
          collaborationPreferences: ['design_review', 'user_research', 'design_strategy']
        },
        'qa-director': {
          agentId: 'qa-director',
          role: AGENT_ROLES['qa-director'],
          reportsTo: 'cto',
          directReports: [],
          department: 'qa',
          responsibilities: ['Quality Strategy', 'Test Planning', 'Compliance Management'],
          delegationRules: [],
          collaborationPreferences: ['quality_review', 'test_planning', 'compliance_audit']
        },
        'data-scientist': {
          agentId: 'data-scientist',
          role: AGENT_ROLES['data-scientist'],
          reportsTo: 'cto',
          directReports: [],
          department: 'data',
          responsibilities: ['Data Analysis', 'ML Model Development', 'Business Intelligence'],
          delegationRules: [],
          collaborationPreferences: ['data_review', 'model_discussion', 'analytics_planning']
        },
        'devops-engineer': {
          agentId: 'devops-engineer',
          role: AGENT_ROLES['devops-engineer'],
          reportsTo: 'engineering-vp',
          directReports: [],
          department: 'engineering',
          responsibilities: ['Infrastructure Management', 'CI/CD', 'Operational Excellence'],
          delegationRules: [],
          collaborationPreferences: ['infrastructure_review', 'deployment_planning', 'monitoring_setup']
        }
      },
      workflowRules: [
        {
          id: 'complex_project',
          trigger: 'enterprise_project_request',
          condition: 'project_scope = enterprise',
          actions: [
            { type: 'delegate', target: 'product-vp', parameters: { task: 'product_strategy' } },
            { type: 'delegate', target: 'cto', parameters: { task: 'technical_strategy' } },
            { type: 'collaborate', target: 'qa-director', parameters: { task: 'quality_planning' } }
          ],
          priority: 1
        }
      ],
      communicationChannels: [
        { id: 'executive', name: 'Executive Team', type: 'team', participants: ['ceo', 'cto', 'product-vp'], purpose: 'Strategic decision making' },
        { id: 'tech_leadership', name: 'Technology Leadership', type: 'team', participants: ['cto', 'engineering-vp', 'qa-director', 'data-scientist'], purpose: 'Technical strategy and coordination' },
        { id: 'product_leadership', name: 'Product Leadership', type: 'team', participants: ['product-vp', 'product-manager', 'ux-director'], purpose: 'Product strategy and planning' }
      ],
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }
  },

  'agency': {
    id: 'agency',
    name: 'Digital Agency',
    description: 'Client-focused agency structure optimized for delivering multiple projects with specialized service teams',
    type: 'agency',
    useCase: ['Client Projects', 'Service Delivery', 'Multi-Project Management', 'Creative Services'],
    benefits: ['Client focus', 'Project specialization', 'Resource flexibility', 'Service excellence'],
    structure: {
      id: 'agency-org',
      name: 'BMad Digital Agency',
      description: 'Client-focused agency with specialized service delivery teams',
      structure: 'matrix',
      ceo: 'ceo',
      departments: {
        'strategy': {
          id: 'strategy',
          name: 'Strategy & Consulting',
          description: 'Strategic planning and client consultation services',
          color: 'from-indigo-500 to-purple-500',
          icon: 'Lightbulb',
          vpAgent: 'product-vp',
          focus: ['Client Strategy', 'Business Analysis', 'Digital Transformation'],
          kpis: ['Client Satisfaction', 'Project Success Rate', 'Revenue per Client'],
          collaboratesWith: ['creative', 'technical', 'delivery']
        },
        'creative': {
          id: 'creative',
          name: 'Creative & Design',
          description: 'Brand design, user experience, and creative services',
          color: 'from-pink-500 to-rose-500',
          icon: 'Palette',
          vpAgent: 'ux-director',
          focus: ['Brand Design', 'User Experience', 'Creative Campaigns'],
          kpis: ['Design Quality', 'Client Approval Rate', 'Creative Awards'],
          collaboratesWith: ['strategy', 'technical']
        },
        'technical': {
          id: 'technical',
          name: 'Technical Development',
          description: 'Software development and technical implementation',
          color: 'from-green-500 to-emerald-500',
          icon: 'Code',
          vpAgent: 'engineering-vp',
          focus: ['Web Development', 'App Development', 'Technical Solutions'],
          kpis: ['Code Quality', 'Project Delivery Time', 'Technical Performance'],
          collaboratesWith: ['creative', 'strategy', 'delivery']
        },
        'delivery': {
          id: 'delivery',
          name: 'Project Delivery',
          description: 'Project management and client delivery coordination',
          color: 'from-blue-500 to-cyan-500',
          icon: 'Target',
          vpAgent: 'product-manager',
          focus: ['Project Management', 'Client Communication', 'Quality Delivery'],
          kpis: ['On-Time Delivery', 'Budget Adherence', 'Client Retention'],
          collaboratesWith: ['strategy', 'creative', 'technical']
        }
      },
      agents: {
        'ceo': {
          agentId: 'ceo',
          role: AGENT_ROLES.ceo,
          directReports: ['product-vp', 'ux-director', 'engineering-vp', 'product-manager'],
          department: 'executive',
          responsibilities: ['Agency Vision', 'Client Relationships', 'Business Development'],
          delegationRules: [
            { condition: 'client_strategy', targetAgent: 'product-vp', escalationLevel: 1, priority: 'high' },
            { condition: 'creative_direction', targetAgent: 'ux-director', escalationLevel: 1, priority: 'high' },
            { condition: 'technical_delivery', targetAgent: 'engineering-vp', escalationLevel: 1, priority: 'high' }
          ],
          collaborationPreferences: ['client_meetings', 'strategic_planning', 'business_development']
        },
        'product-vp': {
          agentId: 'product-vp',
          role: AGENT_ROLES['product-vp'],
          reportsTo: 'ceo',
          directReports: [],
          department: 'strategy',
          responsibilities: ['Client Strategy', 'Business Analysis', 'Strategic Consulting'],
          delegationRules: [],
          collaborationPreferences: ['client_strategy', 'business_analysis', 'strategic_consulting']
        },
        'ux-director': {
          agentId: 'ux-director',
          role: AGENT_ROLES['ux-director'],
          reportsTo: 'ceo',
          directReports: [],
          department: 'creative',
          responsibilities: ['Creative Direction', 'Brand Strategy', 'User Experience Design'],
          delegationRules: [],
          collaborationPreferences: ['creative_review', 'brand_development', 'user_experience']
        },
        'engineering-vp': {
          agentId: 'engineering-vp',
          role: AGENT_ROLES['engineering-vp'],
          reportsTo: 'ceo',
          directReports: ['senior-developer'],
          department: 'technical',
          responsibilities: ['Technical Leadership', 'Solution Architecture', 'Development Management'],
          delegationRules: [
            { condition: 'development_tasks', targetAgent: 'senior-developer', escalationLevel: 0, priority: 'high' }
          ],
          collaborationPreferences: ['technical_planning', 'solution_design', 'development_review']
        },
        'product-manager': {
          agentId: 'product-manager',
          role: AGENT_ROLES['product-manager'],
          reportsTo: 'ceo',
          directReports: [],
          department: 'delivery',
          responsibilities: ['Project Management', 'Client Communication', 'Delivery Coordination'],
          delegationRules: [],
          collaborationPreferences: ['project_planning', 'client_communication', 'delivery_coordination']
        },
        'senior-developer': {
          agentId: 'senior-developer',
          role: AGENT_ROLES['senior-developer'],
          reportsTo: 'engineering-vp',
          directReports: [],
          department: 'technical',
          responsibilities: ['Technical Implementation', 'Code Quality', 'Client Solutions'],
          delegationRules: [],
          collaborationPreferences: ['technical_implementation', 'code_review', 'solution_delivery']
        }
      },
      workflowRules: [
        {
          id: 'client_project',
          trigger: 'new_client_project',
          condition: 'project_type = client_delivery',
          actions: [
            { type: 'delegate', target: 'product-vp', parameters: { task: 'client_strategy' } },
            { type: 'delegate', target: 'ux-director', parameters: { task: 'creative_direction' } },
            { type: 'delegate', target: 'engineering-vp', parameters: { task: 'technical_planning' } },
            { type: 'delegate', target: 'product-manager', parameters: { task: 'project_coordination' } }
          ],
          priority: 1
        }
      ],
      communicationChannels: [
        { id: 'leadership', name: 'Agency Leadership', type: 'team', participants: ['ceo', 'product-vp', 'ux-director', 'engineering-vp', 'product-manager'], purpose: 'Strategic coordination and client oversight' },
        { id: 'client_delivery', name: 'Client Delivery Team', type: 'team', participants: ['product-manager', 'ux-director', 'senior-developer'], purpose: 'Project execution and client delivery' }
      ],
      created: new Date().toISOString(),
      modified: new Date().toISOString()
    }
  }
}

export function getOrganizationTemplate(templateId: string): OrganizationTemplate | null {
  return ORGANIZATION_TEMPLATES[templateId] || null
}

export function getAllTemplates(): OrganizationTemplate[] {
  return Object.values(ORGANIZATION_TEMPLATES)
}

export function createOrganizationFromTemplate(templateId: string, customName?: string): Organization | null {
  const template = getOrganizationTemplate(templateId)
  if (!template) return null

  const org = { ...template.structure }
  if (customName) {
    org.name = customName
    org.id = `${templateId}-${Date.now()}`
  }
  org.created = new Date().toISOString()
  org.modified = new Date().toISOString()

  return org
}