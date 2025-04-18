import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faTableColumns,
	faUser,
	faBriefcaseMedical,
	faHandshakeAngle,
	faPlus,
	faHome,
	faUserGear,
} from "@fortawesome/free-solid-svg-icons";

import { toggleSubMenu } from "../features/menuSlice";

function Footer() {
	// Select necessary states from Redux store
	const { isLogged } = useSelector((state) => state.auth);
	const { isSubMenuOpen } = useSelector((state) => state.menu);
	const { isAdmin } = useSelector((state) => state.auth);
	
	// Get user role from Redux
	const {
		infos: { role },
	} = useSelector((state) => state.auth);

	const dispatch = useDispatch();

	// Handle submenu toggle when clicked
	function handleClick() {
		dispatch(toggleSubMenu());
	}

	return (
		<footer>
			{/* Only show the navigation if the user is logged in */}
			{isLogged && (
				<nav className={isSubMenuOpen ? "active" : null}>
					<ul>
						<li>
							<NavLink to="/" end>
								<FontAwesomeIcon icon={faTableColumns} />
								<span>Dashboard</span>
							</NavLink>
						</li>
						<li>
							<NavLink to="patients">
								<FontAwesomeIcon icon={faUser} />
								<span>Patients</span>
							</NavLink>
						</li>

						{/* Practitioner specific links */}
						{role === "practitioner" && (
							<>
								<li>
									<NavLink to="soins">
										<FontAwesomeIcon icon={faBriefcaseMedical} />
										<span>Soins</span>
									</NavLink>
								</li>
								<li>
									<NavLink to="tuteurs">
										<FontAwesomeIcon icon={faHandshakeAngle} />
										<span>Tuteurs</span>
									</NavLink>
								</li>
							</>
						)}

						{/* Admin specific links */}
						{isAdmin && (
							<li className={`add-menu ${isSubMenuOpen ? "active" : ""}`}>
								<button onClick={handleClick}>
									<FontAwesomeIcon icon={faPlus} />
								</button>

								<ul>
									<li>
										<NavLink to="patients/ajouter" end>
											<FontAwesomeIcon icon={faUser} />
											<span>Ajouter un patient</span>
										</NavLink>
									</li>
									<li>
										<NavLink to="tuteurs/ajouter" end>
											<FontAwesomeIcon icon={faHandshakeAngle} />
											<span>Ajouter un tuteur</span>
										</NavLink>
									</li>
									<li>
										<NavLink to="maisons-retraite/ajouter" end>
											<FontAwesomeIcon icon={faHome} />
											<span>Ajouter un établissement</span>
										</NavLink>
									</li>
								</ul>
							</li>
						)}
					</ul>
				</nav>
			)}
			<p>
				&copy; 2025 Julien Bellet - dans le cadre de la 3WA -
				<NavLink to="mentions-legales" end>
					Mentions légales
				</NavLink>
				-
				<NavLink to="politique-confidentialite" end>
					Politique de confidentialité
				</NavLink>
			</p>
		</footer>
	);
}

export default Footer;
