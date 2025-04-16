import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setTotalPages, reset } from "../features/paginationSlice";

import CareStatus from "./Components/CareStatus";
import GuardianContact from "./Components/GuardianContact";
import FormPatient from "./FormPatient";
import Pagination from "./Components/Pagination";
import ManageItem from "./Components/ManageItem";

function PatientDetails() {
	const { id } = useParams();

	const [datas, setDatas] = useState(null);
	const [error, setError] = useState("");

	const { isEditingOpen } = useSelector((state) => state.menu);
	const { page } = useSelector((state) => state.pagination);
	const {
		isAdmin,
		infos: { role, id: guardianId },
	} = useSelector((state) => state.auth);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	useEffect(() => {
		async function fetchPatient(page) {
			const limit = 5;
			const offset = (page - 1) * limit;

			let URL = `http://localhost:9000/api/v1/patients/${id}?limit=${limit}&offset=${offset}`;

			if (role === "guardian") {
				URL += `&guardian_id=${guardianId}`;
			}

			try {
				const res = await fetch(URL, {
					credentials: "include",
				});

				if (res.ok) {
					const { response } = await res.json();

					setDatas(response);
					if (response.care_count)
						dispatch(setTotalPages(Math.ceil(response.care_count / limit)));
				} else {
					const { message } = await res.json();
					setError(message);
				}
			} catch (error) {
				console.error("error", error);
				setError("Une erreur est survenue, veuillez réessayer plus tard.");
			}
		}
		fetchPatient(page);
	}, [isEditingOpen, page]);

	useEffect(() => {
		dispatch(reset());
	}, [navigate]);

	return (
		<>
			{error && <p>{error}</p>}

			{datas && (
				<>
					{isEditingOpen && isAdmin ? (
						<FormPatient data={datas} />
					) : (
						<>
							<ManageItem
								entity={{
									id: datas.id,
									name: `${datas.title} ${datas.firstname} ${datas.lastname}`,
								}}
								link={{
									url: "guardians",
									title: "le tuteur",
								}}
							/>
							<article>
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

								{datas.guardian && role !== "guardian" && (
									<GuardianContact datas={datas.guardian} isFull={true} />
								)}

								<aside className="wrapper">
									<header>
										<h2>Liste de(s) soin(s) ({datas.care_count})</h2>

										{isAdmin && (
											<button
												className="add-button"
												onClick={() => navigate(`/patients/${id}/soin/ajouter`)}
											>
												Ajouter un soin
											</button>
										)}
									</header>

									{datas.all_cares ? (
										<>
											{datas.all_cares.map((care) => (
												<article
													key={care.id}
													onClick={() =>
														navigate(`/patients/${id}/soin/${care.id}`)
													}
												>
													<h3>
														{care.type} du
														<span>
															{new Date(care.performed_at).toLocaleDateString()}
														</span>
													</h3>
													<CareStatus
														invoice_paid={care.invoice_paid}
														invoice_send={care.invoice_send}
													/>
												</article>
											))}

											{datas.care_count && <Pagination />}
										</>
									) : (
										<p>Aucun soin trouvé</p>
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

export default PatientDetails;
