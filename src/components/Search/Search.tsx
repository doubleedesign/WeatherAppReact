import React, {useState} from "react";
import "./_Search.scss";

export interface SearchProps {
	onSearch(city: string): void;
}

export const Search: React.FC<SearchProps> = function(props: {
		onSearch(city: string): void;
	}) {
	const [city, setCity] = useState('');

    function handleSearch(event: { preventDefault: () => void; }) {
        event.preventDefault();
        props.onSearch(city); // sends city back to the parent component
    }

    function updateCity(event: React.ChangeEvent<HTMLInputElement>) {
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

export default Search;