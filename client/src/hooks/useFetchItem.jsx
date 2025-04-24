import { useState, useEffect } from "react";
import { customFetch } from "../service/api.js";

/**
 * Custom hook to fetch a single item from API with optionnal pagination, guardian filter, 
 * dependencies and counter key
 * 
 * @param {string} url - The API endpoint URL
 * @param {number} limit - Optional limit for pagination
 * @param {string} countKey - The Key used to get the total count for pagination
 * @param {object} guardian - Optional guardian to filter results by guardian ID
 * @param {array}  dependencies - Optional dependencies to trigger the useEffect
 * 
 * @returns - Fetched data, error, pagination info, loading status
 */

function useFetchItem({url, limit = null, countKey = null, guardian = null, dependencies = []}) {
              
    const [datas, setDatas] = useState(null);
    const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        // Fetch function to get data from API
        async function fetchItem() {

            let finalURL = url;

            // Handle pagination if a limit is provided
            if (limit) {
                const offset = (page - 1) * limit;
                finalURL += `?limit=${limit}&offset=${offset}`;
            }
            
            // Add guardian filtrer if guardian is provided
            // Separator uses for adding & if limit is provided or ?
            if (guardian && guardian.role === "guardian") {
                const separator = finalURL.includes("?") ? "&" : "?";
                finalURL += `${separator}guardian_id=${guardian.id || guardian.guardianId}`;
            }

            const options = {
                credentials: "include",
            };

            try {
                setLoading(true); 
                setError(null);
                setDatas(null);
                
                // Fetch data form the API
                const res = await customFetch(finalURL,options);

                if (res.ok) {
                    const { response } = await res.json();
                    setDatas(response);
                    // If a limit is set, calculate the total pages based on countKey
                    if (limit && response[countKey]) {
                        setTotalPages(Math.ceil(response[countKey] / limit));
                    }
                } else {
                    const { message } = await res.json();
                    setError(message);
                }
            } catch (error) {
                setError("Une erreur est survenue lors de la récupération des données.");
            } finally {
                setLoading(false);
            }
        }

        fetchItem();
        
    }, [page, ...dependencies]); // Re-run effect if page or any dependency changes

    return { datas, error, totalPages, page, setPage, loading };
}

export default useFetchItem;