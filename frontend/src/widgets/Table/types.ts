export type TableColumn = {
  field: string;
  label: string;
};

export type TableWidgetConfig = {
  id: string;
  type: "table";
  title: string;
  query: {
    entity: string;
    // filter?: FilterGroup | FilterRule | null
    // sort?: SortSpec[]
    limit?: number;
    offset?: number;
  };
  columns: TableColumn[];
};
