import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../features/authSlice";
import { customFetch } from "../../service/api.js";

import useHead from "../../hooks/useHead";

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Local state for email, password, and error/message handling
	const [email, setEmail] = useState("");
	const [errors,setErrors] = useState({});
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [role, setRole] = useState("practitioner");

	const { isLogged } = useSelector((state) => state.auth);
	
	// Set title and meta description
	useHead("Connexion","Page de connexion");
	
	// Handle email input change
	function onChangeEmail(e) {
		const value = e.target.value;
		const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		
		setEmail(value);
		
		if (!value) {
			setErrors((prev) => ({ ...prev, email: "L'email est obligatoire." }));
		} else if (!regex.test(value)) {
			setErrors({ email:"L'email doit être au format valide" });
		} else {
			setErrors((prev) => ({ ...prev, email: null }));
		}
		
		setMessage("");
	}

	// Handle password input change
	function onChangePassword(e) {
		const value = e.target.value;
		
		setPassword(e.target.value);
		
		if (!value) {
			setErrors((prev) => ({ ...prev, password: "Le mot de passe est obligatoire." }));
		} else {
			setErrors((prev) => ({ ...prev, password: null }));
		}
		
		setMessage("");
	}

	// Toggle between "practitioner" and "guardian" roles
	function toggleRole() {
		setRole((prevRole) =>
			prevRole === "practitioner" ? "guardian" : "practitioner"
		);
		setMessage(null);
		setEmail("");
		setPassword("");
	}

	// Handle form submission for login
	async function handleSubmit(e) {
		e.preventDefault();

		const URL = role === "guardian" ? "/auth/login-guardian" : "/auth/login";

		const options = {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			credentials: "include",
			body: JSON.stringify({ email, password }),
		};

		try {
			const res = await customFetch(URL, options);
			const resJSON = await res.json();

			if (res.ok) {
				dispatch(login(resJSON.user));
				navigate("/");
			} else if (res.status === 400 && resJSON.errors) {
				// Accumulator to store express-validator errors in an object with "path": "error"
				setErrors(
					resJSON.errors.reduce(
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
					text: resJSON.message,
				});
			}
		} catch (error) {
			setMessage({
				status: "error",
				text: "Une erreur est survenue, veuillez réessayer plus tard.",
			});
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<h1>Connexion {role === "guardian" ? "tuteur" : "praticien"}</h1>
				<label htmlFor="email" className={errors.email ? "error" : undefined}>
					Email *:
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={onChangeEmail}
						placeholder="Entrer votre email"
						autoComplete="email"
						aria-required="true"
					/>
					
				{errors.email && <p>{errors.email}</p>}
				</label>
				
				<label htmlFor="password" className={errors.password ? "error" : undefined}>
					Mot de passe *:
					<input
						type="password"
						id="password"
						name="password"
						autoComplete="current-password"
						value={password}
						onChange={onChangePassword}
						placeholder="Entrer votre mot de passe"
						aria-required="true"
					/>
				{errors.password && <p>{errors.password}</p>}
				</label>
				
				<button type="submit" disabled={errors.email || errors.password ? true : "" }>Se connecter</button>

				{message && <p className={message.status} role="alert">{message.text}</p>}
			</form>

			{/* Toggle between practitioner and guardian roles */}
			<button 
				type="button" 
				onClick={toggleRole} 
				aria-label={
					role === "practitioner"
    					? "Basculer en tant que tuteur"
    					: "Basculer en tant que praticien"
				}
			>
				{role === "practitioner" ? "Je suis un tuteur" : "Je suis un praticien"}
			</button>
		</>
	);
}

export default Login;