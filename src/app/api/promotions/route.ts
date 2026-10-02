import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/security";
import { generateTargetedPromotion, PLATFORM_PROMOTION_METRICS } from "@/lib/services/promotionService";

export async function GET(req: NextRequest) {
  try {
    const customers = await prisma.user.findMany({
      where: { role: "CUSTOMER" },
      include: {
        behavior: true,
        coupons: {
          include: { promotion: true },
        },
      },
    });

    const activePromotions = await prisma.promotion.findMany({
      include: { coupons: true },
    });

    // Generate targeted recommendations for customers
    const targetedRecommendations = customers.map((c) => {
      const b = c.behavior;
      const rec = generateTargetedPromotion({
        customerId: c.id,
        customerName: c.name,
        segment: (b?.segment as any) ?? "NEW",
        totalOrders: b?.totalOrders ?? 0,
        daysSinceLastOrder: b?.daysSinceLastOrder ?? 0,
        avgOrderValue: b?.avgOrderValue ?? 450,
      });

      // Check if already approved (check if coupon exists for this customer)
      const hasCoupon = c.coupons.some((cp) => cp.promotion.targetSegment === b?.segment);

      return {
        ...rec,
        isApproved: hasCoupon,
      };
    });

    return apiSuccess({
      metrics: PLATFORM_PROMOTION_METRICS,
      activePromotions,
      targetedRecommendations,
    });
  } catch (error) {
    return apiError("Failed to fetch promotion intelligence", 500);
  }
}
