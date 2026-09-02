import { useState, useEffect } from "react";

export function useIsIdle() {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        requestIdleCallback(() => setIsIdle(true), { timeout: 1500 });
      } else {
        const t = setTimeout(() => setIsIdle(true), 1500);
        return () => clearTimeout(t);
      }
    }
  }, []);

  return isIdle;
}
