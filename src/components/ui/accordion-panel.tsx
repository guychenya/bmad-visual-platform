import * as React from "react"
import { Settings } from "lucide-react"
import { Button } from "./button"
import { cn } from "../../lib/utils"

interface ColumnConfig {
  id: string
  label: string
  visible: boolean
}

interface AccordionPanelProps {
  children: React.ReactNode
  columns?: ColumnConfig[]
  onColumnToggle?: (columnId: string) => void
  showColumnSettings?: boolean
  className?: string
}

const AccordionPanel = React.forwardRef<HTMLDivElement, AccordionPanelProps>(
  ({ children, columns = [], onColumnToggle, showColumnSettings = true, className }, ref) => {
    const [showSettings, setShowSettings] = React.useState(false)

    const handleColumnToggle = (columnId: string) => {
      if (onColumnToggle) {
        onColumnToggle(columnId)
      }
    }

    return (
      <div ref={ref} className={cn("relative", className)}>
        {showColumnSettings && columns.length > 0 && (
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {columns.filter(col => col.visible).length} of {columns.length} columns shown
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="h-8 w-8 p-0"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        )}

        {showSettings && (
          <div className="mb-4 rounded-md border bg-muted/50 p-3">
            <div className="mb-2 text-sm font-medium">Column Visibility</div>
            <div className="grid grid-cols-2 gap-2">
              {columns.map((column) => (
                <label
                  key={column.id}
                  className="flex items-center space-x-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground rounded px-2 py-1"
                >
                  <input
                    type="checkbox"
                    checked={column.visible}
                    onChange={() => handleColumnToggle(column.id)}
                    className="rounded border-input"
                  />
                  <span>{column.label}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-2">
          {children}
        </div>
      </div>
    )
  }
)
AccordionPanel.displayName = "AccordionPanel"

interface PanelTableProps {
  columns: ColumnConfig[]
  data: Record<string, any>[]
  className?: string
}

const PanelTable = React.forwardRef<HTMLTableElement, PanelTableProps>(
  ({ columns, data, className }, ref) => {
    const visibleColumns = columns.filter(col => col.visible)

    return (
      <div className="overflow-x-auto">
        <table ref={ref} className={cn("w-full text-sm", className)}>
          <thead>
            <tr className="border-b">
              {visibleColumns.map((column) => (
                <th
                  key={column.id}
                  className="px-4 py-2 text-left font-medium text-muted-foreground"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr
                key={index}
                className="border-b hover:bg-muted/50 transition-colors"
              >
                {visibleColumns.map((column) => (
                  <td key={column.id} className="px-4 py-2">
                    {row[column.id]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
)
PanelTable.displayName = "PanelTable"

interface PanelListProps {
  items: React.ReactNode[]
  className?: string
}

const PanelList = React.forwardRef<HTMLUListElement, PanelListProps>(
  ({ items, className }, ref) => {
    return (
      <ul ref={ref} className={cn("space-y-2", className)}>
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center space-x-3 rounded-lg border p-3 hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {item}
          </li>
        ))}
      </ul>
    )
  }
)
PanelList.displayName = "PanelList"

export { AccordionPanel, PanelTable, PanelList }
export type { ColumnConfig }