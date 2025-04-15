import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CareStatus from "./Components/CareStatus";
import SearchBar from "./Components/SearchBar/SearchBar";
import Pagination from "./Components/Pagination";

import { setTotalPages, reset } from "../features/paginationSlice";

function Care() {
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
					`http://localhost:9000/api/v1/care?limit=${limit}&offset=${offset}`,
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
				<h1>Mes Soins</h1>
				<p>Ici tu retrouveras la liste de tous tes soins effectués</p>
			</header>

			<SearchBar entityType={"care"} />

			<section className="wrapper">
				{error && <p>{error}</p>}

				{!datas.length ? (
					<p>Chargement…</p>
				) : (
					<>
						{datas.map((data) => (
							<article
								key={data.care.id}
								onClick={() =>
									navigate(`/patients/${data.patient.id}/soin/${data.care.id}`)
								}
							>
								<h2>
									Soin{" "}
									<span>
										{new Date(data.care.performed_at).toLocaleDateString()}
									</span>
								</h2>
								<h3>
									{data.patient.title} {data.patient.firstname}{" "}
									{data.patient.lastname}
								</h3>
								<p>
									<strong>Praticien:</strong> {data.practitioner.alias}
								</p>

								<CareStatus
									invoice_paid={data.care.invoice_paid}
									invoice_send={data.care.invoice_send}
								/>

								<Link
									className="link-desktop"
									to={`/patients/${data.patient.id}/soin/${data.care.id}`}
								>
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

export default Care;
