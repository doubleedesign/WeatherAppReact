import "./reset.css";
import "./style.css";

import Search from "./Search";
import Title from "./Title";
import Today from "./Today";
import Forecast from "./Forecast";
import React, {useState} from "react";

export default function App() {
	let [city, setCity] = useState('');

	// When a city is searched for, set the state so child components can pick it up
	// Ref: https://www.geeksforgeeks.org/how-to-pass-data-from-one-component-to-other-component-in-reactjs/
	function onCityChange(searchedCity) {
		setCity(searchedCity);
	}

	return (
		<main id="weather">
			<section className="row">
				<Search parentCallback = {onCityChange}/>
			</section>
			<section className="row">
				<Title city={city}/>
			</section>
			<section className="row">
				<Today city={city}/>
			</section>
			<section className="row">
				<Forecast city={city}/>
			</section>
		</main>
	);
}