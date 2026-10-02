"use client";

import React, { useState } from "react";
import {
  Package,
  AlertTriangle,
  X,
  Headset,
  Frown,
  Users,
  ArrowDown,
  ArrowRight,
} from "lucide-react";

interface SignalNode {
  id: string;
  name: string;
  icon: React.ElementType;
  cause: string;
  evidence: string;
  mechanism: string;
  businessEffect: string;
  recommendedIntervention: string;
}

const signalNodes: SignalNode[] = [
  {
    id: "stale-inventory",
    name: "Stale Inventory",
    icon: Package,
    cause: "Unverified shelf counts & manual store updates",
    evidence: "39% of partner stores state inventory maintenance requires too much daily effort.",
    mechanism: "Store owners do not audit physical stock during busy morning periods. App shows phantom stock while counter customers purchase items.",
    businessEffect: "Digital catalog drifts from physical shelf reality within 4-6 hours.",
    recommendedIntervention: "Implement morning 60-second store verification cycles with availability confidence decay.",
  },
  {
    id: "product-unavailable",
    name: "Product Unavailable",
    icon: AlertTriangle,
    cause: "Physical stock-out on shelf",
    evidence: "35% of cancellations are caused by unavailable products.",
    mechanism: "Inventory is manually updated by stores. Some stores update stock only once every 1–3 days.",
    businessEffect: "Higher cancellation → refund requests → support load → customer churn.",
    recommendedIntervention: "Increase inventory confidence before increasing customer acquisition.",
  },
  {
    id: "order-cancellation",
    name: "Order Cancellation",
    icon: X,
    cause: "Runner arrives at store to find items missing",
    evidence: "Cancellation rate surged from 6% to 11% (+83% over six months).",
    mechanism: "When a runner arrives and cannot find the product, store merchant rejects or runner triggers customer cancellation.",
    businessEffect: "Platform absorbs runner trip fee; merchant relationship strained; customer basket aborted.",
    recommendedIntervention: "Pre-checkout alternative recommendation engine suggesting nearby in-stock substitutes.",
  },
  {
    id: "refund-support",
    name: "Refund / Support",
    icon: Headset,
    cause: "Delayed refund processing and order disputes",
    evidence: "Monthly support tickets surged from 3,100 to 5,900 (+90.3%).",
    mechanism: "16% of customer signals cite refund delays on cancelled orders; 13% delivered >15 min late while runners hunt for items.",
    businessEffect: "Support handling costs escalate to ₹180 per ticket; negative customer sentiment compounding.",
    recommendedIntervention: "Real-time Operations Risk Engine prioritizing high-risk orders (#NC1042) for automated resolution.",
  },
  {
    id: "customer-frustration",
    name: "Customer Frustration",
    icon: Frown,
    cause: "Failed grocery promise and delivery delays",
    evidence: "38% cite unexpected fees; 34% cite delivery taking too long; 29% report phantom availability.",
    mechanism: "Quick-commerce customers relying on critical staple ingredients experience severe inconvenience when orders fail.",
    businessEffect: "Brand equity erodes; 21% of users revert to walking directly to local neighborhood stores.",
    recommendedIntervention: "Transparent availability confidence display so customers never order at-risk products blindly.",
  },
  {
    id: "second-order-failure",
    name: "Second Order Failure",
    icon: Users,
    cause: "Failure to cross the critical 30-day second purchase hurdle",
    evidence: "Only 31% of first-order customers place a second order within 30 days.",
    mechanism: "Acquisition subsidies attract trial users, but first-order fulfillment friction prevents repeat habit formation.",
    businessEffect: "High Customer Acquisition Cost (CAC) burned without Lifetime Value (LTV) realization.",
    recommendedIntervention: "Targeted ₹40 retention incentives deployed specifically to 30-day trial dropoffs.",
  },
  {
    id: "retention-decline",
    name: "Retention Decline",
    icon: ArrowDown,
    cause: "Platform cohort attrition and reliance on unsustainable discounts",
    evidence: "Repeat purchase rate collapsed from 41% to 27% (-34.1%).",
    mechanism: "Platform burns ₹17L/month in promotions attempting to mask churn, but 44% of generic coupons are never redeemed.",
    businessEffect: "Unit economics become deeply negative; partner stores report margin erosion and threaten departure.",
    recommendedIntervention: "Reallocate blanket discount burn into inventory reliability and targeted cohort incentives.",
  },
];

export function CausalSignalDiagram() {
  const [selectedId, setSelectedId] = useState<string>("product-unavailable");
  const activeNode = signalNodes.find((n) => n.id === selectedId) || signalNodes[1];

  return (
    <div className="bg-editorial-white border-editorial p-6 shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-editorial-b gap-2">
        <div>
          <span className="text-[10px] font-editorial-mono uppercase tracking-[0.2em] text-muted">
            02 / DIAGNOSTIC ARCHITECTURE
          </span>
          <h2 className="font-editorial-heading text-lg md:text-xl font-bold text-ink">
            THE SIGNAL: The Hyperlocal Operational Breakdown
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Do not treat symptoms in isolation. Click any link in the chain to inspect the causal mechanics.
          </p>
        </div>

        <div className="flex items-center space-x-1.5 px-3 py-1 bg-paper border border-line text-editorial-danger text-[10.5px] font-editorial-mono font-medium self-start sm:self-auto">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>CASCADE DIAGNOSIS ACTIVE</span>
        </div>
      </div>

      {/* Main Grid: Horizontal Chain on Left, Detail Card on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
        {/* Horizontal Chain (7 nodes connected by arrows) */}
        <div className="lg:col-span-8 overflow-x-auto pb-4 pt-2">
          <div className="flex items-center min-w-[620px] justify-between px-2">
            {signalNodes.map((node, index) => {
              const isSelected = selectedId === node.id;
              const Icon = node.icon;

              return (
                <React.Fragment key={node.id}>
                  <div
                    onClick={() => setSelectedId(node.id)}
                    className="flex flex-col items-center cursor-pointer group text-center select-none"
                  >
                    {/* Circle Node */}
                    <div
                      className={`w-13 h-13 rounded-full flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-2 border-editorial-danger bg-editorial-white text-editorial-danger shadow-md scale-110 ring-4 ring-editorial-danger/10"
                          : "border border-ink text-ink bg-editorial-white hover:border-editorial-danger hover:text-editorial-danger hover:scale-105"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Label below */}
                    <span
                      className={`text-[11px] font-medium mt-2 max-w-[80px] leading-tight transition-colors ${
                        isSelected
                          ? "text-ink font-bold"
                          : "text-ink-soft group-hover:text-ink"
                      }`}
                    >
                      {node.name}
                    </span>
                  </div>

                  {/* Arrow between nodes */}
                  {index < signalNodes.length - 1 && (
                    <div className="text-muted/60 px-1 -mt-5">
                      <ArrowRight className="w-4 h-4 stroke-[1.5]" />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Vertical Detail Panel on Right */}
        <div className="lg:col-span-4 bg-paper/60 border-editorial p-4 space-y-3 text-xs">
          <div className="border-editorial-b pb-2">
            <span className="text-[9.5px] uppercase font-editorial-mono text-muted tracking-widest block">
              CAUSE
            </span>
            <div className="font-editorial-heading font-bold text-ink text-sm mt-0.5">
              {activeNode.cause}
            </div>
          </div>

          <div>
            <span className="text-[9.5px] uppercase font-editorial-mono text-muted tracking-widest block font-medium">
              EVIDENCE
            </span>
            <p className="text-ink-soft text-[11px] leading-relaxed mt-0.5">
              {activeNode.evidence}
            </p>
          </div>

          <div>
            <span className="text-[9.5px] uppercase font-editorial-mono text-muted tracking-widest block font-medium">
              MECHANISM
            </span>
            <p className="text-ink-soft text-[11px] leading-relaxed mt-0.5">
              {activeNode.mechanism}
            </p>
          </div>

          <div>
            <span className="text-[9.5px] uppercase font-editorial-mono text-muted tracking-widest block font-medium">
              BUSINESS EFFECT
            </span>
            <p className="text-editorial-danger text-[11px] font-medium leading-relaxed mt-0.5">
              {activeNode.businessEffect}
            </p>
          </div>

          <div className="pt-2 border-editorial-t">
            <span className="text-[9.5px] uppercase font-editorial-mono text-editorial-success tracking-widest block font-bold">
              RECOMMENDED INTERVENTION
            </span>
            <p className="text-ink text-[11px] font-medium leading-relaxed mt-0.5">
              {activeNode.recommendedIntervention}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
