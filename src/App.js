import "./reset.css";
import "./style.css";

import Search from "./Search";
import Title from "./Title";
import Today from "./Today";
import Forecast from "./Forecast";

export default function App() {
  return (
    <main id="weather">
      <section class="row">
        <Search />
      </section>
      <section class="row">
        <Title city="New York" />
      </section>
      <section class="row">
        <Today />
      </section>
      <section class="row">
        <Forecast />
      </section>
    </main>
  );
}
