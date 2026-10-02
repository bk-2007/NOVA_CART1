import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/security";
import { calculateInventoryConfidence } from "@/lib/services/inventoryConfidenceService";
import { z } from "zod";

const updateInventorySchema = z.object({
  storeId: z.string().min(1, "storeId is required"),
  productId: z.string().min(1, "productId is required"),
  stockLevel: z.number().int().min(0, "Stock level must be 0 or greater").optional(),
  status: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "STALE"]).optional(),
  safetyStock: z.number().int().min(0).optional(),
  markVerifiedNow: z.boolean().default(true),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filter = searchParams.get("filter"); // all, stale, high_risk, low_stock
    const storeId = searchParams.get("storeId");

    const inventories = await prisma.inventory.findMany({
      where: {
        ...(storeId ? { storeId } : {}),
      },
      include: {
        product: true,
        store: true,
      },
      orderBy: { lastAuditedAt: "asc" }, // Show stalest audits first
    });

    const evaluated = inventories.map((inv) => {
      const conf = calculateInventoryConfidence({
        productId: inv.productId,
        productName: inv.product.name,
        category: inv.product.category,
        storeId: inv.storeId,
        storeName: inv.store.name,
        storeFulfillmentRate: inv.store.historicalFulfillmentRate,
        storeRejectionRate: inv.store.rejectionRate,
        avgDeliveryMinutes: inv.store.avgDeliveryMinutes,
        stockLevel: inv.stockLevel,
        safetyStock: inv.safetyStock,
        lastAuditedAt: inv.lastAuditedAt,
        status: inv.status as any,
        recentDemandLastHour: inv.storeId === "store_01" ? 4 : 1,
      });

      return {
        id: inv.id,
        storeId: inv.storeId,
        storeName: inv.store.name,
        storeLocality: inv.store.locality,
        productId: inv.productId,
        productName: inv.product.name,
        brand: inv.product.brand,
        category: inv.product.category,
        unit: inv.product.unit,
        price: inv.product.price,
        stockLevel: inv.stockLevel,
        safetyStock: inv.safetyStock,
        status: inv.status,
        lastAuditedAt: inv.lastAuditedAt,
        hoursSinceAudit: conf.hoursSinceAudit,
        isStale: conf.isStale,
        confidence: conf.confidence,
        riskLevel: conf.riskLevel,
        reasons: conf.reasons,
      };
    });

    // Apply filtering
    let filtered = evaluated;
    if (filter === "stale") {
      filtered = evaluated.filter((i) => i.isStale);
    } else if (filter === "high_risk") {
      filtered = evaluated.filter((i) => i.riskLevel === "HIGH");
    } else if (filter === "low_stock") {
      filtered = evaluated.filter((i) => i.stockLevel <= i.safetyStock);
    }

    // Summary counters
    const summary = {
      totalMonitoredItems: evaluated.length,
      staleAuditsCount: evaluated.filter((i) => i.isStale).length,
      highRiskItemsCount: evaluated.filter((i) => i.riskLevel === "HIGH").length,
      lowStockCount: evaluated.filter((i) => i.stockLevel <= i.safetyStock).length,
      averageConfidence: Math.round(
        evaluated.reduce((acc, i) => acc + i.confidence, 0) / evaluated.length
      ),
    };

    return apiSuccess({
      summary,
      items: filtered,
    });
  } catch (error) {
    return apiError("Failed to fetch inventory intelligence", 500);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = updateInventorySchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Invalid inventory update payload", 400, parsed.error.format());
    }

    const { storeId, productId, stockLevel, status, safetyStock, markVerifiedNow } = parsed.data;

    const existing = await prisma.inventory.findUnique({
      where: {
        storeId_productId: {
          storeId,
          productId,
        },
      },
      include: {
        product: true,
        store: true,
      },
    });

    if (!existing) {
      return apiError("Inventory record not found", 404);
    }

    const now = new Date();
    const newStock = stockLevel !== undefined ? stockLevel : existing.stockLevel;
    const newStatus =
      status !== undefined
        ? status
        : newStock === 0
        ? "OUT_OF_STOCK"
        : newStock <= (safetyStock ?? existing.safetyStock)
        ? "LOW_STOCK"
        : "IN_STOCK";

    const updated = await prisma.inventory.update({
      where: {
        storeId_productId: {
          storeId,
          productId,
        },
      },
      data: {
        stockLevel: newStock,
        status: newStatus,
        safetyStock: safetyStock !== undefined ? safetyStock : existing.safetyStock,
        lastAuditedAt: markVerifiedNow ? now : existing.lastAuditedAt,
      },
      include: {
        product: true,
        store: true,
      },
    });

    // Record inventory audit event
    await prisma.inventoryEvent.create({
      data: {
        storeId,
        productId,
        eventType: markVerifiedNow ? "AUDIT" : "ADJUSTMENT",
        quantityChange: newStock - existing.stockLevel,
        previousStock: existing.stockLevel,
        newStock,
        note: `Manual audit verified via local commerce dashboard`,
      },
    });

    // Recalculate confidence immediately with updated values
    const newConfidence = calculateInventoryConfidence({
      productId: updated.productId,
      productName: updated.product.name,
      category: updated.product.category,
      storeId: updated.storeId,
      storeName: updated.store.name,
      storeFulfillmentRate: updated.store.historicalFulfillmentRate,
      storeRejectionRate: updated.store.rejectionRate,
      avgDeliveryMinutes: updated.store.avgDeliveryMinutes,
      stockLevel: updated.stockLevel,
      safetyStock: updated.safetyStock,
      lastAuditedAt: updated.lastAuditedAt,
      status: updated.status as any,
    });

    return apiSuccess({
      message: "Inventory successfully updated and verified",
      item: {
        ...updated,
        confidence: newConfidence.confidence,
        riskLevel: newConfidence.riskLevel,
        reasons: newConfidence.reasons,
        isStale: newConfidence.isStale,
        hoursSinceAudit: newConfidence.hoursSinceAudit,
      },
    });
  } catch (error) {
    return apiError("Failed to update inventory", 500);
  }
}
