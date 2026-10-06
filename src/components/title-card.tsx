import { Link } from "@tanstack/react-router";
import { Bookmark, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLibrary } from "@/lib/catalog/library";
import type { CatalogItem } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

export function TitleCard({ item }: { item: CatalogItem }) {
  const saved = useLibrary((s) => s.isSaved(item.kind, item.id));
  const toggleWatchlist = useLibrary((s) => s.toggleWatchlist);

  return (
    <article className="group relative">
      <Link
        to="/watch/$kind/$postId"
        params={{ kind: item.kind, postId: item.id }}
        title={item.title}
        className={cn(
          "block overflow-hidden rounded-lg bg-card text-card-fg shadow-[var(--shadow-card)]",
          "transition-[transform,box-shadow] duration-300 ease-[var(--ease-out)]",
          "hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]",
        )}
      >
        <div className="relative aspect-poster overflow-hidden bg-ink">
          {item.image ? (
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              referrerPolicy="no-referrer"
              className="size-full object-cover outline outline-1 -outline-offset-1 outline-white/10 transition-[transform,filter] duration-300 ease-[var(--ease-out)] group-hover:scale-105 group-hover:brightness-50"
            />
          ) : (
            <div className="size-full bg-ink" />
          )}
          <Badge
            variant={item.kind === "series" ? "series" : "movie"}
            className="absolute top-2 left-2"
          >
            {item.kind === "series" ? "Series" : "Movie"}
          </Badge>
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            <span className="flex size-14 items-center justify-center rounded-full bg-primary text-primary-fg shadow-[0_0_20px_rgb(216_184_0_/_0.55)]">
              <Play className="size-6 translate-x-0.5 fill-current" />
            </span>
          </div>
          {item.vj ? (
            <p className="absolute right-2 bottom-2 left-2 truncate text-xs font-medium text-card-fg/90">
              {item.vj}
            </p>
          ) : null}
        </div>
        <div className="flex min-h-14 items-center justify-center bg-primary px-2 py-2 text-center text-sm font-bold leading-snug text-primary-fg">
          <span className="line-clamp-2">{item.title}</span>
        </div>
      </Link>
      <button
        type="button"
        aria-label={saved ? "Remove from saved" : "Save title"}
        onClick={() => toggleWatchlist(item)}
        className={cn(
          "absolute top-2 right-2 z-10 flex size-11 items-center justify-center rounded-full",
          "bg-ink/70 text-card-fg backdrop-blur-sm transition-colors duration-150",
          saved ? "text-gold" : "hover:text-gold",
        )}
      >
        <Bookmark className={cn("size-4", saved && "fill-current")} />
      </button>
    </article>
  );
}

export function TitleCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-card shadow-[var(--shadow-card)]">
      <div className="skeleton-shine aspect-poster" />
      <div className="skeleton-shine-gold h-14" />
    </div>
  );
}
