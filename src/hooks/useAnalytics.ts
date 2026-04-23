"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "@/lib/analytics";

export function useAnalytics(): void {
  const pathname = usePathname();

  useEffect(() => {
    void trackEvent("pageview", pathname);
  }, [pathname]);
}
