import "./TicketingPartner.css";

const LOGO = "/assets/partners/makemypass-logo-green-MzJ-s8F3.svg";
const DEFAULT_HREF = "https://makemypass.com";

/*
 * MakeMyPass credit. The logo mixes a bright green wordmark with a near-black
 * mark, so it always sits on a light chip — on the festival's dark panels the
 * dark half would otherwise disappear.
 */
export default function TicketingPartner({ href = DEFAULT_HREF, className = "" }) {
  return (
    <p className={`ticketing-partner${className ? ` ${className}` : ""}`}>
      <span className="ticketing-partner__label">Ticketing partner</span>
      <a
        className="ticketing-partner__mark"
        href={href}
        target="_blank"
        rel="noreferrer"
        aria-label="MakeMyPass, official ticketing partner"
      >
        <img src={LOGO} alt="MakeMyPass" width="89" height="32" decoding="async" />
      </a>
    </p>
  );
}
