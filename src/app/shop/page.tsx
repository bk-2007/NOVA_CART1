"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  ShoppingBag,
  Sparkles,
  Check,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Store,
  Clock,
  Filter,
} from "lucide-react";
import { ConfidenceBadge } from "@/components/ConfidenceBadge";
import { CartDrawer, CartItem } from "@/components/CartDrawer";
import { usePersona } from "@/components/CartographyHeader";

export default function ShopPage() {
  const { setCartCount } = usePersona();
  const [query, setQuery] = useState("Milk");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [addedNotification, setAddedNotification] = useState<string | null>(null);

  const fetchSearchResults = async (searchQuery: string, cat?: string | null) => {
    setLoading(true);
    try {
      const url = new URL("/api/shop/search", window.location.origin);
      if (searchQuery) url.searchParams.set("q", searchQuery);
      if (cat) url.searchParams.set("category", cat);

      const res = await fetch(url.toString());
      const json = await res.json();
      if (json.success) {
        setProducts(json.data.products);
        setRecommendation(json.data.recommendation);
      }
    } catch (err) {
      console.error("Search error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSearchResults(query, selectedCategory);
  }, [query, selectedCategory]);

  const handleAddToCart = (product: any, isSubstituted = false, originalName?: string) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          unit: product.unit,
          price: product.price,
          quantity: 1,
          confidence: product.confidence,
          storeId: product.storeId,
          storeName: product.storeName,
          isSubstituted,
          originalName,
          reasons: product.confidenceDetails?.reasons || [],
        },
      ];
    });

    setCartCount((c) => c + 1);
    setAddedNotification(`Added ${product.name} to basket`);
    setTimeout(() => setAddedNotification(null), 3000);
  };

  const handleChooseAlternative = () => {
    if (!recommendation) return;
    const alt = recommendation.recommendedAlternative;
    handleAddToCart(alt, true, recommendation.originalProductName);
    setIsCartOpen(true);
  };

  const handleRemoveCartItem = (productId: string) => {
    setCartItems((prev) => prev.filter((i) => i.productId !== productId));
    setCartCount((c) => Math.max(0, c - 1));
  };

  const categories = ["Dairy", "Fresh Produce", "Bakery", "Staples", "Snacks", "Beverages"];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Editorial Header */}
      <div className="border-editorial-b pb-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-[10px] font-editorial-mono uppercase tracking-widest text-muted">
            02 / CUSTOMER INTELLIGENCE SHOP
          </div>
          <h1 className="font-editorial-heading text-2xl md:text-3xl font-bold text-ink">
            Hyperlocal Shopping & Real-Time Availability
          </h1>
          <p className="text-xs text-muted mt-0.5">
            Every product is scored dynamically for physical shelf availability before purchase.
          </p>
        </div>

        {/* Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-ink text-editorial-white text-xs font-medium hover:bg-ink-soft transition-colors self-start md:self-auto"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>View Basket ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})</span>
        </button>
      </div>

      {/* Added Toast Notification */}
      {addedNotification && (
        <div className="p-3 bg-editorial-success text-editorial-white text-xs font-medium flex items-center justify-between shadow-md">
          <span>✓ {addedNotification}</span>
          <button onClick={() => setIsCartOpen(true)} className="underline text-[11px] ml-2">
            View Basket →
          </button>
        </div>
      )}

      {/* Search & Filter Bar */}
      <div className="bg-editorial-white border-editorial p-4 shadow-sm space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for? (e.g. Milk, Bread, Tomatoes, Tea...)"
            className="w-full pl-10 pr-4 py-2.5 bg-paper text-xs text-ink placeholder:text-muted border-editorial focus:outline-none focus:border-ink transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[11px] font-editorial-mono text-muted uppercase tracking-wider shrink-0 mr-1">
            Categories:
          </span>
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-2.5 py-1 text-xs border ${
              selectedCategory === null
                ? "bg-ink text-editorial-white border-ink font-medium"
                : "bg-paper text-ink-soft border-editorial hover:bg-paper-deep"
            }`}
          >
            All Items
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={`px-2.5 py-1 text-xs border shrink-0 ${
                selectedCategory === cat
                  ? "bg-ink text-editorial-white border-ink font-medium"
                  : "bg-paper text-ink-soft border-editorial hover:bg-paper-deep"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PROMINENT RECOMMENDED ALTERNATIVE BANNER (Section 16 requirement) */}
      {recommendation && (
        <div className="bg-paper-deep border-2 border-ink p-5 shadow-sm relative">
          <div className="flex items-center space-x-2 text-[10px] font-editorial-mono uppercase tracking-widest text-ink font-bold mb-1">
            <Sparkles className="w-4 h-4 text-editorial-warning" />
            <span>RECOMMENDED LOCAL ALTERNATIVE</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mt-2">
            <div className="max-w-xl space-y-1.5">
              <div className="flex items-baseline space-x-3">
                <h3 className="font-editorial-heading text-xl font-bold text-ink">
                  {recommendation.recommendedAlternative.name} ({recommendation.recommendedAlternative.unit})
                </h3>
                <span className="font-bold text-lg text-ink">
                  ₹{recommendation.recommendedAlternative.price}
                </span>
                <span className="text-xs text-muted line-through">
                  ₹{recommendation.recommendedAlternative.mrp}
                </span>
              </div>

              <div className="flex items-center space-x-3 text-xs text-ink-soft">
                <ConfidenceBadge
                  confidence={recommendation.recommendedAlternative.confidence}
                  showDetails={false}
                />
                <span className="text-muted">•</span>
                <span className="flex items-center gap-1">
                  <Store className="w-3.5 h-3.5 text-muted" />
                  {recommendation.recommendedAlternative.storeName} ({recommendation.recommendedAlternative.storeLocality})
                </span>
                <span className="text-muted">•</span>
                <span className="flex items-center gap-1 font-editorial-mono">
                  <Clock className="w-3.5 h-3.5 text-muted" />
                  ~{recommendation.recommendedAlternative.avgDeliveryMinutes} mins
                </span>
              </div>

              {/* Rationale Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {recommendation.reasons.map((r: string, idx: number) => (
                  <span
                    key={idx}
                    className="text-[10px] font-editorial-mono bg-editorial-white border-editorial px-2 py-0.5 text-ink-soft"
                  >
                    ✓ {r}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 self-start lg:self-center">
              <button
                onClick={handleChooseAlternative}
                className="px-4 py-2.5 bg-ink text-editorial-white font-medium text-xs hover:bg-ink-soft transition-colors flex items-center justify-center space-x-2"
              >
                <span>Choose Alternative & Add to Basket</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 pt-2 border-editorial-t text-[11px] text-muted flex items-center justify-between">
            <span>
              Original selection: <strong>{recommendation.originalProductName}</strong> has only{" "}
              <strong className="text-editorial-danger">{recommendation.originalConfidence}% availability confidence</strong>.
            </span>
            <span className="font-editorial-mono text-[10px] text-editorial-success font-semibold">
              Avoids {recommendation.originalConfidence < 50 ? "35% failure probability" : "delay risk"}
            </span>
          </div>
        </div>
      )}

      {/* Product Results Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 text-xs">
          <span className="text-muted font-editorial-mono uppercase tracking-wider text-[11px]">
            {loading ? "Scanning local stores..." : `Found ${products.length} Products`}
          </span>
          <span className="text-muted text-[11px]">
            Showing real-time on-shelf inventory for Bangalore Grids
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const isLowConfidence = product.confidence < 50;

            return (
              <div
                key={product.id}
                className={`bg-editorial-white border p-4 flex flex-col justify-between shadow-2xs transition-all ${
                  isLowConfidence
                    ? "border-editorial-danger/40 bg-editorial-danger/5"
                    : "border-editorial hover:border-muted"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[10px] font-editorial-mono text-muted uppercase tracking-widest block">
                        {product.brand} • {product.category}
                      </span>
                      <h4 className="font-editorial-heading font-semibold text-sm text-ink leading-snug">
                        {product.name}
                      </h4>
                      <span className="text-xs text-muted">{product.unit}</span>
                    </div>

                    <div className="text-right">
                      <div className="font-editorial-heading font-bold text-base text-ink">
                        ₹{product.price}
                      </div>
                      {product.mrp > product.price && (
                        <div className="text-[10px] text-muted line-through">
                          MRP ₹{product.mrp}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Store & Distance */}
                  <div className="text-[11px] text-ink-soft py-1.5 border-editorial-t border-editorial-b my-2 flex items-center justify-between">
                    <span className="flex items-center gap-1 text-muted">
                      <Store className="w-3 h-3" />
                      {product.storeName}
                    </span>
                    <span className="font-editorial-mono text-[10px] text-muted">
                      Stock: {product.stockLevel} units
                    </span>
                  </div>

                  {/* Confidence Badge & Reason List */}
                  <div className="space-y-1.5 my-2">
                    <ConfidenceBadge
                      confidence={product.confidence}
                      riskLevel={product.confidenceDetails?.riskLevel}
                      reasons={product.confidenceDetails?.reasons}
                      isStale={product.confidenceDetails?.isStale}
                    />

                    {product.confidenceDetails?.reasons && (
                      <div className="text-[10px] text-muted leading-tight line-clamp-2">
                        {product.confidenceDetails.reasons[0]}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-editorial-t mt-2 flex items-center justify-between gap-2">
                  {isLowConfidence ? (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-1.5 px-3 border border-editorial-danger text-editorial-danger text-xs font-medium hover:bg-editorial-danger/10 transition-colors flex items-center justify-center space-x-1"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Add (High Risk: {product.confidence}%)</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-1.5 px-3 bg-ink text-editorial-white text-xs font-medium hover:bg-ink-soft transition-colors flex items-center justify-center space-x-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add to Basket</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={() => {
          setCartItems([]);
          setCartCount(0);
        }}
      />
    </div>
  );
}
