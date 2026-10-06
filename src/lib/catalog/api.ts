import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  extractEpisodes,
  extractSynopsis,
  hasSeriesLabel,
  toCatalogItem,
} from "./parse";
import type { CatalogItem, CatalogPage, TitleDetail, TitleKind } from "./types";

const SOURCES: Record<TitleKind, { blogUrl: string; label: string }> = {
  movie: {
    blogUrl: "https://naka.marketing2advertising.com",
    label: "nakamovies",
  },
  series: {
    blogUrl: "https://serie.marketing2advertising.com",
    label: "series",
  },
};

const PAGE_SIZE = 12;
const cache = new Map<string, { expires: number; json: unknown }>();
const CACHE_TTL = 90_000;

type BloggerLink = { rel?: string; href?: string };
type BloggerCategory = { term?: string };
type BloggerText = { $t?: string };
type BloggerEntry = {
  id?: BloggerText;
  title?: BloggerText;
  published?: BloggerText;
  content?: BloggerText;
  summary?: BloggerText;
  link?: BloggerLink[];
  category?: BloggerCategory[];
  media$thumbnail?: { url?: string };
};

type BloggerFeed = {
  feed?: { entry?: BloggerEntry | BloggerEntry[] };
  entry?: BloggerEntry;
};

const querySchema = z.object({
  kind: z.enum(["all", "movie", "series"]),
  q: z.string().optional(),
  movieStart: z.number().int().min(1),
  seriesStart: z.number().int().min(1),
});

const titleSchema = z.object({
  kind: z.enum(["movie", "series"]),
  postId: z.string().min(1).max(40),
});

function asEntries(
  value: BloggerEntry | BloggerEntry[] | undefined,
): BloggerEntry[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

async function fetchJson(url: string): Promise<BloggerFeed> {
  const hit = cache.get(url);
  if (hit && hit.expires > Date.now()) return hit.json as BloggerFeed;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": "NakaFirimu/1.0",
      },
    });
    if (!res.ok) throw new Error(`Feed ${res.status}`);
    const json = (await res.json()) as BloggerFeed;
    cache.set(url, { expires: Date.now() + CACHE_TTL, json });
    return json;
  } finally {
    clearTimeout(timer);
  }
}

function alternateHref(entry: BloggerEntry): string {
  const link = entry.link?.find((item) => item.rel === "alternate" && item.href);
  return link?.href ?? "#";
}

function mapEntry(entry: BloggerEntry, kind: TitleKind): CatalogItem | null {
  const id = entry.id?.$t;
  const title = entry.title?.$t;
  if (!id || !title) return null;
  const html = entry.content?.$t ?? entry.summary?.$t ?? "";
  const categories = (entry.category ?? [])
    .map((c) => c.term ?? "")
    .filter(Boolean);
  return toCatalogItem(
    kind,
    id,
    title,
    html,
    entry.media$thumbnail?.url,
    entry.published?.$t ?? "",
    categories,
    alternateHref(entry),
  );
}

function feedUrl(
  kind: TitleKind,
  start: number,
  max: number,
  q?: string,
): string {
  const source = SOURCES[kind];
  const params = new URLSearchParams({
    alt: "json",
    "start-index": String(start),
    "max-results": String(max),
    orderby: "published",
  });
  if (q && q.trim()) params.set("q", q.trim());
  return `${source.blogUrl}/feeds/posts/default/-/${encodeURIComponent(source.label)}?${params.toString()}`;
}

async function fetchSlice(
  kind: TitleKind,
  start: number,
  q?: string,
): Promise<{ items: CatalogItem[]; nextStart: number; done: boolean }> {
  const json = await fetchJson(feedUrl(kind, start, PAGE_SIZE, q));
  const entries = asEntries(json.feed?.entry);
  const nextStart = start + entries.length;
  const done = entries.length < PAGE_SIZE;
  const items: CatalogItem[] = [];
  for (const entry of entries) {
    const categories = (entry.category ?? [])
      .map((c) => c.term ?? "")
      .filter(Boolean);
    if (kind === "movie" && hasSeriesLabel(categories)) continue;
    const item = mapEntry(entry, kind);
    if (item) items.push(item);
  }
  return { items, nextStart, done };
}

function interleave(
  movies: CatalogItem[],
  series: CatalogItem[],
): CatalogItem[] {
  const mixed: CatalogItem[] = [];
  const limit = Math.max(movies.length, series.length);
  for (let i = 0; i < limit; i++) {
    if (i < movies.length) mixed.push(movies[i]);
    if (i < series.length) mixed.push(series[i]);
  }
  return mixed;
}

export const listCatalog = createServerFn({ method: "POST" })
  .validator((data) => querySchema.parse(data))
  .handler(async ({ data }): Promise<CatalogPage> => {
    const q = data.q?.trim() || undefined;
    const errors: string[] = [];

    const load = async (kind: TitleKind, start: number) => {
      try {
        return await fetchSlice(kind, start, q);
      } catch (err) {
        errors.push(
          kind === "movie" ? "Movies feed failed" : "Series feed failed",
        );
        console.error(err);
        return { items: [] as CatalogItem[], nextStart: start, done: true };
      }
    };

    if (data.kind === "movie") {
      const page = await load("movie", data.movieStart);
      return {
        items: page.items,
        movieStart: page.nextStart,
        seriesStart: data.seriesStart,
        done: page.done,
        error: errors[0],
      };
    }

    if (data.kind === "series") {
      const page = await load("series", data.seriesStart);
      return {
        items: page.items,
        movieStart: data.movieStart,
        seriesStart: page.nextStart,
        done: page.done,
        error: errors[0],
      };
    }

    const [movies, series] = await Promise.all([
      load("movie", data.movieStart),
      load("series", data.seriesStart),
    ]);

    return {
      items: interleave(movies.items, series.items),
      movieStart: movies.nextStart,
      seriesStart: series.nextStart,
      done: movies.done && series.done,
      error: errors.length ? errors.join(" · ") : undefined,
    };
  });

export const getTitle = createServerFn({ method: "POST" })
  .validator((data) => titleSchema.parse(data))
  .handler(async ({ data }): Promise<TitleDetail | null> => {
    const source = SOURCES[data.kind];
    if (!/^\d+$/.test(data.postId)) return null;
    const url = `${source.blogUrl}/feeds/posts/default/${encodeURIComponent(data.postId)}?alt=json`;
    try {
      const json = await fetchJson(url);
      const entry = json.entry ?? asEntries(json.feed?.entry)[0];
      if (!entry) return null;
      const item = mapEntry(entry, data.kind);
      if (!item) return null;
      const html = entry.content?.$t ?? entry.summary?.$t ?? "";
      return {
        ...item,
        synopsis: extractSynopsis(html, item.title),
        episodes: extractEpisodes(html),
      };
    } catch (err) {
      console.error(err);
      return null;
    }
  });
