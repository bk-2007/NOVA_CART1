"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  TrendingDown,
  ArrowDown,
  AlertTriangle,
  Gift,
  CheckCircle2,
  Users,
  Layers,
  ArrowRight,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

export default function RetentionPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/retention")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
      })
      .catch((err) => console.error("Retention error", err))
      .finally(() => setLoading(false));
  }, []);

  const lifecycleFunnel = data?.lifecycleFunnel ?? [];
  const cohortRecommendations = data?.cohortRecommendations ?? [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="border-editorial-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
            07 / RETENTION & LIFECYCLE HURDLE ANALYSIS
          </div>
          <h1 className="font-editorial-heading text-2xl md:text-3xl font-bold text-ink">
            Customer Lifecycle Dynamics & Churn Prevention
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Diagnosing why trial customers fail to reach the sustainable 3-order habit threshold.
          </p>
        </div>

        <Link
          href="/promotions"
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-ink text-editorial-white text-xs font-medium hover:bg-ink-soft self-start md:self-auto"
        >
          <Gift className="w-3.5 h-3.5" />
          <span>View Targeted Incentives →</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Second-Order Conversion"
          value="31%"
          subtitle="Within 30 days of 1st order"
          isNegative={true}
          change="Severe Churn Hurdle"
          code="FUNNEL"
        />
        <MetricCard
          label="3-Order Habit Lock-in"
          value="72%"
          subtitle="Next-month repurchase rate"
          change="Loyalty Milestone"
          code="HABIT"
        />
        <MetricCard
          label="Platform Repeat Rate"
          value="27%"
          subtitle="Down from 41% 6m ago"
          isNegative={true}
          change="-34% Collapse"
          code="REPEAT"
        />
        <MetricCard
          label="Coupon Wastage Rate"
          value="44%"
          subtitle="Unredeemed blanket codes"
          isNegative={true}
          change="₹7.5L Waste"
          code="WASTE"
        />
      </div>

      {/* CUSTOMER LIFECYCLE FUNNEL VISUALIZATION (Section 20 Requirement) */}
      <div className="bg-editorial-white border-editorial p-6 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-editorial-b pb-3">
          <div>
            <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
              LIFECYCLE CASCADE ARCHITECTURE
            </span>
            <h3 className="font-editorial-heading text-lg font-bold text-ink">
              The Four Stages of Hyperlocal Grocery Retention
            </h3>
          </div>
          <span className="text-[10px] font-editorial-mono bg-editorial-danger/10 text-editorial-danger px-2 py-0.5 border border-editorial-danger/30 font-semibold">
            CRITICAL LEAKAGE AT STAGE 2
          </span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto py-2">
          {lifecycleFunnel.map((stage: any, index: number) => {
            const isBottleneck = stage.isCoreBottleneck;

            return (
              <div key={stage.stage} className="relative">
                <div
                  className={`p-5 border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all ${
                    isBottleneck
                      ? "bg-editorial-danger/5 border-2 border-editorial-danger shadow-md"
                      : "bg-paper border-editorial"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-editorial-mono font-bold text-muted uppercase">
                        {stage.stage}
                      </span>
                      {isBottleneck && (
                        <span className="text-[9px] font-editorial-mono bg-editorial-danger text-editorial-white px-1.5 py-0.2 uppercase font-semibold">
                          PRIMARY CHURN HURDLE
                        </span>
                      )}
                    </div>
                    <h4 className="font-editorial-heading text-base font-bold text-ink">
                      {stage.label}
                    </h4>
                    <p className="text-xs text-ink-soft">{stage.benchmarkText}</p>
                  </div>

                  <div className="flex items-center space-x-6 text-right shrink-0">
                    <div>
                      <span className="text-[10px] uppercase font-editorial-mono text-muted block">
                        Conversion Rate
                      </span>
                      <div
                        className={`font-editorial-heading text-2xl font-bold ${
                          isBottleneck ? "text-editorial-danger" : "text-ink"
                        }`}
                      >
                        {stage.conversionRate}%
                      </div>
                    </div>

                    <div className="w-28 hidden sm:block">
                      <div className="w-full bg-paper-deep h-2 border border-line">
                        <div
                          className={`h-full ${
                            isBottleneck ? "bg-editorial-danger" : "bg-ink"
                          }`}
                          style={{ width: `${stage.conversionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {index < lifecycleFunnel.length - 1 && (
                  <div className="flex justify-center my-1.5">
                    <ArrowDown className="w-4 h-4 text-muted" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Targeted Customer-Level Retention Interventions (Section 20 Requirement) */}
      <div className="bg-editorial-white border-editorial p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-editorial-b pb-3">
          <div>
            <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
              COHORT INTERVENTIONS
            </span>
            <h3 className="font-editorial-heading text-lg font-bold text-ink">
              High-Leverage Customer Retention Queue
            </h3>
          </div>
          <span className="text-xs font-editorial-mono text-muted">
            Focus: Second-Order Dropoff Interventions
          </span>
        </div>

        <div className="divide-y divide-line">
          {cohortRecommendations.map((c: any) => (
            <div
              key={c.customerId}
              className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 max-w-xl">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-ink">{c.customerName}</span>
                  <span className="text-[10px] font-editorial-mono bg-paper-deep px-1.5 py-0.2 border border-line">
                    {c.segment}
                  </span>
                  <span className="text-muted">
                    {c.daysSinceLastOrder} days since 1st order
                  </span>
                </div>
                <p className="text-ink text-xs font-medium">
                  Intervention: {c.recommendedIntervention}
                </p>
                {c.riskFactors && c.riskFactors.length > 0 && (
                  <p className="text-[11px] text-editorial-danger">
                    • {c.riskFactors[0]}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-4 self-start md:self-center">
                <div className="text-right">
                  <span className="text-[10px] uppercase font-editorial-mono text-muted block">
                    Churn Risk
                  </span>
                  <span className="font-editorial-mono font-bold text-editorial-danger">
                    {Math.round(c.churnRiskScore * 100)}%
                  </span>
                </div>

                <Link
                  href="/promotions"
                  className="px-3 py-1.5 bg-paper-deep border-editorial text-xs font-medium text-ink hover:bg-line/40 flex items-center space-x-1"
                >
                  <span>Deploy Incentive</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
