'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Badge } from '../ui/badge'
import { X, Plus, Folder, Calendar, Users, Star, Zap, Code, Smartphone, Building, Globe, ShoppingCart, Target, Palette } from 'lucide-react'
import { PROJECT_TEMPLATES, ProjectTemplate, getAllCategories, getTemplatesByCategory } from '../../lib/workflow/templates'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreated: (project: any) => void
}

export function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
  const [currentStep, setCurrentStep] = useState<'method' | 'template' | 'form'>('method')
  const [selectedTemplate, setSelectedTemplate] = useState<ProjectTemplate | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Web App',
    priority: 'medium',
    dueDate: '',
    teamMembers: [''] // Start with one empty team member field
  })

  const categories = ['Web App', 'Mobile App', 'API', 'Dashboard', 'E-commerce', 'Portfolio', 'Other']
  const priorities = ['low', 'medium', 'high']

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setSelectedTemplate(template)
    setFormData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      category: template.category || template.type
    }))
    setCurrentStep('form')
  }

  const handleFromScratch = () => {
    setSelectedTemplate(null)
    setCurrentStep('form')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newProject = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      status: 'planning',
      progress: 0,
      lastActivity: 'just now',
      team: formData.teamMembers.filter(member => member.trim() !== ''),
      priority: formData.priority,
      dueDate: formData.dueDate,
      category: formData.category,
      color: getRandomColor(),
      template: selectedTemplate?.id || null,
      templateName: selectedTemplate?.name || null
    }

    onProjectCreated(newProject)
    
    // If using template, redirect to workspace
    if (selectedTemplate) {
      setTimeout(() => {
        window.location.href = `/dashboard/workspace?template=${selectedTemplate.id}&project=${newProject.id}`
      }, 500)
    }
    
    onClose()
    resetForm()
  }

  const resetForm = () => {
    setCurrentStep('method')
    setSelectedTemplate(null)
    setFormData({
      name: '',
      description: '',
      category: 'Web App',
      priority: 'medium',
      dueDate: '',
      teamMembers: ['']
    })
  }

  const getRandomColor = () => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-teal-500 to-blue-500'
    ]
    return colors[Math.floor(Math.random() * colors.length)]
  }

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, '']
    }))
  }

  const updateTeamMember = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => i === index ? value : member)
    }))
  }

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }))
  }

  if (!isOpen) return null

  const renderMethodSelection = () => (
    <CardContent>
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-2">How would you like to create your project?</h3>
          <p className="text-slate-400">Choose to start from a template or build from scratch</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From Template */}
          <Card 
            className="agent-card group cursor-pointer hover:scale-105 transition-all"
            onClick={() => setCurrentStep('template')}
          >
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">From Template</h4>
              <p className="text-slate-400 text-sm mb-4">
                Get started quickly with pre-built templates and workflows
              </p>
              <Badge variant="secondary" className="bg-blue-500/20 text-blue-300 border-0">
                Recommended
              </Badge>
            </CardContent>
          </Card>

          {/* From Scratch */}
          <Card 
            className="agent-card group cursor-pointer hover:scale-105 transition-all"
            onClick={handleFromScratch}
          >
            <CardContent className="p-6 text-center">
              <div className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl mb-4 inline-block group-hover:scale-110 transition-transform">
                <Palette className="h-8 w-8 text-white" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">From Scratch</h4>
              <p className="text-slate-400 text-sm mb-4">
                Start with a blank project and customize everything
              </p>
              <Badge variant="outline" className="border-slate-600 text-slate-300">
                Custom
              </Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </CardContent>
  )

  const renderTemplateSelection = () => {
    const templateCategories = getAllCategories()
    
    return (
      <CardContent className="max-h-[70vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white mb-1">Choose a Template</h3>
              <p className="text-slate-400">Select a template to get started with predefined workflows</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setCurrentStep('method')}
              className="glass-button"
            >
              ← Back
            </Button>
          </div>

          {templateCategories.map((category, categoryIndex) => {
            const categoryTemplates = getTemplatesByCategory(category)
            return (
              <div key={category} className="space-y-4">
                <h4 className="text-lg font-medium text-white">{category}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoryTemplates.map((template) => {
                    const IconComponent = template.icon
                    return (
                      <Card 
                        key={template.id}
                        className="agent-card group cursor-pointer hover:scale-105 transition-all"
                        onClick={() => handleTemplateSelect(template)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 bg-gradient-to-r ${template.color} rounded-lg group-hover:scale-110 transition-transform flex-shrink-0`}>
                              <IconComponent className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h5 className="font-medium text-white mb-1">{template.name}</h5>
                              <p className="text-slate-400 text-sm mb-2 line-clamp-2">{template.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${
                                    template.complexity === 'simple' ? 'border-green-400 text-green-400' :
                                    template.complexity === 'medium' ? 'border-yellow-400 text-yellow-400' :
                                    'border-red-400 text-red-400'
                                  }`}
                                >
                                  {template.complexity}
                                </Badge>
                                <span className="text-xs text-slate-500">{template.workflow.agents.length} agents</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    )
  }

  const renderProjectForm = () => (
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Template Info */}
        {selectedTemplate && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <selectedTemplate.icon className="h-6 w-6 text-blue-400" />
              <div>
                <h4 className="text-white font-medium">Using Template: {selectedTemplate.name}</h4>
                <p className="text-blue-300 text-sm">{selectedTemplate.description}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Project Details</h3>
          <Button 
            type="button"
            variant="outline" 
            onClick={() => setCurrentStep(selectedTemplate ? 'template' : 'method')}
            className="glass-button"
          >
            ← Back
          </Button>
        </div>

        {/* Project Name */}
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white">Project Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter project name..."
            required
            className="glass-input"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-white">Description</Label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Describe your project..."
            rows={3}
            className="w-full p-3 glass-input resize-none"
            required
          />
        </div>

        {/* Category and Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category" className="text-white">Category</Label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="w-full p-3 glass-input"
              disabled={!!selectedTemplate}
            >
              {categories.map(category => (
                <option key={category} value={category} className="bg-slate-800">
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority" className="text-white">Priority</Label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full p-3 glass-input"
            >
              {priorities.map(priority => (
                <option key={priority} value={priority} className="bg-slate-800">
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label htmlFor="dueDate" className="text-white">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
            className="glass-input"
          />
        </div>

        {/* Team Members */}
        <div className="space-y-2">
          <Label className="text-white">Team Members</Label>
          {formData.teamMembers.map((member, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={member}
                onChange={(e) => updateTeamMember(index, e.target.value)}
                placeholder="Team member name..."
                className="flex-1 glass-input"
              />
              {formData.teamMembers.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => removeTeamMember(index)}
                  className="glass-button"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            onClick={addTeamMember}
            className="glass-button w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        {/* Submit Buttons */}
        <div className="flex space-x-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              onClose()
              resetForm()
            }}
            className="flex-1 glass-button"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1 gradient-button"
            disabled={!formData.name.trim() || !formData.description.trim()}
          >
            <Folder className="h-4 w-4 mr-2" />
            {selectedTemplate ? 'Create with Template' : 'Create Project'}
          </Button>
        </div>
      </form>
    </CardContent>
  )

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-card max-w-4xl w-full animate-scale-in max-h-[90vh] overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-viby rounded-xl">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Create New Project</CardTitle>
            </div>
            <Button variant="outline" onClick={() => { onClose(); resetForm(); }} className="glass-button">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        {currentStep === 'method' && renderMethodSelection()}
        {currentStep === 'template' && renderTemplateSelection()}
        {currentStep === 'form' && renderProjectForm()}
      </Card>
    </div>
  )
}