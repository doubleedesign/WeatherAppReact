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
			<Search parentCallback = {onCityChange}/>
			<Title city={city}/>
			<Today city={city}/>
			<Forecast city={city}/>
		</main>
	);
}