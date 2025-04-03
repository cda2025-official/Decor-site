
import { useState } from "react";
import { Sidebar, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebarMenu } from "@/components/admin/AdminSidebarMenu";
import { AdminContent } from "@/components/admin/AdminContent";

export default function Admin() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar variant="inset" collapsible="icon">
          <AdminSidebarMenu 
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            userRole="super_admin"
          />
        </Sidebar>
        <main className="flex-1">
          <AdminContent 
            activeSection={activeSection}
            userRole="super_admin"
          />
        </main>
      </div>
    </SidebarProvider>
  );
}
