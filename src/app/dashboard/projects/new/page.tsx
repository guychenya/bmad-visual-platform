'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Label } from '../../../../components/ui/label'
import { ArrowLeft, Upload, FileText, Workflow, Download, CheckCircle, Folder, Calendar, Users, Star } from 'lucide-react'
import Link from 'next/link'
import { PRDUpload } from '../../../../components/upload/PRDUpload'
import { BMadAgentCollaboration } from '../../../../components/collaboration/BMadAgentCollaboration'
import { BMadAppShowcase } from '../../../../components/showcase/BMadAppShowcase'

interface ProjectData {
  name: string
  description: string
  category: string
  priority: string
  dueDate: string
  teamMembers: string[]
}

export default function NewProjectPage() {
  const [currentStep, setCurrentStep] = useState<'setup' | 'upload' | 'workflow' | 'generation' | 'complete'>('setup')
  const [projectData, setProjectData] = useState<ProjectData>({
    name: '',
    description: '',
    category: 'Web App',
    priority: 'medium',
    dueDate: '',
    teamMembers: ['']
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedContent, setUploadedContent] = useState('')
  const [workflowResult, setWorkflowResult] = useState<any>(null)
  const [projectId, setProjectId] = useState<number | null>(null)

  const categories = ['Web App', 'Mobile App', 'API', 'Dashboard', 'E-commerce', 'Portfolio', 'Other']
  const priorities = ['low', 'medium', 'high']

  const steps = [
    { id: 'setup', name: 'Project Setup', icon: Folder, step: 1 },
    { id: 'upload', name: 'Requirements', icon: Upload, step: 2 },
    { id: 'workflow', name: 'BMad Process', icon: Workflow, step: 3 },
    { id: 'generation', name: 'PRD Generation', icon: FileText, step: 4 },
    { id: 'complete', name: 'Complete', icon: CheckCircle, step: 5 }
  ]

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep)

  const handleProjectSetup = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectData.name.trim() || !projectData.description.trim()) return
    setCurrentStep('upload')
  }

  const handleFileUploaded = (file: File, content: string) => {
    setUploadedFile(file)
    setUploadedContent(content)
  }

  const handleStartWorkflow = () => {
    setCurrentStep('workflow')
  }

  const handleWorkflowComplete = (result: any) => {
    setWorkflowResult(result)
    setCurrentStep('generation')
  }

  const handleProjectComplete = () => {
    // Save the complete project
    const newProject = {
      id: Date.now(),
      name: projectData.name,
      description: projectData.description,
      status: 'active',
      progress: 25,
      lastActivity: 'just now',
      team: projectData.teamMembers.filter(member => member.trim() !== ''),
      priority: projectData.priority,
      dueDate: projectData.dueDate,
      category: projectData.category,
      color: getRandomColor(),
      workflowResult,
      prdDocument: workflowResult?.prdDocument,
      uploadedFile: uploadedFile?.name,
      uploadedContent
    }

    // Save to localStorage
    const existingProjects = JSON.parse(localStorage.getItem('viby-projects') || '[]')
    const updatedProjects = [...existingProjects, newProject]
    localStorage.setItem('viby-projects', JSON.stringify(updatedProjects))
    
    setProjectId(newProject.id)
    setCurrentStep('complete')
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
    setProjectData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, '']
    }))
  }

  const updateTeamMember = (index: number, value: string) => {
    setProjectData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => i === index ? value : member)
    }))
  }

  const removeTeamMember = (index: number) => {
    setProjectData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard/projects">
              <Button variant="outline" className="glass-button">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Projects
              </Button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Create New Project</h1>
              <p className="text-slate-300 text-lg">
                Transform your ideas into reality with BMad methodology
              </p>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4 overflow-x-auto pb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-shrink-0">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  getCurrentStepIndex() === index 
                    ? 'bg-gradient-viby text-white scale-110' 
                    : index < getCurrentStepIndex()
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-slate-400'
                }`}>
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="ml-3 min-w-0">
                  <span className={`text-sm font-medium block ${
                    getCurrentStepIndex() === index ? 'text-white' : 'text-slate-400'
                  }`}>
                    {step.name}
                  </span>
                  <span className="text-xs text-slate-500">Step {step.step}</span>
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    index < getCurrentStepIndex()
                      ? 'bg-green-500'
                      : 'bg-white/10'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="space-y-8">
          {currentStep === 'setup' && (
            <Card className="glass-card max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle className="text-2xl text-white flex items-center">
                  <Folder className="h-6 w-6 mr-3" />
                  Project Setup
                </CardTitle>
                <p className="text-slate-400">
                  Tell us about your project to get started with the BMad methodology.
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProjectSetup} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-white">Project Name</Label>
                    <Input
                      id="name"
                      value={projectData.name}
                      onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your project name..."
                      required
                      className="glass-input"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white">Description</Label>
                    <textarea
                      id="description"
                      value={projectData.description}
                      onChange={(e) => setProjectData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your project vision and goals..."
                      rows={4}
                      className="w-full p-3 glass-input resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">Category</Label>
                      <select
                        id="category"
                        value={projectData.category}
                        onChange={(e) => setProjectData(prev => ({ ...prev, category: e.target.value }))}
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
                        value={projectData.priority}
                        onChange={(e) => setProjectData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full p-3 glass-input"
                      >
                        {priorities.map(priority => (
                          <option key={priority} value={priority} className="bg-slate-800">
                            {priority.charAt(0).toUpperCase() + priority.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dueDate" className="text-white">Due Date</Label>
                      <Input
                        id="dueDate"
                        type="date"
                        value={projectData.dueDate}
                        onChange={(e) => setProjectData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="glass-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Team Members</Label>
                    {projectData.teamMembers.map((member, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={member}
                          onChange={(e) => updateTeamMember(index, e.target.value)}
                          placeholder="Team member name..."
                          className="flex-1 glass-input"
                        />
                        {projectData.teamMembers.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => removeTeamMember(index)}
                            className="glass-button"
                          >
                            ×
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
                      + Add Team Member
                    </Button>
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      className="gradient-button px-8"
                      disabled={!projectData.name.trim() || !projectData.description.trim()}
                    >
                      Continue to Requirements
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {currentStep === 'upload' && (
            <div className="space-y-6">
              <Card className="glass-card max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <Upload className="h-6 w-6 mr-3" />
                    Requirements Document
                  </CardTitle>
                  <p className="text-slate-400">
                    Upload your PRD or requirements document, or proceed without one to create requirements through the workflow.
                  </p>
                </CardHeader>
                <CardContent>
                  <PRDUpload 
                    onFileUploaded={handleFileUploaded}
                    onProjectStart={handleStartWorkflow}
                    allowSkip={true}
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 'workflow' && (
            <BMadAgentCollaboration
              projectName={projectData.name}
              uploadedContent={uploadedContent}
              onComplete={handleWorkflowComplete}
              showDownloads={true}
            />
          )}

          {currentStep === 'generation' && workflowResult && (
            <div className="space-y-6">
              <Card className="glass-card max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="text-2xl text-white flex items-center">
                    <FileText className="h-6 w-6 mr-3" />
                    PRD Generation Complete
                  </CardTitle>
                  <p className="text-slate-400">
                    Your comprehensive PRD document has been generated and is ready for use.
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Generated Documents</h3>
                      <div className="space-y-2">
                        <Button className="w-full gradient-button" onClick={() => {/* Download PRD */}}>
                          <Download className="h-4 w-4 mr-2" />
                          Download Complete PRD
                        </Button>
                        <Button variant="outline" className="w-full glass-button">
                          <Download className="h-4 w-4 mr-2" />
                          Download Requirements Analysis
                        </Button>
                        <Button variant="outline" className="w-full glass-button">
                          <Download className="h-4 w-4 mr-2" />
                          Download Technical Specifications
                        </Button>
                        <Button variant="outline" className="w-full glass-button">
                          <Download className="h-4 w-4 mr-2" />
                          Download User Stories
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-white">Project Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Project:</span>
                          <span className="text-white">{projectData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Category:</span>
                          <span className="text-white">{projectData.category}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Priority:</span>
                          <span className="text-white capitalize">{projectData.priority}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Team Size:</span>
                          <span className="text-white">{projectData.teamMembers.filter(m => m.trim()).length} members</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Requirements Source:</span>
                          <span className="text-white">{uploadedFile ? 'Uploaded Document' : 'Generated'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-4 pt-4">
                    <Button variant="outline" className="glass-button">
                      Preview PRD
                    </Button>
                    <Button 
                      className="gradient-button px-8"
                      onClick={handleProjectComplete}
                    >
                      Complete Project Setup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {currentStep === 'complete' && (
            <Card className="glass-card max-w-4xl mx-auto">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-white">Project Created Successfully!</CardTitle>
                <p className="text-slate-400 text-lg">
                  Your project has been created with complete documentation and is ready for development.
                </p>
              </CardHeader>
              <CardContent className="text-center space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 glass-card rounded-lg">
                    <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Complete PRD</h4>
                    <p className="text-sm text-slate-400">Comprehensive project requirements document</p>
                  </div>
                  <div className="p-4 glass-card rounded-lg">
                    <Workflow className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">BMad Process</h4>
                    <p className="text-sm text-slate-400">Professional methodology applied</p>
                  </div>
                  <div className="p-4 glass-card rounded-lg">
                    <Users className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Team Ready</h4>
                    <p className="text-sm text-slate-400">Ready for team collaboration</p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Link href={`/dashboard/projects/${projectId}`}>
                    <Button className="gradient-button px-8">
                      View Project Details
                    </Button>
                  </Link>
                  <Link href="/dashboard/projects">
                    <Button variant="outline" className="glass-button px-8">
                      Back to Projects
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}