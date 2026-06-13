"use client";

import { useCallback, useEffect, useState } from "react";
import StrummerCanvas from "@/components/StrummerCanvas";
import HeroOverlay from "@/components/HeroOverlay";
import CustomCursor from "@/components/CustomCursor";
import RecordControls from "@/components/RecordControls";
import { initAudio, pluck } from "@/lib/baglamaAudio";

export default function HomePage() {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handlePluck = useCallback(
    async (stringIndex: number, velocity: number) => {
      await initAudio();
      if (velocity > 0) {
        await pluck(stringIndex, velocity);
      }
    },
    [],
  );

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-black text-off-white">
      <section className="relative z-10 h-hero shrink-0 border-b border-white/10">
        <HeroOverlay />
      </section>

      <section className="relative z-0 min-h-0 flex-1 basis-0">
        <StrummerCanvas onPluck={handlePluck} reducedMotion={reducedMotion} />
        <RecordControls />
      </section>

      <CustomCursor enabled={!reducedMotion} />
    </main>
  );
}
