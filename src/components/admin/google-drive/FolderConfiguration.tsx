
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const folderConfigSchema = z.object({
  folder_id: z.string().min(1, "Folder ID is required"),
  folder_type: z.enum(["brochures", "products", "gallery"], {
    required_error: "Please select a folder type",
  }),
});

type FolderConfig = {
  folder_id: string;
  folder_type: "brochures" | "products" | "gallery";
};

export function FolderConfiguration() {
  const { data: folderConfigs, isLoading } = useQuery({
    queryKey: ['google-drive-configs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('google_drive_config')
        .select('*');

      if (error) {
        toast.error('Failed to load Google Drive configurations');
        throw error;
      }
      
      return data || [];
    }
  });

  const form = useForm<FolderConfig>({
    resolver: zodResolver(folderConfigSchema),
    defaultValues: {
      folder_id: "",
      folder_type: "brochures",
    }
  });

  const onSubmit = async (values: FolderConfig) => {
    try {
      const { error } = await supabase
        .from('google_drive_config')
        .insert([{
          folder_id: values.folder_id,
          folder_type: values.folder_type
        }]);

      if (error) throw error;

      toast.success('Folder configuration saved successfully');
      form.reset();
    } catch (error) {
      toast.error('Failed to save folder configuration');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Folder Configuration</CardTitle>
        <CardDescription>
          Configure Google Drive folders for different content types
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="folder_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Google Drive Folder ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter folder ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="folder_type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Folder Type</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="w-full border border-input bg-background px-3 py-2 rounded-md"
                    >
                      <option value="brochures">Brochures</option>
                      <option value="products">Products</option>
                      <option value="gallery">Gallery</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit">Save Configuration</Button>
          </form>
        </Form>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4">Current Configurations</h3>
          <div className="space-y-4">
            {folderConfigs?.map((config: any) => (
              <Card key={config.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{config.folder_type}</p>
                      <p className="text-sm text-muted-foreground">{config.folder_id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
