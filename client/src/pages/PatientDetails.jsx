import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CareStatus from "./Components/CareStatus";

function PatientDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [datas, setDatas] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchPatients() {
			try {
				const res = await fetch(`http://localhost:9000/api/v1/patients/${id}`, {
					credentials: "include",
				});

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
		fetchPatients();
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
							{datas.title} {datas.firstname} {datas.lastname}
						</h1>
						<address>
							{datas.phone && (
								<>
									<p>Coordonnées</p>
									<p>
										Téléphone :
										<a href={`tel:+${datas.phone}`} target="_blank">
											{datas.phone}
										</a>
									</p>
								</>
							)}

							{datas.retirement_home && (
								<>
									<p>Maison de retraite :</p>
									<p>
										<Link to={`/ehpads/${datas.retirement_home.id}`}>
											{datas.retirement_home.name}
										</Link>
									</p>
								</>
							)}
						</address>
					</header>

					{datas.guardian && (
						<section>
							<h2>Sous tutuelle</h2>
							<p>
								{datas.guardian.title} {datas.guardian.firstname}{" "}
								{datas.guardian.lastname} ({datas.guardian.relationship})
							</p>

							{datas.guardian.company && (
								<p>Société : {datas.guardian.company} </p>
							)}

							<address>
								{datas.guardian.address && (
									<p>
										{datas.guardian.address.street} -{" "}
										{datas.guardian.address.city}{" "}
										{datas.guardian.address.zip_code}
									</p>
								)}

								<a href={`mailto:${datas.guardian.email}`} target="_blank">
									{datas.guardian.email}
								</a>

								<a href={`tel:+${datas.guardian.phone}`} target="_blank">
									{datas.guardian.phone}
								</a>
							</address>
						</section>
					)}
					<aside>
						<header>
							<h2>Liste de(s) soin(s) ({datas.care_count})</h2>
							<button onClick={"ajouter"}>Ajouter</button>
						</header>

						{datas.all_cares ? (
							datas.all_cares.map((care) => (
								<article
									key={care.id}
									onClick={() => navigate(`/patient/${id}/care/${care.id}`)}
								>
									<h3>
										Soin{" "}
										<span>
											{new Date(care.performed_at).toLocaleDateString()}
										</span>
									</h3>
									<p>
										<strong>Status du soin :</strong>
										<CareStatus
											invoice_paid={care.invoice_paid}
											invoice_send={care.invoice_send}
										/>
									</p>
								</article>
							))
						) : (
							<p>Aucun soin trouvé</p>
						)}
					</aside>

					<img></img>
				</article>
			)}
		</>
	);
}

export default PatientDetails;
