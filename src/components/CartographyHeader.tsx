"use client";

import React, { createContext, useContext, useState } from "react";
import { ShieldCheck, Store, UserCheck, Activity, ChevronDown, Bell } from "lucide-react";
import { CompassRoseEmblem } from "@/components/NovaCartLogo";

export type PersonaRole = "CUSTOMER" | "STORE_MANAGER" | "OPERATIONS" | "EXECUTIVE";

interface PersonaContextType {
  role: PersonaRole;
  setRole: (role: PersonaRole) => void;
  activeUserName: string;
  cartCount: number;
  setCartCount: React.Dispatch<React.SetStateAction<number>>;
}

const PersonaContext = createContext<PersonaContextType>({
  role: "OPERATIONS",
  setRole: () => {},
  activeUserName: "Pooja (Operations Lead)",
  cartCount: 0,
  setCartCount: () => {},
});

export const usePersona = () => useContext(PersonaContext);

export function PersonaProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<PersonaRole>("OPERATIONS");
  const [cartCount, setCartCount] = useState<number>(1);

  const getPersonaName = (r: PersonaRole) => {
    switch (r) {
      case "CUSTOMER":
        return "Rahul Sharma (Shopper)";
      case "STORE_MANAGER":
        return "Ramesh (Sri Krishna Kirana)";
      case "OPERATIONS":
        return "Pooja (Operations Lead)";
      case "EXECUTIVE":
        return "Arun (Managing Director)";
    }
  };

  return (
    <PersonaContext.Provider
      value={{
        role,
        setRole,
        activeUserName: getPersonaName(role),
        cartCount,
        setCartCount,
      }}
    >
      {children}
    </PersonaContext.Provider>
  );
}

export function CartographyHeader() {
  const { role, setRole, activeUserName } = usePersona();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="border-editorial-b bg-paper px-6 py-2 flex items-center justify-between text-xs text-ink-soft select-none">
      {/* Coordinates and Grid Status */}
      <div className="flex items-center space-x-3 text-[11px] font-editorial-mono text-ink-soft">
        <CompassRoseEmblem size={18} />
        <span className="tracking-wide">GRID 12.9716° N, 77.5946° E</span>
        <span className="text-line">|</span>
        <span className="uppercase tracking-wide text-ink-soft">BENGALURU HYPERLOCAL NETWORK</span>
        <span className="text-line">|</span>
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-editorial-success inline-block"></span>
          <span className="tracking-wide text-muted">620 Stores Active</span>
        </div>
      </div>

      {/* Right Controls: Persona & Notifications */}
      <div className="flex items-center space-x-3">
        {/* Role Switcher Pill */}
        <div className="relative">
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 bg-paper-deep border-editorial px-3 py-1 cursor-pointer hover:bg-line/40 transition-colors text-[11px]"
          >
            <span className="text-muted uppercase tracking-widest text-[9.5px] font-editorial-mono">
              PERSONA :
            </span>
            <span className="font-medium text-ink flex items-center gap-1.5">
              {role === "CUSTOMER" && <UserCheck className="w-3.5 h-3.5 text-editorial-warning" />}
              {role === "STORE_MANAGER" && <Store className="w-3.5 h-3.5 text-ink-soft" />}
              {role === "OPERATIONS" && <ShieldCheck className="w-3.5 h-3.5 text-editorial-danger" />}
              {role === "EXECUTIVE" && <Activity className="w-3.5 h-3.5 text-editorial-success" />}
              {activeUserName}
            </span>
            <ChevronDown className="w-3 h-3 text-muted ml-0.5" />
          </div>

          {menuOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-editorial-white border-editorial shadow-lg z-50 py-1">
              <div className="px-3 py-1.5 text-[9px] uppercase tracking-widest text-muted border-editorial-b font-editorial-mono">
                Switch Test Perspective
              </div>
              <button
                onClick={() => {
                  setRole("OPERATIONS");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-paper ${
                  role === "OPERATIONS" ? "bg-paper font-semibold text-ink" : "text-ink-soft"
                }`}
              >
                <span>Pooja (Operations Lead)</span>
                <span className="text-[10px] text-editorial-danger font-mono">High Risk</span>
              </button>
              <button
                onClick={() => {
                  setRole("CUSTOMER");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-paper ${
                  role === "CUSTOMER" ? "bg-paper font-semibold text-ink" : "text-ink-soft"
                }`}
              >
                <span>Rahul Sharma (Shopper)</span>
                <span className="text-[10px] text-muted font-mono">2nd-Order Risk</span>
              </button>
              <button
                onClick={() => {
                  setRole("STORE_MANAGER");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-paper ${
                  role === "STORE_MANAGER" ? "bg-paper font-semibold text-ink" : "text-ink-soft"
                }`}
              >
                <span>Ramesh (Sri Krishna Kirana)</span>
                <span className="text-[10px] text-muted font-mono">Merchant</span>
              </button>
              <button
                onClick={() => {
                  setRole("EXECUTIVE");
                  setMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-paper ${
                  role === "EXECUTIVE" ? "bg-paper font-semibold text-ink" : "text-ink-soft"
                }`}
              >
                <span>Arun (Managing Director)</span>
                <span className="text-[10px] text-editorial-success font-mono">Executive</span>
              </button>
            </div>
          )}
        </div>

        {/* Bell Notification */}
        <div className="relative p-1.5 border-editorial bg-paper-deep text-ink-soft hover:text-ink cursor-pointer">
          <Bell className="w-3.5 h-3.5" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-editorial-danger"></span>
        </div>
      </div>
    </header>
  );
}
