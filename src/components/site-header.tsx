import { FormEvent, useEffect, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Clapperboard, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function SiteHeader({ query = "" }: { query?: string }) {
  const navigate = useNavigate();
  const [value, setValue] = useState(query);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    setValue(query);
  }, [query]);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    const q = value.trim();
    void navigate({
      to: "/",
      search: { kind: "all", q: q || undefined },
    });
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          search={{ kind: "all" }}
          className="flex min-h-11 items-center gap-2 text-fg"
        >
          <span className="flex size-9 items-center justify-center rounded-full bg-ink text-gold">
            <Clapperboard className="size-4" strokeWidth={2} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Naka Firimu
          </span>
        </Link>
        <form onSubmit={onSubmit} className="relative ml-auto w-full max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" />
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Search titles or VJs"
            aria-label="Search catalog"
            className="pl-10"
          />
        </form>
        {pathname.startsWith("/watch") ? (
          <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex">
            <Link to="/" search={{ kind: "all" }}>
              Catalog
            </Link>
          </Button>
        ) : null}
      </div>
    </header>
  );
}
