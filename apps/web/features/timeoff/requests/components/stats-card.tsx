import { Card } from "@/components/components/ui/card";
import { Users, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, MoreHorizontal } from "lucide-react";
import { useState } from "react";

interface StatCardProps {
  label: string;
  value: number;
  percentage: number;
  previousValue?: number;
  icon?: React.ReactNode;
  trendData?: number[];
  color?: 'green' | 'red' | 'blue' | 'purple' | 'yellow' | 'indigo' | 'emerald' | 'rose';
  subtitle?: string;
  target?: number;
  period?: 'today' | 'week' | 'month' | 'year';
  isLoading?: boolean;
}

const colorConfig: Record<string, { 
  gradient: string; 
  light: string; 
  dark: string; 
  badge: string;
  ring: string;
  icon: string;
}> = {
  green: {
    gradient: 'from-emerald-500 to-teal-500',
    light: 'bg-emerald-50',
    dark: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-400',
    icon: 'text-emerald-600'
  },
  red: {
    gradient: 'from-rose-500 to-red-500',
    light: 'bg-rose-50',
    dark: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    ring: 'ring-rose-400',
    icon: 'text-rose-600'
  },
  blue: {
    gradient: 'from-blue-500 to-cyan-500',
    light: 'bg-blue-50',
    dark: 'text-blue-600',
    badge: 'bg-blue-100 text-blue-700',
    ring: 'ring-blue-400',
    icon: 'text-blue-600'
  },
  purple: {
    gradient: 'from-purple-500 to-violet-500',
    light: 'bg-purple-50',
    dark: 'text-purple-600',
    badge: 'bg-purple-100 text-purple-700',
    ring: 'ring-purple-400',
    icon: 'text-purple-600'
  },
  yellow: {
    gradient: 'from-amber-500 to-orange-500',
    light: 'bg-amber-50',
    dark: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-700',
    ring: 'ring-amber-400',
    icon: 'text-amber-600'
  },
  indigo: {
    gradient: 'from-indigo-500 to-blue-500',
    light: 'bg-indigo-50',
    dark: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
    ring: 'ring-indigo-400',
    icon: 'text-indigo-600'
  },
  emerald: {
    gradient: 'from-emerald-500 to-green-500',
    light: 'bg-emerald-50',
    dark: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
    ring: 'ring-emerald-400',
    icon: 'text-emerald-600'
  },
  rose: {
    gradient: 'from-rose-500 to-pink-500',
    light: 'bg-rose-50',
    dark: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
    ring: 'ring-rose-400',
    icon: 'text-rose-600'
  }
};

export function StatCard({
  label,
  value,
  percentage,
  previousValue,
  icon = <Users className="w-5 h-5" />,
  trendData = [65, 70, 68, 72, 75, 78, 82, 85],
  color = "blue",
  subtitle,
  target,
  period = "month",
  isLoading = false,
}: StatCardProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const isPositive = percentage >= 0;
  const absolutePercentage = Math.abs(percentage);
  const currentColor = colorConfig[color];


  if (isLoading) {
    return (
      <Card className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="w-12 h-12 bg-slate-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="h-4 bg-slate-200 rounded w-1/2" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${currentColor?.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
      
      <div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full ${currentColor?.light} opacity-30 group-hover:opacity-50 transition-opacity duration-300`} />
      
      <div className="relative px-4">
        <div className="space-y-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-3xl font-bold text-slate-800 tracking-tight">
              {value.toLocaleString()}
            </span>

          </div>
          
          {/* Label and Period */}
          <div>
            <p className="text-sm font-medium text-slate-600">{label}</p>
            {subtitle && (
              <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Progress Bar (if target is provided) */}
        {target && (
          <div className="mt-4">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">Progress to target</span>
              <span className="font-medium text-slate-700">
                {Math.round((value / target) * 100)}%
              </span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full bg-gradient-to-r ${currentColor?.gradient} transition-all duration-500`}
                style={{ width: `${Math.min((value / target) * 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Target: {target.toLocaleString()}</p>
          </div>
        )}

        {/* Previous Value Comparison */}
        {previousValue && (
          <div className="mt-3 flex items-center justify-between text-xs">
            <span className="text-slate-500">Previous: {previousValue.toLocaleString()}</span>
            <span className={`text-xs font-medium ${isPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
              {isPositive ? '+' : ''}{absolutePercentage}%
            </span>
          </div>
        )}

        {/* Tooltip */}
        {showTooltip && (
          <div className="absolute top-12 right-12 z-10 bg-slate-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap animate-in fade-in zoom-in-95 duration-200">
            View details
          </div>
        )}
      </div>
    </Card>
  );
}