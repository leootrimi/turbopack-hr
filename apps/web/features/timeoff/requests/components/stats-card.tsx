import { Card } from "@/components/components/ui/card";
import { Users } from "lucide-react";

interface StatCardProps {
  label: string;
  value: number;
  percentage: number;
  icon?: React.ReactNode;
  trendData?: number[];
  color?: string;
}

const colorMap: Record<string, string> = {
  green: "border-green-400",
  red: "border-red-400",
  blue: "border-blue-400",
  purple: "border-purple-400",
  yellow: "border-yellow-400",
};

export function StatCard({
  label,
  value,
  percentage,
  icon = <Users className="w-6 h-6 text-foreground" />,
  trendData = [3, 2, 2, 1, 2, 3, 4, 5],
  color = "green-400",
}: StatCardProps) {
  return (
    <Card className="bg-card p-8 flex flex-col items-center gap-2">
      <div
        className={`w-16 h-16 rounded-full border-2 ${colorMap[color]} shadow-md flex items-center justify-center`}
      >
        {icon}
      </div>

      <div className="text-center">
        <p className="text-3xl font-light text-card-foreground">
          {value.toLocaleString()}
        </p>
      </div>

      {/* Label */}
      <p className="text-lg text-muted-foreground text-center">{label}</p>

      {/* Percentage Badge */}
      <div className="bg-muted px-4 py-2 rounded-full">
        <p className="text-sm font-medium text-muted-foreground">
          +{percentage}%
        </p>
      </div>

      {/* Trend Chart */}
      <div className="flex items-end gap-1 w-full justify-center">
        {trendData.map((value, index) => {
          const isRecent = index >= trendData.length - 2;
          return (
            <div
              key={index}
              className={`w-2 rounded-sm transition-colors ${
                isRecent ? "bg-foreground" : "bg-muted"
              }`}
              style={{ height: `${value * 4}px` }}
            />
          );
        })}
      </div>
    </Card>
  );
}
