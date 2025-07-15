import * as React from "react"
import { MessageSquare, Clock, User } from "lucide-react"
import { AccordionPanel, PanelTable, ColumnConfig } from "../ui/accordion-panel"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"

interface ChatLog {
  id: string
  timestamp: string
  user: string
  message: string
  type: "user" | "assistant" | "system"
  status: "sent" | "delivered" | "read"
}

interface ChatLogsPanelProps {
  logs?: ChatLog[]
  onLogClick?: (log: ChatLog) => void
  className?: string
}

const ChatLogsPanel = React.forwardRef<HTMLDivElement, ChatLogsPanelProps>(
  ({ logs = [], onLogClick, className }, ref) => {
    const [columns, setColumns] = React.useState<ColumnConfig[]>([
      { id: "timestamp", label: "Time", visible: true },
      { id: "user", label: "User", visible: true },
      { id: "message", label: "Message", visible: true },
      { id: "type", label: "Type", visible: true },
      { id: "status", label: "Status", visible: false }
    ])

    // Mock data for demo
    const mockLogs: ChatLog[] = [
      {
        id: "1",
        timestamp: "2024-01-15 10:30:25",
        user: "john.doe@example.com",
        message: "How can I create a new project?",
        type: "user",
        status: "read"
      },
      {
        id: "2",
        timestamp: "2024-01-15 10:30:26",
        user: "AI Assistant",
        message: "I can help you create a new project. Let me guide you through the process...",
        type: "assistant",
        status: "delivered"
      },
      {
        id: "3",
        timestamp: "2024-01-15 10:28:15",
        user: "jane.smith@example.com",
        message: "What are the available templates?",
        type: "user",
        status: "read"
      },
      {
        id: "4",
        timestamp: "2024-01-15 10:28:16",
        user: "AI Assistant",
        message: "Here are the available templates: Web Development, Mobile App, Data Analysis...",
        type: "assistant",
        status: "read"
      },
      {
        id: "5",
        timestamp: "2024-01-15 10:25:42",
        user: "System",
        message: "User john.doe@example.com joined the session",
        type: "system",
        status: "sent"
      }
    ]

    const displayLogs = logs.length > 0 ? logs : mockLogs

    const handleColumnToggle = (columnId: string) => {
      setColumns(prev => 
        prev.map(col => 
          col.id === columnId ? { ...col, visible: !col.visible } : col
        )
      )
    }

    const formatMessage = (message: string, maxLength: number = 100) => {
      return message.length > maxLength 
        ? `${message.substring(0, maxLength)}...`
        : message
    }

    const getTypeIcon = (type: string) => {
      switch (type) {
        case "user":
          return <User className="h-3 w-3" />
        case "assistant":
          return <MessageSquare className="h-3 w-3" />
        case "system":
          return <Clock className="h-3 w-3" />
        default:
          return null
      }
    }

    const getStatusBadge = (status: string) => {
      const variants = {
        sent: "secondary",
        delivered: "outline",
        read: "default"
      } as const

      return (
        <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
          {status}
        </Badge>
      )
    }

    const tableData = displayLogs.map(log => ({
      timestamp: (
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span className="font-mono text-xs">{log.timestamp}</span>
        </div>
      ),
      user: (
        <div className="flex items-center space-x-2">
          <User className="h-3 w-3 text-muted-foreground" />
          <span className="truncate max-w-[120px]">{log.user}</span>
        </div>
      ),
      message: (
        <div 
          className="cursor-pointer hover:text-primary transition-colors"
          onClick={() => onLogClick?.(log)}
        >
          <span className="block truncate max-w-[300px]" title={log.message}>
            {formatMessage(log.message)}
          </span>
        </div>
      ),
      type: (
        <div className="flex items-center space-x-2">
          {getTypeIcon(log.type)}
          <span className="capitalize">{log.type}</span>
        </div>
      ),
      status: getStatusBadge(log.status)
    }))

    return (
      <AccordionPanel
        ref={ref}
        columns={columns}
        onColumnToggle={handleColumnToggle}
        className={cn("min-h-[200px]", className)}
      >
        <PanelTable columns={columns} data={tableData} />
        {displayLogs.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-8 w-8 mx-auto mb-2" />
              <p>No chat logs available</p>
            </div>
          </div>
        )}
      </AccordionPanel>
    )
  }
)
ChatLogsPanel.displayName = "ChatLogsPanel"

export { ChatLogsPanel }
export type { ChatLog }