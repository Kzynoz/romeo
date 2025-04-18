/**
 * Configuration object for the Guardian form.
 * The API endpoint to which the form data should be submitted (`url`).
 * The structure of the form fields, grouped into logical sections (`contact` and `adresse`).
 * This structure can be used to dynamically generate the create or update form
 */

export const formGuardian = {
	url: "guardians",
	structure: {
		contact: [
			{
				name: "title",
				type: "radio",
				label: "Civilité",
				options: [
					{ value: "m.", label: "Monsieur" },
					{ value: "mme", label: "Madame" },
				],
				required: true,
			},
			{
				name: "firstname",
				type: "text",
				label: "Prénom",
				maxLength: 50,
				required: true,
			},
			{
				name: "lastname",
				type: "text",
				label: "Nom",
				maxLength: 150,
				required: true,
			},
			{
				name: "phone",
				type: "phone",
				label: "Téléphone",
				maxLength: 10,
				required: false,
			},
			{
				name: "email",
				type: "email",
				label: "Email",
				maxLength: 250,
				required: true,
			},
			{
				name: "relationship",
				type: "select",
				label: "Relation",
				options: [
					{
						value: "choisir",
						label: "Voir la liste",
					},
					{ value: "parent", label: "Parent" },
					{ value: "légal", label: "Légal" },
					{ value: "famille", label: "Famille" },
					{ value: "société", label: "Société" },
				],
				required: true,
			},
			{
				name: "company",
				type: "text",
				label: "Nom de la société (si Relation est société)",
				maxLength: 50,
			},
		],
		adresse: [
			{
				name: "street",
				type: "text",
				label: "Rue",
				maxLength: 150,
				required: false,
			},
			{
				name: "city",
				type: "text",
				label: "Ville",
				maxLength: 100,
				required: false,
			},
			{
				name: "zip_code",
				type: "text",
				label: "Code postal",
				maxLength: 5,
				required: false,
			},
		],
	},
};
