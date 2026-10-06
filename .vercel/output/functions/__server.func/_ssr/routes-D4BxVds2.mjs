import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, b as Link, p as useRouterState, x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { d as Film, o as Play, p as Bookmark, r as Tv, u as LoaderCircle } from "../_libs/lucide-react.mjs";
import { a as SiteHeader, o as cn, r as Route$1, s as listCatalog } from "./router-OF3SxkHs.mjs";
import { n as useLibrary, t as Badge } from "./badge-Dea3FcBi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D4BxVds2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ContinueRow() {
	const [ready, setReady] = (0, import_react.useState)(false);
	const items = useLibrary((s) => s.continueWatching);
	(0, import_react.useEffect)(() => {
		setReady(true);
	}, []);
	if (!ready || items.length === 0) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mb-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 font-display text-lg font-semibold tracking-tight",
			children: "Continue watching"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0",
			children: items.map((item) => {
				const pct = item.duration > 0 ? Math.min(100, Math.round(item.currentTime / item.duration * 100)) : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/watch/$kind/$postId",
					params: {
						kind: item.kind,
						postId: item.id
					},
					className: "w-36 shrink-0 overflow-hidden rounded-lg bg-card text-card-fg shadow-[var(--shadow-card)] sm:w-40",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-poster",
						children: [
							item.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: item.image,
								alt: "",
								className: "size-full object-cover outline outline-1 -outline-offset-1 outline-white/10",
								referrerPolicy: "no-referrer"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-ink" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-0 flex items-center justify-center",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex size-10 items-center justify-center rounded-full bg-primary text-primary-fg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-4 translate-x-0.5 fill-current" })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute inset-x-0 bottom-0 h-1 bg-fg/20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block h-full bg-gold",
									style: { width: `${pct}%` }
								})
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-2 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "line-clamp-1 text-sm font-semibold",
							children: item.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-card-fg/70",
							children: item.episodeLabel
						})]
					})]
				}, `${item.kind}-${item.id}`);
			})
		})]
	});
}
function TitleCard({ item }) {
	const saved = useLibrary((s) => s.isSaved(item.kind, item.id));
	const toggleWatchlist = useLibrary((s) => s.toggleWatchlist);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "group relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/watch/$kind/$postId",
			params: {
				kind: item.kind,
				postId: item.id
			},
			title: item.title,
			className: cn("block overflow-hidden rounded-lg bg-card text-card-fg shadow-[var(--shadow-card)]", "transition-[transform,box-shadow] duration-300 ease-[var(--ease-out)]", "hover:-translate-y-0.5 hover:shadow-[var(--shadow-card-hover)]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-poster overflow-hidden bg-ink",
				children: [
					item.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.image,
						alt: item.title,
						loading: "lazy",
						referrerPolicy: "no-referrer",
						className: "size-full object-cover outline outline-1 -outline-offset-1 outline-white/10 transition-[transform,filter] duration-300 ease-[var(--ease-out)] group-hover:scale-105 group-hover:brightness-50"
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-full bg-ink" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: item.kind === "series" ? "series" : "movie",
						className: "absolute top-2 left-2",
						children: item.kind === "series" ? "Series" : "Movie"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-14 items-center justify-center rounded-full bg-primary text-primary-fg shadow-[0_0_20px_rgb(216_184_0_/_0.55)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-6 translate-x-0.5 fill-current" })
						})
					}),
					item.vj ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "absolute right-2 bottom-2 left-2 truncate text-xs font-medium text-card-fg/90",
						children: item.vj
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex min-h-14 items-center justify-center bg-primary px-2 py-2 text-center text-sm font-bold leading-snug text-primary-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "line-clamp-2",
					children: item.title
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			"aria-label": saved ? "Remove from saved" : "Save title",
			onClick: () => toggleWatchlist(item),
			className: cn("absolute top-2 right-2 z-10 flex size-11 items-center justify-center rounded-full", "bg-ink/70 text-card-fg backdrop-blur-sm transition-colors duration-150", saved ? "text-gold" : "hover:text-gold"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: cn("size-4", saved && "fill-current") })
		})]
	});
}
function TitleCardSkeleton() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-lg bg-card shadow-[var(--shadow-card)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton-shine aspect-poster" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "skeleton-shine-gold h-14" })]
	});
}
var TABS = [
	{
		id: "all",
		label: "Mix"
	},
	{
		id: "movie",
		label: "Movies"
	},
	{
		id: "series",
		label: "Series"
	}
];
function Home() {
	const data = Route$1.useLoaderData();
	const search = Route$1.useSearch();
	const navigate = useNavigate({ from: "/" });
	const transitioning = useRouterState({ select: (s) => s.isLoading || s.isTransitioning });
	const [items, setItems] = (0, import_react.useState)(data.items);
	const [movieStart, setMovieStart] = (0, import_react.useState)(data.movieStart);
	const [seriesStart, setSeriesStart] = (0, import_react.useState)(data.seriesStart);
	const [done, setDone] = (0, import_react.useState)(data.done);
	const [loadingMore, setLoadingMore] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(data.error);
	const sentinelRef = (0, import_react.useRef)(null);
	const loadingRef = (0, import_react.useRef)(false);
	const cursorRef = (0, import_react.useRef)({
		movieStart: data.movieStart,
		seriesStart: data.seriesStart,
		done: data.done,
		kind: search.kind,
		q: search.q
	});
	(0, import_react.useEffect)(() => {
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
			q: search.q
		};
	}, [
		data,
		search.kind,
		search.q
	]);
	cursorRef.current.movieStart = movieStart;
	cursorRef.current.seriesStart = seriesStart;
	cursorRef.current.done = done;
	cursorRef.current.kind = search.kind;
	cursorRef.current.q = search.q;
	const loadMore = (0, import_react.useCallback)(async () => {
		const cursor = cursorRef.current;
		if (loadingRef.current || cursor.done) return;
		loadingRef.current = true;
		setLoadingMore(true);
		try {
			const page = await listCatalog({ data: {
				kind: cursor.kind,
				q: cursor.q,
				movieStart: cursor.movieStart,
				seriesStart: cursor.seriesStart
			} });
			setItems((prev) => {
				const seen = new Set(prev.map((item) => `${item.kind}:${item.id}`));
				return [...prev, ...page.items.filter((item) => !seen.has(`${item.kind}:${item.id}`))];
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
	(0, import_react.useEffect)(() => {
		const node = sentinelRef.current;
		if (!node) return;
		const observer = new IntersectionObserver((entries) => {
			if (entries[0]?.isIntersecting) loadMore();
		}, { rootMargin: "900px" });
		observer.observe(node);
		return () => observer.disconnect();
	}, [
		loadMore,
		items.length,
		done
	]);
	const heading = search.kind === "movie" ? "Movies" : search.kind === "series" ? "Series" : "Naka Firimu";
	const sub = search.q ? `Results for “${search.q}”` : search.kind === "all" ? "Movies and series, mixed in one scroll" : search.kind === "movie" ? "From the movies catalog" : "From the series catalog";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, { query: search.q ?? "" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-8 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-[0.18em] text-primary uppercase",
							children: "Catalog"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-1 font-display text-3xl font-bold tracking-tight sm:text-4xl",
							children: heading
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: sub
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex rounded-full bg-surface p-1 shadow-[var(--shadow-border)]",
						children: TABS.map((tab) => {
							const active = search.kind === tab.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => void navigate({ search: {
									kind: tab.id,
									q: search.q
								} }),
								className: cn("inline-flex h-11 min-w-20 items-center justify-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors duration-150", active ? "bg-ink text-card-fg" : "text-muted hover:text-fg"),
								children: [tab.id === "movie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Film, { className: "size-3.5" }) : tab.id === "series" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tv, { className: "size-3.5" }) : null, tab.label]
							}, tab.id);
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ContinueRow, {}),
				error && items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-surface px-4 py-8 text-center text-sm text-muted",
					children: error
				}) : transitioning && items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5",
					children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleCardSkeleton, {}, i))
				}) : items.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded-xl bg-surface px-4 py-16 text-center text-sm text-muted",
					children: "Nothing in this mix yet. Try another search."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 md:grid-cols-4 lg:grid-cols-5",
					children: [items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleCard, { item }, `${item.kind}-${item.id}`)), loadingMore ? Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TitleCardSkeleton, {}, `more-${i}`)) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					ref: sentinelRef,
					className: "h-8"
				}),
				loadingMore ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-center gap-2 py-8 text-sm text-primary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin" }), "Loading more titles..."]
				}) : null,
				done && items.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-10 text-center text-sm text-muted",
					children: "You have reached the end of this mix."
				}) : null
			]
		})]
	});
}
//#endregion
export { Home as component };
