import React, {Fragment} from "react";

// Title output only shown when props.city exists
// Ref: https://stackoverflow.com/a/24534492
export default function Title(props) {

	/**
	 * Put output in a variable so it can be shown conditionally
	 * (in the component's return statement)
	 * Ref: https://stackoverflow.com/a/24534492
	 * @returns {*}
	 * @constructor
	 */
	const Output = () => (
		<h1 className="row">
			Today in <strong id="city-name">{props.city}</strong>
		</h1>
	)

	/**
	 * Output - only shown when props.city exists
	 * Ref: https://stackoverflow.com/a/24534492
	 */
	return (
		<Fragment>
			{props.city ? <Output/> : null}
		</Fragment>
	)
}
