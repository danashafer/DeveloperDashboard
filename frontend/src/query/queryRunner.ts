import { applyFilters, type FilterGroup, type FilterRule } from "./filter";

export type DatasetMap = Record<string, any[]>;

export type SortDir = "asc" | "desc";

export type SortSpec = {
  field: string;
  dir: SortDir;
};

export type Query = {
  entity: string;
  filter?: FilterGroup | FilterRule | null;
  sort?: SortSpec[];
  limit?: number;
  offset?: number;
};

export type QueryResult<T = any> = {
  rows: T[];
  total: number;
  limit: number;
  offset: number;
};

function getByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  if (!path.includes(".")) return obj[path];
  return path
    .split(".")
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function applySort<T>(rows: T[], sort: SortSpec[] = []): T[] {
  if (!sort.length) return rows;

  const copy = [...rows];
  copy.sort((a: any, b: any) => {
    for (const s of sort) {
      const av = getByPath(a, s.field);
      const bv = getByPath(b, s.field);

      if (av === bv) continue;

      if (av == null && bv != null) return s.dir === "asc" ? 1 : -1;
      if (bv == null && av != null) return s.dir === "asc" ? -1 : 1;
      if (av == null && bv == null) continue;

      if (av < bv) return s.dir === "asc" ? -1 : 1;
      if (av > bv) return s.dir === "asc" ? 1 : -1;
    }
    return 0;
  });

  return copy;
}

export function runQuery<T = any>(
  dataset: DatasetMap,
  query: Query
): QueryResult<T> {
  const base = (dataset[query.entity] ?? []) as T[];

  const filtered = applyFilters(base, query.filter);
  const total = filtered.length;

  const sorted = applySort(filtered, query.sort ?? []);

  const offset = Math.max(0, query.offset ?? 0);
  const limit = Math.max(0, query.limit ?? sorted.length);

  const rows = sorted.slice(offset, offset + limit);

  return { rows, total, limit, offset };
}
