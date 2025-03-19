import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../../utils/validator/FormValidator";

function AddForm({ form }) {
	const navigate = useNavigate();
	const [formData, setFormData] = useState(generateFormData(form.structure));
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState({ status: "", text: "" });

	function generateFormData(structure) {
		const data = {};

		Object.keys(structure).forEach((fieldset) => {
			structure[fieldset].forEach((field) => {
				data[field.name] = "";
			});
		});

		return data;
	}

	function handleChange(e) {
		const { name, value } = e.target;
		const fieldValidation = validateForm({ [name]: value });

		setMessage("");
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		// Mise à jour des erreurs uniquement pour ce champ
		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: fieldValidation[name] || null, // Efface l'erreur si la validation est OK
		}));
	}

	async function handleSubmit(e) {
		e.preventDefault();
		setErrors({});

		// validation des champs
		const formErrors = validateForm(formData);
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		const newFormData = {
			...formData,
			contact: formData.contact || null,
		};

		try {
			const res = await fetch(`http://localhost:9000/api/v1/${form.url}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(newFormData),
			});

			const resBody = await res.json();

			if (res.ok) {
				setMessage({
					status: "success",
					text: "L'établissement a été ajouté avec succès !",
				});

				setTimeout(() => {
					navigate("/");
				}, 600);
			} else if (res.status === 400) {
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
		<form onSubmit={handleSubmit}>
			{Object.entries(form.structure).map(([section, fields]) => (
				<fieldset key={section}>
					<legend>
						{section
							.replace(/_/g, " ")
							.replace(/\b\w/g, (char) => char.toUpperCase())}
					</legend>

					{fields.map(({ name, label, type, maxLength, required }) => (
						<label
							key={name}
							htmlFor={name}
							className={errors[name] ? "error" : ""}
						>
							{label} :
							<input
								type={type}
								id={name}
								name={name}
								maxLength={maxLength}
								required={required}
								value={formData[name]}
								onChange={handleChange}
							/>
							{errors[name] && <p>{errors[name]}</p>}
						</label>
					))}
				</fieldset>
			))}

			<button type="submit">Ajouter</button>

			{message && <p className={message.status}>{message.text}</p>}
		</form>
	);
}

export default AddForm;
