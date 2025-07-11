'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { X, Download, Folder, Sparkles } from 'lucide-react'

interface UseTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  template: any
  onProjectCreated: (project: any) => void
}

export function UseTemplateModal({ isOpen, onClose, template, onProjectCreated }: UseTemplateModalProps) {
  const [projectName, setProjectName] = useState(template?.name || '')
  const [projectDescription, setProjectDescription] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // Simulate project creation process
      await new Promise(resolve => setTimeout(resolve, 2000))

      const newProject = {
        id: Date.now(),
        name: projectName,
        description: projectDescription || `Project created from ${template.name} template`,
        status: 'active',
        progress: 15, // Starting progress for template-based project
        lastActivity: 'just now',
        team: ['You'],
        priority: 'medium',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
        category: template.category,
        color: template.color,
        template: template.name,
        tags: template.tags
      }

      onProjectCreated(newProject)
      onClose()
      
      // Reset form
      setProjectName('')
      setProjectDescription('')
    } catch (error) {
      console.error('Error creating project:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen || !template) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-card max-w-2xl w-full animate-scale-in">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-3 bg-gradient-to-r ${template.color} rounded-xl`}>
                <template.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">Use Template</CardTitle>
                <p className="text-slate-400">{template.name}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose} className="glass-button">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleCreateProject} className="space-y-6">
            {/* Template Info */}
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Template Details</h3>
              <p className="text-slate-400 mb-3">{template.description}</p>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag: string, idx: number) => (
                  <span key={idx} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="projectName" className="text-white">Project Name</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Enter your project name..."
                required
                className="glass-input"
              />
            </div>

            {/* Project Description */}
            <div className="space-y-2">
              <Label htmlFor="projectDescription" className="text-white">Description (Optional)</Label>
              <textarea
                id="projectDescription"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                placeholder="Customize the project description..."
                rows={3}
                className="w-full p-3 glass-input resize-none"
              />
            </div>

            {/* What Will Be Created */}
            <div className="glass-card p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                <Sparkles className="h-5 w-5 mr-2 text-purple-400" />
                What will be created:
              </h3>
              <ul className="space-y-2 text-slate-300">
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>Project structure based on {template.name}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <span>Pre-configured with {template.tags.join(', ')}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <span>Ready-to-use codebase and documentation</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Best practices and folder structure</span>
                </li>
              </ul>
            </div>

            {/* Submit Buttons */}
            <div className="flex space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 glass-button"
                disabled={isCreating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 gradient-button"
                disabled={!projectName.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}