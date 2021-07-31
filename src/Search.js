import React, {useState} from "react";

export default function Search() {
    let [city, setCity] = useState('');

    function handleSearch(event) {
        event.preventDefault();
    }

    function updateCity(event) {
        setCity(event.target.value);
    }

	return (
		<form id="search-form" onSubmit={handleSearch}>
			<label htmlFor="search" className="visually-hidden">Search for a city</label>
			<input id="search" type="search" name="search" placeholder="Search for a city" onChange={updateCity}/>
			<button type="submit">
				<span className="visually-hidden">Search</span>
				<span className="material-icons">search</span>
			</button>
		</form>
	);
}
