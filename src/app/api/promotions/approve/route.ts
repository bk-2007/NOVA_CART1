import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/security";
import { z } from "zod";

const approvePromotionSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  segment: z.string().min(1),
  discountValue: z.number().nonnegative(),
  minBasketValue: z.number().nonnegative(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = approvePromotionSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Invalid promotion approval payload", 400, parsed.error.format());
    }

    const { customerId, segment, discountValue, minBasketValue } = parsed.data;

    const customer = await prisma.user.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return apiError("Customer not found", 404);
    }

    // Find or create targeted promotion record
    let promo = await prisma.promotion.findFirst({
      where: { targetSegment: segment },
    });

    if (!promo) {
      promo = await prisma.promotion.create({
        data: {
          code: `TARGET-${segment.slice(0, 6)}-${Date.now().toString().slice(-4)}`,
          title: `Targeted Intervention: ${segment}`,
          description: `Custom retention subsidy for ${segment} cohort`,
          targetSegment: segment,
          discountType: "FIXED",
          discountValue,
          minOrderValue: minBasketValue,
          validUntil: new Date(Date.now() + 30 * 24 * 3600 * 1000),
        },
      });
    }

    // Issue individualized coupon
    const couponCode = `${promo.code}-${customer.name.split(" ")[0].toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    const coupon = await prisma.coupon.create({
      data: {
        promotionId: promo.id,
        customerId: customer.id,
        code: couponCode,
        status: "AVAILABLE",
      },
    });

    return apiSuccess({
      message: `Targeted incentive successfully approved for ${customer.name}. Status: Approved.`,
      coupon,
      isApproved: true,
    });
  } catch (error) {
    return apiError("Failed to approve promotion", 500);
  }
}
