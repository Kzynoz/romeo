import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../features/authSlice";

function Login() {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [message, setMessage] = useState("");
	const [role, setRole] = useState("practitioner");

	const { isLogged } = useSelector((state) => state.auth);

	function onChangeEmail(e) {
		setEmail(e.target.value);
	}

	function onChangePassword(e) {
		setPassword(e.target.value);
	}

	function toggleRole() {
		setRole((prevRole) =>
			prevRole === "practitioner" ? "guardian" : "practitioner"
		);
		setMessage(null);
		setEmail("");
		setPassword("");
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const URL =
			role === "guardian"
				? "http://localhost:9000/api/v1/auth/login-guardian"
				: "http://localhost:9000/api/v1/auth/login";

		try {
			const res = await fetch(URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify({ email, password }),
			});

			const resJSON = await res.json();
			// navigate timeout + refaire error
			if (res.ok) {
				console.log("Connexion réussie:", resJSON.user);
				dispatch(login(resJSON.user));

				navigate("/");
			}

			setMessage({
				status: "error",
				text: resJSON.message,
			});
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
					Email
					<input
						type="email"
						id="email"
						name="email"
						value={email}
						onChange={onChangeEmail}
						placeholder="Entrer votre email"
					/>
				</label>
				<label htmlFor="password">
					Mot de passe
					<input
						type="password"
						id="password"
						name="password"
						autoComplete="current-password"
						value={password}
						onChange={onChangePassword}
						placeholder="Entrer votre mot de passe"
					/>
				</label>
				<button type="submit">Se connecter</button>
				{message && <p className={message.status}>{message.text}</p>}
			</form>
			<button type="button" onClick={toggleRole}>
				{role === "practitioner" ? "Je suis un tuteur" : "Je suis un praticien"}
			</button>
		</>
	);
}

export default Login;
