function validateType(type) {
	console.log(type);
	if (!type) return "Le type de soin est obligatoire.";
	if (
		type !== "soin pédicure" &&
		type !== "bilan podologique et orthèse plantaire"
	)
		return "Le type de soin n'est pas valide.";
	return null;
}

function validatePerformedAt(date) {
	if (!date) return "La date du soin est obligatoire.";
	if (isNaN(new Date(date).getTime())) return "La date est invalide.";
	return null;
}

function validatePractitioner(practitioner) {
	if (practitioner === "choisir") return "Veuillez séléctionner le praticien.";
	if (!practitioner) return "Le praticien est obligatoire.";
	return null;
}

function validatePrice(price) {
	if (!price) return "Le prix est obligatoire.";
	if (isNaN(Number(price))) return "Le prix doit être un nombre";
	if (Number(price) < 0 || Number(price) > 9999.99)
		return "Le prix ne peut pas être 0 ou dépasser 9999,99€";
	if (!/^\d{1,4}(\.\d{1,2})?$/.test(price))
		return "Prix avec maximum de 4 chiffres avant la virgule et 2 après.";

	return null;
}

function validateComplements(complements) {
	if (!complements) return null;
	if (complements.length > 150)
		return "Les informations supplémentaires de peuvent pas dépasser 150.";
	return null;
}

export function careValidator(formData) {
	const errors = {};

	const validations = [
		{ field: "type", validate: validateType },
		{ field: "performed_at", validate: validatePerformedAt },
		{ field: "practitioner_id", validate: validatePractitioner },
		{ field: "price", validate: validatePrice },
		{ field: "complements", validate: validateComplements },
	];

	validations.forEach(({ field, validate }) => {
		const error = validate(formData[field]);
		if (error) {
			errors[field] = error;
		}
	});
	console.log(errors);
	return errors;
}
