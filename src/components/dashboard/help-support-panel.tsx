import * as React from "react"
import { HelpCircle, Book, MessageCircle, Mail, ExternalLink, FileText, Video, Phone } from "lucide-react"
import { AccordionPanel, PanelList } from "../ui/accordion-panel"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"

interface SupportResource {
  id: string
  title: string
  description: string
  type: "documentation" | "faq" | "contact" | "video" | "tutorial" | "guide"
  url?: string
  isExternal?: boolean
  category: "getting-started" | "troubleshooting" | "api" | "billing" | "support"
  icon?: React.ReactNode
}

interface HelpSupportPanelProps {
  resources?: SupportResource[]
  onResourceClick?: (resource: SupportResource) => void
  className?: string
}

const HelpSupportPanel = React.forwardRef<HTMLDivElement, HelpSupportPanelProps>(
  ({ resources = [], onResourceClick, className }, ref) => {
    // Mock data for demo
    const mockResources: SupportResource[] = [
      {
        id: "getting-started",
        title: "Getting Started Guide",
        description: "Learn the basics of using the platform",
        type: "documentation",
        url: "/docs/getting-started",
        category: "getting-started",
        icon: <Book className="h-4 w-4" />
      },
      {
        id: "api-docs",
        title: "API Documentation",
        description: "Complete reference for our REST API",
        type: "documentation",
        url: "/docs/api",
        category: "api",
        icon: <FileText className="h-4 w-4" />
      },
      {
        id: "video-tutorials",
        title: "Video Tutorials",
        description: "Step-by-step video guides",
        type: "video",
        url: "https://youtube.com/channel/tutorials",
        isExternal: true,
        category: "getting-started",
        icon: <Video className="h-4 w-4" />
      },
      {
        id: "faq",
        title: "Frequently Asked Questions",
        description: "Common questions and answers",
        type: "faq",
        url: "/faq",
        category: "troubleshooting",
        icon: <HelpCircle className="h-4 w-4" />
      },
      {
        id: "troubleshooting",
        title: "Troubleshooting Guide",
        description: "Solutions to common issues",
        type: "guide",
        url: "/docs/troubleshooting",
        category: "troubleshooting",
        icon: <Book className="h-4 w-4" />
      },
      {
        id: "live-chat",
        title: "Live Chat Support",
        description: "Chat with our support team",
        type: "contact",
        url: "/support/chat",
        category: "support",
        icon: <MessageCircle className="h-4 w-4" />
      },
      {
        id: "email-support",
        title: "Email Support",
        description: "Send us a message at support@example.com",
        type: "contact",
        url: "mailto:support@example.com",
        isExternal: true,
        category: "support",
        icon: <Mail className="h-4 w-4" />
      },
      {
        id: "phone-support",
        title: "Phone Support",
        description: "Call us at 1-800-SUPPORT",
        type: "contact",
        url: "tel:1-800-SUPPORT",
        isExternal: true,
        category: "support",
        icon: <Phone className="h-4 w-4" />
      },
      {
        id: "billing-help",
        title: "Billing & Subscriptions",
        description: "Manage your account and billing",
        type: "documentation",
        url: "/docs/billing",
        category: "billing",
        icon: <FileText className="h-4 w-4" />
      }
    ]

    const displayResources = resources.length > 0 ? resources : mockResources

    const getTypeIcon = (type: string) => {
      const icons = {
        documentation: <Book className="h-4 w-4" />,
        faq: <HelpCircle className="h-4 w-4" />,
        contact: <MessageCircle className="h-4 w-4" />,
        video: <Video className="h-4 w-4" />,
        tutorial: <Video className="h-4 w-4" />,
        guide: <Book className="h-4 w-4" />
      }
      return icons[type as keyof typeof icons] || <Book className="h-4 w-4" />
    }

    const getCategoryBadge = (category: string) => {
      const variants = {
        "getting-started": "default",
        troubleshooting: "destructive",
        api: "secondary",
        billing: "outline",
        support: "default"
      } as const

      const labels = {
        "getting-started": "Getting Started",
        troubleshooting: "Troubleshooting",
        api: "API",
        billing: "Billing",
        support: "Support"
      }

      return (
        <Badge variant={variants[category as keyof typeof variants] || "secondary"}>
          {labels[category as keyof typeof labels] || category}
        </Badge>
      )
    }

    const handleResourceClick = (resource: SupportResource) => {
      if (onResourceClick) {
        onResourceClick(resource)
      } else if (resource.url) {
        if (resource.isExternal) {
          window.open(resource.url, '_blank')
        } else {
          window.location.href = resource.url
        }
      }
    }

    const resourceItems = displayResources.map(resource => (
      <div key={resource.id} className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3 flex-1">
          <div className="flex-shrink-0 text-muted-foreground">
            {resource.icon || getTypeIcon(resource.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{resource.title}</span>
              {getCategoryBadge(resource.category)}
              {resource.isExternal && (
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{resource.description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleResourceClick(resource)}
            className="h-8"
          >
            {resource.type === "contact" ? "Contact" : "Open"}
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
        <PanelList items={resourceItems} />
        {displayResources.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <HelpCircle className="h-8 w-8 mx-auto mb-2" />
              <p>No help resources available</p>
            </div>
          </div>
        )}
      </AccordionPanel>
    )
  }
)
HelpSupportPanel.displayName = "HelpSupportPanel"

export { HelpSupportPanel }
export type { SupportResource }