export const formCare = {
	url: "care",
	structure: {
		informations: [
			{
				name: "type",
				type: "select",
				label: "Type de soin",
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
				label: "Réalisé le",
				required: true,
			},
			{
				name: "practitioner_id",
				type: "select",
				label: "Réalisé par",
				options: [
					{
						value: "choisir",
						label: "Voir la liste",
					},
					{ value: "4", label: "Margot" },
					{
						value: "1",
						label: "Julien",
					},
				],
				required: true,
			},
			{
				name: "price",
				type: "text",
				label: "Prix",
				maxLength: 7,
				required: true,
			},

			// dynamique avec un fetch de la bdd
			{
				name: "complements",
				type: "textarea",
				label: "Informations complémentaires",
				maxLength: 150,
				required: false,
			},
		],
	},
};
