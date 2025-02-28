import { useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SearchCard from "./SearchBar/SearchCard";

function SearchBar() {
	const [query, setQuery] = useState("");
	const [datas, setDatas] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	function handleChange(e) {
		setQuery(e.target.value);
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		setDatas(null);

		const URL = "";

		try {
			/* 			const res = await fetch(
				`http://localhost:9000/api/v1/care/search?q=${query}`,
				{
					credentials: "include",
				}
			);*/

			const res = await fetch(
				`http://localhost:9000/api/v1/patients/search?q=${query}`,
				{
					credentials: "include",
				}
			);

			if (res.ok) {
				const { response } = await res.json();
				setDatas(response);
			} else {
				const { message } = await res.json();
				setError(message);
			}
		} catch (error) {
			console.error("error", error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="search-bar">
			<form onSubmit={handleSubmit}>
				<input
					type="search"
					placeholder="Patients, EHPAD, tuteurs…"
					value={query}
					onChange={handleChange}
				/>
				<button type="submit" disabled={loading}>
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</button>
			</form>

			{error && <p>{error}</p>}

			<section className="search-results">
				{loading && <p>Recherche en cours...</p>}
				{datas &&
					datas.map((result, index) => (
						<SearchCard result={result} index={index} />
					))}
			</section>
		</div>
	);
}

export default SearchBar;
