import PropTypes from "prop-types";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";

import RemoveEntity from "../Entity/RemoveEntity";

import { toggleModal, toggleEditing } from "../../features/menuSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";

/**
 * This component handles the management of an entity (such as a patient, care, guardian, retirement home), 
 * allowing for actions like: Back navigation, Open the modal for deleting and updating entity
 * 
 * @params {object} entity - The id's entity from API to be
 * @params {object} link - The link object containing the URL and title
 * 
 * @returns - A set of action buttons (Back, Edit, Delete) for managing the entity, visible only to admins
 */

function ManageItem({ entity, link }) {
	
	const { isAdmin } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();

	// Redirection of the back button based on the URL path
	function handleRedirection() {
		
		// Filters the URL into an array and removes empty elements
		const segments = location.pathname.split("/").filter(Boolean);

		if (segments.length === 2) {
			const path = segments[0];
			navigate(`/${path}`);
		} else if (segments.length > 2) {
			const path = segments[0];
			const id = segments[1];

			navigate(`/${path}/${id}`);
		}
	}

	return (
		<>
			{isAdmin && entity ? (
				<>
					<RemoveEntity entity={entity} link={link} />

					<div className="actions">
						<button
							className="back-button"
							onClick={() => {
								handleRedirection();
							}}
							aria-label="Retour"
						>
							<FontAwesomeIcon icon={faAngleLeft} />
						</button>
						<button
							className="update-button"
							onClick={() => {
								dispatch(toggleEditing(true));
							}}
							aria-label="Modifier"
						>
							Modifier
						</button>
						<button
							className="delete-button"
							onClick={() => {
								dispatch(toggleModal(true));
							}}
							aria-label="Supprimer"
						>
							Supprimer
						</button>
					</div>
				</>
			) : null}
		</>
	);
}

ManageItem.propTypes = {
	entity: PropTypes.object.isRequired,
	link: PropTypes.object.isRequired,
};

export default ManageItem;
