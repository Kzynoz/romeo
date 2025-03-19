import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { validateForm } from "../utils/validator/FormValidator";

function AddRetirementHome() {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		name: "",
		contact: "",
		number: "",
		street: "",
		city: "",
		zip_code: "",
	});
	const [errors, setErrors] = useState({});
	const [message, setMessage] = useState({ status: "", text: "" });

	function handleChange(e) {
		setMessage("");
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
		const fieldValidation = validateForm({ [name]: value });

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
			const res = await fetch("http://localhost:9000/api/v1/retirement-homes", {
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
				}, 500);
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
		<>
			<header>
				<h1>Ajout d'un établissement</h1>
			</header>
			<section className="add-form">
				<form onSubmit={handleSubmit}>
					<fieldset>
						<legend>Contact</legend>
						<label htmlFor="name" className={errors.name ? "error" : ""}>
							Nom de l'établissement :
							<input
								type="text"
								id="name"
								name="name"
								maxLength="150"
								required
								value={formData.name}
								onChange={handleChange}
							></input>
							{errors.name && <p>{errors.name}</p>}
						</label>
						<label htmlFor="contact" className={errors.contact ? "error" : ""}>
							Personne responsable :
							<input
								type="text"
								id="contact"
								name="contact"
								maxLength="150"
								value={formData.contact}
								onChange={handleChange}
							></input>
							{errors.contact && <p>{errors.contact}</p>}
						</label>
					</fieldset>
					<fieldset>
						<legend>Adresse</legend>
						<label htmlFor="number" className={errors.number ? "error" : ""}>
							Numéro de rue :
							<input
								type="text"
								id="number"
								name="number"
								maxLength="10"
								value={formData.number}
								onChange={handleChange}
								required
							></input>
							{errors.number && <p>{errors.number}</p>}
						</label>
						<label htmlFor="street" className={errors.street ? "error" : ""}>
							Rue :
							<input
								type="text"
								id="street"
								name="street"
								maxLength="140"
								value={formData.street}
								onChange={handleChange}
								required
							></input>
							{errors.street && <p>{errors.street}</p>}
						</label>
						<label htmlFor="city" className={errors.city ? "error" : ""}>
							Ville :
							<input
								type="text"
								id="city"
								name="city"
								maxLength="100"
								value={formData.city}
								onChange={handleChange}
								required
							></input>
							{errors.city && <p>{errors.city}</p>}
						</label>
						<label
							htmlFor="zip-code"
							className={errors.zip_code ? "error" : ""}
						>
							Code postal :
							<input
								type="text"
								id="zip_code"
								name="zip_code"
								value={formData.zip_code}
								onChange={handleChange}
								required
							></input>
							{errors.zip_code && <p>{errors.zip_code}</p>}
						</label>
					</fieldset>
					<button type="submit">Ajouter</button>

					{message && <p className={message.status}>{message.text}</p>}
				</form>
			</section>
		</>
	);
}

export default AddRetirementHome;
