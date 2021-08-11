import React, {Fragment, useEffect, useState, useRef} from 'react';
import axios from "axios";
import Temperature from "./Temperature";
import "./_Forecast.scss";

export interface ForecastProps {
    coords: { lat: number; lon: number; };
    units: React.SetStateAction<string>;
}

export const Forecast: React.FC<ForecastProps> = function (
    props: {
        coords: { lat: number; lon: number; };
        units: React.SetStateAction<string>;
    }
) {
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
                getForecastForCity(props.coords);
                setUnits(props.units)
            } else {
                didMount.current = true;
            }
        }, [props.coords, props.units]);
    }
    useDidMountEffect();

    /**
     * Set and perform API query to get the forecast for a given city
     * and save it in the state variable
     * Note: Forecast query requires coordinates, not city name
     * @param coords
     */
    function getForecastForCity(coords: { lat: number; lon: number; }) {
        const query = `https://api.openweathermap.org/data/2.5/onecall?lat=${props.coords.lat}&lon=${props.coords.lon}&appid=${apiKey}&units=metric&exclude=current,hourly,minutely,alerts`;

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
     * Utility function to convert the day number to its 3-letter abbreviation
     * @param number
     * @returns {string}
     */
    function getDayAbbrev(number: number) {
        let day = '';
        switch (number) {
            case 0:
                day = 'Sun';
                break;
            case 1:
                day = 'Mon';
                break;
            case 2:
                day = 'Tue';
                break;
            case 3:
                day = 'Wed';
                break;
            case 4:
                day = 'Thu';
                break;
            case 5:
                day = 'Fri';
                break;
            case 6:
                day = 'Sat';
                break;
            default:
                break;
        }

        return day;
    }

    /**
     * Utility function to convert temperatures between C and F
     * @param temp
     * @param unitsFrom
     * @param unitsTo
     * @returns {number}
     */
    function convertTemperature(temp: number, unitsFrom: string, unitsTo: string) {
        let newTemp = temp;

        if (unitsFrom === 'C' && unitsTo === 'F') {
            newTemp = Math.round((temp * 1.8) + 32);
        } else if (unitsFrom === 'F' && unitsTo === 'C') {
            newTemp = Math.round((temp - 32) * 0.5556);
        }

        return newTemp;
    }

    /**
     * What to do if the temperature component sends data up using the onUnitUpdate prop
     * This does more in the Today component because that one uses clickable Temperatures whereas this one doesn't
     * TODO: Refactor so there's less duplication and so this component can handle clickable Temperatures properly too
     * @param unitsTo
     * @param newTemp
     */
    function switchUnits(unitsTo: string, newTemp: React.SetStateAction<number>) {
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
