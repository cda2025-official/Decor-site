
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "./settings/GeneralSettings";
import { ThemeSettings } from "./settings/ThemeSettings";
import { SystemSettings } from "./settings/SystemSettings";

export function AdminSettings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="theme">Theme</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <div className="mt-4">
          <TabsContent value="general">
            <GeneralSettings />
          </TabsContent>

          <TabsContent value="theme">
            <ThemeSettings />
          </TabsContent>

          <TabsContent value="system">
            <SystemSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
