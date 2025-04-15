import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import SearchBar from "./Components/SearchBar/SearchBar";
import Pagination from "./Components/Pagination";

import { setTotalPages, reset } from "../features/paginationSlice";

function Guardian() {
	const [datas, setDatas] = useState([]);
	const [error, setError] = useState("");

	const { page } = useSelector((state) => state.pagination);
	const { isAdmin } = useSelector((state) => state.auth);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	useEffect(() => {
		async function fetchGuardians(page) {
			const limit = 10;
			const offset = (page - 1) * limit;

			try {
				const res = await fetch(
					`http://localhost:9000/api/v1/guardians?limit=${limit}&offset=${offset}`,
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
		fetchGuardians(page);
	}, [page]);

	useEffect(() => {
		dispatch(reset());
	}, [navigate]);

	return (
		<>
			<header>
				<h1>Les tuteurs</h1>
				<p>Ici tu retrouveras la liste de tous les tuteurs</p>
			</header>
			<SearchBar entityType={"guardian"} />
			<section className="wrapper">
				{isAdmin && (
					<button
						className="add-button"
						onClick={() => navigate(`/tuteurs/ajouter`)}
					>
						Ajouter un tuteur
					</button>
				)}

				{error && <p>{error}</p>}

				{!datas.length ? (
					<p>Chargement…</p>
				) : (
					<>
						{datas.map((guardian) => (
							<article
								key={guardian.id}
								onClick={() => navigate(`/tuteurs/${guardian.id}`)}
							>
								<h2>
									{guardian.title} {guardian.firstname} {guardian.lastname}{" "}
									{guardian.company && (
										<span className="society"> {guardian.company}</span>
									)}
								</h2>

								{guardian.guardianship_count > 0 && (
									<span>
										<strong>Nombre de tutelles:</strong>
										{guardian.guardianship_count}
									</span>
								)}

								<Link className="link-desktop" to={`/tuteurs/${guardian.id}`}>
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

export default Guardian;
