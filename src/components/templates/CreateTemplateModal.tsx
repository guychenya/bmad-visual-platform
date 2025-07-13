'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { X, Plus, Code, Globe, Smartphone, Server, FileText, Palette, Database, Upload } from 'lucide-react'

interface CreateTemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onTemplateCreated: (template: any) => void
}

const categoryIcons = {
  'Web App': Code,
  'E-commerce': Globe,
  'Mobile': Smartphone,
  'Backend': Server,
  'Dashboard': FileText,
  'Portfolio': Palette,
  'Content': Database,
  'Marketing': Globe
}

const categoryColors = {
  'Web App': 'from-blue-500 to-cyan-500',
  'E-commerce': 'from-green-500 to-emerald-500',
  'Mobile': 'from-purple-500 to-pink-500',
  'Backend': 'from-orange-500 to-red-500',
  'Dashboard': 'from-indigo-500 to-purple-500',
  'Portfolio': 'from-pink-500 to-rose-500',
  'Content': 'from-teal-500 to-blue-500',
  'Marketing': 'from-yellow-500 to-orange-500'
}

export function CreateTemplateModal({ isOpen, onClose, onTemplateCreated }: CreateTemplateModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Web App',
    tags: '',
    repository: '',
    preview: ''
  })
  const [isCreating, setIsCreating] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateTemplate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // Simulate template creation process
      await new Promise(resolve => setTimeout(resolve, 1500))

      const newTemplate = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        category: formData.category,
        icon: categoryIcons[formData.category as keyof typeof categoryIcons] || Code,
        color: categoryColors[formData.category as keyof typeof categoryColors] || 'from-blue-500 to-cyan-500',
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        downloads: 0,
        preview: formData.preview || '/templates/default.png',
        repository: formData.repository,
        createdAt: new Date().toISOString()
      }

      onTemplateCreated(newTemplate)
      onClose()
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: 'Web App',
        tags: '',
        repository: '',
        preview: ''
      })
    } catch (error) {
      console.error('Error creating template:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  const categories = Object.keys(categoryIcons)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="glass-card max-w-2xl w-full animate-scale-in max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Plus className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl text-white">Create New Template</CardTitle>
                <p className="text-slate-400">Share your project structure with the community</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose} className="glass-button">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleCreateTemplate} className="space-y-6">
            {/* Template Name */}
            <div className="space-y-2">
              <Label htmlFor="templateName" className="text-white">Template Name</Label>
              <Input
                id="templateName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., React SaaS Starter"
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
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what your template provides..."
                rows={3}
                required
                className="w-full p-3 glass-input resize-none"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label className="text-white">Category</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {categories.map((category) => {
                  const Icon = categoryIcons[category as keyof typeof categoryIcons]
                  const isSelected = formData.category === category
                  return (
                    <Button
                      key={category}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleInputChange('category', category)}
                      className={`flex flex-col items-center space-y-1 h-16 ${
                        isSelected ? "gradient-button" : "glass-button"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{category}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-white">Technologies (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="React, NextJS, TypeScript, Tailwind"
                required
                className="glass-input"
              />
              <p className="text-xs text-slate-400">
                Enter technologies separated by commas
              </p>
            </div>

            {/* Repository URL */}
            <div className="space-y-2">
              <Label htmlFor="repository" className="text-white">Repository URL (Optional)</Label>
              <Input
                id="repository"
                value={formData.repository}
                onChange={(e) => handleInputChange('repository', e.target.value)}
                placeholder="https://github.com/username/repo"
                className="glass-input"
              />
            </div>

            {/* Preview Image URL */}
            <div className="space-y-2">
              <Label htmlFor="preview" className="text-white">Preview Image URL (Optional)</Label>
              <Input
                id="preview"
                value={formData.preview}
                onChange={(e) => handleInputChange('preview', e.target.value)}
                placeholder="https://example.com/preview.png"
                className="glass-input"
              />
            </div>

            {/* Preview */}
            {formData.name && (
              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Preview</h3>
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                  <div className={`p-3 bg-gradient-to-r ${categoryColors[formData.category as keyof typeof categoryColors]} rounded-xl`}>
                    {(() => {
                      const Icon = categoryIcons[formData.category as keyof typeof categoryIcons]
                      return <Icon className="h-6 w-6 text-white" />
                    })()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{formData.name}</h4>
                    <p className="text-slate-400 text-sm">{formData.description}</p>
                    {formData.tags && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.tags.split(',').map((tag, idx) => (
                          <span key={idx} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

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
                disabled={!formData.name.trim() || !formData.description.trim() || isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Template...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Template
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