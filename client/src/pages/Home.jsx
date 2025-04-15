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

import StatistiquesOverview from "./Components/StatistiquesOverview";
import SearchBar from "./Components/SearchBar/SearchBar";

function Home() {
	const navigate = useNavigate();
	const {
		isAdmin,
		infos: { alias, role },
	} = useSelector((state) => state.auth);

	const day = new Date().getDate();
	const month = new Date().toLocaleString("fr-FR", { month: "short" });
	const year = new Date().getFullYear();

	function handleNavigate(path) {
		navigate(path);
	}

	return (
		<>
			<header>
				<h1>Bonjour, {alias}</h1>
				<p>Qu'est ce que tu veux faire aujourd'hui ?</p>
				{day && month && year && (
					<div className="date-desktop">
						<span>{day}</span>
						<span>{month}</span>
						<span>{year.toString().slice(-2)}</span>
					</div>
				)}
			</header>

			<SearchBar entityType={"all"} />

			<section className="rubriques">
				<article onClick={() => handleNavigate("patients")}>
					<FontAwesomeIcon icon={faUser} />
					<h2>Patients</h2>
					<p>Voir la liste des patients</p>
					<Link className="link-desktop" to="/patients">
						Consulter
					</Link>
				</article>
				{role && role === "practitioner" && (
					<>
						<article onClick={() => handleNavigate("soins")}>
							<FontAwesomeIcon icon={faBriefcaseMedical} />
							<h2>Soins</h2>
							<p>Voir la liste des soins</p>
							<Link className="link-desktop" to="/soins">
								Consulter
							</Link>
						</article>
						<article onClick={() => handleNavigate("tuteurs")}>
							<FontAwesomeIcon icon={faHandshakeAngle} />
							<h2>Tuteurs</h2>
							<p>Voir la liste des tuteurs</p>
							<Link className="link-desktop" to="/tuteurs">
								Consulter
							</Link>
						</article>
						<article onClick={() => handleNavigate("maisons-retraite")}>
							<FontAwesomeIcon icon={faHome} />
							<h2>Établissements</h2>
							<p>Voir la liste des établissements</p>
							<Link className="link-desktop" to="/maisons-retraite">
								Consulter
							</Link>
						</article>

						{isAdmin && (
							<article onClick={() => handleNavigate(`statistiques/${year}`)}>
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
			{isAdmin && <StatistiquesOverview isFull={true} />}
		</>
	);
}

export default Home;
