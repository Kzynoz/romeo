import { useState, useEffect } from "react";
import { customFetch } from "../service/api.js";


/**
 * Custom hook to fetch data from API with optionnal pagination and guardian filter
 *
 * @param {string} url - The API endpoint URL
 * @param {number} limit - Optional limit for pagination
 * @param {object} guardian - Optional guardian to filter results by guardian ID
 *
 * @returns - Fetched data, error, pagination, loading status
 */

export function useFetchData(url,limit = null, guardian = null) {
    
    const [datas, setDatas] = useState([]);
    const [error, setError] = useState(null);
	const [page, setPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        async function fetchData() {
            
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
                finalURL += `${separator}guardian_id=${guardian.id}`;
            }
            
            const options = {
                credentials: "include",
            }

            try {
                setLoading(true);
                setError(null);
                setDatas([]);
                
                // Fetch data form the API
                const res = await customFetch(finalURL,options);

                if (res.ok) {
                    const { response, totalPages } = await res.json();
                    setDatas(response);
                    
                    console.log(response);
                    
                    // Update total pages if pagination is active
                    if (limit) {
                        setTotalPages(totalPages);
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

        fetchData();
        
    }, [page, url]); // Dependcies: page number or URL change triggers a new fetch

    return { datas, error, totalPages, page, setPage, loading };
}