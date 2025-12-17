type DoughnutPoint = { label: string; value: number };

function getByPath(obj: any, path: string): any {
  if (!obj || !path) return undefined;
  if (!path.includes(".")) return obj[path];
  return path
    .split(".")
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

export function groupCount(rows: any[], groupByField: string): DoughnutPoint[] {
  const map = new Map<string, number>();

  for (const r of rows) {
    const key = String(getByPath(r, groupByField) ?? "unknown");
    map.set(key, (map.get(key) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}
