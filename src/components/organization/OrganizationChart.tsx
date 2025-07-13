'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
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
  Cpu,
  Edit3,
  Plus,
  Trash2,
  Save,
  X,
  Download,
  Upload
} from 'lucide-react'
import { Organization, OrganizationNode, AgentRole } from '../../lib/organization/types'

interface OrganizationChartProps {
  organization: Organization
  onAgentClick?: (agentId: string, agent: OrganizationNode) => void
  onDepartmentClick?: (departmentId: string) => void
  onOrganizationUpdate?: (updatedOrg: Organization) => void
  interactive?: boolean
  editable?: boolean
}

interface ChartNode {
  id: string
  agent: OrganizationNode
  level: number
  children: ChartNode[]
  x: number
  y: number
  isExpanded?: boolean
}

const iconMap: Record<string, any> = {
  Crown, Cpu, Target, Code, Building, Lightbulb, Code2, 
  Palette, Shield, BarChart, Settings, Users
}

const COLORS = {
  executive: 'from-purple-600 to-purple-700',
  engineering: 'from-blue-600 to-blue-700', 
  product: 'from-green-600 to-green-700',
  design: 'from-pink-600 to-pink-700',
  qa: 'from-orange-600 to-orange-700',
  marketing: 'from-red-600 to-red-700',
  default: 'from-slate-600 to-slate-700'
}

export default function OrganizationChart({ 
  organization, 
  onAgentClick, 
  onOrganizationUpdate,
  interactive = true,
  editable = false
}: OrganizationChartProps) {
  const [editMode, setEditMode] = useState(false)
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['ceo']))
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newAgentData, setNewAgentData] = useState({ name: '', role: '', department: '', parentId: '' })

  const chartData = useMemo(() => {
    return buildChartHierarchy(organization)
  }, [organization])

  const getAgentIcon = (role: AgentRole) => {
    const IconComponent = iconMap[role.icon] || Users
    return IconComponent
  }

  const getAgentColor = (agent: OrganizationNode) => {
    const dept = organization.departments[agent.department]
    return dept?.color || COLORS.default
  }

  const toggleExpanded = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const handleAddAgent = (parentId: string) => {
    console.log('Adding agent with parent:', parentId)
    setNewAgentData({ 
      name: '', 
      role: '', 
      department: '', 
      parentId 
    })
    setShowAddDialog(true)
  }

  const saveNewAgent = useCallback(() => {
    if (!newAgentData.name || !newAgentData.role || !onOrganizationUpdate) return
    
    // Create new agent and update organization
    const newAgent: OrganizationNode = {
      id: `agent-${Date.now()}`,
      name: newAgentData.name,
      agentId: `agent-${Date.now()}`,
      role: {
        id: `role-${Date.now()}`,
        name: newAgentData.role,
        title: newAgentData.role,
        description: `${newAgentData.role} specialist`,
        icon: 'Users',
        color: 'from-slate-500 to-slate-600',
        specialization: [newAgentData.role],
        level: 'Specialist',
        capabilities: ['General assistance', 'Problem solving'],
        personality: 'Helpful and professional',
        communicationStyle: 'casual'
      },
      department: newAgentData.department,
      reportsTo: newAgentData.parentId,
      directReports: [],
      responsibilities: ['General task handling', 'Domain expertise'],
      delegationRules: [],
      collaborationPreferences: ['direct_communication', 'collaborative_planning'],
      availability: 'available',
      workload: 'normal'
    }

    const updatedOrg = { ...organization }
    updatedOrg.agents[newAgent.id] = newAgent
    
    // Update parent's direct reports
    if (newAgentData.parentId && updatedOrg.agents[newAgentData.parentId]) {
      updatedOrg.agents[newAgentData.parentId].directReports.push(newAgent.id)
    }

    onOrganizationUpdate(updatedOrg)
    setShowAddDialog(false)
    setNewAgentData({ name: '', role: '', department: '', parentId: '' })
  }, [newAgentData, organization, onOrganizationUpdate])

  const renderMicrosoftStyleNode = (node: ChartNode) => {
    const IconComponent = getAgentIcon(node.agent.role)
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children.length > 0
    const isSelected = selectedAgent === node.id
    const agentColor = getAgentColor(node.agent)

    return (
      <div key={node.id} className="flex flex-col items-center">
        {/* Connection Lines */}
        {node.level > 0 && (
          <div className="w-0.5 h-8 bg-slate-400 dark:bg-slate-300 mb-2"></div>
        )}
        
        {/* Agent Circle */}
        <div className="relative group">
          <div 
            className={`
              w-20 h-20 rounded-full bg-gradient-to-br ${agentColor} 
              border-4 border-white dark:border-slate-800 shadow-lg
              flex items-center justify-center cursor-pointer
              transition-all duration-300 hover:scale-110 hover:shadow-xl
              ${isSelected ? 'ring-4 ring-blue-400' : ''}
              ${interactive ? 'hover:shadow-2xl' : ''}
            `}
            onClick={() => {
              setSelectedAgent(node.id)
              onAgentClick?.(node.id, node.agent)
            }}
          >
            <IconComponent className="w-8 h-8 text-white" />
          </div>

          {/* Agent Info Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
            <Card className="glass-card min-w-48">
              <CardContent className="p-3">
                <h4 className="font-semibold text-white">{node.agent.name}</h4>
                <p className="text-sm text-slate-300">{node.agent.role.title}</p>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${
                    node.agent.availability === 'available' ? 'bg-green-400' : 
                    node.agent.availability === 'busy' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}></div>
                  <span className="text-xs text-slate-400 capitalize">{node.agent.availability}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Controls */}
          {editable && editMode && (
            <div className="absolute -top-2 -right-2 flex gap-1">
              <Button
                size="sm"
                variant="outline"
                className="w-6 h-6 p-0 bg-blue-500 hover:bg-blue-600 border-blue-500"
                onClick={() => handleAddAgent(node.id)}
              >
                <Plus className="w-3 h-3 text-white" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-6 h-6 p-0 bg-red-500 hover:bg-red-600 border-red-500"
                onClick={() => {/* Handle delete */}}
              >
                <Trash2 className="w-3 h-3 text-white" />
              </Button>
            </div>
          )}
        </div>

        {/* Agent Name */}
        <div className="mt-3 text-center">
          <p className="font-medium text-white text-sm">{node.agent.name}</p>
          <p className="text-xs text-slate-400">{node.agent.role.title}</p>
          
          {/* Add Agent Button - More Prominent */}
          {editable && editMode && (
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleAddAgent(node.id)
              }}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-6"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Agent
            </Button>
          )}
        </div>

        {/* Expand/Collapse Button */}
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="mt-2 w-6 h-6 p-0 rounded-full bg-slate-700 hover:bg-slate-600"
            onClick={() => toggleExpanded(node.id)}
          >
            {isExpanded ? 
              <ChevronDown className="w-3 h-3 text-white" /> : 
              <ChevronRight className="w-3 h-3 text-white" />
            }
          </Button>
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className="mt-6">
            {/* Vertical connector to children */}
            <div className="w-0.5 h-6 bg-slate-400 dark:bg-slate-300 mx-auto"></div>
            
            {/* Horizontal line connecting children */}
            {node.children.length > 1 && (
              <div className="relative flex justify-center mb-6">
                <div className="h-0.5 bg-slate-400 dark:bg-slate-300" 
                     style={{ width: `${(node.children.length - 1) * 144}px` }}></div>
              </div>
            )}
            
            {/* Children Container */}
            <div className="flex gap-12 items-start">
              {node.children.map((child) => renderMicrosoftStyleNode(child))}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderOrgStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <Card className="glass-card">
        <CardContent className="p-4 text-center">
          <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{Object.keys(organization.agents).length}</p>
          <p className="text-xs text-slate-400">Total Agents</p>
        </CardContent>
      </Card>
      <Card className="glass-card">
        <CardContent className="p-4 text-center">
          <Building className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{Object.keys(organization.departments).length}</p>
          <p className="text-xs text-slate-400">Departments</p>
        </CardContent>
      </Card>
      <Card className="glass-card">
        <CardContent className="p-4 text-center">
          <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{organization.workflowRules.length}</p>
          <p className="text-xs text-slate-400">Workflows</p>
        </CardContent>
      </Card>
      <Card className="glass-card">
        <CardContent className="p-4 text-center">
          <MessageSquare className="w-6 h-6 text-orange-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-white">{organization.communicationChannels.length}</p>
          <p className="text-xs text-slate-400">Channels</p>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{organization.name}</h2>
          <p className="text-slate-400">{organization.description}</p>
        </div>
        
        {editable && (
          <div className="flex gap-2">
            <Button
              variant={editMode ? "default" : "outline"}
              onClick={() => setEditMode(!editMode)}
              className={editMode ? "bg-green-600 hover:bg-green-700 text-white" : "glass-button"}
            >
              {editMode ? <Save className="w-4 h-4 mr-2" /> : <Edit3 className="w-4 h-4 mr-2" />}
              {editMode ? 'Exit Edit Mode' : 'Edit Organization'}
            </Button>
            {editMode && (
              <div className="px-3 py-2 bg-green-100 text-green-800 rounded-md text-sm font-medium">
                ✏️ Edit Mode Active - Click + icons to add agents
              </div>
            )}
            <Button variant="outline" className="glass-button">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Stats */}
      {renderOrgStats()}

      {/* Organization Chart */}
      <Card className="glass-card p-6">
        <div className="overflow-x-auto">
          <div className="min-w-max py-8">
            {chartData.map((rootNode) => renderMicrosoftStyleNode(rootNode))}
          </div>
        </div>
      </Card>

      {/* Add Agent Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="glass-card max-w-md w-full mx-4">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                Add New Agent
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddDialog(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Agent Name</label>
                <Input
                  value={newAgentData.name}
                  onChange={(e) => setNewAgentData({...newAgentData, name: e.target.value})}
                  placeholder="Enter agent name"
                  className="glass-input"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Role</label>
                <Input
                  value={newAgentData.role}
                  onChange={(e) => setNewAgentData({...newAgentData, role: e.target.value})}
                  placeholder="Enter role title"
                  className="glass-input"
                />
              </div>
              <div>
                <label className="text-sm text-slate-300 mb-2 block">Department</label>
                <select 
                  value={newAgentData.department}
                  onChange={(e) => setNewAgentData({...newAgentData, department: e.target.value})}
                  className="w-full glass-input"
                >
                  <option value="">Select Department</option>
                  {Object.entries(organization.departments).map(([id, dept]) => (
                    <option key={id} value={id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <Button onClick={saveNewAgent} className="gradient-button flex-1">
                  Add Agent
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAddDialog(false)}
                  className="glass-button"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

function buildChartHierarchy(organization: Organization): ChartNode[] {
  const nodes: ChartNode[] = []
  const visited = new Set<string>()

  // Find root nodes (agents with no manager or CEO)
  const rootAgents = Object.entries(organization.agents).filter(([id, agent]) => 
    !agent.reportsTo || id === organization.ceo
  )

  const buildNode = (agentId: string, level: number = 0): ChartNode | null => {
    if (visited.has(agentId)) return null
    visited.add(agentId)

    const agent = organization.agents[agentId]
    if (!agent) return null

    const children: ChartNode[] = []
    for (const reportId of agent.directReports) {
      const childNode = buildNode(reportId, level + 1)
      if (childNode) children.push(childNode)
    }

    return {
      id: agentId,
      agent,
      level,
      children,
      x: 0,
      y: 0,
      isExpanded: true
    }
  }

  for (const [agentId] of rootAgents) {
    const node = buildNode(agentId)
    if (node) nodes.push(node)
  }

  return nodes
}