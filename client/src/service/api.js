const BASE_URL = "/api/v1";

/**
 * Custom function to perform a fetch request with a predefined base URL
 *
 * @param {string} endpoint - The API endpoint to call (relative to the base URL)
 * @param {object} options - Optional fetch options (method, headers, body, etc.)
 * 
 * @returns - The fetch response
 */
 
async function customFetch(endpoint, options = null) {
    
    const response = await fetch(BASE_URL + endpoint, options);
    
    return response;
}

export { customFetch };