import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import SearchCard from "./SearchCard";
import { useSelector } from "react-redux";

function SearchBar({ entityType }) {
	const [query, setQuery] = useState("");
	const [datas, setDatas] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const {
		infos: { role },
	} = useSelector((state) => state.auth);

	function handleChange(e) {
		setQuery(e.target.value);
	}

	function handleClick(e) {
		setIsOpen((prevState) => !prevState);
	}

	function handlePlaceholder() {
		let placeholder = "";

		switch (entityType) {
			case "patient":
				placeholder = "Rechercher un patient";
				break;
			case "care":
				placeholder = "Rechercher un soin";
				break;
			case "guardian":
				placeholder = "Rechercher un tuteur";
				break;
			case "retirement home":
				placeholder = "Rechercher une EHPAD";
				break;
			case "all":
				placeholder = "Rechercher un patient, tuteur, soin, EHPAD…";
				break;
			default:
				placeholder = "Erreur, veuillez réessayer plus tard";
				break;
		}
		return placeholder;
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setError(null);
		setLoading(true);
		setDatas(null);

		let URL = "";

		switch (entityType) {
			case "patient":
				URL = `http://localhost:9000/api/v1/patients/search?q=${query}`;
				break;
			case "care":
				URL = `http://localhost:9000/api/v1/care/search?q=${query}`;
				break;
			case "guardian":
				URL = `http://localhost:9000/api/v1/guardians/search?q=${query}`;
				break;
			case "retirement home":
				URL = `http://localhost:9000/api/v1/retirement-homes/search?q=${query}`;
				break;
			case "all":
				URL = `http://localhost:9000/api/v1/user/search?q=${query}`;
				break;
			default:
				setError("Une erreur est survenue, veuillez réessayer plus tard.");
				setLoading(false);
				return;
		}

		try {
			const res = await fetch(URL, {
				credentials: "include",
			});

			if (res.ok) {
				const { response } = await res.json();
				setIsOpen(true);
				setDatas(response);
			} else {
				const { message } = await res.json();
				setError(message);
				setIsOpen(false);
			}
		} catch (error) {
			console.error("error", error);
			setError(error.message);
		} finally {
			setLoading(false);
		}
	}

	if (role === "guardian") {
		return null;
	}

	return (
		<div className="search-bar">
			<form onSubmit={handleSubmit}>
				<input
					type="search"
					placeholder={handlePlaceholder()}
					value={query}
					onChange={handleChange}
				/>
				<button type="submit" disabled={loading}>
					<FontAwesomeIcon icon={faMagnifyingGlass} />
				</button>
			</form>

			{error && <p>{error}</p>}

			<section className={`search-results ${isOpen ? "" : "close"}`}>
				<button onClick={handleClick}>
					<FontAwesomeIcon icon={faXmark} />
				</button>

				{loading && <p>Recherche en cours...</p>}

				{datas &&
					(entityType === "all"
						? Object.values(datas)
								.filter(Array.isArray) // Garde uniquement les tableaux
								.flat() // Fusionne tous les tableaux en un seul
								.map((result, index) => (
									<SearchCard key={index} result={result} entityType={"all"} />
								))
						: datas.map((result, index) => (
								<SearchCard
									key={index}
									result={result}
									entityType={entityType}
								/>
						  )))}
			</section>
		</div>
	);
}

export default SearchBar;

SearchBar.propTypes = {
	entityType: PropTypes.string.isRequired,
};
