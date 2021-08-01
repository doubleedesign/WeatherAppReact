import React, {Fragment, useEffect, useState} from "react";
import Time from "./Time";
import Temperature from "./Temperature";
import Details from "./Details";
import axios from "axios";

export default function Today(props) {
	const apiKey = 'f4f65838c4d2f2b467cb557338c7cc7c';
	let [weather, setWeather] = useState(null);

	// Set and perform API query
	// This is done inside useEffect so it only re-runs if certain values have changed (in this case, props.city)
	// otherwise it runs in an infinite loop and we have a bad time
	useEffect(() => {
		if (props.city) {
			let query = `https://api.openweathermap.org/data/2.5/weather?q=${props.city}&appid=${apiKey}&units=metric`;
			axios.get(query)
				// Update component state when an API response is received
				// Catch and log error if there is one
				.then(response => {
					setWeather(response.data)
				}).catch(error => {
					console.log(error);
				})
		}
	}, [props.city])

	// Put output in a variable so it can be shown conditionally
	// (in the component's return statement)
	// Ref: https://stackoverflow.com/a/24534492
	let Output = () => (
		<section id="today" className="row">
			<div className="today-text">
				<Time/>
				<Temperature degrees={weather.main.temp}
							 units="C"
							 imageUrl={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
							 imageAlt={weather.weather[0].description}
				/>
				<Details description={weather.weather[0].description}
						 humidity={weather.main.humidity}
						 wind={weather.wind.speed}
				/>
			</div>
		</section>
	)

	// Render the component if weather is set
	return (
		<Fragment>
			{weather ? <Output/> : null}
		</Fragment>
	)
}
