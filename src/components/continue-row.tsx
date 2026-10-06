import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Play } from "lucide-react";
import { useLibrary } from "@/lib/catalog/library";

export function ContinueRow() {
  const [ready, setReady] = useState(false);
  const items = useLibrary((s) => s.continueWatching);

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready || items.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="mb-3 font-display text-lg font-semibold tracking-tight">
        Continue watching
      </h2>
      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {items.map((item) => {
          const pct =
            item.duration > 0
              ? Math.min(100, Math.round((item.currentTime / item.duration) * 100))
              : 0;
          return (
            <Link
              key={`${item.kind}-${item.id}`}
              to="/watch/$kind/$postId"
              params={{ kind: item.kind, postId: item.id }}
              className="w-36 shrink-0 overflow-hidden rounded-lg bg-card text-card-fg shadow-[var(--shadow-card)] sm:w-40"
            >
              <div className="relative aspect-poster">
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    className="size-full object-cover outline outline-1 -outline-offset-1 outline-white/10"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="size-full bg-ink" />
                )}
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-fg">
                    <Play className="size-4 translate-x-0.5 fill-current" />
                  </span>
                </span>
                <span className="absolute inset-x-0 bottom-0 h-1 bg-fg/20">
                  <span
                    className="block h-full bg-gold"
                    style={{ width: `${pct}%` }}
                  />
                </span>
              </div>
              <div className="px-2 py-2">
                <p className="line-clamp-1 text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-card-fg/70">{item.episodeLabel}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
