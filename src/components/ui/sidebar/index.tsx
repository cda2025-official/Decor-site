import { SidebarBase } from "./SidebarBase"
import { SidebarProvider, useSidebar } from "./SidebarContext"
import { SidebarTrigger, SidebarRail } from "./SidebarNavigation"
import { 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton 
} from "./SidebarMenu"

// Re-export everything
export {
  SidebarBase,
  SidebarProvider,
  useSidebar,
  SidebarTrigger,
  SidebarRail,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
}

// Export the main Sidebar component that combines everything
export const Sidebar = SidebarBase