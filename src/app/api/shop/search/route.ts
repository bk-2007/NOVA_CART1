import { NextRequest } from "next/server";
import prisma from "@/lib/db";
import { apiSuccess, apiError, sanitizeString } from "@/lib/security";
import { calculateInventoryConfidence } from "@/lib/services/inventoryConfidenceService";
import { rankProductAlternatives } from "@/lib/services/recommendationService";
import { ProductAlternativeCandidate } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = sanitizeString(searchParams.get("q") ?? "Milk");
    const category = searchParams.get("category");

    // Fetch matching products with inventories and store details
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { brand: { contains: query } },
          { category: { contains: query } },
          category ? { category: { equals: category } } : {},
        ],
      },
      include: {
        inventories: {
          include: {
            store: true,
          },
        },
      },
      take: 20,
    });

    if (products.length === 0) {
      return apiSuccess({ products: [], recommendation: null, query });
    }

    // Evaluate confidence for each product at its primary store
    const evaluatedProducts = products.map((prod) => {
      // Find lowest confidence / primary store inventory for demonstration
      const primaryInv = prod.inventories[0];

      if (!primaryInv) {
        return {
          ...prod,
          confidence: 10,
          confidenceDetails: {
            confidence: 10,
            riskLevel: "HIGH" as const,
            reasons: ["No verified inventory on file"],
            isStale: true,
            hoursSinceAudit: 99,
          },
          storeName: "Not Stocked",
          storeId: "",
          stockLevel: 0,
        };
      }

      const conf = calculateInventoryConfidence({
        productId: prod.id,
        productName: prod.name,
        category: prod.category,
        storeId: primaryInv.storeId,
        storeName: primaryInv.store.name,
        storeFulfillmentRate: primaryInv.store.historicalFulfillmentRate,
        storeRejectionRate: primaryInv.store.rejectionRate,
        avgDeliveryMinutes: primaryInv.store.avgDeliveryMinutes,
        stockLevel: primaryInv.stockLevel,
        safetyStock: primaryInv.safetyStock,
        lastAuditedAt: primaryInv.lastAuditedAt,
        status: primaryInv.status as any,
        recentDemandLastHour: primaryInv.storeId === "store_01" ? 4 : 1,
        recentCancellations24h: primaryInv.storeId === "store_01" ? 1 : 0,
      });

      return {
        id: prod.id,
        sku: prod.sku,
        name: prod.name,
        brand: prod.brand,
        category: prod.category,
        unit: prod.unit,
        mrp: prod.mrp,
        price: prod.price,
        description: prod.description,
        storeId: primaryInv.storeId,
        storeName: primaryInv.store.name,
        storeLocality: primaryInv.store.locality,
        stockLevel: primaryInv.stockLevel,
        confidence: conf.confidence,
        confidenceDetails: conf,
      };
    });

    // Check if the top requested product has low confidence (< 70%)
    const topItem = evaluatedProducts[0];
    let recommendation = null;

    if (topItem && topItem.confidence < 70) {
      // Gather all potential substitute candidates across partner stores
      const candidateList: ProductAlternativeCandidate[] = [];

      for (const p of products) {
        for (const inv of p.inventories) {
          if (p.id === topItem.id && inv.storeId === topItem.storeId) continue;
          if (inv.stockLevel <= 0) continue;

          const cConf = calculateInventoryConfidence({
            productId: p.id,
            productName: p.name,
            category: p.category,
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

          candidateList.push({
            id: p.id,
            sku: p.sku,
            name: p.name,
            brand: p.brand,
            category: p.category,
            unit: p.unit,
            mrp: p.mrp,
            price: p.price,
            storeId: inv.storeId,
            storeName: inv.store.name,
            storeLocality: inv.store.locality,
            stockLevel: inv.stockLevel,
            confidence: cConf.confidence,
            storeFulfillmentRate: inv.store.historicalFulfillmentRate,
            avgDeliveryMinutes: inv.store.avgDeliveryMinutes,
          });
        }
      }

      recommendation = rankProductAlternatives(
        {
          id: topItem.id,
          name: topItem.name,
          category: topItem.category,
          price: topItem.price,
          confidence: topItem.confidence,
        },
        candidateList,
        70
      );
    }

    return apiSuccess({
      query,
      products: evaluatedProducts,
      recommendation,
    });
  } catch (error) {
    return apiError("Product search failed", 500);
  }
}
