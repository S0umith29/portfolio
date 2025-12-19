"use client";

import { ReactNode } from "react";

interface MarqueeProps {
  children: ReactNode;
  speed?: number;
  direction?: "left" | "right";
  className?: string;
}

export default function Marquee({ 
  children, 
  speed = 50, 
  direction = "left",
  className = "" 
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex"
        style={{
          animation: direction === "left" 
            ? `marquee-left ${speed}s linear infinite`
            : `marquee-right ${speed}s linear infinite`,
        } as React.CSSProperties}
      >
        <div className="flex shrink-0 gap-4">
          {children}
        </div>
        <div className="flex shrink-0 gap-4" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

