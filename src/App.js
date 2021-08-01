import "./reset.css";
import "./style.css";

import Search from "./Search";
import Title from "./Title";
import Today from "./Today";
import Forecast from "./Forecast";
import React, {useState} from "react";

export default function App() {

	/**
	 * When a city is searched for, set the state so child components can pick it up
	 * Ref: https://www.geeksforgeeks.org/how-to-pass-data-from-one-component-to-other-component-in-reactjs/
	 */
	let [searchTerm, setSearchTerm] = useState('');
	function onSearchChange(searchedCity) {
		setSearchTerm(searchedCity);
	}

	/**
	 * The today component sends up some selected data from the weather query so it can be used by other components
	 * Here we update the state variables used by those components when new data is received
	 */
	let [city, setCity] = useState('');
	let [coords, setCoords] = useState('');
	let [tempRange, setTempRange] = useState('');
	function onWeatherChange(data) {

		// Display the returned city name rather than exactly what was searched
		setCity(data.city);

		// Set the coordinates of the city (used by the forecast)
		setCoords(data.coords);

		// Set the data-temp-range attribute for styling purposes
		if(data.temperature <= 15) {
			setTempRange('cold');
		}
		else if(data.temperature > 15 && data.temperature < 25 ) {
			setTempRange('fair');
		}
		else if(data.temperature >= 25 < 35) {
			setTempRange('warm');
		}
		else {
			setTempRange('hot');
		}
	}

	return (
		<div className="wrapper" data-temp-range={tempRange}>
			<main id="weather">
				<Search onSearch={onSearchChange} />
				<Title city={city} />
				<Today city={searchTerm} onWeatherUpdate={onWeatherChange} />
				<Forecast coords={coords} />
			</main>
		</div>
	);
}