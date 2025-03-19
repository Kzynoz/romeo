import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CareStatus from "./Components/CareStatus";
import GuardianContact from "./Components/GuardianContact";

function PatientDetails() {
	const { id } = useParams();
	const navigate = useNavigate();

	const [datas, setDatas] = useState(null);
	const [error, setError] = useState("");

	useEffect(() => {
		async function fetchPatient() {
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
		fetchPatient();
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
						{datas.retirement_home && (
							<address>
								<p>
									Maison de retraite :{" "}
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

					<aside className="wrapper">
						<header>
							<h2>Liste de(s) soin(s) ({datas.care_count})</h2>
							<button onClick={"ajouter"}>Ajouter</button>
						</header>

						{datas.all_cares ? (
							datas.all_cares.map((care) => (
								<article
									key={care.id}
									onClick={() => navigate(`/patients/${id}/soin/${care.id}`)}
								>
									<h3>
										Soin{" "}
										<span>
											{new Date(care.performed_at).toLocaleDateString()}
										</span>
									</h3>
									<CareStatus
										invoice_paid={care.invoice_paid}
										invoice_send={care.invoice_send}
									/>
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
