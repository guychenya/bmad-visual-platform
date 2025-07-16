'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Upload, Download, Trash2, Eye } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { supabase } from '../../lib/supabase'
import { Button } from '../ui/button'
import { LoadingSpinner } from '../ui/loading-spinner'
import { Database } from '../../types/database'

type ComplianceDocument = Database['public']['Tables']['compliance_documents']['Row']

interface DocumentManagementProps {
  documents: ComplianceDocument[]
  projectId: string
  onDocumentUploaded: () => void
}

export function DocumentManagement({ documents, projectId, onDocumentUploaded }: DocumentManagementProps) {
  const { user } = useAuth()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (mimeType: string) => {
    if (mimeType.includes('pdf')) return '📄'
    if (mimeType.includes('word')) return '📝'
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊'
    if (mimeType.includes('image')) return '🖼️'
    return '📄'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!user) return

    setUploading(true)
    setUploadProgress(0)

    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `compliance-documents/${projectId}/${fileName}`

        // Upload file to Supabase Storage
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          throw uploadError
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath)

        // Save document metadata to database
        const { error: dbError } = await supabase
          .from('compliance_documents')
          .insert({
            project_id: projectId,
            document_name: file.name,
            document_type: fileExt || 'unknown',
            file_url: publicUrl,
            file_size: file.size,
            mime_type: file.type,
            uploaded_by: user.id,
            status: 'active'
          })

        if (dbError) {
          throw dbError
        }

        setUploadProgress(100)
      }

      onDocumentUploaded()
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file. Please try again.')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }, [user, projectId, onDocumentUploaded])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading
  })

  const handleDelete = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      const { error } = await supabase
        .from('compliance_documents')
        .delete()
        .eq('id', documentId)

      if (error) throw error

      onDocumentUploaded()
    } catch (error) {
      console.error('Error deleting document:', error)
      alert('Error deleting document. Please try again.')
    }
  }

  const handleDownload = (document: ComplianceDocument) => {
    window.open(document.file_url, '_blank')
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Management</h3>
      
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-400 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        } ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        {uploading ? (
          <div className="space-y-2">
            <LoadingSpinner />
            <p className="text-sm text-gray-600">Uploading... {uploadProgress}%</p>
          </div>
        ) : (
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Or click to select files (PDF, Word, Excel, Images up to 10MB)
            </p>
          </div>
        )}
      </div>

      {/* Documents List */}
      <div className="mt-8">
        <h4 className="text-md font-medium text-gray-900 mb-4">Recent Documents</h4>
        
        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <FileText className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p>No documents uploaded yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.slice(0, 10).map((document) => (
              <div
                key={document.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">
                    {getFileIcon(document.mime_type)}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">
                      {document.document_name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(document.file_size)} • Uploaded: {formatDate(document.created_at)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDownload(document)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(document.file_url, '_blank')}
                    className="text-green-600 hover:text-green-700"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(document.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}