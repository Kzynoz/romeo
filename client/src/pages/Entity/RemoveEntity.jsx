import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { toggleModal } from "../../features/menuSlice";

import { customFetch } from "../../service/api.js";

/**
 * This component handles the deletion of an entity (such as a patient, care, retirement home and care) through a confirmation modal
 * The modal asks the user to confirm the deletion and sends a DELETE request to the server when confirmed
 * 
 * @params {string} entity - The entity to be deleted, which includes the id and name of the entity
 * @params {string} link - Contains information for the modal, such as the title to be displayed
 * 
 * @returns - The modal element for confirming the deletion, or null if not displayed
 */

function RemoveEntity({ entity, link }) {
	// Extract parameters from URL
	const { id, idSoin } = useParams();
	const navigate = useNavigate();

	// Set up local state to manage validation, messages, and form data
	const [isVerifying, setIsVerifying] = useState(true);
	const [message, setMessage] = useState(null);
	const [formData, setFormData] = useState({
		id: entity.careId ? entity.careId : entity.id,
		name: entity.name,
	});

	const location = useLocation();
	const path = location.pathname;

	const dispatch = useDispatch();

	const { isModalOpen } = useSelector((state) => state.menu);

	// Handle form submission to delete the entity
	async function handleSubmit(e) {
		e.preventDefault();

		setMessage(null);

		const options = {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(formData),
		};

		try {
			const res = await customFetch(`/${link.url}/${formData.id}`, options);
			const resBody = await res.json();

			if (res.ok) {
				setMessage({ status: "success", text: resBody.message });

				// Redirect based on the current URL path
				setTimeout(() => {
					if (path.includes("/maisons-retraite/")) {
						navigate("/maisons-retraite");
					} else if (path.includes("/tuteurs/")) {
						navigate("/tuteurs");
					} else if (path === `/patients/${id}`) {
						navigate(`/patients`);
					} else if (path.includes(`/patients/${id}/soin`)) {
						navigate(`/patients/${id}`);
					}

					dispatch(toggleModal(false));
				}, 600);
			} else {
				setMessage({ status: "error", text: resBody.message });
			}
		} catch (error) {
			setMessage({
				status: "error",
				text: "Une erreur est survenue. Veuillez réessayer plus tard.",
			});
		}
	}

	// Handle modal close button click
	function handleClick(e) {
		dispatch(toggleModal(false));
	}

	// Validate the ID parameters from the URL and entity data
	// If they don't match, the modal won't show
	useEffect(() => {
		const isValid = idSoin
			? idSoin == entity.careId && id == entity.id
			: id == entity.id;
		setIsVerifying(isValid);
		
	}, [id, idSoin, entity]);

	return (
		<>
			{isVerifying && isModalOpen && (
				<section id="modal" className={isModalOpen ? "active" : "close"}>
					<div>
						<button className="close-button" onClick={handleClick}>
							<FontAwesomeIcon icon={faXmark} />
						</button>
						<p>Voulez vous vraiment supprimer {link && link.title}</p>
						<form onSubmit={handleSubmit}>
							<input
								type="text"
								name="name"
								value={formData.name}
								readOnly
							></input>
							<input type="hidden" name="id" value={formData.id} />
							<button type="submit">Confirmer la suppression</button>
						</form>
						<button className="cancel-button" onClick={handleClick}>
							Annuler
						</button>

						{message && <p className={message.status}>{message.text}</p>}
					</div>
				</section>
			)}
		</>
	);
}

RemoveEntity.propTypes = {
	entity: PropTypes.object.isRequired,
	link: PropTypes.object.isRequired,
};

export default RemoveEntity;
