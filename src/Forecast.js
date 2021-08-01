import React, {Fragment} from 'react';

export default function Forecast(props) {

	/**
	 * Put output in a variable so it can be shown conditionally
	 * (in the component's return statement)
	 * Ref: https://stackoverflow.com/a/24534492
	 * Can't use Fragment here for some reason...?
	 * @returns {*}
	 * @constructor
	 */
	const Output = () => (
		<section className="row">
			<h2>This Week</h2>
			<div id="forecast">
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
			</div>
		</section>
	)

	/**
	 * Output - only shown when props.city exists
	 * Ref: https://stackoverflow.com/a/24534492
	 */
	return (
		<Fragment>
			{props.city ? <Output/> : null}
		</Fragment>
	);
}
