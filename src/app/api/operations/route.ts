import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const riskFilter = searchParams.get("risk");

    // Fetch orders with priority for HIGH risk
    const orders = await prisma.order.findMany({
      where: {
        ...(riskFilter ? { riskLevel: riskFilter } : {}),
      },
      include: {
        customer: {
          include: {
            behavior: true,
          },
        },
        store: true,
        items: {
          include: {
            product: true,
          },
        },
        delivery: true,
        supportTickets: true,
      },
      orderBy: [
        { riskLevel: "desc" }, // HIGH first
        { createdAt: "desc" },
      ],
      take: 50,
    });

    // Counts
    const highRiskOrders = orders.filter((o) => o.riskLevel === "HIGH" && o.status === "PENDING");
    const delayedOrders = orders.filter((o) => (o.delivery?.delayMinutes ?? 0) > 5);
    const refundDisputes = await prisma.supportTicket.findMany({
      where: { issueType: { in: ["REFUND_DISPUTE", "CANCELLED_ORDER"] } },
      include: { customer: true, order: true },
      take: 10,
    });

    return apiSuccess({
      stats: {
        totalActiveOrders: orders.length,
        highRiskPendingCount: highRiskOrders.length,
        delayedOrdersCount: delayedOrders.length,
        openRefundDisputesCount: refundDisputes.filter((t) => t.status === "OPEN").length,
      },
      priorityQueue: orders,
      refundDisputes,
    });
  } catch (error) {
    return apiError("Failed to fetch operations center data", 500);
  }
}
