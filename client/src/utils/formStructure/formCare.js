/**
 * Configuration object for the Care form.
 * The API endpoint to which the form data should be submitted (`url`).
 * The structure of the form fields, grouped into logical sections (`informations` and `facturation`).
 * This structure can be used to dynamically generate the create or update form
 */

export const formCare = {
	url: "care",
	structure: {
		informations: [
			{
				name: "type",
				type: "select",
				label: "Type de soin*",
				options: [
					{
						value: "choisir",
						label: "Voir la liste",
					},
					{ value: "soin pédicure", label: "Soin pédicure" },
					{
						value: "bilan podologique et orthèse plantaire",
						label: "Bilan podologique et Orthèse plantaire",
					},
				],
				required: true,
			},
			{
				name: "performed_at",
				type: "date",
				label: "Réalisé le*",
				required: true,
			},
			{
				name: "price",
				type: "text",
				label: "Prix*",
				maxLength: 7,
				required: true,
			},
			{
				name: "complements",
				type: "textarea",
				label: "Informations complémentaires",
				maxLength: 150,
				required: false,
			},
		],
		facturation: [
			{
				name: "invoice_send",
				type: "radio",
				label: "Facture envoyée*",
				options: [
					{ value: "0", label: "Non" },
					{ value: "1", label: "Oui" },
				],
				required: true,
			},
			{
				name: "invoice_paid",
				type: "radio",
				label: "Facture réglée*",
				options: [
					{ value: "0", label: "Non" },
					{ value: "1", label: "Oui" },
				],
				required: true,
			},
		],
	},
};
