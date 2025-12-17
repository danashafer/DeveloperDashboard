import { useMemo } from "react";
import type { DatasetMap } from "../../query/queryRunner";
import { runQuery } from "../../query/queryRunner";
import type { TableWidgetConfig } from "./types";

function getByPath(obj: any, path: string): any {
  if (!obj) return undefined;
  if (!path) return undefined;
  if (!path.includes(".")) return obj[path];
  return path
    .split(".")
    .reduce((acc, key) => (acc == null ? undefined : acc[key]), obj);
} 

type Props = {
  config: TableWidgetConfig;
  data: DatasetMap;
};

export function TableWidget({ config, data }: Props) {
  const result = useMemo(() => {
    return runQuery(data, {
      entity: config.query.entity,
      filter: config.query.filter,
      sort: config.query.sort,
      limit: config.query.limit ?? 10,
      offset: config.query.offset ?? 0,
    });
  }, [config, data]);

  return (
    <div style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 600 }}>{config.title}</div>
        <div style={{ fontSize: 12, opacity: 0.7 }}>{result.total} rows</div>
      </div>

      <div style={{ overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {config.columns.map((c) => (
                <th
                  key={c.field}
                  style={{
                    textAlign: "left",
                    fontSize: 12,
                    padding: "8px 10px",
                    borderBottom: "1px solid #e5e7eb",
                    whiteSpace: "nowrap",
                  }}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {result.rows.map((row: any, i: number) => (
              <tr key={row.id ?? i}>
                {config.columns.map((c) => (
                  <td
                    key={c.field}
                    style={{
                      fontSize: 12,
                      padding: "8px 10px",
                      borderBottom: "1px solid #f0f0f0",
                      whiteSpace: "nowrap",
                    }}
                    title={String(getByPath(row, c.field) ?? "")}
                  >
                    {String(getByPath(row, c.field) ?? "")}
                  </td>
                ))}
              </tr>
            ))}

            {!result.rows.length && (
              <tr>
                <td
                  colSpan={config.columns.length}
                  style={{ fontSize: 12, padding: 12, opacity: 0.7 }}
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
