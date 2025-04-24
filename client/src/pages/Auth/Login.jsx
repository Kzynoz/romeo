import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { login } from "../../features/authSlice";
import { customFetch } from "../../service/api.js";

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	// Local state for email, password, and error/message handling
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [role, setRole] = useState("practitioner");

	const { isLogged } = useSelector((state) => state.auth);
	
	// Handle email input change
	function onChangeEmail(e) {
		setEmail(e.target.value);
	}

	// Handle password input change
	function onChangePassword(e) {
		setPassword(e.target.value);
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
				<label htmlFor="email">
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
				</label>
				<label htmlFor="password">
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
				</label>
				<button type="submit">Se connecter</button>

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