
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
}

export function StatsCard({ title, value, description }: StatsCardProps) {
  return (
    <Card className="p-6">
      <h3 className="font-semibold text-muted-foreground mb-2">{title}</h3>
      <p className="text-3xl font-bold">{value}</p>
      {description && (
        <p className="text-sm text-muted-foreground mt-2">{description}</p>
      )}
    </Card>
  );
}

