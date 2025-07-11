'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Card, CardContent } from '../ui/card'
import { AgentPersonality, Message } from '../../types/agents'
import { TypingIndicator } from './TypingIndicator'
import { formatTimeAgo } from '../../lib/utils'

interface MessageListProps {
  messages: Message[]
  agent: AgentPersonality
  isTyping: boolean
}

export function MessageList({ messages, agent, isTyping }: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
      <AnimatePresence>
        {messages.map((message, index) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`flex space-x-2 max-w-[80%] ${
                message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              {message.role === 'assistant' && (
                <Avatar className="h-8 w-8 mt-1">
                  <AvatarImage src={agent.avatar} alt={agent.name} />
                  <AvatarFallback 
                    style={{ backgroundColor: agent.color.secondary }}
                    className="text-white font-semibold"
                  >
                    {agent.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className="flex flex-col">
                <Card 
                  className={`${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted'
                  }`}
                >
                  <CardContent className="p-3">
                    <div className="whitespace-pre-wrap text-sm">
                      {message.content}
                    </div>
                  </CardContent>
                </Card>
                
                <div 
                  className={`text-xs text-muted-foreground mt-1 ${
                    message.role === 'user' ? 'text-right' : 'text-left'
                  }`}
                >
                  {formatTimeAgo(message.timestamp)}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {isTyping && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-start"
        >
          <div className="flex space-x-2">
            <Avatar className="h-8 w-8 mt-1">
              <AvatarImage src={agent.avatar} alt={agent.name} />
              <AvatarFallback 
                style={{ backgroundColor: agent.color.secondary }}
                className="text-white font-semibold"
              >
                {agent.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <Card className="bg-muted">
              <CardContent className="p-3">
                <TypingIndicator />
              </CardContent>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  )
}