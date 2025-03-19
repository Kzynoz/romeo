import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import CareStatus from "./Components/CareStatus";
import GuardianContact from "./Components/GuardianContact";

function CareDetails() {
	const { id, idSoin } = useParams();

	const [datas, setDatas] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchPatients() {
			try {
				const res = await fetch(
					`http://localhost:9000/api/v1/patients/${id}/care/${idSoin}`,
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
							<span>Patient</span>
							{datas.title} {datas.firstname} {datas.lastname}
						</h1>
						<p>Soin réalisé par : {datas.practitioner}</p>

						{datas.retirement_home && (
							<address>
								<p>Maison de retraite :</p>
								<p>
									<Link to={`/ehpads/${datas.retirement_home.id}`}>
										{datas.retirement_home.name}
									</Link>
								</p>
							</address>
						)}
					</header>

					{datas.guardian && (
						<GuardianContact datas={datas.guardian} isFull={true} />
					)}

					<section className="care-details">
						<h2>
							Soin - {new Date(datas.care.performed_at).toLocaleDateString()}
						</h2>

						<CareStatus
							invoice_paid={datas.care.invoice.invoice_paid}
							invoice_send={datas.care.invoice.invoice_send}
						/>

						<p className="price">Prix: {datas.care.price}€</p>

						{datas.care.complements && (
							<p className="complements">
								<strong>Complements :</strong> {datas.care.complements}
							</p>
						)}

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
