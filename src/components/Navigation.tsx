"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Compass,
  ShoppingBag,
  Boxes,
  Store,
  ShieldAlert,
  Users,
  TrendingDown,
  Gift,
  LineChart,
  Menu,
  X,
  Layers,
  Settings,
} from "lucide-react";
import { NovaCartLogo, CompassRoseEmblem } from "@/components/NovaCartLogo";

interface NavItem {
  number: string;
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string;
}

const navItems: NavItem[] = [
  { number: "01", label: "Overview", href: "/", icon: Layers },
  { number: "02", label: "Shop", href: "/shop", icon: ShoppingBag },
  { number: "03", label: "Inventory", href: "/inventory", icon: Boxes, badge: "STALE: 28H" },
  { number: "04", label: "Stores", href: "/stores", icon: Store },
  { number: "05", label: "Operations", href: "/operations", icon: ShieldAlert, badge: "HIGH RISK" },
  { number: "06", label: "Customers", href: "/customers", icon: Users },
  { number: "07", label: "Retention", href: "/retention", icon: TrendingDown },
  { number: "08", label: "Promotions", href: "/promotions", icon: Gift },
  { number: "09", label: "Impact", href: "/impact", icon: LineChart },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-paper border-editorial-b">
        <Link href="/" className="flex items-center space-x-2">
          <CompassRoseEmblem size={30} />
          <div>
            <span className="font-editorial-heading font-black text-sm tracking-tight text-ink block leading-none">
              NOVA CART
            </span>
            <span className="text-[8px] uppercase tracking-widest text-muted font-editorial-mono">
              Commerce Intelligence
            </span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 border-editorial bg-paper-deep text-ink"
          aria-label="Toggle Navigation"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <div className="lg:hidden bg-paper border-editorial-b px-4 py-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-xs border ${
                  isActive
                    ? "bg-ink text-editorial-white border-ink font-medium"
                    : "border-transparent text-ink-soft hover:bg-paper-deep hover:border-line"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <span className={`text-[10px] font-editorial-mono ${isActive ? "text-paper-deep" : "text-muted"}`}>
                    {item.number}
                  </span>
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] px-1.5 py-0.5 uppercase tracking-wider bg-editorial-danger text-editorial-white rounded-none">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {/* Desktop Editorial Sidebar */}
      <aside className="hidden lg:flex flex-col w-[265px] border-editorial-r bg-paper min-h-screen select-none shrink-0 justify-between">
        <div>
          {/* Brand Header with Logo */}
          <div className="p-5 border-editorial-b bg-paper">
            <Link href="/" className="block group">
              <NovaCartLogo size={46} />
              <div className="text-[10px] text-muted italic border-editorial-t pt-2 mt-3 font-serif">
                Platform Diagnosis & Operational Control
              </div>
            </Link>
          </div>

          {/* Navigation Section */}
          <nav className="py-4 px-3 space-y-0.5">
            <div className="px-3 pb-2 text-[9.5px] uppercase tracking-[0.2em] text-muted font-editorial-mono">
              NAVIGATION INDEX
            </div>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3 py-2 text-xs transition-all border ${
                    isActive
                      ? "bg-ink text-editorial-white border-ink shadow-xs"
                      : "border-transparent text-ink-soft hover:bg-paper-deep hover:border-line"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span
                      className={`text-[10px] font-editorial-mono tracking-wider ${
                        isActive ? "text-paper-deep/80" : "text-muted group-hover:text-ink"
                      }`}
                    >
                      {item.number}
                    </span>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? "text-editorial-white" : "text-muted group-hover:text-ink"}`} />
                    <span className="font-medium tracking-wide">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[8.5px] font-editorial-mono px-1.5 py-0.5 uppercase tracking-wider ${
                        isActive
                          ? "bg-editorial-danger text-editorial-white"
                          : "bg-paper-deep border-editorial text-editorial-danger"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* SIDE IMAGE & STATUS FOOTER (As shown in reference image) */}
        <div className="border-editorial-t bg-paper flex flex-col">
          {/* Vintage Bridge Engraving Illustration */}
          <div className="p-3 pb-2">
            <div className="relative w-full h-[145px] border-editorial overflow-hidden bg-paper-deep shadow-2xs">
              <img
                src="/images/sidebar_bridge.jpg"
                alt="Vintage Stone Arch Bridge Landscape Engraving"
                className="w-full h-full object-cover object-center grayscale contrast-125 opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <div className="text-[8.5px] uppercase font-editorial-mono tracking-[0.16em] text-muted mt-2 text-center leading-tight">
              STRONGER LOCAL COMMERCE FOR BRIGHTER COMMUNITIES.
            </div>
          </div>

          {/* Operational Status & Settings Links */}
          <div className="px-4 py-3 border-editorial-t bg-paper-deep/50 text-[11px] text-ink-soft space-y-2">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-editorial-success inline-block"></span>
              <span className="text-[11px] font-medium text-ink">System Status: <span className="text-editorial-success font-semibold">Operational</span></span>
            </div>
            <div className="flex items-center space-x-2 text-muted hover:text-ink cursor-pointer pt-0.5">
              <Settings className="w-3.5 h-3.5" />
              <span className="text-[11px]">Settings</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
