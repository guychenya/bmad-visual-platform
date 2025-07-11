'use client'

import { useState } from 'react'
import { PRDUpload } from '../../../components/upload/PRDUpload'
import { BMadAgentCollaboration } from '../../../components/collaboration/BMadAgentCollaboration'
import { BMadAppShowcase } from '../../../components/showcase/BMadAppShowcase'

export default function CreateProjectPage() {
  const [currentStep, setCurrentStep] = useState<'upload' | 'collaboration' | 'showcase'>('upload')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedContent, setUploadedContent] = useState('')
  const [projectName, setProjectName] = useState('')
  const [appResult, setAppResult] = useState<any>(null)

  const handleFileUploaded = (file: File, content: string) => {
    setUploadedFile(file)
    setUploadedContent(content)
    // Extract project name from file name or content
    const name = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, ' ')
    setProjectName(name || 'New Project')
  }

  const handleProjectStart = () => {
    setCurrentStep('collaboration')
  }

  const handleCollaborationComplete = (result: any) => {
    setAppResult(result)
    setCurrentStep('showcase')
  }

  const handleNewProject = () => {
    setCurrentStep('upload')
    setUploadedFile(null)
    setUploadedContent('')
    setProjectName('')
    setAppResult(null)
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[
              { id: 'upload', name: 'Upload PRD', step: 1 },
              { id: 'collaboration', name: 'BMad Methodology', step: 2 },
              { id: 'showcase', name: 'Generated App', step: 3 }
            ].map((item, index) => (
              <div key={item.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep === item.id 
                    ? 'bg-gradient-viby text-white' 
                    : index < (['upload', 'collaboration', 'showcase'].indexOf(currentStep))
                    ? 'bg-green-500 text-white'
                    : 'bg-white/10 text-slate-400'
                }`}>
                  {item.step}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep === item.id ? 'text-white' : 'text-slate-400'
                }`}>
                  {item.name}
                </span>
                {index < 2 && (
                  <div className={`w-8 h-0.5 mx-4 ${
                    index < (['upload', 'collaboration', 'showcase'].indexOf(currentStep))
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
          <PRDUpload 
            onFileUploaded={handleFileUploaded}
            onProjectStart={handleProjectStart}
          />
        )}

        {currentStep === 'collaboration' && (
          <BMadAgentCollaboration
            projectName={projectName}
            uploadedContent={uploadedContent}
            onComplete={handleCollaborationComplete}
          />
        )}

        {currentStep === 'showcase' && appResult && (
          <BMadAppShowcase
            result={appResult}
            onNewProject={handleNewProject}
          />
        )}
      </div>
    </div>
  )
}