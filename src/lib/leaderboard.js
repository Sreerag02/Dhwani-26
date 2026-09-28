const number = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const text = (value, fallback) => typeof value === "string" && value.trim() ? value.trim() : fallback;

export function normalizeLeaderboard(data) {
  if (data?.topAmbassadors != null && !Array.isArray(data.topAmbassadors)) {
    throw new Error("Invalid leaderboard data");
  }
  const rows = (data?.topAmbassadors ?? [])
    .filter(row => row && typeof row === "object")
    .map(row => {
      const name = text(row.name, "Ambassador");
      return {
        name,
        college: text(row.college, "—"),
        points: number(row.points),
        tickets: number(row.tickets),
        avatarSeed: name.split(/\s+/).slice(0, 2).map(part => part[0]).join("").toUpperCase(),
      };
    })
    // Stable sorting preserves the published order for equal points.
    .sort((a, b) => b.points - a.points)
    .map((row, index) => ({ ...row, rank: index + 1 }));

  const timestamp = data?.lastUpdated;
  const date = timestamp == null ? null
    : typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
  return { rows, updated: date && Number.isFinite(date.getTime()) ? date : null };
}
