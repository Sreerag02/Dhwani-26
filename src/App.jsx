import ScrollExperience from "./sections/ScrollExperience";
import { MerchKit } from "./sections/Merch";

export default function App() {
  return (
    <main className="dhwani-site">
      <ScrollExperience />
      <section className="after-merch" aria-label="Merch kit">
        <MerchKit />
      </section>
    </main>
  );
}