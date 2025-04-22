import "dotenv/config";
import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import router from "./router/index.routes.js";
import morgan from "morgan";


// Set up server configuration from environment variables or default values
const PORT = process.env.PORT || process.env.LOCAL_PORT;
const HOST = process.env.DOMAIN || "localhost";
const base_url = "/api/v1";

// Initialize Express app
const app = express();

// HTTP request logger middleware (only for dev)
app.use(morgan("dev"));

// Set up CORS (Cross-Origin Resource Sharing) middleware
app.use(
	cors({
    	origin: process.env.CLIENT_URL,
		credentials: true,
		methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Accept", "Authorization"],
	})
);


// Use cookie-parser to parse cookies from incoming requests
app.use(cookieParser());

// Use express.json() to automatically parse incoming JSON bodies
app.use(express.json());

// Use the router for API routes (base URL is prefixed by /api/v1)
app.use(base_url, router);

// Handle 404 errors if no route is matched
app.use((req, res, next) => {
	res.status(404).json({
		message: "Une erreur est survenue.",
	});
});

// Global error handling middleware
app.use((err, req, res, next) => {

	if (err.code === "ER_DUP_ENTRY") {
		res.status(409).json({
			message: `La donnée existe déjà.`,
		});
		return;
	}
	
	if (err.code === "ER_BAD_NULL_ERROR") {
		res.status(409).json({
			message: `La colonne ne peut pas être nulle.`,
		});
		return;
	}
	
	if (err.code === "ER_TRUNCATED_WRONG_VALUE") {
		res.status(409).json({
			message: `Le type de donnée n'est pas bon.`,
		});
		return;
	}
	
	// Catch all errors and send a generic response
	res.status(500).json({
		message: "Une erreur est survenue. Veuillez essayer plus tard.",
	});
	return;
});

// Start the server on the specified host and port
app.listen(PORT, () => console.log(`running at http://${HOST}:${PORT}`));
