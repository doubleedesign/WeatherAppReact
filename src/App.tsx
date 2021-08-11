import "./_variables.scss";
import "./_utilities.scss";
import "./_App.scss";

import React, {useEffect, useRef, useState} from "react";
import Search from "./Search/Search";
import Title from "./Title/Title";
import Today from "./Weather/Today";
import Forecast from "./Weather/Forecast";
import axios from "axios";
import CryptoJS from "crypto-js";
import DateTime from "./DateTime/DateTime";
import News from "./News/News";

export default function App() {
    const [searchTerm, setSearchTerm] = useState<string | null>(null);
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('');
    const [coords, setCoords] = useState<{ lat: number, lon: number } | null>(null);
    const [tempRange, setTempRange] = useState('');
    const [tempUnits, setTempUnits] = useState('C');
    const [backgroundImage, setBackgroundImage] = useState('');

    /**
     * When a city is searched for, set the state so child components can pick it up
     * Ref: https://www.geeksforgeeks.org/how-to-pass-data-from-one-component-to-other-component-in-reactjs/
     */
    function onSearchChange(searchedCity: string) {
        // Set coords to null so if this is a search after loading coords from geolocation,
        // the search term is used not the pre-existing coords
        setCoords(null);

        // Set the new city name
        setSearchTerm(searchedCity);

        // Reset the temperature units back to the default
        setTempUnits('C');
    }

    /**
     * The today component sends up some selected data from the weather query so it can be used by other components
     * Here we update the state variables used by those components when new data is received
     * @param data
     */
    function onWeatherChange(data: { city: string, country: string, coords: { lat: number, lon: number }; temperature: number, }) {

        // Display the returned city name rather than exactly what was searched
        setCity(data.city);

        // Get the returned country code from the search
        setCountry(data.country);

        // Set the coordinates of the city (used by the forecast)
        setCoords(data.coords);

        // Set the data-temp-range attribute for styling purposes
        if (data.temperature <= 15) {
            setTempRange('cold');
        } else if (data.temperature > 15 && data.temperature < 25) {
            setTempRange('fair');
        } else if ((data.temperature >= 25) && (data.temperature < 35)) {
            setTempRange('warm');
        } else {
            setTempRange('hot');
        }
    }

    /**
     * The Today component sends up the temperature unit setting when it changes so it can be used by other components
     * Here we update the state variables used by those components when new data is received
     * @param units
     */
    function onUnitChange(units: React.SetStateAction<string>) {
        setTempUnits(units);
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
     * Utility function to get a random integer in a range
     * @param min
     * @param max
     * @returns {number}
     */
    function getRandomInt(min: number, max: number) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * Function to prompt for geolocation to load initial data
     * Ref: https://developer.mozilla.org/en-US/docs/Web/API/Permissions_API/Using_the_Permissions_API
     * Ref: https://stackoverflow.com/a/45422800
     * Ref: https://stackoverflow.com/a/57829970
     */
    async function getInitialLocation() {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        return new Promise((resolve, reject) => {
            navigator.permissions
                .query({
                    name: "geolocation"
                })
                .then(function (result) {
                    if (result.state === "granted" || result.state === "prompt") {
                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                resolve(position);
                            },
                            (error) => {
                                reject(error);
                            },
                            options
                        );
                    } else if (result.state === "denied") {
                        return false;
                    }
                });
        });
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
            // First render: Prompt for geolocation and put the coordinates into the state variable
            else {
                getInitialLocation()
                    .then((position: any) => {
                        setCoords({lat: position.coords.latitude, lon: position.coords.longitude});
                    })
                    .catch((error) => {
                        alert(`There was a problem getting your location, please search instead`);
                        console.log(error);
                    });

                // Set ref so this doesn't run on second/subsequent renders
                didMount.current = true;
            }
        }, [city]);
    }
    useDidMountEffect();


    return (
        <div className="wrapper" data-temp-range={tempRange} style={{backgroundImage: `url(${backgroundImage})`}}>
            <main className="app">
                <div className="app__top">
                    <Search onSearch={onSearchChange}/>
                </div>
                <div className="app__main">
                    <Title city={city}/>
                    <DateTime coords={coords}/>
                    <Today coords={coords} city={searchTerm} units={tempUnits} onWeatherUpdate={onWeatherChange} onUnitUpdate={onUnitChange}/>
                    <Forecast coords={coords} units={tempUnits}/>
                </div>
                <div className="app__side">
                    <News country={country} city={city}/>
                </div>
            </main>
        </div>
    );
}