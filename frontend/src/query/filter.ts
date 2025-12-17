export type FilterOp =
  | "eq"
  | "neq"
  | "in"
  | "contains"
  | "startsWith"
  | "endsWith"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "between"
  | "isNull"
  | "notNull";

export type FilterRule = {
  field: string;
  op: FilterOp;
  value?: any;
};

export type FilterGroup = {
  combinator: "and" | "or";
  rules: Array<FilterRule | FilterGroup>;
};

function isGroup(x: any): x is FilterGroup {
  return x && typeof x === "object" && Array.isArray(x.rules) && !!x.combinator;
}

function getByPath(obj: any, path: string): any {
  if (!obj) return undefined;
  if (!path) return undefined;
  if (!path.includes(".")) return obj[path];
  return path
    .split(".")
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
}

function toLowerSafe(v: any): string {
  return String(v ?? "").toLowerCase();
}

function compare(op: FilterOp, left: any, right: any): boolean {
  switch (op) {
    case "eq":
      return left === right;
    case "neq":
      return left !== right;
    case "in":
      return Array.isArray(right) && right.includes(left);
    case "contains":
      return toLowerSafe(left).includes(toLowerSafe(right));
    case "startsWith":
      return toLowerSafe(left).startsWith(toLowerSafe(right));
    case "endsWith":
      return toLowerSafe(left).endsWith(toLowerSafe(right));
    case "gt":
      return Number(left) > Number(right);
    case "gte":
      return Number(left) >= Number(right);
    case "lt":
      return Number(left) < Number(right);
    case "lte":
      return Number(left) <= Number(right);
    case "between": {
      if (!Array.isArray(right) || right.length < 2) return true;
      const a = Number(right[0]);
      const b = Number(right[1]);
      const n = Number(left);
      return n >= a && n <= b;
    }
    case "isNull":
      return left === null || left === undefined;
    case "notNull":
      return left !== null && left !== undefined;
    default:
      return true;
  }
}

export function matchesRule(row: any, rule: FilterRule): boolean {
  const left = getByPath(row, rule.field);
  return compare(rule.op, left, rule.value);
}

export function matchesFilter(
  row: any,
  filter?: FilterGroup | FilterRule | null
): boolean {
  if (!filter) return true;

  if (isGroup(filter)) {
    const results = filter.rules.map((r) => matchesFilter(row, r as any));
    if (filter.combinator === "and") return results.every(Boolean);
    return results.some(Boolean);
  }

  return matchesRule(row, filter);
}

export function applyFilters<T>(
  rows: T[],
  filter?: FilterGroup | FilterRule | null
): T[] {
  if (!filter) return rows;
  return rows.filter((r) => matchesFilter(r, filter));
}

// const f1: FilterRule = { field: "state", op: "eq", value: "open" }

// const f2: FilterGroup = {
// combinator: "and",
// rules: [
// { field: "repo", op: "eq", value: "my-repo" },
// {
// combinator: "or",
// rules: [
// { field: "state", op: "eq", value: "open" },
// { field: "state", op: "eq", value: "merged" },
// ],
// },
// ],
// }
