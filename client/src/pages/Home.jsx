import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
	faUser,
	faBriefcaseMedical,
	faHandshakeAngle,
	faChartPie,
} from "@fortawesome/free-solid-svg-icons";

import CurrentMonthOverview from "./Components/CurrentMonthOverview";
import SearchBar from "./Components/SearchBar";

function Home() {
	const navigate = useNavigate();
	const {
		infos: { alias },
	} = useSelector((state) => state.auth);

	function handleNavigate(path) {
		navigate(path);
	}

	return (
		<>
			<header>
				<h1>Bonjour, {alias}</h1>
				<p>Qu'est ce que tu veux faire aujourd'hui ?</p>
			</header>
			<SearchBar />
			<section className="rubriques">
				<article onClick={() => handleNavigate("patients")}>
					<FontAwesomeIcon icon={faUser} />
					<h2>Patients</h2>
					<p>Voir la liste des patients</p>
					{/* 					<button onClick={() => handleNavigate("patients")}>Consulter</button> */}
				</article>
				<article>
					<FontAwesomeIcon icon={faBriefcaseMedical} />
					<h2>Soins</h2>
					<p>Voir la liste des soins</p>
				</article>
				<article>
					<FontAwesomeIcon icon={faHandshakeAngle} />
					<h2>Tuteurs</h2>
					<p>Voir la liste des tuteurs</p>
				</article>
				<article>
					<FontAwesomeIcon icon={faChartPie} />
					<h2>Statistiques</h2>
					<p>Bilan financier, soins effectués…</p>
				</article>
			</section>
			<CurrentMonthOverview />
		</>
	);
}

export default Home;
