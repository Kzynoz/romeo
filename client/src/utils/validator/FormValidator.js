function validateName(name) {
	if (!name) return "Le nom de l'établissement est obligatoire.";
	if (name.length > 150)
		return "Le nom de l'établissement ne peut pas dépasser 150 caractères.";
	return null;
}

function validateContact(contact) {
	if (!contact) return null;
	if (contact.length > 150)
		return "Le nom de la personne responsable ne peut pas dépasser 150 caractères.";
	return null;
}

function validateNumber(number) {
	if (!number) return "Le numéro de rue est obligatoire.";
	if (number.length > 10)
		return "Le numéro de rue ne peut pas dépasser 10 caractères.";
	return null;
}

function validateStreet(street) {
	if (!street) return "Le nom de la rue est obligatoire.";
	if (street.length > 140)
		return "Le nom de la rue ne peut pas dépasser 140 caractères.";
	return null;
}

function validateCity(city) {
	if (!city) return "La ville est obligatoire.";
	if (city.length > 100)
		return "Le nom de la ville ne peut pas dépasser 100 caractères.";
	return null;
}

function validateZipCode(zip_code) {
	if (!zip_code) return "Le code postal est obligatoire.";
	if (!/^\d{5}$/.test(zip_code))
		return "Le code postal doit contenir exactement 5 chiffres.";
	return null;
}

export function validateForm(formData) {
	const errors = {};

	const validations = [
		{ field: "name", validate: validateName },
		{ field: "contact", validate: validateContact },
		{ field: "number", validate: validateNumber },
		{ field: "street", validate: validateStreet },
		{ field: "city", validate: validateCity },
		{ field: "zip_code", validate: validateZipCode },
	];

	validations.forEach(({ field, validate }) => {
		const error = validate(formData[field]);
		if (error) {
			errors[field] = error;
		}
	});

	return errors;
}
