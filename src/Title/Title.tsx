import React, {Fragment} from "react";
import "./_Title.scss";

export interface TitleProps {
	city: string
}

export const Title: React.FC<TitleProps> = function(
	props: {
		city: string
	}) {

	/**
	 * Put output in a variable so it can be shown conditionally
	 * (in the component's return statement)
	 * Ref: https://stackoverflow.com/a/24534492
	 * @returns {*}
	 * @constructor
	 */
	const Output = () => (
		<h1 className="title row">
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

export default Title;