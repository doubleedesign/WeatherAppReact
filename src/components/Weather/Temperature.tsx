import React, {Fragment, useState} from "react";
import {convertTemperature} from "../../utils/utilities";
import "./_Temperature.scss";

export interface TemperatureProps {
	degrees: number;
	units: string;
	size: string;
	showUnits: boolean;
	clickable: boolean;
	onUnitUpdate: (unitsTo: string) => void;
}

export const Temperature: React.FC<TemperatureProps> = function(
	props: {
		degrees: number;
		units: string;
		size: string;
		showUnits: boolean;
		clickable: boolean;
		onUnitUpdate: (unitsTo: string) => void;
	}) {

	/**
	 * STATE
	 * temperature is a variable, to which we assign the current temp from props.degrees
	 * setTemperature here creates a function which will receive the current temp here from props.degrees
	 * Likewise for the units (C/F)
	 */
	const [temperature, setTemperature] = useState(props.degrees);
	const [units, setUnits] = useState(props.units);

	/**
	 * EVENTS
	 * Function that is called when the link is clicked
	 */
	function swapTemperature() {
		let unitsTo = 'C';
		if (units === 'C') {
			unitsTo = 'F';
		}
		const newTemp = convertTemperature(temperature, units, unitsTo);
		setTemperature(newTemp);
		setUnits(unitsTo);

		// Send the new unit setting up to the parent component
		props.onUnitUpdate(unitsTo);
	}

	/**
	 * Output when clickable = true
	 * @returns {*}
	 * @constructor
	 */
	const LinkOutput = () => (
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
	const SpanOutput = () => (
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

export default Temperature;
