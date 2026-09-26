import "./CampusAmbassador.css";
import CarnivalBackdrop from "../components/CarnivalBackdrop";

export default function CampusAmbassador() {
  return (
    <section id="campus-ambassador" className="campus-amb" aria-label="Campus Ambassador">
      <CarnivalBackdrop />
      <div className="campus-amb__stage">
        <p className="campus-amb__kicker">Bring the carnival home</p>
        <h2 className="campus-amb__title">CAMPUS AMBASSADOR</h2>
        <a className="campus-amb__cta" href="/campus-ambassador">View Leaderboard</a>
      </div>
    </section>
  );
}