import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/security";
import { z } from "zod";

const resolveOrderSchema = z.object({
  orderId: z.string().min(1, "Order ID is required"),
  resolutionAction: z.enum([
    "OFFERED_ALTERNATIVE",
    "SUBSTITUTE_CONFIRMED",
    "RUNNER_EXPEDITED",
    "STORE_CONFIRMED",
  ]),
  notes: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = resolveOrderSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Invalid resolution payload", 400, parsed.error.format());
    }

    const { orderId, resolutionAction, notes } = parsed.data;

    // Find order
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true, delivery: true },
    });

    if (!order) {
      return apiError("Order not found", 404);
    }

    // Update order status to ACCEPTED, lower riskLevel to LOW, set resolution details
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: "ACCEPTED",
        riskLevel: "LOW",
        riskScore: 20,
        resolutionAction,
        resolutionNotes: notes ?? `Resolved via Operations Control: ${resolutionAction}`,
        resolvedAt: new Date(),
        riskFactors: JSON.stringify([
          "Fulfillment risk resolved by operations agent",
          `Intervention: ${resolutionAction}`,
        ]),
      },
      include: {
        customer: true,
        store: true,
        items: { include: { product: true } },
        delivery: true,
      },
    });

    // If order had a delivery runner, update status to ARRIVED_STORE
    if (order.delivery) {
      await prisma.delivery.update({
        where: { id: order.delivery.id },
        data: {
          status: "ARRIVED_STORE",
          delayMinutes: 0,
        },
      });
    }

    return apiSuccess({
      message: `Order #${order.orderNumber} successfully resolved with action: ${resolutionAction}`,
      order: updatedOrder,
    });
  } catch (error) {
    return apiError("Failed to resolve order", 500);
  }
}
