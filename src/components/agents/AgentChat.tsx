'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import { Send, Loader2, Users, ChevronDown } from 'lucide-react'
import { AgentPersonality, AGENT_PERSONALITIES, Message } from '../../types/agents'
import { MessageList } from './MessageList'
import { AgentSwitcher } from './AgentSwitcher'

interface AgentChatProps {
  agentId: string
  projectId: string
  onAgentSwitch: (agentId: string) => void
}

export function AgentChat({ agentId, projectId, onAgentSwitch }: AgentChatProps) {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  const agent = AGENT_PERSONALITIES[agentId]

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add greeting message when agent changes
    const greetingMessage: Message = {
      id: `greeting-${agentId}`,
      role: 'assistant',
      content: agent.greeting,
      timestamp: new Date().toISOString()
    }
    setMessages([greetingMessage])
  }, [agentId, agent.greeting])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: message.trim(),
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setIsTyping(true)
    setIsLoading(true)

    try {
      // Simulate AI response (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
      
      const responses = [
        "That's an interesting point! Let me think about that from my perspective as a " + agent.title + ".",
        "I understand what you're looking for. Based on my expertise in " + agent.personality.expertise[0] + ", here's what I recommend...",
        "Great question! As someone who specializes in " + agent.personality.expertise.join(', ') + ", I can help you with that.",
        "I love this challenge! Let me break this down using my " + agent.personality.style + " approach.",
        "This is exactly the kind of problem I excel at solving. Here's my take..."
      ]
      
      const agentMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, agentMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsTyping(false)
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col h-full"
      style={{ '--agent-primary': agent.color.primary } as React.CSSProperties}
    >
      {/* Agent Header */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback 
                    style={{ backgroundColor: agent.color.secondary }}
                    className="text-white font-semibold"
                  >
                    {agent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isTyping && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"
                  />
                )}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-lg">{agent.name}</h3>
                  <Badge 
                    variant="secondary" 
                    style={{ 
                      backgroundColor: agent.color.secondary,
                      color: agent.color.accent
                    }}
                  >
                    {agent.title}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {isTyping ? 'typing...' : agent.description}
                </p>
              </div>
            </div>

            <AgentSwitcher 
              currentAgent={agent} 
              onAgentSwitch={onAgentSwitch}
            />
          </div>

          {/* Agent Expertise Tags */}
          <div className="mt-3 flex flex-wrap gap-2">
            {agent.personality.expertise.map((skill) => (
              <Badge 
                key={skill} 
                variant="outline" 
                className="text-xs"
                style={{ borderColor: agent.color.primary }}
              >
                {skill}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          <MessageList 
            messages={messages}
            agent={agent}
            isTyping={isTyping}
          />
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Message Input */}
        <div className="p-4 border-t bg-muted/50">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Message ${agent.name}...`}
              disabled={isLoading}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={isLoading || !message.trim()}
              style={{ backgroundColor: agent.color.primary }}
              className="text-white hover:opacity-90"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </Card>
    </motion.div>
  )
}