import PropTypes from "prop-types";

import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { retirementHomeValidator } from "../../utils/validator/retirementHomeValidator";
import { guardianValidator } from "../../utils/validator/guardianValidator";
import { careValidator } from "../../utils/validator/careValidator";

import { toggleEditing } from "../../features/menuSlice";

function Form({ formStructure, initialFormData, isUpdated }) {
	const { id, idSoin } = useParams();
	const practitionerId = useSelector((state) => state.auth);

	const navigate = useNavigate();
	const [formData, setFormData] = useState(
		generateFormData(formStructure.structure)
	);

	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState("");

	const location = useLocation();
	const path = location.pathname;

	const dispatch = useDispatch();

	function generateFormData(structure) {
		const data = {};
		Object.keys(structure).forEach((fieldset) => {
			structure[fieldset].forEach((field) => {
				data[field.name] = initialFormData?.[field.name] || "";
			});
		});
		console.log("generated form", data);
		return data;
	}

	function handleChange(e) {
		const { name, value } = e.target;
		console.log(`Changement sur ${name} => ${value}`);
		let fieldValidation = null;

		if (path.includes("/maisons-retraite/")) {
			fieldValidation = retirementHomeValidator({ [name]: value });
		}

		if (path.includes("/tuteurs/")) {
			fieldValidation = guardianValidator({ [name]: value });
		}

		if (path.includes(`/patients/${id}/soin/ajouter`)) {
			fieldValidation = careValidator({ [name]: value });
		}

		setMessage("");
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		// Mise à jour des erreurs uniquement pour ce champ
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: fieldValidation ? fieldValidation[name] : null, // Efface l'erreur si la validation est OK À ÉTÉ CHANGÉ
		}));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		let newFormData;

		if (path.includes("/maisons-retraite/")) {
			// validation des champs
			const formErrors = retirementHomeValidator(formData);
			if (Object.keys(formErrors).length > 0) {
				setErrors(formErrors);
				return;
			}

			newFormData = {
				...formData,
				contact: formData.contact || null,
			};
		}

		if (path.includes("/tuteurs/")) {
			// validation des champs
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
			// validation des champs
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

		try {
			console.log("newFormData", newFormData);
			const res = await fetch(
				`http://localhost:9000/api/v1/${formStructure.url}`,
				{
					method: isUpdated ? "PATCH" : "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(newFormData),
				}
			);

			const resBody = await res.json();

			if (res.ok) {
				setMessage({
					status: "success",
					text: resBody.message,
				});

				if (path.includes(`/patients/${id}/soin/ajouter`)) {
					return setTimeout(() => {
						navigate(`/patients/${id}/soin/${resBody.response}`);
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
			} else if (res.status === 400 && resBody.errors) {
				// Accumulateur pour stocker les erreurs de express-validator dans un objet avec "path": "error"
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
				setErrors({});
				setMessage({
					status: "error",
					text: resBody.message,
				});
			}
		} catch (error) {
			console.log("Erreur lors de la mise à jour", error);

			setMessage({
				status: "error",
				text: "Une erreur est survenue, veuillez réessayer.",
			});
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				{Object.entries(formStructure.structure).map(([section, fields]) => (
					<fieldset key={section}>
						<legend>
							{section
								.replace(/_/g, " ")
								.replace(/\b\w/g, (char) => char.toUpperCase())}
						</legend>

						{fields.map(
							({ name, label, type, maxLength, required, options }, index) => (
								<label
									key={name + index}
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
			</form>
		</>
	);
}

export default Form;

Form.defaultProps = {
	isUpdated: false,
};

Form.propTypes = {
	formStructure: PropTypes.object.isRequired,
	initialFormData: PropTypes.object.isRequired,
	isUpdated: PropTypes.bool.isRequired,
};
