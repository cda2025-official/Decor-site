
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash, Download } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const brochureSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  file_url: z.string().min(1, "File URL is required"),
  file_type: z.string().min(1, "File type is required"),
  file_size: z.string().optional(),
});

type BrochureFormData = z.infer<typeof brochureSchema>;

export function AdminBrochures() {
  const queryClient = useQueryClient();
  const [selectedBrochure, setSelectedBrochure] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: brochures, isLoading } = useQuery({
    queryKey: ['admin-brochures'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brochures')
        .select('*');

      if (error) {
        toast.error('Failed to load brochures');
        throw error;
      }
      
      return data || [];
    }
  });

  const form = useForm<BrochureFormData>({
    resolver: zodResolver(brochureSchema),
    defaultValues: {
      title: "",
      description: "",
      file_url: "",
      file_type: "",
      file_size: "",
    }
  });

  const saveBrochureMutation = useMutation({
    mutationFn: async (data: BrochureFormData) => {
      if (selectedBrochure) {
        const { error } = await supabase
          .from('brochures')
          .update({
            title: data.title,
            description: data.description,
            file_url: data.file_url,
            file_type: data.file_type,
            file_size: data.file_size,
          })
          .eq('id', selectedBrochure.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('brochures')
          .insert([{
            title: data.title,
            description: data.description,
            file_url: data.file_url,
            file_type: data.file_type,
            file_size: data.file_size,
          }]);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brochures'] });
      toast.success(selectedBrochure ? 'Brochure updated successfully' : 'Brochure created successfully');
      handleCloseDialog();
    },
    onError: () => {
      toast.error(selectedBrochure ? 'Failed to update brochure' : 'Failed to create brochure');
    }
  });

  const deleteBrochureMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('brochures')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-brochures'] });
      toast.success('Brochure deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete brochure');
    }
  });

  const handleEdit = (brochure: any) => {
    setSelectedBrochure(brochure);
    form.reset({
      title: brochure.title,
      description: brochure.description || "",
      file_url: brochure.file_url || "",
      file_type: brochure.file_type || "",
      file_size: brochure.file_size || "",
    });
    setIsDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedBrochure(null);
    form.reset({
      title: "",
      description: "",
      file_url: "",
      file_type: "",
      file_size: "",
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this brochure?')) {
      deleteBrochureMutation.mutate(id);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedBrochure(null);
    form.reset();
  };

  const onSubmit = (data: BrochureFormData) => {
    saveBrochureMutation.mutate(data);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Brochures</h1>
        <Button onClick={handleAdd}>Add Brochure</Button>
      </div>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedBrochure ? 'Edit Brochure' : 'Add New Brochure'}</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brochure title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter brochure description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="file_url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter file URL" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="file_type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Type</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter file type (e.g., PDF)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="file_size"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter file size (e.g., 2.4 MB)" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button type="submit">
                  {selectedBrochure ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>File Type</TableHead>
            <TableHead>File Size</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {brochures?.map((brochure: any) => (
            <TableRow key={brochure.id}>
              <TableCell>{brochure.title}</TableCell>
              <TableCell>{brochure.description}</TableCell>
              <TableCell>{brochure.file_type}</TableCell>
              <TableCell>{brochure.file_size}</TableCell>
              <TableCell className="space-x-2">
                <Button variant="ghost" size="icon" asChild>
                  <a href={brochure.file_url} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEdit(brochure)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDelete(brochure.id)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
