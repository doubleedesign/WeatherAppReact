import React, {Fragment} from "react";
import Time from "./Time";
import Temperature from "./Temperature";
import Details from "./Details";

// Output only shown when props.city exists
// Ref: https://stackoverflow.com/a/24534492
export default function Today(props) {

	const Output = () => (
		<div id="today">
			<div className="today-text">
				<Time/>
				<Temperature degrees="20" units="C"/>
				<Details description="Sunny" humidity="50" wind="5"/>
			</div>
		</div>
	)

	return (
		<Fragment>
			{props.city ? <Output/> : null}
		</Fragment>
	)
}
