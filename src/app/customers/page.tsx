"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  AlertTriangle,
  RefreshCw,
  ShoppingBag,
  TrendingDown,
  UserCheck,
  Award,
} from "lucide-react";
import { MetricCard } from "@/components/MetricCard";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCustomers = async (seg?: string | null) => {
    setLoading(true);
    try {
      const url = new URL("/api/customers", window.location.origin);
      if (seg) url.searchParams.set("segment", seg);

      const res = await fetch(url.toString());
      const json = await res.json();
      if (json.success) {
        setCustomers(json.data.customers);
      }
    } catch (err) {
      console.error("Customer fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers(selectedSegment);
  }, [selectedSegment]);

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.segment.toLowerCase().includes(q);
  });

  const segments = [
    { id: "SECOND_ORDER_RISK", label: "Second-Order Risk", count: 4 },
    { id: "FIRST_ORDER", label: "First Order Trial", count: 3 },
    { id: "REPEAT", label: "Established Repeat", count: 6 },
    { id: "HIGH_VALUE", label: "High Value", count: 3 },
    { id: "AT_RISK", label: "At Risk", count: 2 },
    { id: "DORMANT", label: "Dormant", count: 2 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="border-editorial-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
            06 / CUSTOMER BEHAVIOR & COHORT ARCHITECTURE
          </div>
          <h1 className="font-editorial-heading text-2xl md:text-3xl font-bold text-ink">
            Customer Intelligence & Segmentation
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Behavioral cohort mapping identifying the trial-to-repeat dropoff and category diversity leverage points.
          </p>
        </div>

        <button
          onClick={() => fetchCustomers(selectedSegment)}
          className="flex items-center space-x-1.5 px-3 py-1.5 border-editorial bg-editorial-white text-xs hover:bg-paper self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-muted ${loading ? "animate-spin" : ""}`} />
          <span>Sync Cohorts</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          label="Registered User Base"
          value="1,20,000"
          subtitle="from 82,000 (6m ago)"
          change="+46.3%"
          code="REG"
        />
        <MetricCard
          label="Monthly Active Users"
          value="46,000"
          subtitle="Active shoppers in 30 days"
          change="38.3% MAU/Reg"
          code="MAU"
        />
        <MetricCard
          label="First-to-Second Order Rate"
          value="31%"
          subtitle="Severe trial cohort dropoff"
          isNegative={true}
          change="-18% vs benchmark"
          code="DROP"
        />
        <MetricCard
          label="Average Order Value"
          value="486"
          prefix="₹"
          subtitle="from ₹452 (6m ago)"
          change="+7.5%"
          code="AOV"
        />
      </div>

      {/* Segment Filters & Search */}
      <div className="bg-editorial-white border-editorial p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <label htmlFor="customers-search-input" className="sr-only">
              Search customer name, email, or segment
            </label>
            <Search className="w-4 h-4 text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="customers-search-input"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search customer name, email, or segment..."
              className="w-full pl-9 pr-3 py-1.5 bg-paper text-xs text-ink placeholder:text-muted border-editorial focus:outline-none focus:border-ink focus-visible:ring-1 focus-visible:ring-ink"
            />
          </div>

          <div className="flex items-center space-x-2 text-xs overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedSegment(null)}
              className={`px-3 py-1 text-xs border shrink-0 ${
                selectedSegment === null
                  ? "bg-ink text-editorial-white border-ink font-medium"
                  : "bg-paper text-ink-soft border-editorial hover:bg-paper-deep"
              }`}
            >
              All Segments
            </button>
            {segments.map((seg) => (
              <button
                key={seg.id}
                onClick={() => setSelectedSegment(selectedSegment === seg.id ? null : seg.id)}
                className={`px-3 py-1 text-xs border shrink-0 ${
                  selectedSegment === seg.id
                    ? "bg-ink text-editorial-white border-ink font-medium"
                    : "bg-paper text-ink-soft border-editorial hover:bg-paper-deep"
                }`}
              >
                {seg.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Intelligence Table */}
      <div className="bg-editorial-white border-editorial shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs text-ink border-collapse">
          <thead>
            <tr className="border-editorial-b bg-paper-deep/60 text-[10px] font-editorial-mono uppercase tracking-wider text-muted">
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Behavioral Cohort</th>
              <th className="py-3 px-4">Order History</th>
              <th className="py-3 px-4">Churn Risk</th>
              <th className="py-3 px-4">Repeat Probability</th>
              <th className="py-3 px-4">Prescribed Intervention</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((c) => {
              const isSecondOrderRisk = c.segment === "SECOND_ORDER_RISK";

              return (
                <tr
                  key={c.id}
                  className={`hover:bg-paper/50 transition-colors ${
                    isSecondOrderRisk ? "bg-editorial-danger/5" : ""
                  }`}
                >
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-ink">{c.name}</div>
                    <div className="text-[10px] text-muted font-editorial-mono">
                      {c.email} • {c.phone}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span
                      className={`text-[10px] font-editorial-mono px-2 py-0.5 uppercase tracking-wider font-semibold border ${
                        isSecondOrderRisk
                          ? "bg-editorial-danger/15 text-editorial-danger border-editorial-danger/30"
                          : c.segment === "HIGH_VALUE"
                          ? "bg-editorial-success/15 text-editorial-success border-editorial-success/30"
                          : "bg-paper text-ink-soft border-editorial"
                      }`}
                    >
                      {c.segment}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-editorial-mono">
                    <span className="font-bold text-ink">{c.totalOrders} Orders</span>
                    <span className="text-[10px] text-muted block">
                      Last: {c.daysSinceLastOrder}d ago • AOV ₹{c.avgOrderValue}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-editorial-mono">
                    <span
                      className={`font-bold ${
                        c.churnRiskScore >= 0.7
                          ? "text-editorial-danger"
                          : c.churnRiskScore >= 0.4
                          ? "text-editorial-warning"
                          : "text-editorial-success"
                      }`}
                    >
                      {Math.round(c.churnRiskScore * 100)}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-editorial-mono">
                    <span className="font-bold text-ink">
                      {Math.round(c.repeatProbability * 100)}%
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-xs text-ink-soft">
                    <div className="font-medium text-ink">{c.recommendedIntervention}</div>
                    {c.riskFactors && c.riskFactors.length > 0 && (
                      <div className="text-[10px] text-editorial-danger mt-0.5">
                        ⚠ {c.riskFactors[0]}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
