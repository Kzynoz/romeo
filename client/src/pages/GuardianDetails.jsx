import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import GuardianContact from "./Components/GuardianContact";

function GuardianDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [datas, setDatas] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchGuardian() {
			try {
				const res = await fetch(
					`http://localhost:9000/api/v1/guardians/${id}`,
					{
						credentials: "include",
					}
				);

				if (res.ok) {
					const { response } = await res.json();
					console.log(response);
					setDatas(response);
				} else {
					const { message } = await res.json();
					setError(message);
				}
			} catch (error) {
				console.error("error", error);
				setError(error.message);
			}
		}
		fetchGuardian();
	}, []);

	return (
		<>
			{error && <p>{error}</p>}

			{datas && (
				<article>
					<div className="actions">
						<button onClick={"ajouter"}>Modifier</button>
						<button onClick={"ajouter"}>Supprimer</button>
					</div>
					<header>
						<h1>
							<span>Tuteur</span>
							{datas.guardian.details.title} {datas.guardian.details.firstname}{" "}
							{datas.guardian.details.lastname}
						</h1>
					</header>

					{datas.guardian && (
						<GuardianContact datas={datas.guardian} isFull={false} />
					)}

					<aside className="wrapper">
						<header>
							<h2>Liste de(s) tutelle(s) ({datas.guardianship_count})</h2>
							<button onClick={"ajouter"}>Ajouter</button>
						</header>

						{datas.patients ? (
							datas.patients.map((patient) => (
								<article
									key={patient.id}
									onClick={() => navigate(`/patients/${patient.id}`)}
								>
									<h3>
										{patient.title} {patient.firstname} {patient.lastname}
									</h3>
									{patient.retirement_home && (
										<p className="retirement-home">{patient.retirement_home}</p>
									)}
								</article>
							))
						) : (
							<p>Aucune tutelle trouvée</p>
						)}
					</aside>

					<img></img>
				</article>
			)}
		</>
	);
}

export default GuardianDetails;
