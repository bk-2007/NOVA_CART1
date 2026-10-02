import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldAlert,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { CausalSignalDiagram } from "@/components/CausalSignalDiagram";
import { getOverviewData } from "@/lib/data/overview";

export const revalidate = 60; // Cache and revalidate every 60s for high efficiency

export default async function OverviewPage() {
  const data = await getOverviewData();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* 01 / EXECUTIVE DIAGNOSIS - HERO BANNER WITH VINTAGE STOREFRONT ENGRAVING */}
      <section aria-labelledby="executive-diagnosis-heading" className="border-editorial bg-editorial-white p-6 lg:p-7 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & CTA Column */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center space-x-2 text-[10px] font-editorial-mono text-muted uppercase tracking-[0.2em]">
              <span>01 / EXECUTIVE DIAGNOSIS</span>
              <span className="text-line">•</span>
              <span>HYPERLOCAL COMMERCE INTELLIGENCE</span>
            </div>

            <h1 id="executive-diagnosis-heading" className="font-editorial-heading text-4xl sm:text-5xl font-black text-ink tracking-tight leading-[1.08]">
              Growth is up.
              <br />
              <span className="text-editorial-danger italic font-normal">
                Growth quality is down.
              </span>
            </h1>

            <p className="text-xs sm:text-[13px] text-ink-soft leading-relaxed max-w-xl">
              NOVA CART expanded to 1,20,000 registered customers across 620 independent Bangalore stores. However,
              operational friction at the physical shelf has triggered an acute unit-economics breakdown: repeat retention
              plunged from 41% to 27%, while promotional burn surged to ₹17L/month attempting to mask churn.
            </p>

            <nav aria-label="Quick Navigation" className="pt-2 flex flex-wrap gap-2.5">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 px-4 py-2.5 bg-ink text-editorial-white text-xs font-medium hover:bg-ink-soft transition-colors focus-visible:outline-2 focus-visible:outline-ink"
              >
                <span>Test Customer Shopping Loop</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/operations"
                className="inline-flex items-center space-x-2 px-3.5 py-2.5 bg-paper border-editorial text-ink text-xs font-medium hover:bg-paper-deep transition-colors focus-visible:outline-2 focus-visible:outline-ink"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-editorial-danger" />
                <span>Inspect High-Risk Queue (#NC1042)</span>
              </Link>
              <Link
                href="/impact"
                className="inline-flex items-center space-x-2 px-3.5 py-2.5 bg-paper border-editorial text-ink text-xs font-medium hover:bg-paper-deep transition-colors focus-visible:outline-2 focus-visible:outline-ink"
              >
                <span>Run Impact Scenario Simulator</span>
              </Link>
            </nav>
          </div>

          {/* Right Column: Vintage Storefront Engraving */}
          <div className="lg:col-span-5 relative">
            <div className="relative border-editorial overflow-hidden bg-paper-deep shadow-xs">
              <Image
                src="/images/hero_storefront.jpg"
                alt="Vintage Neighborhood Store Engraving with Delivery Scooter"
                width={600}
                height={400}
                priority
                className="w-full h-auto object-cover grayscale contrast-110"
              />
              {/* Handwritten script overlay in sky */}
              <div className="absolute top-3 right-4 text-right pointer-events-none" aria-hidden="true">
                <span className="font-serif italic text-xs md:text-sm text-ink font-semibold tracking-wide drop-shadow-xs block leading-tight">
                  More than orders.
                </span>
                <span className="font-serif italic text-[11px] md:text-xs text-ink-soft block leading-tight">
                  A stronger local tomorrow.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM PULSE // SIX-MONTH BENCHMARK TRAJECTORY */}
      <section aria-labelledby="platform-pulse-heading" className="space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] font-editorial-mono text-muted uppercase tracking-wider">
          <span id="platform-pulse-heading">PLATFORM PULSE // SIX-MONTH BENCHMARK TRAJECTORY</span>
          <span>BASELINE: {data.monthlyOrders.toLocaleString()} MONTHLY ORDERS • ₹{data.aov} AOV</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {/* Card 1: MAU */}
          <div className="bg-editorial-white border-editorial p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] uppercase font-editorial-mono tracking-widest text-muted">
                MONTHLY ACTIVE USERS
              </span>
              <span className="text-[9px] font-editorial-mono bg-paper px-1.5 py-0.5 border border-line text-muted">
                MAU
              </span>
            </div>
            <div className="my-2">
              <span className="font-editorial-heading text-2xl lg:text-3xl font-black text-ink">
                {data.mau.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-editorial-t flex items-center justify-between text-[10.5px]">
              <span className="text-muted text-[10px]">from {data.sixMonthTrajectory.mau.previous.toLocaleString()}</span>
              <span className="font-editorial-mono text-editorial-success font-medium">↗ {data.sixMonthTrajectory.mau.change}</span>
            </div>
          </div>

          {/* Card 2: VOL */}
          <div className="bg-editorial-white border-editorial p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] uppercase font-editorial-mono tracking-widest text-muted">
                MONTHLY ORDERS
              </span>
              <span className="text-[9px] font-editorial-mono bg-paper px-1.5 py-0.5 border border-line text-muted">
                VOL
              </span>
            </div>
            <div className="my-2">
              <span className="font-editorial-heading text-2xl lg:text-3xl font-black text-ink">
                {data.monthlyOrders.toLocaleString()}
              </span>
            </div>
            <div className="pt-2 border-editorial-t flex items-center justify-between text-[10.5px]">
              <span className="text-muted text-[10px]">from {data.sixMonthTrajectory.monthlyOrders.previous.toLocaleString()}</span>
              <span className="font-editorial-mono text-editorial-success font-medium">↗ {data.sixMonthTrajectory.monthlyOrders.change}</span>
            </div>
          </div>

          {/* Card 3: RET */}
          <div className="bg-editorial-white border-editorial p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] uppercase font-editorial-mono tracking-widest text-muted">
                REPEAT PURCHASE RATE
              </span>
              <span className="text-[9px] font-editorial-mono bg-paper px-1.5 py-0.5 border border-line text-muted">
                RET
              </span>
            </div>
            <div className="my-2">
              <span className="font-editorial-heading text-2xl lg:text-3xl font-black text-ink">
                {Math.round(data.repeatPurchaseRate * 100)}%
              </span>
            </div>
            <div className="pt-2 border-editorial-t flex items-center justify-between text-[10.5px]">
              <span className="text-muted text-[10px]">plummeted from 41%</span>
              <span className="font-editorial-mono text-editorial-danger font-medium">↘ {data.sixMonthTrajectory.repeatRate.change}</span>
            </div>
          </div>

          {/* Card 4: CANC */}
          <div className="bg-editorial-white border-editorial p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] uppercase font-editorial-mono tracking-widest text-muted">
                CANCELLATION RATE
              </span>
              <span className="text-[9px] font-editorial-mono bg-paper px-1.5 py-0.5 border border-line text-muted">
                CANC
              </span>
            </div>
            <div className="my-2">
              <span className="font-editorial-heading text-2xl lg:text-3xl font-black text-ink">
                {Math.round(data.cancellationRate * 100)}%
              </span>
            </div>
            <div className="pt-2 border-editorial-t flex items-center justify-between text-[10.5px]">
              <span className="text-muted text-[10px]">doubled from 6%</span>
              <span className="font-editorial-mono text-editorial-danger font-medium">↗ {data.sixMonthTrajectory.cancellationRate.change}</span>
            </div>
          </div>

          {/* Card 5: SLA */}
          <div className="bg-editorial-white border-editorial p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] uppercase font-editorial-mono tracking-widest text-muted">
                AVERAGE DELIVERY TIME
              </span>
              <span className="text-[9px] font-editorial-mono bg-paper px-1.5 py-0.5 border border-line text-muted">
                SLA
              </span>
            </div>
            <div className="my-2">
              <span className="font-editorial-heading text-2xl lg:text-3xl font-black text-ink">
                {data.averageDeliveryMinutes}
                <span className="text-sm font-normal text-muted ml-1">min</span>
              </span>
            </div>
            <div className="pt-2 border-editorial-t flex items-center justify-between text-[10.5px]">
              <span className="text-muted text-[10px]">stretched from 29 min</span>
              <span className="font-editorial-mono text-editorial-danger font-medium">↗ {data.sixMonthTrajectory.deliveryMinutes.change}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 02 / DIAGNOSTIC ARCHITECTURE - THE SIGNAL */}
      <section aria-label="Diagnostic Causal Signal Architecture">
        <CausalSignalDiagram />
      </section>

      {/* 3-COLUMN BOTTOM SIGNALS */}
      <section aria-label="Empirical Platform Signals" className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Column 1: CUSTOMER SIGNALS */}
        <div className="bg-editorial-white border-editorial p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-editorial-b pb-2 mb-3">
              <div>
                <h3 className="font-editorial-heading font-bold text-xs uppercase text-ink tracking-wider">
                  CUSTOMER SIGNALS
                </h3>
                <p className="text-[10px] text-muted">From a survey of 2,000 active and inactive customers</p>
              </div>
              <Link href="/customers" className="text-[10.5px] text-muted hover:text-ink font-medium shrink-0 focus-visible:outline-ink">
                View all →
              </Link>
            </div>

            <div className="space-y-2.5">
              {[
                { pct: "38%", label: "Prices/fees feel higher than expected", barClass: "bg-[#7A453F] w-[38%]" },
                { pct: "34%", label: "Delivery takes too long", barClass: "bg-[#8E5851] w-[34%]" },
                { pct: "29%", label: "Products become unavailable after ordering", barClass: "bg-[#A7726A] w-[29%]" },
                { pct: "24%", label: "Discounts are confusing", barClass: "bg-[#BCA18A] w-[24%]" },
                { pct: "21%", label: "Prefer purchasing directly from nearby stores", barClass: "bg-[#CFC3B3] w-[21%]" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs">
                  <span className="font-editorial-mono font-bold text-ink w-8 shrink-0">{item.pct}</span>
                  <div className="w-14 bg-paper h-2 shrink-0 border border-line" aria-hidden="true">
                    <div className={`h-full ${item.barClass}`}></div>
                  </div>
                  <span className="text-[11px] text-ink-soft truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 2: OPERATIONS METRICS */}
        <div className="bg-editorial-white border-editorial p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-editorial-b pb-2 mb-3">
              <div>
                <h3 className="font-editorial-heading font-bold text-xs uppercase text-ink tracking-wider">
                  OPERATIONS METRICS
                </h3>
                <p className="text-[10px] text-muted">Recent order data shows:</p>
              </div>
              <Link href="/operations" className="text-[10.5px] text-muted hover:text-ink font-medium shrink-0 focus-visible:outline-ink">
                View details →
              </Link>
            </div>

            <div className="space-y-2.5">
              {[
                { pct: "11%", label: "Cancelled orders", barClass: "bg-[#7A453F] w-[45%]" },
                { pct: "13%", label: "Delivered > 15 min late", barClass: "bg-[#8E5851] w-[55%]" },
                { pct: "8%", label: "Contained substituted items", barClass: "bg-[#BCA18A] w-[35%]" },
                { pct: "6%", label: "Required refund/support interaction", barClass: "bg-[#CFC3B3] w-[25%]" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs">
                  <span className="font-editorial-mono font-bold text-ink w-8 shrink-0">{item.pct}</span>
                  <div className="w-14 bg-paper h-2 shrink-0 border border-line" aria-hidden="true">
                    <div className={`h-full ${item.barClass}`}></div>
                  </div>
                  <span className="text-[11px] text-ink-soft truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Column 3: PARTNER STORE SIGNALS */}
        <div className="bg-editorial-white border-editorial p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center border-editorial-b pb-2 mb-3">
              <div>
                <h3 className="font-editorial-heading font-bold text-xs uppercase text-ink tracking-wider">
                  PARTNER STORE SIGNALS
                </h3>
                <p className="text-[10px] text-muted">From interviews with 100 partner stores</p>
              </div>
              <Link href="/stores" className="text-[10.5px] text-muted hover:text-ink font-medium shrink-0 focus-visible:outline-ink">
                View all →
              </Link>
            </div>

            <div className="space-y-2.5">
              {[
                { pct: "39%", label: "Inventory maintenance requires too much effort", barClass: "bg-[#7A453F] w-[39%]" },
                { pct: "31%", label: "Promotions reduce their margins", barClass: "bg-[#8E5851] w-[31%]" },
                { pct: "28%", label: "Struggle to predict online demand", barClass: "bg-[#A7726A] w-[28%]" },
                { pct: "23%", label: "Occasionally reject orders during busy periods", barClass: "bg-[#BCA18A] w-[23%]" },
                { pct: "18%", label: "Considering leaving the platform", barClass: "bg-[#CFC3B3] w-[18%]" },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-2 text-xs">
                  <span className="font-editorial-mono font-bold text-ink w-8 shrink-0">{item.pct}</span>
                  <div className="w-14 bg-paper h-2 shrink-0 border border-line" aria-hidden="true">
                    <div className={`h-full ${item.barClass}`}></div>
                  </div>
                  <span className="text-[11px] text-ink-soft truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
