import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "../../lib/utils"

interface AccordionContextValue {
  openPanels: string[]
  togglePanel: (panelId: string) => void
  allowMultiple: boolean
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

interface AccordionProps {
  children: React.ReactNode
  allowMultiple?: boolean
  defaultOpen?: string[]
  className?: string
}

const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ children, allowMultiple = false, defaultOpen = [], className }, ref) => {
    const [openPanels, setOpenPanels] = React.useState<string[]>(defaultOpen)

    const togglePanel = React.useCallback((panelId: string) => {
      setOpenPanels(prev => {
        if (allowMultiple) {
          return prev.includes(panelId)
            ? prev.filter(id => id !== panelId)
            : [...prev, panelId]
        } else {
          return prev.includes(panelId) ? [] : [panelId]
        }
      })
    }, [allowMultiple])

    const contextValue = React.useMemo(
      () => ({
        openPanels,
        togglePanel,
        allowMultiple
      }),
      [openPanels, togglePanel, allowMultiple]
    )

    return (
      <AccordionContext.Provider value={contextValue}>
        <div ref={ref} className={cn("space-y-4", className)}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  }
)
Accordion.displayName = "Accordion"

interface AccordionItemProps {
  children: React.ReactNode
  panelId: string
  className?: string
}

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, panelId, className }, ref) => {
    const context = React.useContext(AccordionContext)
    if (!context) {
      throw new Error("AccordionItem must be used within an Accordion")
    }

    const isOpen = context.openPanels.includes(panelId)

    return (
      <div
        ref={ref}
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm",
          className
        )}
        data-panel-id={panelId}
        data-state={isOpen ? "open" : "closed"}
      >
        {children}
      </div>
    )
  }
)
AccordionItem.displayName = "AccordionItem"

interface AccordionTriggerProps {
  children: React.ReactNode
  panelId: string
  icon?: React.ReactNode
  className?: string
}

const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, panelId, icon, className }, ref) => {
    const context = React.useContext(AccordionContext)
    if (!context) {
      throw new Error("AccordionTrigger must be used within an Accordion")
    }

    const isOpen = context.openPanels.includes(panelId)

    return (
      <button
        ref={ref}
        className={cn(
          "flex w-full items-center justify-between px-6 py-5 text-left font-medium transition-all duration-200 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg",
          isOpen && "bg-white/5 text-white",
          className
        )}
        onClick={() => context.togglePanel(panelId)}
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          {icon && (
            <div className="flex-shrink-0 text-muted-foreground">
              {icon}
            </div>
          )}
          <span className="text-base font-semibold">{children}</span>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="flex-shrink-0"
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
    )
  }
)
AccordionTrigger.displayName = "AccordionTrigger"

interface AccordionContentProps {
  children: React.ReactNode
  panelId: string
  className?: string
}

const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, panelId, className }, ref) => {
    const context = React.useContext(AccordionContext)
    if (!context) {
      throw new Error("AccordionContent must be used within an Accordion")
    }

    const isOpen = context.openPanels.includes(panelId)

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            ref={ref}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className={cn("px-6 pb-4 pt-0", className)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    )
  }
)
AccordionContent.displayName = "AccordionContent"

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }