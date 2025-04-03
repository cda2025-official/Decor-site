
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function GeneralSettings() {
  const [siteName, setSiteName] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const { data: configs, isLoading } = useQuery({
    queryKey: ['site-configs', 'general'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('category', 'general');
      
      if (error) throw error;
      
      // Set initial values
      const siteNameConfig = data.find(c => c.key === 'site_name');
      const contactEmailConfig = data.find(c => c.key === 'contact_email');
      
      setSiteName(siteNameConfig?.value || '');
      setContactEmail(contactEmailConfig?.value || '');
      
      return data;
    }
  });

  const handleSave = async () => {
    try {
      const { error: siteNameError } = await supabase
        .from('site_config')
        .update({ value: siteName })
        .eq('key', 'site_name');

      const { error: emailError } = await supabase
        .from('site_config')
        .update({ value: contactEmail })
        .eq('key', 'contact_email');

      if (siteNameError || emailError) throw siteNameError || emailError;
      
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card className="p-6">
      <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="site-name">Site Name</Label>
          <Input 
            id="site-name" 
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            placeholder="Enter site name" 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="contact-email">Contact Email</Label>
          <Input 
            id="contact-email" 
            type="email" 
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder="Enter contact email" 
          />
        </div>
        
        <Button type="submit">Save Changes</Button>
      </form>
    </Card>
  );
}
