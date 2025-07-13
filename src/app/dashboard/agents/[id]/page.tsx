'use client'

import { AgentChat } from '../../../../components/agents/AgentChat'
import { useParams } from 'next/navigation'

export default function AgentChatPage() {
  const params = useParams()
  const agentId = params.id as string

  if (!agentId) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-slate-400">Loading agent...</p>
      </div>
    )
  }

  return (
    <div className="h-[calc(100vh-120px)] -mx-4 -my-8 bg-slate-900">
      <AgentChat agentId={agentId} />
    </div>
  )
}