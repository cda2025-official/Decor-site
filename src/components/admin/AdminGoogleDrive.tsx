
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FolderConfiguration } from "./google-drive/FolderConfiguration";
import { FilesList } from "./google-drive/FilesList";
import { Settings } from "./google-drive/Settings";

export function AdminGoogleDrive() {
  const [activeTab, setActiveTab] = useState("folders");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Google Drive Integration</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="folders">Folder Configuration</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="folders">
          <FolderConfiguration />
        </TabsContent>

        <TabsContent value="files">
          <FilesList />
        </TabsContent>

        <TabsContent value="settings">
          <Settings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
