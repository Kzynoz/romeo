/**
 * Validator functions for the Retirement Home form.
 * 
 * Each individual field has a specific validation function checking for:
 *  - Presence (required fields)
 *  - Maximum length constraints
 *  - Specific format requirements
 * 
 * The main `retirementHomeValidator` function aggregates all field validations,
 * and returns an object containing any validation errors found.
 */

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

function validateStreet(street) {
	if (!street) return "Le nom de la rue est obligatoire.";
	if (street.length > 145)
		return "Le nom de la rue ne peut pas dépasser 150 caractères.";
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

export function retirementHomeValidator(formData) {
	const errors = {};

	// List of all fields to validate with their corresponding validation function
	const validations = [
		{ field: "name", validate: validateName },
		{ field: "contact", validate: validateContact },
		{ field: "street", validate: validateStreet },
		{ field: "city", validate: validateCity },
		{ field: "zip_code", validate: validateZipCode },
	];

	// Perform each validation and collect errors
	validations.forEach(({ field, validate }) => {
		const error = validate(formData[field]);
		
		if (error) {
			errors[field] = error;
		}
	});

	// Return all validation errors
	return errors;
}
