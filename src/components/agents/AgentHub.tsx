'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AGENT_PERSONALITIES } from '@/types/agents'
import { AgentCard } from './AgentCard'
import { AgentChat } from './AgentChat'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Users } from 'lucide-react'

interface AgentHubProps {
  projectId?: string
}

export function AgentHub({ projectId }: AgentHubProps) {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null)
  
  const agents = Object.values(AGENT_PERSONALITIES)

  const handleStartChat = (agentId: string) => {
    setSelectedAgent(agentId)
  }

  const handleBackToHub = () => {
    setSelectedAgent(null)
  }

  if (selectedAgent) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center space-x-4 p-4 border-b">
          <Button 
            variant="outline" 
            onClick={handleBackToHub}
            className="flex items-center space-x-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Hub</span>
          </Button>
        </div>
        
        <div className="flex-1">
          <AgentChat 
            agentId={selectedAgent} 
            projectId={projectId || 'demo'} 
            onAgentSwitch={setSelectedAgent}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <Users className="h-8 w-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900">Agent Hub</h1>
        </div>
        <p className="text-lg text-gray-600">
          Meet your AI development team. Each agent specializes in different aspects of the BMad Method.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AgentCard 
              agent={agent}
              onStartChat={handleStartChat}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}