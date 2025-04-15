import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark, faPowerOff } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/img/logo-romeo.svg";

import { logout } from "../features/authSlice";
import { toggleMenu } from "../features/menuSlice";
import { useEffect, useState } from "react";

function Header() {
	const { isLogged } = useSelector((state) => state.auth);
	const { isMenuOpen } = useSelector((state) => state.menu);
	const {
		infos: { role },
	} = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const year = new Date().getFullYear();

	const open = <FontAwesomeIcon icon={faBars} />;
	const close = <FontAwesomeIcon icon={faXmark} />;

	const date = new Date().toLocaleDateString("fr-FR", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});

	async function handleLogout() {
		try {
			const res = await fetch("http://localhost:9000/api/v1/auth/logout", {
				method: "POST",
				credentials: "include",
			});

			console.log(res);

			if (res.ok) {
				dispatch(logout());
				navigate("/");
			}
		} catch (error) {
			console.log(error);
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

							{/*  À FAIRE							
							<li>
								<NavLink to="profil" onClick={handleClick} end>
									Profil
								</NavLink>
							</li> */}
						</ul>

						<button onClick={handleLogout}>
							<FontAwesomeIcon icon={faPowerOff} />
							<span>Déconnexion</span>
						</button>
					</nav>
				</>
			)}
		</header>
	);
}

export default Header;
