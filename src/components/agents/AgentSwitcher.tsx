'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../ui/button'
import { Card, CardContent } from '../ui/card'
import { ChevronDown, Users } from 'lucide-react'
import { AgentPersonality, AGENT_PERSONALITIES } from '../../types/agents'

interface AgentSwitcherProps {
  currentAgent: AgentPersonality
  onAgentSwitch: (agentId: string) => void
}

export function AgentSwitcher({ currentAgent, onAgentSwitch }: AgentSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false)

  const otherAgents = Object.values(AGENT_PERSONALITIES).filter(
    agent => agent.id !== currentAgent.id
  )

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <Users className="h-4 w-4" />
        <span>Switch Agent</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 z-50"
          >
            <Card className="shadow-lg">
              <CardContent className="p-4">
                <h4 className="font-semibold mb-3">Choose an Agent</h4>
                <div className="space-y-2">
                  {otherAgents.map((agent) => (
                    <motion.div
                      key={agent.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start p-3 h-auto hover:bg-slate-100/5"
                        onClick={() => {
                          onAgentSwitch(agent.id)
                          setIsOpen(false)
                        }}
                      >
                        <div className="h-10 w-10 mr-3 flex items-center justify-center bg-slate-100/10 rounded-lg">
                          <Users className="h-5 w-5 text-slate-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-slate-200">{agent.name}</span>
                          </div>
                          <p className="text-sm text-slate-400 truncate">
                            {agent.title}
                          </p>
                        </div>
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}