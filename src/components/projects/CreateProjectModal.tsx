'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { X, Plus, Folder, Calendar, Users, Star } from 'lucide-react'

interface CreateProjectModalProps {
  isOpen: boolean
  onClose: () => void
  onProjectCreated: (project: any) => void
}

export function CreateProjectModal({ isOpen, onClose, onProjectCreated }: CreateProjectModalProps) {
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
      color: getRandomColor()
    }

    onProjectCreated(newProject)
    onClose()
    
    // Reset form
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-card max-w-2xl w-full animate-scale-in max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-viby rounded-xl">
                <Folder className="h-6 w-6 text-white" />
              </div>
              <CardTitle className="text-2xl text-white">Create New Project</CardTitle>
            </div>
            <Button variant="outline" onClick={onClose} className="glass-button">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
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
                onClick={onClose}
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
                Create Project
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}