import * as React from "react"
import { MessageSquare, Users, Settings, HelpCircle, Navigation } from "lucide-react"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../ui/accordion"
import { ChatLogsPanel } from "./chat-logs-panel"
import { UserManagementPanel } from "./user-management-panel"
import { SettingsPanel } from "./settings-panel"
import { HelpSupportPanel } from "./help-support-panel"
import { NavigationPanel } from "./navigation-panel"
import { cn } from "../../lib/utils"

interface DashboardAccordionProps {
  defaultOpen?: string[]
  allowMultiple?: boolean
  currentPath?: string
  onNavigate?: (path: string) => void
  className?: string
}

const DashboardAccordion = React.forwardRef<HTMLDivElement, DashboardAccordionProps>(
  ({ defaultOpen = [], allowMultiple = true, currentPath, onNavigate, className }, ref) => {
    return (
      <Accordion
        ref={ref}
        allowMultiple={allowMultiple}
        defaultOpen={defaultOpen}
        className={cn("w-full max-w-4xl mx-auto", className)}
      >
        <AccordionItem panelId="chat-logs">
          <AccordionTrigger
            panelId="chat-logs"
            icon={<MessageSquare className="h-4 w-4" />}
          >
            Chat Logs
          </AccordionTrigger>
          <AccordionContent panelId="chat-logs">
            <ChatLogsPanel />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem panelId="user-management">
          <AccordionTrigger
            panelId="user-management"
            icon={<Users className="h-4 w-4" />}
          >
            User Management
          </AccordionTrigger>
          <AccordionContent panelId="user-management">
            <UserManagementPanel />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem panelId="settings">
          <AccordionTrigger
            panelId="settings"
            icon={<Settings className="h-4 w-4" />}
          >
            Settings
          </AccordionTrigger>
          <AccordionContent panelId="settings">
            <SettingsPanel />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem panelId="help-support">
          <AccordionTrigger
            panelId="help-support"
            icon={<HelpCircle className="h-4 w-4" />}
          >
            Help and Support
          </AccordionTrigger>
          <AccordionContent panelId="help-support">
            <HelpSupportPanel />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem panelId="navigation">
          <AccordionTrigger
            panelId="navigation"
            icon={<Navigation className="h-4 w-4" />}
          >
            Navigation
          </AccordionTrigger>
          <AccordionContent panelId="navigation">
            <NavigationPanel 
              currentPath={currentPath}
              onNavigate={onNavigate}
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    )
  }
)
DashboardAccordion.displayName = "DashboardAccordion"

export { DashboardAccordion }