'use client'

import React, { createContext, useContext, useReducer, useCallback, ReactNode } from 'react'
import { Organization, Project, WorkflowInstance } from '../lib/hierarchy/types'

// Navigation State
export interface NavigationState {
  currentOrganization: Organization | null
  currentProject: Project | null
  currentWorkflow: WorkflowInstance | null
  breadcrumbs: BreadcrumbItem[]
  navigationHistory: NavigationHistoryItem[]
  isLoading: boolean
  error: string | null
}

export interface BreadcrumbItem {
  type: 'organization' | 'project' | 'workflow'
  id: string
  name: string
  url: string
}

export interface NavigationHistoryItem {
  timestamp: string
  organizationId?: string
  projectId?: string
  workflowId?: string
  action: string
}

// Action Types
type NavigationAction = 
  | { type: 'SET_ORGANIZATION'; payload: Organization }
  | { type: 'SET_PROJECT'; payload: Project }
  | { type: 'SET_WORKFLOW'; payload: WorkflowInstance }
  | { type: 'CLEAR_PROJECT' }
  | { type: 'CLEAR_WORKFLOW' }
  | { type: 'RESET_NAVIGATION' }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'ADD_TO_HISTORY'; payload: NavigationHistoryItem }

// Context Interface
interface HierarchyContextType {
  state: NavigationState
  // Navigation Actions
  navigateToOrganization: (organization: Organization) => void
  navigateToProject: (project: Project) => void
  navigateToWorkflow: (workflow: WorkflowInstance) => void
  navigateUp: (level: 'organization' | 'project') => void
  resetNavigation: () => void
  
  // Quick Navigation
  getRecentProjects: () => Project[]
  getActiveWorkflows: () => WorkflowInstance[]
  
  // Breadcrumb Utilities
  generateBreadcrumbs: () => BreadcrumbItem[]
  getBreadcrumbUrl: (item: BreadcrumbItem) => string
  
  // Context Helpers
  isInOrganization: () => boolean
  isInProject: () => boolean
  isInWorkflow: () => boolean
  getCurrentContext: () => 'organization' | 'project' | 'workflow' | null
  
  // Permission Helpers
  canAccessProject: (projectId: string) => boolean
  canAccessWorkflow: (workflowId: string) => boolean
  canEditProject: () => boolean
  canManageWorkflows: () => boolean
  
  // State Management
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

const initialState: NavigationState = {
  currentOrganization: null,
  currentProject: null,
  currentWorkflow: null,
  breadcrumbs: [],
  navigationHistory: [],
  isLoading: false,
  error: null
}

// Reducer
function navigationReducer(state: NavigationState, action: NavigationAction): NavigationState {
  switch (action.type) {
    case 'SET_ORGANIZATION':
      return {
        ...state,
        currentOrganization: action.payload,
        currentProject: null,
        currentWorkflow: null,
        breadcrumbs: generateBreadcrumbs(action.payload, null, null),
        error: null
      }
      
    case 'SET_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
        currentWorkflow: null,
        breadcrumbs: generateBreadcrumbs(state.currentOrganization, action.payload, null),
        error: null
      }
      
    case 'SET_WORKFLOW':
      return {
        ...state,
        currentWorkflow: action.payload,
        breadcrumbs: generateBreadcrumbs(state.currentOrganization, state.currentProject, action.payload),
        error: null
      }
      
    case 'CLEAR_PROJECT':
      return {
        ...state,
        currentProject: null,
        currentWorkflow: null,
        breadcrumbs: generateBreadcrumbs(state.currentOrganization, null, null)
      }
      
    case 'CLEAR_WORKFLOW':
      return {
        ...state,
        currentWorkflow: null,
        breadcrumbs: generateBreadcrumbs(state.currentOrganization, state.currentProject, null)
      }
      
    case 'RESET_NAVIGATION':
      return initialState
      
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload
      }
      
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
      
    case 'ADD_TO_HISTORY':
      return {
        ...state,
        navigationHistory: [action.payload, ...state.navigationHistory.slice(0, 99)] // Keep last 100
      }
      
    default:
      return state
  }
}

// Helper function to generate breadcrumbs
function generateBreadcrumbs(
  organization: Organization | null,
  project: Project | null,
  workflow: WorkflowInstance | null
): BreadcrumbItem[] {
  const breadcrumbs: BreadcrumbItem[] = []
  
  if (organization) {
    breadcrumbs.push({
      type: 'organization',
      id: organization.id,
      name: organization.name,
      url: `/dashboard/organizations/${organization.id}`
    })
  }
  
  if (project && organization) {
    breadcrumbs.push({
      type: 'project',
      id: project.id,
      name: project.name,
      url: `/dashboard/organizations/${organization.id}/projects/${project.id}`
    })
  }
  
  if (workflow && project && organization) {
    breadcrumbs.push({
      type: 'workflow',
      id: workflow.id,
      name: workflow.name,
      url: `/dashboard/organizations/${organization.id}/projects/${project.id}/workflows/${workflow.id}`
    })
  }
  
  return breadcrumbs
}

// Create Context
const HierarchyContext = createContext<HierarchyContextType | undefined>(undefined)

// Provider Component
export function HierarchyProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(navigationReducer, initialState)
  
  // Navigation Actions
  const navigateToOrganization = useCallback((organization: Organization) => {
    dispatch({ type: 'SET_ORGANIZATION', payload: organization })
    dispatch({ 
      type: 'ADD_TO_HISTORY', 
      payload: { 
        timestamp: new Date().toISOString(),
        organizationId: organization.id,
        action: 'navigate_to_organization'
      }
    })
  }, [])
  
  const navigateToProject = useCallback((project: Project) => {
    dispatch({ type: 'SET_PROJECT', payload: project })
    dispatch({ 
      type: 'ADD_TO_HISTORY', 
      payload: { 
        timestamp: new Date().toISOString(),
        organizationId: state.currentOrganization?.id,
        projectId: project.id,
        action: 'navigate_to_project'
      }
    })
  }, [state.currentOrganization])
  
  const navigateToWorkflow = useCallback((workflow: WorkflowInstance) => {
    dispatch({ type: 'SET_WORKFLOW', payload: workflow })
    dispatch({ 
      type: 'ADD_TO_HISTORY', 
      payload: { 
        timestamp: new Date().toISOString(),
        organizationId: state.currentOrganization?.id,
        projectId: state.currentProject?.id,
        workflowId: workflow.id,
        action: 'navigate_to_workflow'
      }
    })
  }, [state.currentOrganization, state.currentProject])
  
  const navigateUp = useCallback((level: 'organization' | 'project') => {
    if (level === 'organization') {
      dispatch({ type: 'CLEAR_PROJECT' })
    } else if (level === 'project') {
      dispatch({ type: 'CLEAR_WORKFLOW' })
    }
  }, [])
  
  const resetNavigation = useCallback(() => {
    dispatch({ type: 'RESET_NAVIGATION' })
  }, [])
  
  // Quick Navigation
  const getRecentProjects = useCallback((): Project[] => {
    // TODO: Implement recent projects logic based on navigation history
    return []
  }, [state.navigationHistory])
  
  const getActiveWorkflows = useCallback((): WorkflowInstance[] => {
    // TODO: Implement active workflows logic
    return []
  }, [])
  
  // Breadcrumb Utilities
  const generateBreadcrumbsCallback = useCallback(() => {
    return generateBreadcrumbs(state.currentOrganization, state.currentProject, state.currentWorkflow)
  }, [state.currentOrganization, state.currentProject, state.currentWorkflow])
  
  const getBreadcrumbUrl = useCallback((item: BreadcrumbItem) => {
    return item.url
  }, [])
  
  // Context Helpers
  const isInOrganization = useCallback(() => {
    return !!state.currentOrganization
  }, [state.currentOrganization])
  
  const isInProject = useCallback(() => {
    return !!state.currentProject
  }, [state.currentProject])
  
  const isInWorkflow = useCallback(() => {
    return !!state.currentWorkflow
  }, [state.currentWorkflow])
  
  const getCurrentContext = useCallback(() => {
    if (state.currentWorkflow) return 'workflow'
    if (state.currentProject) return 'project'
    if (state.currentOrganization) return 'organization'
    return null
  }, [state.currentOrganization, state.currentProject, state.currentWorkflow])
  
  // Permission Helpers (TODO: Implement based on user permissions)
  const canAccessProject = useCallback((projectId: string) => {
    return true // TODO: Implement permission check
  }, [])
  
  const canAccessWorkflow = useCallback((workflowId: string) => {
    return true // TODO: Implement permission check
  }, [])
  
  const canEditProject = useCallback(() => {
    return true // TODO: Implement permission check
  }, [])
  
  const canManageWorkflows = useCallback(() => {
    return true // TODO: Implement permission check
  }, [])
  
  // State Management
  const setLoading = useCallback((loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading })
  }, [])
  
  const setError = useCallback((error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error })
  }, [])
  
  const contextValue: HierarchyContextType = {
    state,
    navigateToOrganization,
    navigateToProject,
    navigateToWorkflow,
    navigateUp,
    resetNavigation,
    getRecentProjects,
    getActiveWorkflows,
    generateBreadcrumbs: generateBreadcrumbsCallback,
    getBreadcrumbUrl,
    isInOrganization,
    isInProject,
    isInWorkflow,
    getCurrentContext,
    canAccessProject,
    canAccessWorkflow,
    canEditProject,
    canManageWorkflows,
    setLoading,
    setError
  }
  
  return (
    <HierarchyContext.Provider value={contextValue}>
      {children}
    </HierarchyContext.Provider>
  )
}

// Hook to use the context
export function useHierarchy() {
  const context = useContext(HierarchyContext)
  if (context === undefined) {
    throw new Error('useHierarchy must be used within a HierarchyProvider')
  }
  return context
}

// Breadcrumb Component
export function Breadcrumbs() {
  const { state, getBreadcrumbUrl } = useHierarchy()
  
  if (state.breadcrumbs.length === 0) return null
  
  return (
    <nav className="flex items-center space-x-2 text-sm text-slate-400 mb-6">
      {state.breadcrumbs.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <span className="text-slate-600">/</span>}
          <a
            href={getBreadcrumbUrl(item)}
            className={`hover:text-white transition-colors ${
              index === state.breadcrumbs.length - 1 
                ? 'text-white font-medium' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {item.name}
          </a>
        </React.Fragment>
      ))}
    </nav>
  )
}

// Navigation Helper Hook
export function useNavigation() {
  const hierarchy = useHierarchy()
  
  return {
    ...hierarchy,
    // Convenience methods
    goToOrganization: hierarchy.navigateToOrganization,
    goToProject: hierarchy.navigateToProject,
    goToWorkflow: hierarchy.navigateToWorkflow,
    goUp: hierarchy.navigateUp,
    
    // Context shortcuts
    organization: hierarchy.state.currentOrganization,
    project: hierarchy.state.currentProject,
    workflow: hierarchy.state.currentWorkflow,
    
    // State shortcuts
    isLoading: hierarchy.state.isLoading,
    error: hierarchy.state.error
  }
}