'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Badge } from '../../../components/ui/badge'
import OrganizationChart from '../../../components/organization/OrganizationChart'
import { 
  Plus, 
  Building, 
  Users, 
  Settings, 
  Eye, 
  Trash2, 
  Copy, 
  Crown,
  Target,
  Briefcase,
  Lightbulb
} from 'lucide-react'
import { Organization, OrganizationTemplate } from '../../../lib/organization/types'
import { organizationService } from '../../../lib/organization/organizationService'
import { ORGANIZATION_TEMPLATES, getAllTemplates } from '../../../lib/organization/templates'

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [showTemplateModal, setShowTemplateModal] = useState(false)
  const [showOrgChart, setShowOrgChart] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadOrganizations()
  }, [])

  const loadOrganizations = () => {
    setIsLoading(true)
    try {
      const orgs = organizationService.getAllOrganizations()
      setOrganizations(orgs)
    } catch (error) {
      console.error('Failed to load organizations:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrganization = (templateId: string, customName?: string) => {
    const org = organizationService.createOrganization(templateId, customName)
    if (org) {
      setOrganizations(prev => [...prev, org])
      setShowTemplateModal(false)
    }
  }

  const handleDeleteOrganization = (orgId: string) => {
    if (confirm('Are you sure you want to delete this organization?')) {
      organizationService.deleteOrganization(orgId)
      setOrganizations(prev => prev.filter(org => org.id !== orgId))
      if (selectedOrg?.id === orgId) {
        setSelectedOrg(null)
        setShowOrgChart(false)
      }
    }
  }

  const handleCloneOrganization = (org: Organization) => {
    const cloneName = `${org.name} (Copy)`
    const template = Object.values(ORGANIZATION_TEMPLATES).find(t => 
      t.structure.structure === org.structure
    )
    
    if (template) {
      handleCreateOrganization(template.id, cloneName)
    }
  }

  const getOrganizationIcon = (structure: string) => {
    switch (structure) {
      case 'flat': return Target
      case 'hierarchical': return Building
      case 'matrix': return Briefcase
      case 'network': return Users
      default: return Building
    }
  }

  const getStructureColor = (structure: string) => {
    switch (structure) {
      case 'flat': return 'from-green-500 to-emerald-500'
      case 'hierarchical': return 'from-blue-500 to-indigo-500'
      case 'matrix': return 'from-purple-500 to-pink-500'
      case 'network': return 'from-orange-500 to-red-500'
      default: return 'from-slate-500 to-slate-600'
    }
  }

  if (showOrgChart && selectedOrg) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => setShowOrgChart(false)}
            >
              ← Back to Organizations
            </Button>
            <div>
              <h1 className="text-3xl font-bold gradient-text">{selectedOrg.name}</h1>
              <p className="text-slate-400">Organization Structure</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              className="glass-button"
              onClick={() => {/* Handle edit */}}
            >
              <Settings className="h-4 w-4 mr-2" />
              Configure
            </Button>
          </div>
        </div>

        <OrganizationChart 
          organization={selectedOrg}
          editable={true}
          onAgentClick={(agentId, agent) => {
            console.log('Agent clicked:', agentId, agent)
            // Navigate to agent chat or details
            window.location.href = `/dashboard/agents/${agentId}`
          }}
          onDepartmentClick={(departmentId) => {
            console.log('Department clicked:', departmentId)
            // Show department details
          }}
          onOrganizationUpdate={(updatedOrg) => {
            organizationService.updateOrganization(updatedOrg.id, updatedOrg)
            setSelectedOrg(updatedOrg)
            setOrganizations(prev => prev.map(org => 
              org.id === updatedOrg.id ? updatedOrg : org
            ))
          }}
        />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Virtual AI Organizations</h1>
          <p className="text-slate-300 text-lg">
            Create and manage your virtual AI organization structures
          </p>
        </div>
        <Button 
          className="gradient-button hover:scale-105 transition-transform"
          onClick={() => setShowTemplateModal(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Organization
        </Button>
      </div>

      {/* Organizations Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      ) : organizations.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="p-12 text-center">
            <Building className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Organizations Yet</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto">
              Create your first virtual AI organization to start coordinating agents and managing complex workflows.
            </p>
            <Button 
              className="gradient-button"
              onClick={() => setShowTemplateModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Organization
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organizations.map((org, index) => {
            const IconComponent = getOrganizationIcon(org.structure)
            const structureColor = getStructureColor(org.structure)
            const agentCount = Object.keys(org.agents).length
            const departmentCount = Object.keys(org.departments).length
            
            return (
              <Card 
                key={org.id}
                className="agent-card group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-3 bg-gradient-to-r ${structureColor} rounded-xl group-hover:scale-110 transition-transform`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="text-xs border-slate-600 text-slate-300 capitalize"
                    >
                      {org.structure}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-white">{org.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 mb-4 text-sm">{org.description}</p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{agentCount}</div>
                      <div className="text-xs text-slate-400">Agents</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{departmentCount}</div>
                      <div className="text-xs text-slate-400">Departments</div>
                    </div>
                  </div>

                  {/* CEO Info */}
                  {org.agents[org.ceo] && (
                    <div className="flex items-center space-x-2 mb-4 p-2 bg-white/5 rounded-lg">
                      <Crown className="h-4 w-4 text-yellow-400" />
                      <div>
                        <p className="text-sm font-medium text-white">
                          {org.agents[org.ceo].role.name}
                        </p>
                        <p className="text-xs text-slate-400">Organization Leader</p>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1 gradient-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedOrg(org)
                        setShowOrgChart(true)
                      }}
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleCloneOrganization(org)
                      }}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="glass-button text-red-400 hover:text-red-300"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDeleteOrganization(org.id)
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Template Selection Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="glass-card max-w-4xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl text-white">Choose Organization Template</CardTitle>
                  <p className="text-slate-400 mt-1">Select a pre-built template to get started quickly</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setShowTemplateModal(false)}
                  className="glass-button"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {getAllTemplates().map((template) => {
                  const IconComponent = getOrganizationIcon(template.structure.structure)
                  const structureColor = getStructureColor(template.structure.structure)
                  
                  return (
                    <Card 
                      key={template.id}
                      className="agent-card group cursor-pointer"
                      onClick={() => handleCreateOrganization(template.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-3 bg-gradient-to-r ${structureColor} rounded-xl group-hover:scale-110 transition-transform`}>
                            <IconComponent className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{template.name}</h3>
                            <Badge 
                              variant="outline" 
                              className="text-xs border-slate-600 text-slate-300 capitalize mt-1"
                            >
                              {template.type}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-400 text-sm mb-4">{template.description}</p>
                        
                        {/* Use Cases */}
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Best For:</h4>
                            <div className="flex flex-wrap gap-1">
                              {template.useCase.slice(0, 2).map((useCase, idx) => (
                                <Badge 
                                  key={idx}
                                  variant="secondary" 
                                  className="text-xs px-2 py-0.5 bg-white/10 text-slate-300 border-0"
                                >
                                  {useCase}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {/* Benefits */}
                          <div>
                            <h4 className="text-sm font-medium text-white mb-2">Benefits:</h4>
                            <ul className="text-xs text-slate-400 space-y-1">
                              {template.benefits.slice(0, 2).map((benefit, idx) => (
                                <li key={idx}>• {benefit}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <Button className="w-full gradient-button mt-4">
                          <Plus className="h-4 w-4 mr-2" />
                          Create Organization
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}