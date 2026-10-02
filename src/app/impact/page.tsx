"use client";

import React, { useState } from "react";
import {
  LineChart,
  Sliders,
  TrendingUp,
  DollarSign,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  Layers,
  ArrowRight,
} from "lucide-react";
import { calculateBusinessImpact } from "@/lib/services/impactCalculator";
import { MetricCard } from "@/components/MetricCard";

export default function ImpactPage() {
  // Slider states with defaults from prompt
  const [targetCancellationPct, setTargetCancellationPct] = useState<number>(8); // 11% -> 8%
  const [targetRepeatPct, setTargetRepeatPct] = useState<number>(32); // 27% -> 32%
  const [targetSupportTickets, setTargetSupportTickets] = useState<number>(4800); // 5900 -> 4800
  const [targetPromoSpendLakhs, setTargetPromoSpendLakhs] = useState<number>(12.5); // 17L -> 12.5L

  // Real-time calculation
  const impact = calculateBusinessImpact({
    monthlyOrders: 38500,
    aov: 486,
    currentCancellationRate: 0.11,
    targetCancellationRate: targetCancellationPct / 100,
    currentRepeatRate: 0.27,
    targetRepeatRate: targetRepeatPct / 100,
    currentSupportTickets: 5900,
    targetSupportTickets,
    monthlyPromoSpend: 1700000,
    targetPromoSpend: targetPromoSpendLakhs * 100000,
    sixMonthBudget: 2500000,
  });

  const formatINR = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="border-editorial-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
            09 / ECONOMIC IMPACT & SCENARIO SIMULATOR
          </div>
          <h1 className="font-editorial-heading text-2xl md:text-3xl font-bold text-ink">
            Business Turnaround Simulator
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Modeling the financial recovery from fixing inventory reliability, order fulfillment, and customer retention.
          </p>
        </div>

        {/* SCENARIO ESTIMATE BADGE (Section 13 & 22 Requirement) */}
        <div className="flex items-center space-x-2 px-3 py-1.5 bg-paper-deep border-editorial text-xs font-editorial-mono text-ink self-start md:self-auto">
          <AlertCircle className="w-3.5 h-3.5 text-editorial-warning" />
          <span className="font-bold">SCENARIO ESTIMATE</span>
        </div>
      </div>

      {/* Mandatory Disclaimer (Section 13 requirement) */}
      <div className="p-3 bg-paper border-editorial text-[11px] text-muted leading-relaxed">
        <strong>Mandatory Governance Notice:</strong> All figures presented below are modeled projections labeled strictly as{" "}
        <span className="font-semibold text-ink">SCENARIO ESTIMATES</span>. NOVA CART Local Commerce Intelligence does not claim guaranteed revenue; figures illustrate mathematical sensitivity against platform operational baselines (38,500 orders/mo, ₹486 AOV).
      </div>

      {/* Interactive Sliders Section (Section 22 Requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-editorial-white border-editorial p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-editorial-b pb-3">
            <h3 className="font-editorial-heading text-base font-bold text-ink flex items-center gap-2">
              <Sliders className="w-4 h-4 text-ink" />
              <span>Operational Recovery Lever Sliders</span>
            </h3>
            <span className="text-[10px] font-editorial-mono text-muted uppercase">
              Move to recalculate live
            </span>
          </div>

          {/* Slider 1: Cancellation Rate (11% -> 8%) */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-semibold text-ink">Order Cancellation Rate</span>
              <span className="font-editorial-mono text-ink">
                11% → <strong className="text-editorial-success text-sm">{targetCancellationPct}%</strong>
              </span>
            </div>
            <input
              type="range"
              min={3}
              max={11}
              step={0.5}
              value={targetCancellationPct}
              onChange={(e) => setTargetCancellationPct(parseFloat(e.target.value))}
              className="w-full cursor-pointer h-1.5 bg-paper-deep"
            />
            <div className="flex justify-between text-[10px] text-muted font-editorial-mono">
              <span>Optimistic: 3%</span>
              <span>Current Nova Cart: 11%</span>
            </div>
          </div>

          {/* Slider 2: Repeat Purchase Rate (27% -> 32%) */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-semibold text-ink">Repeat Purchase Rate</span>
              <span className="font-editorial-mono text-ink">
                27% → <strong className="text-editorial-success text-sm">{targetRepeatPct}%</strong>
              </span>
            </div>
            <input
              type="range"
              min={27}
              max={45}
              step={1}
              value={targetRepeatPct}
              onChange={(e) => setTargetRepeatPct(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer h-1.5 bg-paper-deep"
            />
            <div className="flex justify-between text-[10px] text-muted font-editorial-mono">
              <span>Current Nova Cart: 27%</span>
              <span>Historical Peak: 41%</span>
            </div>
          </div>

          {/* Slider 3: Monthly Support Tickets (5900 -> 4800) */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-semibold text-ink">Monthly Support Inquiries</span>
              <span className="font-editorial-mono text-ink">
                5,900 → <strong className="text-editorial-success text-sm">{targetSupportTickets.toLocaleString()}</strong>
              </span>
            </div>
            <input
              type="range"
              min={2000}
              max={5900}
              step={100}
              value={targetSupportTickets}
              onChange={(e) => setTargetSupportTickets(parseInt(e.target.value, 10))}
              className="w-full cursor-pointer h-1.5 bg-paper-deep"
            />
            <div className="flex justify-between text-[10px] text-muted font-editorial-mono">
              <span>Target: 2,000</span>
              <span>Current Stressed: 5,900</span>
            </div>
          </div>

          {/* Slider 4: Monthly Promotional Burn (₹17L -> ₹12.5L) */}
          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-semibold text-ink">Monthly Promotional Budget</span>
              <span className="font-editorial-mono text-ink">
                ₹17.0L → <strong className="text-editorial-success text-sm">₹{targetPromoSpendLakhs.toFixed(1)}L</strong>
              </span>
            </div>
            <input
              type="range"
              min={8}
              max={17}
              step={0.5}
              value={targetPromoSpendLakhs}
              onChange={(e) => setTargetPromoSpendLakhs(parseFloat(e.target.value))}
              className="w-full cursor-pointer h-1.5 bg-paper-deep"
            />
            <div className="flex justify-between text-[10px] text-muted font-editorial-mono">
              <span>Efficient: ₹8.0L</span>
              <span>Current Overspend: ₹17.0L</span>
            </div>
          </div>
        </div>

        {/* Financial ROI Summary Card */}
        <div className="bg-editorial-white border-editorial p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-editorial-b pb-3 mb-4">
              <div>
                <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
                  6-MONTH RETURN ON INVESTMENT
                </span>
                <h3 className="font-editorial-heading text-lg font-bold text-ink">
                  Turnaround Capital Feasibility
                </h3>
              </div>
              <span className="font-editorial-mono text-xs font-bold bg-editorial-success/15 text-editorial-success px-2 py-0.5 border border-editorial-success/30">
                {impact.roiMultiple}x ROI
              </span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-paper border-editorial flex justify-between items-center">
                <span className="text-xs text-ink-soft">Six-Month Cumulative Benefit:</span>
                <span className="font-editorial-heading text-xl font-bold text-editorial-success">
                  ₹{formatINR(impact.sixMonthCumulativeBenefit)}
                </span>
              </div>

              <div className="p-3 bg-paper border-editorial flex justify-between items-center">
                <span className="text-xs text-ink-soft">Implementation Budget:</span>
                <span className="font-editorial-heading text-lg font-bold text-ink">
                  ₹25,00,000 (₹25L)
                </span>
              </div>

              <div className="p-3 bg-paper-deep border-2 border-ink flex justify-between items-center">
                <div>
                  <span className="text-xs font-bold text-ink block">Net Economic Benefit:</span>
                  <span className="text-[10px] text-muted">Benefit minus ₹25L implementation budget</span>
                </div>
                <span className="font-editorial-heading text-2xl font-extrabold text-ink">
                  ₹{formatINR(impact.netBenefitAfterBudget)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-editorial-t text-[11px] text-muted flex items-center justify-between">
            <span>Budget Ceiling: ₹25 Lakhs / 6 Months</span>
            <span className="font-editorial-mono font-bold text-editorial-success">
              Break-even: Month 2
            </span>
          </div>
        </div>
      </div>

      {/* DETAILED PROJECTED VALUE BREAKDOWN (Section 22 Requirement) */}
      <div className="bg-editorial-white border-editorial p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-editorial-b pb-3">
          <div>
            <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
              VALUE ATTRIBUTION BREAKDOWN
            </span>
            <h3 className="font-editorial-heading text-lg font-bold text-ink">
              Monthly Operational Value Generated
            </h3>
          </div>
          <span className="text-xs font-editorial-mono text-muted">
            Total Monthly Value: <strong>₹{formatINR(impact.totalMonthlyValueDelivered)}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 bg-paper border-editorial">
            <span className="text-[10px] uppercase font-editorial-mono text-muted block mb-1">
              1. Recovered Orders
            </span>
            <div className="font-editorial-heading text-2xl font-bold text-ink">
              {impact.recoveredMonthlyOrders.toLocaleString()}
            </div>
            <div className="text-xs font-semibold text-editorial-success mt-1">
              ₹{formatINR(impact.recoveredMonthlyGMV)} GMV / mo
            </div>
            <div className="text-[10px] text-muted mt-1">
              Annualized: ₹{formatINR(impact.annualizedRecoveredGMV)}
            </div>
          </div>

          <div className="p-4 bg-paper border-editorial">
            <span className="text-[10px] uppercase font-editorial-mono text-muted block mb-1">
              2. Retention GMV Expansion
            </span>
            <div className="font-editorial-heading text-2xl font-bold text-ink">
              ₹{formatINR(impact.repeatCustomerLiftMonthlyGMV)}
            </div>
            <div className="text-xs text-muted mt-1">
              From repeat rate expansion
            </div>
            <div className="text-[10px] text-muted mt-1">
              Target: {targetRepeatPct}% cohort repeat
            </div>
          </div>

          <div className="p-4 bg-paper border-editorial">
            <span className="text-[10px] uppercase font-editorial-mono text-muted block mb-1">
              3. Support Cost Reduction
            </span>
            <div className="font-editorial-heading text-2xl font-bold text-ink">
              ₹{formatINR(impact.supportSavingsMonthly)}
            </div>
            <div className="text-xs text-muted mt-1">
              {impact.supportTicketReduction} tickets eliminated
            </div>
            <div className="text-[10px] text-muted mt-1">
              Benchmarked @ ₹180 / ticket
            </div>
          </div>

          <div className="p-4 bg-paper border-editorial">
            <span className="text-[10px] uppercase font-editorial-mono text-muted block mb-1">
              4. Promo Burn Savings
            </span>
            <div className="font-editorial-heading text-2xl font-bold text-ink">
              ₹{formatINR(impact.promotionalEfficiencyMonthlySavings)}
            </div>
            <div className="text-xs text-muted mt-1">
              Saved from blanket coupon waste
            </div>
            <div className="text-[10px] text-muted mt-1">
              Curbing 44% coupon leakage
            </div>
          </div>
        </div>
      </div>

      {/* Visible Model Assumptions (Section 13 & 22 Requirement) */}
      <div className="bg-paper-deep border-editorial p-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
          <HelpCircle className="w-3.5 h-3.5 text-muted" />
          <span>Explicit Simulation Model Assumptions & Benchmarks:</span>
        </h4>
        <ul className="space-y-1.5">
          {impact.assumptions.map((assump, idx) => (
            <li key={idx} className="text-xs text-ink-soft flex items-start space-x-2">
              <span className="font-editorial-mono text-[10px] text-muted mt-0.5">{idx + 1}.</span>
              <span>{assump}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
