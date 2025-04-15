import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SearchBar from "./Components/SearchBar/SearchBar";
import Pagination from "./Components/Pagination";

import { setTotalPages, reset } from "../features/paginationSlice";

function RetirementHome() {
	const [datas, setDatas] = useState([]);
	const [error, setError] = useState("");

	const { page } = useSelector((state) => state.pagination);
	const { isAdmin } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchRetirementHomes(page) {
			const limit = 10;
			const offset = (page - 1) * limit;

			try {
				const res = await fetch(
					`http://localhost:9000/api/v1/retirement-homes?limit=${limit}&offset=${offset}`,
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
				setError(error.message);
			}
		}
		fetchRetirementHomes(page);
	}, [page]);

	useEffect(() => {
		dispatch(reset());
	}, [navigate]);

	return (
		<>
			<header>
				<h1>Les maisons de retraite</h1>
				<p>
					Ici tu retrouveras la liste de toutes les maisons de retraite ou foyer
				</p>
			</header>

			<SearchBar entityType={"retirement home"} />

			<section className="wrapper">
				{isAdmin && (
					<button
						className="add-button"
						onClick={() => navigate(`/maisons-retraite/ajouter`)}
					>
						Ajouter un établissement
					</button>
				)}

				{error && <p>{error}</p>}

				{!datas.length ? (
					<p>Chargement…</p>
				) : (
					<>
						{datas.map((establishment) => (
							<article
								key={establishment.id}
								onClick={() =>
									navigate(`/maisons-retraite/${establishment.id}`)
								}
							>
								<h2>{establishment.name}</h2>

								{establishment.patients_count > 0 && (
									<span>
										<strong>Nombre de patiens:</strong>
										{establishment.patients_count}
									</span>
								)}

								<Link
									className="link-desktop"
									to={`/maisons-retraite/${establishment.id}`}
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

export default RetirementHome;
