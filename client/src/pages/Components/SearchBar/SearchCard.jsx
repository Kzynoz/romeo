import React from "react";
import { useNavigate } from "react-router-dom";

function SearchCard({ result, index }) {
	const navigate = useNavigate();

	function handleClick(e) {
		navigate(`/patient/${result.id}`);
	}

	return (
		<article key={result.id || index} onClick={handleClick}>
			{result.title && result.firstname && result.lastname && (
				<h3>
					{result.title} {result.firstname} {result.lastname}
				</h3>
			)}

			{result.name && <h3>{result.name}</h3>}

			{result.performed_at && (
				<p>{new Date(result.performed_at).toLocaleDateString()}</p>
			)}

			{result.type && (
				<p
					className={`care-type ${
						result.type === "soin pédicure" ? "soin" : ""
					}`}
				>
					{result.type}
				</p>
			)}
		</article>
	);
}

export default SearchCard;
// propsType
