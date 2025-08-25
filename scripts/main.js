// scripts/main.js
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const getStartedBtn = document.getElementById('get-started-btn');

    // Load configuration first
    loadConfig();

    // Navigation functionality
    function switchSection(sectionName) {
        // Update active nav link
        navLinks.forEach(link => {
            if (link.dataset.section === sectionName) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
        
        // Show active section
        sections.forEach(section => {
            if (section.id === sectionName) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
        
        // Load history if navigating to history section
        if (sectionName === 'history') {
            if (typeof loadHistory === 'function') {
                loadHistory();
            }
        }
    }

    // Event listeners for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = link.dataset.section;
            switchSection(sectionName);
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        });
    });

    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
    }

    // Get Started button
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', () => {
            // Check if user is logged in
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            
            if (!isLoggedIn) {
                alert('Please log in to use the analysis feature');
                switchSection('login');
                return;
            }
            
            switchSection('analysis');
        });
    }

    // Initialize the page
    switchSection('home');
    
    // Load settings
    loadSettings();
});

// Load configuration
function loadConfig() {
    // Initialize app configuration
    if (window.appConfig) {
        console.log('Application configuration loaded');
    }
}

// Load settings from localStorage
function loadSettings() {
    const detailLevel = localStorage.getItem('aiDetailLevel') || 'detailed';
    const autoSave = localStorage.getItem('autoSave') !== 'false';
    const measurementUnit = localStorage.getItem('measurementUnit') || 'metric';
    
    // Apply settings to UI if elements exist
    const detailSelect = document.getElementById('ai-detail-level');
    const autoSaveCheckbox = document.getElementById('auto-save');
    const unitSelect = document.getElementById('measurement-unit');
    
    if (detailSelect) detailSelect.value = detailLevel;
    if (autoSaveCheckbox) autoSaveCheckbox.checked = autoSave;
    if (unitSelect) unitSelect.value = measurementUnit;
    
    // Apply to AI service
    if (window.geminiAIService) {
        // Set API key if available
        const apiKey = window.appConfig.get('GEMINI_API_KEY');
        if (apiKey) {
            window.geminiAIService.setApiKey(apiKey);
        }
    }
}

// Save settings to localStorage
function saveSettings() {
    const detailLevel = document.getElementById('ai-detail-level').value;
    const autoSave = document.getElementById('auto-save').checked;
    const measurementUnit = document.getElementById('measurement-unit').value;
    
    localStorage.setItem('aiDetailLevel', detailLevel);
    localStorage.setItem('autoSave', autoSave);
    localStorage.setItem('measurementUnit', measurementUnit);
    
    alert('Settings saved successfully!');
}

// Add event listener for settings save button
document.addEventListener('DOMContentLoaded', function() {
    const saveSettingsBtn = document.getElementById('save-settings');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', saveSettings);
    }
});