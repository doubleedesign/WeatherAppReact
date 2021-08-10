import React, {Fragment, useEffect, useState, useRef} from "react";
import axios from "axios";
import Article from "./Article"
import Alert from "../Alert/Alert"

export interface NewsProps {
	city: string,
	country: string
}

export const News: React.FC<NewsProps> = function(
	props: {
		city: string,
		country: string
	}) {
	const didMount = useRef(false);
	const [news, setNews] = useState([]);

	/**
	 * Create and use useDidMountEffect hook with useRef
	 * for useEffect stuff that we do not want to run on first render
	 * Ref: https://thewebdev.info/2021/03/13/how-to-make-the-react-useeffect-hook-not-run-on-initial-render/
	 */
	const useDidMountEffect = () => {
		
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
	function getNewsForCity(city: string, country: string) {
		const apiKey = 'b4824ef81779b5b36a81816125585feb';
		const query = `https://gnews.io/api/v4/search?q=${city}&country=${country}&lang=en&token=${apiKey}`;

		axios.get(query)
			.then(response => {
				const articles = response.data.articles;
				setNews(articles.slice(0,3));
			}).catch(error => {
				console.log(error);
				setNews([]);
			})
	}

	/**
	 * Put output in a variable so it can be shown conditionally
	 * (in the component's return statement)
	 * Ref: https://stackoverflow.com/a/24534492
	 * @returns {*}
	 * @constructor
	 */
	const Output = () => (
		<aside id="news">
			{ /** Loop through the news items and add each one to the page */}
			{news.map((item, index) => (
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
			{!news && didMount.current ? <Alert type="error" message="There was a problem fetching news."/> : null}
		</Fragment>
	)
}

export default News;