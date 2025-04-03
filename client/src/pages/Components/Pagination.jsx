import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../features/paginationSlice";

function Pagination() {
	const dispatch = useDispatch();
	const { page, totalPages } = useSelector((state) => state.pagination);

	return totalPages > 1 ? (
		<div className="pagination">
			<button
				disabled={page <= 1}
				onClick={() => {
					if (page > 1) dispatch(setPage(page - 1));
				}}
			>
				Précedent
			</button>
			<p>
				{page} / {totalPages}
			</p>
			<button
				disabled={page >= totalPages || totalPages === 0}
				onClick={() => {
					if (page < totalPages) dispatch(setPage(page + 1));
				}}
			>
				Suivant
			</button>
		</div>
	) : null;
}

export default Pagination;
