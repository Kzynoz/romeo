import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Patient from "../pages/Patient";
import PatientDetails from "../pages/PatientDetails";
import CareDetails from "../pages/CareDetails";
import Guardian from "../pages/Guardian";
import GuardianDetails from "../pages/GuardianDetails";
import RetirementHome from "../pages/RetirementHome";
import RetirementHomeDetails from "../pages/RetirementHomeDetails";
import Care from "../pages/Care";
import Statistics from "../pages/Statistics";
import CreateEntity from "../pages/CreateEntity";
import FormPatient from "../pages/FormPatient";

function AppRoutes() {
	return (
		<Routes>
			<Route path="login" element={<Login />} />
			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<Home />} />
				<Route path="patients" element={<Patient />} />
				<Route path="patients/ajouter" element={<FormPatient />} />
				<Route path="patients/:id" element={<PatientDetails />} />
				<Route path="patients/:id/soin/ajouter" element={<CreateEntity />} />
				<Route path="patients/:id/soin/:idSoin" element={<CareDetails />} />

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
		</Routes>
	);
}

export default AppRoutes;
