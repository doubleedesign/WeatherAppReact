import React, {Fragment, useEffect, useState, useRef} from "react";
import DateTime from "../DateTime/DateTime";
import Temperature from "./Temperature";
import Details from "./Details";
import axios from "axios";

import "./_Today.scss";

export default function Today(props) {
	const apiKey = 'f4f65838c4d2f2b467cb557338c7cc7c';
	let [weather, setWeather] = useState(null); // See Temperature.js for notes about using state

	/**
	 * Create and use useDidMountEffect hook with useRef
	 * for useEffect stuff that we do not want to run on first render
	 * Ref: https://thewebdev.info/2021/03/13/how-to-make-the-react-useeffect-hook-not-run-on-initial-render/
	 * @param func
	 * @param deps
	 */
	const useDidMountEffect = (func, deps) => {
		const didMount = useRef(false);

		/**
		 * Update the weather when the city changes
		 * This is done inside useEffect so it only re-runs if certain values have changed (in this case, props.city)
		 * otherwise the API query runs in an infinite loop and we have a bad time.
		 */
		useEffect(() => {
			if (didMount.current) {
				getWeatherForCity(props.city);
			} else {
				didMount.current = true;
			}
		}, [props.city]);
	}
	useDidMountEffect();

	/**
	 * Second useEffect hook to send the temperature and returned city name up to the parent component after the weather state variable updates.
	 * Can't do this in the same useEffect as the query because the weather variable still contains the previous data then.
	 *
	 * Why send the returned city name given the user just typed the city in, you ask?
	 * The user could type in lowercase, could need to type a qualifier (e.g. need to use 'Melbourne AU' or else you get Melbourne Florida)
	 * Using the returned one ensures the output is written as expected in the title component
	 */
	useEffect(() => {
		if(weather) {
			let data = {
				city: weather.name,
				country: weather.sys.country,
				coords: weather.coord,
				temperature: Math.round(weather.main.temp)
			}
			props.onWeatherUpdate(data);
		}
	}, [weather])

	/**
	 * Set and perform API query to get the weather for a given city
	 * and save it in the state variable
	 * @param city
	 */
	function getWeatherForCity(city) {
		let query = `https://api.openweathermap.org/data/2.5/weather?q=${props.city}&appid=${apiKey}&units=metric`;
		axios.get(query)
			// Update component state when an API response is received
			// Catch and log error if there is one
			.then(response => {
				setWeather(response.data);
				/**
				 * NOTES:
				 * sending weather.main.temp up to the parent via
				 * props.onWeatherUpdate(Math.round(weather.main.temp)) doesn't work here,
				 * because the weather variable still contains the previous data even though it was just set...
				 * Sending the response data directly works, e.g. response.data.weather.main.temp,
				 * but I thought it was better to try to work out how to get it from the weather variable at the right time
				 **/
			}).catch(error => {
				console.log(error);
				alert('Sorry, couldn\'t find that city. Please try again');
			})
	}

	/**
	 * Put output in a variable so it can be shown conditionally
	 * (in the component's return statement)
	 * Ref: https://stackoverflow.com/a/24534492
	 * @returns {*}
	 * @constructor
	 */
	let Output = () => (
		<section className="today row">
			<div className="today__text">
				<Temperature degrees={Math.round(weather.main.temp)}
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

	/**
	 * Output - only shown when weather exists
	 * Ref: https://stackoverflow.com/a/24534492
	 */
	return (
		<Fragment>
			{weather ? <Output/> : null}
		</Fragment>
	)
}
