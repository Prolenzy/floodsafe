// scripts/config.js
// Configuration and environment variables management
class AppConfig {
    constructor() {
        this.config = {
            GEMINI_API_KEY: this.getEnvironmentVariable('GEMINI_API_KEY'),
            ANALYSIS_DETAIL_LEVEL: this.getEnvironmentVariable('ANALYSIS_DETAIL_LEVEL') || 'detailed',
            AUTO_SAVE_RESULTS: this.getEnvironmentVariable('AUTO_SAVE_RESULTS') !== 'false'
        };
    }

    getEnvironmentVariable(name) {
        // Check if running in browser environment
        if (typeof window !== 'undefined' && window.__env) {
            return window.__env[name];
        }
        
        // For Node.js environments (if needed in future)
        if (typeof process !== 'undefined' && process.env) {
            return process.env[name];
        }
        
        // Fallback to localStorage for browser without build process
        return localStorage.getItem(name);
    }

    get(key) {
        return this.config[key];
    }

    set(key, value) {
        this.config[key] = value;
        localStorage.setItem(key, value);
    }

    // Method to initialize environment variables
    initEnvVariables(envObject) {
        if (typeof window !== 'undefined') {
            window.__env = envObject;
        }
        // Update config with new values
        Object.keys(envObject).forEach(key => {
            this.config[key] = envObject[key];
        });
    }
}

// Initialize global configuration
window.appConfig = new AppConfig();

// For development: Load environment variables from a global object
// In production, these would be set by the build process
window.__env = window.__env || {
    GEMINI_API_KEY: localStorage.getItem('GEMINI_API_KEY') || '',
    ANALYSIS_DETAIL_LEVEL: localStorage.getItem('ANALYSIS_DETAIL_LEVEL') || 'detailed',
    AUTO_SAVE_RESULTS: localStorage.getItem('AUTO_SAVE_RESULTS') !== 'false'
};