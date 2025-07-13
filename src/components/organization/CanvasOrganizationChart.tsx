'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { 
  Users, Crown, Plus, Trash2, Save, X, Edit3, Download,
  Target, Code, Palette, Shield, BarChart, Settings, Lightbulb, Code2, Cpu,
  ZoomIn, ZoomOut, RotateCcw, Maximize2, Move
} from 'lucide-react'
import { Organization, OrganizationNode, AgentRole } from '../../lib/organization/types'

interface CanvasOrganizationChartProps {
  organization: Organization
  onAgentClick?: (agentId: string, agent: OrganizationNode) => void
  onOrganizationUpdate?: (updatedOrg: Organization) => void
  interactive?: boolean
  editable?: boolean
}

interface CanvasNode {
  id: string
  agent: OrganizationNode
  x: number
  y: number
  width: number
  height: number
  children: CanvasNode[]
  parent?: CanvasNode
}

const iconMap: Record<string, any> = {
  Crown, Cpu, Target, Code, Lightbulb, Code2, 
  Palette, Shield, BarChart, Settings, Users
}

const NODE_WIDTH = 140
const NODE_HEIGHT = 100
const LEVEL_HEIGHT = 150
const SIBLING_SPACING = 180

export default function CanvasOrganizationChart({ 
  organization, 
  onAgentClick, 
  onOrganizationUpdate,
  interactive = true,
  editable = false
}: CanvasOrganizationChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [editMode, setEditMode] = useState(false)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newAgentData, setNewAgentData] = useState({ name: '', role: '', department: '', parentId: '' })
  const [canvasNodes, setCanvasNodes] = useState<CanvasNode[]>([])
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 })
  
  // Zoom and Pan state
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [lastPan, setLastPan] = useState({ x: 0, y: 0 })
  
  // Drag and drop state
  const [draggedAgent, setDraggedAgent] = useState<string | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Build canvas node tree
  const buildCanvasNodes = useCallback((org: Organization): CanvasNode[] => {
    const nodeMap = new Map<string, CanvasNode>()
    const rootNodes: CanvasNode[] = []

    // Create all nodes first
    Object.entries(org.agents).forEach(([id, agent]) => {
      const node: CanvasNode = {
        id,
        agent,
        x: 0,
        y: 0,
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
        children: []
      }
      nodeMap.set(id, node)
    })

    // Build hierarchy
    Object.entries(org.agents).forEach(([id, agent]) => {
      const node = nodeMap.get(id)!
      if (agent.reportsTo && nodeMap.has(agent.reportsTo)) {
        const parent = nodeMap.get(agent.reportsTo)!
        parent.children.push(node)
        node.parent = parent
      } else {
        rootNodes.push(node)
      }
    })

    // Calculate positions
    const calculatePositions = (nodes: CanvasNode[], startX: number, y: number): number => {
      let currentX = startX
      
      nodes.forEach((node, index) => {
        // Calculate total width needed for children
        const childrenWidth = node.children.length > 0 
          ? Math.max(node.children.length * SIBLING_SPACING, NODE_WIDTH)
          : NODE_WIDTH
        
        // Position this node
        node.x = currentX + (childrenWidth - NODE_WIDTH) / 2
        node.y = y
        
        // Position children
        if (node.children.length > 0) {
          const childY = y + LEVEL_HEIGHT
          const childStartX = currentX
          calculatePositions(node.children, childStartX, childY)
        }
        
        currentX += childrenWidth + 50 // Gap between sibling branches
      })
      
      return currentX
    }

    calculatePositions(rootNodes, 50, 50)

    // Calculate canvas size
    let maxX = 0, maxY = 0
    const findBounds = (nodes: CanvasNode[]) => {
      nodes.forEach(node => {
        maxX = Math.max(maxX, node.x + node.width)
        maxY = Math.max(maxY, node.y + node.height)
        findBounds(node.children)
      })
    }
    findBounds(rootNodes)

    setCanvasSize({ 
      width: Math.max(maxX + 100, 800), 
      height: Math.max(maxY + 100, 600) 
    })

    return rootNodes
  }, [])

  // Update canvas nodes when organization changes
  useEffect(() => {
    const nodes = buildCanvasNodes(organization)
    setCanvasNodes(nodes)
  }, [organization, buildCanvasNodes])

  // Draw on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    const drawConnections = (nodes: CanvasNode[]) => {
      nodes.forEach(node => {
        if (node.children.length > 0) {
          const parentCenterX = node.x + node.width / 2
          const parentBottomY = node.y + node.height

          // Draw vertical line down from parent
          ctx.strokeStyle = '#94a3b8' // slate-400
          ctx.lineWidth = 2
          ctx.setLineDash([5, 5]) // Dotted line
          ctx.beginPath()
          ctx.moveTo(parentCenterX, parentBottomY)
          ctx.lineTo(parentCenterX, parentBottomY + 30)
          ctx.stroke()

          if (node.children.length > 1) {
            // Draw horizontal line connecting children
            const leftChild = node.children[0]
            const rightChild = node.children[node.children.length - 1]
            const leftX = leftChild.x + leftChild.width / 2
            const rightX = rightChild.x + rightChild.width / 2
            const lineY = parentBottomY + 30

            ctx.beginPath()
            ctx.moveTo(leftX, lineY)
            ctx.lineTo(rightX, lineY)
            ctx.stroke()
          }

          // Draw vertical lines to each child
          node.children.forEach(child => {
            const childCenterX = child.x + child.width / 2
            const childTopY = child.y

            ctx.beginPath()
            ctx.moveTo(childCenterX, parentBottomY + 30)
            ctx.lineTo(childCenterX, childTopY)
            ctx.stroke()
          })

          // Recursively draw children connections
          drawConnections(node.children)
        }
      })
    }

    drawConnections(canvasNodes)
    ctx.setLineDash([]) // Reset line dash
  }, [canvasNodes, canvasSize])

  const getAgentIcon = (role: AgentRole) => {
    return iconMap[role.icon] || Users
  }

  const getAgentColor = (agent: OrganizationNode) => {
    const dept = organization.departments[agent.department]
    return dept?.color || 'from-slate-600 to-slate-700'
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const clickX = event.clientX - rect.left
    const clickY = event.clientY - rect.top

    // Find clicked node
    const findClickedNode = (nodes: CanvasNode[]): CanvasNode | null => {
      for (const node of nodes) {
        if (clickX >= node.x && clickX <= node.x + node.width &&
            clickY >= node.y && clickY <= node.y + node.height) {
          return node
        }
        const childResult = findClickedNode(node.children)
        if (childResult) return childResult
      }
      return null
    }

    const clickedNode = findClickedNode(canvasNodes)
    if (clickedNode) {
      setSelectedNode(clickedNode.id)
      onAgentClick?.(clickedNode.id, clickedNode.agent)
    }
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
      department: newAgentData.department || organization.departments[Object.keys(organization.departments)[0]]?.id || 'general',
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

  // Handle agent reassignment via drag and drop
  const handleAgentReassignment = useCallback((agentId: string, newParentId: string | null) => {
    if (!onOrganizationUpdate || agentId === newParentId) return

    const updatedOrg = { ...organization }
    const agent = updatedOrg.agents[agentId]
    if (!agent) return

    // Remove from old parent's direct reports
    if (agent.reportsTo && updatedOrg.agents[agent.reportsTo]) {
      updatedOrg.agents[agent.reportsTo].directReports = 
        updatedOrg.agents[agent.reportsTo].directReports.filter(id => id !== agentId)
    }

    // Update agent's reporting relationship
    agent.reportsTo = newParentId || undefined

    // Add to new parent's direct reports
    if (newParentId && updatedOrg.agents[newParentId]) {
      if (!updatedOrg.agents[newParentId].directReports.includes(agentId)) {
        updatedOrg.agents[newParentId].directReports.push(agentId)
      }
    }

    onOrganizationUpdate(updatedOrg)
  }, [organization, onOrganizationUpdate])

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, agentId: string) => {
    if (!editable || !editMode) return
    
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', agentId)
    setDraggedAgent(agentId)
    
    // Calculate drag offset
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    })
  }, [editable, editMode])

  const handleDragOver = useCallback((e: React.DragEvent, targetId: string) => {
    if (!draggedAgent || draggedAgent === targetId) return
    
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDropTarget(targetId)
  }, [draggedAgent])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear drop target if we're leaving the node completely
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX
    const y = e.clientY
    
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropTarget(null)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    
    const draggedId = e.dataTransfer.getData('text/plain')
    if (!draggedId || draggedId === targetId) return

    // Prevent dropping an agent on its own descendant
    const isDescendant = (agentId: string, potentialDescendantId: string): boolean => {
      const agent = organization.agents[agentId]
      if (!agent) return false
      
      return agent.directReports.some(childId => 
        childId === potentialDescendantId || isDescendant(childId, potentialDescendantId)
      )
    }

    if (isDescendant(draggedId, targetId)) {
      console.warn('Cannot move agent to its own descendant')
      return
    }

    handleAgentReassignment(draggedId, targetId)
    setDraggedAgent(null)
    setDropTarget(null)
  }, [organization, handleAgentReassignment])

  const handleDragEnd = useCallback(() => {
    setDraggedAgent(null)
    setDropTarget(null)
  }, [])

  const renderNode = (node: CanvasNode) => {
    const IconComponent = getAgentIcon(node.agent.role)
    const agentColor = getAgentColor(node.agent)
    const isSelected = selectedNode === node.id
    const isDragTarget = dropTarget === node.id
    const isBeingDragged = draggedAgent === node.id

    return (
      <div
        key={node.id}
        draggable={editable && editMode}
        onDragStart={(e) => handleDragStart(e, node.id)}
        onDragOver={(e) => handleDragOver(e, node.id)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, node.id)}
        onDragEnd={handleDragEnd}
        className={`absolute bg-gradient-to-br ${agentColor} rounded-lg border-2 
          ${isSelected ? 'border-blue-400 shadow-lg shadow-blue-400/25' : 'border-white/20'} 
          ${isDragTarget ? 'border-green-400 shadow-lg shadow-green-400/25 scale-105' : ''} 
          ${isBeingDragged ? 'opacity-50 scale-95' : ''} 
          shadow-lg cursor-pointer transition-all duration-200 hover:scale-105
          ${editable && editMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
        style={{
          left: node.x,
          top: node.y,
          width: node.width,
          height: node.height
        }}
        onClick={() => {
          setSelectedNode(node.id)
          onAgentClick?.(node.id, node.agent)
        }}
      >
        <div className="p-3 h-full flex flex-col">
          {/* Agent Icon */}
          <div className="flex items-center justify-center mb-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <IconComponent className="w-5 h-5 text-white" />
            </div>
            {editable && editMode && (
              <div className="ml-1 opacity-60">
                <Move className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          
          {/* Agent Info */}
          <div className="text-center flex-1">
            <h4 className="text-white font-medium text-sm leading-tight mb-1">
              {node.agent.name}
            </h4>
            <p className="text-white/80 text-xs leading-tight">
              {node.agent.role.title}
            </p>
          </div>
          
          {/* Add Agent Button */}
          {editable && editMode && (
            <div className="flex justify-center mt-2">
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleAddAgent(node.id)
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-2 py-1 h-6"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderAllNodes = (nodes: CanvasNode[]): React.ReactNode[] => {
    const result: React.ReactNode[] = []
    
    nodes.forEach(node => {
      result.push(renderNode(node))
      result.push(...renderAllNodes(node.children))
    })
    
    return result
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{organization.name}</h2>
          <p className="text-slate-400">{organization.description}</p>
        </div>
        
        {editable && (
          <div className="flex gap-2 items-center">
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
                ✏️ Edit Mode - Click &quot;Add&quot; to add subordinates • Drag agents to reassign reporting relationships
              </div>
            )}
            <Button variant="outline" className="glass-button">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        )}
      </div>

      {/* Canvas Organization Chart */}
      <Card className="glass-card p-6">
        <div 
          ref={containerRef} 
          className="relative overflow-auto border rounded-lg bg-slate-900/50"
          onDragOver={(e) => {
            if (draggedAgent) {
              e.preventDefault()
              e.dataTransfer.dropEffect = 'move'
            }
          }}
          onDrop={(e) => {
            if (draggedAgent) {
              e.preventDefault()
              const draggedId = e.dataTransfer.getData('text/plain')
              if (draggedId) {
                handleAgentReassignment(draggedId, null) // Make it a root node
                setDraggedAgent(null)
                setDropTarget(null)
              }
            }
          }}
        >
          <canvas
            ref={canvasRef}
            width={canvasSize.width}
            height={canvasSize.height}
            onClick={handleCanvasClick}
            className="absolute top-0 left-0 pointer-events-none"
          />
          <div 
            className="relative"
            style={{ width: canvasSize.width, height: canvasSize.height }}
          >
            {renderAllNodes(canvasNodes)}
            {draggedAgent && (
              <div className="absolute top-4 left-4 bg-blue-600/90 text-white px-3 py-2 rounded-md text-sm font-medium">
                🖱️ Drop on another agent to reassign • Drop on empty area to make root level
              </div>
            )}
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
                <label className="text-sm text-slate-300 mb-2 block">Department (Optional)</label>
                <select 
                  value={newAgentData.department}
                  onChange={(e) => setNewAgentData({...newAgentData, department: e.target.value})}
                  className="w-full glass-input"
                >
                  <option value="">Auto-assign Department</option>
                  {Object.entries(organization.departments).map(([id, dept]) => (
                    <option key={id} value={id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <div className="text-sm text-slate-400 bg-slate-800 p-3 rounded">
                <strong>Parent:</strong> {organization.agents[newAgentData.parentId]?.name || 'Unknown'}
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