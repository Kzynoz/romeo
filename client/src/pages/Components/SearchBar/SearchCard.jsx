import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

/**
 * Search Card component to display result of the search
 *
 * @params {object} result - Data of the search result to display
 * @params {string} entityType - Type of entity being searched (patient, guardian, care, all)
 * @params {function} onSelect - Optional function to handle selection without navigation
 * 
 * @returns - Data result
 */
function SearchCard({ result, entityType, onSelect }) {
	const navigate = useNavigate();

	function handleClick(e) {
		// Using the component when adding a Patient,
		// this allows returning the search result and prevents redirection when clicked
		if (onSelect) {
			e.preventDefault();
			onSelect(result);
			return;
		}

		// Different navigation based on the search result
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
		<article onClick={handleClick} role="button">
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

SearchCard.propTypes = {
	entityType: PropTypes.string.isRequired,
	result: PropTypes.object.isRequired,
	onSelect: PropTypes.func,
};

export default SearchCard;