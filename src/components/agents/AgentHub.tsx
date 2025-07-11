'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus, Settings, Activity, Users } from 'lucide-react'

export function AgentHub() {
  const [agents] = useState([
    {
      id: 1,
      name: 'Code Assistant',
      description: 'Helps with coding tasks and debugging',
      status: 'active',
      lastUsed: '2 hours ago'
    },
    {
      id: 2,
      name: 'Data Analyst',
      description: 'Analyzes data and generates insights',
      status: 'idle',
      lastUsed: '1 day ago'
    },
    {
      id: 3,
      name: 'Content Writer',
      description: 'Creates and edits written content',
      status: 'active',
      lastUsed: '30 minutes ago'
    }
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Agent Hub</h1>
          <p className="text-gray-600 mt-2">
            Manage and deploy your AI agents
          </p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create Agent</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card key={agent.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{agent.name}</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${
                    agent.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                  }`} />
                  <span className="text-sm text-gray-500 capitalize">
                    {agent.status}
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{agent.description}</p>
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Last used: {agent.lastUsed}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Configure
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Activity className="h-4 w-4 mr-2" />
                  Monitor
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5" />
            <span>Quick Stats</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-600">Active Agents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">127</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}