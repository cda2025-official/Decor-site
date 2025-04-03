
import { Home, Database, FileText, Users, Settings, CloudIcon } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface AdminSidebarMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
  userRole: string;
}

export function AdminSidebarMenu({ activeSection, setActiveSection, userRole }: AdminSidebarMenuProps) {
  const menuItems = [
    { id: "dashboard", title: "Dashboard", icon: Home },
    { id: "products", title: "Products", icon: Database },
    { id: "categories", title: "Categories", icon: FileText },
    { id: "brochures", title: "Brochures", icon: FileText },
    { id: "google-drive", title: "Google Drive", icon: CloudIcon },
    ...(userRole === 'super_admin' ? [{ id: "users", title: "Users", icon: Users }] : []),
    { id: "settings", title: "Settings", icon: Settings },
  ];

  return (
    <div className="p-4 w-64">
      <h2 className="mb-4 text-lg font-semibold">Admin Panel</h2>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton
              onClick={() => setActiveSection(item.id)}
              isActive={activeSection === item.id}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </div>
  );
}
