// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const switchToRegister = document.getElementById('switch-to-register');
const switchToLogin = document.getElementById('switch-to-login');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');

// Switch between login and register forms
switchToRegister.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

switchToLogin.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Login functionality
loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simple validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    // Simulate login process
    simulateLoading(() => {
        // For demo purposes, just set isLoggedIn to true
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', email);
        
        // Update UI
        const authItem = document.getElementById('auth-item');
        authItem.innerHTML = '<a href="#" class="nav-link" id="logout-link">Logout</a>';
        
        // Add event listener to the new logout link
        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
        
        // Redirect to home
        switchSection('home');
        alert('Login successful!');
    });
});

// Register functionality
registerButton.addEventListener('click', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        alert('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Simulate registration process
    simulateLoading(() => {
        // For demo purposes, just set isLoggedIn to true
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', email);
        
        // Update UI
        const authItem = document.getElementById('auth-item');
        authItem.innerHTML = '<a href="#" class="nav-link" id="logout-link">Logout</a>';
        
        // Add event listener to the new logout link
        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
        
        // Switch to login form and show success message
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        alert('Registration successful! You are now logged in.');
    });
});

// Simulate loading for auth processes
function simulateLoading(callback) {
    const overlay = document.querySelector('.loading-overlay');
    overlay.classList.remove('hidden');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        callback();
    }, 1500);
}