import React, {useState} from "react";

export default function Temperature(props) {
	// STATE
	// temperature is a variable, to which we assign the current temp from props.degrees
	// setTemperature here creates a function which will receive the current temp here from props.degrees
	let [temperature, setTemperature] = useState(props.degrees);
	// Likewise for the units
	let [units, setUnits] = useState(props.units);

	// EVENTS
	// Function that is called when the link is clicked
	function swapTemperature() {
		let unitsTo = 'C';
		if (units === 'C') {
			unitsTo = 'F';
		}
		let newTemp = convertTemperature(temperature, units, unitsTo);
		setTemperature(newTemp);
		setUnits(unitsTo);
	}

	// Utility function to do the conversion itself
	function convertTemperature(temp, unitsFrom, unitsTo) {
		let newTemp = temp;

		if (unitsFrom === 'C' && unitsTo === 'F') {
			newTemp = Math.round((temp * 1.8) + 32);
		} else if (unitsFrom === 'F' && unitsTo === 'C') {
			newTemp = Math.round((temp - 32) * 0.5556);
		} else {
			// Nothing to swap
		}

		return newTemp;
	}

	return (
		<a className="today-temp" onClick={swapTemperature}>
			<div className="today-image-wrap">
				<img className="today-image" src="" alt=""/>
			</div>
			<span className="amount" data-temp-amount={temperature}>{temperature}&deg;</span>
			<span className="units" data-temp-units={units}>{units}</span>
		</a>
	);
}
