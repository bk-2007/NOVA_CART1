"use client";

import React, { useState, useEffect } from "react";
import {
  Store,
  AlertTriangle,
  CheckCircle2,
  Clock,
  TrendingDown,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

export default function StoresPage() {
  const [stores, setStores] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStore, setSelectedStore] = useState<any | null>(null);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stores");
      const json = await res.json();
      if (json.success) {
        setStores(json.data);
        if (json.data.length > 0 && !selectedStore) {
          setSelectedStore(json.data[0]);
        }
      }
    } catch (err) {
      console.error("Store fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="border-editorial-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
            04 / MERCHANT INTELLIGENCE & STORE HEALTH
          </div>
          <h1 className="font-editorial-heading text-2xl md:text-3xl font-bold text-ink">
            Partner Store Operations & Fulfillment
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Monitoring physical kirana fulfillment reliability, order rejection rates, and shelf sync velocity across Bangalore.
          </p>
        </div>

        <button
          onClick={fetchStores}
          className="flex items-center space-x-1.5 px-3 py-1.5 border-editorial bg-editorial-white text-xs hover:bg-paper self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Merchants</span>
        </button>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Partner Network"
          value="620"
          subtitle="12 Localities Monitored"
          code="STORES"
        />
        <MetricCard
          label="Avg Fulfillment Rate"
          value="89%"
          subtitle="Target threshold: >95%"
          isNegative={true}
          change="-6% vs 6m ago"
          code="FULFILL"
        />
        <MetricCard
          label="Avg Rejection Rate"
          value="8.4%"
          subtitle="Surges to 23% during rush"
          isNegative={true}
          code="REJECT"
        />
        <MetricCard
          label="Average Pick Time"
          value="14.2"
          suffix="min"
          subtitle="Platform benchmark: 8 min"
          code="PICK"
        />
      </div>

      {/* Master-Detail Store Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store List */}
        <div className="lg:col-span-1 bg-editorial-white border-editorial shadow-sm overflow-hidden flex flex-col h-[650px]">
          <div className="p-3 border-editorial-b bg-paper-deep/60 text-[10px] font-editorial-mono uppercase tracking-wider text-muted flex justify-between">
            <span>Local Partner Stores</span>
            <span>{stores.length} Tracked</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-line">
            {stores.map((s) => {
              const isSelected = selectedStore?.id === s.id;
              const isCritical = s.healthGrade === "CRITICAL";

              return (
                <div
                  key={s.id}
                  onClick={() => setSelectedStore(s)}
                  className={`p-3.5 cursor-pointer transition-colors flex items-center justify-between ${
                    isSelected
                      ? "bg-paper-deep border-l-4 border-l-ink"
                      : "hover:bg-paper/50"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-semibold text-xs text-ink">{s.name}</h4>
                    </div>
                    <p className="text-[11px] text-muted">
                      {s.locality} • ⭐ {s.rating}
                    </p>

                    <div className="flex items-center space-x-2 text-[10px] font-editorial-mono">
                      <span className="text-muted">Fulfill: {s.historicalFulfillmentRate}%</span>
                      <span className="text-line">•</span>
                      <span className={s.rejectionRate > 10 ? "text-editorial-danger font-semibold" : "text-muted"}>
                        Rej: {s.rejectionRate}%
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span
                      className={`text-[9px] font-editorial-mono px-1.5 py-0.5 uppercase tracking-wider font-semibold ${
                        isCritical
                          ? "bg-editorial-danger text-editorial-white"
                          : "bg-editorial-success/15 text-editorial-success"
                      }`}
                    >
                      Grade {s.healthGrade}
                    </span>
                    <ChevronRight className="w-3.5 h-3.5 text-muted" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Store Drilldown */}
        <div className="lg:col-span-2 space-y-4">
          {selectedStore ? (
            <div className="bg-editorial-white border-editorial p-6 shadow-sm space-y-5">
              {/* Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between border-editorial-b pb-4 gap-2">
                <div>
                  <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
                    MERCHANT RECORD // {selectedStore.id.toUpperCase()}
                  </span>
                  <h3 className="font-editorial-heading text-xl font-bold text-ink">
                    {selectedStore.name}
                  </h3>
                  <p className="text-xs text-muted mt-0.5">
                    {selectedStore.address} ({selectedStore.locality})
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  <span
                    className={`text-xs px-2.5 py-1 font-editorial-mono font-bold ${
                      selectedStore.healthGrade === "CRITICAL"
                        ? "bg-editorial-danger text-editorial-white"
                        : "bg-paper border-editorial text-ink"
                    }`}
                  >
                    HEALTH STATUS: {selectedStore.healthGrade}
                  </span>
                </div>
              </div>

              {/* Performance Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-paper border-editorial">
                  <span className="text-[10px] uppercase font-editorial-mono text-muted block">
                    Fulfillment Rate
                  </span>
                  <div className="font-editorial-heading text-xl font-bold text-ink mt-0.5">
                    {selectedStore.historicalFulfillmentRate}%
                  </div>
                  <span className="text-[10px] text-muted">Historical benchmark</span>
                </div>

                <div className="p-3 bg-paper border-editorial">
                  <span className="text-[10px] uppercase font-editorial-mono text-muted block">
                    Order Rejection
                  </span>
                  <div
                    className={`font-editorial-heading text-xl font-bold mt-0.5 ${
                      selectedStore.rejectionRate > 10 ? "text-editorial-danger" : "text-ink"
                    }`}
                  >
                    {selectedStore.rejectionRate}%
                  </div>
                  <span className="text-[10px] text-muted">Peak rush drop-rate</span>
                </div>

                <div className="p-3 bg-paper border-editorial">
                  <span className="text-[10px] uppercase font-editorial-mono text-muted block">
                    Delivery SLA
                  </span>
                  <div className="font-editorial-heading text-xl font-bold text-ink mt-0.5">
                    ~{selectedStore.avgDeliveryMinutes} min
                  </div>
                  <span className="text-[10px] text-muted">Average door-to-door</span>
                </div>
              </div>

              {/* Shelf Audit Status */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-2">
                  Shelf Audit Health Breakdown:
                </h4>
                <div className="grid grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-paper border-editorial">
                    <span className="text-muted block text-[11px]">Total Stocked SKUs</span>
                    <span className="font-bold text-base text-ink">
                      {selectedStore.inventoryHealth.totalProductsStocked}
                    </span>
                  </div>
                  <div className="p-3 bg-editorial-danger/10 border border-editorial-danger/30">
                    <span className="text-editorial-danger block text-[11px]">Stale Audits (&gt;24h)</span>
                    <span className="font-bold text-base text-editorial-danger">
                      {selectedStore.inventoryHealth.staleItemsCount} SKUs
                    </span>
                  </div>
                  <div className="p-3 bg-paper border-editorial">
                    <span className="text-muted block text-[11px]">Out of Stock</span>
                    <span className="font-bold text-base text-ink">
                      {selectedStore.inventoryHealth.outOfStockCount} SKUs
                    </span>
                  </div>
                </div>
              </div>

              {/* Products Needing Immediate Updates */}
              {selectedStore.productsNeedingUpdate.length > 0 && (
                <div className="border-editorial-t pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-editorial-danger" />
                    <span>Stale Shelf Items Requiring Verification:</span>
                  </h4>
                  <div className="divide-y divide-line border-editorial bg-paper">
                    {selectedStore.productsNeedingUpdate.map((prod: any) => (
                      <div
                        key={prod.productId}
                        className="p-2.5 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-medium text-ink">{prod.productName}</span>
                          <span className="text-[10px] text-muted font-editorial-mono block">
                            Audited {prod.hoursSinceAudit}h ago • Stock: {prod.stockLevel} units
                          </span>
                        </div>
                        <span className="text-[10px] font-editorial-mono bg-editorial-danger/15 text-editorial-danger px-1.5 py-0.5 border border-editorial-danger/30 font-semibold">
                          AUDIT EXPIRED
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* High Demand Unavailable Products */}
              {selectedStore.highDemandUnavailable.length > 0 && (
                <div className="border-editorial-t pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink mb-2">
                    High Demand Out-of-Stock SKUs:
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedStore.highDemandUnavailable.map((item: any) => (
                      <span
                        key={item.productId}
                        className="text-[11px] bg-paper-deep border-editorial px-2.5 py-1 text-ink-soft"
                      >
                        {item.productName} ({item.category})
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-muted bg-editorial-white border-editorial text-xs">
              Select a partner store to inspect operational reliability diagnostics.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
