"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ShoppingBag, X, Trash2, ArrowRight, CheckCircle2, ShieldAlert } from "lucide-react";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";

export interface CartItem {
  productId: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  quantity: number;
  confidence: number;
  storeId: string;
  storeName: string;
  isSubstituted: boolean;
  originalName?: string;
  reasons?: string[];
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemoveItem,
  onClearCart,
}: CartDrawerProps) {
  const [isPlacing, setIsPlacing] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const deliveryFee = items.length > 0 ? 30 : 0;
  const total = subtotal + deliveryFee;

  const minConfidence = items.length > 0 ? Math.min(...items.map((i) => i.confidence)) : 100;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsPlacing(true);
    setErrorMsg(null);

    try {
      // Pick first item's store as the dispatch store
      const primaryStoreId = items[0].storeId;

      const payload = {
        customerId: "cust_rahul", // Rahul Sharma demo customer
        storeId: primaryStoreId,
        items: items.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitPrice: i.price,
          isSubstituted: i.isSubstituted,
          originalProductId: i.isSubstituted ? i.productId : undefined,
          itemConfidence: i.confidence,
        })),
        deliveryFee,
        discountAmount: 0,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to place order");
      }

      setPlacedOrder(json.data);
      onClearCart();
    } catch (err: any) {
      setErrorMsg(err.message || "Order placement encountered a network error");
    } finally {
      setIsPlacing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-ink/40 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-paper border-editorial-l shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-editorial-b bg-editorial-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-4 h-4 text-ink" />
            <h3 className="font-editorial-heading font-bold text-base text-ink">
              Hyperlocal Basket
            </h3>
            <span className="text-[11px] font-editorial-mono bg-paper px-2 py-0.5 border-editorial text-muted">
              {items.length} {items.length === 1 ? "Item" : "Items"}
            </span>
          </div>
          <button
            onClick={() => {
              setPlacedOrder(null);
              onClose();
            }}
            className="p-1 border-editorial text-muted hover:text-ink hover:bg-paper"
            aria-label="Close Cart"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {placedOrder ? (
            <div className="bg-editorial-white border-editorial p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-editorial-success/10 text-editorial-success border border-editorial-success mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
                  Order Successfully Dispatched
                </span>
                <h4 className="font-editorial-heading text-xl font-bold text-ink mt-0.5">
                  Order #{placedOrder.order.orderNumber}
                </h4>
                <p className="text-xs text-muted mt-1">
                  Transmitted to partner store with operational risk rating:
                </p>
              </div>

              <div className="p-3 bg-paper border-editorial text-left space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted">Total Amount:</span>
                  <span className="font-bold text-ink">₹{placedOrder.order.totalAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Risk Tier:</span>
                  <span
                    className={`font-editorial-mono font-bold ${
                      placedOrder.riskAssessment.riskLevel === "HIGH"
                        ? "text-editorial-danger"
                        : placedOrder.riskAssessment.riskLevel === "MEDIUM"
                        ? "text-editorial-warning"
                        : "text-editorial-success"
                    }`}
                  >
                    {placedOrder.riskAssessment.riskLevel} ({placedOrder.riskAssessment.riskScore}/100)
                  </span>
                </div>
                <div className="text-[11px] text-muted border-editorial-t pt-1 mt-1">
                  Runner: Assigned | Estimated 25-30m delivery
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  href="/operations"
                  onClick={onClose}
                  className="w-full text-center py-2 px-3 bg-ink text-editorial-white text-xs font-medium hover:bg-ink-soft transition-colors"
                >
                  Track in Operations Center →
                </Link>
                <button
                  onClick={() => {
                    setPlacedOrder(null);
                    onClose();
                  }}
                  className="w-full text-center py-2 px-3 border-editorial text-ink text-xs hover:bg-paper-deep"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="py-16 text-center text-muted text-xs">
              <ShoppingBag className="w-8 h-8 text-line mx-auto mb-2" />
              <p>Your basket is currently empty.</p>
              <p className="text-[11px] text-muted/80 mt-1">
                Search local grocery staples to inspect live inventory confidence.
              </p>
            </div>
          ) : (
            <>
              {minConfidence < 50 && (
                <div className="bg-editorial-danger/10 border border-editorial-danger/30 p-3 text-xs text-editorial-danger flex items-start space-x-2">
                  <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block">Inventory Warning</span>
                    One or more items have low physical availability confidence. We recommend choosing the verified in-stock substitute.
                  </div>
                </div>
              )}

              {items.map((item) => (
                <div
                  key={item.productId}
                  className="p-3 bg-editorial-white border-editorial flex flex-col justify-between space-y-2 shadow-2xs"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium text-xs text-ink">{item.name}</h4>
                      <p className="text-[11px] text-muted">
                        {item.unit} • {item.storeName}
                      </p>
                      {item.isSubstituted && (
                        <span className="inline-block mt-1 text-[9px] font-editorial-mono bg-paper-deep text-editorial-success px-1.5 py-0.2 border border-line">
                          VERIFIED SUBSTITUTE
                        </span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-xs text-ink">
                        ₹{item.price * item.quantity}
                      </div>
                      <span className="text-[10px] text-muted">Qty: {item.quantity}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-editorial-t pt-2 mt-1">
                    <ConfidenceBadge
                      confidence={item.confidence}
                      reasons={item.reasons}
                    />
                    <button
                      onClick={() => onRemoveItem(item.productId)}
                      className="text-muted hover:text-editorial-danger p-1 text-xs"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {!placedOrder && items.length > 0 && (
          <div className="p-4 border-editorial-t bg-editorial-white space-y-3">
            {errorMsg && (
              <div className="text-[11px] text-editorial-danger bg-editorial-danger/10 p-2 border border-editorial-danger/20">
                {errorMsg}
              </div>
            )}

            <div className="space-y-1.5 text-xs text-ink-soft">
              <div className="flex justify-between">
                <span>Basket Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Runner Fee</span>
                <span>₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between font-bold text-ink text-sm border-editorial-t pt-1.5">
                <span>Total Payable</span>
                <span>₹{total}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={isPlacing}
              className="w-full py-2.5 px-4 bg-ink text-editorial-white font-medium text-xs hover:bg-ink-soft disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
            >
              {isPlacing ? (
                <span>Validating & Dispatching...</span>
              ) : (
                <>
                  <span>Place Hyperlocal Order (₹{total})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
            <div className="text-[10px] text-center text-muted">
              Live inventory verification applied prior to runner assignment.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
