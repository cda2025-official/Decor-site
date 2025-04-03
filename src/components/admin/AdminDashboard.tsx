
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StatsCard } from "./dashboard/StatsCard";
import { RecentActivity } from "./dashboard/RecentActivity";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export function AdminDashboard() {
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [products, categories, brochures] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact' }),
        supabase.from('categories').select('*', { count: 'exact' }),
        supabase.from('brochures').select('*', { count: 'exact' })
      ]);
      
      return {
        products: products.count || 0,
        categories: categories.count || 0,
        brochures: brochures.count || 0
      };
    }
  });

  // Sample data for the chart - in a real app, this would come from your backend
  const chartData = [
    { name: 'Jan', products: 4, brochures: 2 },
    { name: 'Feb', products: 6, brochures: 4 },
    { name: 'Mar', products: 8, brochures: 3 },
    { name: 'Apr', products: 10, brochures: 5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatsCard 
          title="Total Products" 
          value={stats?.products || 0}
          description="Active products in catalog"
        />
        <StatsCard 
          title="Categories" 
          value={stats?.categories || 0}
          description="Product categories"
        />
        <StatsCard 
          title="Brochures" 
          value={stats?.brochures || 0}
          description="Available brochures"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Content Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="products" 
                  stroke="#8884d8" 
                  name="Products"
                />
                <Line 
                  type="monotone" 
                  dataKey="brochures" 
                  stroke="#82ca9d" 
                  name="Brochures"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <RecentActivity />
      </div>
    </div>
  );
}

