'use client'

import React, { useMemo } from 'react'
import { Card, CardContent } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { 
  Users, 
  Crown, 
  MessageSquare, 
  ChevronDown, 
  ChevronRight,
  Building,
  Target,
  Code,
  Palette,
  Shield,
  BarChart,
  Settings,
  Lightbulb,
  Code2,
  Cpu
} from 'lucide-react'
import { Organization, OrganizationNode, AgentRole } from '../../lib/organization/types'

interface OrganizationChartProps {
  organization: Organization
  onAgentClick?: (agentId: string, agent: OrganizationNode) => void
  onDepartmentClick?: (departmentId: string) => void
  interactive?: boolean
  compact?: boolean
}

interface ChartNode {
  id: string
  agent: OrganizationNode
  level: number
  children: ChartNode[]
  x: number
  y: number
}

const iconMap: Record<string, any> = {
  Crown,
  Cpu,
  Target,
  Code,
  Building,
  Lightbulb,
  Code2,
  Palette,
  Shield,
  BarChart,
  Settings,
  Users
}

export default function OrganizationChart({ 
  organization, 
  onAgentClick, 
  onDepartmentClick,
  interactive = true,
  compact = false 
}: OrganizationChartProps) {
  const chartData = useMemo(() => {
    return buildChartHierarchy(organization)
  }, [organization])

  const maxLevel = useMemo(() => {
    return Math.max(...chartData.map(node => node.level))
  }, [chartData])

  const departmentColors = useMemo(() => {
    const colors: Record<string, string> = {}
    Object.entries(organization.departments).forEach(([id, dept]) => {
      colors[id] = dept.color
    })
    return colors
  }, [organization.departments])

  const getAgentIcon = (role: AgentRole) => {
    const IconComponent = iconMap[role.icon] || Users
    return IconComponent
  }

  const getAgentCardColor = (agent: OrganizationNode) => {
    const dept = organization.departments[agent.department]
    return dept?.color || 'from-slate-500 to-slate-600'
  }

  const renderAgent = (node: ChartNode, index: number) => {
    const IconComponent = getAgentIcon(node.agent.role)
    const cardColor = getAgentCardColor(node.agent)
    const isTopLevel = node.level === 0

    return (
      <div
        key={node.id}
        className={`relative ${compact ? 'mb-4' : 'mb-8'}`}
        style={{
          marginLeft: `${node.level * (compact ? 200 : 300)}px`,
          zIndex: maxLevel - node.level
        }}
      >
        <Card 
          className={`agent-card cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl ${
            isTopLevel ? 'ring-2 ring-yellow-400/50' : ''
          }`}
          onClick={() => interactive && onAgentClick?.(node.id, node.agent)}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-4">
              {/* Agent Avatar */}
              <div className={`p-3 bg-gradient-to-r ${cardColor} rounded-xl flex-shrink-0`}>
                <IconComponent className="h-6 w-6 text-white" />
              </div>

              {/* Agent Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-white text-sm truncate">
                    {node.agent.role.name}
                  </h3>
                  {isTopLevel && (
                    <Crown className="h-4 w-4 text-yellow-400 flex-shrink-0" />
                  )}
                </div>
                
                <p className="text-xs text-slate-400 mb-2 truncate">
                  {node.agent.role.title}
                </p>

                {/* Department Badge */}
                <div className="flex items-center justify-between">
                  <Badge 
                    variant="outline" 
                    className="text-xs px-2 py-0.5 border-slate-600 text-slate-300"
                  >
                    {organization.departments[node.agent.department]?.name || node.agent.department}
                  </Badge>
                  
                  {/* Direct Reports Count */}
                  {node.agent.directReports.length > 0 && (
                    <div className="flex items-center space-x-1 text-xs text-slate-400">
                      <Users className="h-3 w-3" />
                      <span>{node.agent.directReports.length}</span>
                    </div>
                  )}
                </div>

                {/* Specializations (compact view) */}
                {!compact && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {node.agent.role.specialization.slice(0, 2).map((spec, idx) => (
                      <Badge 
                        key={idx}
                        variant="secondary" 
                        className="text-xs px-1.5 py-0.5 bg-white/10 text-slate-300 border-0"
                      >
                        {spec}
                      </Badge>
                    ))}
                    {node.agent.role.specialization.length > 2 && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs px-1.5 py-0.5 bg-white/10 text-slate-400 border-0"
                      >
                        +{node.agent.role.specialization.length - 2}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Quick Actions */}
                {interactive && !compact && (
                  <div className="mt-3 flex space-x-1">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-6 px-2 text-xs glass-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        // Handle chat action
                      }}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Chat
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Connection Lines */}
        {node.children.length > 0 && (
          <div className="absolute left-full top-1/2 w-8 border-t-2 border-slate-600 -translate-y-1/2 z-0" />
        )}
        
        {/* Render Children */}
        {node.children.map((child, childIndex) => (
          <div key={child.id} className="relative">
            {/* Vertical line for multiple children */}
            {node.children.length > 1 && childIndex === 0 && (
              <div 
                className="absolute left-full border-l-2 border-slate-600 z-0"
                style={{
                  top: compact ? '24px' : '32px',
                  height: `${(node.children.length - 1) * (compact ? 120 : 180)}px`,
                  marginLeft: '32px'
                }}
              />
            )}
            
            {/* Horizontal connector line */}
            {node.children.length > 1 && (
              <div 
                className="absolute border-t-2 border-slate-600 z-0"
                style={{
                  top: compact ? '24px' : '32px',
                  left: 'calc(100% + 32px)',
                  width: '16px',
                  marginTop: `${childIndex * (compact ? 120 : 180)}px`
                }}
              />
            )}
            
            <div style={{ marginTop: childIndex > 0 ? (compact ? '120px' : '180px') : '0' }}>
              {renderAgent(child, childIndex)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const renderDepartmentSummary = () => {
    if (compact) return null

    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Building className="h-5 w-5 mr-2" />
          Departments Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(organization.departments).map(([id, dept]) => {
            const agentCount = Object.values(organization.agents)
              .filter(agent => agent.department === id).length
            
            return (
              <Card 
                key={id}
                className="glass-card cursor-pointer hover:scale-105 transition-transform"
                onClick={() => onDepartmentClick?.(id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 bg-gradient-to-r ${dept.color} rounded-lg`}>
                      <Building className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white text-sm">{dept.name}</h4>
                      <p className="text-xs text-slate-400">{agentCount} agents</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 mb-2">{dept.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {dept.focus.slice(0, 2).map((focus, idx) => (
                      <Badge 
                        key={idx}
                        variant="secondary" 
                        className="text-xs px-1.5 py-0.5 bg-white/10 text-slate-300 border-0"
                      >
                        {focus}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  if (!organization || Object.keys(organization.agents).length === 0) {
    return (
      <Card className="glass-card">
        <CardContent className="p-8 text-center">
          <Building className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Organization Structure</h3>
          <p className="text-slate-400">Create an organization to view the hierarchy chart.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Organization Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{organization.name}</h2>
          <p className="text-slate-400">{organization.description}</p>
        </div>
        <Badge 
          variant="outline" 
          className="text-sm px-3 py-1 border-slate-600 text-slate-300 capitalize"
        >
          {organization.structure} Structure
        </Badge>
      </div>

      {/* Department Summary */}
      {renderDepartmentSummary()}

      {/* Organization Chart */}
      <div className="relative">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Organization Hierarchy
        </h3>
        
        <div className="relative bg-slate-900/50 rounded-lg p-6 overflow-x-auto">
          <div className="min-w-max">
            {chartData.map((rootNode, index) => renderAgent(rootNode, index))}
          </div>
        </div>
      </div>

      {/* Organization Stats */}
      {!compact && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold gradient-text mb-1">
                {Object.keys(organization.agents).length}
              </div>
              <div className="text-sm text-slate-400">Total Agents</div>
            </CardContent>
          </Card>
          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold gradient-text mb-1">
                {Object.keys(organization.departments).length}
              </div>
              <div className="text-sm text-slate-400">Departments</div>
            </CardContent>
          </Card>
          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold gradient-text mb-1">
                {maxLevel + 1}
              </div>
              <div className="text-sm text-slate-400">Hierarchy Levels</div>
            </CardContent>
          </Card>
          <Card className="glass-card text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold gradient-text mb-1">
                {organization.workflowRules.length}
              </div>
              <div className="text-sm text-slate-400">Workflow Rules</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

// Helper function to build the hierarchical chart structure
function buildChartHierarchy(organization: Organization): ChartNode[] {
  const agentMap = new Map<string, OrganizationNode>()
  const children = new Map<string, string[]>()
  
  // Build maps
  Object.entries(organization.agents).forEach(([id, agent]) => {
    agentMap.set(id, agent)
    if (agent.reportsTo) {
      if (!children.has(agent.reportsTo)) {
        children.set(agent.reportsTo, [])
      }
      children.get(agent.reportsTo)!.push(id)
    }
  })

  // Find root nodes (agents with no manager)
  const rootAgents = Object.entries(organization.agents)
    .filter(([id, agent]) => !agent.reportsTo)
    .map(([id]) => id)

  // Build hierarchy starting from roots
  function buildNode(agentId: string, level: number): ChartNode {
    const agent = agentMap.get(agentId)!
    const agentChildren = children.get(agentId) || []
    
    return {
      id: agentId,
      agent,
      level,
      children: agentChildren.map(childId => buildNode(childId, level + 1)),
      x: 0, // Will be calculated for positioning
      y: 0  // Will be calculated for positioning
    }
  }

  return rootAgents.map(rootId => buildNode(rootId, 0))
}