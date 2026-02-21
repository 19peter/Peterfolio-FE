import { fetchApi, authFetchApi } from './api';

export const cvService = {
    /**
     * Fetch the CV data
     * @returns {Promise<Object>} The CV data
     */
    getCv: async () => {
        try {
            const response = await fetchApi('/cv');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch CV:', error);
            throw error;
        }
    },

    /**
     * Update the CV data (Requires Admin Authentication)
     * @param {Object} cvData The entire new CV data structure
     * @returns {Promise<Object>} The updated CV data
     */
    updateCv: async (cvData) => {
        try {
            cvData["main"] = "main";
            const response = await authFetchApi('/cv', {
                method: 'PUT',
                body: JSON.stringify(cvData)
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to update CV:', error);
            throw error;
        }
    }
};
