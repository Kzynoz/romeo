import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

function SearchCard({ result, entityType }) {
	const navigate = useNavigate();

	function handleClick(e) {
		if (result?.is_patient === 1) {
			navigate(`/patients/${result.id}`);
		} else if (result?.is_patient === 0) {
			navigate(`/tuteurs/${result.id}`);
		} else if (result?.performed_at) {
			navigate(`/patients/${result.patient_id}/soin/${result.id}`);
		} else if (result?.name) {
			navigate(`/maisons-retraite/${result.id}`);
		}
	}

	return (
		<article onClick={handleClick}>
			{result.title && result.firstname && result.lastname && (
				<h3>
					{result.title} {result.firstname} {result.lastname}{" "}
					{entityType === "all" && result.is_patient === 1 ? (
						<span>patient</span>
					) : entityType === "all" && result.is_patient === 0 ? (
						<span>tuteur</span>
					) : null}
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

SearchCard.propTypes = {
	entityType: PropTypes.string.isRequired,
	result: PropTypes.object.isRequired,
};
