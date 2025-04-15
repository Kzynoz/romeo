import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CareStatus from "./Components/CareStatus";
import SearchBar from "./Components/SearchBar/SearchBar";
import Pagination from "./Components/Pagination";

import { setTotalPages, reset } from "../features/paginationSlice";

function Patient() {
	const [datas, setDatas] = useState([]);
	const [error, setError] = useState("");
	const [message, setMessage] = useState("");

	const { page } = useSelector((state) => state.pagination);
	const {
		isAdmin,
		infos: { role, id },
	} = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchPatients(page) {
			const limit = 10;
			const offset = (page - 1) * limit;

			let URL = `http://localhost:9000/api/v1/patients?limit=${limit}&offset=${offset}`;

			if (role === "guardian") {
				URL += `&guardian_id=${id}`;
			}

			try {
				const res = await fetch(URL, {
					credentials: "include",
				});

				if (res.ok) {
					const { response, totalPages } = await res.json();

					console.log(totalPages);
					setDatas(response);
					dispatch(setTotalPages(totalPages));
				} else {
					const { message } = await res.json();
					setMessage(message);
				}
			} catch (error) {
				const { message } = await error.json();
				setError(message);
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
				{isAdmin && (
					<button
						className="add-button"
						onClick={() => {
							navigate("/patients/ajouter");
						}}
					>
						Ajouter un patient
					</button>
				)}

				{error && <p>{error}</p>}

				{!datas.length ? (
					<>{message && <p>{message}</p>}</>
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

								<Link className="link-desktop" to={`/patients/${patient.id}`}>
									Consulter
								</Link>
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
