import PropTypes from "prop-types";

/**
 * Care Status used to create a dynamic content et class based on the billing status
 *
 * @params {number} invoice_paid - Indicated if the invoice has been paid (1 for true, 0 for false)
 * @params {number} invoice_send - Indicated if the invoice has been sent (1 for true, 0 for false)
 *
 * @returns - HTML span with the status
 */
function CareStatus({ invoice_paid, invoice_send }) {
	// Returns the billing status
	function removeAccents() {
		let careStatus = "En attente";

		if (invoice_paid && invoice_send) {
			careStatus = "Acquitté";
		} else if (!invoice_paid && invoice_send) {
			careStatus = "Impayé";
		}

		// Creates a dynamic class based on the billing status
		const className = careStatus
			.normalize("NFD") // Normalization Form Decomposed returns the letter + diacritics (é = e + ')
			.replace(/\p{Diacritic}/gu, "") // Removes the diacritic, gu for global unicode
			.toLowerCase()
			.replace(/\s+/g, "-");

		return { careStatus, className };
	}

	const { careStatus, className } = removeAccents();

	return <span className={`status ${className}`}>{careStatus}</span>;
}

CareStatus.propTypes = {
	invoice_paid: PropTypes.oneOf([0, 1]).isRequired,
	invoice_send: PropTypes.oneOf([0, 1]).isRequired,
};

export default CareStatus;