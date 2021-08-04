import React, {Fragment, useEffect, useState, useRef} from "react";
import axios from "axios";
import Article from "./Article"

export default function News(props) {
	let [news, setNews] = useState(null);

	/**
	 * Create and use useDidMountEffect hook with useRef
	 * for useEffect stuff that we do not want to run on first render
	 * Ref: https://thewebdev.info/2021/03/13/how-to-make-the-react-useeffect-hook-not-run-on-initial-render/
	 * @param func
	 * @param deps
	 */
	const useDidMountEffect = (func, deps) => {
		const didMount = useRef(false);

		useEffect(() => {
			if (didMount.current) {
				getNewsForCity(props.city, props.country);
			} else {
				didMount.current = true;
			}
		}, [props.city]);
	}
	useDidMountEffect();

	/**
	 * Get time information from MediaStack API for a given city
	 * @param city
	 * @param country
	 */
	function getNewsForCity(city, country) {
		const apiKey = '08891a748fd7fa7ce11a51df32582a37';
		const query = `http://api.mediastack.com/v1/news?access_key=${apiKey}&limit=20&countries=${country}&keywords=${city}`;

		axios.get(query)
			.then(response => {
				//console.log(response.data.data);
				/**
				 * Many articles returned from the API are basically duplicates
				 * - the same article published in multiple publications in a network (e.g. The Age and SMH)
				 * so let's filter and save just unique ones to the state variable
				 */
				let filteredArticles = removeDuplicates(response.data.data, 'title');
				setNews(filteredArticles.slice(0,3));
			}).catch(error => {
				console.log(error);
			})
	}

	/**
	 * Utility function to remove objects from an array based on a duplicate value for a given property
	 * Ref: https://stackoverflow.com/a/43067954/6913674
	 * @param myArray
	 * @param property
	 * @returns {*}
	 */
	function removeDuplicates(myArray, property) {
		return myArray.filter((obj, pos, arr) => {
			return arr.map(mapObj => mapObj[property]).indexOf(obj[property]) === pos
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
		<aside id="news">
			{ /** Loop through the forecast items and add each one to the page */}
			{Object.entries(news).map((item, index) => (
				<Article key={index} data={item}/>
			))}
		</aside>
	)

	/**
	 * Output
	 * Ref: https://stackoverflow.com/a/24534492
	 */
	return (
		<Fragment>
			{news ? <Output/> : null}
		</Fragment>
	)
}