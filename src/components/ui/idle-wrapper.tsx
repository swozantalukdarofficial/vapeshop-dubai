"use client";

import React, { useState, useEffect } from "react";

export function IdleWrapper({ children }: { children: React.ReactNode }) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => setIsIdle(true), { timeout: 2000 });
      } else {
        const t = setTimeout(() => setIsIdle(true), 1000);
        return () => clearTimeout(t);
      }
    }
  }, []);

  return isIdle ? <>{children}</> : <div style={{ height: "400px" }} />;
}
