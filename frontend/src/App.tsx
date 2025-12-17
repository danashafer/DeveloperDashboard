import "./App.css";

import { WidgetRenderer } from "./components/WidgetRenderer";
import { mockDataset } from "./data/mock/dataset";

function App() {
  const widget = {
    id: "table-1",
    type: "table",
    title: "Open Pull Requests",
    query: {
      entity: "pull_request",
      filter: {
        field: "state",
        op: "neq",
        value: "open",
      },
      sort: [{ field: "createdAt", dir: "desc" }],
      limit: 10,
      offset: 0,
    },
    columns: [
      { field: "id", label: "ID" },
      { field: "title", label: "Title" },
      { field: "author", label: "Author" },
      { field: "repo", label: "Repo" },
      { field: "state", label: "State" },
      { field: "createdAt", label: "Created" },
    ],
  };

  const prByRepoDoughnut = {
    id: "d1",
    type: "doughnut",
    title: "Open PRs by Repo",
    query: {
      entity: "pull_request",
      filter: { field: "state", op: "eq", value: "open" },
    },
    groupByField: "repo",
    topN: 6,
  };

  return (
    <>
      <div style={{ display: "grid", gap: 12 }}>
        <WidgetRenderer widget={widget} data={mockDataset} />
        <WidgetRenderer widget={prByRepoDoughnut} data={mockDataset} />
      </div>
    </>
  );
}

export default App;
