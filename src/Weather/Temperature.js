import React, {Fragment, useState, useEffect} from "react";

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

		// Send the new unit setting up to the parent component
		props.onUnitUpdate(unitsTo, newTemp);
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
		}

		return newTemp;
	}

	/**
	 * Output when clickable = true
	 * @returns {*}
	 * @constructor
	 */
	let LinkOutput = () => (
		<a className={`temperature temperature--${props.size}`} onClick={swapTemperature}>
			<span className="temperature__amount" data-temp-amount={temperature}>{temperature}&deg;</span>
			{props.showUnits === true &&
				<span className="temperature__units" data-temp-units={units}>{units}</span>
			}
		</a>
	)

	/**
	 * Output when clickable = false
	 * @returns {*}
	 * @constructor
	 */
	let SpanOutput = () => (
		<span className={`temperature temperature--${props.size}`}>
			<span className="temperature__amount" data-temp-amount={temperature}>{temperature}&deg;</span>
			{props.showUnits === true &&
			<span className="temperature__units" data-temp-units={units}>{units}</span>
			}
		</span>
	)

	return (
		<Fragment>
			{props.clickable ? <LinkOutput/> : <SpanOutput/>}
		</Fragment>
	)
}
