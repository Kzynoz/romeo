import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import SearchCard from "./Components/SearchBar/SearchCard";

import { patientValidator } from "../utils/validator/patientValidator";

import { toggleEditing } from "../features/menuSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

import { customFetch } from "../service/api.js";
import useHead from "../hooks/useHead";

import PropTypes from "prop-types";

function FormPatient({ data }) {
	
	const [guardianDatas, setGuardianDatas] = useState(null);
	const [retirementDatas, setRetirementDatas] = useState(null);
	const [message, setMessage] = useState("");
	
	// Allows retrieving properties from data only if data is not null;
	// uses nullish coalescing to assign an empty string if the value is undefined or null
	const [formData, setFormData] = useState({
		
		title:					data?.title 				?? "",
		firstname:				data?.firstname 			?? "",
		lastname:				data?.lastname				?? "",
		phone:					data?.phone 				?? "",
		guardian_id:			data?.guardian?.id			?? "",
		retirement_home_id:		data?.retirement_home?.id	?? "",
		
	});
	
	const [guardianQuery, setGuardianQuery] = useState("");
	const [retirementQuery, setRetirementQuery] = useState("");
	const [errors, setErrors] = useState({});

	const location = useLocation();
	const path = location.pathname;
	
	const navigate = useNavigate();
	const dispatch = useDispatch();
	
	// Set title and meta description
	useHead("Ajout d'un nouveau patient","Ajout d'un patient dans Roméo.");

	// Redirect to the appropriate page based on whether a patient was created or updated
	function handleRedirection() {
		
		if (data) {
			
			navigate(`${path}`);
			dispatch(toggleEditing(false));
		} else {
			
			navigate("/patients");
		}
	}

	// Updates formData when listening to a change in a field
	function handleChange(e) {
		const { name, value } = e.target;

		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));

		setErrors((prevErrors) => ({
			...prevErrors,
			[name]: "",
		}));
	}

	// Updates formData with ID when listening to a change in a select
	function handleSelect(type, result) {
		
		setFormData((prev) => ({
			...prev,
			[type]: result.id,
		}));
		
		// Sets the field value with name and not ID and removes the result list
		// Search Card needs an ID and not name or title,firstname and lastname
		if (type === "guardian_id") {
			
			setGuardianQuery(`${result.title} ${result.firstname} ${result.lastname}`);
			setGuardianDatas(null);
			
		} else if (type === "retirement_home_id") {
			
			setRetirementQuery(result.name);
			setRetirementDatas(null);
		}

		setErrors((prevErrors) => ({
			...prevErrors,
			[type]: "",
		}));
	}

	// Manages search input by querying the API, updating the result list, clearing it if needed, and handling potential errors.
	async function handleChangeSearch(e, type) {
		
		const search = e.target.value;
		
		// If search is empty, clear the corresponding data 
		if (!search) {
			
			if (type === "guardians") {
				
				setGuardianDatas(null);
				
			} else if (type === "retirement-homes") {
				
				setRetirementDatas(null);
			}
		}
		
		const options = {
			credentials: "include",	
		}


		try {
			const res = await customFetch(`/${type}/search?q=${search}`, options);
			const { response, message } = await res.json();

			if (res.ok) {
				
				// Set result list with the response of the backend
				if (type === "guardians") {
					
					setGuardianDatas(response);
				} else if (type === "retirement-homes") {
					
					setRetirementDatas(response);
				}

				// Clear the specific error field
				setErrors((prevErrors) => ({
					...prevErrors,
					[type === "guardians" ? "guardian_id" : "retirement_home_id"]: "",
				}));
				
			} else {
				
				// Clear the result list 
				if (type === "guardians") {
					
					setGuardianDatas(null);
				} else if (type === "retirement-homes") {
					
					setRetirementDatas(null);
				}
				
				// Set errors with the response error of the backend
				setErrors((prevErrors) => ({
					...prevErrors,
					[type === "guardians" ? "guardian_id" : "retirement_home_id"]:
						message,
				}));
			}
		} catch (error) {
			
			console.error("error", error);
			setErrors((prevErrors) => ({
				...prevErrors,
				[type === "guardians" ? "guardian_id" : "retirement_home_id"]: "Une erreur est survenue, veuillez réessayer plus tard.",
			}));
		}
	}

	// Action on submit form
	async function handleSubmit(e) {
		
		e.preventDefault();

		// Validates the form data using the patientValidator function
		// If there are any errors, sets the errors state and exits the function
		const formErrors = patientValidator(formData);
		
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}
		
		const options = {
			method: data ? "PATCH" : "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(formData),
		}
		
		// The URL differs depending on whether it's an update or a create operation
		const URL = data
			? `/patients/${data.id}`
			: "/patients/";

		try {
			
			const res = await customFetch(URL, options);
			const resBody = await res.json();

			if (res.ok) {
				
				setMessage({
					status: "success",
					text: resBody.message,
				});

				// Redirect on whether it's an update or a create operation
					return setTimeout(() => {
						handleRedirection();
					}, 600);
					
			} else if (res.status === 400 && resBody.errors) {
				
				// Accumulator to store express-validator errors in an object with "path": "error"
				setErrors(
					resBody.errors.reduce(
						(acc, error) => ({
							...acc, // Spread the previous accumulator 
							[error.path]: error.msg, // Add the current error path as the key and message as value
						}),
						{} // Initial value is an empty object
					)
				);
			} else {
				
				setMessage({
					status: "error",
					text: resBody.message,
				});
			}
		} catch (error) {

			setMessage({
				status: "error",
				text: "Une erreur est survenue, veuillez réessayer.",
			});
		}
	}

	// useEffect that triggers on every change of 'data', uses for update action
	useEffect(() => {
		
		// If 'data' contains a guardian, update the form with their information
		if (data?.guardian != null) {
			
			setGuardianQuery(
				`${data.guardian.title} ${data.guardian.firstname} ${data.guardian.lastname}`
			);
			
			// Update the guardian ID in 'formData'
			setFormData((prev) => ({
				...prev,
				guardian_id: data.guardian.id,
			}));
		} else {
			
			// If no guardian is present in 'data', resdet the search and guardian ID
			setGuardianQuery("");
			
			setFormData((prev) => ({
				...prev,
				guardian_id: "",
			}));
		}

		// Same thing for retirement home
		if (data?.retirement_home != null) {
			
			setRetirementQuery(data.retirement_home.name ?? "");
			setFormData((prev) => ({
				...prev,
				retirement_home_id: data.retirement_home.id ?? "",
			}));
		} else {
			
			setRetirementQuery("");
			
			setFormData((prev) => ({
				...prev,
				retirement_home_id: "",
			}));
		}
		
	}, [data]);

	return (
		
		<section id={data ? "update-form" : undefined}>
			<header>
				<h1>{data ? "Modifier le patient" : "Ajouter un patient"}</h1>
				<button
					className="close-button"
					onClick={() => {
						handleRedirection();
					}}
				>
					<FontAwesomeIcon icon={faXmark} />
				</button>
			</header>
			<form onSubmit={handleSubmit}>
				<fieldset>
					<legend>Informations sur le patient</legend>
					
						{/* Label for the title. 
							Applies an error class if there's an error message for it */}
					<label htmlFor="title" className={errors.title ? "error" : undefined}>
						Civilité :
						<label>
							<input
								id="title"
								type="radio"
								value="m."
								name="title"
								onChange={handleChange}
								checked={formData.title === "m."}
							/>
							Monsieur
						</label>
						<label>
							<input
								id="title"
								type="radio"
								value="mme"
								name="title"
								onChange={handleChange}
								checked={formData.title === "mme"}
							/>
							Madame
						</label>
						
						{/* Displays an error message if there's a validation error for the title */}
						{errors.title && <p>{errors.title}</p>}
						
					</label>
					<label
						htmlFor="firstname"
						className={errors.firstname ? "error" : undefined}
					>
						Prénom*:
						<input
							type="text"
							id="firstname"
							name="firstname"
							maxLength="50"
							value={formData.firstname}
							onChange={handleChange}
						/>
						
						{errors.firstname && <p>{errors.firstname}</p>}
					</label>
					<label
						htmlFor="lastname"
						className={errors.lastname ? "error" : undefined}
					>
						Nom*:
						<input
							type="text"
							id="lastname"
							name="lastname"
							maxLength="150"
							value={formData.lastname}
							onChange={handleChange}
						/>
						
						{errors.lastname && <p>{errors.lastname}</p>}
					</label>
				</fieldset>
				
				{/* Fieldset for selecting a guardian with a search input field  */}
				<fieldset>
					<label
						htmlFor="guardian_id"
						className={errors.guardian_id ? "error" : undefined}
					>
						Tuteur
						<input
							id="guardian_id"
							type="search"
							placeholder="Rechercher un tuteur"
							
							// Binds the guardian query value to state and triggers serch when input changes
							value={guardianQuery}
							
							// Updates the query and trigger the search when the input changes
							onChange={(e) => {
								setGuardianQuery(e.target.value);
								handleChangeSearch(e, "guardians");
							}}
						/>
						
						{/* Displays an error message if there's a validation error for the guardian ID */}
						{errors.guardian_id && <p>{errors.guardian_id}</p>}
						
					</label>
					
					{/* Displays the search's result */}
					{guardianDatas &&
						guardianDatas.map((result, index) => (
						
							<SearchCard
								key={index}
								result={result}
								entityType={"guardian"}
								onSelect={() => handleSelect("guardian_id",result)} // Defines an onSelect handler for when a user selects a guardian
							/>
						))}

					<Link to="/tuteurs/ajouter">Ajouter un tuteur</Link>
					
				</fieldset>
				<fieldset>
					<label
						htmlFor="retirement_home_id"
						className={errors.retirement_home_id ? "error" : undefined}
					>
						Maison de retraite
						<input
							id="retirement_home_id"
							type="search"
							placeholder="Rechercher une maison de retraite"
							value={retirementQuery}
							onChange={(e) => {
								setRetirementQuery(e.target.value);
								handleChangeSearch(e, "retirement-homes");
							}}
						/>
						
						{errors.retirement_home_id && <p>{errors.retirement_home_id}</p>}
						
					</label>
					
					{retirementDatas &&
						retirementDatas.map((result, index) => (
						
							<SearchCard
								key={index}
								result={result}
								entityType={"retirement-homes"}
								onSelect={() =>
									handleSelect("retirement_home_id", result)
								}
							/>
						))}
						
					<Link to="/maisons-retraite/ajouter">
						Ajouter une maison de retraite
					</Link>
					
				</fieldset>
				
				<button type="submit">{data ? "Modifier" : "Ajouter"}</button>

				{message && <p className={message.status}>{message.text}</p>}
				
			</form>
		</section>
	);
}

FormPatient.propTypes = {
	data: PropTypes.object,
};

export default FormPatient;
