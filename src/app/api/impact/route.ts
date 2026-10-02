import { NextRequest } from "next/server";
import { apiSuccess, apiError } from "@/lib/security";
import { calculateBusinessImpact } from "@/lib/services/impactCalculator";
import { z } from "zod";

const impactSimulationSchema = z.object({
  monthlyOrders: z.number().positive().default(38500),
  aov: z.number().positive().default(486),
  currentCancellationRate: z.number().min(0).max(1).default(0.11),
  targetCancellationRate: z.number().min(0.01).max(0.50).default(0.08),
  currentRepeatRate: z.number().min(0).max(1).default(0.27),
  targetRepeatRate: z.number().min(0.10).max(0.80).default(0.32),
  currentSupportTickets: z.number().int().positive().default(5900),
  targetSupportTickets: z.number().int().positive().default(4800),
  monthlyPromoSpend: z.number().positive().default(1700000),
  targetPromoSpend: z.number().positive().default(1250000),
  sixMonthBudget: z.number().positive().default(2500000),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = impactSimulationSchema.safeParse(body);

    if (!parsed.success) {
      return apiError("Invalid scenario parameters", 400, parsed.error.format());
    }

    const impact = calculateBusinessImpact(parsed.data);

    return apiSuccess({
      label: "SCENARIO ESTIMATE",
      disclaimer: "These figures are scenario projections based on specified operational recovery targets, not guaranteed revenue.",
      ...impact,
    });
  } catch (error) {
    return apiError("Impact simulation calculation failed", 500);
  }
}
