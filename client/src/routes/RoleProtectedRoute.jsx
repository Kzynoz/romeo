import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

function RoleProtectedRoute({ requiredRole }) {
	const {
		infos: { role },
	} = useSelector((state) => state.auth);

	if (role !== requiredRole) {
		return <Navigate to="/non-autorise" />;
	}

	return <Outlet />;
}

export default RoleProtectedRoute;
