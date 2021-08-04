import React, {useState} from "react";

import "./_Temperature.scss";

export default function Temperature(props) {

	/**
	 * STATE
	 * temperature is a variable, to which we assign the current temp from props.degrees
	 * setTemperature here creates a function which will receive the current temp here from props.degrees
	 * Likewise for the units (C/F)
	 */
	let [temperature, setTemperature] = useState(props.degrees);
	let [units, setUnits] = useState(props.units);

	/**
	 * EVENTS
	 * Function that is called when the link is clicked
	 */
	function swapTemperature() {
		let unitsTo = 'C';
		if (units === 'C') {
			unitsTo = 'F';
		}
		let newTemp = convertTemperature(temperature, units, unitsTo);
		setTemperature(newTemp);
		setUnits(unitsTo);
	}

	/**
	 * Utility function to do the conversion itself
	 * @param temp
	 * @param unitsFrom
	 * @param unitsTo
	 * @returns {number}
	 */
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
		<a className="temperature" onClick={swapTemperature}>
			<div className="temperature__image-wrap">
				<img className="temperature__image-wrap__image" src={props.imageUrl} alt={props.imageAlt}/>
			</div>
			<span className="temperature__amount" data-temp-amount={temperature}>{temperature}&deg;</span>
			<span className="temperature__units" data-temp-units={units}>{units}</span>
		</a>
	);
}
