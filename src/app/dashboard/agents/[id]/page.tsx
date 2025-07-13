'use client'

import { AgentChat } from '../../../../components/agents/AgentChat'
import { useParams } from 'next/navigation'

export default function AgentChatPage() {
  const params = useParams()
  const agentId = params.id as string

  return (
    <div className="fixed inset-0 z-40">
      <AgentChat agentId={agentId} />
    </div>
  )
}