import { AlternativeRecommendation, ProductAlternativeCandidate } from "@/types";

/**
 * NOVA CART LOCAL COMMERCE INTELLIGENCE
 * Product Alternative Recommendation Engine
 *
 * Multi-criteria ranking engine that suggests the optimal in-stock substitute
 * from nearby partner stores when inventory availability confidence drops.
 */
export function rankProductAlternatives(
  originalProduct: {
    id: string;
    name: string;
    category: string;
    price: number;
    confidence: number;
  },
  candidates: ProductAlternativeCandidate[],
  confidenceThreshold: number = 70
): AlternativeRecommendation | null {
  // If original product confidence is already healthy, no alternative required
  if (originalProduct.confidence >= confidenceThreshold) {
    return null;
  }

  // Filter candidates: must match category, must have higher confidence than original, must have physical stock
  const validCandidates = candidates.filter(
    (c) =>
      c.id !== originalProduct.id &&
      c.category.toLowerCase() === originalProduct.category.toLowerCase() &&
      c.stockLevel > 0 &&
      c.confidence > originalProduct.confidence
  );

  if (validCandidates.length === 0) {
    return null;
  }

  // Score each candidate
  const scored = validCandidates.map((candidate) => {
    const reasons: string[] = [];

    // 1. Availability Score (0 - 100)
    const availScore = candidate.confidence;
    reasons.push(`${candidate.confidence}% availability confidence at ${candidate.storeName}`);

    // 2. Price Score (0 - 100)
    // Optimal substitution is a direct drop-in (similar tier, equal or slightly cheaper).
    const priceDiff = originalProduct.price - candidate.price; // Positive = candidate is cheaper
    let priceScore = 70;
    if (priceDiff >= 0 && priceDiff <= originalProduct.price * 0.15) {
      // Ideal substitute: exact match or slight saving (e.g. ₹65 vs ₹68)
      priceScore = 95;
      reasons.push(
        priceDiff > 0
          ? `₹${Math.round(priceDiff)} cheaper than original (₹${candidate.price} vs ₹${originalProduct.price})`
          : `Identical price (₹${candidate.price})`
      );
    } else if (priceDiff > originalProduct.price * 0.15) {
      // Much cheaper - could be lower specification or different tier
      priceScore = 80;
      reasons.push(`Budget option: ₹${Math.round(priceDiff)} savings`);
    } else {
      const markupPct = (Math.abs(priceDiff) / originalProduct.price) * 100;
      priceScore = Math.max(20, 70 - markupPct * 1.5);
      reasons.push(`Nominal ₹${Math.abs(Math.round(priceDiff))} price difference`);
    }

    // 3. Store Reliability Score (0 - 100)
    const storeScore = Math.round(candidate.storeFulfillmentRate * 100);
    if (candidate.storeFulfillmentRate >= 0.95) {
      reasons.push(`Trusted partner: ${storeScore}% historical order fulfillment`);
    }

    // 4. Delivery Speed Score (0 - 100)
    // 20 mins = 100, 45 mins = 40
    const speedScore = Math.max(20, Math.min(100, Math.round(110 - candidate.avgDeliveryMinutes * 2)));
    if (candidate.avgDeliveryMinutes <= 25) {
      reasons.push(`Fast fulfillment: ~${candidate.avgDeliveryMinutes} min delivery`);
    }

    // Multi-factor weighted composite score
    // 50% Availability + 20% Price + 15% Store Reliability + 15% Delivery Speed
    const totalScore = Math.round(
      availScore * 0.50 +
      priceScore * 0.20 +
      storeScore * 0.15 +
      speedScore * 0.15
    );

    return {
      candidate,
      totalScore,
      priceDiff,
      reasons,
    };
  });

  // Sort descending by total score
  scored.sort((a, b) => b.totalScore - a.totalScore);
  const best = scored[0];

  return {
    originalProductId: originalProduct.id,
    originalProductName: originalProduct.name,
    originalPrice: originalProduct.price,
    originalConfidence: originalProduct.confidence,
    recommendedAlternative: best.candidate,
    score: best.totalScore,
    priceDelta: best.priceDiff,
    reasons: best.reasons,
  };
}
