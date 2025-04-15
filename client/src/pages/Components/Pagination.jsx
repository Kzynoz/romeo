import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../../features/paginationSlice";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

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
				<FontAwesomeIcon icon={faAngleLeft} />
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
				<FontAwesomeIcon icon={faAngleRight} />
			</button>
		</div>
	) : null;
}

export default Pagination;
