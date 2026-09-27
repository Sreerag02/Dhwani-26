import "./CampusAmbassador.css";
import CarnivalBackdrop from "../components/CarnivalBackdrop";
import TicketingPartner from "../components/TicketingPartner";

const MASCOT = "/assets/mascot/";

export default function CampusAmbassador() {
  return (
    <section id="campus-ambassador" className="campus-amb" aria-label="Campus Ambassador">
      <CarnivalBackdrop />
      <div className="campus-amb__stage">
        <div className="campus-amb__copy">
          <p className="campus-amb__kicker">Bring the carnival home</p>
          <h2 className="campus-amb__title">CAMPUS AMBASSADOR</h2>
          <p className="campus-amb__text">
            Every pass your college buys moves you up a live board. Khai is
            keeping score.
          </p>
          <a className="campus-amb__cta" href="/campus-ambassador">View Leaderboard</a>
          <TicketingPartner className="campus-amb__partner" />
        </div>
        <div className="campus-amb__khai" aria-hidden="true">
          <img className="campus-amb__cloud campus-amb__cloud--l" src={MASCOT + "cloud-leftup.webp"} alt="" draggable="false" />
          <img className="campus-amb__cloud campus-amb__cloud--r" src={MASCOT + "cloud-rightup.webp"} alt="" draggable="false" />
          <img className="campus-amb__base" src={MASCOT + "cloud-main.webp"} alt="" draggable="false" />
          <img className="campus-amb__mascot" src={MASCOT + "khai-full.webp"} alt="" draggable="false" />
        </div>
      </div>
    </section>
  );
}
