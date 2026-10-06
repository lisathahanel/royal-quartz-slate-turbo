import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CatalogItem, TitleKind } from "./types";

export type ContinueEntry = {
  id: string;
  kind: TitleKind;
  title: string;
  image: string;
  episodeIndex: number;
  episodeLabel: string;
  currentTime: number;
  duration: number;
  updatedAt: number;
};

type LibraryState = {
  watchlist: CatalogItem[];
  continueWatching: ContinueEntry[];
  toggleWatchlist: (item: CatalogItem) => void;
  isSaved: (kind: TitleKind, id: string) => boolean;
  saveProgress: (entry: ContinueEntry) => void;
  removeContinue: (kind: TitleKind, id: string) => void;
};

function keyOf(kind: TitleKind, id: string) {
  return `${kind}:${id}`;
}

export const useLibrary = create<LibraryState>()(
  persist(
    (set, get) => ({
      watchlist: [],
      continueWatching: [],
      toggleWatchlist: (item) => {
        const exists = get().watchlist.some(
          (row) => keyOf(row.kind, row.id) === keyOf(item.kind, item.id),
        );
        set({
          watchlist: exists
            ? get().watchlist.filter(
                (row) => keyOf(row.kind, row.id) !== keyOf(item.kind, item.id),
              )
            : [item, ...get().watchlist].slice(0, 80),
        });
      },
      isSaved: (kind, id) =>
        get().watchlist.some((row) => keyOf(row.kind, row.id) === keyOf(kind, id)),
      saveProgress: (entry) => {
        const progress =
          entry.duration > 0 ? entry.currentTime / entry.duration : 0;
        if (entry.currentTime < 12 || progress > 0.92) {
          set({
            continueWatching: get().continueWatching.filter(
              (row) => keyOf(row.kind, row.id) !== keyOf(entry.kind, entry.id),
            ),
          });
          return;
        }
        const rest = get().continueWatching.filter(
          (row) => keyOf(row.kind, row.id) !== keyOf(entry.kind, entry.id),
        );
        set({ continueWatching: [entry, ...rest].slice(0, 16) });
      },
      removeContinue: (kind, id) =>
        set({
          continueWatching: get().continueWatching.filter(
            (row) => keyOf(row.kind, row.id) !== keyOf(kind, id),
          ),
        }),
    }),
    { name: "naka-firimu-library" },
  ),
);
