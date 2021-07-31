import React, {Fragment} from "react";

// Title output only shown when props.city exists
// Ref: https://stackoverflow.com/a/24534492
export default function Title(props) {

	const Output = () => (
		<h1>
			Today in <strong id="city-name">{props.city}</strong>
		</h1>
	)

	return (
		<Fragment>
			{props.city ? <Output/> : null}
		</Fragment>
	)
}
