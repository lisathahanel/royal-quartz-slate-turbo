import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft, Bookmark, Clapperboard } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { VideoPlayer } from "@/components/video-player";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AdSlot } from "@/components/ad-slot";
import { getTitle } from "@/lib/catalog/api";
import { useLibrary } from "@/lib/catalog/library";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/watch/$kind/$postId")({
  beforeLoad: ({ params }) => {
    if (params.kind !== "movie" && params.kind !== "series") {
      throw redirect({ to: "/", search: { kind: "all" } });
    }
  },
  loader: ({ params }) =>
    getTitle({
      data: {
        kind: params.kind as "movie" | "series",
        postId: params.postId,
      },
    }),
  component: WatchPage,
  pendingComponent: WatchPending,
});

function WatchPending() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="skeleton-shine aspect-video rounded-xl" />
        <div className="mt-6 h-8 w-64 skeleton-shine rounded-md" />
        <div className="mt-3 h-20 skeleton-shine rounded-md" />
      </main>
    </div>
  );
}

function WatchPage() {
  const title = Route.useLoaderData();
  const saved = useLibrary((s) =>
    title ? s.isSaved(title.kind, title.id) : false,
  );
  const toggleWatchlist = useLibrary((s) => s.toggleWatchlist);

  if (!title) {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <Clapperboard className="mx-auto size-10 text-primary" />
          <h1 className="mt-4 font-display text-2xl font-bold">Title not found</h1>
          <p className="mt-2 text-sm text-muted">
            This movie or series is no longer in the mix.
          </p>
          <Button asChild className="mt-6">
            <Link to="/" search={{ kind: "all" }}>
              Back to catalog
            </Link>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <Link
          to="/"
          search={{ kind: title.kind }}
          className="mb-4 inline-flex h-11 items-center gap-1.5 text-sm font-medium text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          {title.kind === "series" ? "Series mix" : "Movies mix"}
        </Link>

        <VideoPlayer title={title} />

        <section className="mt-8 grid gap-8 lg:grid-cols-[160px_minmax(0,1fr)_280px] lg:items-start">
          {title.image ? (
            <img
              src={title.image}
              alt=""
              className="hidden aspect-poster w-40 rounded-lg object-cover shadow-[var(--shadow-card)] outline outline-1 -outline-offset-1 outline-black/10 lg:block"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="hidden lg:block" />
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={title.kind === "series" ? "series" : "movie"}>
                {title.kind === "series" ? "Series" : "Movie"}
              </Badge>
              {title.vj ? (
                <span className="text-xs font-semibold tracking-wide text-primary uppercase">
                  {title.vj}
                </span>
              ) : null}
              {title.seasonLabel ? (
                <span className="text-xs text-muted">{title.seasonLabel}</span>
              ) : null}
            </div>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight">
              {title.title}
            </h1>
            {title.tagline ? (
              <p className="mt-1 text-sm text-muted">{title.tagline}</p>
            ) : null}
            {title.genres.length ? (
              <p className="mt-2 text-xs font-medium tracking-wide text-muted uppercase">
                {title.genres.join(" · ")}
              </p>
            ) : null}
            <p className="mt-4 max-w-prose text-sm leading-relaxed text-fg">
              {title.synopsis}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                type="button"
                variant={saved ? "ink" : "outline"}
                onClick={() => toggleWatchlist(title)}
                className={cn(saved && "text-gold")}
              >
                <Bookmark className={cn("size-4", saved && "fill-current")} />
                {saved ? "Saved" : "Save"}
              </Button>
              {title.sourceUrl !== "#" ? (
                <Button asChild variant="ghost">
                  <a href={title.sourceUrl} rel="noopener noreferrer">
                    Original post
                  </a>
                </Button>
              ) : null}
            </div>
          </div>
          <div className="mt-2 lg:mt-0">
            <AdSlot variant="rail" />
          </div>
        </section>
      </main>
    </div>
  );
}
