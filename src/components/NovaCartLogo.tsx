import React from "react";

interface NovaCartLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export function CompassRoseEmblem({ size = 48, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      {/* Outer Fine Ring */}
      <circle cx="50" cy="50" r="46" stroke="var(--ink)" strokeWidth="1.75" />
      {/* Secondary Inner Fine Ring */}
      <circle cx="50" cy="50" r="41" stroke="var(--line)" strokeWidth="0.75" strokeDasharray="1 1.5" />
      <circle cx="50" cy="50" r="32" stroke="var(--line)" strokeWidth="0.75" />

      {/* Degree ticks */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <line
          key={deg}
          x1="50"
          y1="4"
          x2="50"
          y2="9"
          stroke="var(--ink)"
          strokeWidth="1.2"
          transform={`rotate(${deg} 50 50)`}
        />
      ))}

      {/* 4 Secondary Compass Points (NW, NE, SE, SW) */}
      {/* NE */}
      <polygon points="50,50 50,22 56,50" fill="var(--ink-soft)" transform="rotate(45 50 50)" />
      <polygon points="50,50 50,22 44,50" fill="var(--paper)" stroke="var(--ink)" strokeWidth="0.75" transform="rotate(45 50 50)" />
      {/* SE */}
      <polygon points="50,50 50,22 56,50" fill="var(--ink-soft)" transform="rotate(135 50 50)" />
      <polygon points="50,50 50,22 44,50" fill="var(--paper)" stroke="var(--ink)" strokeWidth="0.75" transform="rotate(135 50 50)" />
      {/* SW */}
      <polygon points="50,50 50,22 56,50" fill="var(--ink-soft)" transform="rotate(225 50 50)" />
      <polygon points="50,50 50,22 44,50" fill="var(--paper)" stroke="var(--ink)" strokeWidth="0.75" transform="rotate(225 50 50)" />
      {/* NW */}
      <polygon points="50,50 50,22 56,50" fill="var(--ink-soft)" transform="rotate(315 50 50)" />
      <polygon points="50,50 50,22 44,50" fill="var(--paper)" stroke="var(--ink)" strokeWidth="0.75" transform="rotate(315 50 50)" />

      {/* 4 Primary Compass Points (N, S, E, W) */}
      {/* North */}
      <polygon points="50,50 50,8 58,50" fill="var(--ink)" />
      <polygon points="50,50 50,8 42,50" fill="var(--white)" stroke="var(--ink)" strokeWidth="1" />
      {/* East */}
      <polygon points="50,50 50,8 58,50" fill="var(--ink)" transform="rotate(90 50 50)" />
      <polygon points="50,50 50,8 42,50" fill="var(--white)" stroke="var(--ink)" strokeWidth="1" transform="rotate(90 50 50)" />
      {/* South */}
      <polygon points="50,50 50,8 58,50" fill="var(--ink)" transform="rotate(180 50 50)" />
      <polygon points="50,50 50,8 42,50" fill="var(--white)" stroke="var(--ink)" strokeWidth="1" transform="rotate(180 50 50)" />
      {/* West */}
      <polygon points="50,50 50,8 58,50" fill="var(--ink)" transform="rotate(270 50 50)" />
      <polygon points="50,50 50,8 42,50" fill="var(--white)" stroke="var(--ink)" strokeWidth="1" transform="rotate(270 50 50)" />

      {/* Center Pivot Boss */}
      <circle cx="50" cy="50" r="4.5" fill="var(--white)" stroke="var(--ink)" strokeWidth="1.5" />
      <circle cx="50" cy="50" r="2" fill="var(--ink)" />
    </svg>
  );
}

export function NovaCartLogo({
  className = "",
  size = 44,
  showText = true,
}: NovaCartLogoProps) {
  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      <CompassRoseEmblem size={size} />
      {showText && (
        <div className="flex flex-col">
          <div className="font-editorial-heading font-black text-xl lg:text-2xl text-ink leading-[0.9] tracking-tight">
            NOVA
          </div>
          <div className="font-editorial-heading font-black text-xl lg:text-2xl text-ink leading-[0.9] tracking-tight">
            CART
          </div>
          <div className="text-[8px] lg:text-[8.5px] uppercase font-editorial-mono tracking-[0.22em] text-muted mt-1 leading-none">
            Local Commerce Intelligence
          </div>
        </div>
      )}
    </div>
  );
}
