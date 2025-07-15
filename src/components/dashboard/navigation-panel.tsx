import * as React from "react"
import { Navigation, Home, Users, Settings, FolderOpen, Workflow, FileText, Building, ArrowRight } from "lucide-react"
import { AccordionPanel, PanelList } from "../ui/accordion-panel"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"

interface NavigationLink {
  id: string
  title: string
  description: string
  path: string
  icon: React.ReactNode
  category: "main" | "workspace" | "management" | "tools"
  isActive?: boolean
  badge?: string
}

interface NavigationPanelProps {
  links?: NavigationLink[]
  currentPath?: string
  onNavigate?: (path: string) => void
  className?: string
}

const NavigationPanel = React.forwardRef<HTMLDivElement, NavigationPanelProps>(
  ({ links = [], currentPath, onNavigate, className }, ref) => {
    // Mock data for demo
    const mockLinks: NavigationLink[] = [
      {
        id: "dashboard",
        title: "Dashboard",
        description: "Main dashboard overview",
        path: "/dashboard",
        icon: <Home className="h-4 w-4" />,
        category: "main"
      },
      {
        id: "chat",
        title: "Chat Interface",
        description: "AI chat and conversation",
        path: "/chat",
        icon: <Navigation className="h-4 w-4" />,
        category: "main"
      },
      {
        id: "workspace",
        title: "Workspace",
        description: "Collaborative workspace",
        path: "/dashboard/workspace",
        icon: <FolderOpen className="h-4 w-4" />,
        category: "workspace"
      },
      {
        id: "simple-workspace",
        title: "Simple Workspace",
        description: "Streamlined workspace view",
        path: "/dashboard/workspace/simple",
        icon: <FolderOpen className="h-4 w-4" />,
        category: "workspace"
      },
      {
        id: "workflow",
        title: "Workflow",
        description: "Process automation",
        path: "/dashboard/workflow",
        icon: <Workflow className="h-4 w-4" />,
        category: "tools"
      },
      {
        id: "hierarchy",
        title: "Hierarchy",
        description: "Organization structure",
        path: "/dashboard/hierarchy",
        icon: <Building className="h-4 w-4" />,
        category: "management"
      },
      {
        id: "hierarchy-workflow",
        title: "Hierarchy Workflow",
        description: "Workflow organization view",
        path: "/dashboard/hierarchy/workflow",
        icon: <Workflow className="h-4 w-4" />,
        category: "management"
      },
      {
        id: "projects",
        title: "Projects",
        description: "Project management",
        path: "/dashboard/projects",
        icon: <FolderOpen className="h-4 w-4" />,
        category: "workspace"
      },
      {
        id: "create-project",
        title: "Create Project",
        description: "Start a new project",
        path: "/dashboard/create",
        icon: <FolderOpen className="h-4 w-4" />,
        category: "workspace",
        badge: "New"
      },
      {
        id: "agents",
        title: "Agents",
        description: "AI agent management",
        path: "/dashboard/agents",
        icon: <Users className="h-4 w-4" />,
        category: "management"
      },
      {
        id: "templates",
        title: "Templates",
        description: "Project templates",
        path: "/dashboard/templates",
        icon: <FileText className="h-4 w-4" />,
        category: "tools"
      },
      {
        id: "organizations",
        title: "Organizations",
        description: "Organization management",
        path: "/dashboard/organizations",
        icon: <Building className="h-4 w-4" />,
        category: "management"
      },
      {
        id: "settings",
        title: "Settings",
        description: "System configuration",
        path: "/dashboard/settings",
        icon: <Settings className="h-4 w-4" />,
        category: "main"
      }
    ]

    const displayLinks = links.length > 0 ? links : mockLinks

    // Mark active link based on current path
    const linksWithActive = displayLinks.map(link => ({
      ...link,
      isActive: currentPath === link.path
    }))

    const getCategoryBadge = (category: string) => {
      const variants = {
        main: "default",
        workspace: "secondary",
        management: "outline",
        tools: "secondary"
      } as const

      const labels = {
        main: "Main",
        workspace: "Workspace",
        management: "Management",
        tools: "Tools"
      }

      return (
        <Badge variant={variants[category as keyof typeof variants] || "secondary"}>
          {labels[category as keyof typeof labels] || category}
        </Badge>
      )
    }

    const handleNavigate = (path: string) => {
      if (onNavigate) {
        onNavigate(path)
      } else {
        window.location.href = path
      }
    }

    const linkItems = linksWithActive.map(link => (
      <div key={link.id} className="flex items-center justify-between w-full">
        <div 
          className={cn(
            "flex items-center space-x-3 flex-1 cursor-pointer transition-colors",
            link.isActive ? "text-primary" : "hover:text-primary"
          )}
          onClick={() => handleNavigate(link.path)}
        >
          <div className="flex-shrink-0 text-muted-foreground">
            {link.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className={cn("font-medium", link.isActive && "font-semibold")}>
                {link.title}
              </span>
              {getCategoryBadge(link.category)}
              {link.badge && (
                <Badge variant="destructive" className="text-xs">
                  {link.badge}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <Button
            variant={link.isActive ? "default" : "ghost"}
            size="sm"
            onClick={() => handleNavigate(link.path)}
            className="h-8 w-8 p-0"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ))

    return (
      <AccordionPanel
        ref={ref}
        showColumnSettings={false}
        className={cn("min-h-[200px]", className)}
      >
        <PanelList items={linkItems} />
        {displayLinks.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <Navigation className="h-8 w-8 mx-auto mb-2" />
              <p>No navigation links available</p>
            </div>
          </div>
        )}
      </AccordionPanel>
    )
  }
)
NavigationPanel.displayName = "NavigationPanel"

export { NavigationPanel }
export type { NavigationLink }