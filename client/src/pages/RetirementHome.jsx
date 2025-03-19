import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "./Components/SearchBar/SearchBar";

function RetirementHome() {
	const [datas, setDatas] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchRetirementHomes() {
			try {
				const res = await fetch(
					"http://localhost:9000/api/v1/retirement-homes",
					{
						credentials: "include",
					}
				);

				if (res.ok) {
					const { response } = await res.json();
					console.log(response);
					setDatas(response);
				}
			} catch (error) {
				setError(error.message);
			}
		}
		fetchRetirementHomes();
	}, []);

	return (
		<>
			<header>
				<h1>Les maisons de retraite</h1>
				<p>
					Ici tu retrouveras la liste de toutes les maisons de retraite ou foyer
				</p>
			</header>

			<SearchBar entityType={"retirement home"} />

			<section className="wrapper">
				<button onClick={() => navigate(`/maisons-retraite/ajouter`)}>
					Ajouter un établissement
				</button>

				{error && <p>{error}</p>}

				{!datas.length ? (
					<p>Chargement…</p>
				) : (
					datas.map((establishment) => (
						<article
							key={establishment.id}
							onClick={() => navigate(`/maisons-retraite/${establishment.id}`)}
						>
							<h2>{establishment.name}</h2>

							{establishment.patients_count > 0 && (
								<span>
									<strong>Nombre de patiens:</strong>
									{establishment.patients_count}
								</span>
							)}
						</article>
					))
				)}
			</section>
		</>
	);
}

export default RetirementHome;
