"use client";

import React, { useState, useEffect } from "react";
import {
  Boxes,
  AlertTriangle,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Filter,
  Check,
  Clock,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

export default function InventoryPage() {
  const [data, setData] = useState<{ summary: any; items: any[] } | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchInventory = async (currentFilter: string) => {
    setLoading(true);
    try {
      const url = new URL("/api/inventory", window.location.origin);
      if (currentFilter !== "all") url.searchParams.set("filter", currentFilter);

      const res = await fetch(url.toString());
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Inventory fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory(filter);
  }, [filter]);

  // Handle immediate inventory audit update
  const handleUpdateStock = async (
    item: any,
    newStock: number,
    newStatus: string,
    markVerified = true
  ) => {
    setUpdatingId(item.id);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/inventory", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeId: item.storeId,
          productId: item.productId,
          stockLevel: newStock,
          status: newStatus,
          markVerifiedNow: markVerified,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Update failed");

      // Update local state immediately with recalculated confidence
      setData((prev) => {
        if (!prev) return prev;
        const updatedItems = prev.items.map((i) =>
          i.id === item.id
            ? {
                ...i,
                stockLevel: json.data.item.stockLevel,
                status: json.data.item.status,
                lastAuditedAt: json.data.item.lastAuditedAt,
                confidence: json.data.item.confidence,
                riskLevel: json.data.item.riskLevel,
                reasons: json.data.item.reasons,
                isStale: json.data.item.isStale,
                hoursSinceAudit: json.data.item.hoursSinceAudit,
              }
            : i
        );

        return {
          ...prev,
          items: updatedItems,
        };
      });

      setStatusMessage(
        `✓ Updated ${item.productName}: Confidence recalculated to ${json.data.item.confidence}%`
      );
      setTimeout(() => setStatusMessage(null), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to update inventory");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredItems = (data?.items ?? []).filter((item) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      item.productName.toLowerCase().includes(q) ||
      item.brand.toLowerCase().includes(q) ||
      item.storeName.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="border-editorial-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
            03 / INVENTORY HEALTH & AUDIT GOVERNANCE
          </div>
          <h1 className="font-editorial-heading text-2xl md:text-3xl font-bold text-ink">
            Hyperlocal Inventory Intelligence
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Real-time on-shelf audit tracking. Updating physical stock immediately recalculates customer availability confidence.
          </p>
        </div>

        <button
          onClick={() => fetchInventory(filter)}
          className="flex items-center space-x-1.5 px-3 py-1.5 border-editorial bg-editorial-white text-xs hover:bg-paper transition-colors self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Audits</span>
        </button>
      </div>

      {/* Status Feedback Toast */}
      {statusMessage && (
        <div className="p-3 bg-editorial-success/15 border border-editorial-success text-editorial-success text-xs font-medium flex items-center justify-between shadow-2xs">
          <span>{statusMessage}</span>
          <span className="text-[10px] uppercase font-editorial-mono">Live Sync</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Monitored Shelf SKUs"
          value={data?.summary?.totalMonitoredItems ?? "..."}
          subtitle="Across 12 partner stores"
          code="SKU"
        />
        <MetricCard
          label="Stale Audits (>24h)"
          value={data?.summary?.staleAuditsCount ?? "..."}
          subtitle="Require shelf count"
          isNegative={true}
          change="39% of stores"
          code="STALE"
        />
        <MetricCard
          label="High Risk Items (<50%)"
          value={data?.summary?.highRiskItemsCount ?? "..."}
          subtitle="Potential order cancellations"
          isNegative={true}
          code="RISK"
        />
        <MetricCard
          label="Avg Availability Confidence"
          value={data?.summary?.averageConfidence ?? "..."}
          suffix="%"
          subtitle="Deterministic shelf probability"
          code="CONF"
        />
      </div>

      {/* Controls & Filters */}
      <div className="bg-editorial-white border-editorial p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by product name, brand, store, or category..."
              className="w-full pl-9 pr-3 py-1.5 bg-paper text-xs text-ink placeholder:text-muted border-editorial focus:outline-none focus:border-ink"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1">
            <span className="text-[11px] font-editorial-mono text-muted uppercase shrink-0">Filter:</span>
            {[
              { id: "all", label: "All Items" },
              { id: "stale", label: "Stale Audits (>24h)" },
              { id: "high_risk", label: "High Risk (<50%)" },
              { id: "low_stock", label: "Low Stock" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 text-xs border shrink-0 ${
                  filter === tab.id
                    ? "bg-ink text-editorial-white border-ink font-medium"
                    : "bg-paper text-ink-soft border-editorial hover:bg-paper-deep"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-editorial-white border-editorial shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs text-ink border-collapse">
          <thead>
            <tr className="border-editorial-b bg-paper-deep/60 text-[10px] font-editorial-mono uppercase tracking-wider text-muted">
              <th className="py-3 px-4">Product / SKU</th>
              <th className="py-3 px-4">Partner Store</th>
              <th className="py-3 px-4">Physical Stock</th>
              <th className="py-3 px-4">Last Audited</th>
              <th className="py-3 px-4">Availability Confidence</th>
              <th className="py-3 px-4 text-right">Quick Store Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-muted text-xs">
                  {loading ? "Loading inventory audit records..." : "No inventory records matched your filters."}
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => {
                const isUpdating = updatingId === item.id;

                return (
                  <tr
                    key={item.id}
                    className={`hover:bg-paper/50 transition-colors ${
                      item.isStale ? "bg-editorial-danger/5" : ""
                    }`}
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-ink">{item.productName}</div>
                      <div className="text-[10px] text-muted font-editorial-mono">
                        {item.brand} • {item.unit} • ₹{item.price}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-ink font-medium">{item.storeName}</div>
                      <div className="text-[10px] text-muted">{item.storeLocality}</div>
                    </td>

                    <td className="py-3.5 px-4 font-editorial-mono">
                      <span
                        className={`font-bold ${
                          item.stockLevel <= item.safetyStock
                            ? "text-editorial-danger"
                            : "text-ink"
                        }`}
                      >
                        {item.stockLevel} units
                      </span>
                      <span className="text-[10px] text-muted block">
                        Buffer: {item.safetyStock}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-muted" />
                        <span className="font-editorial-mono">
                          {item.hoursSinceAudit < 1
                            ? "Verified fresh (<1h)"
                            : `${item.hoursSinceAudit}h ago`}
                        </span>
                      </div>
                      {item.isStale && (
                        <span className="inline-block mt-0.5 text-[9px] font-editorial-mono bg-editorial-danger/15 text-editorial-danger px-1 py-0.2 border border-editorial-danger/30 font-semibold">
                          STALE AUDIT
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <ConfidenceBadge
                        confidence={item.confidence}
                        riskLevel={item.riskLevel}
                        reasons={item.reasons}
                        isStale={item.isStale}
                      />
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        {/* Quick Audit / Restock Button */}
                        <button
                          onClick={() => handleUpdateStock(item, Math.max(item.stockLevel, 20), "IN_STOCK", true)}
                          disabled={isUpdating}
                          title="Verify full shelf stock & reset audit clock"
                          className="px-2.5 py-1 bg-paper border-editorial text-[11px] font-medium text-ink hover:bg-paper-deep disabled:opacity-50"
                        >
                          {isUpdating ? "..." : "Verify (20 Units)"}
                        </button>

                        {/* Mark Out of Stock */}
                        <button
                          onClick={() => handleUpdateStock(item, 0, "OUT_OF_STOCK", true)}
                          disabled={isUpdating}
                          title="Mark physically absent on shelf"
                          className="px-2 py-1 border border-editorial-danger/30 text-editorial-danger text-[11px] hover:bg-editorial-danger/10 disabled:opacity-50"
                        >
                          Mark 0
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="p-4 bg-paper-deep border-editorial text-xs text-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>
          <strong>Audit Rule:</strong> Partner kiranas that update physical inventory every morning increase customer order fulfillment confidence from 42% to 94%.
        </span>
        <span className="font-editorial-mono text-[10px]">
          NOVA CART ENGINE V2.4 • DETERMINISTIC SCORING
        </span>
      </div>
    </div>
  );
}
