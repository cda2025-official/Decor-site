
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function RecentActivity() {
  const { data: recentProducts } = useQuery({
    queryKey: ['recent-products'],
    queryFn: async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      return data;
    }
  });

  const { data: recentBrochures } = useQuery({
    queryKey: ['recent-brochures'],
    queryFn: async () => {
      const { data } = await supabase
        .from('brochures')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);
      return data;
    }
  });

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-6">
        <div>
          <h4 className="text-sm font-medium mb-3">Latest Products</h4>
          <div className="space-y-2">
            {recentProducts?.map((product) => (
              <div key={product.id} className="flex justify-between items-center text-sm">
                <span>{product.title}</span>
                <span className="text-muted-foreground">
                  {product.created_at ? format(new Date(product.created_at), 'MMM d, yyyy') : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-3">Latest Brochures</h4>
          <div className="space-y-2">
            {recentBrochures?.map((brochure) => (
              <div key={brochure.id} className="flex justify-between items-center text-sm">
                <span>{brochure.title}</span>
                <span className="text-muted-foreground">
                  {brochure.created_at ? format(new Date(brochure.created_at), 'MMM d, yyyy') : '-'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

