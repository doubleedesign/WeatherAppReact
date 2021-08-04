import React from "react";

export default function Details(props) {
	return (
		<ul className="today-details">
			<li><span className="today-description">{props.description}</span></li>
			<li>Humidity: <span className="today-humidity">{props.humidity}</span>%</li>
			<li>Wind: <span className="today-wind">{props.wind}</span>km/h</li>
		</ul>
	);
}
