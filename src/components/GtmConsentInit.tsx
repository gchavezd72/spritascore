"use client";

import { useEffect } from "react";
import { syncConsentFromStorage } from "@/lib/gtm";

export function GtmConsentInit() {
  useEffect(() => {
    syncConsentFromStorage();
  }, []);

  return null;
}