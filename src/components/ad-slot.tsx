import { useEffect, useRef, useState } from "react";
import {
  ADSENSE_CLIENT,
  ADSENSE_SLOT,
  pushAdSense,
} from "@/lib/ads/adsense";
import { cn } from "@/lib/utils";

type AdVariant = "feed" | "player" | "rail";

const MIN_HEIGHT: Record<AdVariant, string> = {
  feed: "min-h-28",
  player: "min-h-28",
  rail: "min-h-72",
};

export function AdSlot({
  variant = "feed",
  className,
}: {
  variant?: AdVariant;
  className?: string;
}) {
  const insRef = useRef<HTMLModElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const ins = insRef.current;
    if (!ins) return;
    if (ins.getAttribute("data-adsbygoogle-status")) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        if (ins.getAttribute("data-adsbygoogle-status")) return;
        try {
          pushAdSense();
        } catch {
          // Ad blockers or missing script should not break the app.
        }
        observer.disconnect();
      },
      { rootMargin: "160px", threshold: 0.01 },
    );
    observer.observe(ins);
    return () => observer.disconnect();
  }, [mounted]);

  const tone = variant === "player" ? "player" : "page";

  return (
    <aside
      aria-label="Advertisement"
      className={cn(
        "overflow-hidden rounded-lg",
        tone === "player"
          ? "bg-ink text-card-fg/70"
          : "bg-surface text-muted shadow-[var(--shadow-border)]",
        className,
      )}
    >
      <p className="px-3 pt-2 text-center text-xs font-semibold tracking-[0.16em] uppercase">
        Advertisement
      </p>
      <div className={cn("px-2 pt-1 pb-2", MIN_HEIGHT[variant])}>
        {mounted ? (
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: "block", minHeight: variant === "rail" ? 280 : 90 }}
            data-ad-client={ADSENSE_CLIENT}
            data-ad-slot={ADSENSE_SLOT}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : null}
      </div>
    </aside>
  );
}
