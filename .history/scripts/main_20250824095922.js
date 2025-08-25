// DOM Elements
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

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
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Get Started button
document.getElementById('get-started-btn').addEventListener('click', () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Please log in to use the analysis feature');
        switchSection('login');
        return;
    }
    
    switchSection('analysis');
});

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Show home section by default
    switchSection('home');
});