export default function Search() {
  return (
    <form id="search-form">
      <label for="search" class="visually-hidden">
        Search for a city
      </label>
      <input
        id="search"
        type="search"
        name="search"
        placeholder="Search for a city"
      />
      <button type="submit">
        <span class="visually-hidden">Search</span>
        <span class="material-icons">search</span>
      </button>
    </form>
  );
}
