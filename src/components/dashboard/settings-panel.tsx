import * as React from "react"
import { Settings, Globe, Palette, Bell, Shield, Monitor } from "lucide-react"
import { AccordionPanel, PanelList } from "../ui/accordion-panel"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { cn } from "../../lib/utils"

interface SettingItem {
  id: string
  title: string
  description: string
  category: "general" | "appearance" | "notifications" | "security" | "advanced"
  type: "toggle" | "select" | "action"
  value?: string | boolean
  options?: { label: string; value: string }[]
  icon?: React.ReactNode
}

interface SettingsPanelProps {
  settings?: SettingItem[]
  onSettingChange?: (settingId: string, value: any) => void
  onSettingClick?: (setting: SettingItem) => void
  className?: string
}

const SettingsPanel = React.forwardRef<HTMLDivElement, SettingsPanelProps>(
  ({ settings = [], onSettingChange, onSettingClick, className }, ref) => {
    // Mock data for demo
    const mockSettings: SettingItem[] = [
      {
        id: "language",
        title: "Language",
        description: "Select your preferred language",
        category: "general",
        type: "select",
        value: "en",
        options: [
          { label: "English", value: "en" },
          { label: "Spanish", value: "es" },
          { label: "French", value: "fr" },
          { label: "German", value: "de" }
        ],
        icon: <Globe className="h-4 w-4" />
      },
      {
        id: "theme",
        title: "Theme",
        description: "Choose your preferred color theme",
        category: "appearance",
        type: "select",
        value: "dark",
        options: [
          { label: "Light", value: "light" },
          { label: "Dark", value: "dark" },
          { label: "System", value: "system" }
        ],
        icon: <Palette className="h-4 w-4" />
      },
      {
        id: "notifications",
        title: "Push Notifications",
        description: "Receive notifications for important updates",
        category: "notifications",
        type: "toggle",
        value: true,
        icon: <Bell className="h-4 w-4" />
      },
      {
        id: "email-notifications",
        title: "Email Notifications",
        description: "Get notified via email about system updates",
        category: "notifications",
        type: "toggle",
        value: false,
        icon: <Bell className="h-4 w-4" />
      },
      {
        id: "two-factor",
        title: "Two-Factor Authentication",
        description: "Add an extra layer of security to your account",
        category: "security",
        type: "action",
        value: "enabled",
        icon: <Shield className="h-4 w-4" />
      },
      {
        id: "session-timeout",
        title: "Session Timeout",
        description: "Automatically log out after inactivity",
        category: "security",
        type: "select",
        value: "30m",
        options: [
          { label: "15 minutes", value: "15m" },
          { label: "30 minutes", value: "30m" },
          { label: "1 hour", value: "1h" },
          { label: "Never", value: "never" }
        ],
        icon: <Shield className="h-4 w-4" />
      },
      {
        id: "debug-mode",
        title: "Debug Mode",
        description: "Enable debug logging for troubleshooting",
        category: "advanced",
        type: "toggle",
        value: false,
        icon: <Monitor className="h-4 w-4" />
      }
    ]

    const displaySettings = settings.length > 0 ? settings : mockSettings

    const getCategoryIcon = (category: string) => {
      const icons = {
        general: <Settings className="h-4 w-4" />,
        appearance: <Palette className="h-4 w-4" />,
        notifications: <Bell className="h-4 w-4" />,
        security: <Shield className="h-4 w-4" />,
        advanced: <Monitor className="h-4 w-4" />
      }
      return icons[category as keyof typeof icons] || <Settings className="h-4 w-4" />
    }

    const getCategoryBadge = (category: string) => {
      const variants = {
        general: "default",
        appearance: "secondary",
        notifications: "outline",
        security: "destructive",
        advanced: "secondary"
      } as const

      return (
        <Badge variant={variants[category as keyof typeof variants] || "secondary"}>
          {category}
        </Badge>
      )
    }

    const renderSettingControl = (setting: SettingItem) => {
      switch (setting.type) {
        case "toggle":
          return (
            <Button
              variant={setting.value ? "default" : "secondary"}
              size="sm"
              onClick={() => onSettingChange?.(setting.id, !setting.value)}
              className="h-8"
            >
              {setting.value ? "ON" : "OFF"}
            </Button>
          )
        case "select":
          return (
            <select
              value={setting.value as string}
              onChange={(e) => onSettingChange?.(setting.id, e.target.value)}
              className="px-3 py-1 text-sm border rounded-md bg-background"
            >
              {setting.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          )
        case "action":
          return (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSettingClick?.(setting)}
              className="h-8"
            >
              Configure
            </Button>
          )
        default:
          return null
      }
    }

    const settingItems = displaySettings.map(setting => (
      <div key={setting.id} className="flex items-center justify-between w-full">
        <div className="flex items-center space-x-3 flex-1">
          {setting.icon && (
            <div className="flex-shrink-0 text-muted-foreground">
              {setting.icon}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{setting.title}</span>
              {getCategoryBadge(setting.category)}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{setting.description}</p>
          </div>
        </div>
        <div className="flex-shrink-0 ml-4">
          {renderSettingControl(setting)}
        </div>
      </div>
    ))

    return (
      <AccordionPanel
        ref={ref}
        showColumnSettings={false}
        className={cn("min-h-[200px]", className)}
      >
        <PanelList items={settingItems} />
        {displaySettings.length === 0 && (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <div className="text-center">
              <Settings className="h-8 w-8 mx-auto mb-2" />
              <p>No settings available</p>
            </div>
          </div>
        )}
      </AccordionPanel>
    )
  }
)
SettingsPanel.displayName = "SettingsPanel"

export { SettingsPanel }
export type { SettingItem }