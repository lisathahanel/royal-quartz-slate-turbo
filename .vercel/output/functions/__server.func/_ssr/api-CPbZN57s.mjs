import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as string, i as object, r as number, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-CPbZN57s.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var SKIP_LABELS = /* @__PURE__ */ new Set([
	"nakamovies",
	"nakaseries",
	"series",
	"movie",
	"movies"
]);
var GENRES = /* @__PURE__ */ new Set([
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
	"western"
]);
function decodeEntities(text) {
	return text.replace(/&nbsp;/gi, " ").replace(/&/g, "&").replace(/</g, "<").replace(/>/g, ">").replace(/"/g, "\"").replace(/&#39;|'/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n))).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)));
}
function stripTags(html) {
	return decodeEntities(html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")).replace(/[\u200b\u00ad]/g, "").replace(/\s+/g, " ").trim();
}
function upgradeImage(url) {
	return url.replace(/\/s72-c\//, "/s1600/").replace(/\/s72\//, "/s1600/").replace(/=s72-c/, "=s1600").replace(/=s72/, "=s1600").replace(/\/w\d+-h\d+\//, "/s1600/");
}
function isHttpUrl(value) {
	try {
		const url = new URL(value);
		return url.protocol === "http:" || url.protocol === "https:";
	} catch {
		return false;
	}
}
function postIdFromEntryId(entryId) {
	return entryId.match(/post-(\d+)/)?.[1] ?? entryId;
}
function hasSeriesLabel(categories) {
	return categories.some((c) => c.toLowerCase() === "series");
}
function extractGenres(categories) {
	const out = [];
	for (const raw of categories) {
		const term = raw.toLowerCase().trim();
		if (SKIP_LABELS.has(term)) continue;
		if (term.startsWith("vj-") || term.includes("-vj-")) continue;
		if (GENRES.has(term) || GENRES.has(term.replace("-", ""))) {
			const label = term === "scifi" || term === "sci-fi" ? "Sci-Fi" : raw;
			if (!out.some((g) => g.toLowerCase() === label.toLowerCase())) out.push(label.charAt(0).toUpperCase() + label.slice(1));
		}
	}
	return out.slice(0, 3);
}
function cleanSpaces(value) {
	return value.replace(/[\u200b\u00ad]/g, "").replace(/\s+/g, " ").trim();
}
function parseHeadline(raw) {
	const tagline = raw.match(/\(\(([\s\S]*?)\)\)/)?.[1]?.trim();
	let text = cleanSpaces(raw.replace(/\(\([\s\S]*?\)\)/g, " ").replace(/Kali Mu:\s*VJ\s+\w+/gi, " "));
	let seasonLabel;
	let vj;
	let title = "";
	if (!/^Season\b/i.test(text)) {
		const trailing = text.match(/^(.*\S)\s+(Season\b.*)$/i);
		if (trailing) {
			text = trailing[1].replace(/[|,–-]\s*$/, "").trim();
			seasonLabel = trailing[2].trim();
		}
	}
	const takeTitle = (value) => {
		const next = value.trim();
		if (!next) return;
		title = title ? `${title} ${next}` : next;
	};
	const applyPart = (part) => {
		const chunk = part.trim();
		if (!chunk) return;
		if (/^Season\b/i.test(chunk)) {
			const split = chunk.match(/^(Season.+?)\s*[-–]\s*(.+)$/i);
			if (split) {
				seasonLabel = seasonLabel ?? split[1].trim();
				applyPart(split[2]);
			} else seasonLabel = seasonLabel ?? chunk;
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
	const parts = text.split("|").map((part) => part.trim()).filter(Boolean);
	if (parts.length > 1) for (const part of parts) applyPart(part);
	else applyPart(text);
	title = title.replace(/^[-–|,\s]+|[-–|,\s]+$/g, "").trim();
	if (!title) title = cleanSpaces(raw.replace(/\(\([\s\S]*?\)\)/g, " "));
	return {
		title,
		vj,
		seasonLabel,
		tagline
	};
}
var VIDEO_MARK = /\[\/ddr45\/\](https?:\/\/[^[\s<]+)\[\/ddr45\/\]/gi;
function extractEpisodes(html) {
	const episodes = [];
	const seen = /* @__PURE__ */ new Set();
	const blocks = html.split(/<h2\b[^>]*>/i);
	const push = (label, rawUrl) => {
		const url = decodeEntities(rawUrl).replace(/[\u200b\u00ad]/g, "").trim();
		if (!isHttpUrl(url) || seen.has(url)) return;
		seen.add(url);
		episodes.push({
			id: String(episodes.length + 1),
			label,
			url
		});
	};
	for (const block of blocks) {
		VIDEO_MARK.lastIndex = 0;
		const urlMatch = VIDEO_MARK.exec(block);
		if (!urlMatch) continue;
		const epNum = stripTags(block.match(/^([^<]*)<\/h2>/i)?.[1] ?? "").match(/Episode\s*(\d+)/i)?.[1];
		push(epNum ? `Episode ${epNum}` : episodes.length === 0 ? "Play" : `Part ${episodes.length + 1}`, urlMatch[1]);
	}
	if (episodes.length === 0) {
		VIDEO_MARK.lastIndex = 0;
		for (const match of html.matchAll(VIDEO_MARK)) push(episodes.length === 0 ? "Play" : `Part ${episodes.length + 1}`, match[1]);
	}
	if (episodes.length === 1 && episodes[0].label === "Play") episodes[0] = {
		...episodes[0],
		label: "Full movie"
	};
	return episodes;
}
function extractSynopsis(html, fallbackTitle) {
	const source = html.match(/background:\s*linear-gradient[\s\S]{0,6000}?<\/div>/i)?.[0] ?? html;
	const boldBlock = source.match(/<b>([^<]+)<\/b>[\s\S]{0,120}?<br\s*\/?>([\s\S]*?)<\/p>/i);
	if (boldBlock) {
		const body = stripTags(boldBlock[2].replace(/<br\s*\/?>/gi, " "));
		if (body.length > 40) return body.slice(0, 520);
	}
	const paragraphs = source.split(/<\/p>/i).map((p) => stripTags(p)).filter((p) => p.length > 60 && !/^Alright,/i.test(p) && !/^Step /i.test(p));
	if (paragraphs[0]) return paragraphs[0].slice(0, 520);
	return `${fallbackTitle} is ready to watch.`;
}
function extractImage(html, thumbnail) {
	if (thumbnail) return upgradeImage(thumbnail);
	const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
	if (match?.[1]) return upgradeImage(decodeEntities(match[1]));
	return "";
}
function toCatalogItem(kind, entryId, rawTitle, html, thumbnail, published, categories, sourceUrl) {
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
		sourceUrl
	};
}
var SOURCES = {
	movie: {
		blogUrl: "https://naka.marketing2advertising.com",
		label: "nakamovies"
	},
	series: {
		blogUrl: "https://serie.marketing2advertising.com",
		label: "series"
	}
};
var PAGE_SIZE = 12;
var cache = /* @__PURE__ */ new Map();
var CACHE_TTL = 9e4;
var querySchema = object({
	kind: _enum([
		"all",
		"movie",
		"series"
	]),
	q: string().optional(),
	movieStart: number().int().min(1),
	seriesStart: number().int().min(1)
});
var titleSchema = object({
	kind: _enum(["movie", "series"]),
	postId: string().min(1).max(40)
});
function asEntries(value) {
	if (!value) return [];
	return Array.isArray(value) ? value : [value];
}
async function fetchJson(url) {
	const hit = cache.get(url);
	if (hit && hit.expires > Date.now()) return hit.json;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 12e3);
	try {
		const res = await fetch(url, {
			signal: controller.signal,
			headers: {
				Accept: "application/json",
				"User-Agent": "NakaFirimu/1.0"
			}
		});
		if (!res.ok) throw new Error(`Feed ${res.status}`);
		const json = await res.json();
		cache.set(url, {
			expires: Date.now() + CACHE_TTL,
			json
		});
		return json;
	} finally {
		clearTimeout(timer);
	}
}
function alternateHref(entry) {
	return (entry.link?.find((item) => item.rel === "alternate" && item.href))?.href ?? "#";
}
function mapEntry(entry, kind) {
	const id = entry.id?.$t;
	const title = entry.title?.$t;
	if (!id || !title) return null;
	const html = entry.content?.$t ?? entry.summary?.$t ?? "";
	const categories = (entry.category ?? []).map((c) => c.term ?? "").filter(Boolean);
	return toCatalogItem(kind, id, title, html, entry.media$thumbnail?.url, entry.published?.$t ?? "", categories, alternateHref(entry));
}
function feedUrl(kind, start, max, q) {
	const source = SOURCES[kind];
	const params = new URLSearchParams({
		alt: "json",
		"start-index": String(start),
		"max-results": String(max),
		orderby: "published"
	});
	if (q && q.trim()) params.set("q", q.trim());
	return `${source.blogUrl}/feeds/posts/default/-/${encodeURIComponent(source.label)}?${params.toString()}`;
}
async function fetchSlice(kind, start, q) {
	const entries = asEntries((await fetchJson(feedUrl(kind, start, PAGE_SIZE, q))).feed?.entry);
	const nextStart = start + entries.length;
	const done = entries.length < PAGE_SIZE;
	const items = [];
	for (const entry of entries) {
		const categories = (entry.category ?? []).map((c) => c.term ?? "").filter(Boolean);
		if (kind === "movie" && hasSeriesLabel(categories)) continue;
		const item = mapEntry(entry, kind);
		if (item) items.push(item);
	}
	return {
		items,
		nextStart,
		done
	};
}
function interleave(movies, series) {
	const mixed = [];
	const limit = Math.max(movies.length, series.length);
	for (let i = 0; i < limit; i++) {
		if (i < movies.length) mixed.push(movies[i]);
		if (i < series.length) mixed.push(series[i]);
	}
	return mixed;
}
var listCatalog_createServerFn_handler = createServerRpc({
	id: "35839c204210dc521e82daf5d98a5a52c4a93362c7979c30a65a804026b26262",
	name: "listCatalog",
	filename: "src/lib/catalog/api.ts"
}, (opts) => listCatalog.__executeServer(opts));
var listCatalog = createServerFn({ method: "POST" }).validator((data) => querySchema.parse(data)).handler(listCatalog_createServerFn_handler, async ({ data }) => {
	const q = data.q?.trim() || void 0;
	const errors = [];
	const load = async (kind, start) => {
		try {
			return await fetchSlice(kind, start, q);
		} catch (err) {
			errors.push(kind === "movie" ? "Movies feed failed" : "Series feed failed");
			console.error(err);
			return {
				items: [],
				nextStart: start,
				done: true
			};
		}
	};
	if (data.kind === "movie") {
		const page = await load("movie", data.movieStart);
		return {
			items: page.items,
			movieStart: page.nextStart,
			seriesStart: data.seriesStart,
			done: page.done,
			error: errors[0]
		};
	}
	if (data.kind === "series") {
		const page = await load("series", data.seriesStart);
		return {
			items: page.items,
			movieStart: data.movieStart,
			seriesStart: page.nextStart,
			done: page.done,
			error: errors[0]
		};
	}
	const [movies, series] = await Promise.all([load("movie", data.movieStart), load("series", data.seriesStart)]);
	return {
		items: interleave(movies.items, series.items),
		movieStart: movies.nextStart,
		seriesStart: series.nextStart,
		done: movies.done && series.done,
		error: errors.length ? errors.join(" · ") : void 0
	};
});
var getTitle_createServerFn_handler = createServerRpc({
	id: "79de34e68ee77643540c1f4e2a0a43519c0c90135f1c632ff4baddfed9466d42",
	name: "getTitle",
	filename: "src/lib/catalog/api.ts"
}, (opts) => getTitle.__executeServer(opts));
var getTitle = createServerFn({ method: "POST" }).validator((data) => titleSchema.parse(data)).handler(getTitle_createServerFn_handler, async ({ data }) => {
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
			episodes: extractEpisodes(html)
		};
	} catch (err) {
		console.error(err);
		return null;
	}
});
//#endregion
export { getTitle_createServerFn_handler, listCatalog_createServerFn_handler };
