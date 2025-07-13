'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { MessageSquare, Star } from 'lucide-react'
import { AgentPersonality } from '../../types/agents'

interface AgentCardProps {
  agent: AgentPersonality
  onStartChat: (agentId: string) => void
  className?: string
}

export function AgentCard({ agent, onStartChat, className }: AgentCardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onStartChat(agent.id)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <Card 
        role="button"
        tabIndex={0}
        aria-label={`Chat with ${agent.name}, ${agent.title}. Rating: 4.9 stars. Expertise: ${agent.personality.expertise.slice(0, 3).join(', ')}`}
        className="h-full hover:shadow-lg transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        style={{ borderColor: agent.color.secondary }}
        onClick={() => onStartChat(agent.id)}
        onKeyDown={handleKeyDown}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback 
                style={{ backgroundColor: agent.color.secondary }}
                className="text-white font-semibold"
              >
                {agent.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <CardTitle className="text-lg">{agent.name}</CardTitle>
              <CardDescription className="text-sm">
                {agent.title}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            {agent.description}
          </p>
          
          <div className="flex flex-wrap gap-2">
            {agent.personality.expertise.slice(0, 3).map((skill) => (
              <Badge 
                key={skill}
                variant="secondary"
                className="text-xs"
                style={{ 
                  backgroundColor: agent.color.secondary,
                  color: agent.color.accent
                }}
              >
                {skill}
              </Badge>
            ))}
          </div>
          
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground" aria-label="Rating">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
              <span>4.9 stars</span>
            </div>
            
            <Button 
              onClick={(e) => {
                e.stopPropagation()
                onStartChat(agent.id)
              }}
              style={{ backgroundColor: agent.color.primary }}
              className="text-white hover:opacity-90 focus:ring-2 focus:ring-offset-2"
              aria-label={`Start chat with ${agent.name}`}
            >
              <MessageSquare className="h-4 w-4 mr-2" aria-hidden="true" />
              Chat
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}