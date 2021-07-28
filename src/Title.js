export default function Title(props) {
  return (
    <h1>
      Today in <strong id="city-name">{props.city}</strong>
    </h1>
  );
}
