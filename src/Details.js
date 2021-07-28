export default function Details(props) {
  return (
    <ul class="today-details">
      <li>
        <span class="today-description">{props.description}</span>
      </li>
      <li>
        Humidity: <span class="today-humidity">{props.humidity}</span>%
      </li>
      <li>
        Wind: <span class="today-wind">{props.wind}</span>km/h
      </li>
    </ul>
  );
}
