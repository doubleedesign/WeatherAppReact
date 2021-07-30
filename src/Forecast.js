import React from 'react';

export default function Forecast() {
	return (
		<React.Fragment>
			<h2>This week</h2>
			<div id="forecast">
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
				<div className="forecast-item"></div>
			</div>
		</React.Fragment>
	);
}
