import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RemoveEntity from "./RemoveEntity";

function RetirementHomeDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [datas, setDatas] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchPatient() {
			try {
				const res = await fetch(
					`http://localhost:9000/api/v1/retirement-homes/${id}`,
					{
						credentials: "include",
					}
				);

				console.log(res);

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
				setError(error);
			}
		}
		fetchPatient();
	}, []);

	return (
		<>
			{error && <p>{error}</p>}

			{datas && (
				<article>
					<div className="actions">
						<RemoveEntity idItem={datas.id} />
						<button onClick={"ajouter"}>Modifier</button>
						<button onClick={"ajouter"}>Supprimer</button>
					</div>
					<header>
						<h1>{datas.name}</h1>
					</header>

					<section className="row-contact">
						<h2>Coordonnées</h2>
						{datas.contact && <p>{datas.contact}</p>}

						<address>
							<p>
								{datas.street} - {datas.city.toUpperCase()} {datas.zip_code}
							</p>
						</address>
					</section>

					<aside className="wrapper">
						<header>
							<h2>
								Liste de(s) patients(s) (
								{datas.patients_count && datas.patients_count})
							</h2>
							<button onClick={"ajouter"}>Ajouter</button>
						</header>

						{datas.patients ? (
							datas.patients.map((patient) => (
								<article
									key={patient.id}
									onClick={() => navigate(`/patients/${id}`)}
								>
									<h2>
										{patient.title} {patient.firstname} {patient.lastname}
									</h2>
								</article>
							))
						) : (
							<p>Aucun patient trouvé</p>
						)}
					</aside>

					<img></img>
				</article>
			)}
		</>
	);
}

export default RetirementHomeDetails;
