import React, {Fragment, useEffect, useState, useRef} from "react";
import axios from "axios";
import "./_DateTime.scss";

export interface DateTimeProps {
	coords: {lat: number, lon: number};
}

export const DateTime: React.FC<DateTimeProps> = function(
	props: {
		coords: {lat: number, lon: number};
	}) {

	const [timeData, setTimeData] = useState({
		day: '',
		hours: 0,
		minutes: 0,
		meridiem: '',
		zoneName: '',
		zoneUTC: ''
	});

	/**
	 * Create and use useDidMountEffect hook with useRef
	 * for useEffect stuff that we do not want to run on first render
	 * Ref: https://thewebdev.info/2021/03/13/how-to-make-the-react-useeffect-hook-not-run-on-initial-render/
	 */
	const useDidMountEffect = () => {
		const didMount = useRef(false);

		useEffect(() => {
			if (didMount.current) {
				getTimeForCity(props.coords);
			} else {
				didMount.current = true;
			}
		}, [props.coords]);
	}
	useDidMountEffect();

	/**
	 * Get time information from IPGeolocation API for a given set of lat/long coordinates
	 * @param coords
	 */
	function getTimeForCity(coords: { lat: number; lon: number; }) {
		const query = `https://api.ipgeolocation.io/timezone?apiKey=ff944d6f7e6449e4804af70e245bbabd&lat=${coords.lat}&long=${coords.lon}`;

		axios.get(query)
			// Update component state when an API response is received
			// Catch and log error if there is one
			.then(response => {
				// This API returns a plain string not a JSON object, so we shall parse it to make it one
				const timeObject = JSON.parse(response.request.response);

				// Do some processing
				const splitTime = (timeObject.time_12).split(/[: ]/);
				let utc = `+${timeObject.timezone_offset}`;
				if(timeObject.timezone_offset < 0) {
			 		utc = timeObject.timezone_offset;
				}
				const timeDataProcessed = {
					day: (timeObject.date_time_txt).split(',')[0],
					hours: splitTime[0],
					minutes: splitTime[1],
					meridiem: splitTime[3],
					zoneName: (timeObject.timezone).replace('_', ' '),
					zoneUTC: utc
				}

				// Save the processed data to the state
				setTimeData(timeDataProcessed);

			}).catch(error => {
				console.log(error);
			})
	}

	/**
	 * Put output in a variable so it can be shown conditionally
	 * (in the component's return statement)
	 * Ref: https://stackoverflow.com/a/24534492
	 * @returns {*}
	 * @constructor
	 */
	const Output = (): any => (
		<section className="datetime row">
			<span className="datetime__time">
				<span className="material-icons-outlined">alarm</span>
				{timeData.day} {timeData.hours}:{timeData.minutes} {timeData.meridiem}
			</span>
			<span className="datetime__zone">
				{timeData.zoneName} (GMT{timeData.zoneUTC})
			</span>
		</section>
	)

	/**
	 * Output - only shown when time data exists
	 * Ref: https://stackoverflow.com/a/24534492
	 */
	return (
		<Fragment>
			{timeData ? <Output/> : null}
		</Fragment>
	)
}

export default DateTime;