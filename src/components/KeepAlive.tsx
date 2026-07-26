"use client";

import { useEffect } from "react";

export default function KeepAlive() {
  useEffect(() => {
    // Fetch the keep-alive endpoint every 5 minutes
    const interval = setInterval(() => {
      fetch("/api/keep-alive").catch((err) => {
        console.error("Keep-alive ping failed:", err);
      });
    }, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return null;
}
