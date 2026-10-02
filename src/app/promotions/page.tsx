"use client";

import React, { useState, useEffect } from "react";
import {
  Gift,
  CheckCircle2,
  AlertTriangle,
  TrendingDown,
  RefreshCw,
  ShieldCheck,
  Tag,
  Zap,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

export default function PromotionsPage() {
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/promotions");
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch (err) {
      console.error("Promotions error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  const handleApprove = async (rec: any) => {
    setApprovingId(rec.id);
    setSuccessNotice(null);

    try {
      const res = await fetch("/api/promotions/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerId: rec.customerId,
          segment: rec.segment,
          discountValue: rec.discountValue,
          minBasketValue: rec.minBasketValue,
        }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Approval failed");

      // Update state locally
      setData((prev: any) => {
        if (!prev) return prev;
        const updatedRecs = prev.targetedRecommendations.map((r: any) =>
          r.id === rec.id
            ? {
                ...r,
                isApproved: true,
                issuedCouponCode: json.data.coupon?.code || "APPROVED",
              }
            : r
        );

        return {
          ...prev,
          targetedRecommendations: updatedRecs,
        };
      });

      setSuccessNotice(
        `✓ Approved targeted incentive for ${rec.customerName}. Code: ${json.data.coupon?.code || "ACTIVATED"}`
      );
      setTimeout(() => setSuccessNotice(null), 5000);
    } catch (err: any) {
      alert(err.message || "Failed to approve promotion");
    } finally {
      setApprovingId(null);
    }
  };

  const metrics = data?.metrics || {};
  const recommendations = data?.targetedRecommendations || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="border-editorial-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
            08 / PROMOTION GOVERNANCE & MARGIN DISCIPLINE
          </div>
          <h1 className="font-editorial-heading text-2xl md:text-3xl font-bold text-ink">
            Targeted Incentives vs. Blanket Discounting
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Replacing blunt promotional subsidies with precision cohort triggers to preserve merchant unit economics.
          </p>
        </div>

        <button
          onClick={fetchPromotions}
          className="flex items-center space-x-1.5 px-3 py-1.5 border-editorial bg-editorial-white text-xs hover:bg-paper self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted ${loading ? "animate-spin" : ""}`} />
          <span>Refresh Governance</span>
        </button>
      </div>

      {/* Success Notification */}
      {successNotice && (
        <div className="p-3 bg-editorial-success text-editorial-white text-xs font-medium flex items-center justify-between shadow-md">
          <span>{successNotice}</span>
          <span className="text-[10px] font-editorial-mono uppercase">Status Changed to Approved</span>
        </div>
      )}

      {/* THREE CORE PROMOTION METRICS (Section 21 Requirement) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-editorial-white border-editorial p-5 shadow-sm">
          <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted block mb-1">
            Monthly Promo Burn
          </span>
          <div className="font-editorial-heading text-3xl font-bold text-ink">
            ₹17.0 Lakhs
          </div>
          <div className="text-xs text-editorial-danger font-medium mt-1">
            +78.9% surge (from ₹9.5L 6m ago)
          </div>
          <p className="text-[11px] text-muted mt-2 border-editorial-t pt-2">
            Platform promotional burn doubled while repeat purchase rate collapsed from 41% to 27%.
          </p>
        </div>

        <div className="bg-editorial-white border-editorial p-5 shadow-sm">
          <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted block mb-1">
            Acquisition Allocation
          </span>
          <div className="font-editorial-heading text-3xl font-bold text-ink">
            58%
          </div>
          <div className="text-xs text-muted mt-1">
            Heavy top-of-funnel customer subsidy
          </div>
          <p className="text-[11px] text-muted mt-2 border-editorial-t pt-2">
            Disproportionate budget spent acquiring trial users who drop off after order #1.
          </p>
        </div>

        <div className="bg-editorial-white border-editorial p-5 shadow-sm">
          <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted block mb-1">
            Unused Coupon Wastage
          </span>
          <div className="font-editorial-heading text-3xl font-bold text-editorial-danger">
            44%
          </div>
          <div className="text-xs text-editorial-danger font-medium mt-1">
            ~₹7.5 Lakhs wasted monthly
          </div>
          <p className="text-[11px] text-muted mt-2 border-editorial-t pt-2">
            44% of generic platform coupons are never redeemed, creating noise without conversion.
          </p>
        </div>
      </div>

      {/* TARGETED PROMOTION RECOMMENDATIONS (Section 21 Requirement) */}
      <div className="bg-editorial-white border-editorial p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-editorial-b pb-3">
          <div>
            <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
              PRECISION INCENTIVE ENGINE
            </span>
            <h3 className="font-editorial-heading text-lg font-bold text-ink">
              Cohort-Specific Incentive Approvals
            </h3>
          </div>
          <span className="text-xs font-editorial-mono text-muted">
            Strict Margin Protection Active
          </span>
        </div>

        <div className="space-y-4">
          {recommendations.map((rec: any) => {
            const isApproved = rec.isApproved;
            const isRahul = rec.customerName.includes("Rahul");
            const isSubmitting = approvingId === rec.id;

            return (
              <div
                key={rec.id}
                className={`p-5 border transition-all ${
                  isApproved
                    ? "bg-editorial-success/5 border-editorial-success/40"
                    : isRahul
                    ? "bg-paper-deep border-2 border-ink shadow-sm"
                    : "bg-paper border-editorial"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Column: Recommendation details */}
                  <div className="space-y-2 max-w-2xl">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-sm text-ink">{rec.customerName}</span>
                      <span
                        className={`text-[10px] font-editorial-mono px-2 py-0.5 uppercase tracking-wider font-semibold border ${
                          rec.segment === "SECOND_ORDER_RISK"
                            ? "bg-editorial-danger/15 text-editorial-danger border-editorial-danger/30"
                            : rec.segment === "HIGH_VALUE"
                            ? "bg-editorial-success/15 text-editorial-success border-editorial-success/30"
                            : "bg-paper text-ink-soft border-editorial"
                        }`}
                      >
                        {rec.segment}
                      </span>
                      {isApproved && (
                        <span className="text-[10px] font-editorial-mono bg-editorial-success text-editorial-white px-2 py-0.5 font-semibold">
                          STATUS: APPROVED
                        </span>
                      )}
                    </div>

                    <div className="bg-editorial-white p-3 border-editorial space-y-1 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-ink flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-ink" />
                          Recommended: {rec.recommendedIncentive}
                        </span>
                        {rec.minBasketValue > 0 && (
                          <span className="text-[10px] font-editorial-mono text-muted">
                            Min Basket: ₹{rec.minBasketValue}
                          </span>
                        )}
                      </div>
                      <p className="text-muted text-[11px] pt-1">
                        <strong>Reason:</strong> {rec.rationale}
                      </p>
                      <p className="text-[10px] text-editorial-success pt-0.5 font-editorial-mono">
                        Margin Impact: {rec.expectedMarginImpact}
                      </p>
                    </div>

                    {rec.issuedCouponCode && (
                      <div className="text-[11px] font-editorial-mono text-ink bg-paper px-2 py-1 border border-line">
                        Assigned Code: <strong>{rec.issuedCouponCode}</strong>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Approve Button */}
                  <div className="flex flex-col items-start lg:items-end justify-center shrink-0">
                    {isApproved ? (
                      <div className="px-4 py-2 bg-paper border border-editorial-success/50 text-editorial-success text-xs font-semibold flex items-center space-x-1.5">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Incentive Approved</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleApprove(rec)}
                        disabled={isSubmitting}
                        className="px-4 py-2 bg-ink text-editorial-white text-xs font-medium hover:bg-ink-soft transition-colors flex items-center space-x-1.5 disabled:opacity-50"
                      >
                        <Zap className="w-3.5 h-3.5 text-editorial-warning" />
                        <span>{isSubmitting ? "Approving..." : "Approve Incentive"}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
