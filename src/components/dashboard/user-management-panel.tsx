import * as React from "react"
import { Users, Mail, Shield, MoreHorizontal } from "lucide-react"
import { AccordionPanel, PanelTable, ColumnConfig } from "../ui/accordion-panel"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Avatar } from "../ui/avatar"
import { cn } from "../../lib/utils"

interface User {
  id: string
  name: string
  email: string
  role: "admin" | "moderator" | "user"
  status: "active" | "inactive" | "pending"
  lastActive: string
  avatar?: string
}

interface UserManagementPanelProps {
  users?: User[]
  onUserClick?: (user: User) => void
  onUserAction?: (userId: string, action: string) => void
  className?: string
}

const UserManagementPanel = React.forwardRef<HTMLDivElement, UserManagementPanelProps>(
  ({ users = [], onUserClick, onUserAction, className }, ref) => {
    const [columns, setColumns] = React.useState<ColumnConfig[]>([
      { id: "user", label: "User", visible: true },
      { id: "email", label: "Email", visible: true },
      { id: "role", label: "Role", visible: true },
      { id: "status", label: "Status", visible: true },
      { id: "lastActive", label: "Last Active", visible: false },
      { id: "actions", label: "Actions", visible: true }
    ])

    // Mock data for demo
    const mockUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "john.doe@example.com",
        role: "admin",
        status: "active",
        lastActive: "2024-01-15 10:30:25",
        avatar: "/avatars/john.jpg"
      },
      {
        id: "2",
        name: "Jane Smith",
        email: "jane.smith@example.com",
        role: "moderator",
        status: "active",
        lastActive: "2024-01-15 09:45:12",
        avatar: "/avatars/jane.jpg"
      },
      {
        id: "3",
        name: "Bob Johnson",
        email: "bob.johnson@example.com",
        role: "user",
        status: "inactive",
        lastActive: "2024-01-14 16:20:00"
      },
      {
        id: "4",
        name: "Alice Brown",
        email: "alice.brown@example.com",
        role: "user",
        status: "pending",
        lastActive: "2024-01-15 08:15:33"
      },
      {
        id: "5",
        name: "Charlie Wilson",
        email: "charlie.wilson@example.com",
        role: "moderator",
        status: "active",
        lastActive: "2024-01-15 10:15:00"
      }
    ]

    const displayUsers = users.length > 0 ? users : mockUsers

    const handleColumnToggle = (columnId: string) => {
      setColumns(prev => 
        prev.map(col => 
          col.id === columnId ? { ...col, visible: !col.visible } : col
        )
      )
    }

    const getRoleBadge = (role: string) => {
      const variants = {
        admin: "destructive",
        moderator: "default",
        user: "secondary"
      } as const

      const icons = {
        admin: <Shield className="h-3 w-3" />,
        moderator: <Users className="h-3 w-3" />,
        user: <Mail className="h-3 w-3" />
      }

      return (
        <Badge variant={variants[role as keyof typeof variants] || "secondary"}>
          <div className="flex items-center space-x-1">
            {icons[role as keyof typeof icons]}
            <span className="capitalize">{role}</span>
          </div>
        </Badge>
      )
    }

    const getStatusBadge = (status: string) => {
      const variants = {
        active: "default",
        inactive: "secondary",
        pending: "outline"
      } as const

      const colors = {
        active: "text-green-600",
        inactive: "text-gray-600",
        pending: "text-yellow-600"
      }

      return (
        <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
          <div className="flex items-center space-x-1">
            <div className={cn("h-2 w-2 rounded-full", colors[status as keyof typeof colors])} />
            <span className="capitalize">{status}</span>
          </div>
        </Badge>
      )
    }

    const formatLastActive = (timestamp: string) => {
      const date = new Date(timestamp)
      const now = new Date()
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

      if (diffInMinutes < 60) {
        return `${diffInMinutes}m ago`
      } else if (diffInMinutes < 1440) {
        return `${Math.floor(diffInMinutes / 60)}h ago`
      } else {
        return `${Math.floor(diffInMinutes / 1440)}d ago`
      }
    }

    const tableData = displayUsers.map(user => ({
      user: (
        <div 
          className="flex items-center space-x-3 cursor-pointer hover:text-primary transition-colors"
          onClick={() => onUserClick?.(user)}
        >
          <Avatar className="h-8 w-8">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-primary text-primary-foreground text-sm font-medium">
                {user.name.charAt(0).toUpperCase()}
              </div>
            )}
          </Avatar>
          <div>
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground">ID: {user.id}</div>
          </div>
        </div>
      ),
      email: (
        <div className="flex items-center space-x-2">
          <Mail className="h-3 w-3 text-muted-foreground" />
          <span className="truncate max-w-[200px]">{user.email}</span>
        </div>
      ),
      role: getRoleBadge(user.role),
      status: getStatusBadge(user.status),
      lastActive: (
        <span className="text-sm text-muted-foreground">
          {formatLastActive(user.lastActive)}
        </span>
      ),
      actions: (
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onUserAction?.(user.id, "edit")}
            className="h-8 w-8 p-0"
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      )
    }))

    return (
      <AccordionPanel
        ref={ref}
        columns={columns}
        onColumnToggle={handleColumnToggle}
        className={cn("min-h-[200px]", className)}
      >
        <PanelTable columns={columns} data={tableData} />
        {displayUsers.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p>No users found</p>
            </div>
          </div>
        )}
      </AccordionPanel>
    )
  }
)
UserManagementPanel.displayName = "UserManagementPanel"

export { UserManagementPanel }
export type { User }