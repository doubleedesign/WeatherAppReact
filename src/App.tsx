import React, {useEffect, useRef, useState} from "react";
import {getRandomInt, getInitialLocation} from "./utils/utilities";

import axios from "axios";
import CryptoJS from "crypto-js";
import Search from "./components/Search/Search";
import Title from "./components/Title/Title";
import Today from "./components/Weather/Today";
import Forecast from "./components/Weather/Forecast";
import DateTime from "./components/DateTime/DateTime";
import News from "./components/News/News";
import "./_variables.scss";
import "./_utilities.scss";
import "./_App.scss";


export default function App() {
    const apiKey = 'f4f65838c4d2f2b467cb557338c7cc7c';
    const [weather, setWeather] = useState<Record<string, any>|null>(null);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [coords, setCoords] = useState<{ lat: number, lon: number } | null>(null);
    const [tempRange, setTempRange] = useState('');
    const [temperature, setTemperature] = useState(0);
    const [units, setUnits] = useState('C');
    const [backgroundImage, setBackgroundImage] = useState('');

    /**
     * When a city is searched for, get the weather from the API using the search string for the city
     * and set the state so child components can pick it up
     * Ref: https://www.geeksforgeeks.org/how-to-pass-data-from-one-component-to-other-component-in-reactjs/
     */
    function handleSearch(searchedCity: string) {
        // Set coords to null so previous ones aren't retained
        setCoords(null);

        // Get the weather for the searched city
        getWeatherForCity(searchedCity);

        // Reset the temperature units back to the default
        setUnits('C');
    }

    /**
     * When location data is received from browser geolocation,
     * get the weather from the API using the coordinates
     */
    function handleGeolocation(coords: {lat: number, lon: number}) {

        // Get the weather for the searched city
        getWeatherForCity(coords);

        // Reset the temperature units back to the default
        setUnits('C');
    }

    /**
     * The Today component sends up the temperature unit setting when it changes so it can be used by other components
     * Here we update the state variables used by those components when new data is received
     * @param units
     */
    function handleUnitChange(units: React.SetStateAction<string>) {
        setUnits(units);
    }

    /**
     * Set and perform API query to get the weather for a given city
     * and save it in the state variable
     * @param city
     */
    function getWeatherForCity(city: string|{lat: number, lon: number}) {
        let query = null;
        if(typeof city === 'object') {
            query = `https://api.openweathermap.org/data/2.5/weather?lat=${city.lat}&lon=${city.lon}&appid=${apiKey}&units=metric`;
        }
        else {
            query = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
        }

        if(query) {
            axios.get(query)
                // Update component state when an API response is received
                // Catch and log error if there is one
                .then(response => {
                    // Full weather object
                    setWeather(response.data);

                    // Rounded temperature
                    const roundedTemp = Math.round(response.data.main.temp);
                    setTemperature(roundedTemp);

                    // Use the returned city name, not the searched phrase
                    setCity(response.data.name);

                    // Only set the coords if they aren't already set (i.e. by geolocation)
                    if(!coords) {
                        setCoords(response.data.coord);
                    }
                }).catch(error => {
                    console.log(error);
                    alert('Sorry, couldn\'t find that city. Please try again');
                })
        }
    }

    /**
     * Query Wikimedia Commons for an image of a given city
     * @param city
     * @returns {Promise<AxiosResponse<any>>}
     */
    async function getImageForCity(city: string) {
        const query = `https://commons.wikimedia.org/w/api.php?action=query&prop=images&imlimit=500&redirects=1&titles=${city}&origin=*&format=json`;
        let imageUrl = '';

        /**
         * Set and perform API query to get images from Wikimedia for the city
         * See Today.tsx for more notes about queries in useEffect hook
         */
        return axios.get(query)
            .then(response => {
                // The key that the images are under varies for each city,
                // so dig down to the right object and use Object.entries to find the images so that the city key doesn't matter
                const object: Record<string, any> = response.data.query.pages;
                const images = Object.entries(object)[0][1].images; // returns a list of file paths

                if (images) {
                    // Choose a random one from the returned list and adjust the text string to what we need
                    const randomIndex = getRandomInt(0, images.length);
                    const imageFile = (images[randomIndex].title)
                        .replace('File:', '')
                        .replace(/ /g, '_');

                    // Build the URL from the file information
                    // Ref: https://stackoverflow.com/a/33691240
                    const imageHash = CryptoJS.MD5(imageFile).toString();
                    imageUrl = `https://upload.wikimedia.org/wikipedia/commons/${imageHash.charAt(0)}/${imageHash.charAt(0)}${imageHash.charAt(1)}/${imageFile}`;
                } else {
                    console.log(`No image found for ${city}`);
                }

                // Return imageUrl - URL if one was found, empty if nothing found for this city
                return imageUrl;

            }).catch(error => {
                console.log(error);
            })
    }

    /**
     * Create and use useDidMountEffect hook with useRef
     * for useEffect stuff that we do not want to run on first render
     * Ref: https://thewebdev.info/2021/03/13/how-to-make-the-react-useeffect-hook-not-run-on-initial-render/
     */
    const useDidMountEffect = () => {
        const didMount = useRef(false);

        useEffect(() => {
            // Second and subsequent renders: Get and show new background image when the city changes
            if (didMount.current) {
                getImageForCity(city).then(response => {
                    const imageUrl: any = response;
                    setBackgroundImage(imageUrl);
                });
            }
            // First render: Prompt for geolocation and search accordingly
            else {
                getInitialLocation()
                    .then((position: any) => {
                        handleGeolocation({lat: position.coords.latitude, lon: position.coords.longitude});
                    })
                    .catch((error) => {
                        alert(`There was a problem getting your location, please search instead`);
                        console.log(error);
                    });

                // Set ref so this doesn't run on second/subsequent renders
                didMount.current = true;

                // Note: This will then re-render because the city will be set (hence triggering this hook again)
                // and will do the "second and subsequent render" step
            }
        }, [city, coords]);
    }
    useDidMountEffect();


    return (
        <div className="wrapper" data-temp-range={tempRange} style={{backgroundImage: `url(${backgroundImage})`}}>
            <main className="app">
                <div className="app__top">
                    <Search onSearch={handleSearch}/>
                </div>
                <div className="app__main">
                    <Title city={city}/>
                    <DateTime coords={coords}/>
                    <Today weather={weather} temperature={temperature} units={units} onUnitUpdate={handleUnitChange}/>
                    <Forecast coords={coords} units={units}/>
                </div>
                <div className="app__side">
                    <News country={country} city={city}/>
                </div>
            </main>
        </div>
    );
}