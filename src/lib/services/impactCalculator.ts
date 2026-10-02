import { ImpactScenarioInput, ImpactScenarioOutput } from "@/types";

/**
 * NOVA CART LOCAL COMMERCE INTELLIGENCE
 * Business Impact & Scenario Simulator
 *
 * Mathematically models the economic turnaround from resolving the inventory-fulfillment-churn cascade.
 * Note: All figures are projections labeled as SCENARIO ESTIMATES based on empirical operational benchmarks.
 */
export function calculateBusinessImpact(input: ImpactScenarioInput): ImpactScenarioOutput {
  const monthlyOrders = input.monthlyOrders ?? 38500;
  const aov = input.aov ?? 486;
  const currentCancellationRate = input.currentCancellationRate ?? 0.11;
  const targetCancellationRate = Math.max(0.01, Math.min(currentCancellationRate, input.targetCancellationRate));

  const currentRepeatRate = input.currentRepeatRate ?? 0.27;
  const targetRepeatRate = Math.max(currentRepeatRate, Math.min(0.60, input.targetRepeatRate));

  const currentSupportTickets = input.currentSupportTickets ?? 5900;
  const targetSupportTickets = Math.max(1000, Math.min(currentSupportTickets, input.targetSupportTickets));

  const monthlyPromoSpend = input.monthlyPromoSpend ?? 1700000;
  const targetPromoSpend = Math.max(800000, Math.min(monthlyPromoSpend, input.targetPromoSpend ?? 1250000));

  const sixMonthBudget = input.sixMonthBudget ?? 2500000;

  // 1. Order Recovery from Inventory Accuracy & Substitution Intelligence
  const cancellationReduction = Math.max(0, currentCancellationRate - targetCancellationRate);
  const recoveredMonthlyOrders = Math.round(monthlyOrders * cancellationReduction);
  const recoveredMonthlyGMV = Math.round(recoveredMonthlyOrders * aov);
  const annualizedRecoveredGMV = recoveredMonthlyGMV * 12;

  // 2. Retention GMV Expansion
  // Repeat rate expansion drives higher cohort repurchase volume
  const repeatRateDelta = Math.max(0, targetRepeatRate - currentRepeatRate);
  const additionalRepeatOrders = Math.round(monthlyOrders * repeatRateDelta * 0.75); // conservative dampening
  const repeatCustomerLiftMonthlyGMV = Math.round(additionalRepeatOrders * aov);

  // 3. Operational Support Cost Reduction
  // Industry standard ticket handling cost for quick-commerce in India: ~₹150 - ₹200 per dispute
  const supportTicketReduction = Math.max(0, currentSupportTickets - targetSupportTickets);
  const costPerTicketINR = 180;
  const supportSavingsMonthly = supportTicketReduction * costPerTicketINR;

  // 4. Promotional Efficiency Savings
  // Shifting from blanket discounts (44% unused) to targeted incentives saves promo burn
  const promotionalEfficiencyMonthlySavings = Math.max(0, monthlyPromoSpend - targetPromoSpend);

  // 5. Total Value & ROI
  const totalMonthlyValueDelivered =
    recoveredMonthlyGMV +
    repeatCustomerLiftMonthlyGMV +
    supportSavingsMonthly +
    promotionalEfficiencyMonthlySavings;

  const sixMonthCumulativeBenefit = totalMonthlyValueDelivered * 6;
  const netBenefitAfterBudget = sixMonthCumulativeBenefit - sixMonthBudget;
  const roiMultiple = Math.round((sixMonthCumulativeBenefit / sixMonthBudget) * 10) / 10;

  const assumptions = [
    "Average Order Value (AOV) modeled at constant ₹" + aov + " base level.",
    "Quick-commerce customer support resolution cost benchmarked at ₹" + costPerTicketINR + " per ticket.",
    "Repeat rate increase applied to active monthly buyer base with 0.75 conservative volume absorption factor.",
    "Promotional spend savings reallocated from blanket coupon leakage to high-leverage cohort triggers.",
    "Implementation budget allocated at ₹25.0 Lakhs over a 6-month operational deployment horizon.",
  ];

  return {
    recoveredMonthlyOrders,
    recoveredMonthlyGMV,
    annualizedRecoveredGMV,
    repeatCustomerLiftMonthlyGMV,
    supportTicketReduction,
    supportSavingsMonthly,
    promotionalEfficiencyMonthlySavings,
    totalMonthlyValueDelivered,
    sixMonthCumulativeBenefit,
    netBenefitAfterBudget,
    roiMultiple,
    assumptions,
  };
}
