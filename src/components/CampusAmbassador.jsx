import { useCallback, useEffect, useState } from "react";
import "./CampusAmbassador.css";
import CarnivalBackdrop from "./CarnivalBackdrop";
import TicketingPartner from "./TicketingPartner";

const API_URL = "/api/event/dhwani-2026/leaderboard";
const MASCOT = "/assets/mascot/";

const MEDALS = { 1: "gold", 2: "silver", 3: "bronze" };
const PALETTE = ["#1F1D66", "#3731AB", "#9D34D1", "#AF005F", "#FABF01", "#005ED2", "#02CAEF"];

function Avatar({ seed }) {
  return <span className="ca-avatar" aria-hidden="true">{seed || "DC"}</span>;
}

/* Khai holds court in the right half of the hero, on a cloud of his own. */
function KhaiStage() {
  return (
    <div className="ca-hero__khai" aria-hidden="true">
      <img className="ca-khai-cloud ca-khai-cloud--l" src={MASCOT + "cloud-leftup.webp"} alt="" draggable="false" />
      <img className="ca-khai-cloud ca-khai-cloud--r" src={MASCOT + "cloud-rightup.webp"} alt="" draggable="false" />
      <img className="ca-khai-base" src={MASCOT + "cloud-main.webp"} alt="" draggable="false" />
      <img className="ca-khai" src={MASCOT + "khai-full.webp"} alt="" draggable="false" />
    </div>
  );
}

/* Top three get a podium; everyone else keeps the table. */
function Podium({ rows, showRevenue, formatPoints }) {
  return (
    <ol className="ca-podium" aria-label="Top three ambassadors">
      {rows.map(row => (
        <li
          key={`podium-${row.rank}-${row.name}`}
          className="ca-podium__step"
          data-medal={MEDALS[row.rank] ?? undefined}
        >
          <span className="ca-podium__rank" aria-hidden="true">{row.rank}</span>
          <Avatar seed={row.avatarSeed} />
          <span className="ca-podium__name">{row.name}</span>
          <span className="ca-podium__tally">
            <strong>{row.totalReferrals}</strong>
            <em>referrals</em>
          </span>
          {showRevenue && (
            <span className="ca-podium__points">
              {formatPoints(row.revenue)}
              <em>{row.revenueLabel ?? "points"}</em>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
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

  const showRevenue = Boolean(settings.showRevenue);
  const topThree = rows.slice(0, 3);
  /* A full podium reads 2-1-3 so the winner stands centre and tallest. */
  const podium = topThree.length === 3 ? [topThree[1], topThree[0], topThree[2]] : topThree;
  const rest = rows.slice(podium.length);

  return (
    <div className="campus-ambassador">
      <CarnivalBackdrop />
      <section className="ca-hero">
        <div className="ca-palette" aria-hidden="true">
          {PALETTE.map(color => <span key={color} style={{ background: color }} />)}
        </div>

        <div className="ca-hero__copy">
          <p className="ca-kicker">
            <img
              className="ca-emblem"
              src="/assets/logo/dhwani-icon.webp"
              alt=""
              draggable="false"
            />
            <span>Bring the carnival home</span>
          </p>
          <h1 className="ca-title">
            CAMPUS
            <span className="ca-title-em">AMBASSADOR</span>
          </h1>
          <p className="ca-subtitle">
            Rally your circle. Gather their passes. Climb the board.
            Every referral you bring to Dhwani&nbsp;'26 earns its place on this
            leaderboard — live.
          </p>
          <div className="ca-hero__stats">
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

        <KhaiStage />
      </section>

      <section className="ca-board" aria-label="Campus ambassador leaderboard">
        <div className="ca-board-head">
          <h2 className="ca-board-title">Leaderboard</h2>
          <p className="ca-live">
            <span className="ca-live__dot" aria-hidden="true" />
            Live
          </p>
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
          <>
            <Podium rows={podium} showRevenue={showRevenue} formatPoints={formatPoints} />
            {rest.length > 0 && (
              <div className="ca-table-wrap">
                <table className="ca-table">
                  <caption className="ca-table-caption">Chasing pack, rank {podium.length + 1} onwards</caption>
                  <thead>
                    <tr>
                      <th scope="col">Rank</th>
                      <th scope="col">Ambassador</th>
                      <th scope="col">Referrals</th>
                      {showRevenue && (
                        <th scope="col">{settings.revenueDisplayMode === "points" ? "Points" : "Revenue"}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {rest.map(row => (
                      <tr key={`${row.rank}-${row.name}`}>
                        <td data-label="Rank">
                          <span className="ca-rank">
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
                        {showRevenue && (
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
          </>
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
        <TicketingPartner href={platformUrl} className="ca-partner" />
      </section>
    </div>
  );
}