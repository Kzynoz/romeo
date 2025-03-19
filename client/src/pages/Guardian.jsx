import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar from "./Components/SearchBar/SearchBar";

function Guardian() {
	const [datas, setDatas] = useState([]);
	const [error, setError] = useState("");
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchGuardians() {
			try {
				const res = await fetch("http://localhost:9000/api/v1/guardians", {
					credentials: "include",
				});

				if (res.ok) {
					const { response } = await res.json();
					console.log(response);
					setDatas(response);
				}
			} catch (error) {
				console.error("error", error);
				setError(error);
			}
		}
		fetchGuardians();
	}, []);

	return (
		<>
			<header>
				<h1>Les tuteurs</h1>
				<p>Ici tu retrouveras la liste de tous les tuteurs</p>
			</header>
			<SearchBar entityType={"guardian"} />
			<section className="wrapper">
				<button onClick={"coucou"}>Ajouter un tuteur</button>
				{error && <p>{error}</p>}

				{!datas.length ? (
					<p>Chargement…</p>
				) : (
					datas.map((guardian) => (
						<article
							key={guardian.id}
							onClick={() => navigate(`/tuteurs/${guardian.id}`)}
						>
							<h2>
								{guardian.title} {guardian.firstname} {guardian.lastname}{" "}
								{guardian.company && (
									<span className="society"> {guardian.company}</span>
								)}
							</h2>

							{guardian.guardianship_count > 0 && (
								<span>
									<strong>Nombre de tutelles:</strong>
									{guardian.guardianship_count}
								</span>
							)}
						</article>
					))
				)}
			</section>
		</>
	);
}

export default Guardian;
