import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/security";

export async function GET(req: NextRequest) {
  try {
    const stores = await prisma.store.findMany({
      include: {
        inventories: {
          include: { product: true },
        },
        orders: {
          take: 10,
          orderBy: { createdAt: "desc" },
        },
      },
    });

    const storeAnalysis = stores.map((s) => {
      const totalItems = s.inventories.length;
      const staleItems = s.inventories.filter((i) => {
        const hours = (Date.now() - new Date(i.lastAuditedAt).getTime()) / (1000 * 3600);
        return hours > 24;
      });
      const outOfStockItems = s.inventories.filter((i) => i.stockLevel === 0);
      const lowStockItems = s.inventories.filter((i) => i.stockLevel > 0 && i.stockLevel <= i.safetyStock);

      let healthGrade: "A" | "B" | "C" | "CRITICAL" = "A";
      if (s.historicalFulfillmentRate < 0.85 || s.rejectionRate > 0.12 || staleItems.length > 5) {
        healthGrade = "CRITICAL";
      } else if (s.historicalFulfillmentRate < 0.90 || s.rejectionRate > 0.08) {
        healthGrade = "C";
      } else if (s.historicalFulfillmentRate < 0.95) {
        healthGrade = "B";
      }

      return {
        id: s.id,
        name: s.name,
        locality: s.locality,
        address: s.address,
        rating: s.rating,
        historicalFulfillmentRate: Math.round(s.historicalFulfillmentRate * 100),
        rejectionRate: Math.round(s.rejectionRate * 100),
        avgDeliveryMinutes: s.avgDeliveryMinutes,
        isOnline: s.isOnline,
        healthGrade,
        inventoryHealth: {
          totalProductsStocked: totalItems,
          staleItemsCount: staleItems.length,
          outOfStockCount: outOfStockItems.length,
          lowStockCount: lowStockItems.length,
        },
        productsNeedingUpdate: staleItems.slice(0, 5).map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          category: i.product.category,
          stockLevel: i.stockLevel,
          hoursSinceAudit: Math.round((Date.now() - new Date(i.lastAuditedAt).getTime()) / (1000 * 3600)),
        })),
        highDemandUnavailable: outOfStockItems.slice(0, 5).map((i) => ({
          productId: i.productId,
          productName: i.product.name,
          category: i.product.category,
        })),
      };
    });

    return apiSuccess(storeAnalysis);
  } catch (error) {
    return apiError("Failed to fetch store intelligence", 500);
  }
}
