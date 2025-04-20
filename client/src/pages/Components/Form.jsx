import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import PropTypes from "prop-types";

import { retirementHomeValidator } from "../../utils/validator/retirementHomeValidator";
import { guardianValidator } from "../../utils/validator/guardianValidator";
import { careValidator } from "../../utils/validator/careValidator";

import { toggleEditing } from "../../features/menuSlice";

import { customFetch } from "../../service/api.js";

/**
 * Form Component handles the rendering, state management, and validation of a dynamic form
 * It supports multiple types of input fields, including text fields, selects, radio buttons, and textareas
 *
 * @param {object} formStructure - Structure of the form and the API endpoints URL
 * @param {object} initialFormData - Initial values for the form fields, if any
 * @param {boolean} isUpdated - Boolean flag indicating whether the form is for updating an existing entity
 *
 * @returns - The form
 */

function Form({ formStructure, initialFormData, isUpdated }) {
	const { id, idSoin } = useParams();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [formData, setFormData] = useState(
		generateFormData(formStructure.structure)
	);
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const practitionerId = useSelector((state) => state.auth);
	const location = useLocation();
	const path = location.pathname;

	// Associates the structure of the form with the passed data
	function generateFormData(structure) {
		const data = {};

		// Loops through all field groups in the form structure and associates the passed data from Props
		Object.keys(structure).forEach((fieldset) => {
			structure[fieldset].forEach((field) => {
				// Ensures initialFormData is not undefined and accesses the property dynamically
				data[field.name] = initialFormData?.[field.name] || "";
			});
		});

		return data;
	}

	function handleChange(e) {
		const { name, value } = e.target;
		console.log(`Changement sur ${name} => ${value}`);
		let fieldValidation = null;

		// Field validation upon change of values, different validation based on the URL
		if (path.includes("/maisons-retraite/")) {
			fieldValidation = retirementHomeValidator({ [name]: value }); // Using dynamic key
		}

		if (path.includes("/tuteurs/")) {
			fieldValidation = guardianValidator({ [name]: value });
		}

		if (path.includes(`/patients/${id}/soin/ajouter`)) {
			fieldValidation = careValidator({ [name]: value });
		}

		setMessage(null);

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		// Update errors only for this field
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: fieldValidation ? fieldValidation[name] : null, // Clears error if validation is OK
		}));
	}

	async function handleSubmit(e) {
		e.preventDefault();

		let newFormData;

		// Field validation when submitting the form
		if (path.includes("/maisons-retraite/")) {
			const formErrors = retirementHomeValidator(formData);

			if (Object.keys(formErrors).length > 0) {
				setErrors(formErrors);
				return;
			}

			// Create the object to send to the back-end
			newFormData = {
				...formData,
				contact: formData.contact || null,
			};
		}

		if (path.includes("/tuteurs/")) {
			const formErrors = guardianValidator(formData);

			if (Object.keys(formErrors).length > 0) {
				setErrors(formErrors);
				return;
			}

			if (formData.relationship === "société" && !formData.company) {
				return setMessage({
					status: "error",
					text: "Veuillez remplir le nom de votre société.",
				});
			}

			newFormData = {
				...formData,
				phone: formData.phone || null,
				company: formData.company || null,
				street: formData.street || null,
				zip_code: formData.zip_code || null,
				city: formData.city || null,
			};
		}

		if (path.includes(`/soin/${idSoin}`) || path.includes("/soin/ajouter")) {
			const formErrors = careValidator(formData);

			if (Object.keys(formErrors).length > 0) {
				setErrors(formErrors);
				return;
			}

			newFormData = {
				...formData,
				complements: formData.complements || null,

				practitioner_id: formData.practitioner_id
					? formData.practitioner_id
					: practitionerId.infos.id,

				patient_id: id || undefined,
				care_id: idSoin || undefined,
			};
		}

		// POST or PATCH method to add or modify an entity
		const options = {
			method: isUpdated ? "PATCH" : "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(newFormData),
		};

		try {
			setIsLoading(true);
			
			const res = await customFetch(`/${formStructure.url}`, options);

			if (res.ok) {
				const { message, response } = await res.json();
				
				setMessage({
					status: "success",
					text: message,
				});

				// Dynamic redirection after adding or updating an entity
				if (path.includes(`/patients/${id}/soin/ajouter`)) {
					return setTimeout(() => {
						navigate(`/patients/${id}/soin/${response}`);
					}, 600);
				}

				const url = path.match(/^\/([^\/]+)\/ajouter$/);

				if (url) {
					setTimeout(() => {
						navigate(`/${url[1]}`);
					}, 600);
				} else {
					setTimeout(() => {
						navigate(`${path}`);
						dispatch(toggleEditing(false));
					}, 600);
				}
			} else {
				const resBody = await res.json();  // Ensure response body is parsed

				if (res.status === 400 && resBody.errors) {
					// Accumulator to store express-validator errors in an object
					setErrors(
						resBody.errors.reduce(
							(acc, error) => ({
								...acc,
								[error.path]: error.msg,
							}),
							{}
						)
					);
				} else {
					// Reset errors and display the message in case of a generic error
					setErrors({});
					const { message } = resBody;  // Ensure correct message extraction
					setMessage({
						status: "error",
						text: message,
					});
				}
			}
		} catch (error) {
			console.log("Erreur lors de la mise à jour", error);

			setMessage({
				status: "error",
				text: "Une erreur est survenue, veuillez réessayer.",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				{/* Converts my object into a key-value array, the map allows us to iterate over the array 
				and retrieve the 'section' key and the 'fields' value */}
				{Object.entries(formStructure.structure).map(([section, fields]) => (
					<fieldset key={section}>
						<legend>
							{/* Replaces underscores with spaces and capitalizes the first letter of each word */}
							{section
								.replace(/_/g, " ")
								.replace(/\b\w/g, (char) => char.toUpperCase())}
						</legend>

						{/* Loops through each field and destructures the object to retrieve specific property values
						Avoids duplicate keys by concatenating name and index */}
						{fields.map(
							({ name, label, type, maxLength, required, options }, index) => (
								<label
									key={`${name}${index}`}
									htmlFor={name}
									className={errors[name] ? "error" : undefined}
								>
									{label} :
									{type === "select" ? (
										<select
											id={name}
											name={name}
											required={required}
											value={formData[name]}
											onChange={handleChange}
										>
											{/* Loops through the options and displays them in a select input */}
											{options &&
												options.map((option) => (
													<option key={option.value} value={option.value}>
														{option.label}
													</option>
												))}
										</select>
									) : type === "radio" ? (
										options &&
										options.map((option) => (
											<label key={option.value}>
												<input
													type="radio"
													id={name}
													name={name}
													value={option.value}
													required={required}
													onChange={handleChange}
													checked={formData[name] === option.value}
												/>
												{option.label}
											</label>
										))
									) : type === "textarea" ? (
										<textarea
											id={name}
											name={name}
											maxLength={maxLength}
											required={required}
											value={formData[name]}
											onChange={handleChange}
										/>
									) : (
										<input
											type={type}
											id={name}
											name={name}
											maxLength={maxLength}
											required={required}
											value={formData[name]}
											onChange={handleChange}
										/>
									)}
									{errors[name] && <p>{errors[name]}</p>}
								</label>
							)
						)}
					</fieldset>
				))}

				<button type="submit">{isUpdated ? "Modifier" : "Ajouter"}</button>

				{message && <p className={message.status}>{message.text}</p>}
				{isLoading && <p>En attente de traitement…</p>}
			</form>
		</>
	);
}

Form.defaultProps = {
	isUpdated: false,
};

Form.propTypes = {
	formStructure: PropTypes.object.isRequired,
	initialFormData: PropTypes.object.isRequired,
	isUpdated: PropTypes.bool.isRequired,
};

export default Form;