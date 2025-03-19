import PropTypes from "prop-types";

function CareStatus({ invoice_paid, invoice_send }) {
	function removeAccents() {
		let careStatus = "En attente";

		if (invoice_paid && invoice_send) {
			careStatus = "Acquitté";
		} else if (!invoice_paid && invoice_send) {
			careStatus = "Impayé";
		}

		const className = careStatus
			.normalize("NFD") // Normalization Form Decomposed retourne la lettre + diacritiques (é = e + ')
			.replace(/\p{Diacritic}/gu, "") // supprime les diacritiques
			.toLowerCase()
			.replace(/\s+/g, "-");
		return { careStatus, className };
	}
	const { careStatus, className } = removeAccents();

	return <span className={`status ${className}`}>{careStatus}</span>;
}

export default CareStatus;

CareStatus.propTypes = {
	invoice_paid: PropTypes.oneOf([0, 1]).isRequired,
	invoice_send: PropTypes.oneOf([0, 1]).isRequired,
};
