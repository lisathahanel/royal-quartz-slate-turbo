export type TitleKind = "movie" | "series";
export type CatalogFilter = "all" | TitleKind;

export type CatalogItem = {
  id: string;
  kind: TitleKind;
  title: string;
  tagline?: string;
  vj?: string;
  seasonLabel?: string;
  image: string;
  published: string;
  genres: string[];
  episodeCount: number;
  sourceUrl: string;
};

export type Episode = {
  id: string;
  label: string;
  url: string;
};

export type TitleDetail = CatalogItem & {
  synopsis: string;
  episodes: Episode[];
};

export type CatalogPage = {
  items: CatalogItem[];
  movieStart: number;
  seriesStart: number;
  done: boolean;
  error?: string;
};

export type CatalogQuery = {
  kind: CatalogFilter;
  q?: string;
  movieStart: number;
  seriesStart: number;
};
