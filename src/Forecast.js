import React, {Fragment, useEffect, useState, useRef} from 'react';
import axios from "axios";

export default function Forecast(props) {
	const apiKey = 'f4f65838c4d2f2b467cb557338c7cc7c';
	let [forecast, setForecast] = useState(null); // See Temperature.js for notes about using state

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
		 * Update the forecast when the city changes
		 * This is done inside useEffect so it only re-runs if certain values have changed (in this case, props.coords)
		 */
		useEffect(() => {
			if (didMount.current) {
				getForecastForCity(props.coords)
			} else {
				didMount.current = true;
			}
		}, [props.coords]);
	}
	useDidMountEffect();

	/**
	 * Set and perform API query to get the forecast for a given city
	 * and save it in the state variable
	 * Note: Forecast query requires coordinates, not city name
	 * @param coords
	 */
	function getForecastForCity(coords) {
		let query = `https://api.openweathermap.org/data/2.5/onecall?lat=${props.coords.lat}&lon=${props.coords.lon}&appid=${apiKey}&units=metric&exclude=current,hourly,minutely,alerts`;

		axios.get(query)
			// Update component state when an API response is received
			// Catch and log error if there is one
			.then(response => {

				// Slice the returned data down to only the first five days
				let fullData = response.data.daily;
				fullData = fullData.slice(0, 5);

				// Loop through the returned data and put just what we want into an object
				let summaryData = {};
				{fullData.map((value, index) => {
					// Get current timezone offset
					let today = new Date();
					let offset = today.getTimezoneOffset();

					// Get the forecast day's unix timestamp from the returned data
					let timestamp = value.dt;

					// Get the day of that timestamp taking the timezone offset into account
					let date = new Date((timestamp * 1000) + (offset * 60 * 1000));
					let dayNo = date.getDay();
					let day = getDayAbbrev(dayNo);

					// Add this forecast day's data to the summary
					summaryData[day] = {
						min: Math.round(value.temp.min),
						max: Math.round(value.temp.max),
						imageUrl: `http://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`
					}
				})}

				// Update the forecast state variable with our customised data object
				setForecast(summaryData);

			}).catch(error => {
				console.log(error);
			})
	}

	/**
	 * Utility function to convert the day number to its 3-letter abbreviation
	 * @param number
	 * @returns {string}
	 */
	function getDayAbbrev(number) {
		let day = '';
		switch(number) {
			case 0:
				day = 'Sun';
				break;
			case 1:
				day = 'Mon';
				break;
			case 2:
				day = 'Tue';
				break;
			case 3:
				day = 'Wed';
				break;
			case 4:
				day = 'Thu';
				break;
			case 5:
				day = 'Fri';
				break;
			case 6:
				day = 'Sat';
				break;
			default:
				break;
		}

		return day;
	}

	/**
	 * Put output in a variable so it can be shown conditionally
	 * (in the component's return statement)
	 * Ref: https://stackoverflow.com/a/24534492
	 * Can't use Fragment here for some reason...?
	 * @returns {*}
	 * @constructor
	 */
	const Output = () => {
		return <section id="forecast" className="row">
			{ /** Loop through the forecast items and add each one to the page */}
			{Object.keys(forecast).map(day => (
				<div className="forecast-item">
					<span className="forecast-item-day">{day}</span>
					<img src={forecast[day].imageUrl} alt=""/>
					<span className="forecast-item-min">Low<strong>{forecast[day].min}&deg;</strong></span>
					<span className="forecast-item-max">High<strong>{forecast[day].max}&deg;</strong></span>
				</div>
			))}
		</section>;
	}

	/**
	 * Output - only shown when forecast exists
	 * Ref: https://stackoverflow.com/a/24534492
	 */
	return (
		<Fragment>
			{forecast ? <Output/> : null}
		</Fragment>
	);
}
