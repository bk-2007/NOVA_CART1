import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/security";
import { calculateOrderRisk } from "@/lib/services/riskEngine";
import { z } from "zod";

const createOrderSchema = z.object({
  customerId: z.string().min(1, "Customer ID is required"),
  storeId: z.string().min(1, "Store ID is required"),
  items: z.array(
    z.object({
      productId: z.string().min(1),
      quantity: z.number().int().min(1),
      unitPrice: z.number().positive(),
      isSubstituted: z.boolean().default(false),
      originalProductId: z.string().optional(),
      substitutedProductId: z.string().optional(),
      itemConfidence: z.number().min(0).max(100).default(80),
    })
  ).min(1, "Order must contain at least one item"),
  deliveryFee: z.number().default(30),
  discountAmount: z.number().default(0),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Validation failed", 400, parsed.error.format());
    }

    const { customerId, storeId, items, deliveryFee, discountAmount } = parsed.data;

    // Fetch customer profile & store info
    const customer = await prisma.user.findUnique({
      where: { id: customerId },
      include: { behavior: true },
    });

    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!customer || !store) {
      return apiError("Invalid customer or store ID", 404);
    }

    const itemsTotal = items.reduce((acc, item) => acc + item.unitPrice * item.quantity, 0);
    const totalAmount = Math.max(0, itemsTotal + deliveryFee - discountAmount);

    const minItemConf = Math.min(...items.map((i) => i.itemConfidence));
    const avgItemConf = Math.round(items.reduce((acc, i) => acc + i.itemConfidence, 0) / items.length);
    const hasSubstitutions = items.some((i) => i.isSubstituted);

    // Run Operational Risk Engine
    const orderNumber = `NC${Math.floor(1000 + Math.random() * 9000)}`;
    const riskAssessment = calculateOrderRisk({
      orderId: `temp_${orderNumber}`,
      orderNumber,
      customerId: customer.id,
      customerSegment: customer.behavior?.segment ?? "NEW",
      customerPriorCancellations: 0,
      storeId: store.id,
      storeName: store.name,
      storeRejectionRate: store.rejectionRate,
      storeFulfillmentRate: store.historicalFulfillmentRate,
      minItemConfidence: minItemConf,
      avgItemConfidence: avgItemConf,
      estimatedDeliveryMinutes: store.avgDeliveryMinutes,
      containsSubstitutedItems: hasSubstitutions,
    });

    // Create order, items, and delivery in transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          orderNumber,
          customerId: customer.id,
          storeId: store.id,
          status: "PENDING",
          riskLevel: riskAssessment.riskLevel,
          riskScore: riskAssessment.riskScore,
          riskFactors: JSON.stringify(riskAssessment.factors),
          totalAmount,
          deliveryFee,
          discountAmount,
          paymentStatus: "PAID",
        },
      });

      for (const item of items) {
        await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            isSubstituted: item.isSubstituted,
            originalProductId: item.originalProductId,
            substitutedProductId: item.substitutedProductId,
          },
        });
      }

      await tx.delivery.create({
        data: {
          orderId: order.id,
          runnerName: `Partner ${Math.floor(10 + Math.random() * 90)}`,
          runnerPhone: "+91 98450 00000",
          status: "ASSIGNED",
          estimatedMinutes: store.avgDeliveryMinutes,
          delayMinutes: 0,
        },
      });

      // Update customer behavior record
      if (customer.behavior) {
        await tx.customerBehavior.update({
          where: { customerId: customer.id },
          data: {
            totalOrders: customer.behavior.totalOrders + 1,
            lastOrderAt: new Date(),
            daysSinceLastOrder: 0,
          },
        });
      }

      return order;
    });

    return apiSuccess({
      order: newOrder,
      riskAssessment,
      message: `Order #${orderNumber} created successfully. Risk tier: ${riskAssessment.riskLevel}`,
    }, 201);
  } catch (error) {
    return apiError("Failed to create order", 500);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const riskLevel = searchParams.get("riskLevel");
    const limit = parseInt(searchParams.get("limit") ?? "50", 10);

    const orders = await prisma.order.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(riskLevel ? { riskLevel } : {}),
      },
      include: {
        customer: true,
        store: true,
        items: {
          include: {
            product: true,
          },
        },
        delivery: true,
      },
      orderBy: { createdAt: "desc" },
      take: Math.min(limit, 100),
    });

    return apiSuccess(orders);
  } catch (error) {
    return apiError("Failed to fetch orders", 500);
  }
}
