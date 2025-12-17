export type PullRequest = {
  id: number;
  repo: string;
  title: string;
  author: string;
  state: "open" | "merged" | "closed";
  createdAt: string;
  mergedAt: string | null;
};

export const pullRequests: PullRequest[] = [
  {
    id: 1,
    repo: "frontend",
    title: "Add dashboard layout",
    author: "alice",
    state: "open",
    createdAt: "2025-01-02T10:12:00Z",
    mergedAt: null,
  },
  {
    id: 2,
    repo: "frontend",
    title: "Fix table sorting",
    author: "bob",
    state: "merged",
    createdAt: "2025-01-01T09:40:00Z",
    mergedAt: "2025-01-03T14:20:00Z",
  },
  {
    id: 3,
    repo: "backend",
    title: "Add query runner",
    author: "alice",
    state: "open",
    createdAt: "2025-01-04T08:05:00Z",
    mergedAt: null,
  },
  {
    id: 4,
    repo: "backend",
    title: "Refactor filters",
    author: "charlie",
    state: "closed",
    createdAt: "2024-12-28T16:30:00Z",
    mergedAt: null,
  },
  {
    id: 5,
    repo: "infra",
    title: "Update CI pipeline",
    author: "dana",
    state: "merged",
    createdAt: "2024-12-30T11:10:00Z",
    mergedAt: "2024-12-31T07:55:00Z",
  },
];
