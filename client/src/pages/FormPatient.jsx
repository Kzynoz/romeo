import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import SearchCard from "./Components/SearchBar/SearchCard";
import { patientValidator } from "../utils/validator/patientValidator";

import { toggleEditing } from "../features/menuSlice";

function FormPatient({ data }) {
	const [guardianDatas, setGuardianDatas] = useState(null);
	const [retirementDatas, setRetirementDatas] = useState(null);
	const [message, setMessage] = useState("");
	const [formData, setFormData] = useState({
		title: data?.title || "",
		firstname: data?.firstname || "",
		lastname: data?.lastname || "",
		phone: data?.phone || "",
		guardian_id: data?.guardian?.id || "",
		retirement_home_id: data?.retirement_home?.id || "",
	});
	const [guardianQuery, setGuardianQuery] = useState("");
	const [retirementQuery, setRetirementQuery] = useState("");
	const [errors, setErrors] = useState({});

	const location = useLocation();
	const path = location.pathname;
	const navigate = useNavigate();
	const dispatch = useDispatch();

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

	function handleSelect(entityType, id, name) {
		setFormData((prev) => ({
			...prev,
			[entityType]: id,
		}));

		if (entityType === "guardian_id") {
			setGuardianQuery(name);
			setGuardianDatas(null);
		} else if (entityType === "retirement_home_id") {
			setRetirementQuery(name);
			setRetirementDatas(null);
		}

		setErrors((prevErrors) => ({
			...prevErrors,
			[entityType]: "",
		}));
	}

	async function handleChangeSearch(e, type) {
		const search = e.target.value;
		if (!search) {
			if (type === "guardians") {
				setGuardianDatas(null);
			} else if (type === "retirement-homes") {
				setRetirementDatas(null);
			}
		}

		try {
			const res = await fetch(
				`http://localhost:9000/api/v1/${type}/search?q=${search}`,
				{
					credentials: "include",
				}
			);
			const { response, message } = await res.json();

			if (res.ok) {
				if (type === "guardians") {
					setGuardianDatas(response);
				} else if (type === "retirement-homes") {
					setRetirementDatas(response);
				}

				setErrors((prevErrors) => ({
					...prevErrors,
					[type === "guardians" ? "guardian_id" : "retirement_home_id"]: "",
				}));
			} else {
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
				[type === "guardians" ? "guardian_id" : "retirement_home_id"]: message,
			}));
		}
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const formErrors = patientValidator(formData);
		if (Object.keys(formErrors).length > 0) {
			setErrors(formErrors);
			return;
		}

		try {
			const res = await fetch(
				data
					? `http://localhost:9000/api/v1/patients/${data.id}`
					: "http://localhost:9000/api/v1/patients/",
				{
					method: data ? "PATCH" : "POST",
					headers: {
						"Content-Type": "application/json",
					},
					credentials: "include",
					body: JSON.stringify(formData),
				}
			);

			const resBody = await res.json();

			if (res.ok) {
				setMessage({
					status: "success",
					text: resBody.message,
				});

				if (data) {
					return setTimeout(() => {
						navigate(`${path}`);
						dispatch(toggleEditing(false));
					}, 600);
				} else {
					setTimeout(() => {
						navigate(`/patients`);
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

	useEffect(() => {
		if (data?.guardian) {
			setGuardianQuery(
				`${data.guardian.title} ${data.guardian.firstname} ${data.guardian.lastname}`
			);
			setFormData((prev) => ({
				...prev,
				guardian_id: data.guardian.id,
			}));
		}

		if (data?.retirement_home) {
			setRetirementQuery(data.retirement_home.name);
			setFormData((prev) => ({
				...prev,
				retirement_home_id: data.retirement_home.id,
			}));
		}
	}, [data]);

	return (
		<form onSubmit={handleSubmit}>
			<fieldset>
				<legend>Informations sur le patient</legend>
				<label htmlFor="title" className={errors.title ? "error" : ""}>
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
					{errors.title && <p>{errors.title}</p>}
				</label>
				<label htmlFor="firstname" className={errors.firstname ? "error" : ""}>
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
				<label htmlFor="lastname" className={errors.lastname ? "error" : ""}>
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
			<fieldset>
				<label
					htmlFor="guardian_id"
					className={errors.guardian_id ? "error" : ""}
				>
					Tuteur
					<input
						id="guardian_id"
						type="search"
						placeholder="Rechercher un tuteur"
						value={guardianQuery}
						onChange={(e) => {
							setGuardianQuery(e.target.value);
							handleChangeSearch(e, "guardians");
						}}
					/>
					{errors.guardian_id && <p>{errors.guardian_id}</p>}
				</label>
				{guardianDatas &&
					guardianDatas.map((result, index) => (
						<SearchCard
							key={index}
							result={result}
							entityType={"guardian"}
							onSelect={() =>
								handleSelect(
									"guardian_id",
									result.id,
									`${result.title} ${result.firstname} ${result.lastname}`
								)
							}
						/>
					))}

				<Link to="tuteurs/ajouter">Ajouter un tuteur</Link>
			</fieldset>
			<fieldset>
				<label
					htmlFor="retirement_home_id"
					className={errors.retirement_home_id ? "error" : ""}
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
								handleSelect("retirement_home_id", result.id, result.name)
							}
						/>
					))}
				<Link to="maisons-retraite/ajouter">
					Ajouter une maison de retraite
				</Link>
			</fieldset>
			<button type="submit">{data ? "Modifier" : "Ajouter"}</button>

			{message && <p className={message.status}>{message.text}</p>}
		</form>
	);
}

export default FormPatient;
