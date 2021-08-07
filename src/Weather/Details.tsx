import React from "react";

import "./_Details.scss";

export default function Details(props) {
	return (
		<ul className="details">
			<li className="details__item"><span className="details__item__description">{props.description}</span></li>
			<li className="details__item">Humidity: <span className="details__humidity">{props.humidity}</span>%</li>
			<li className="details__item">Wind: <span className="details__wind">{props.wind}</span>km/h</li>
		</ul>
	);
}
