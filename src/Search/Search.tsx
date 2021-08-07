import React, {useState} from "react";
import "./_Search.scss";

export default function Search(props) {
    let [city, setCity] = useState('');

    function handleSearch(event) {
        event.preventDefault();
        props.onSearch(city); // sends city back to the parent component
    }

    function updateCity(event) {
        setCity(event.target.value); // Updates state variable when input changes
    }

	return (
		<section className="row">
			<form id="search-form" className="search-form" onSubmit={handleSearch}>
				<label htmlFor="search" className="visually-hidden">Search for a city</label>
				<input id="search" type="search" name="search" placeholder="Search for a city" onChange={updateCity}/>
				<button type="submit">
					<span className="visually-hidden">Search</span>
					<span className="material-icons">search</span>
				</button>
			</form>
		</section>
	);
}