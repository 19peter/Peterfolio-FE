import { fetchApi, authFetchApi } from './api';

export const blogService = {
    /**
     * Fetch all blogs
     */
    getAllBlogs: async () => {
        try {
            const response = await fetchApi('/blogs');
            return await response.json();
        } catch (error) {
            console.error('Failed to fetch blogs:', error);
            throw error;
        }
    },

    /**
     * Fetch a specific blog by ID
     */
    getBlogById: async (id) => {
        try {
            const response = await fetchApi(`/blogs/${id}`);
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch blog ${id}:`, error);
            throw error;
        }
    },

    /**
     * Create a new blog (Requires Admin Authentication)
     */
    createBlog: async (blogData) => {
        try {
            const response = await authFetchApi('/blogs', {
                method: 'POST',
                body: JSON.stringify(blogData)
            });
            return await response.json();
        } catch (error) {
            console.error('Failed to create blog:', error);
            throw error;
        }
    },

    /**
     * Update an existing blog (Requires Admin Authentication)
     */
    updateBlog: async (id, blogData) => {
        try {
            const response = await authFetchApi(`/blogs/${id}`, {
                method: 'PUT',
                body: JSON.stringify(blogData)
            });
            return await response.json();
        } catch (error) {
            console.error(`Failed to update blog ${id}:`, error);
            throw error;
        }
    },

    /**
     * Delete a blog (Requires Admin Authentication)
     */
    deleteBlog: async (id) => {
        try {
            const response = await authFetchApi(`/blogs/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error(`Failed to delete blog ${id}:`, error);
            throw error;
        }
    }
};
