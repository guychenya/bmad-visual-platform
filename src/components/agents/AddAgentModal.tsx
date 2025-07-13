'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { X, Plus } from 'lucide-react'
import { agentIcons, agentColors } from '../../lib/agent-utils'

interface AddAgentModalProps {
  isOpen: boolean
  onClose: () => void
  onAgentCreated: (agent: any) => void
}

export function AddAgentModal({ isOpen, onClose, onAgentCreated }: AddAgentModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    expertise: '',
    personality: '',
    icon: 'Brain',
    color: 'Blue'
  })
  const [isCreating, setIsCreating] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsCreating(true)

    try {
      // Simulate agent creation process
      await new Promise(resolve => setTimeout(resolve, 1500))

      const newAgent = {
        id: Date.now(),
        name: formData.name,
        description: formData.description,
        status: 'idle',
        lastUsed: 'Never',
        icon: agentIcons[formData.icon as keyof typeof agentIcons],
        color: agentColors[formData.color as keyof typeof agentColors],
        expertise: formData.expertise.split(',').map(skill => skill.trim()).filter(skill => skill),
        personality: formData.personality,
        createdAt: new Date().toISOString(),
        isCustom: true
      }

      onAgentCreated(newAgent)
      onClose()
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        expertise: '',
        personality: '',
        icon: 'Brain',
        color: 'Blue'
      })
    } catch (error) {
      console.error('Error creating agent:', error)
    } finally {
      setIsCreating(false)
    }
  }

  if (!isOpen) return null

  const iconKeys = Object.keys(agentIcons)
  const colorKeys = Object.keys(agentColors)

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
                <CardTitle className="text-2xl text-white">Create Custom Agent</CardTitle>
                <p className="text-slate-400">Design your specialized AI assistant</p>
              </div>
            </div>
            <Button variant="outline" onClick={onClose} className="glass-button">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleCreateAgent} className="space-y-6">
            {/* Agent Name */}
            <div className="space-y-2">
              <Label htmlFor="agentName" className="text-white">Agent Name</Label>
              <Input
                id="agentName"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="e.g., Data Scientist, Marketing Expert"
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
                placeholder="Describe what this agent specializes in..."
                rows={3}
                required
                className="w-full p-3 glass-input resize-none"
              />
            </div>

            {/* Expertise */}
            <div className="space-y-2">
              <Label htmlFor="expertise" className="text-white">Expertise Areas (comma-separated)</Label>
              <Input
                id="expertise"
                value={formData.expertise}
                onChange={(e) => handleInputChange('expertise', e.target.value)}
                placeholder="Data Analysis, Machine Learning, Statistics"
                required
                className="glass-input"
              />
              <p className="text-xs text-slate-400">
                Enter skills separated by commas
              </p>
            </div>

            {/* Personality */}
            <div className="space-y-2">
              <Label htmlFor="personality" className="text-white">Personality</Label>
              <Input
                id="personality"
                value={formData.personality}
                onChange={(e) => handleInputChange('personality', e.target.value)}
                placeholder="e.g., Analytical and detail-oriented"
                required
                className="glass-input"
              />
            </div>

            {/* Icon Selection */}
            <div className="space-y-2">
              <Label className="text-white">Icon</Label>
              <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
                {iconKeys.map((iconKey) => {
                  const Icon = agentIcons[iconKey as keyof typeof agentIcons]
                  const isSelected = formData.icon === iconKey
                  return (
                    <Button
                      key={iconKey}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleInputChange('icon', iconKey)}
                      className={`flex flex-col items-center space-y-1 h-16 ${
                        isSelected ? "gradient-button" : "glass-button"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{iconKey}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label className="text-white">Color Theme</Label>
              <div className="grid grid-cols-4 gap-2">
                {colorKeys.map((colorKey) => {
                  const isSelected = formData.color === colorKey
                  return (
                    <Button
                      key={colorKey}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => handleInputChange('color', colorKey)}
                      className={`flex items-center justify-center h-12 ${
                        isSelected ? "ring-2 ring-white" : ""
                      }`}
                      style={{
                        background: isSelected 
                          ? `linear-gradient(to right, ${agentColors[colorKey as keyof typeof agentColors].replace('from-', '').replace(' to-', ', ').replace('-500', '').replace('-400', '')})`
                          : undefined
                      }}
                    >
                      <span className={`text-xs font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                        {colorKey}
                      </span>
                    </Button>
                  )
                })}
              </div>
            </div>

            {/* Preview */}
            {formData.name && (
              <div className="glass-card p-4 rounded-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Preview</h3>
                <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                  <div className={`p-3 bg-gradient-to-r ${agentColors[formData.color as keyof typeof agentColors]} rounded-xl`}>
                    {(() => {
                      const Icon = agentIcons[formData.icon as keyof typeof agentIcons]
                      return <Icon className="h-6 w-6 text-white" />
                    })()}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold">{formData.name}</h4>
                    <p className="text-slate-400 text-sm">{formData.description}</p>
                    {formData.expertise && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formData.expertise.split(',').slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="text-xs bg-white/10 text-slate-300 px-2 py-1 rounded-full">
                            {skill.trim()}
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
                    Creating Agent...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Agent
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