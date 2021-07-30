import React from "react";

export default function Search() {
  return (
    <form id="search-form">
      <label for="search" className="visually-hidden">
        Search for a city
      </label>
      <input
        id="search"
        type="search"
        name="search"
        placeholder="Search for a city"
      />
      <button type="submit">
        <span className="visually-hidden">Search</span>
        <span className="material-icons">search</span>
      </button>
    </form>
  );
}
