import type { DatasetMap } from "../query/queryRunner";
import { DoughnutWidget } from "../widgets/Doughnut/DoughnutWidget";
import type { DoughnutWidgetConfig } from "../widgets/Doughnut/types";
import { TableWidget } from "../widgets/table/TableWidget";
import type { TableWidgetConfig } from "../widgets/table/table.types";

export type WidgetConfig = TableWidgetConfig | DoughnutWidgetConfig;

type Props = {
  widget: WidgetConfig;
  data: DatasetMap;
};

export function WidgetRenderer({ widget, data }: Props) {
  switch (widget.type) {
    case "table":
      return <TableWidget config={widget} data={data} />;
    case "doughnut":
      return <DoughnutWidget config={widget} data={data} />;
    default:
      return (
        <div
          style={{ padding: 16, border: "1px solid #e5e7eb", borderRadius: 12 }}
        >
          Unknown widget type: {String((widget as any)?.type)}
        </div>
      );
  }
}
