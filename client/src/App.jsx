import AppRoutes from "./routes/AppRoutes";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { useLocation } from "react-router-dom";

function App() {
	const location = useLocation();
	const path = location.pathname;

	// Génére des id dynmaique en fonction de mon path
	function handleId() {
		if (path === "/") return "home";
		if (/^\/patients\/\d+$/.test(path)) return "patients-details"; // Vérifié que le chemin commence bien par /patients, test renvera true ou false
		if (/^\/tuteurs\/\d+$/.test(path)) return "tuteurs-details";
		if (/^\/patients\/\d+\/soin\/\d+$/.test(path)) return "soins-details";
		if (/^\/maisons-retraite\/\d+$/.test(path))
			return "maisons-retraite-details";
		if (/^\/statistiques\/\d+$/.test(path)) return "statistiques";
		if (/\/[^/]+\/ajouter$/.test(path)) {
			return "add-form";
		}

		return path.slice(1, path.length);
	}

	return (
		<>
			<Header />

			<main className="container" id={handleId()}>
				<AppRoutes />
			</main>

			<Footer />
		</>
	);
}

export default App;
