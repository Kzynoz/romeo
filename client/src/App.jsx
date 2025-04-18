import AppRoutes from "./routes/AppRoutes";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useLocation } from "react-router-dom";
import { reset } from "./features/menuSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";

function App() {
	const location = useLocation();
	const dispatch = useDispatch();

	// Current URL path
	const path = location.pathname;

	// Generate dynamic ID based on the current path
	function handleId() {
		if (path === "/") return "home";
		if (/^\/patients\/\d+$/.test(path)) return "patients-details"; // Matches /patients/{id}
		if (/^\/tuteurs\/\d+$/.test(path)) return "tuteurs-details";
		if (/^\/patients\/\d+\/soin\/\d+$/.test(path)) return "soins-details";
		if (/^\/maisons-retraite\/\d+$/.test(path))
			return "maisons-retraite-details";
		if (/^\/statistiques\/\d+$/.test(path)) return "statistiques";
		if (/\/[^/]+\/ajouter$/.test(path)) {
			return "add-form";
		}

		// Default: remove the first slash and return the path
		return path.slice(1, path.length);
	}

	useEffect(() => {
		// Reset menu state when the location changes
		dispatch(reset());
		
	}, [location]);

	return (
		<>
			<Header />

			<main className="container" id={handleId()}>
				<AppRoutes /> {/* Render the routes */}
			</main>

			<Footer />
		</>
	);
}

export default App;
