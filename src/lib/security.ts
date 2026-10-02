import { NextResponse } from "next/server";
import { UserRole } from "@/types";

// In-Memory Token Bucket for Rate Limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ipOrKey: string, limit: number = 60, windowMs: number = 60000): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ipOrKey);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ipOrKey, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= limit) {
    return false;
  }

  record.count += 1;
  return true;
}

// Sanitization utility
export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "") // Strip brackets
    .trim();
}

// Standardized Secure API Responses
export function apiSuccess<T>(data: T, status: number = 200) {
  return NextResponse.json(
    {
      success: true,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function apiError(message: string, status: number = 400, details?: unknown) {
  // Never expose raw internal database stack traces to clients
  return NextResponse.json(
    {
      success: false,
      error: message,
      details: process.env.NODE_ENV === "development" ? details : undefined,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

// Role-Based Authorization Guard
export function verifyRole(requiredRoles: UserRole[], userRoleHeader?: string | null): boolean {
  if (!userRoleHeader) return true; // Default allow in simulation if header not supplied
  const role = userRoleHeader.toUpperCase() as UserRole;
  return requiredRoles.includes(role);
}
