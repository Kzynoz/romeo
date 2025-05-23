import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faBriefcaseMedical,
	faHandshakeAngle,
	faChartPie,
	faHome,
} from "@fortawesome/free-solid-svg-icons";

import StatisticsOverview from "./Components/StatisticsOverview";
import SearchBar from "./Components/SearchBar/SearchBar";

import useHead from "../hooks/useHead";

function Home() {
	// Hook for navigation
	const navigate = useNavigate();
	
	// Access Redux state, especially to get user info and their role
	const {
		isAdmin, // Check if the user is an admin
		infos: { alias, role }, // Alias and role of the user
	} = useSelector((state) => state.auth);

	// Get the current date
	const day = new Date().getDate();
	const month = new Date().toLocaleString("fr-FR", { month: "short" });
	const year = new Date().getFullYear();
	
	// Set title and meta description
	useHead("Dashboard","Découvrez le tableau de bord de Roméo, votre plateforme de gestion paramédicale, pour un suivi simple et efficace des soins, des patients et des factures.");

	function handleNavigate(path) {
		navigate(path);
	}

	return (
		<>
			<header>
				<h1>Bonjour, {alias ? alias : "invité"}</h1>
				<p>Qu'est ce que tu veux faire aujourd'hui ?</p>
				
				{/* Display the current date in the format: day month year */}
				{day && month && year && (
					<div className="date-desktop">
						<span>{day}</span>
						<span>{month}</span>
						<span>{year.toString().slice(-2)}</span>
					</div>
				)}
			</header>

			<SearchBar entityType={"all"} />

			{/* Sections for navigating through different entities */}
			<section className="rubriques">
				<article 
					onClick={() => handleNavigate("patients")}
					role="button"
					tabIndex="0"
					aria-label="Accéder à la liste des patients"
				>
					<FontAwesomeIcon icon={faUser} />

					<h2>Patients</h2>
					<p>Voir la liste des patients</p>

					<Link className="link-desktop" to="/patients">
						Consulter
					</Link>
				</article>

				{role && role === "practitioner" && (
					<>
						<article 
							onClick={() => handleNavigate("soins")}
							role="button"
							tabIndex="1"
							aria-label="Accéder à la liste des soins"
						>
							<FontAwesomeIcon icon={faBriefcaseMedical} />

							<h2>Soins</h2>
							<p>Voir la liste des soins</p>

							<Link className="link-desktop" to="/soins">
								Consulter
							</Link>
						</article>
						<article 
							onClick={() => handleNavigate("tuteurs")}
							role="button"
							tabIndex="2"
							aria-label="Accéder à la liste des tuteurs"
						>
							<FontAwesomeIcon icon={faHandshakeAngle} />

							<h2>Tuteurs</h2>
							<p>Voir la liste des tuteurs</p>

							<Link className="link-desktop" to="/tuteurs">
								Consulter
							</Link>
						</article>
						<article 
							onClick={() => handleNavigate("maisons-retraite")}
							role="button"
							tabIndex="3"
							aria-label="Accéder à la liste des maisons de retraite"
						>
							<FontAwesomeIcon icon={faHome} />

							<h2>Établissements</h2>
							<p>Voir la liste des établissements</p>

							<Link className="link-desktop" to="/maisons-retraite">
								Consulter
							</Link>
						</article>
	
						{/* Only show statistics for admin users */}
						{isAdmin && (
							<article 
								onClick={() => handleNavigate(`statistiques/${year}`)}
								role="button"
								tabIndex="4"
								aria-label="Accéder aux statistiques"
							>
								<FontAwesomeIcon icon={faChartPie} />

								<h2>Statistiques</h2>
								<p>Bilan financier, soins effectués…</p>

								<Link className="link-desktop" to={`statistiques/${year}`}>
									Consulter
								</Link>
							</article>
						)}
					</>
				)}
			</section>

			{isAdmin && <StatisticsOverview isFull={true} />}
		</>
	);
}

export default Home;
