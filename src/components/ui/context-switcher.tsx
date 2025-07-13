import * as React from "react"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "../../lib/utils"

interface ContextSwitcherProps {
  onContextChange?: (context: string) => void;
  initialContext?: string;
}

const ContextSwitcher: React.FC<ContextSwitcherProps> = ({
  onContextChange,
  initialContext = "personal",
}) => {
  const [currentContext, setCurrentContext] = useState(initialContext);
  const [isOpen, setIsOpen] = useState(false);

  const contexts = [
    { value: "personal", label: "Personal" },
    { value: "team", label: "Team" },
    { value: "enterprise", label: "Enterprise" },
  ];

  const handleContextSelect = (context: string) => {
    setCurrentContext(context);
    setIsOpen(false);
    onContextChange?.(context);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center w-full rounded-md glass-input px-4 py-2 text-sm font-medium text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
          id="menu-button"
          aria-expanded="true"
          aria-haspopup="true"
          onClick={() => setIsOpen(!isOpen)}
        >
          {contexts.find((c) => c.value === currentContext)?.label}
          <ChevronDown className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div
          className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg glass-card ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabIndex={-1}
        >
          <div className="py-1" role="none">
            {contexts.map((context) => (
              <a
                key={context.value}
                href="#"
                className={cn(
                  currentContext === context.value
                    ? "bg-purple-500/20 text-white"
                    : "text-slate-300 hover:bg-white/5 hover:text-white",
                  "block px-4 py-2 text-sm"
                )}
                role="menuitem"
                tabIndex={-1}
                id={`menu-item-${context.value}`}
                onClick={() => handleContextSelect(context.value)}
              >
                {context.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContextSwitcher;
