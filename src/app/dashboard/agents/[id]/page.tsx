'use client'

import { AgentChat } from '../../../../components/agents/AgentChat'
import { useParams } from 'next/navigation'

export default function AgentChatPage() {
  const params = useParams()
  const agentId = params.id as string

  return (
    <div className="h-[calc(100vh-120px)]">
      <AgentChat agentId={agentId} />
    </div>
  )
}