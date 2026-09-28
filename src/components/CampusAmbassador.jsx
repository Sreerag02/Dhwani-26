import { useEffect, useState } from "react";
import "./CampusAmbassador.css";
import CarnivalBackdrop from "./CarnivalBackdrop";
import TicketingPartner from "./TicketingPartner";

import { doc, getDocFromServer, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";
import { normalizeLeaderboard } from "../lib/leaderboard";

const MASCOT = "/assets/mascot/";
const MEDALS = { 1: "gold", 2: "silver", 3: "bronze" };
const PALETTE = ["#1F1D66", "#3731AB", "#9D34D1", "#AF005F", "#FABF01", "#005ED2", "#02CAEF"];

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

export default function CampusAmbassador() {
  const [state, setState] = useState({ status: "loading" });

  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;
    let receivedData = false;
    const reference = doc(db, "public_data", "leaderboard");

    const receive = snapshot => {
      // An empty local cache does not mean the published document is missing.
      if (!active || snapshot.metadata.fromCache) return;
      if (!snapshot.exists()) {
        setState({ status: "unpublished" });
        return;
      }
      try {
        const data = normalizeLeaderboard(snapshot.data());
        receivedData = true;
        setState({ status: "ok", data });
      } catch {
        setState({ status: "error", error: "The published leaderboard could not be read." });
      }
    };

    // Fetch independently of the live stream so an interrupted listener does
    // not leave visitors looking at a stale empty state.
    getDocFromServer(reference).then(receive).catch(error => {
      console.error("Error fetching campus ambassador leaderboard:", error);
      if (active && !receivedData) {
        setState({ status: "error", error: "Please try again in a moment." });
      }
    });
    const unsubscribe = onSnapshot(reference, { includeMetadataChanges: true }, receive, error => {
      console.error("Error listening to campus ambassador leaderboard:", error);
    });
    return () => {
      active = false;
      unsubscribe();
    };
  }, [attempt]);

  const refresh = () => {
    setState({ status: "loading" });
    setAttempt(value => value + 1);
  };

  const rows = state.data?.rows ?? [];
  const total = state.status === "ok" ? rows.length : "—";
  const updated = state.data?.updated;

  const formatPoints = n =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

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
              <strong className="ca-stat-num">{rows[0]?.caCode ?? "—"}</strong>
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
            <button type="button" className="ca-retry" onClick={refresh}>Try again</button>
          </div>
        )}

        {state.status === "ok" && rows.length > 0 && (
          <div className="ca-table-wrap">
            <table className="ca-table">
              <thead>
                <tr>
                  <th scope="col">Rank</th>
                  <th scope="col">CA Code</th>
                  <th scope="col">Tickets</th>
                  <th scope="col" aria-sort="descending">Points</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(row => (
                  <tr key={`${row.rank}-${row.caCode}`} className={row.rank <= 3 ? "ca-row--top" : undefined}>
                    <td data-label="Rank">
                      <span className="ca-rank" data-medal={MEDALS[row.rank] ?? undefined}>
                        <em>{row.rank}</em>
                      </span>
                    </td>
                    <td data-label="CA Code">
                      <span className="ca-name">
                        {row.caCode}
                      </span>
                    </td>
                    <td data-label="Tickets">
                      <span className="ca-referrals">{formatPoints(row.tickets)}</span>
                    </td>
                    <td data-label="Points">
                      <span className="ca-points">{formatPoints(row.points)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {state.status === "unpublished" && (
          <div className="ca-status" role="status">
            <p className="ca-status-text">The leaderboard hasn't been published yet. Rankings will appear here once available.</p>
          </div>
        )}

        {state.status === "ok" && rows.length === 0 && (
          <div className="ca-status">
            <p className="ca-status-text">No ranks listed yet. Be the first to claim the top spot.</p>
          </div>
        )}

        <p className="ca-board-foot">
          <span>{updated ? `Last updated ${updated.toLocaleString()}` : "Live rankings"}</span>
          <span>Ranked by points · Highest first</span>
          <button type="button" className="ca-retry" onClick={refresh} disabled={state.status === "loading"}>
            {state.status === "loading" ? "Refreshing…" : "Refresh rankings"}
          </button>
        </p>
        <TicketingPartner className="ca-partner" />
      </section>
    </div>
  );
}
