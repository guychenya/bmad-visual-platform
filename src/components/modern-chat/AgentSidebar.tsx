import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  Settings, 
  History,
  Bookmark,
  Trash2,
  Search
} from 'lucide-react';

interface AgentSidebarProps {
  agents: Array<{
    id: string;
    name: string;
    title: string;
    icon: React.ReactNode;
    gradient: string;
    description: string;
    specialties: string[];
    isOnline: boolean;
  }>;
  selectedAgent: any;
  onAgentSelect: (agent: any) => void;
  conversations: Array<{
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
    agentId: string;
  }>;
  onNewConversation: () => void;
  onConversationSelect: (id: string) => void;
}

export const AgentSidebar: React.FC<AgentSidebarProps> = ({
  agents,
  selectedAgent,
  onAgentSelect,
  conversations,
  onNewConversation,
  onConversationSelect
}) => {
  return (
    <div className="w-80 bg-gray-900 border-r border-gray-700/50 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">BMad Framework</h2>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          onClick={onNewConversation}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Conversation
        </Button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-700/50">
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Agents */}
      <div className="p-4 border-b border-gray-700/50">
        <h3 className="text-sm font-medium text-gray-400 mb-3">Available Agents</h3>
        <div className="space-y-2">
          {agents.slice(0, 3).map((agent) => (
            <Card 
              key={agent.id}
              className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                selectedAgent?.id === agent.id 
                  ? 'bg-blue-600/20 border-blue-500' 
                  : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
              }`}
              onClick={() => onAgentSelect(agent)}
            >
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full ${agent.gradient} flex items-center justify-center text-white relative`}>
                    {agent.icon}
                    {agent.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-gray-900"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate">{agent.name}</h4>
                    <p className="text-xs text-gray-400 truncate">{agent.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full text-gray-400 hover:text-white hover:bg-gray-800 mt-2"
          >
            View All Agents ({agents.length})
          </Button>
        </div>
      </div>

      {/* Recent Conversations */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-400">Recent</h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <History className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="space-y-2">
          {conversations.map((conversation) => (
            <Card 
              key={conversation.id}
              className="cursor-pointer bg-gray-800/30 border-gray-700/50 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-200"
              onClick={() => onConversationSelect(conversation.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white text-sm truncate mb-1">
                      {conversation.title}
                    </h4>
                    <p className="text-xs text-gray-400 truncate">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center mt-2">
                      <div className={`w-4 h-4 rounded-full ${agents.find(a => a.id === conversation.agentId)?.gradient} flex items-center justify-center mr-2`}>
                        {agents.find(a => a.id === conversation.agentId)?.icon}
                      </div>
                      <span className="text-xs text-gray-500">
                        {conversation.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-white h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Bookmark className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-500 hover:text-red-400 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>BMad Framework v4.27.0</span>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>All systems operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};