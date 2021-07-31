import React, {Fragment} from 'react';

// Output only shown when props.city exists
// Ref: https://stackoverflow.com/a/24534492
export default function Forecast(props) {

	// Can't use Fragment here for some reason...?
	const Output = () => (
		<div>
			<h2>This Week</h2>
			<div id="forecast">
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
			</div>
		</div>
	)

	return (
		<Fragment>
			{props.city ? <Output/> : null}
		</Fragment>
	);
}
