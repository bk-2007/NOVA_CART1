import { OrderRiskAssessment, OrderRiskLevel } from "@/types";

export interface OrderRiskEvaluationInput {
  orderId: string;
  orderNumber: string;
  customerId: string;
  customerSegment: string;
  customerPriorCancellations: number;
  storeId: string;
  storeName: string;
  storeRejectionRate: number; // e.g. 0.15
  storeFulfillmentRate: number; // e.g. 0.88
  minItemConfidence: number; // lowest confidence among basket items (e.g. 42%)
  avgItemConfidence: number; // avg confidence across basket
  estimatedDeliveryMinutes: number;
  currentDelayMinutes?: number;
  containsSubstitutedItems: boolean;
  isPeakHour?: boolean;
}

/**
 * NOVA CART LOCAL COMMERCE INTELLIGENCE
 * Operations Risk Engine
 *
 * Continuously evaluates pending and in-flight orders for failure risk
 * before fulfillment breakdown reaches the customer.
 */
export function calculateOrderRisk(input: OrderRiskEvaluationInput): OrderRiskAssessment {
  const factors: string[] = [];
  let riskScore = 15; // Baseline low operational friction
  let recommendedAction = "Proceed with standard batch runner dispatch";

  // 1. Inventory Availability Confidence Impact
  if (input.minItemConfidence < 50) {
    riskScore += 45;
    factors.push(`Critical item availability risk: SKU confidence at ${input.minItemConfidence}%`);
    recommendedAction = "Offer pre-approved local substitute or verify physical shelf with store immediately";
  } else if (input.minItemConfidence < 75) {
    riskScore += 25;
    factors.push(`Moderate item inventory uncertainty (${input.minItemConfidence}% confidence)`);
    recommendedAction = "Alert store picker to prioritize basket assembly";
  }

  // 2. Store Historical Rejection Friction
  if (input.storeRejectionRate >= 0.15) {
    riskScore += 22;
    const rejPct = Math.round(input.storeRejectionRate * 100);
    factors.push(`Store has high order rejection velocity (${rejPct}% during peak hours)`);
    if (!recommendedAction.includes("store")) {
      recommendedAction = "Direct call to store merchant to confirm acceptance";
    }
  } else if (input.storeRejectionRate >= 0.08) {
    riskScore += 10;
    factors.push("Moderate store rejection tendency");
  }

  // 3. Delivery Delay Pressure
  const delay = input.currentDelayMinutes ?? 0;
  if (delay > 15 || input.estimatedDeliveryMinutes > 40) {
    riskScore += 25;
    factors.push(`Severe delivery delay risk: ${delay > 0 ? `${delay}m elapsed beyond estimate` : `projected ${input.estimatedDeliveryMinutes}m duration`}`);
    recommendedAction = "Reassign runner to nearest available express partner";
  } else if (delay > 5) {
    riskScore += 12;
    factors.push(`Minor runner delay (${delay}m behind schedule)`);
  }

  // 4. Substitution Friction History
  if (input.containsSubstitutedItems) {
    riskScore += 15;
    factors.push("Order contains active substitutions requiring customer alignment");
  }

  // 5. Customer Churn Amplification Factor
  // First-order or second-order risk customers facing an order failure are 3x more likely to abandon
  if (input.customerSegment === "FIRST_ORDER" || input.customerSegment === "SECOND_ORDER_RISK") {
    if (riskScore >= 40) {
      riskScore += 15;
      factors.push("High LTV risk: Churn-vulnerable customer segment (trial cohort)");
      recommendedAction = "Expedite VIP runner & apply real-time substitute guarantee";
    }
  }

  // Clamp risk score to [5, 100]
  const finalScore = Math.max(5, Math.min(100, Math.round(riskScore)));

  let riskLevel: OrderRiskLevel = "LOW";
  let requiresImmediateOpsIntervention = false;

  if (finalScore >= 65) {
    riskLevel = "HIGH";
    requiresImmediateOpsIntervention = true;
  } else if (finalScore >= 35) {
    riskLevel = "MEDIUM";
    requiresImmediateOpsIntervention = false;
  }

  return {
    riskLevel,
    riskScore: finalScore,
    factors: factors.length > 0 ? factors : ["All fulfillment signals within nominal operational tolerances"],
    recommendedAction,
    requiresImmediateOpsIntervention,
  };
}
