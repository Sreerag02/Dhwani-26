import "./ComingSoon.css";

const E = "/assets/elements/";
const lanterns = [
  ["L1.svg", "cs-lamp-a"], ["L2.svg", "cs-lamp-b"], ["L3.svg", "cs-lamp-c"],
  ["L4.svg", "cs-lamp-d"], ["L2.svg", "cs-lamp-e"],
];

export default function ComingSoon() {
  return (
    <section id="coming-soon" className="coming-soon" aria-label="Coming soon">
      <div className="coming-soon__stage">
        {/* <img src={E + "theme-cloud.png"} alt="" className="coming-soon__cloud coming-soon__cloud--a cs-float" draggable="false" />
        <img src={E + "theme-cloud.png"} alt="" className="coming-soon__cloud coming-soon__cloud--b cs-float" draggable="false" /> */}
        {lanterns.map(([file, pos]) => (
          <img key={pos} src={E + file} alt="" className={"coming-soon__lamp " + pos + " cs-float"} draggable="false" />
        ))}
        <img src="/assets/logo/dhwani-main.png" alt="Dhwani '26" className="coming-soon__logo" />
        {/* <h2 className="coming-soon__title">Coming Soon</h2> */}
        <p className="coming-soon__text">More of the Carnivale Razzmatazz is on its way.</p>
      </div>
    </section>
  );
}