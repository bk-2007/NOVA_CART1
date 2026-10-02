import React from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MetricCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isNegative?: boolean;
  neutral?: boolean;
  prefix?: string;
  suffix?: string;
  code?: string;
}

export function MetricCard({
  label,
  value,
  subtitle,
  change,
  isNegative = false,
  neutral = false,
  prefix,
  suffix,
  code,
}: MetricCardProps) {
  return (
    <div className="bg-editorial-white border-editorial p-4 flex flex-col justify-between shadow-sm hover:border-muted transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
          {label}
        </span>
        {code && (
          <span className="text-[9px] font-editorial-mono text-muted/70 bg-paper px-1.5 py-0.5 border-editorial">
            {code}
          </span>
        )}
      </div>

      <div className="my-1">
        <div className="font-editorial-heading text-2xl lg:text-3xl font-bold text-ink tracking-tight flex items-baseline">
          {prefix && <span className="text-lg lg:text-xl font-medium mr-0.5">{prefix}</span>}
          <span>{value}</span>
          {suffix && <span className="text-xs lg:text-sm font-normal text-muted ml-1">{suffix}</span>}
        </div>
      </div>

      <div className="mt-2 pt-2 border-editorial-t flex items-center justify-between text-xs">
        {subtitle && <span className="text-muted text-[11px] truncate">{subtitle}</span>}
        {change && (
          <div
            className={`flex items-center space-x-1 text-[11px] font-editorial-mono font-medium px-1.5 py-0.5 ${
              neutral
                ? "bg-paper text-muted"
                : isNegative
                ? "bg-editorial-danger/10 text-editorial-danger"
                : "bg-editorial-success/10 text-editorial-success"
            }`}
          >
            {neutral ? (
              <Minus className="w-3 h-3" />
            ) : isNegative ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <TrendingUp className="w-3 h-3" />
            )}
            <span>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
}
