"use client";

import React, { useState } from "react";
import { Info, ShieldAlert, CheckCircle2, AlertTriangle } from "lucide-react";
import { OrderRiskLevel } from "@/types";

interface ConfidenceBadgeProps {
  confidence: number;
  riskLevel?: OrderRiskLevel;
  reasons?: string[];
  isStale?: boolean;
  showDetails?: boolean;
}

export function ConfidenceBadge({
  confidence,
  riskLevel,
  reasons = [],
  isStale = false,
  showDetails = false,
}: ConfidenceBadgeProps) {
  const [openTooltip, setOpenTooltip] = useState(false);

  let bgClass = "bg-editorial-success/15 text-editorial-success border-editorial-success/40";
  let Icon = CheckCircle2;
  let level = riskLevel ?? (confidence >= 75 ? "LOW" : confidence >= 50 ? "MEDIUM" : "HIGH");

  if (confidence < 50 || isStale) {
    bgClass = "bg-editorial-danger/15 text-editorial-danger border-editorial-danger/40";
    Icon = ShieldAlert;
  } else if (confidence < 75) {
    bgClass = "bg-editorial-warning/15 text-editorial-warning border-editorial-warning/40";
    Icon = AlertTriangle;
  }

  return (
    <div className="relative inline-block">
      <div
        onClick={() => setOpenTooltip(!openTooltip)}
        onMouseEnter={() => setOpenTooltip(true)}
        onMouseLeave={() => setOpenTooltip(false)}
        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 text-xs border font-editorial-mono font-medium cursor-pointer transition-all ${bgClass}`}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{confidence}% Confidence</span>
        {isStale && (
          <span className="text-[9px] uppercase px-1 py-0.2 bg-editorial-danger text-editorial-white ml-1">
            STALE
          </span>
        )}
        <Info className="w-3 h-3 opacity-60 ml-0.5" />
      </div>

      {(openTooltip || showDetails) && reasons.length > 0 && (
        <div className="absolute left-0 mt-1.5 z-40 w-72 bg-editorial-white border-editorial shadow-md p-3 text-left">
          <div className="text-[10px] uppercase font-editorial-mono text-muted tracking-wider pb-1.5 border-editorial-b flex justify-between">
            <span>Availability Diagnosis</span>
            <span className="font-semibold text-ink">{confidence}% Confidence</span>
          </div>
          <ul className="mt-2 space-y-1.5">
            {reasons.map((reason, idx) => (
              <li key={idx} className="text-[11px] text-ink-soft flex items-start space-x-1.5">
                <span className="text-muted leading-tight">•</span>
                <span className="leading-snug">{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
