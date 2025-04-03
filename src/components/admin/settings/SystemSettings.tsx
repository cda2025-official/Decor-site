
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export function SystemSettings() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [analyticsId, setAnalyticsId] = useState("");

  const { data: configs, isLoading } = useQuery({
    queryKey: ['site-configs', 'system'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .in('category', ['system', 'analytics']);
      
      if (error) throw error;
      
      const maintenanceConfig = data.find(c => c.key === 'maintenance_mode');
      const analyticsConfig = data.find(c => c.key === 'google_analytics_id');
      
      setMaintenanceMode(maintenanceConfig?.value === 'true');
      setAnalyticsId(analyticsConfig?.value || '');
      
      return data;
    }
  });

  const handleSave = async () => {
    try {
      const { error: maintenanceError } = await supabase
        .from('site_config')
        .update({ value: maintenanceMode.toString() })
        .eq('key', 'maintenance_mode');

      const { error: analyticsError } = await supabase
        .from('site_config')
        .update({ value: analyticsId })
        .eq('key', 'google_analytics_id');

      if (maintenanceError || analyticsError) throw maintenanceError || analyticsError;
      
      toast.success('System settings saved successfully');
    } catch (error) {
      toast.error('Failed to save system settings');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="p-6">
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
          <Switch 
            id="maintenance-mode"
            checked={maintenanceMode}
            onCheckedChange={setMaintenanceMode}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="analytics-id">Google Analytics ID</Label>
          <Input 
            id="analytics-id" 
            value={analyticsId}
            onChange={(e) => setAnalyticsId(e.target.value)}
            placeholder="Enter Google Analytics ID" 
          />
        </div>
        
        <Button type="submit">Save Changes</Button>
      </form>
    </Card>
  );
}
