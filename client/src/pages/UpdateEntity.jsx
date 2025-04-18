import { useEffect, useState } from "react";

import { useLocation, useNavigate, useParams } from "react-router-dom";

import PropTypes from "prop-types";

import Form from "./Components/Form.jsx";
import { formRetirementHome } from "../utils/formStructure/formRetirementHome.js";
import { formGuardian } from "../utils/formStructure/formGuardian.js";
import { formCare } from "../utils/formStructure/formCare.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";


/**
 * The UpdateEntity component allows updating different entities (retirement homes, guardians, or care)
 * based on the URL and ID. It dynamically renders the appropriate form structure based on the type of entity
 *
 * @param {object} data - The entity data to be updated
 * 
 * @returns - The form for updating the entity or an error message if the data is unavailable
 */
 
function UpdateEntity({ data }) {
	
	const { id, idSoin } = useParams();
	
	const navigate = useNavigate();
	const location = useLocation();
	const path = location.pathname;

	const [formSetting, setFormSetting] = useState(null);
	const [formData, setFormData] = useState({});
	const [isVerifying, setIsVerifying] = useState(false);
	
	// Redirection based on the URL
	function handleRedirection() {
		
		const segments = path.split("/").filter(Boolean);

		if (segments.length === 2) {
			
			navigate(`/${segments[0]}`);
		} else if (segments.length > 2) {
			
			navigate(`/${segments[0]}/${segments[1]}`);
		}
	}

	// Set up the entity to be updated based on the URL
	useEffect(() => {
		
		function handleRoute() {
			
			// Updating Retirement Homes
			if (path === `/maisons-retraite/${id}`) {
				
				setFormSetting({
					title: "l'établissement",
					form: {
						...formRetirementHome,
						url: `retirement-homes/${id}`,
					},
				});

				if (data.name && data.street && data.city && data.zip_code) {
					
					const filtredData = {
						name: data.name,
						contact: data.contact || null,
						street: data.street,
						city: data.city,
						zip_code: data.zip_code,
					};

					setFormData(filtredData);
				} else {
					
					setIsVerifying(true);
				}
			}

			// Updating Guardians
			if (path === `/tuteurs/${id}`) {
				
				setFormSetting({
					title: "le tuteur",
					form: {
						...formGuardian,
						url: `guardians/${id}`,
					},
				});

				if (data.details) {
					
					const filtredData = {
						title: data.details.title,
						firstname: data.details.firstname,
						lastname: data.details.lastname,
						phone: data.details.phone || null,
						email: data.details.email,
						relationship: data.relationship,
						company: data.company || null,
						street: data.address?.street || null,
						city: data.address?.city || null,
						zip_code: data.address?.zip_code || null,
					};

					setFormData(filtredData);
				} else {
					
					setIsVerifying(true);
				}
			}

			// Updating Care
			if (path === `/patients/${id}/soin/${idSoin}`) {
				
				setFormSetting({
					title: "le soin",
					form: {
						...formCare,
						url: `care/${id}`,
					},
				});

				if (data.care) {
					
					const date = new Date(data.care.performed_at).toLocaleDateString(
						"fr-CA"
					);

					const filtredData = {
						performed_at: date,
						practitioner_id: data.practitioner_id,
						price: data.care.price,
						type: data.care.type,
						complements: data.complements || null,
						invoice_send: data.care.invoice?.invoice_send ? "1" : "0",
						invoice_paid: data.care.invoice?.invoice_paid ? "1" : "0",
					};

					setFormData(filtredData);
				} else {
					
					setIsVerifying(true);
				}
			}
		}
		
		handleRoute();
		
	}, [path, id, data]);

	// If there's an error in creating my data to send to the update form, show an error
	if (isVerifying) {
		
		return <p>Une erreur est survenue. Veuillez réessayer plus tard.</p>;
	}

	return (
		<>
			{!formSetting ? (
				<p>Une erreur est survenue. Veuillez réessayer</p>
				
			) : (
				<>
					<section id="update-form">
						<header>
							<h1>Modifier {formSetting.title}</h1>
							<button
								className="close-button"
								onClick={() => {
									handleRedirection();
								}}
							>
								<FontAwesomeIcon icon={faXmark} />
							</button>
						</header>

						<Form
							formStructure={formSetting.form}
							initialFormData={formData}
							isUpdated={true}
						/>
						
					</section>
				</>
			)}
		</>
	);
}

UpdateEntity.propTypes = {
	data: PropTypes.object.isRequired,
};


export default UpdateEntity;
