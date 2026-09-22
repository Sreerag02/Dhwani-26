import { useCallback, useEffect, useState } from "react";
import "./CampusAmbassador.css";
import CarnivalBackdrop from "./CarnivalBackdrop";

const API_URL = "https://affiliates.makemypass.com/api/event/dhwani-2026/leaderboard";

const MEDALS = { 1: "gold", 2: "silver", 3: "bronze" };
const PALETTE = ["#1F1D66", "#3731AB", "#9D34D1", "#AF005F", "#FABF01", "#005ED2", "#02CAEF"];

function Avatar({ seed }) {
  return <span className="ca-avatar" aria-hidden="true">{seed || "DC"}</span>;
}

export default function CampusAmbassador() {
  const [state, setState] = useState({ status: "loading" });

  const load = useCallback(async (signal) => {
    setState({ status: "loading" });
    try {
      const res = await fetch(API_URL, { signal, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(`The leaderboard API responded with HTTP ${res.status}.`);
      const data = await res.json();
      setState({ status: "ok", data });
    } catch (err) {
      if (err?.name === "AbortError") return;
      setState({
        status: "error",
        error: err instanceof Error ? err.message : "Could not reach the leaderboard.",
      });
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  const { data } = state;
  const rows = data?.leaderboard ?? [];
  const settings = data?.meta?.settings ?? {};
  const total = data?.meta?.totalAmbassadors ?? 0;
  const updated = data?.meta?.generatedAt ? new Date(data.meta.generatedAt) : null;
  const platformUrl = data?.branding?.platformUrl ?? "https://affiliates.makemypass.com";

  const formatPoints = n =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

  return (
    <div className="campus-ambassador">
      <CarnivalBackdrop />
      <section className="ca-hero">
        <div className="ca-palette" aria-hidden="true">
          {PALETTE.map(color => <span key={color} style={{ background: color }} />)}
        </div>
        <img
          className="ca-emblem"
          src="/assets/logo/dhwani-icon.webp"
          alt="Dhwani '26 feather emblem"
          draggable="false"
        />
        <h1 className="ca-title">
          CAMPUS
          <span className="ca-title-em">AMBASSADOR</span>
        </h1>
        <p className="ca-subtitle">
          Rally your circle. Gather their passes. Climb the board.
          Every referral you bring to Dhwani&nbsp;'26 earns its place on this
          leaderboard — live.
        </p>
      </section>

      <section className="ca-board" aria-label="Campus ambassador leaderboard">
        <div className="ca-board-head">
          <h2 className="ca-board-title">Leaderboard</h2>
          <div className="ca-board-stats">
            <span className="ca-stat">
              <strong className="ca-stat-num">{total}</strong>
              <span className="ca-stat-label">Ambassadors</span>
            </span>
            <span className="ca-stat">
              <strong className="ca-stat-num">{rows[0]?.name ?? "—"}</strong>
              <span className="ca-stat-label">At the top</span>
            </span>
          </div>
        </div>

        {state.status === "loading" && (
          <div className="ca-status" role="status" aria-live="polite">
            <span className="ca-spinner" aria-hidden="true" />
            <p className="ca-status-text">Rallying the leaderboard…</p>
          </div>
        )}

        {state.status === "error" && (
          <div className="ca-status" role="alert">
            <p className="ca-error">Couldn't load the leaderboard. {state.error}</p>
            <p className="ca-error-hint">The public rankings service might be briefly unreachable.</p>
            <button type="button" className="ca-retry" onClick={() => load()}>Try again</button>
          </div>
        )}

        {state.status === "ok" && rows.length > 0 && (
          <div className="ca-table-wrap">
            <table className="ca-table">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">Ambassador</th>
                  <th scope="col">Referrals</th>
                  {settings.showRevenue && (
                    <th scope="col">{settings.revenueDisplayMode === "points" ? "Points" : "Revenue"}</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={`${row.rank}-${row.name}`} className={row.rank <= 3 ? "ca-row--top" : undefined}>
                    <td data-label="Rank">
                      <span className="ca-rank" data-medal={MEDALS[row.rank] ?? undefined}>
                        <em>{row.rank}</em>
                      </span>
                    </td>
                    <td data-label="Ambassador">
                      <span className="ca-name">
                        <Avatar seed={row.avatarSeed} />
                        {row.name}
                      </span>
                    </td>
                    <td data-label="Referrals">
                      <span className="ca-referrals">{row.totalReferrals}</span>
                    </td>
                    {settings.showRevenue && (
                      <td data-label={settings.revenueDisplayMode === "points" ? "Points" : "Revenue"}>
                        <span className="ca-points">{formatPoints(row.revenue)}</span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {state.status === "ok" && rows.length === 0 && (
          <div className="ca-status">
            <p className="ca-status-text">No ranks listed yet. Be the first to claim the top spot.</p>
          </div>
        )}

        <p className="ca-board-foot">
          <span>{updated ? `Last updated ${updated.toLocaleString()}` : "Live rankings"}</span>
          <a href={platformUrl} target="_blank" rel="noreferrer">Program & master list →</a>
        </p>
      </section>
    </div>
  );
}