import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

function Home() {
	const navigate = useNavigate();
	const [query, setQuery] = useState("");
	const [currentMonth, setCurrentMont] = useState(null);
	const [totalCare, setTotalCare] = useState("");
	const {
		infos: { alias },
	} = useSelector((state) => state.auth);

	function handleChange() {}

	function handleNavigate(path) {
		navigate(path);
	}

	useEffect(() => {
		const month = new Intl.DateTimeFormat("fr-FR", {
			month: "long",
		}).format(new Date());
		setCurrentMont(month);
	}, []);

	useEffect(() => {
		async function fetchTotalCare() {
			try {
				const res = await fetch(
					"http://localhost:9000/api/v1/care/count-this-month",
					{
						credentials: "include",
					}
				);
				if (res.ok) {
					const { response } = await res.json();
					console.log(response);
					setTotalCare(response);
				}
			} catch (error) {
				console.error("error", error);
			}
		}
		fetchTotalCare();
	}, []);

	return (
		<>
			<header>
				<h1>Bonjour, {alias}</h1>
				<p>Qu'est ce que tu veux faire aujourd'hui ?</p>
			</header>
			<form className="search-bar">
				<input
					type="search"
					placeholder="Patients, EHPAD, tuteurs…"
					value={query}
					onChange={handleChange}
				/>
			</form>
			<section className="rubriques">
				<article onClick={() => handleNavigate("patients")}>
					<img className="picto" alt="picto patients" />
					<h2>Patients</h2>
					<p>Voir la liste des patients</p>
					<button onClick={() => handleNavigate("patients")}>Consulter</button>
				</article>
				<article>
					<img className="picto" alt="picto soins" />
					<h2>Soins</h2>
					<p>Voir la liste des soins</p>
					<button>Consulter</button>
				</article>
				<article>
					<img className="picto" alt="picto tuteurs" />
					<h2>Tuteurs</h2>
					<p>Voir la liste des tuteurs</p>
					<button>Consulter</button>
				</article>
				<article>
					<img className="picto" alt="picto statistiques" />
					<h2>Statistiques</h2>
					<p>Bilan financier, soins effectués…</p>
					<button>Consulter</button>
				</article>
			</section>
			{totalCare && (
				<aside>
					{currentMonth ? (
						<h2>Récapitulatif de {currentMonth}</h2>
					) : (
						<h2>Récapitulatif</h2>
					)}
					<p>
						Vous avre effectué: <strong>{totalCare.total_care}</strong> soins ce
						mois-ci
					</p>
					<p>
						Soit un CA prévisionnel de:{" "}
						<strong>
							{totalCare.total_revenue_paid} /{" "}
							{totalCare.total_revenue_estimated} €
						</strong>
					</p>
					<Link to="statistiques">Consulter les statistiques</Link>
				</aside>
			)}
		</>
	);
}

export default Home;
