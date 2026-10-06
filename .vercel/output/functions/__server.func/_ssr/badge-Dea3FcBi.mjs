import { C as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { o as cn } from "./router-OF3SxkHs.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-Dea3FcBi.js
var import_jsx_runtime = require_jsx_runtime();
function keyOf(kind, id) {
	return `${kind}:${id}`;
}
var useLibrary = create()(persist((set, get) => ({
	watchlist: [],
	continueWatching: [],
	toggleWatchlist: (item) => {
		set({ watchlist: get().watchlist.some((row) => keyOf(row.kind, row.id) === keyOf(item.kind, item.id)) ? get().watchlist.filter((row) => keyOf(row.kind, row.id) !== keyOf(item.kind, item.id)) : [item, ...get().watchlist].slice(0, 80) });
	},
	isSaved: (kind, id) => get().watchlist.some((row) => keyOf(row.kind, row.id) === keyOf(kind, id)),
	saveProgress: (entry) => {
		const progress = entry.duration > 0 ? entry.currentTime / entry.duration : 0;
		if (entry.currentTime < 12 || progress > .92) {
			set({ continueWatching: get().continueWatching.filter((row) => keyOf(row.kind, row.id) !== keyOf(entry.kind, entry.id)) });
			return;
		}
		set({ continueWatching: [entry, ...get().continueWatching.filter((row) => keyOf(row.kind, row.id) !== keyOf(entry.kind, entry.id))].slice(0, 16) });
	},
	removeContinue: (kind, id) => set({ continueWatching: get().continueWatching.filter((row) => keyOf(row.kind, row.id) !== keyOf(kind, id)) })
}), { name: "naka-firimu-library" }));
var badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold uppercase tracking-wide", {
	variants: { variant: {
		movie: "bg-primary text-primary-fg",
		series: "bg-card-fg text-ink",
		muted: "bg-fg/10 text-fg"
	} },
	defaultVariants: { variant: "muted" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { useLibrary as n, Badge as t };
