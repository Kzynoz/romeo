/**
 * Validator functions for the Guardian Form.
 * 
 * Each individual field has a specific validation function checking for:
 *  - Presence (required fields)
 *  - Maximum length constraints
 *  - Specific format requirements
 * 
 * The main `guardianValidator` function aggregates all field validations,
 * and returns an object containing any validation errors found.
 */

function validateFirstname(firstname) {
	if (!firstname) return "Le prénom est obligatoire.";
	if (firstname.length > 50)
		return "Le prénom ne peut pas dépasser 150 caractères.";
	return null;
}

function validateLastname(lastname) {
	if (!lastname) return "Le nom est obligatoire.";
	if (lastname.length > 150)
		return "Le nom ne peut pas dépasser 150 caractères.";
	return null;
}

function validateTitle(title) {
	if (!title) return "La civilité est obligatoire.";
	return null;
}

function validatePhone(phone) {
	if (!phone) return null;
	if (!/^\d{10}$/.test(phone))
		return "Le numéro de téléphone doit contenir exactement 10 chiffres.";
	return null;
}

function validateEmail(email) {
	if (!email) return "L'adresse mail est obligatoire.";
	if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email))
		return "L'adresse mail doit être dans un format valide";
	if (email.length > 150)
		return "L'adresse mail ne peut pas dépasser 150 caractères.";
	return null;
}

function validateCompany(company) {
	if (!company) return null;
	if (company.length > 150)
		return "Le nom de la société ne peut pas dépasser 150 caractères.";
	return null;
}

function validateRelationship(relationship) {
	if (relationship === "choisir") return "Veuillez séléctionner la relation.";
	if (!relationship) return "La relation est obligatoire.";
	return null;
}

function validateStreet(street) {
	if (!street) return null;
	if (street.length > 145)
		return "Le nom de la rue ne peut pas dépasser 150 caractères.";
	return null;
}

function validateCity(city) {
	if (!city) return null;
	if (city.length > 100)
		return "Le nom de la ville ne peut pas dépasser 100 caractères.";
	return null;
}

function validateZipCode(zip_code) {
	if (!zip_code) return null;
	if (zip_code > 0 && !/^\d{5}$/.test(zip_code))
		return "Le code postal doit contenir exactement 5 chiffres.";
	return null;
}

export function guardianValidator(formData) {
	const errors = {};

	const validations = [
		{ field: "title", validate: validateTitle },
		{ field: "firstname", validate: validateFirstname },
		{ field: "lastname", validate: validateLastname },
		{ field: "phone", validate: validatePhone },
		{ field: "email", validate: validateEmail },
		{ field: "relationship", validate: validateRelationship },
		{ field: "company", validate: validateCompany },
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
