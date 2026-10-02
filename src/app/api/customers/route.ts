import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/security";
import { evaluateCustomerRetention } from "@/lib/services/retentionService";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const segmentFilter = searchParams.get("segment");

    const customers = await prisma.user.findMany({
      where: {
        role: "CUSTOMER",
      },
      include: {
        behavior: true,
        orders: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        supportTickets: true,
      },
    });

    const evaluatedCustomers = customers.map((c) => {
      const b = c.behavior;
      const cancelledCount = c.orders.filter((o) => o.status === "CANCELLED").length;
      const ticketsCount = c.supportTickets.length;

      const profile = evaluateCustomerRetention({
        customerId: c.id,
        totalOrders: b?.totalOrders ?? c.orders.length,
        daysSinceLastOrder: b?.daysSinceLastOrder ?? 30,
        avgOrderValue: b?.avgOrderValue ?? 450,
        distinctCategoriesCount: Math.round((b?.categoryDiversityScore ?? 0.3) * 5) || 1,
        cancelledOrdersCount: cancelledCount,
        supportTicketsCount: ticketsCount,
      });

      return {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        segment: profile.segment,
        totalOrders: b?.totalOrders ?? c.orders.length,
        daysSinceLastOrder: b?.daysSinceLastOrder ?? 0,
        avgOrderValue: b?.avgOrderValue ?? 450,
        churnRiskScore: profile.churnRiskScore,
        repeatProbability: profile.repeatProbability,
        lifecycleStage: profile.lifecycleStage,
        riskFactors: profile.riskFactors,
        recommendedIntervention: profile.recommendedIntervention,
        isSecondOrderFrictionPoint: profile.isSecondOrderFrictionPoint,
        recentOrders: c.orders.map((o) => ({
          orderNumber: o.orderNumber,
          totalAmount: o.totalAmount,
          status: o.status,
          riskLevel: o.riskLevel,
          createdAt: o.createdAt,
        })),
      };
    });

    let filtered = evaluatedCustomers;
    if (segmentFilter) {
      filtered = evaluatedCustomers.filter((c) => c.segment === segmentFilter);
    }

    return apiSuccess({
      totalCustomers: evaluatedCustomers.length,
      customers: filtered,
    });
  } catch (error) {
    return apiError("Failed to fetch customer intelligence", 500);
  }
}
