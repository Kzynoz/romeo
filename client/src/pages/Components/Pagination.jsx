import PropTypes from "prop-types";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";

/**
 * Pagination component for navigation through pages
 * 
 * @param {number} page - The current page number
 * @param {number} totalPages - Total number of pages
 * @param {function} onPageChange - Function to handle page change
 * 
 * @returns - Rendered pagination controls
 */

function Pagination({ page, totalPages, onPageChange }) {
	
	// Render pagination only if there are more than 1 page
	return totalPages > 1 ? (
		<div className="pagination">
			<button
				disabled={page <= 1} // Disable button if on the first page
				onClick={() => {
					if (page > 1) onPageChange(page - 1);
				}}
			>
				<FontAwesomeIcon icon={faAngleLeft} />
			</button>
			
			{/* Display current page and total pages */}
			<p>
				{page} / {totalPages}
			</p>
			<button
				disabled={page >= totalPages || totalPages === 0} // Disable button if on the last page
				onClick={() => {
					if (page < totalPages) onPageChange(page + 1);
				}}
			>
				<FontAwesomeIcon icon={faAngleRight} />
			</button>
		</div>
		
	) : null;
}

Pagination.propTypes = {
	page: PropTypes.number.isRequired,
	totalPages: PropTypes.number.isRequired,
	onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
