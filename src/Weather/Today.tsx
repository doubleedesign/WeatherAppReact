import React, {Fragment, useEffect, useState, useRef} from "react";
import Temperature from "./Temperature";
import Details from "./Details";
import "./_Today.scss";

export interface TodayProps {
    weather: any|null,
    temperature: number,
    units: string;
    onUnitUpdate(unitsTo: string): void;
}

export const Today: React.FC<TodayProps> = function(props: { weather: any; temperature: number; units: string; onUnitUpdate(unitsTo: string): void; }) {
    const [temperature, setTemperature] = useState(props.temperature); // Temperature needs to be stored separately from the weather object because it can be changed by the C/F conversion functionality
    const [units, setUnits] = useState(props.units);

    /**
     * When the units prop is updated, set the state
     * This ensures that when the units are reset to C in App, that flows through to today's Temperature component
     */
    useEffect(() => {
        setUnits(props.units);
    }, [props.units])

    /**
     * When the temperature prop is updated, set the state
     */
    useEffect(() => {
        setTemperature(props.temperature);
    }, [props.temperature])

    /**
     * What to do if the temperature component sends data up using the onUnitUpdate prop
     * @param unitsTo
     * @param newTemp
     */
    function switchUnits(unitsTo: string, newTemp: React.SetStateAction<number>) {
        // Update the state in this component
        setUnits(unitsTo);
        setTemperature(newTemp);

        // Send the units it returns up to the parent component
        props.onUnitUpdate(unitsTo);
    }

    /**
     * Put output in a variable so it can be shown conditionally
     * (in the component's return statement)
     * Ref: https://stackoverflow.com/a/24534492
     * @returns {*}
     * @constructor
     */
    const Output = (): any => {
        if(props.weather) {
            return (
                <section className="today row">
                    <div className="today__text">
                        <div className="today__text__temperature">
                            <div className="today__text__temperature__image-wrap">
                                <img src={`http://openweathermap.org/img/wn/${props.weather.weather[0].icon}@2x.png`}
                                     alt={props.weather.weather[0].description}/>
                            </div>
                            <Temperature
                                size="large"
                                degrees={temperature}
                                units={units}
                                showUnits={true}
                                clickable={true}
                                onUnitUpdate={switchUnits}
                            />
                        </div>
                        <Details description={props.weather.weather[0].description}
                                 humidity={props.weather.main.humidity}
                                 wind={props.weather.wind.speed}
                        />
                    </div>
                </section>
            );
        }
    }

    /**
     * Output - only shown when weather exists
     * Ref: https://stackoverflow.com/a/24534492
     */
    return (
        <Fragment>
            {props.weather ? <Output/> : null}
        </Fragment>
    )
}

export default Today;