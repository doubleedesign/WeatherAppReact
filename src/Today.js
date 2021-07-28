import Time from "./Time";
import Temperature from "./Temperature";
import Details from "./Details";

export default function Today() {
  return (
    <div id="today">
      <div class="today-text">
        <Time />
        <Temperature degrees="20" units="C" />
        <Details description="Sunny" humidity="50" wind="5" />
      </div>
    </div>
  );
}
