import { CustomerSegment } from "@/types";

export interface PromotionRecommendationInput {
  customerId: string;
  customerName: string;
  segment: CustomerSegment;
  totalOrders: number;
  daysSinceLastOrder: number;
  avgOrderValue: number;
  favoriteCategory?: string;
}

export interface PromotionRecommendation {
  id: string;
  customerId: string;
  customerName: string;
  segment: CustomerSegment;
  recommendedIncentive: string;
  discountType: "FIXED" | "PERCENTAGE";
  discountValue: number;
  minBasketValue: number;
  rationale: string;
  expectedMarginImpact: string;
  isApproved: boolean;
  budgetImpact: number;
}

export const PLATFORM_PROMOTION_METRICS = {
  monthlySpendINR: 1700000, // ₹17 Lakhs / month
  acquisitionSharePercent: 58, // 58% spent on top of funnel discounts
  retentionSharePercent: 42,
  unusedCouponsPercent: 44, // 44% of coupons never redeemed (massive wastage)
  historicalSpendINR: 950000, // Six months ago: ₹9.5 Lakhs
  spendGrowthRatePercent: 78.9, // 9.5L -> 17L (+79%)
};

/**
 * NOVA CART LOCAL COMMERCE INTELLIGENCE
 * Targeted Promotion & Incentive Governance Engine
 *
 * Eliminates blunt-force blanket discounts that erode merchant margins
 * and replace them with precision cohort-specific re-engagement triggers.
 */
export function generateTargetedPromotion(input: PromotionRecommendationInput): PromotionRecommendation {
  let discountValue = 0;
  let minBasketValue = 299;
  let discountType: "FIXED" | "PERCENTAGE" = "FIXED";
  let recommendedIncentive = "No direct discount recommended";
  let rationale = "Customer exhibits organic purchasing cadence. Discounting would dilute gross margin.";
  let expectedMarginImpact = "Neutral (Preserves platform 14% take-rate)";

  switch (input.segment) {
    case "SECOND_ORDER_RISK":
      discountValue = 40;
      minBasketValue = 299;
      discountType = "FIXED";
      recommendedIncentive = "₹40 targeted incentive on ₹299 basket";
      rationale = `First order completed but second order pending for ${input.daysSinceLastOrder} days. Targeted intervention to break the second-order churn hurdle without blanket discounting.`;
      expectedMarginImpact = "+₹259 net GMV expansion per converted cohort user; gross margin positive at ₹299 basket.";
      break;

    case "FIRST_ORDER":
      discountValue = 0;
      minBasketValue = 249;
      discountType = "FIXED";
      recommendedIncentive = "Free Express Delivery on 2nd order within 14 days";
      rationale = "Recent trial customer (order placed within 30 days). Convenience incentive generates higher LTV than price cuts.";
      expectedMarginImpact = "Platform absorbs ₹30 delivery runner cost; preserves full store retail margins.";
      break;

    case "AT_RISK":
      discountValue = 50;
      minBasketValue = 399;
      discountType = "FIXED";
      recommendedIncentive = `₹50 reactivation incentive on ${input.favoriteCategory ?? "Staples"} basket >₹399`;
      rationale = `Lapse of ${input.daysSinceLastOrder} days detected. High probability of defection to competing offline or dark store channels.`;
      expectedMarginImpact = "Recovers lost repeat GMV with 12.5% incentive subsidy capped at ₹399 threshold.";
      break;

    case "HIGH_VALUE":
      discountValue = 0;
      minBasketValue = 500;
      discountType = "FIXED";
      recommendedIncentive = "VIP Priority Queue + Zero Surge Delivery Guarantee";
      rationale = "Customer has strong organic willingness to pay (AOV ₹" + Math.round(input.avgOrderValue) + "). Discounting would subsidize already loyal demand.";
      expectedMarginImpact = "Zero margin dilution; reinforces brand perception and service velocity.";
      break;

    case "DORMANT":
      discountValue = 60;
      minBasketValue = 349;
      discountType = "FIXED";
      recommendedIncentive = "₹60 Welcome-Back Voucher on Local Fresh Produce";
      rationale = "Inactivity > 90 days. High friction re-engagement requiring compelling trial incentive tied to verified inventory.";
      expectedMarginImpact = "Customer acquisition cost equivalent to ₹60 vs ₹180 cold digital ad acquisition.";
      break;

    case "REPEAT":
    case "NEW":
    default:
      discountValue = 0;
      minBasketValue = 200;
      recommendedIncentive = "Verified Local Store Discovery Showcase (No Promo Code)";
      rationale = "Healthy organic frequency. Prioritize inventory accuracy over price concessions.";
      expectedMarginImpact = "Full margin realization for independent partner stores.";
      break;
  }

  return {
    id: `REC-PROMO-${input.customerId.slice(-4)}-${Date.now().toString().slice(-4)}`,
    customerId: input.customerId,
    customerName: input.customerName,
    segment: input.segment,
    recommendedIncentive,
    discountType,
    discountValue,
    minBasketValue,
    rationale,
    expectedMarginImpact,
    isApproved: false,
    budgetImpact: discountValue,
  };
}
