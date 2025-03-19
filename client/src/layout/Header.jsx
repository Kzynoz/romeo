import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/img/logo-romeo.svg";

import { logout } from "../features/authSlice";
import { toggleMenu } from "../features/menuSlice";
import { useEffect, useState } from "react";

function Header() {
	const { isLogged } = useSelector((state) => state.auth);
	const { isMenuOpen } = useSelector((state) => state.menu);
	const [date, setDate] = useState(null);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const year = new Date().getFullYear();

	const open = <FontAwesomeIcon icon={faBars} />;
	const close = <FontAwesomeIcon icon={faXmark} />;

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

	function handleDelayedMenuClose() {
		setTimeout(function () {
			dispatch(toggleMenu());
		}, 200);
	}

	function handleClick(e) {
		if (e.target.tagName === "A") {
			handleDelayedMenuClose();
		} else {
			dispatch(toggleMenu());
		}
	}

	function getDate() {
		const options = { day: "numeric", month: "short", year: "numeric" };
		const today = new Date();
		return today.toLocaleDateString("fr-FR", options);
	}

	useEffect(() => {
		setDate(getDate());
	}, []);

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
									Maisons de retraite
								</NavLink>
							</li>
							<li>
								<NavLink to={`statistiques/${year}`} onClick={handleClick} end>
									Statistiques
								</NavLink>
							</li>
							<li>
								<NavLink to="profil" onClick={handleClick} end>
									Profil
								</NavLink>
							</li>
						</ul>

						<button onClick={handleLogout}>Déconnexion</button>

						<NavLink to="contact" end>
							Signaler un bug
						</NavLink>
					</nav>
				</>
			)}
		</header>
	);
}

export default Header;
