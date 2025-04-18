/**
 * Configuration object for the Retirement Home form.
 * The API endpoint to which the form data should be submitted (`url`).
 * The structure of the form fields, grouped into logical sections (`contact` and `adresse`).
 * This structure can be used to dynamically generate the create or update form
 */

export const formRetirementHome = {
	url: "retirement-homes",
	structure: {
		contact: [
			{
				name: "name",
				type: "text",
				label: "Nom de l'établissement",
				maxLength: 150,
				required: true,
			},
			{
				name: "contact",
				type: "text",
				label: "Personne responsable",
				maxLength: 150,
			},
		],
		adresse: [
			{
				name: "street",
				type: "text",
				label: "Rue",
				maxLength: 150,
				required: true,
			},
			{
				name: "city",
				type: "text",
				label: "Ville",
				maxLength: 100,
				required: true,
			},
			{
				name: "zip_code",
				type: "text",
				label: "Code postal",
				maxLength: 5,
				required: true,
			},
		],
	},
};
