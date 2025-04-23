/**
 * Validator functions for the Patient form.
 * 
 * Each individual field has a specific validation function checking for:
 *  - Presence (required fields)
 *  - Maximum length constraints
 *  - Specific format requirements
 * 
 * The main `patientValidator` function aggregates all field validations,
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

function validateGuardian(guardian) {
	if (!guardian) return "Veuillez sélectionner un tuteur";
	return null;
}

function validateRetirementHome(retirementHome) {
	if (!retirementHome) return "Veuillez sélectionner une maison de retraite";
	return null;
}

export function patientValidator(formData) {
	const errors = {};

	const validations = [
		{ field: "title", validate: validateTitle },
		{ field: "firstname", validate: validateFirstname },
		{ field: "lastname", validate: validateLastname },
		{ field: "guardian_id", validate: validateGuardian },
		{ field: "retirement_home_id", validate: validateRetirementHome },
	];

	validations.forEach(({ field, validate }) => {
		const error = validate(formData[field]);
		
		if (error) {
			errors[field] = error;
		}
	});
	
	return errors;
}
