import { ACTIVE_THEME, THEMES } from '../config/themeConfig';

/**
 * Custom hook to provide component-specific styles based on the active theme.
 * 
 * @param {Object} themeStyles - An object mapping theme names to their respective CSS module objects.
 *                                Example: { Glass: glassStyles, Minimalist: minimalistStyles }
 * @returns {Object} - The CSS module object for the currently active theme.
 */
export const useStyles = (themeStyles) => {
    if (!themeStyles) return {};

    // Return the styles for the active theme (e.g., 'Glass' or 'Minimalist')
    return themeStyles[ACTIVE_THEME] || {};
};
