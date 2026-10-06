import type { CatalogItem, Episode, TitleKind } from "./types";

const SKIP_LABELS = new Set([
  "nakamovies",
  "nakaseries",
  "series",
  "movie",
  "movies",
]);

const GENRES = new Set([
  "action",
  "adventure",
  "animation",
  "comedy",
  "crime",
  "drama",
  "family",
  "fantasy",
  "horror",
  "mystery",
  "romance",
  "scifi",
  "sci-fi",
  "thriller",
  "war",
  "western",
]);

export function decodeEntities(text: string): string {
  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#39;|'/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) =>
      String.fromCharCode(parseInt(n, 16)),
    );
}

export function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/[\u200b\u00ad]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function upgradeImage(url: string): string {
  return url
    .replace(/\/s72-c\//, "/s1600/")
    .replace(/\/s72\//, "/s1600/")
    .replace(/=s72-c/, "=s1600")
    .replace(/=s72/, "=s1600")
    .replace(/\/w\d+-h\d+\//, "/s1600/");
}

export function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function postIdFromEntryId(entryId: string): string {
  const match = entryId.match(/post-(\d+)/);
  return match?.[1] ?? entryId;
}

export function hasSeriesLabel(categories: string[]): boolean {
  return categories.some((c) => c.toLowerCase() === "series");
}

export function extractGenres(categories: string[]): string[] {
  const out: string[] = [];
  for (const raw of categories) {
    const term = raw.toLowerCase().trim();
    if (SKIP_LABELS.has(term)) continue;
    if (term.startsWith("vj-") || term.includes("-vj-")) continue;
    if (GENRES.has(term) || GENRES.has(term.replace("-", ""))) {
      const label = term === "scifi" || term === "sci-fi" ? "Sci-Fi" : raw;
      if (!out.some((g) => g.toLowerCase() === label.toLowerCase())) {
        out.push(label.charAt(0).toUpperCase() + label.slice(1));
      }
    }
  }
  return out.slice(0, 3);
}

function cleanSpaces(value: string): string {
  return value.replace(/[\u200b\u00ad]/g, "").replace(/\s+/g, " ").trim();
}

export function parseHeadline(raw: string): {
  title: string;
  vj?: string;
  seasonLabel?: string;
  tagline?: string;
} {
  const tagline = raw.match(/\(\(([\s\S]*?)\)\)/)?.[1]?.trim();
  let text = cleanSpaces(
    raw
      .replace(/\(\([\s\S]*?\)\)/g, " ")
      .replace(/Kali Mu:\s*VJ\s+\w+/gi, " "),
  );

  let seasonLabel: string | undefined;
  let vj: string | undefined;
  let title = "";

  if (!/^Season\b/i.test(text)) {
    const trailing = text.match(/^(.*\S)\s+(Season\b.*)$/i);
    if (trailing) {
      text = trailing[1].replace(/[|,–-]\s*$/, "").trim();
      seasonLabel = trailing[2].trim();
    }
  }

  const takeTitle = (value: string) => {
    const next = value.trim();
    if (!next) return;
    title = title ? `${title} ${next}` : next;
  };

  const applyPart = (part: string) => {
    const chunk = part.trim();
    if (!chunk) return;

    if (/^Season\b/i.test(chunk)) {
      const split = chunk.match(/^(Season.+?)\s*[-–]\s*(.+)$/i);
      if (split) {
        seasonLabel = seasonLabel ?? split[1].trim();
        applyPart(split[2]);
      } else {
        seasonLabel = seasonLabel ?? chunk;
      }
      return;
    }

    if (/^VJ\b/i.test(chunk)) {
      const withSeason = chunk.match(/^(VJ\s+.+?)\s*[-–]?\s+(Season\b.*)$/i);
      if (withSeason) {
        vj = vj ?? withSeason[1].trim();
        seasonLabel = seasonLabel ?? withSeason[2].trim();
        return;
      }
      const withTitle = chunk.match(/^(VJ\s+.+?)\s*[-–]\s*(.+)$/i);
      if (withTitle && !/^Season\b/i.test(withTitle[2])) {
        vj = vj ?? withTitle[1].trim();
        takeTitle(withTitle[2]);
        return;
      }
      vj = vj ?? chunk;
      return;
    }

    const trailingVj = chunk.match(/^(.+?)\s*[-–]\s*(VJ\s+.+)$/i);
    if (trailingVj) {
      takeTitle(trailingVj[1]);
      applyPart(trailingVj[2]);
      return;
    }

    takeTitle(chunk);
  };

  const parts = text
    .split("|")
    .map((part) => part.trim())
    .filter(Boolean);
  if (parts.length > 1) {
    for (const part of parts) applyPart(part);
  } else {
    applyPart(text);
  }

  title = title.replace(/^[-–|,\s]+|[-–|,\s]+$/g, "").trim();
  if (!title) title = cleanSpaces(raw.replace(/\(\([\s\S]*?\)\)/g, " "));
  return { title, vj, seasonLabel, tagline };
}

const VIDEO_MARK = /\[\/ddr45\/\](https?:\/\/[^[\s<]+)\[\/ddr45\/\]/gi;

export function extractEpisodes(html: string): Episode[] {
  const episodes: Episode[] = [];
  const seen = new Set<string>();
  const blocks = html.split(/<h2\b[^>]*>/i);

  const push = (label: string, rawUrl: string) => {
    const url = decodeEntities(rawUrl).replace(/[\u200b\u00ad]/g, "").trim();
    if (!isHttpUrl(url) || seen.has(url)) return;
    seen.add(url);
    episodes.push({
      id: String(episodes.length + 1),
      label,
      url,
    });
  };

  for (const block of blocks) {
    VIDEO_MARK.lastIndex = 0;
    const urlMatch = VIDEO_MARK.exec(block);
    if (!urlMatch) continue;
    const heading = stripTags(block.match(/^([^<]*)<\/h2>/i)?.[1] ?? "");
    const epNum = heading.match(/Episode\s*(\d+)/i)?.[1];
    const label = epNum
      ? `Episode ${epNum}`
      : episodes.length === 0
        ? "Play"
        : `Part ${episodes.length + 1}`;
    push(label, urlMatch[1]);
  }

  if (episodes.length === 0) {
    VIDEO_MARK.lastIndex = 0;
    for (const match of html.matchAll(VIDEO_MARK)) {
      push(
        episodes.length === 0 ? "Play" : `Part ${episodes.length + 1}`,
        match[1],
      );
    }
  }

  if (episodes.length === 1 && episodes[0].label === "Play") {
    episodes[0] = { ...episodes[0], label: "Full movie" };
  }

  return episodes;
}

export function countVideos(html: string): number {
  return extractEpisodes(html).length;
}

export function extractSynopsis(html: string, fallbackTitle: string): string {
  const boxed = html.match(
    /background:\s*linear-gradient[\s\S]{0,6000}?<\/div>/i,
  )?.[0];
  const source = boxed ?? html;
  const boldBlock = source.match(
    /<b>([^<]+)<\/b>[\s\S]{0,120}?<br\s*\/?>([\s\S]*?)<\/p>/i,
  );
  if (boldBlock) {
    const body = stripTags(boldBlock[2].replace(/<br\s*\/?>/gi, " "));
    if (body.length > 40) return body.slice(0, 520);
  }
  const paragraphs = source
    .split(/<\/p>/i)
    .map((p) => stripTags(p))
    .filter((p) => p.length > 60 && !/^Alright,/i.test(p) && !/^Step /i.test(p));
  if (paragraphs[0]) return paragraphs[0].slice(0, 520);
  return `${fallbackTitle} is ready to watch.`;
}

export function extractImage(html: string, thumbnail?: string): string {
  if (thumbnail) return upgradeImage(thumbnail);
  const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match?.[1]) return upgradeImage(decodeEntities(match[1]));
  return "";
}

export function toCatalogItem(
  kind: TitleKind,
  entryId: string,
  rawTitle: string,
  html: string,
  thumbnail: string | undefined,
  published: string,
  categories: string[],
  sourceUrl: string,
): CatalogItem {
  const parsed = parseHeadline(rawTitle);
  const episodes = extractEpisodes(html);
  return {
    id: postIdFromEntryId(entryId),
    title: parsed.title,
    kind,
    tagline: parsed.tagline,
    vj: parsed.vj,
    seasonLabel: parsed.seasonLabel,
    image: extractImage(html, thumbnail),
    published,
    genres: extractGenres(categories),
    episodeCount: episodes.length,
    sourceUrl,
  };
}
