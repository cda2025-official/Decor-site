
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ThemeSettings() {
  const [primaryColor, setPrimaryColor] = useState("");
  const [secondaryColor, setSecondaryColor] = useState("");

  const { data: configs, isLoading } = useQuery({
    queryKey: ['site-configs', 'theme'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('category', 'theme');
      
      if (error) throw error;
      
      const primaryColorConfig = data.find(c => c.key === 'theme_primary_color');
      const secondaryColorConfig = data.find(c => c.key === 'theme_secondary_color');
      
      setPrimaryColor(primaryColorConfig?.value || '');
      setSecondaryColor(secondaryColorConfig?.value || '');
      
      return data;
    }
  });

  const handleSave = async () => {
    try {
      const { error: primaryError } = await supabase
        .from('site_config')
        .update({ value: primaryColor })
        .eq('key', 'theme_primary_color');

      const { error: secondaryError } = await supabase
        .from('site_config')
        .update({ value: secondaryColor })
        .eq('key', 'theme_secondary_color');

      if (primaryError || secondaryError) throw primaryError || secondaryError;
      
      toast.success('Theme settings saved successfully');
    } catch (error) {
      toast.error('Failed to save theme settings');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="p-6">
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex gap-2">
            <Input 
              id="primary-color" 
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="#007bff" 
            />
            <Input 
              type="color" 
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-14 p-1 h-10"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="secondary-color">Secondary Color</Label>
          <div className="flex gap-2">
            <Input 
              id="secondary-color" 
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              placeholder="#6c757d" 
            />
            <Input 
              type="color" 
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-14 p-1 h-10"
            />
          </div>
        </div>
        
        <Button type="submit">Save Changes</Button>
      </form>
    </Card>
  );
}
