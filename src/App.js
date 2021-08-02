import "./reset.css";
import "./style.css";

import React, {useEffect, useState, useRef} from "react";
import Search from "./Search";
import Title from "./Title";
import Today from "./Today";
import Forecast from "./Forecast";
import axios from "axios";
import CryptoJS from "crypto-js";

export default function App() {
	let [searchTerm, setSearchTerm] = useState('');
	let [city, setCity] = useState('');
	let [coords, setCoords] = useState('');
	let [tempRange, setTempRange] = useState('');
	let [backgroundImage, setBackgroundImage] = useState('');

	/**
	 * When a city is searched for, set the state so child components can pick it up
	 * Ref: https://www.geeksforgeeks.org/how-to-pass-data-from-one-component-to-other-component-in-reactjs/
	 */
	function onSearchChange(searchedCity) {
		setSearchTerm(searchedCity);
	}

	/**
	 * The today component sends up some selected data from the weather query so it can be used by other components
	 * Here we update the state variables used by those components when new data is received
	 */
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
		 * Get and show new background image when the city changes
		 */
		useEffect(() => {
			if (didMount.current) {
				getImageForCity(city).then(response => {
					setBackgroundImage(response);
				});
			} else {
				didMount.current = true;
			}
		}, [city]);
	}
	useDidMountEffect();

	/**
	 * Query Wikimedia Commons for an image of a given city
	 * @param city
	 * @returns {Promise<AxiosResponse<any>>}
	 */
	async function getImageForCity(city) {
		const query = `https://commons.wikimedia.org/w/api.php?action=query&prop=images&imlimit=500&redirects=1&titles=${city}&origin=*&format=json`;
		let imageUrl = '';

		/**
		 * Set and perform API query to get images from Wikimedia for the city
		 * See Today.js for more notes about queries in useEffect hook
		 */
		return axios.get(query)
			.then(response => {
				// The key that the images are under varies for each city,
				// so dig down to the right object and use Object.entries to find the images so that the city key doesn't matter
				let object = response.data.query.pages;
				//return response.data.query.pages;
				let images = Object.entries(object)[0][1].images; // returns a list of file paths

				if(images) {
					// Choose a random one from the returned list and adjust the text string to what we need
					let randomIndex = getRandomInt(0, images.length);
					let imageFile = (images[randomIndex].title)
						.replace('File:', '')
						.replace(/ /g, '_');

					// Build the URL from the file information
					// Ref: https://stackoverflow.com/a/33691240
					let imageHash = CryptoJS.MD5(imageFile).toString();
					imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${imageHash.charAt(0)}/${imageHash.charAt(0)}${imageHash.charAt(1)}/${imageFile}`;
				}
				else {
					console.log(`No image found for ${city}`);
				}

				// Return imageUrl - URL if one was found, empty if nothing found for this city
				return imageUrl;

			}).catch(error => {
				console.log(error);
			})
	}

	/**
	 * Utility function to get a random integer in a range
	 * @param min
	 * @param max
	 * @returns {number}
	 */
	function getRandomInt(min, max) {
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}


	return (
		<div className="wrapper" data-temp-range={tempRange} style={{backgroundImage:`url(${backgroundImage})`}}>
			<main id="weather">
				<Search onSearch={onSearchChange} />
				<Title city={city} />
				<Today city={searchTerm} onWeatherUpdate={onWeatherChange} />
				<Forecast coords={coords} />
			</main>
		</div>
	);
}