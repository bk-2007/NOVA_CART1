"use client";

import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  User,
  Store,
  ArrowRight,
  ShieldCheck,
  FileText,
  BadgeAlert,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

export default function OperationsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [resolutionNotice, setResolutionNotice] = useState<string | null>(null);

  const fetchOperationsData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/operations");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (err) {
      console.error("Operations fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOperationsData();
  }, []);

  const handleResolveOrder = async (orderId: string, orderNumber: string) => {
    setResolvingId(orderId);
    setResolutionNotice(null);

    try {
      const res = await fetch("/api/operations/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId,
          resolutionAction: "OFFERED_ALTERNATIVE",
          notes: "Confirmed Mother Dairy fresh milk substitute with customer; assigned express VIP runner",
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Resolution failed");

      // Update state locally immediately
      setData((prev: any) => {
        if (!prev) return prev;
        const updatedQueue = prev.priorityQueue.map((ord: any) =>
          ord.id === orderId
            ? {
                ...ord,
                status: "ACCEPTED",
                riskLevel: "LOW",
                riskScore: 20,
                resolutionAction: "OFFERED_ALTERNATIVE",
                resolvedAt: new Date().toISOString(),
              }
            : ord
        );

        return {
          ...prev,
          priorityQueue: updatedQueue,
          stats: {
            ...prev.stats,
            highRiskPendingCount: Math.max(0, prev.stats.highRiskPendingCount - 1),
          },
        };
      });

      setResolutionNotice(
        `✓ Order #${orderNumber} successfully resolved: Substitute verified & risk cleared.`
      );
      setTimeout(() => setResolutionNotice(null), 5000);
    } catch (err: any) {
      alert(err.message || "Failed to resolve order");
    } finally {
      setResolvingId(null);
    }
  };

  const priorityQueue = data?.priorityQueue ?? [];
  const stats = data?.stats ?? {};
  const refundDisputes = data?.refundDisputes ?? [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="border-editorial-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
            05 / OPERATIONS CONTROL CENTER
          </div>
          <h1 className="font-editorial-heading text-2xl md:text-3xl font-bold text-ink">
            Hyperlocal Dispatch & Risk Intervention Queue
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Intercepting fulfillment friction, missing shelf stock, and delivery delays before customer dissatisfaction.
          </p>
        </div>

        <button
          onClick={fetchOperationsData}
          className="flex items-center space-x-1.5 px-3 py-1.5 border-editorial bg-editorial-white text-xs hover:bg-paper self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Resolution Toast */}
      {resolutionNotice && (
        <div className="p-3 bg-editorial-success text-editorial-white text-xs font-medium flex items-center justify-between shadow-md">
          <span>{resolutionNotice}</span>
          <span className="text-[10px] font-editorial-mono uppercase">Order State Updated Live</span>
        </div>
      )}

      {/* Operational KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Active Dispatches"
          value={stats.totalActiveOrders ?? "..."}
          subtitle="Orders in fulfillment lifecycle"
          code="QUEUE"
        />
        <MetricCard
          label="High Risk Pending"
          value={stats.highRiskPendingCount ?? "..."}
          subtitle="Requires immediate agent intervention"
          isNegative={true}
          change="Action Required"
          code="HIGH"
        />
        <MetricCard
          label="Delivery Delays (>15m)"
          value={stats.delayedOrdersCount ?? "..."}
          subtitle="13% benchmark exceedance"
          isNegative={true}
          code="DELAY"
        />
        <MetricCard
          label="Open Refund Disputes"
          value={stats.openRefundDisputesCount ?? "..."}
          subtitle="Support ticket escalation"
          isNegative={true}
          code="REFUND"
        />
      </div>

      {/* PRIORITY QUEUE: Section 19 Requirement */}
      <div className="bg-editorial-white border-editorial shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-editorial-b pb-3">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-editorial-danger animate-ping inline-block"></span>
            <h3 className="font-editorial-heading text-lg font-bold text-ink">
              Priority Order Queue // High Risk Focus
            </h3>
          </div>
          <span className="text-[10px] font-editorial-mono text-muted uppercase">
            Sorted by Risk Severity (High → Low)
          </span>
        </div>

        <div className="space-y-4">
          {priorityQueue.map((order: any) => {
            const isHighRisk = order.riskLevel === "HIGH";
            const isNC1042 = order.orderNumber === "NC1042";
            const isPending = order.status === "PENDING";
            const isResolving = resolvingId === order.id;
            let factors: string[] = [];
            try {
              factors = typeof order.riskFactors === "string" ? JSON.parse(order.riskFactors) : order.riskFactors || [];
            } catch (e) {
              factors = [];
            }

            return (
              <div
                key={order.id}
                className={`p-5 border transition-all ${
                  isHighRisk && isPending
                    ? "bg-editorial-danger/5 border-2 border-editorial-danger shadow-md"
                    : order.resolutionAction
                    ? "bg-editorial-success/5 border-editorial-success/40"
                    : "bg-paper border-editorial"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Order metadata & Risk details */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="font-editorial-mono font-bold text-base text-ink">
                        Order #{order.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-editorial-mono px-2 py-0.5 uppercase tracking-wider font-bold ${
                          isHighRisk
                            ? "bg-editorial-danger text-editorial-white"
                            : order.riskLevel === "MEDIUM"
                            ? "bg-editorial-warning text-editorial-white"
                            : "bg-editorial-success text-editorial-white"
                        }`}
                      >
                        {order.riskLevel} RISK ({order.riskScore}/100)
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 bg-paper border border-line text-ink">
                        Status: {order.status}
                      </span>
                    </div>

                    {/* Customer & Store Link */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-ink-soft">
                      <span className="flex items-center gap-1 font-medium">
                        <User className="w-3.5 h-3.5 text-muted" />
                        {order.customer.name} ({order.customer.behavior?.segment || "CUSTOMER"})
                      </span>
                      <span className="text-line">•</span>
                      <span className="flex items-center gap-1">
                        <Store className="w-3.5 h-3.5 text-muted" />
                        {order.store.name} ({order.store.locality})
                      </span>
                      <span className="text-line">•</span>
                      <span className="font-bold text-ink">₹{order.totalAmount}</span>
                    </div>

                    {/* Risk Diagnosis */}
                    <div className="bg-editorial-white p-3 border-editorial text-xs space-y-1">
                      <span className="text-[10px] uppercase font-editorial-mono text-muted tracking-wider block font-semibold">
                        Identified Fulfillment Vulnerabilities:
                      </span>
                      {factors.length > 0 ? (
                        factors.map((f, i) => (
                          <div key={i} className="text-ink-soft flex items-start space-x-1.5">
                            <span className="text-editorial-danger">•</span>
                            <span>{f}</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-muted">Standard operational parameters verified</div>
                      )}
                    </div>

                    {/* Resolution Status if already resolved */}
                    {order.resolutionAction && (
                      <div className="text-xs text-editorial-success font-medium flex items-center space-x-1.5 bg-editorial-success/10 p-2 border border-editorial-success/30">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Resolved by Agent: {order.resolutionAction} ({order.resolutionNotes})</span>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Recommended Action & Interactive Resolve Button */}
                  <div className="flex flex-col justify-between items-start lg:items-end gap-3 self-stretch lg:self-center border-editorial-t lg:border-editorial-t-0 lg:border-editorial-l pt-3 lg:pt-0 lg:pl-6">
                    <div className="text-left lg:text-right">
                      <span className="text-[10px] uppercase font-editorial-mono text-muted block">
                        Engine Recommendation:
                      </span>
                      <span className="text-xs font-semibold text-ink block mt-0.5">
                        {isHighRisk
                          ? "Offer In-Stock Local Alternative"
                          : "Expedite Nearest Batch Runner"}
                      </span>
                    </div>

                    {isPending ? (
                      <button
                        onClick={() => handleResolveOrder(order.id, order.orderNumber)}
                        disabled={isResolving}
                        className="px-4 py-2 bg-ink text-editorial-white text-xs font-medium hover:bg-ink-soft transition-colors flex items-center space-x-2 disabled:opacity-50"
                      >
                        <ShieldCheck className="w-4 h-4 text-editorial-warning" />
                        <span>{isResolving ? "Resolving..." : "Resolve Order Risk"}</span>
                      </button>
                    ) : (
                      <div className="px-3 py-1.5 bg-paper border-editorial text-xs text-muted flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-editorial-success" />
                        <span>Action Completed</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Refund & Support Ticket Queue */}
      <div className="bg-editorial-white border-editorial p-6 shadow-sm">
        <div className="flex justify-between items-center border-editorial-b pb-3 mb-4">
          <div>
            <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
              SUPPORT FRICTION
            </span>
            <h3 className="font-editorial-heading text-base font-bold text-ink">
              Recent Escalations & Refund Disputes
            </h3>
          </div>
          <span className="text-xs font-editorial-mono text-muted">
            Monthly platform volume: 5,900 tickets
          </span>
        </div>

        <div className="divide-y divide-line">
          {refundDisputes.map((t: any) => (
            <div key={t.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-editorial-mono font-bold text-ink">{t.ticketNumber}</span>
                  <span className="text-[10px] bg-paper-deep px-1.5 py-0.2 border border-line text-ink-soft">
                    {t.issueType}
                  </span>
                  <span className="text-muted">Customer: {t.customer.name}</span>
                </div>
                <p className="text-ink-soft text-[11px] mt-0.5">{t.notes}</p>
              </div>

              <div className="flex items-center space-x-3 text-right">
                <span className="font-bold text-ink">₹{t.refundAmount}</span>
                <span className="px-2 py-0.5 text-[10px] font-editorial-mono bg-paper border border-line text-muted">
                  {t.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
