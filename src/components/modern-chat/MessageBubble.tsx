import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Copy, 
  MoreHorizontal, 
  User, 
  ThumbsUp, 
  ThumbsDown, 
  RotateCcw,
  Edit3
} from 'lucide-react';

interface MessageBubbleProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp: Date;
    agentId?: string;
    agentName?: string;
    isStreaming?: boolean;
  };
  agent: {
    icon: React.ReactNode;
    gradient: string;
    name: string;
  };
  isTyping?: boolean;
  onCopy?: (text: string) => void;
  onRegenerate?: (messageId: string) => void;
  onEdit?: (messageId: string) => void;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  message,
  agent,
  isTyping,
  onCopy,
  onRegenerate,
  onEdit
}) => {
  const [showActions, setShowActions] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopy = () => {
    if (onCopy) {
      onCopy(message.content);
      // Could add toast notification here
    }
  };

  const handleFeedback = (type: 'up' | 'down') => {
    setFeedback(type);
    // Could send feedback to analytics
  };

  return (
    <div className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] ${message.role === 'user' ? 'order-2' : 'order-1'}`}>
        <div className={`flex items-start space-x-3 ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
          {/* Avatar */}
          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
            message.role === 'user' 
              ? 'bg-blue-500' 
              : agent.gradient
          }`}>
            {message.role === 'user' ? (
              <User className="w-4 h-4 text-white" />
            ) : (
              agent.icon
            )}
          </div>
          
          {/* Message Content */}
          <div 
            className={`group ${message.role === 'user' ? 'text-right' : 'text-left'}`}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
          >
            <div className={`rounded-2xl px-4 py-3 shadow-lg ${
              message.role === 'user'
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                : 'bg-gray-800 text-gray-100 border border-gray-700'
            }`}>
              <div className="text-sm leading-relaxed">
                {message.content.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    {index < message.content.split('\n').length - 1 && <br />}
                  </React.Fragment>
                ))}
                {message.isStreaming && isTyping && (
                  <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse rounded-sm"></span>
                )}
              </div>
            </div>
            
            {/* Message Actions */}
            <div className={`flex items-center space-x-1 mt-2 transition-opacity duration-200 ${
              showActions ? 'opacity-100' : 'opacity-0'
            } ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="text-gray-500 hover:text-gray-300 h-6 px-2 hover:bg-gray-700/50"
              >
                <Copy className="w-3 h-3" />
              </Button>
              
              {message.role === 'assistant' && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRegenerate?.(message.id)}
                    className="text-gray-500 hover:text-gray-300 h-6 px-2 hover:bg-gray-700/50"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback('up')}
                    className={`h-6 px-2 hover:bg-gray-700/50 ${
                      feedback === 'up' ? 'text-green-400' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <ThumbsUp className="w-3 h-3" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFeedback('down')}
                    className={`h-6 px-2 hover:bg-gray-700/50 ${
                      feedback === 'down' ? 'text-red-400' : 'text-gray-500 hover:text-gray-300'
                    }`}
                  >
                    <ThumbsDown className="w-3 h-3" />
                  </Button>
                </>
              )}
              
              {message.role === 'user' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit?.(message.id)}
                  className="text-gray-500 hover:text-gray-300 h-6 px-2 hover:bg-gray-700/50"
                >
                  <Edit3 className="w-3 h-3" />
                </Button>
              )}
              
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-500 hover:text-gray-300 h-6 px-2 hover:bg-gray-700/50"
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
              
              <span className="text-xs text-gray-500 ml-2">
                {formatTime(message.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};