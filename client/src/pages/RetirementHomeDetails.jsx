import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

import UpdateEntity from "./UpdateEntity";
import ManageItem from "./Components/ManageItem";

function RetirementHomeDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [datas, setDatas] = useState(null);
	const [error, setError] = useState("");

	const { isEditingOpen } = useSelector((state) => state.menu);
	const { isAdmin } = useSelector((state) => state.auth);

	useEffect(() => {
		async function fetchPatient() {
			try {
				const res = await fetch(
					`http://localhost:9000/api/v1/retirement-homes/${id}`,
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
				setError(error);
			}
		}
		fetchPatient();
	}, [isEditingOpen]);

	return (
		<>
			{error && <p>{error}</p>}

			{datas && (
				<>
					{isEditingOpen ? (
						<UpdateEntity data={datas} />
					) : (
						<>
							<ManageItem
								entity={{ id: datas.id, name: datas.name }}
								link={{
									url: "retirement-homes",
									title: "l'établissement",
								}}
							/>

							<article>
								<header>
									<h1>{datas.name}</h1>
								</header>

								<section className="row-contact">
									<h2>Coordonnées</h2>
									{datas.contact && <p>{datas.contact}</p>}

									<address>
										<p>
											{datas.street} - {datas.city.toUpperCase()}{" "}
											{datas.zip_code}
										</p>
									</address>
								</section>

								<aside className="wrapper">
									<header>
										<h2>
											Liste de(s) patients(s) (
											{datas.patients_count && datas.patients_count})
										</h2>
										{isAdmin && (
											<button
												className="add-button"
												onClick={() => navigate(`/patients/ajouter`)}
											>
												Ajouter
											</button>
										)}
									</header>

									{datas.patients ? (
										datas.patients.map((patient) => (
											<article
												key={patient.id}
												onClick={() => navigate(`/patients/${patient.id}`)}
											>
												<h2>
													{patient.title} {patient.firstname} {patient.lastname}
												</h2>

												<Link
													className="link-desktop"
													to={`/patients/${patient.id}`}
												>
													Consulter
												</Link>
											</article>
										))
									) : (
										<p>Aucun patient trouvé</p>
									)}
								</aside>
							</article>
						</>
					)}
				</>
			)}
		</>
	);
}

export default RetirementHomeDetails;
