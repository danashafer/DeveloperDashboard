import type { FilterGroup, FilterRule } from "../../query/filter"

export type DoughnutWidgetConfig = {
id: string
type: "doughnut"
title: string
query: {
entity: string
filter?: FilterGroup | FilterRule | null
}
groupByField: string
topN?: number
}