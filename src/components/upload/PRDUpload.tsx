'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Upload, FileText, Image, FileX, Check, Loader2, Bot, Sparkles } from 'lucide-react'

interface PRDUploadProps {
  onFileUploaded: (file: File, content: string) => void
  onProjectStart: () => void
  allowSkip?: boolean
}

export function PRDUpload({ onFileUploaded, onProjectStart, allowSkip = false }: PRDUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedContent, setProcessedContent] = useState<string>('')
  const [isReady, setIsReady] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadedFile(file)
    setIsProcessing(true)

    try {
      // Simulate file processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      let content = ''
      if (file.type === 'text/markdown' || file.name.endsWith('.md')) {
        content = await file.text()
      } else if (file.type.startsWith('image/')) {
        content = `Image uploaded: ${file.name}. This appears to be a wireframe or design mockup that will be analyzed by our AI agents to extract requirements and create the application.`
      } else if (file.type === 'application/pdf') {
        content = `PDF document uploaded: ${file.name}. This document contains project requirements and specifications that will be processed by our AI agents to understand the project scope and create the application.`
      } else {
        content = `Document uploaded: ${file.name}. This file will be analyzed by our AI agents to extract project requirements.`
      }

      setProcessedContent(content)
      setIsReady(true)
      onFileUploaded(file, content)
    } catch (error) {
      console.error('Error processing file:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      const input = fileInputRef.current
      if (input) {
        const dt = new DataTransfer()
        dt.items.add(file)
        input.files = dt.files
        handleFileSelect({ target: input } as any)
      }
    }
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return Image
    if (file.type === 'application/pdf' || file.name.endsWith('.md')) return FileText
    return FileX
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-viby rounded-full mb-4">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold gradient-text">Start Your Project</h2>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Upload your Product Requirements Document (PRD), wireframes, or project description. 
          Our AI agents will analyze it and create your application automatically.
        </p>
      </div>

      {/* File Upload Area */}
      {!uploadedFile && (
        <Card className="glass-card">
          <CardContent className="p-8">
            <div
              className="border-2 border-dashed border-white/20 rounded-lg p-8 text-center hover:border-white/40 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Drop your files here or click to browse
              </h3>
              <p className="text-slate-400 mb-4">
                Supported formats: PDF, Markdown (.md), Images (PNG, JPG, WebP)
              </p>
              <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500">
                <span className="bg-white/10 px-2 py-1 rounded">PDF</span>
                <span className="bg-white/10 px-2 py-1 rounded">Markdown</span>
                <span className="bg-white/10 px-2 py-1 rounded">Images</span>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.md,.png,.jpg,.jpeg,.webp"
              onChange={handleFileSelect}
            />
          </CardContent>
        </Card>
      )}

      {/* Skip Option */}
      {!uploadedFile && allowSkip && (
        <Card className="glass-card">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Start Without Document
            </h3>
            <p className="text-slate-400 mb-4">
              Skip the document upload and proceed directly to the BMad workflow. 
              Our AI agents will help you define requirements through the collaborative process.
            </p>
            <Button 
              onClick={() => {
                onFileUploaded(new File([], ''), '')
                onProjectStart()
              }}
              variant="outline" 
              className="glass-button"
            >
              <Bot className="h-4 w-4 mr-2" />
              Skip & Start Workflow
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Processing State */}
      {uploadedFile && isProcessing && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <Loader2 className="h-12 w-12 text-purple-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-white mb-2">
              Processing your document...
            </h3>
            <p className="text-slate-400">
              Our AI is analyzing your requirements and preparing the project setup.
            </p>
          </CardContent>
        </Card>
      )}

      {/* File Processed Successfully */}
      {uploadedFile && !isProcessing && isReady && (
        <div className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Document Processed Successfully
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 p-4 bg-white/5 rounded-lg">
                {uploadedFile && React.createElement(getFileIcon(uploadedFile), {
                  className: "h-8 w-8 text-blue-400"
                })}
                <div className="flex-1">
                  <h4 className="text-white font-medium">{uploadedFile?.name}</h4>
                  <p className="text-slate-400 text-sm">
                    {uploadedFile && formatFileSize(uploadedFile.size)} • Processed
                  </p>
                </div>
              </div>
              
              {processedContent && (
                <div className="mt-4 p-4 bg-white/5 rounded-lg">
                  <h5 className="text-white font-medium mb-2">Extracted Content:</h5>
                  <p className="text-slate-300 text-sm">
                    {processedContent.substring(0, 200)}
                    {processedContent.length > 200 && '...'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Next Steps */}
          <Card className="glass-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Ready to Start Agent Collaboration
                  </h3>
                  <p className="text-slate-400">
                    Our AI agents will now work together to analyze, design, and build your application.
                  </p>
                </div>
                <Button 
                  onClick={onProjectStart}
                  className="gradient-button hover:scale-105 transition-transform"
                >
                  <Bot className="h-4 w-4 mr-2" />
                  Start Agent Collaboration
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}