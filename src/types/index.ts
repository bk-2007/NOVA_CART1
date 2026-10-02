export type UserRole = "CUSTOMER" | "STORE_MANAGER" | "OPERATIONS" | "EXECUTIVE";

export type InventoryStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "STALE";

export type OrderStatus = "PENDING" | "ACCEPTED" | "PICKED" | "DISPATCHED" | "DELIVERED" | "CANCELLED";

export type OrderRiskLevel = "LOW" | "MEDIUM" | "HIGH";

export type CustomerSegment =
  | "NEW"
  | "FIRST_ORDER"
  | "SECOND_ORDER_RISK"
  | "REPEAT"
  | "HIGH_VALUE"
  | "AT_RISK"
  | "DORMANT";

export type IssueType =
  | "STALE_INVENTORY"
  | "CANCELLED_ORDER"
  | "DELIVERY_DELAY"
  | "REFUND_DISPUTE"
  | "SUBSTITUTION_QUALITY";

export type SupportTicketStatus = "OPEN" | "IN_PROGRESS" | "RESOLVED";

export type DiscountType = "FIXED" | "PERCENTAGE";

export interface InventoryConfidenceInput {
  productId: string;
  productName: string;
  category: string;
  storeId: string;
  storeName: string;
  storeFulfillmentRate: number; // 0.0 - 1.0 (e.g. 0.95)
  storeRejectionRate: number;   // 0.0 - 1.0 (e.g. 0.05)
  avgDeliveryMinutes: number;
  stockLevel: number;
  safetyStock: number;
  lastAuditedAt: Date | string;
  status: InventoryStatus;
  recentDemandLastHour?: number;
  recentCancellations24h?: number;
}

export interface InventoryConfidenceResult {
  confidence: number; // 0 - 100 percentage
  riskLevel: OrderRiskLevel;
  reasons: string[];
  isStale: boolean;
  hoursSinceAudit: number;
}

export interface ProductAlternativeCandidate {
  id: string;
  sku: string;
  name: string;
  brand: string;
  category: string;
  unit: string;
  mrp: number;
  price: number;
  storeId: string;
  storeName: string;
  storeLocality: string;
  stockLevel: number;
  confidence: number;
  storeFulfillmentRate: number;
  avgDeliveryMinutes: number;
}

export interface AlternativeRecommendation {
  originalProductId: string;
  originalProductName: string;
  originalPrice: number;
  originalConfidence: number;
  recommendedAlternative: ProductAlternativeCandidate;
  score: number;
  priceDelta: number; // positive means cheaper, negative means more expensive
  reasons: string[];
}

export interface OrderRiskAssessment {
  riskLevel: OrderRiskLevel;
  riskScore: number; // 0 - 100
  factors: string[];
  recommendedAction: string;
  requiresImmediateOpsIntervention: boolean;
}

export interface ImpactScenarioInput {
  monthlyOrders?: number; // default: 38,500
  aov?: number;           // default: 486
  currentCancellationRate?: number; // default: 0.11
  targetCancellationRate: number;   // e.g. 0.08
  currentRepeatRate?: number;       // default: 0.27
  targetRepeatRate: number;         // e.g. 0.32
  currentSupportTickets?: number;   // default: 5,900
  targetSupportTickets: number;     // e.g. 4,800
  monthlyPromoSpend?: number;       // default: 17,00,000
  targetPromoSpend?: number;        // e.g. 12,50,000
  sixMonthBudget?: number;          // default: 25,00,000
}

export interface ImpactScenarioOutput {
  recoveredMonthlyOrders: number;
  recoveredMonthlyGMV: number;
  annualizedRecoveredGMV: number;
  repeatCustomerLiftMonthlyGMV: number;
  supportTicketReduction: number;
  supportSavingsMonthly: number;
  promotionalEfficiencyMonthlySavings: number;
  totalMonthlyValueDelivered: number;
  sixMonthCumulativeBenefit: number;
  netBenefitAfterBudget: number;
  roiMultiple: number;
  assumptions: string[];
}
