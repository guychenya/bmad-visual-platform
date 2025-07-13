
import { useState } from 'react';
import { BMAD_AGENTS } from '../../lib/bmad/agents';
import { Button } from '../ui/button';

interface AgentSelectorProps {
  onSelectionChange: (selectedAgentIds: string[]) => void;
}

export function AgentSelector({ onSelectionChange }: AgentSelectorProps) {
  const [selectedAgents, setSelectedAgents] = useState<Set<string>>(new Set());

  const toggleAgentSelection = (agentId: string) => {
    const newSelection = new Set(selectedAgents);
    if (newSelection.has(agentId)) {
      newSelection.delete(agentId);
    } else {
      newSelection.add(agentId);
    }
    setSelectedAgents(newSelection);
    onSelectionChange(Array.from(newSelection));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {BMAD_AGENTS.map(agent => (
        <div 
          key={agent.id} 
          className={`p-4 border rounded-lg cursor-pointer ${
            selectedAgents.has(agent.id) ? 'border-purple-500' : 'border-gray-700'
          }`}
          onClick={() => toggleAgentSelection(agent.id)}
        >
          <h3 className="text-lg font-bold">{agent.name}</h3>
          <p className="text-sm text-gray-400">{agent.role}</p>
        </div>
      ))}
    </div>
  );
}
