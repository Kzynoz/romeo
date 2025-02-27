import { useDispatch, useSelector } from "react-redux";
import { NavLink, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faXmark } from "@fortawesome/free-solid-svg-icons";

import { logout } from "../features/authSlice";
import { toggleMenu } from "../features/menuSlice";

function Header() {
	const { isLogged } = useSelector((state) => state.auth);
	const { isMenuOpen } = useSelector((state) => state.menu);

	const dispatch = useDispatch();
	const navigate = useNavigate();

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

	function handleClick() {
		dispatch(toggleMenu());
	}

	return (
		<header>
			<div className="logo">
				<NavLink to="/" end>
					<img
						className="logo"
						src="mon-logo.svg"
						alt="Roméo, ton assistant facturation"
					/>
				</NavLink>
			</div>
			{isLogged && (
				<>
					<div className={`burger-menu`} onClick={handleClick}>
						{isMenuOpen ? close : open}
					</div>

					<nav className={isMenuOpen ? "active" : null}>
						<ul>
							<li>
								<NavLink to="/" end>
									Dashboard
								</NavLink>
							</li>
							<li>
								<NavLink to="patients" end>
									Patients
								</NavLink>
							</li>
							<li>
								<NavLink to="soins" end>
									Soins
								</NavLink>
							</li>
							<li>
								<NavLink to="tuteurs" end>
									Tuteurs
								</NavLink>
							</li>
							<li>
								<NavLink to="ehpads" end>
									Ehpads
								</NavLink>
							</li>
							<li>
								<NavLink to="statistiques" end>
									Statistiques
								</NavLink>
							</li>
							<li>
								<NavLink to="profil" end>
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
