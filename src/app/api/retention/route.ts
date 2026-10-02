import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/security";
import { evaluateCustomerRetention } from "@/lib/services/retentionService";

export async function GET(req: NextRequest) {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        behavior: true,
        orders: { take: 3, orderBy: { createdAt: "desc" } },
        supportTickets: true,
      },
    });

    const profiles = customers.map((c) => {
      const b = c.behavior;
      return {
        customer: c,
        profile: evaluateCustomerRetention({
          customerId: c.id,
          totalOrders: b?.totalOrders ?? c.orders.length,
          daysSinceLastOrder: b?.daysSinceLastOrder ?? 30,
          avgOrderValue: b?.avgOrderValue ?? 480,
          distinctCategoriesCount: Math.round((b?.categoryDiversityScore ?? 0.3) * 5) || 1,
          cancelledOrdersCount: c.orders.filter((o) => o.status === "CANCELLED").length,
          supportTicketsCount: c.supportTickets.length,
        }),
      };
    });

    // Funnel benchmarks as specified in business context
    const lifecycleFunnel = [
      {
        stage: "1. ACQUISITION TRIAL",
        label: "First Order Completion",
        conversionRate: 54, // 54% complete first order
        benchmarkText: "54% of registered app visitors complete an initial order",
        activeCount: profiles.filter((p) => p.profile.segment === "FIRST_ORDER" || p.profile.segment === "NEW").length,
        status: "HEALTHY",
      },
      {
        stage: "2. CRITICAL HURDLE",
        label: "Second Order in 30 Days",
        conversionRate: 31, // 31% place second order within 30 days
        benchmarkText: "Only 31% place 2nd order within 30d (Major business friction point)",
        activeCount: profiles.filter((p) => p.profile.segment === "SECOND_ORDER_RISK").length,
        status: "ALERT",
        isCoreBottleneck: true,
      },
      {
        stage: "3. HABIT FORMATION",
        label: "Third Order Completion",
        conversionRate: 48,
        benchmarkText: "Crucial loyalty milestone bridging trial and established cadence",
        activeCount: profiles.filter((p) => p.customer.behavior?.totalOrders === 2).length,
        status: "MODERATE",
      },
      {
        stage: "4. REPEAT RETENTION",
        label: "Established Repeat Cohort",
        conversionRate: 72, // 72% next-month ordering probability after 3 orders
        benchmarkText: "72% probability of ordering next month once 3 orders are fulfilled",
        activeCount: profiles.filter((p) => p.profile.segment === "REPEAT" || p.profile.segment === "HIGH_VALUE").length,
        status: "STRONG",
      },
    ];

    // Priority cohort recommendations
    const cohortRecommendations = profiles
      .filter((p) => p.profile.segment === "SECOND_ORDER_RISK" || p.profile.churnRiskScore >= 0.65)
      .slice(0, 10)
      .map((p) => ({
        customerId: p.customer.id,
        customerName: p.customer.name,
        email: p.customer.email,
        phone: p.customer.phone,
        segment: p.profile.segment,
        totalOrders: p.customer.behavior?.totalOrders ?? 1,
        daysSinceLastOrder: p.customer.behavior?.daysSinceLastOrder ?? 32,
        churnRiskScore: p.profile.churnRiskScore,
        repeatProbability: p.profile.repeatProbability,
        recommendedIntervention: p.profile.recommendedIntervention,
        riskFactors: p.profile.riskFactors,
      }));

    return apiSuccess({
      metrics: {
        secondOrderConversionRate: "31%",
        threeOrderLoyaltyLockin: "72%",
        couponWastageRate: "44%",
        repeatRateOverall: "27% (Down from 41% 6m ago)",
      },
      lifecycleFunnel,
      cohortRecommendations,
    });
  } catch (error) {
    return apiError("Failed to fetch retention intelligence", 500);
  }
}
