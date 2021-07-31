import "./reset.css";
import "./style.css";

import Search from "./Search";
import Title from "./Title";
import Today from "./Today";
import Forecast from "./Forecast";
import React from "react";

export default function App() {


	return (
		<main id="weather">
			<section className="row">
				<Search/>
			</section>
			<section className="row">
				<Title city="New York"/>
			</section>
			<section className="row">
				<Today/>
			</section>
			<section className="row">-
				<Forecast/>
			</section>
		</main>
	);
}