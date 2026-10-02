import { describe, it, expect } from "vitest";
import { calculateInventoryConfidence } from "@/lib/services/inventoryConfidenceService";
import { rankProductAlternatives } from "@/lib/services/recommendationService";
import { evaluateCustomerRetention } from "@/lib/services/retentionService";
import { generateTargetedPromotion } from "@/lib/services/promotionService";
import { calculateOrderRisk } from "@/lib/services/riskEngine";
import { calculateBusinessImpact } from "@/lib/services/impactCalculator";
import { ProductAlternativeCandidate } from "@/types";

describe("1. Inventory Availability Confidence Engine", () => {
  it("calculates high confidence for fresh audit and healthy stock", () => {
    const res = calculateInventoryConfidence({
      productId: "prod_01",
      productName: "Mother Dairy Cow Fresh Milk 1L",
      category: "Dairy",
      storeId: "store_02",
      storeName: "Anand Supermart",
      storeFulfillmentRate: 0.97,
      storeRejectionRate: 0.03,
      avgDeliveryMinutes: 22,
      stockLevel: 28,
      safetyStock: 5,
      lastAuditedAt: new Date(Date.now() - 25 * 60 * 1000), // 25 mins ago
      status: "IN_STOCK",
      recentDemandLastHour: 2,
    });

    expect(res.confidence).toBeGreaterThanOrEqual(90);
    expect(res.isStale).toBe(false);
    expect(res.riskLevel).toBe("LOW");
    expect(res.reasons.some((r) => r.includes("verified fresh"))).toBe(true);
  });

  it("calculates low confidence (~42%) for stale audit (>24h) with low stock and high rejection", () => {
    const res = calculateInventoryConfidence({
      productId: "prod_02",
      productName: "Amul Taaza Milk 1L",
      category: "Dairy",
      storeId: "store_01",
      storeName: "Sri Krishna Kirana",
      storeFulfillmentRate: 0.84,
      storeRejectionRate: 0.14,
      avgDeliveryMinutes: 38,
      stockLevel: 2,
      safetyStock: 5,
      lastAuditedAt: new Date(Date.now() - 28 * 3600 * 1000), // 28 hours ago
      status: "LOW_STOCK",
      recentDemandLastHour: 4,
      recentCancellations24h: 1,
    });

    expect(res.confidence).toBeLessThanOrEqual(50);
    expect(res.isStale).toBe(true);
    expect(res.riskLevel).toBe("HIGH");
    expect(res.reasons.some((r) => r.includes("stale"))).toBe(true);
  });

  it("handles out of stock edge cases gracefully", () => {
    const res = calculateInventoryConfidence({
      productId: "prod_03",
      productName: "Out of Stock Item",
      category: "Dairy",
      storeId: "store_01",
      storeName: "Sri Krishna Kirana",
      storeFulfillmentRate: 0.95,
      storeRejectionRate: 0.02,
      avgDeliveryMinutes: 20,
      stockLevel: 0,
      safetyStock: 5,
      lastAuditedAt: new Date(),
      status: "OUT_OF_STOCK",
    });

    expect(res.confidence).toBeLessThanOrEqual(10);
    expect(res.riskLevel).toBe("HIGH");
  });
});

describe("2. Product Alternative Recommendation Engine", () => {
  const originalProduct = {
    id: "prod_amul_01",
    name: "Amul Taaza Milk 1L",
    category: "Dairy",
    price: 68,
    confidence: 42,
  };

  const candidates: ProductAlternativeCandidate[] = [
    {
      id: "prod_md_02",
      sku: "SKU-MILK-MD-02",
      name: "Mother Dairy Cow Fresh Milk",
      brand: "Mother Dairy",
      category: "Dairy",
      unit: "1L",
      mrp: 68,
      price: 65,
      storeId: "store_02",
      storeName: "Anand Supermart & Fresh Dairy",
      storeLocality: "Indiranagar",
      stockLevel: 28,
      confidence: 94,
      storeFulfillmentRate: 0.97,
      avgDeliveryMinutes: 22,
    },
    {
      id: "prod_nan_03",
      sku: "SKU-MILK-NAN-03",
      name: "Nandini Blue Toned Milk",
      brand: "Nandini",
      category: "Dairy",
      unit: "1L",
      mrp: 44,
      price: 42,
      storeId: "store_02",
      storeName: "Anand Supermart & Fresh Dairy",
      storeLocality: "Indiranagar",
      stockLevel: 40,
      confidence: 91,
      storeFulfillmentRate: 0.97,
      avgDeliveryMinutes: 22,
    },
  ];

  it("recommends high-confidence in-stock local alternative when original confidence is low", () => {
    const rec = rankProductAlternatives(originalProduct, candidates, 70);

    expect(rec).not.toBeNull();
    expect(rec?.recommendedAlternative.name).toContain("Mother Dairy");
    expect(rec?.recommendedAlternative.confidence).toBe(94);
    expect(rec?.priceDelta).toBe(3); // ₹3 cheaper
    expect(rec?.reasons.some((r) => r.includes("cheaper"))).toBe(true);
  });

  it("returns null if original product already has high availability confidence", () => {
    const rec = rankProductAlternatives(
      { ...originalProduct, confidence: 88 },
      candidates,
      70
    );

    expect(rec).toBeNull();
  });
});

describe("3. Customer Retention & Cohort Intelligence Engine", () => {
  it("classifies customer into SECOND_ORDER_RISK when 1st order was >30 days ago", () => {
    const profile = evaluateCustomerRetention({
      customerId: "cust_rahul",
      totalOrders: 1,
      daysSinceLastOrder: 34,
      avgOrderValue: 480,
      distinctCategoriesCount: 1,
      cancelledOrdersCount: 0,
      supportTicketsCount: 0,
    });

    expect(profile.segment).toBe("SECOND_ORDER_RISK");
    expect(profile.isSecondOrderFrictionPoint).toBe(true);
    expect(profile.churnRiskScore).toBeGreaterThanOrEqual(0.70);
    expect(profile.recommendedIntervention).toContain("₹40 targeted incentive");
  });

  it("correctly models 72% next-month probability after 3 completed orders", () => {
    const profile = evaluateCustomerRetention({
      customerId: "cust_anita",
      totalOrders: 3,
      daysSinceLastOrder: 11,
      avgOrderValue: 460,
      distinctCategoriesCount: 3,
      cancelledOrdersCount: 0,
      supportTicketsCount: 0,
    });

    expect(profile.segment).toBe("REPEAT");
    expect(profile.repeatProbability).toBeGreaterThanOrEqual(0.72);
    expect(profile.churnRiskScore).toBeLessThan(0.3);
  });

  it("penalizes retention and elevates churn risk when customer experienced prior order cancellations", () => {
    const profile = evaluateCustomerRetention({
      customerId: "cust_unhappy",
      totalOrders: 2,
      daysSinceLastOrder: 20,
      avgOrderValue: 400,
      distinctCategoriesCount: 1,
      cancelledOrdersCount: 2,
      supportTicketsCount: 1,
    });

    expect(profile.churnRiskScore).toBeGreaterThanOrEqual(0.50);
    expect(profile.riskFactors.some((r) => r.includes("prior order cancellations"))).toBe(true);
  });
});

describe("4. Targeted Promotion Governance Engine", () => {
  it("recommends targeted ₹40 incentive for SECOND_ORDER_RISK instead of blanket discount", () => {
    const promo = generateTargetedPromotion({
      customerId: "cust_rahul",
      customerName: "Rahul Sharma",
      segment: "SECOND_ORDER_RISK",
      totalOrders: 1,
      daysSinceLastOrder: 34,
      avgOrderValue: 480,
    });

    expect(promo.discountValue).toBe(40);
    expect(promo.minBasketValue).toBe(299);
    expect(promo.rationale.toLowerCase()).toContain("second order pending");
    expect(promo.expectedMarginImpact).toContain("GMV expansion");
  });

  it("protects margins for HIGH_VALUE customers by offering VIP service rather than cash discount", () => {
    const promo = generateTargetedPromotion({
      customerId: "cust_vikram",
      customerName: "Vikram Malhotra",
      segment: "HIGH_VALUE",
      totalOrders: 9,
      daysSinceLastOrder: 4,
      avgOrderValue: 790,
    });

    expect(promo.discountValue).toBe(0);
    expect(promo.recommendedIncentive).toContain("VIP Priority");
    expect(promo.expectedMarginImpact).toContain("Zero margin dilution");
  });
});

describe("5. Operations Risk Engine", () => {
  it("prioritizes order into HIGH risk queue when items have low availability and store has rejection history", () => {
    const assessment = calculateOrderRisk({
      orderId: "ord_nc1042",
      orderNumber: "NC1042",
      customerId: "cust_rahul",
      customerSegment: "SECOND_ORDER_RISK",
      customerPriorCancellations: 0,
      storeId: "store_01",
      storeName: "Sri Krishna Kirana",
      storeRejectionRate: 0.14,
      storeFulfillmentRate: 0.84,
      minItemConfidence: 42,
      avgItemConfidence: 55,
      estimatedDeliveryMinutes: 38,
      currentDelayMinutes: 8,
      containsSubstitutedItems: false,
    });

    expect(assessment.riskLevel).toBe("HIGH");
    expect(assessment.riskScore).toBeGreaterThanOrEqual(70);
    expect(assessment.requiresImmediateOpsIntervention).toBe(true);
    expect(assessment.recommendedAction).toBeDefined();
  });

  it("rates low-risk order with high confidence and prompt runner as LOW risk", () => {
    const assessment = calculateOrderRisk({
      orderId: "ord_nominal",
      orderNumber: "NC2001",
      customerId: "cust_regular",
      customerSegment: "REPEAT",
      customerPriorCancellations: 0,
      storeId: "store_02",
      storeName: "Anand Supermart",
      storeRejectionRate: 0.03,
      storeFulfillmentRate: 0.98,
      minItemConfidence: 94,
      avgItemConfidence: 96,
      estimatedDeliveryMinutes: 22,
      currentDelayMinutes: 0,
      containsSubstitutedItems: false,
    });

    expect(assessment.riskLevel).toBe("LOW");
    expect(assessment.requiresImmediateOpsIntervention).toBe(false);
  });
});

describe("6. Business Impact & Scenario Calculator", () => {
  it("models reduction in cancellation rate from 11% to 8% correctly", () => {
    const impact = calculateBusinessImpact({
      monthlyOrders: 38500,
      aov: 486,
      currentCancellationRate: 0.11,
      targetCancellationRate: 0.08,
      currentRepeatRate: 0.27,
      targetRepeatRate: 0.32,
      currentSupportTickets: 5900,
      targetSupportTickets: 4800,
      monthlyPromoSpend: 1700000,
      targetPromoSpend: 1250000,
      sixMonthBudget: 2500000,
    });

    // 38,500 * (0.11 - 0.08) = 1155 recovered monthly orders
    expect(impact.recoveredMonthlyOrders).toBe(1155);
    // 1155 * 486 = 561,330
    expect(impact.recoveredMonthlyGMV).toBe(561330);
    expect(impact.annualizedRecoveredGMV).toBe(561330 * 12);
    // Support ticket reduction: 5900 - 4800 = 1100 tickets
    expect(impact.supportTicketReduction).toBe(1100);
    // 1100 * ₹180 = 198,000
    expect(impact.supportSavingsMonthly).toBe(198000);
    // Positive 6-month ROI multiple
    expect(impact.roiMultiple).toBeGreaterThan(1.5);
    expect(impact.assumptions.length).toBeGreaterThan(0);
  });
});

describe("7. Engine Edge Cases & Boundary Conditions", () => {
  it("handles critically stale inventory (>48h) with high demand and low stock", () => {
    const res = calculateInventoryConfidence({
      productId: "prod_crit_stale",
      productName: "Critical Stale Dairy",
      category: "Dairy",
      storeId: "store_unreliable",
      storeName: "Neglected Kirana",
      storeFulfillmentRate: 0.72,
      storeRejectionRate: 0.22,
      avgDeliveryMinutes: 45,
      stockLevel: 1,
      safetyStock: 5,
      lastAuditedAt: new Date(Date.now() - 52 * 3600 * 1000), // 52 hours ago
      status: "LOW_STOCK",
      recentDemandLastHour: 10,
      recentCancellations24h: 3,
    });

    expect(res.confidence).toBe(5); // Minimum clamp
    expect(res.riskLevel).toBe("HIGH");
    expect(res.isStale).toBe(true);
    expect(res.reasons.some((r) => r.includes("Critically stale"))).toBe(true);
  });

  it("handles missing/no candidates gracefully in alternative recommendation engine", () => {
    const rec = rankProductAlternatives(
      {
        id: "prod_unique",
        name: "Rare Specialty Spices",
        category: "Spices",
        price: 250,
        confidence: 30,
      },
      [], // No candidates
      70
    );

    expect(rec).toBeNull();
  });

  it("handles candidates with identical or lower confidence by filtering them out", () => {
    const rec = rankProductAlternatives(
      {
        id: "prod_bad_01",
        name: "Stale Milk",
        category: "Dairy",
        price: 60,
        confidence: 45,
      },
      [
        {
          id: "prod_bad_02",
          sku: "SKU-BAD-02",
          name: "Equally Stale Milk",
          brand: "BrandX",
          category: "Dairy",
          unit: "1L",
          mrp: 60,
          price: 60,
          storeId: "store_03",
          storeName: "Store 3",
          storeLocality: "Indiranagar",
          stockLevel: 10,
          confidence: 40, // Lower confidence!
          storeFulfillmentRate: 0.80,
          avgDeliveryMinutes: 30,
        },
      ],
      70
    );

    expect(rec).toBeNull();
  });

  it("handles zero delta in impact simulator without throwing or dividing by zero", () => {
    const impact = calculateBusinessImpact({
      monthlyOrders: 38500,
      aov: 486,
      currentCancellationRate: 0.11,
      targetCancellationRate: 0.11, // Zero reduction
      currentRepeatRate: 0.27,
      targetRepeatRate: 0.27,       // Zero lift
      currentSupportTickets: 5900,
      targetSupportTickets: 5900,   // Zero ticket reduction
      monthlyPromoSpend: 1700000,
      targetPromoSpend: 1700000,    // Zero promo savings
      sixMonthBudget: 2500000,
    });

    expect(impact.recoveredMonthlyOrders).toBe(0);
    expect(impact.recoveredMonthlyGMV).toBe(0);
    expect(impact.supportSavingsMonthly).toBe(0);
    expect(impact.promotionalEfficiencyMonthlySavings).toBe(0);
    expect(impact.totalMonthlyValueDelivered).toBe(0);
    expect(impact.netBenefitAfterBudget).toBe(-2500000);
    expect(impact.roiMultiple).toBe(0);
  });

  it("recalculates order risk from HIGH to LOW when alternative substitute is accepted", () => {
    // Before substitution: High risk item (confidence: 42%)
    const highRiskAssessment = calculateOrderRisk({
      orderId: "ord_flow_test",
      orderNumber: "NC_TEST_01",
      customerId: "cust_rahul",
      customerSegment: "SECOND_ORDER_RISK",
      customerPriorCancellations: 0,
      storeId: "store_01",
      storeName: "Sri Krishna Kirana",
      storeRejectionRate: 0.14,
      storeFulfillmentRate: 0.84,
      minItemConfidence: 42,
      avgItemConfidence: 42,
      estimatedDeliveryMinutes: 38,
      containsSubstitutedItems: false,
    });

    expect(highRiskAssessment.riskLevel).toBe("HIGH");

    // After substitution: High-confidence substitute from reliable store (confidence: 99%)
    const mitigatedAssessment = calculateOrderRisk({
      orderId: "ord_flow_test",
      orderNumber: "NC_TEST_01",
      customerId: "cust_rahul",
      customerSegment: "SECOND_ORDER_RISK",
      customerPriorCancellations: 0,
      storeId: "store_02",
      storeName: "Anand Supermart & Fresh Dairy",
      storeRejectionRate: 0.03,
      storeFulfillmentRate: 0.97,
      minItemConfidence: 99,
      avgItemConfidence: 99,
      estimatedDeliveryMinutes: 22,
      containsSubstitutedItems: true,
    });

    expect(mitigatedAssessment.riskLevel).toBe("LOW");
    expect(mitigatedAssessment.riskScore).toBeLessThan(highRiskAssessment.riskScore);
    expect(mitigatedAssessment.requiresImmediateOpsIntervention).toBe(false);
  });
});
