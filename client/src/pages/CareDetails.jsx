import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CareStatus from "./Components/CareStatus";

function CareDetails() {
	const { id, idPatient } = useParams();

	const [datas, setDatas] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchPatients() {
			try {
				const res = await fetch(
					`http://localhost:9000/api/v1/patients/${idPatient}/care/${id}`,
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
						<p>Soin réalisé par : {datas.practitioner}</p>
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
								{datas.guardian.details?.title}{" "}
								{datas.guardian.details?.firstname}{" "}
								{datas.guardian.details?.lastname} (
								{datas.guardian.relationship})
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

								<a
									href={`mailto:${datas.guardian.details?.email}`}
									target="_blank"
								>
									{datas.guardian.details?.email}
								</a>

								<a
									href={`tel:+${datas.guardian.details?.phone}`}
									target="_blank"
								>
									{datas.guardian.details?.phone}
								</a>
							</address>
						</section>
					)}
					<section>
						<h2>
							Soin - {new Date(datas.care.performed_at).toLocaleDateString()}
						</h2>
						<p>Prix {datas.care.price}€</p>

						{datas.care.complements && (
							<>
								<p>Complements :</p>
								<p>{datas.care.complements}</p>
							</>
						)}

						<CareStatus
							invoice_paid={datas.care.invoice.invoice_paid}
							invoice_send={datas.care.invoice.invoice_send}
						/>

						{datas.care.invoice.invoice_generated === 1 ? (
							<button onClick={"ajouter"}>Voir la facture</button>
						) : (
							<button onClick={"ajouter"}>Générer et envoyer la facture</button>
						)}
					</section>
				</article>
			)}
		</>
	);
}

export default CareDetails;
