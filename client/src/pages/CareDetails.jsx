import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import CareStatus from "./Components/CareStatus";
import GuardianContact from "./Components/GuardianContact";
import UpdateEntity from "./UpdateEntity";

import ManageItem from "./Components/ManageItem";

function CareDetails() {
	const { id, idSoin } = useParams();

	const [datas, setDatas] = useState(null);
	const [error, setError] = useState("");

	const { isEditingOpen } = useSelector((state) => state.menu);
	const {
		isAdmin,
		infos: { role, id: guardianId },
	} = useSelector((state) => state.auth);

	useEffect(() => {
		async function fetchCare() {
			let URL = `http://localhost:9000/api/v1/patients/${id}/care/${idSoin}`;

			if (role === "guardian") {
				URL += `?guardian_id=${guardianId}`;
			}

			try {
				const res = await fetch(URL, {
					credentials: "include",
				});

				if (res.ok) {
					const { response } = await res.json();

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
		fetchCare();
	}, [isEditingOpen]);

	return (
		<>
			{error && <p>{error}</p>}

			{datas && (
				<>
					{isEditingOpen && isAdmin ? (
						<UpdateEntity data={datas} />
					) : (
						<>
							<ManageItem
								entity={{
									id: datas.id,
									careId: datas.care.id,
									name: `soin du ${new Date(
										datas.care.performed_at
									).toLocaleDateString("fr-FR")}`,
								}}
								link={{
									url: "care",
									title: "le soin",
								}}
							/>
							<article>
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

								{datas.guardian && role !== "guardian" && (
									<GuardianContact datas={datas.guardian} isFull={true} />
								)}

								<section className="care-details">
									<h2>
										Soin -{" "}
										{new Date(datas.care.performed_at).toLocaleDateString()}
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
										<button onClick={"ajouter"}>
											Générer et envoyer la facture
										</button>
									)}
								</section>
							</article>
						</>
					)}
				</>
			)}
		</>
	);
}

export default CareDetails;
