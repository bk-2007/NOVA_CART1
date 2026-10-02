import { CustomerSegment } from "@/types";

export interface CustomerBehaviorInput {
  customerId: string;
  totalOrders: number;
  daysSinceLastOrder: number;
  avgOrderValue: number;
  distinctCategoriesCount: number; // e.g. 1 to 5 categories shopped
  cancelledOrdersCount: number;
  supportTicketsCount: number;
}

export interface CustomerRetentionProfile {
  segment: CustomerSegment;
  churnRiskScore: number; // 0.0 - 1.0
  repeatProbability: number; // 0.0 - 1.0
  lifecycleStage: string;
  riskFactors: string[];
  recommendedIntervention: string;
  isSecondOrderFrictionPoint: boolean;
}

/**
 * NOVA CART LOCAL COMMERCE INTELLIGENCE
 * Customer Retention & Cohort Intelligence Engine
 *
 * Deterministic cohort classification identifying the critical second-order dropoff
 * and multi-category loyalty leverage points across the customer lifecycle.
 */
export function evaluateCustomerRetention(input: CustomerBehaviorInput): CustomerRetentionProfile {
  const riskFactors: string[] = [];
  let segment: CustomerSegment = "NEW";
  let churnRiskScore = 0.2;
  let repeatProbability = 0.3;
  let lifecycleStage = "Onboarding";
  let recommendedIntervention = "Welcome incentive on curated essentials";
  let isSecondOrderFrictionPoint = false;

  // 1. Behavioral Segment Classification
  if (input.totalOrders === 0) {
    segment = "NEW";
    churnRiskScore = 0.45;
    repeatProbability = 0.54; // 54% first-order conversion benchmark
    lifecycleStage = "Prospective Customer";
    recommendedIntervention = "Frictionless first-purchase guarantee with real-time stock assurance";
  } else if (input.totalOrders === 1) {
    if (input.daysSinceLastOrder <= 30) {
      segment = "FIRST_ORDER";
      churnRiskScore = 0.40;
      repeatProbability = 0.31; // 31% place second order within 30 days
      lifecycleStage = "Active Trial (0-30 days)";
      recommendedIntervention = "Next-order convenience prompt + cross-category basket builder";
    } else {
      // THE CRITICAL CHURN FUNNEL IN NOVA CART
      segment = "SECOND_ORDER_RISK";
      churnRiskScore = 0.78;
      repeatProbability = 0.15;
      lifecycleStage = "Second-Order Friction Window (>30 days since 1st order)";
      isSecondOrderFrictionPoint = true;
      riskFactors.push(`30+ days (${input.daysSinceLastOrder} days) elapsed since single first order`);
      recommendedIntervention = "₹40 targeted incentive on ₹299 basket (prevents second-order abandonment)";
    }
  } else if (input.totalOrders >= 5 && input.avgOrderValue >= 550 && input.daysSinceLastOrder <= 45) {
    segment = "HIGH_VALUE";
    churnRiskScore = 0.12;
    repeatProbability = 0.88;
    lifecycleStage = "Advocate / Power Shopper";
    recommendedIntervention = "Dedicated express runner dispatch; VIP store stock reserve";
  } else if (input.daysSinceLastOrder > 90) {
    segment = "DORMANT";
    churnRiskScore = 0.92;
    repeatProbability = 0.08;
    lifecycleStage = "Dormant / Lost";
    riskFactors.push(`Inactivity period exceeded 90 days (${input.daysSinceLastOrder} days)`);
    recommendedIntervention = "Re-activation survey + curated local store showcase (do not spam coupons)";
  } else if (input.daysSinceLastOrder > 45) {
    segment = "AT_RISK";
    churnRiskScore = 0.65;
    repeatProbability = 0.28;
    lifecycleStage = "At Risk of Churn";
    riskFactors.push(`Frequency lapse: ${input.daysSinceLastOrder} days since last order`);
    recommendedIntervention = "Restock reminder for previously purchased staples with verified inventory";
  } else {
    // 2 to 4 orders within 45 days
    segment = "REPEAT";
    // 72% probability of next-month ordering after completing 3 orders
    repeatProbability = input.totalOrders >= 3 ? 0.72 : 0.58;
    churnRiskScore = 0.22;
    lifecycleStage = "Established Repeat Shopper";
    recommendedIntervention = "Weekly staple subscription / scheduled delivery reminder";
  }

  // 2. Behavioral Friction Multipliers
  if (input.cancelledOrdersCount > 0) {
    churnRiskScore = Math.min(0.99, churnRiskScore + input.cancelledOrdersCount * 0.18);
    riskFactors.push(`Experienced ${input.cancelledOrdersCount} prior order cancellations`);
  }

  if (input.supportTicketsCount > 0) {
    churnRiskScore = Math.min(0.99, churnRiskScore + input.supportTicketsCount * 0.12);
    riskFactors.push(`Lodged ${input.supportTicketsCount} support inquiries/refund disputes`);
  }

  // Multi-category customers show higher repeat usage
  if (input.distinctCategoriesCount >= 3) {
    repeatProbability = Math.min(0.95, repeatProbability + 0.15);
    churnRiskScore = Math.max(0.05, churnRiskScore - 0.10);
  } else if (input.totalOrders >= 2 && input.distinctCategoriesCount === 1) {
    riskFactors.push("Single-category shopper: narrow purchase habit increases vulnerability to stockouts");
  }

  return {
    segment,
    churnRiskScore: Math.round(churnRiskScore * 100) / 100,
    repeatProbability: Math.round(repeatProbability * 100) / 100,
    lifecycleStage,
    riskFactors,
    recommendedIntervention,
    isSecondOrderFrictionPoint,
  };
}
