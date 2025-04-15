import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { setTotalPages, reset } from "../features/paginationSlice";

import UpdateEntity from "./UpdateEntity";
import GuardianContact from "./Components/GuardianContact";
import Pagination from "./Components/Pagination";
import ManageItem from "./Components/ManageItem";

function GuardianDetails() {
	const { id } = useParams();

	const [datas, setDatas] = useState(null);
	const [error, setError] = useState("");

	const { isEditingOpen } = useSelector((state) => state.menu);
	const { page } = useSelector((state) => state.pagination);
	const { isAdmin } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchGuardian(page) {
			const limit = 5;
			const offset = (page - 1) * limit;

			try {
				const res = await fetch(
					`http://localhost:9000/api/v1/guardians/${id}?limit=${limit}&offset=${offset}`,
					{
						credentials: "include",
					}
				);

				if (res.ok) {
					const { response } = await res.json();

					setDatas(response);
					if (response.guardianship_count)
						dispatch(
							setTotalPages(Math.ceil(response.guardianship_count / limit))
						);
				} else {
					const { message } = await res.json();
					setError(message);
				}
			} catch (error) {
				console.error("error", error);
				setError(error.message);
			}
		}
		fetchGuardian(page);
	}, [isEditingOpen, page]);

	useEffect(() => {
		dispatch(reset());
	}, [navigate]);

	return (
		<>
			{error && <p>{error}</p>}

			{datas && (
				<>
					{isEditingOpen ? (
						<UpdateEntity data={datas.guardian} />
					) : (
						<>
							<ManageItem
								entity={{
									id: datas.guardian.details.id,
									name: `${datas.guardian.details.title} ${datas.guardian.details.firstname} ${datas.guardian.details.lastname}`,
								}}
								link={{
									url: "guardians",
									title: "le tuteur",
								}}
							/>
							<article>
								<header>
									<h1>
										<span>Tuteur</span>
										{datas.guardian.details.title}{" "}
										{datas.guardian.details.firstname}{" "}
										{datas.guardian.details.lastname}
									</h1>
								</header>

								{datas.guardian && (
									<GuardianContact datas={datas.guardian} isFull={false} />
								)}

								<aside className="wrapper">
									<header>
										<h2>Liste de(s) tutelle(s) ({datas.guardianship_count})</h2>
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
										<>
											{datas.patients.map((patient) => (
												<article
													key={patient.id}
													onClick={() => navigate(`/patients/${patient.id}`)}
												>
													<h3>
														{patient.title} {patient.firstname}{" "}
														{patient.lastname}
													</h3>
													{patient.retirement_home && (
														<p className="retirement-home">
															{patient.retirement_home}
														</p>
													)}

													<Link
														className="link-desktop"
														to={`/patients/${patient.id}`}
													>
														Consulter
													</Link>
												</article>
											))}

											{datas.guardianship_count && <Pagination />}
										</>
									) : (
										<p>Aucune tutelle trouvée</p>
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

export default GuardianDetails;
