import prisma from "@/lib/db";
import { PLATFORM_BENCHMARKS } from "@/lib/constants";
import { PlatformOverviewMetrics } from "@/types";

export async function getOverviewData(): Promise<PlatformOverviewMetrics> {
  try {
    const [
      latestMetrics,
      historicalMetrics,
      totalStores,
      totalProducts,
      totalOrders,
      highRiskOrdersCount,
      pendingOrdersCount,
      openTicketsCount,
    ] = await Promise.all([
      prisma.businessMetric.findFirst({ orderBy: { date: "desc" } }),
      prisma.businessMetric.findMany({ orderBy: { date: "asc" } }),
      prisma.store.count(),
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.count({ where: { riskLevel: "HIGH" } }),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.supportTicket.count({ where: { status: "OPEN" } }),
    ]);

    return {
      registeredUsers: PLATFORM_BENCHMARKS.REGISTERED_CUSTOMERS,
      mau: latestMetrics?.mau ?? PLATFORM_BENCHMARKS.ACTIVE_MONTHLY_USERS,
      monthlyOrders: latestMetrics?.monthlyOrders ?? PLATFORM_BENCHMARKS.MONTHLY_ORDERS,
      aov: latestMetrics?.aov ?? PLATFORM_BENCHMARKS.AVERAGE_ORDER_VALUE_INR,
      monthlyRevenueINR: latestMetrics?.monthlyRevenue ?? PLATFORM_BENCHMARKS.MONTHLY_REVENUE_INR,
      repeatPurchaseRate: latestMetrics?.repeatPurchaseRate ?? PLATFORM_BENCHMARKS.REPEAT_PURCHASE_RATE_CURRENT,
      averageDeliveryMinutes: latestMetrics?.averageDeliveryMinutes ?? PLATFORM_BENCHMARKS.AVERAGE_DELIVERY_MINUTES_CURRENT,
      cancellationRate: latestMetrics?.cancellationRate ?? PLATFORM_BENCHMARKS.ORDER_CANCELLATION_RATE_CURRENT,
      supportTicketsCount: latestMetrics?.supportTicketsCount ?? PLATFORM_BENCHMARKS.MONTHLY_SUPPORT_TICKETS_CURRENT,
      promoSpendINR: latestMetrics?.promoSpend ?? PLATFORM_BENCHMARKS.MONTHLY_PROMO_SPEND_INR,

      sixMonthTrajectory: {
        mau: { previous: 39000, current: 46000, change: "+17.9%" },
        monthlyOrders: { previous: 31200, current: 38500, change: "+23.4%" },
        aov: { previous: 452, current: 486, change: "+7.5%" },
        repeatRate: { previous: 0.41, current: 0.27, change: "-34.1%", isNegative: true },
        deliveryMinutes: { previous: 29, current: 37, change: "+27.6%", isNegative: true },
        cancellationRate: { previous: 0.06, current: 0.11, change: "+83.3%", isNegative: true },
        supportTickets: { previous: 3100, current: 5900, change: "+90.3%", isNegative: true },
        promoSpend: { previous: 950000, current: 1700000, change: "+78.9%", isNegative: true },
        monthlyRevenue: { previous: 2180000, current: 2610000, change: "+19.7%" },
      },

      operationalFriction: {
        ordersCancelledPercent: 11,
        lateDeliveriesPercent: 13,
        substitutionsPercent: 8,
        refundSupportPercent: 6,
      },

      cancellationCauses: [
        { cause: "Product Unavailable on Store Shelf", sharePercent: 35 },
        { cause: "Delivery Delay (>15 min late)", sharePercent: 27 },
        { cause: "Store Rejection during peak load", sharePercent: 18 },
        { cause: "Delivery Partner Unavailable", sharePercent: 12 },
        { cause: "Other / App issues", sharePercent: 8 },
      ],

      partnerStoreSignals: [
        { signal: "Maintaining real-time inventory too difficult", percentage: 39 },
        { signal: "Promotions reduce already thin retail margins", percentage: 31 },
        { signal: "Struggle to predict online grocery demand", percentage: 28 },
        { signal: "Reject app orders during in-store rush", percentage: 23 },
        { signal: "Considering leaving the platform", percentage: 18 },
      ],

      customerSignals: [
        { signal: "Prices/fees feel higher than expected", percentage: 38 },
        { signal: "Delivery takes too long (>35 mins)", percentage: 34 },
        { signal: "Products shown available become unavailable", percentage: 29 },
        { signal: "Discounts and coupon rules are confusing", percentage: 24 },
        { signal: "Prefer walking to nearby store directly", percentage: 21 },
        { signal: "Difficult to discover authentic local products", percentage: 18 },
        { signal: "Refund problems on cancelled orders", percentage: 16 },
        { signal: "App interface feels cluttered", percentage: 14 },
        { signal: "Inaccurate delivery partner tracking", percentage: 11 },
      ],

      counts: {
        totalStores: totalStores || PLATFORM_BENCHMARKS.PILOT_NETWORK_STORES,
        totalProducts: totalProducts || 117,
        totalOrders: totalOrders || 51,
        highRiskOrdersCount: highRiskOrdersCount || 11,
        pendingOrdersCount: pendingOrdersCount || 9,
        openTicketsCount: openTicketsCount || 16,
      },

      historicalTrend: historicalMetrics ?? [],
    };
  } catch (error) {
    console.error("Overview data fetch fallback:", error);
    // Deterministic fallback matching platform benchmarks
    return {
      registeredUsers: PLATFORM_BENCHMARKS.REGISTERED_CUSTOMERS,
      mau: PLATFORM_BENCHMARKS.ACTIVE_MONTHLY_USERS,
      monthlyOrders: PLATFORM_BENCHMARKS.MONTHLY_ORDERS,
      aov: PLATFORM_BENCHMARKS.AVERAGE_ORDER_VALUE_INR,
      monthlyRevenueINR: PLATFORM_BENCHMARKS.MONTHLY_REVENUE_INR,
      repeatPurchaseRate: PLATFORM_BENCHMARKS.REPEAT_PURCHASE_RATE_CURRENT,
      averageDeliveryMinutes: PLATFORM_BENCHMARKS.AVERAGE_DELIVERY_MINUTES_CURRENT,
      cancellationRate: PLATFORM_BENCHMARKS.ORDER_CANCELLATION_RATE_CURRENT,
      supportTicketsCount: PLATFORM_BENCHMARKS.MONTHLY_SUPPORT_TICKETS_CURRENT,
      promoSpendINR: PLATFORM_BENCHMARKS.MONTHLY_PROMO_SPEND_INR,
      sixMonthTrajectory: {
        mau: { previous: 39000, current: 46000, change: "+17.9%" },
        monthlyOrders: { previous: 31200, current: 38500, change: "+23.4%" },
        aov: { previous: 452, current: 486, change: "+7.5%" },
        repeatRate: { previous: 0.41, current: 0.27, change: "-34.1%", isNegative: true },
        deliveryMinutes: { previous: 29, current: 37, change: "+27.6%", isNegative: true },
        cancellationRate: { previous: 0.06, current: 0.11, change: "+83.3%", isNegative: true },
        supportTickets: { previous: 3100, current: 5900, change: "+90.3%", isNegative: true },
        promoSpend: { previous: 950000, current: 1700000, change: "+78.9%", isNegative: true },
        monthlyRevenue: { previous: 2180000, current: 2610000, change: "+19.7%" },
      },
      operationalFriction: {
        ordersCancelledPercent: 11,
        lateDeliveriesPercent: 13,
        substitutionsPercent: 8,
        refundSupportPercent: 6,
      },
      cancellationCauses: [
        { cause: "Product Unavailable on Store Shelf", sharePercent: 35 },
        { cause: "Delivery Delay (>15 min late)", sharePercent: 27 },
        { cause: "Store Rejection during peak load", sharePercent: 18 },
        { cause: "Delivery Partner Unavailable", sharePercent: 12 },
        { cause: "Other / App issues", sharePercent: 8 },
      ],
      partnerStoreSignals: [
        { signal: "Maintaining real-time inventory too difficult", percentage: 39 },
        { signal: "Promotions reduce already thin retail margins", percentage: 31 },
        { signal: "Struggle to predict online grocery demand", percentage: 28 },
        { signal: "Reject app orders during in-store rush", percentage: 23 },
        { signal: "Considering leaving the platform", percentage: 18 },
      ],
      customerSignals: [
        { signal: "Prices/fees feel higher than expected", percentage: 38 },
        { signal: "Delivery takes too long (>35 mins)", percentage: 34 },
        { signal: "Products shown available become unavailable", percentage: 29 },
        { signal: "Discounts and coupon rules are confusing", percentage: 24 },
        { signal: "Prefer walking to nearby store directly", percentage: 21 },
        { signal: "Difficult to discover authentic local products", percentage: 18 },
        { signal: "Refund problems on cancelled orders", percentage: 16 },
        { signal: "App interface feels cluttered", percentage: 14 },
        { signal: "Inaccurate delivery partner tracking", percentage: 11 },
      ],
      counts: {
        totalStores: PLATFORM_BENCHMARKS.PILOT_NETWORK_STORES,
        totalProducts: 117,
        totalOrders: 51,
        highRiskOrdersCount: 11,
        pendingOrdersCount: 9,
        openTicketsCount: 16,
      },
      historicalTrend: [],
    };
  }
}
