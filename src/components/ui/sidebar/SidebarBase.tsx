import * as React from "react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useSidebarContext } from "./SidebarContext"

export const SidebarBase = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const { contextValue } = useSidebarContext({
      defaultOpen,
      openProp,
      setOpenProp,
    })

    return (
      <TooltipProvider delayDuration={0}>
        <div
          style={
            {
              "--sidebar-width": "16rem",
              "--sidebar-width-icon": "3rem",
              ...style,
            } as React.CSSProperties
          }
          className={cn(
            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
            className
          )}
          ref={ref}
          {...props}
        >
          {children}
        </div>
      </TooltipProvider>
    )
  }
)
SidebarBase.displayName = "SidebarBase"