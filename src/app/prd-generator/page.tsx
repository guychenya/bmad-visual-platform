'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  CheckCircle, 
  Clock, 
  User, 
  Settings, 
  Code, 
  FileText,
  Download,
  ArrowRight,
  Brain,
  Target,
  Layers,
  TestTube,
  Sparkles
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  role: string;
  icon: React.ComponentType<any>;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  output?: string;
  color: string;
}

interface WorkflowStep {
  id: string;
  title: string;
  description: string;
  agents: string[];
  dependencies: string[];
  status: 'pending' | 'in_progress' | 'completed';
  duration: string;
}

const AGENTS: Agent[] = [
  {
    id: 'business_analyst',
    name: 'Business Analyst',
    role: 'Requirements Analysis',
    icon: Target,
    description: 'Analyzes business needs and creates user stories',
    status: 'pending',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'product_manager',
    name: 'Product Manager',
    role: 'Product Strategy',
    icon: User,
    description: 'Defines product vision and roadmap',
    status: 'pending',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'architect',
    name: 'System Architect',
    role: 'Technical Design',
    icon: Layers,
    description: 'Designs system architecture and tech stack',
    status: 'pending',
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'ux_designer',
    name: 'UX Designer',
    role: 'User Experience',
    icon: Sparkles,
    description: 'Creates user flows and wireframes',
    status: 'pending',
    color: 'from-pink-500 to-pink-600'
  },
  {
    id: 'qa_engineer',
    name: 'QA Engineer',
    role: 'Quality Assurance',
    icon: TestTube,
    description: 'Defines testing strategy and acceptance criteria',
    status: 'pending',
    color: 'from-orange-500 to-orange-600'
  },
  {
    id: 'developer',
    name: 'Lead Developer',
    role: 'Technical Implementation',
    icon: Code,
    description: 'Provides technical implementation guidance',
    status: 'pending',
    color: 'from-cyan-500 to-cyan-600'
  }
];

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    id: 'discovery',
    title: 'Discovery & Analysis',
    description: 'Understand business requirements and user needs',
    agents: ['business_analyst', 'product_manager'],
    dependencies: [],
    status: 'pending',
    duration: '2-3 min'
  },
  {
    id: 'design',
    title: 'Design & Architecture',
    description: 'Create system design and user experience',
    agents: ['architect', 'ux_designer'],
    dependencies: ['discovery'],
    status: 'pending',
    duration: '3-4 min'
  },
  {
    id: 'implementation',
    title: 'Implementation Planning',
    description: 'Define technical approach and development plan',
    agents: ['developer'],
    dependencies: ['design'],
    status: 'pending',
    duration: '2-3 min'
  },
  {
    id: 'quality',
    title: 'Quality Assurance',
    description: 'Define testing strategy and acceptance criteria',
    agents: ['qa_engineer'],
    dependencies: ['implementation'],
    status: 'pending',
    duration: '1-2 min'
  }
];

export default function PRDGeneratorPage() {
  const [agents, setAgents] = useState<Agent[]>(AGENTS);
  const [workflowSteps, setWorkflowSteps] = useState<WorkflowStep[]>(WORKFLOW_STEPS);
  const [currentStep, setCurrentStep] = useState<string | null>(null);
  const [projectInput, setProjectInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [prdOutput, setPrdOutput] = useState<string>('');
  const [progress, setProgress] = useState(0);

  const handleStartGeneration = async () => {
    if (!projectInput.trim()) return;
    
    setIsGenerating(true);
    setProgress(0);
    
    // Reset all agents and steps
    setAgents(prev => prev.map(agent => ({ ...agent, status: 'pending', output: undefined })));
    setWorkflowSteps(prev => prev.map(step => ({ ...step, status: 'pending' })));
    
    // Process each workflow step
    for (let i = 0; i < workflowSteps.length; i++) {
      const step = workflowSteps[i];
      setCurrentStep(step.id);
      
      // Update step status
      setWorkflowSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'in_progress' } : s
      ));
      
      // Process agents in this step
      for (const agentId of step.agents) {
        setAgents(prev => prev.map(agent => 
          agent.id === agentId ? { ...agent, status: 'in_progress' } : agent
        ));
        
        // Simulate API call to generate content
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Generate agent output
        const agentOutput = await generateAgentOutput(agentId, projectInput);
        
        setAgents(prev => prev.map(agent => 
          agent.id === agentId ? { ...agent, status: 'completed', output: agentOutput } : agent
        ));
      }
      
      // Complete step
      setWorkflowSteps(prev => prev.map(s => 
        s.id === step.id ? { ...s, status: 'completed' } : s
      ));
      
      setProgress(((i + 1) / workflowSteps.length) * 100);
    }
    
    // Generate final PRD
    await generateFinalPRD();
    
    setCurrentStep(null);
    setIsGenerating(false);
  };

  const generateAgentOutput = async (agentId: string, input: string): Promise<string> => {
    // This would call your API service
    const prompts = {
      business_analyst: `As a Business Analyst, analyze this project: "${input}". Provide business requirements, user stories, and success metrics.`,
      product_manager: `As a Product Manager, define the product strategy for: "${input}". Include vision, goals, and feature priorities.`,
      architect: `As a System Architect, design the technical architecture for: "${input}". Include tech stack, system components, and scalability considerations.`,
      ux_designer: `As a UX Designer, create user experience guidelines for: "${input}". Include user flows, wireframe concepts, and design principles.`,
      qa_engineer: `As a QA Engineer, define the testing strategy for: "${input}". Include test cases, acceptance criteria, and quality metrics.`,
      developer: `As a Lead Developer, provide implementation guidance for: "${input}". Include development approach, technical considerations, and deployment strategy.`
    };

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          provider: 'groq', // Use Groq for faster responses
          model: 'llama3-8b-8192',
          message: prompts[agentId as keyof typeof prompts],
          history: []
        })
      });

      const data = await response.json();
      return data.response || `Generated output for ${agentId}`;
    } catch (error) {
      return `Demo output for ${agentId} - This would contain detailed analysis and recommendations.`;
    }
  };

  const generateFinalPRD = async () => {
    const allOutputs = agents.map(agent => `## ${agent.name}\n${agent.output || 'No output'}`).join('\n\n');
    
    const prdTemplate = `# Product Requirements Document (PRD)

## Project Overview
**Project Name:** ${projectInput}
**Generated:** ${new Date().toISOString().split('T')[0]}
**Status:** Draft

## Executive Summary
This PRD outlines the requirements for developing "${projectInput}" as analyzed by our AI agent team.

${allOutputs}

## Implementation Roadmap
1. **Phase 1:** Core functionality development
2. **Phase 2:** Feature enhancement and optimization
3. **Phase 3:** Scaling and advanced features

## Technical Specifications
- **Architecture:** Modern web application
- **Performance:** Sub-2 second load times
- **Security:** Enterprise-grade security measures
- **Scalability:** Designed for 10x growth

## Quality Assurance
- **Testing Strategy:** Comprehensive automated testing
- **Acceptance Criteria:** Detailed user acceptance tests
- **Performance Metrics:** Key performance indicators

## Next Steps
This PRD is ready for implementation using tools like:
- v0.dev for rapid prototyping
- Bolt.new for full-stack development
- Lovable for AI-powered development
- Cursor for AI-assisted coding

---
*Generated by BMad AI Agent Framework*`;

    setPrdOutput(prdTemplate);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'in_progress': return 'text-yellow-400';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-400" />;
      case 'in_progress': return <Clock className="h-4 w-4 text-yellow-400 animate-spin" />;
      case 'pending': return <Clock className="h-4 w-4 text-gray-400" />;
      default: return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const downloadPRD = () => {
    const element = document.createElement('a');
    const file = new Blob([prdOutput], { type: 'text/markdown' });
    element.href = URL.createObjectURL(file);
    element.download = `PRD-${projectInput.replace(/[^a-zA-Z0-9]/g, '-')}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6 bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-white">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                <Brain className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">BMad PRD Generator</h1>
                <p className="text-sm text-gray-400">AI-Orchestrated Product Requirements Documentation</p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Input Section */}
        <Card className="mb-6 bg-black/40 backdrop-blur-sm border-purple-500/20">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Project Description
                </label>
                <textarea
                  value={projectInput}
                  onChange={(e) => setProjectInput(e.target.value)}
                  placeholder="Describe your project idea... (e.g., 'A social media platform for developers to share code snippets and collaborate on projects')"
                  className="w-full p-4 bg-gray-800 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 h-32 resize-none"
                  disabled={isGenerating}
                />
              </div>
              
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-400">
                  Our AI agents will analyze your project and generate a comprehensive PRD
                </div>
                <Button
                  onClick={handleStartGeneration}
                  disabled={isGenerating || !projectInput.trim()}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-2"
                >
                  {isGenerating ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Generating PRD...
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Generate PRD
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Bar */}
        {isGenerating && (
          <Card className="mb-6 bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white">Generation Progress</span>
                <span className="text-sm text-purple-300">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workflow Steps */}
          <div className="lg:col-span-1">
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Workflow Steps
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {workflowSteps.map((step, index) => (
                  <div 
                    key={step.id} 
                    className={`p-4 rounded-lg border transition-all ${
                      currentStep === step.id 
                        ? 'bg-purple-900/30 border-purple-500/50' 
                        : 'bg-gray-800/30 border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(step.status)}
                        <span className={`font-medium ${getStatusColor(step.status)}`}>
                          {step.title}
                        </span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {step.duration}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{step.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {step.agents.map(agentId => {
                        const agent = agents.find(a => a.id === agentId);
                        return (
                          <Badge 
                            key={agentId} 
                            variant="outline" 
                            className="text-xs border-purple-500/30 text-purple-300"
                          >
                            {agent?.name}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Agents Grid */}
          <div className="lg:col-span-2">
            <Card className="bg-black/40 backdrop-blur-sm border-purple-500/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <User className="h-5 w-5" />
                  AI Agent Team
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {agents.map((agent) => (
                    <div 
                      key={agent.id} 
                      className={`p-4 rounded-lg border transition-all ${
                        agent.status === 'in_progress' 
                          ? 'bg-yellow-900/20 border-yellow-500/50' 
                          : agent.status === 'completed'
                          ? 'bg-green-900/20 border-green-500/50'
                          : 'bg-gray-800/30 border-gray-700/50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 bg-gradient-to-r ${agent.color} rounded-lg`}>
                          <agent.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-white">{agent.name}</h3>
                            {getStatusIcon(agent.status)}
                          </div>
                          <p className="text-sm text-purple-300 mb-2">{agent.role}</p>
                          <p className="text-xs text-gray-400">{agent.description}</p>
                          
                          {agent.output && (
                            <div className="mt-3 p-2 bg-gray-800/50 rounded text-xs text-gray-300">
                              {agent.output.substring(0, 150)}...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* PRD Output */}
        {prdOutput && (
          <Card className="mt-6 bg-black/40 backdrop-blur-sm border-purple-500/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Generated PRD
                </div>
                <Button
                  onClick={downloadPRD}
                  variant="outline"
                  size="sm"
                  className="border-purple-500/30 text-purple-300 hover:bg-purple-500/20"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PRD
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-gray-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
                <pre className="text-sm text-gray-300 whitespace-pre-wrap">
                  {prdOutput}
                </pre>
              </div>
              
              <div className="mt-4 p-4 bg-gradient-to-r from-purple-900/20 to-pink-900/20 rounded-lg border border-purple-500/30">
                <h4 className="text-white font-medium mb-2">Ready for AI Development Tools:</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'v0.dev', description: 'Rapid prototyping' },
                    { name: 'Bolt.new', description: 'Full-stack dev' },
                    { name: 'Lovable', description: 'AI-powered dev' },
                    { name: 'Cursor', description: 'AI-assisted coding' }
                  ].map((tool) => (
                    <div key={tool.name} className="text-center">
                      <div className="text-purple-300 font-medium">{tool.name}</div>
                      <div className="text-xs text-gray-400">{tool.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}