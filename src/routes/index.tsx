import { useCallback, useEffect, useRef, useState } from "react";
import { createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { Film, LoaderCircle, Tv } from "lucide-react";
import { z } from "zod";
import { SiteHeader } from "@/components/site-header";
import { ContinueRow } from "@/components/continue-row";
import { TitleCard, TitleCardSkeleton } from "@/components/title-card";
import { AdSlot } from "@/components/ad-slot";
import { listCatalog } from "@/lib/catalog/api";
import type { CatalogFilter, CatalogItem, CatalogPage } from "@/lib/catalog/types";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  kind: z.enum(["all", "movie", "series"]).catch("all"),
  q: z.string().optional(),
});

export const Route = createFileRoute("/")({
  validateSearch: (search) => searchSchema.parse(search),
  loaderDeps: ({ search }) => ({ kind: search.kind, q: search.q }),
  loader: ({ deps }) =>
    listCatalog({
      data: {
        kind: deps.kind,
        q: deps.q,
        movieStart: 1,
        seriesStart: 1,
      },
    }),
  component: Home,
});

const TABS: { id: CatalogFilter; label: string }[] = [
  { id: "all", label: "Mix" },
  { id: "movie", label: "Movies" },
  { id: "series", label: "Series" },
];

function Home() {
  const data = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const transitioning = useRouterState({
    select: (s) => s.isLoading,
  });

  const [items, setItems] = useState<CatalogItem[]>(data.items);
  const [movieStart, setMovieStart] = useState(data.movieStart);
  const [seriesStart, setSeriesStart] = useState(data.seriesStart);
  const [done, setDone] = useState(data.done);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(data.error);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const cursorRef = useRef({
    movieStart: data.movieStart,
    seriesStart: data.seriesStart,
    done: data.done,
    kind: search.kind,
    q: search.q,
  });

  useEffect(() => {
    setItems(data.items);
    setMovieStart(data.movieStart);
    setSeriesStart(data.seriesStart);
    setDone(data.done);
    setError(data.error);
    cursorRef.current = {
      movieStart: data.movieStart,
      seriesStart: data.seriesStart,
      done: data.done,
      kind: search.kind,
      q: search.q,
    };
  }, [data, search.kind, search.q]);

  cursorRef.current.movieStart = movieStart;
  cursorRef.current.seriesStart = seriesStart;
  cursorRef.current.done = done;
  cursorRef.current.kind = search.kind;
  cursorRef.current.q = search.q;

  const loadMore = useCallback(async () => {
    const cursor = cursorRef.current;
    if (loadingRef.current || cursor.done) return;
    loadingRef.current = true;
    setLoadingMore(true);
    try {
      const page: CatalogPage = await listCatalog({
        data: {
          kind: cursor.kind,
          q: cursor.q,
          movieStart: cursor.movieStart,
          seriesStart: cursor.seriesStart,
        },
      });
      setItems((prev) => {
        const seen = new Set(prev.map((item) => `${item.kind}:${item.id}`));
        return [
          ...prev,
          ...page.items.filter((item) => !seen.has(`${item.kind}:${item.id}`)),
        ];
      });
      setMovieStart(page.movieStart);
      setSeriesStart(page.seriesStart);
      setDone(page.done);
      setError(page.error);
    } catch {
      setError("Could not load more titles.");
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "900px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [loadMore, items.length, done]);

  const heading =
    search.kind === "movie"
      ? "Movies"
      : search.kind === "series"
        ? "Series"
        : "Naka Firimu";
  const sub = search.q
    ? `Results for “${search.q}”`
    : search.kind === "all"
      ? "Movies and series, mixed in one scroll"
      : search.kind === "movie"
        ? "From the movies catalog"
        : "From the series catalog";

  return (
    <div className="min-h-screen">
      <SiteHeader query={search.q ?? ""} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
              Catalog
            </p>
            <h1 className="mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              {heading}
            </h1>
            <p className="mt-1 text-sm text-muted">{sub}</p>
          </div>
          <div className="flex rounded-full bg-surface p-1 shadow-[var(--shadow-border)]">
            {TABS.map((tab) => {
              const active = search.kind === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() =>
                    void navigate({
                      search: { kind: tab.id, q: search.q },
                    })
                  }
                  className={cn(
                    "inline-flex h-11 min-w-20 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors duration-150",
                    active ? "bg-ink text-card-fg" : "text-muted hover:text-fg",
                  )}
                >
                  {tab.id === "movie" ? (
                    <Film className="size-3.5" />
                  ) : tab.id === "series" ? (
                    <Tv className="size-3.5" />
                  ) : null}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {items.length > 0 ? (
          <div className="mb-8">
            <AdSlot variant="feed" />
          </div>
        ) : null}

        <ContinueRow />

        {error && items.length === 0 ? (
          <p className="rounded-xl bg-surface px-4 py-8 text-center text-sm text-muted">
            {error}
          </p>
        ) : transitioning && items.length === 0 ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <TitleCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-xl bg-surface px-4 py-16 text-center text-sm text-muted">
            Nothing in this mix yet. Try another search.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5">
            {items.map((item, index) => (
              <CatalogEntry key={`${item.kind}-${item.id}`} item={item} index={index} />
            ))}
            {loadingMore
              ? Array.from({ length: 4 }).map((_, i) => (
                  <TitleCardSkeleton key={`more-${i}`} />
                ))
              : null}
          </div>
        )}

        <div ref={sentinelRef} className="h-8" />

        {loadingMore ? (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-primary">
            <LoaderCircle className="size-5 animate-spin" />
            Loading more titles...
          </div>
        ) : null}

        {done && items.length > 0 ? (
          <div className="space-y-6 py-10">
            <AdSlot variant="feed" />
            <p className="text-center text-sm text-muted">
              You have reached the end of this mix.
            </p>
          </div>
        ) : null}
      </main>
    </div>
  );
}

function CatalogEntry({ item, index }: { item: CatalogItem; index: number }) {
  const showAd = (index + 1) % 8 === 0;
  return (
    <>
      <TitleCard item={item} />
      {showAd ? (
        <div className="col-span-full py-3">
          <AdSlot variant="feed" />
        </div>
      ) : null}
    </>
  );
}
