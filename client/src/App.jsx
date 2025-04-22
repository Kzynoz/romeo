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
		const cleanPath = path.replace(/\/+$/, ""); // Removes the trailing slashes

		const patterns = [
			{ regex: /^$/, id: "home" },
			{ regex: /^\/patients\/\d+$/, id: "patients-details" },
			{ regex: /^\/tuteurs\/\d+$/, id: "tuteurs-details" },
			{ regex: /^\/patients\/\d+\/soin\/\d+$/, id: "soins-details" },
			{ regex: /^\/maisons-retraite\/\d+$/, id: "maisons-retraite-details" },
			{ regex: /^\/statistiques\/\d+$/, id: "statistiques" },
			{ regex: /\/[^/]+\/ajouter$/, id: "add-form" },
		];

		for (const { regex, id } of patterns) {
			if (regex.test(cleanPath)) {
				return id;
			}
		}

		// Default: remove the first slash and return the path
		return cleanPath.slice(1, cleanPath.length);
	}

	useEffect(() => {
		// Reset menu state when the location changes
		dispatch(reset());

		// Removes the last slash in URL
		const cleanPath = location.pathname.replace(/\/+$/, ""); // Removes excess slashes
		if (location.pathname !== cleanPath) {
			window.history.replaceState(null, "", cleanPath);
		}
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
