const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;

export function normalizeLeaderboard(data) {
  if (data?.topAmbassadors != null && !Array.isArray(data.topAmbassadors)) {
    throw new Error("Invalid leaderboard data");
  }
  const rows = (data?.topAmbassadors ?? [])
    .filter(row => row && typeof row === "object")
    .map(row => ({
      points: number(row.points),
      tickets: number(row.tickets),
    }))
    // Stable sorting preserves the published order for equal points.
    .sort((a, b) => b.points - a.points)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const timestamp = data?.lastUpdated;
  const date = timestamp == null ? null
    : typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  return { rows, updated: date && Number.isFinite(date.getTime()) ? date : null };
}
