import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CareStatus from "./Components/CareStatus";
import SearchBar from "./Components/SearchBar/SearchBar";
import Pagination from "./Components/Pagination";

import { setTotalPages, reset } from "../features/paginationSlice";

function Patient() {
	const [datas, setDatas] = useState([]);
	const [error, setError] = useState("");

	const { page } = useSelector((state) => state.pagination);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchPatients(page) {
			const limit = 10;
			const offset = (page - 1) * limit;

			try {
				const res = await fetch(
					`http://localhost:9000/api/v1/patients?limit=${limit}&offset=${offset}`,
					{
						credentials: "include",
					}
				);

				if (res.ok) {
					const { response, totalPages } = await res.json();

					setDatas(response);
					dispatch(setTotalPages(totalPages));
				}
			} catch (error) {
				console.error("error", error);
				setError(error);
			}
		}
		fetchPatients(page);
	}, [page]);

	useEffect(() => {
		dispatch(reset());
	}, [navigate]);

	return (
		<>
			<header>
				<h1>Mes patients</h1>
				<p>Ici tu retrouveras la liste de tous tes patients</p>
			</header>
			<SearchBar entityType={"patient"} />
			<section className="wrapper">
				<button
					onClick={() => {
						navigate("/patients/ajouter");
					}}
				>
					Ajouter un patient
				</button>
				{error && <p>{error}</p>}

				{!datas.length ? (
					<p>Chargement…</p>
				) : (
					<>
						{datas.map((patient) => (
							<article
								key={patient.id}
								onClick={() => navigate(`/patients/${patient.id}`)}
							>
								<h2>
									{patient.title} {patient.firstname} {patient.lastname}
								</h2>
								<p>
									<strong>Tuteur:</strong> {patient.guardian.title}{" "}
									{patient.guardian.firstname} {patient.guardian.lastname}{" "}
									{patient.guardian?.relationship === "société" && (
										<span className="society">{patient.guardian.company}</span>
									)}
								</p>
								{patient.latest_care && (
									<aside>
										<p>
											<strong>Dernier soin:</strong>{" "}
											{new Date(
												patient.latest_care.performed_at
											).toLocaleDateString()}
										</p>
										<CareStatus
											invoice_paid={patient.latest_care.invoice_paid}
											invoice_send={patient.latest_care.invoice_send}
										/>
									</aside>
								)}
							</article>
						))}
						<Pagination />
					</>
				)}
			</section>
		</>
	);
}

export default Patient;
