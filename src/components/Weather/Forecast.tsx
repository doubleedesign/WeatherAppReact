import React, {Fragment, useEffect, useState, useRef} from 'react';
import {convertTemperature, getDayAbbrev} from "../../utils/utilities";
import axios from "axios";
import Temperature from "./Temperature";
import "./_Forecast.scss";

export interface ForecastProps {
    coords: {lat: number; lon: number;}|null;
    units: React.SetStateAction<string>;
}

export const Forecast: React.FC<ForecastProps> = function(props: { coords: {lat: number; lon: number;}|null; units: React.SetStateAction<string>; }) {
    const apiKey = 'f4f65838c4d2f2b467cb557338c7cc7c';
    const [forecast, setForecast] = useState({} as any); // https://basarat.gitbook.io/typescript/main-1/lazyobjectliteralinitialization
    const [units, setUnits] = useState('C'); // See Temperature.tsx for notes about using state

    /**
     * Create and use useDidMountEffect hook with useRef
     * for useEffect stuff that we do not want to run on first render
     * Ref: https://thewebdev.info/2021/03/13/how-to-make-the-react-useeffect-hook-not-run-on-initial-render/
     */
    const useDidMountEffect = () => {
        const didMount = useRef(false);

        /**
         * Update the forecast when the city changes
         * This is done inside useEffect so it only re-runs if certain values have changed (in this case, props.coords)
         */
        useEffect(() => {
            if (didMount.current) {
                if(props.coords) {
                    getForecastForCity(props.coords);
                }
                setUnits(props.units)
            } else {
                didMount.current = true;
            }
        }, [props.coords]);
    }
    useDidMountEffect();

    /**
     * When units change, set state
     */
    useEffect(() => {
        setUnits(props.units)
    }, [props.units]);

    /**
     * Set and perform API query to get the forecast for a given city
     * and save it in the state variable
     * Note: Forecast query requires coordinates, not city name
     * @param coords
     */
    function getForecastForCity(coords: {lat: number; lon:number;}) {
        const query = `https://api.openweathermap.org/data/2.5/onecall?lat=${coords.lat}&lon=${coords.lon}&appid=${apiKey}&units=metric&exclude=current,hourly,minutely,alerts`;

        axios.get(query)
            // Update component state when an API response is received
            // Catch and log error if there is one
            .then(response => {

                // Slice the returned data down to only the first five days
                let fullData = response.data.daily;
                fullData = fullData.slice(1, 6);

                // Loop through the returned data and put just what we want into an object
                const summaryData: { [key: string]: any } = {};
                {
                    fullData.map((value: { dt: any; temp: { min: number; max: number; }; weather: { icon: any; }[]; }, index: any) => {
                        // Get current timezone offset
                        const today = new Date();
                        const offset = today.getTimezoneOffset();

                        // Get the forecast day's unix timestamp from the returned data
                        const timestamp = value.dt;

                        // Get the day of that timestamp taking the timezone offset into account
                        const date = new Date((timestamp * 1000) + (offset * 60 * 1000));
                        const dayNo = date.getDay();
                        const day = getDayAbbrev(dayNo);

                        // Add this forecast day's data to the summary
                        const minC = Math.round(value.temp.min);
                        const maxC = Math.round(value.temp.max);
                        summaryData[day] = {
                            C: {
                                min: minC,
                                max: maxC
                            },
                            F: {
                                min: convertTemperature(minC, 'C', 'F'),
                                max: convertTemperature(maxC, 'C', 'F'),
                            },
                            imageUrl: `http://openweathermap.org/img/wn/${value.weather[0].icon}@2x.png`
                        }
                    })
                }

                // Update the forecast state variable with our customised data object
                setForecast(summaryData);

            }).catch(error => {
                console.log(error);
            })
    }

    /**
     * What to do if the temperature component sends data up using the onUnitUpdate prop
     * @param unitsTo
     */
    function switchUnits(unitsTo: string) {
        // Update the state in this component
        setUnits(unitsTo);
    }

    /**
     * Put output in a variable so it can be shown conditionally
     * (in the component's return statement)
     * Ref: https://stackoverflow.com/a/24534492
     * Can't use Fragment here for some reason...?
     * @returns {*}
     * @constructor
     */
    const Output = () => {
        return <section className="forecast row">
            { /** Loop through the forecast items and add each one to the page */}
            {Object.keys(forecast).map(day => (
                <div className="forecast__item" key={day}>
                    <span className="forecast__item__day">{day}</span>
                    <img className="forecast__item__image" src={forecast[day].imageUrl} alt=""/>
                    <span className="forecast__item__min">
						Low
						<Temperature
                            size="small"
                            degrees={forecast[day][units].min}
                            units={units}
                            showUnits={false}
                            clickable={false}
                            onUnitUpdate={switchUnits}/>
					</span>
                    <span className="forecast__item__max">
						High
						<Temperature
                            size="small"
                            degrees={forecast[day][units].max}
                            units={units}
                            showUnits={false}
                            clickable={false}
                            onUnitUpdate={switchUnits}/>
					</span>
                </div>
            ))}
        </section>;
    }

    /**
     * Output - only shown when forecast exists
     * Ref: https://stackoverflow.com/a/24534492
     */
    return (
        <Fragment>
            {forecast ? <Output/> : null}
        </Fragment>
    );
}

export default Forecast;
