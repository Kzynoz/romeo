import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/img/logo-romeo.svg";

import { logout } from "../features/authSlice";
import { toggleMenu } from "../features/menuSlice";

import { customFetch } from "../service/api.js";

function Header() {
	// Extract necessary values from Redux store using useSelector
	const { isLogged } = useSelector((state) => state.auth);
	const { isMenuOpen } = useSelector((state) => state.menu);
	const {
		infos: { role },
	} = useSelector((state) => state.auth);
	const [error, setError] = useState(null);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const open = <FontAwesomeIcon icon={faBars} />;
	const close = <FontAwesomeIcon icon={faXmark} />;

	const year = new Date().getFullYear();
	const date = new Date().toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	// Handle logout: Make an API call to log the user out
	async function handleLogout() {
		const options = {
			method: "POST",
			credentials: "include",
		};

		try {
			// API call to logout endpoint
			const res = await customFetch("/auth/logout", options);

			if (res.ok) {
				dispatch(logout());
				navigate("/");
			} else {
				setError("Une erreur est survenue, veuillez réessayer plus tard");
			}
		} catch (error) {
			setError("Une erreur est survenue, veuillez réessayer plus tard");
		}
	}

	// Toggle du menu ou fermeture si on clique sur un lien
	function handleClick(e) {
		if (e.target.tagName === "A") {
			dispatch(toggleMenu(false));
		} else {
			dispatch(toggleMenu());
		}
	}

	return (
		<header>
			<div className="logo">
				<NavLink to="/" end>
					<img
						className="logo"
						src={logo}
						alt="Roméo, ton assistant facturation"
					/>
				</NavLink>
			</div>

			{date && <span className="current-date">{date}</span>}

			{/* Only show the menu if the user is logged in */}
			{isLogged && (
				<>
					<div className={`burger-menu`} onClick={handleClick}>
						{isMenuOpen ? close : open}
					</div>

					<nav className={isMenuOpen ? "active" : null}>
						<ul>
							<li>
								<NavLink to="/" end onClick={handleClick}>
									Dashboard
								</NavLink>
							</li>
							<li>
								<NavLink to="patients" onClick={handleClick}>
									Patients
								</NavLink>
							</li>

							{role === "practitioner" && (
								<>
									<li>
										<NavLink to="soins" onClick={handleClick}>
											Soins
										</NavLink>
									</li>
									<li>
										<NavLink to="tuteurs" onClick={handleClick}>
											Tuteurs
										</NavLink>
									</li>
									<li>
										<NavLink to="maisons-retraite" onClick={handleClick}>
											Établissements
										</NavLink>
									</li>
									<li>
										<NavLink
											to={`statistiques/${year}`}
											onClick={handleClick}
											end
										>
											Statistiques
										</NavLink>
									</li>
								</>
							)}
						</ul>

						{/* Logout action button */}
						<button onClick={handleLogout}>
							<FontAwesomeIcon icon={faPowerOff} />
							<span>Déconnexion</span>
						</button>

						{error && <p>{error}</p>}
					</nav>
				</>
			)}
		</header>
	);
}

export default Header;