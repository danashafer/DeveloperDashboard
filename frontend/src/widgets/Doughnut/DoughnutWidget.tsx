import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import type { DatasetMap } from "../../query/queryRunner";
import { runQuery } from "../../query/queryRunner";
import { groupCount } from "../../query/aggregate";
import type { DoughnutWidgetConfig } from "./doughnut.types";
import { getPalette } from "../utils";

ChartJS.register(ArcElement, Tooltip, Legend);

type Props = {
  config: DoughnutWidgetConfig;
  data: DatasetMap;
};

export function DoughnutWidget({ config, data }: Props) {
  const points = useMemo(() => {
    const res = runQuery(data, {
      entity: config.query.entity,
      filter: config.query.filter,
    });

    let grouped = groupCount(res.rows, config.groupByField);

    grouped.sort((a, b) => b.value - a.value);

    const topN = config.topN ?? 8;
    if (grouped.length > topN) {
      const top = grouped.slice(0, topN);
      const rest = grouped.slice(topN);
      const otherValue = rest.reduce((sum, p) => sum + p.value, 0);
      grouped = [...top, { label: "Other", value: otherValue }];
    }

    return grouped;
  }, [config, data]);

  const chartData = useMemo(() => {
    const palette = getPalette();
    return {
      labels: points.map((p) => p.label),
      datasets: [
        {
          data: points.map((p) => p.value),
          backgroundColor: points.map((_, i) => palette[i % palette.length]),
        },
      ],
    };
  }, [points]);

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
        <div style={{ fontSize: 12, opacity: 0.7 }}>
          Grouped by {config.groupByField}
        </div>
      </div>

      <div style={{ height: 260 }}>
        <Doughnut data={chartData} options={{ maintainAspectRatio: false }} />
      </div>
    </div>
  );
}
