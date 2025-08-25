// Main application functionality
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const getStartedBtn = document.getElementById('get-started-btn');

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
    }

    // Event listeners for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionName = link.dataset.section;
            switchSection(sectionName);
            
            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
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

    // Preload the image analysis model in the background
    setTimeout(() => {
        console.log('Preloading image analysis model...');
        if (window.imageAnalyzer && typeof window.imageAnalyzer.loadModel === 'function') {
            window.imageAnalyzer.loadModel().then(success => {
                if (success) {
                    console.log('Image analysis model preloaded successfully');
                } else {
                    console.warn('Failed to preload image analysis model');
                }
            });
        }
    }, 3000);

    // Initialize the page
    switchSection('home');
});