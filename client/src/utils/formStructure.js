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
				name: "number",
				type: "text",
				label: "Numéro de rue",
				maxLength: 10,
				required: true,
			},
			{
				name: "street",
				type: "text",
				label: "Rue",
				maxLength: 140,
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
