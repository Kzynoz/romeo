import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

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
		infos: { alias },
	} = useSelector((state) => state.auth);

	const year = new Date().getFullYear();

	function handleNavigate(path) {
		navigate(path);
	}

	return (
		<>
			<header>
				<h1>Bonjour, {alias}</h1>
				<p>Qu'est ce que tu veux faire aujourd'hui ?</p>
			</header>

			<SearchBar entityType={"all"} />

			<section className="rubriques">
				<article onClick={() => handleNavigate("patients")}>
					<FontAwesomeIcon icon={faUser} />
					<h2>Patients</h2>
					<p>Voir la liste des patients</p>
					{/* 					<button onClick={() => handleNavigate("patients")}>Consulter</button> */}
				</article>
				<article onClick={() => handleNavigate("soins")}>
					<FontAwesomeIcon icon={faBriefcaseMedical} />
					<h2>Soins</h2>
					<p>Voir la liste des soins</p>
				</article>
				<article onClick={() => handleNavigate("tuteurs")}>
					<FontAwesomeIcon icon={faHandshakeAngle} />
					<h2>Tuteurs</h2>
					<p>Voir la liste des tuteurs</p>
				</article>
				<article onClick={() => handleNavigate("maisons-retraite")}>
					<FontAwesomeIcon icon={faHome} />
					<h2>Établissements</h2>
					<p>Voir la liste des établissements</p>
				</article>
				<article onClick={() => handleNavigate(`statistiques/${year}`)}>
					<FontAwesomeIcon icon={faChartPie} />
					<h2>Statistiques</h2>
					<p>Bilan financier, soins effectués…</p>
				</article>
			</section>
			<StatistiquesOverview isFull={true} />
		</>
	);
}

export default Home;
