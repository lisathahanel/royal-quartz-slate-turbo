import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { C as require_jsx_runtime, b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as Minimize, f as Clapperboard, l as Maximize, m as ArrowLeft, n as Volume2, o as Play, p as Bookmark, s as Pause, t as VolumeX } from "../_libs/lucide-react.mjs";
import { a as SiteHeader, i as Button, n as Route, o as cn } from "./router-OF3SxkHs.mjs";
import { n as useLibrary, t as Badge } from "./badge-Dea3FcBi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/watch._kind._postId-DJRlyHbb.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatTime(seconds) {
	if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
	return `${Math.floor(seconds / 60)}:${Math.floor(seconds % 60).toString().padStart(2, "0")}`;
}
function VideoPlayer({ title }) {
	const videoRef = (0, import_react.useRef)(null);
	const wrapRef = (0, import_react.useRef)(null);
	const saveProgress = useLibrary((s) => s.saveProgress);
	const prior = useLibrary((s) => s.continueWatching).find((row) => row.kind === title.kind && row.id === title.id);
	const [episodeIndex, setEpisodeIndex] = (0, import_react.useState)(Math.min(prior?.episodeIndex ?? 0, Math.max(0, title.episodes.length - 1)));
	const [playing, setPlaying] = (0, import_react.useState)(false);
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [currentTime, setCurrentTime] = (0, import_react.useState)(prior?.currentTime ?? 0);
	const [duration, setDuration] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)(false);
	const [fullscreen, setFullscreen] = (0, import_react.useState)(false);
	const restored = (0, import_react.useRef)(false);
	const episode = title.episodes[episodeIndex];
	(0, import_react.useEffect)(() => {
		restored.current = false;
		setError(false);
		setPlaying(false);
	}, [episodeIndex, episode?.url]);
	(0, import_react.useEffect)(() => {
		const video = videoRef.current;
		if (!video) return;
		const onTime = () => setCurrentTime(video.currentTime);
		const onMeta = () => {
			setDuration(video.duration || 0);
			if (!restored.current && prior && prior.episodeIndex === episodeIndex && prior.currentTime > 5) {
				video.currentTime = prior.currentTime;
				restored.current = true;
			}
		};
		const onPlay = () => setPlaying(true);
		const onPause = () => setPlaying(false);
		const onErr = () => setError(true);
		video.addEventListener("timeupdate", onTime);
		video.addEventListener("loadedmetadata", onMeta);
		video.addEventListener("play", onPlay);
		video.addEventListener("pause", onPause);
		video.addEventListener("error", onErr);
		return () => {
			video.removeEventListener("timeupdate", onTime);
			video.removeEventListener("loadedmetadata", onMeta);
			video.removeEventListener("play", onPlay);
			video.removeEventListener("pause", onPause);
			video.removeEventListener("error", onErr);
		};
	}, [episodeIndex, prior]);
	(0, import_react.useEffect)(() => {
		const id = window.setInterval(() => {
			const video = videoRef.current;
			if (!video || !episode) return;
			const payload = {
				id: title.id,
				kind: title.kind,
				title: title.title,
				image: title.image,
				episodeIndex,
				episodeLabel: episode.label,
				currentTime: video.currentTime,
				duration: video.duration || 0,
				updatedAt: Date.now()
			};
			saveProgress(payload);
		}, 5e3);
		return () => window.clearInterval(id);
	}, [
		episode,
		episodeIndex,
		saveProgress,
		title
	]);
	async function togglePlay() {
		const video = videoRef.current;
		if (!video) return;
		if (video.paused) await video.play();
		else video.pause();
	}
	async function toggleFullscreen() {
		const node = wrapRef.current;
		if (!node) return;
		if (document.fullscreenElement) {
			await document.exitFullscreen();
			setFullscreen(false);
		} else {
			await node.requestFullscreen();
			setFullscreen(true);
		}
	}
	if (!episode) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-card px-6 py-16 text-center text-card-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-xl font-semibold",
				children: "No stream found"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-card-fg/70",
				children: "This title does not have a playable file yet."
			}),
			title.sourceUrl !== "#" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: title.sourceUrl,
				className: "mt-4 inline-flex h-11 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-fg",
				rel: "noopener noreferrer",
				children: "Open original post"
			}) : null
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			ref: wrapRef,
			className: "overflow-hidden rounded-xl bg-ink shadow-[var(--shadow-card)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-video bg-ink",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("video", {
						ref: videoRef,
						src: episode.url,
						className: "size-full object-contain",
						playsInline: true,
						preload: "metadata",
						controls: false,
						referrerPolicy: "no-referrer",
						poster: title.image || void 0
					}, episode.url),
					error ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/80 px-4 text-center text-card-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: "This stream could not be loaded."
						}), title.sourceUrl !== "#" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: title.sourceUrl,
							className: "inline-flex h-11 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-fg",
							rel: "noopener noreferrer",
							children: "Open original post"
						}) : null]
					}) : null,
					!playing && !error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void togglePlay(),
						className: "absolute inset-0 flex items-center justify-center",
						"aria-label": "Play",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex size-16 items-center justify-center rounded-full bg-primary text-primary-fg shadow-[0_0_24px_rgb(216_184_0_/_0.5)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-7 translate-x-0.5 fill-current" })
						})
					}) : null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 bg-card px-3 py-2 text-card-fg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void togglePlay(),
						className: "flex size-11 items-center justify-center",
						"aria-label": playing ? "Pause" : "Play",
						children: playing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pause, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-5 fill-current" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "range",
						min: 0,
						max: duration || 0,
						step: .5,
						value: currentTime,
						"aria-label": "Seek",
						onChange: (e) => {
							const next = Number(e.target.value);
							if (videoRef.current) videoRef.current.currentTime = next;
							setCurrentTime(next);
						},
						className: "h-1 min-w-32 flex-1 accent-gold"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "min-w-20 text-xs tabular-nums text-card-fg/80",
						children: [
							formatTime(currentTime),
							" / ",
							formatTime(duration)
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							const video = videoRef.current;
							if (!video) return;
							video.muted = !video.muted;
							setMuted(video.muted);
						},
						className: "flex size-11 items-center justify-center",
						"aria-label": muted ? "Unmute" : "Mute",
						children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VolumeX, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Volume2, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => void toggleFullscreen(),
						className: "flex size-11 items-center justify-center",
						"aria-label": fullscreen ? "Exit fullscreen" : "Fullscreen",
						children: fullscreen ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minimize, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Maximize, { className: "size-5" })
					})
				]
			})]
		}), title.episodes.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-2",
			children: title.episodes.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => setEpisodeIndex(index),
				className: cn("h-11 min-w-11 rounded-full px-3 text-sm font-medium transition-colors duration-150", index === episodeIndex ? "bg-primary text-primary-fg" : "bg-surface text-fg shadow-[var(--shadow-border)] hover:bg-fg/6"),
				children: item.label
			}, item.id))
		}) : null]
	});
}
function WatchPage() {
	const title = Route.useLoaderData();
	const saved = useLibrary((s) => title ? s.isSaved(title.kind, title.id) : false);
	const toggleWatchlist = useLibrary((s) => s.toggleWatchlist);
	if (!title) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-lg px-4 py-24 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clapperboard, { className: "mx-auto size-10 text-primary" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-2xl font-bold",
					children: "Title not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "This movie or series is no longer in the mix."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						search: { kind: "all" },
						children: "Back to catalog"
					})
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					search: { kind: title.kind },
					className: "mb-4 inline-flex h-11 items-center gap-1.5 text-sm font-medium text-muted hover:text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), title.kind === "series" ? "Series mix" : "Movies mix"]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoPlayer, { title }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-6 grid gap-6 md:grid-cols-[160px_1fr] md:items-start",
					children: [title.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: title.image,
						alt: "",
						className: "hidden aspect-poster w-40 rounded-lg object-cover shadow-[var(--shadow-card)] outline outline-1 -outline-offset-1 outline-black/10 md:block",
						referrerPolicy: "no-referrer"
					}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: title.kind === "series" ? "series" : "movie",
									children: title.kind === "series" ? "Series" : "Movie"
								}),
								title.vj ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold tracking-wide text-primary uppercase",
									children: title.vj
								}) : null,
								title.seasonLabel ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted",
									children: title.seasonLabel
								}) : null
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-display text-3xl font-bold tracking-tight",
							children: title.title
						}),
						title.tagline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: title.tagline
						}) : null,
						title.genres.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-xs font-medium tracking-wide text-muted uppercase",
							children: title.genres.join(" · ")
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 max-w-prose text-sm leading-relaxed text-fg",
							children: title.synopsis
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: saved ? "ink" : "outline",
								onClick: () => toggleWatchlist(title),
								className: cn(saved && "text-gold"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bookmark, { className: cn("size-4", saved && "fill-current") }), saved ? "Saved" : "Save"]
							}), title.sourceUrl !== "#" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "ghost",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: title.sourceUrl,
									rel: "noopener noreferrer",
									children: "Original post"
								})
							}) : null]
						})
					] })]
				})
			]
		})]
	});
}
//#endregion
export { WatchPage as component };
