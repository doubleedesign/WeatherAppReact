export default function Temperature(props) {
  return (
    <a class="today-temp">
      <div class="today-image-wrap">
        <img class="today-image" alt="" />
      </div>
      <span class="amount" data-temp-amount="{props.degrees}">
        {props.degrees}&deg;
      </span>
      <span class="units" data-temp-units="{props.units}">
        {props.units}
      </span>
    </a>
  );
}
