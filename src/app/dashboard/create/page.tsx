'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Button } from '../../../components/ui/button'
import { Upload, MessageSquare, FileText, Download, CheckCircle, Sparkles, Users, ArrowRight, Bot } from 'lucide-react'
import { PRDUpload } from '../../../components/upload/PRDUpload'
import { AgentSelector } from '../../../components/workflow/AgentSelector';

export default function CreateProjectPage() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'select-agents' | 'workflow' | 'complete'>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedContent, setUploadedContent] = useState('');
  const [projectName, setProjectName] = useState('');
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);

  const handleFileUploaded = (file: File, content: string) => {
    setUploadedFile(file);
    setUploadedContent(content);
    const name = file.name ? file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ') : 'New Project';
    setProjectName(name || 'New Project');
    setCurrentStep('select-agents');
  };

  const handleProjectStart = () => {
    setCurrentStep('workflow')
  }

  const handleWorkflowComplete = (result: any) => {
    setWorkflowResult(result)
    setCurrentStep('complete')
    
    // Save project to localStorage for project management
    const newProject = {
      id: Date.now(),
      name: projectName,
      description: `BMad methodology project: ${projectName}`,
      status: 'active',
      progress: 100,
      lastActivity: 'just now',
      team: ['You'],
      priority: 'medium',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      category: 'Web App',
      color: 'from-purple-500 to-pink-500',
      workflowResult: result,
      prdDocument: result?.prdDocument,
      uploadedFile: uploadedFile?.name,
      uploadedContent
    }

    const existingProjects = JSON.parse(localStorage.getItem('viby-projects') || '[]')
    const updatedProjects = [...existingProjects, newProject]
    localStorage.setItem('viby-projects', JSON.stringify(updatedProjects))
  }

  const handleNewProject = () => {
    setCurrentStep('upload')
    setUploadedFile(null)
    setUploadedContent('')
    setProjectName('')
    setWorkflowResult(null)
  }

  const steps = [
    { id: 'upload', name: 'Upload Requirements', icon: Upload, step: 1 },
    { id: 'select-agents', name: 'Select Agents', icon: Users, step: 2 },
    { id: 'workflow', name: 'BMad Workflow', icon: Users, step: 3 },
    { id: 'complete', name: 'Download Results', icon: Download, step: 4 }
  ];

  const getCurrentStepIndex = () => steps.findIndex(step => step.id === currentStep)

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-viby rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text">BMad Methodology</h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Transform your ideas into production-ready applications using our specialized AI agents and proven methodology.
          </p>
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

        {/* Content */}
        {currentStep === 'upload' && (
          <div className="space-y-6">
            <PRDUpload 
              onFileUploaded={handleFileUploaded}
              onProjectStart={handleProjectStart}
              allowSkip={true}
            />
            
            {/* Quick Start Option */}
            <Card className="glass-card">
              <CardContent className="p-6 text-center">
                <MessageSquare className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">
                  Chat with BMad Orchestra
                </h3>
                <p className="text-slate-400 mb-4">
                  Skip the document upload and chat directly with our Orchestra agent to define your project requirements interactively.
                </p>
                <Button 
                  className="gradient-button"
                  onClick={() => window.location.href = '/dashboard/agents/bmad-orchestrator'}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Start Interactive Session
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'select-agents' && (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-white">Select Your Team</CardTitle>
              </CardHeader>
              <CardContent>
                <AgentSelector onSelectionChange={setSelectedAgentIds} />
              </CardContent>
            </Card>
            <Button onClick={() => setCurrentStep('workflow')} className="gradient-button">
              <ArrowRight className="h-4 w-4 mr-2" />
              Run Workflow
            </Button>
          </div>
        )}

        {currentStep === 'workflow' && (
          <BMadAgentCollaboration
            projectName={projectName}
            uploadedContent={uploadedContent}
            onComplete={handleWorkflowComplete}
            showDownloads={true}
            selectedAgentIds={selectedAgentIds}
          />
        )}

        {currentStep === 'complete' && (
          <div className="space-y-6">
            <Card className="glass-card">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-3xl text-white">BMad Workflow Complete!</CardTitle>
                <p className="text-slate-400 text-lg">
                  Your project has been processed through our complete methodology.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-4 glass-card rounded-lg">
                    <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Complete PRD</h4>
                    <p className="text-sm text-slate-400">Comprehensive requirements document</p>
                  </div>
                  <div className="p-4 glass-card rounded-lg">
                    <Users className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Agent Collaboration</h4>
                    <p className="text-sm text-slate-400">Multi-agent workflow results</p>
                  </div>
                  <div className="p-4 glass-card rounded-lg">
                    <Download className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <h4 className="font-semibold text-white">Ready to Use</h4>
                    <p className="text-sm text-slate-400">Download all generated documents</p>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button 
                    className="gradient-button px-8"
                    onClick={() => {
                      // Download complete PRD
                      const content = `# ${projectName} - Complete PRD\n\nGenerated by BMad-Method\n\n## Project Overview\n${uploadedContent}\n\n## Workflow Results\n${JSON.stringify(workflowResult, null, 2)}`
                      const blob = new Blob([content], { type: 'text/markdown' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${projectName.toLowerCase().replace(/\s+/g, '-')}-complete-prd.md`
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download Complete PRD
                  </Button>
                  <Button 
                    variant="outline" 
                    className="glass-button px-8"
                    onClick={() => window.location.href = '/dashboard/projects'}
                  >
                    View in Projects
                  </Button>
                  <Button 
                    variant="outline" 
                    className="glass-button px-8"
                    onClick={handleNewProject}
                  >
                    Start New Project
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}