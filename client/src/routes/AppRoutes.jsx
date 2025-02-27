import { Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Auth/Login";
import ProtectedRoute from "./ProtectedRoute";
import Patient from "../pages/Patient";
import PatientDetails from "../pages/PatientDetails";
import CareDetails from "../pages/CareDetails";

function AppRoutes() {
	return (
		<Routes>
			<Route path="login" element={<Login />} />
			<Route
				path="/"
				element={
					<ProtectedRoute>
						<Home />
					</ProtectedRoute>
				}
			/>
			<Route
				path="patients"
				element={
					<ProtectedRoute>
						<Patient />
					</ProtectedRoute>
				}
			/>
			<Route
				path="patient/:id"
				element={
					<ProtectedRoute>
						<PatientDetails />
					</ProtectedRoute>
				}
			/>
			<Route
				path="patient/:idPatient/care/:id"
				element={
					<ProtectedRoute>
						<CareDetails />
					</ProtectedRoute>
				}
			/>
		</Routes>
	);
}

export default AppRoutes;
