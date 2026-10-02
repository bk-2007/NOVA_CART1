import { InventoryConfidenceInput, InventoryConfidenceResult, OrderRiskLevel } from "@/types";

/**
 * NOVA CART LOCAL COMMERCE INTELLIGENCE
 * Inventory Availability Confidence Engine
 *
 * Transparent, deterministic rule-based scoring engine evaluating the real-time probability
 * that a product is physically present on shelf and ready for rapid picking.
 */
export function calculateInventoryConfidence(input: InventoryConfidenceInput): InventoryConfidenceResult {
  const reasons: string[] = [];
  let score = 95; // Benchmark optimistic physical availability score

  // 1. Audit Freshness Evaluation
  const auditDate = new Date(input.lastAuditedAt);
  const now = new Date();
  const diffMs = Math.max(0, now.getTime() - auditDate.getTime());
  const hoursSinceAudit = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
  const minutesSinceAudit = Math.round(diffMs / (1000 * 60));

  let isStale = false;

  if (minutesSinceAudit <= 60) {
    score += 5;
    reasons.push(`Inventory verified fresh (${minutesSinceAudit}m ago)`);
  } else if (hoursSinceAudit <= 4) {
    // Recent audit, minimal decay
    reasons.push(`Audited ${hoursSinceAudit}h ago (within fresh cycle)`);
  } else if (hoursSinceAudit <= 12) {
    score -= 15;
    reasons.push(`Audit aged ${hoursSinceAudit}h without morning verification`);
  } else if (hoursSinceAudit <= 24) {
    score -= 30;
    isStale = true;
    reasons.push(`Delayed verification: last store check ${hoursSinceAudit}h ago`);
  } else {
    score -= 45;
    isStale = true;
    const days = Math.round(hoursSinceAudit / 24);
    reasons.push(`Critically stale: shelf status not verified for ${days > 1 ? `${days} days` : 'over 24h'}`);
  }

  // 2. Physical Stock vs Safety Buffer
  if (input.stockLevel <= 0 || input.status === "OUT_OF_STOCK") {
    score = Math.min(score, 5);
    reasons.push("Reported zero on-shelf stock");
  } else if (input.stockLevel <= input.safetyStock) {
    score -= 25;
    reasons.push(`High stock-out risk: only ${input.stockLevel} units remaining (buffer: ${input.safetyStock})`);
  } else if (input.stockLevel >= input.safetyStock * 3) {
    score += 5;
    reasons.push(`Comfortable inventory buffer: ${input.stockLevel} units available`);
  }

  // 3. Store Fulfillment Reliability & Rejection History
  const fulfillmentPct = Math.round(input.storeFulfillmentRate * 100);
  if (input.storeFulfillmentRate >= 0.94) {
    reasons.push(`Store historical fulfillment rate: ${fulfillmentPct}%`);
  } else if (input.storeFulfillmentRate < 0.85) {
    score -= 20;
    reasons.push(`Store fulfillment rate depressed (${fulfillmentPct}%)`);
  } else {
    score -= 8;
    reasons.push(`Store fulfillment rate moderate (${fulfillmentPct}%)`);
  }

  if (input.storeRejectionRate >= 0.12) {
    score -= 18;
    const rejectionPct = Math.round(input.storeRejectionRate * 100);
    reasons.push(`Elevated order rejection history (${rejectionPct}% in busy periods)`);
  }

  // 4. Local Demand & Fulfillment Pressure
  const recentOrders = input.recentDemandLastHour ?? 0;
  if (recentOrders >= 8 && input.stockLevel < 15) {
    score -= 15;
    reasons.push(`High demand pressure: ${recentOrders} orders placed in this grid last hour`);
  } else if (recentOrders <= 2) {
    reasons.push("Low local demand pressure");
  }

  // 5. SKU-level Recent Cancellations
  const recentCancels = input.recentCancellations24h ?? 0;
  if (recentCancels >= 2) {
    score -= 25;
    reasons.push(`Recent fulfillment failure: ${recentCancels} items cancelled in last 24h`);
  }

  // Clamp confidence between 5% and 99%
  const confidence = Math.max(5, Math.min(99, Math.round(score)));

  let riskLevel: OrderRiskLevel = "LOW";
  if (confidence < 50) {
    riskLevel = "HIGH";
  } else if (confidence < 75) {
    riskLevel = "MEDIUM";
  }

  return {
    confidence,
    riskLevel,
    reasons,
    isStale,
    hoursSinceAudit,
  };
}
