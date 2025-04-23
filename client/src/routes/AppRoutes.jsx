import { Route, Routes } from "react-router-dom";

// Importing all the components/pages for routing
import Home from "../pages/Home";

// Auth page
import Login from "../pages/Auth/Login";

// Patient pages
import Patient from "../pages/Patient/Patient";
import PatientDetails from "../pages/Patient/PatientDetails";
import FormPatient from "../pages/Patient/FormPatient";

// Guardian pages
import Guardian from "../pages/Guardian/Guardian";
import GuardianDetails from "../pages/Guardian/GuardianDetails";

// Retirement Home pages
import RetirementHome from "../pages/RetirementHome/RetirementHome";
import RetirementHomeDetails from "../pages/RetirementHome/RetirementHomeDetails";

// Care pages
import Care from "../pages/Care/Care";
import CareDetails from "../pages/Care/CareDetails";

// Legal pages
import LegalNotice from "../pages/Legal/LegalNotice";
import PrivacyPolicy from "../pages/Legal/PrivacyPolicy";

// Statistics page
import Statistics from "../pages/Statistics";

// Entity actions pages
import CreateEntity from "../pages/Entity/CreateEntity";

// Error pages
import Unauthorized from "../pages/Error/Unauthorized";
import PageNotFound from "../pages/Error/PageNotFound";

// Protected components
import ProtectedRoute from "./ProtectedRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";

function AppRoutes() {
	return (
		<Routes>
		     {/* Login route for non-authenticated users */}
			<Route path="login" element={<Login />} />
			<Route path="mentions-legales" element={<LegalNotice />} />
			<Route path="politique-confidentialite" element={<PrivacyPolicy />} />
			
			{/* Protected routes (requires authentication) */}
			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<Home />} />
				<Route path="patients" element={<Patient />} />
				<Route path="patients/:id" element={<PatientDetails />} />
				<Route path="patients/:id/soin/:idSoin" element={<CareDetails />} />

				{/* Route accessible pour le role Practitioner */}
				<Route element={<RoleProtectedRoute requiredRole="practitioner" />}>
					<Route path="patients/ajouter" element={<FormPatient />} />
					<Route path="patients/:id/soin/ajouter" element={<CreateEntity />} />
					<Route path="tuteurs" element={<Guardian />} />
					<Route path="tuteurs/ajouter" element={<CreateEntity />} />
					<Route path="tuteurs/:id" element={<GuardianDetails />} />
					<Route path="maisons-retraite" element={<RetirementHome />} />
					<Route path="maisons-retraite/ajouter" element={<CreateEntity />} />
					<Route
						path="maisons-retraite/:id"
						element={<RetirementHomeDetails />}
					/>
					<Route path="soins" element={<Care />} />
					<Route path="statistiques/:year" element={<Statistics />} />
				</Route>
				
				{/* Route for unauthorized access (not authorized to see the page) */}
				<Route path="non-autorise" element={<Unauthorized />} />
				
				{/* Fallback route for undefined paths */}
				<Route path="*" element={<PageNotFound />} />
			</Route>
		</Routes>
	);
}

export default AppRoutes;
