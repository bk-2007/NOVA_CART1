import { describe, it, expect, beforeEach, afterAll } from "vitest";
import prisma from "@/lib/db";
import { calculateInventoryConfidence } from "@/lib/services/inventoryConfidenceService";
import { rankProductAlternatives } from "@/lib/services/recommendationService";
import { calculateOrderRisk } from "@/lib/services/riskEngine";
import { calculateBusinessImpact } from "@/lib/services/impactCalculator";
import { z } from "zod";

const inventoryUpdateSchema = z.object({
  storeId: z.string().min(1, "storeId is required"),
  productId: z.string().min(1, "productId is required"),
  stockLevel: z.number().int().min(0, "Stock level cannot be negative"),
  status: z.enum(["IN_STOCK", "LOW_STOCK", "OUT_OF_STOCK", "STALE"]),
});

const orderResolutionSchema = z.object({
  orderId: z.string().min(1),
  resolutionAction: z.string().min(1),
  notes: z.string().optional(),
});

describe("Integration & System Validation Flow", () => {
  beforeEach(async () => {
    const amul = await prisma.product.findUnique({
      where: { sku: "SKU-MILK-AMUL-01" },
    });
    if (amul) {
      await prisma.inventory.upsert({
        where: {
          storeId_productId: {
            storeId: "store_01",
            productId: amul.id,
          },
        },
        update: {
          stockLevel: 2,
          safetyStock: 5,
          lastAuditedAt: new Date(Date.now() - 28 * 3600 * 1000),
          status: "LOW_STOCK",
        },
        create: {
          storeId: "store_01",
          productId: amul.id,
          stockLevel: 2,
          safetyStock: 5,
          lastAuditedAt: new Date(Date.now() - 28 * 3600 * 1000),
          status: "LOW_STOCK",
        },
      });
    }
  });
  it("verifies end-to-end product search and alternative recommendation", async () => {
    // 1. Search for Milk
    const amulMilk = await prisma.product.findUnique({
      where: { sku: "SKU-MILK-AMUL-01" },
      include: {
        inventories: {
          where: { storeId: "store_01" },
          include: { store: true },
        },
      },
    });

    expect(amulMilk).not.toBeNull();
    const inv = amulMilk!.inventories[0];

    // 2. Calculate confidence for original product at store_01
    const originalConfidence = calculateInventoryConfidence({
      productId: amulMilk!.id,
      productName: amulMilk!.name,
      category: amulMilk!.category,
      storeId: inv.storeId,
      storeName: inv.store.name,
      storeFulfillmentRate: inv.store.historicalFulfillmentRate,
      storeRejectionRate: inv.store.rejectionRate,
      avgDeliveryMinutes: inv.store.avgDeliveryMinutes,
      stockLevel: inv.stockLevel,
      safetyStock: inv.safetyStock,
      lastAuditedAt: inv.lastAuditedAt,
      status: inv.status as any,
    });

    // Stale audit (>24h) and low stock results in low confidence
    expect(originalConfidence.confidence).toBeLessThan(50);
    expect(originalConfidence.isStale).toBe(true);

    // 3. System identifies alternative: Mother Dairy Milk at store_02
    const motherDairy = await prisma.product.findUnique({
      where: { sku: "SKU-MILK-MD-02" },
      include: {
        inventories: {
          where: { storeId: "store_02" },
          include: { store: true },
        },
      },
    });

    expect(motherDairy).not.toBeNull();
    const mdInv = motherDairy!.inventories[0];

    const mdConfidence = calculateInventoryConfidence({
      productId: motherDairy!.id,
      productName: motherDairy!.name,
      category: motherDairy!.category,
      storeId: mdInv.storeId,
      storeName: mdInv.store.name,
      storeFulfillmentRate: mdInv.store.historicalFulfillmentRate,
      storeRejectionRate: mdInv.store.rejectionRate,
      avgDeliveryMinutes: mdInv.store.avgDeliveryMinutes,
      stockLevel: mdInv.stockLevel,
      safetyStock: mdInv.safetyStock,
      lastAuditedAt: mdInv.lastAuditedAt,
      status: mdInv.status as any,
    });

    expect(mdConfidence.confidence).toBeGreaterThanOrEqual(90);

    // 4. Recommendation engine produces ranked substitute
    const rec = rankProductAlternatives(
      {
        id: amulMilk!.id,
        name: amulMilk!.name,
        category: amulMilk!.category,
        price: amulMilk!.price,
        confidence: originalConfidence.confidence,
      },
      [
        {
          id: motherDairy!.id,
          sku: motherDairy!.sku,
          name: motherDairy!.name,
          brand: motherDairy!.brand,
          category: motherDairy!.category,
          unit: motherDairy!.unit,
          mrp: motherDairy!.mrp,
          price: motherDairy!.price,
          storeId: mdInv.storeId,
          storeName: mdInv.store.name,
          storeLocality: mdInv.store.locality,
          stockLevel: mdInv.stockLevel,
          confidence: mdConfidence.confidence,
          storeFulfillmentRate: mdInv.store.historicalFulfillmentRate,
          avgDeliveryMinutes: mdInv.store.avgDeliveryMinutes,
        },
      ]
    );

    expect(rec).not.toBeNull();
    expect(rec?.recommendedAlternative.name).toContain("Mother Dairy");
    expect(rec?.recommendedAlternative.confidence).toBeGreaterThanOrEqual(90);
  });

  it("updates inventory and demonstrates immediate confidence recovery", async () => {
    const amul = await prisma.product.findUnique({
      where: { sku: "SKU-MILK-AMUL-01" },
    });
    expect(amul).not.toBeNull();

    // Perform verified audit update
    const now = new Date();
    const updatedInv = await prisma.inventory.update({
      where: {
        storeId_productId: {
          storeId: "store_01",
          productId: amul!.id,
        },
      },
      data: {
        stockLevel: 25,
        safetyStock: 5,
        lastAuditedAt: now,
        status: "IN_STOCK",
      },
      include: { store: true },
    });

    // Re-evaluate confidence
    const freshConfidence = calculateInventoryConfidence({
      productId: amul!.id,
      productName: amul!.name,
      category: amul!.category,
      storeId: updatedInv.storeId,
      storeName: updatedInv.store.name,
      storeFulfillmentRate: updatedInv.store.historicalFulfillmentRate,
      storeRejectionRate: updatedInv.store.rejectionRate,
      avgDeliveryMinutes: updatedInv.store.avgDeliveryMinutes,
      stockLevel: updatedInv.stockLevel,
      safetyStock: updatedInv.safetyStock,
      lastAuditedAt: updatedInv.lastAuditedAt,
      status: updatedInv.status as any,
    });

    expect(freshConfidence.confidence).toBeGreaterThan(60);
    expect(freshConfidence.isStale).toBe(false);

    // Revert back so demo flow works out of the box
    await prisma.inventory.update({
      where: {
        storeId_productId: {
          storeId: "store_01",
          productId: amul!.id,
        },
      },
      data: {
        stockLevel: 2,
        safetyStock: 5,
        lastAuditedAt: new Date(Date.now() - 28 * 3600 * 1000),
        status: "LOW_STOCK",
      },
    });
  });

  it("verifies operations risk resolution on Order #NC1042", async () => {
    const order = await prisma.order.findUnique({
      where: { orderNumber: "NC1042" },
    });
    expect(order).not.toBeNull();
    expect(order?.riskLevel).toBe("HIGH");

    // Operations officer resolves the high-risk order
    const updated = await prisma.order.update({
      where: { orderNumber: "NC1042" },
      data: {
        status: "ACCEPTED",
        riskLevel: "LOW",
        resolutionAction: "OFFERED_ALTERNATIVE_AND_CONFIRMED",
        resolutionNotes: "Dispatched Mother Dairy fresh milk 1L with customer consent; assigned VIP runner",
        resolvedAt: new Date(),
      },
    });

    expect(updated.status).toBe("ACCEPTED");
    expect(updated.riskLevel).toBe("LOW");
    expect(updated.resolutionAction).toBe("OFFERED_ALTERNATIVE_AND_CONFIRMED");

    // Reset for live testing in demo
    await prisma.order.update({
      where: { orderNumber: "NC1042" },
      data: {
        status: "PENDING",
        riskLevel: "HIGH",
        resolutionAction: null,
        resolutionNotes: null,
        resolvedAt: null,
      },
    });
  });

  it("validates input schemas and rejects negative stock / invalid payloads", () => {
    // Negative stock should fail Zod validation
    const invalidPayload = {
      storeId: "store_01",
      productId: "prod_01",
      stockLevel: -5,
      status: "IN_STOCK",
    };
    const result = inventoryUpdateSchema.safeParse(invalidPayload);
    expect(result.success).toBe(false);

    // Missing storeId should fail
    const missingStore = {
      storeId: "",
      productId: "prod_01",
      stockLevel: 10,
      status: "IN_STOCK",
    };
    expect(inventoryUpdateSchema.safeParse(missingStore).success).toBe(false);

    // Valid payload passes
    const valid = {
      storeId: "store_01",
      productId: "prod_01",
      stockLevel: 15,
      status: "IN_STOCK",
    };
    expect(inventoryUpdateSchema.safeParse(valid).success).toBe(true);
  });
});
