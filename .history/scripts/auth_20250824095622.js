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
    
    // Validate email format
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Simulate login process
    simulateLoading(() => {
        // Check if user exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Set current user
            localStorage.setItem('currentUser', JSON.stringify(user));
            localStorage.setItem('isLoggedIn', 'true');
            
            // Update UI
            updateAuthUI();
            
            // Redirect to home
            switchSection('home');
            alert('Login successful!');
        } else {
            alert('Invalid email or password');
        }
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
    
    if (!validateEmail(email)) {
        alert('Please enter a valid email address');
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
        // Get existing users
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        
        // Check if email already exists
        if (users.some(user => user.email === email)) {
            alert('Email already registered. Please login instead.');
            registerForm.classList.add('hidden');
            loginForm.classList.remove('hidden');
            return;
        }
        
        // Create new user
        const newUser = {
            id: Date.now().toString(),
            name,
            email,
            password,
            createdAt: new Date().toISOString()
        };
        
        // Save user
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Set as current user
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('isLoggedIn', 'true');
        
        // Update UI
        updateAuthUI();
        
        // Switch to login form and show success message
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        alert('Registration successful! You are now logged in.');
    });
});

// Validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Update authentication UI
function updateAuthUI() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const authItem = document.getElementById('auth-item');
    
    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
        authItem.innerHTML = `<a href="#" class="nav-link" id="logout-link">Logout (${user.name})</a>`;
        
        // Add event listener to the new logout link
        document.getElementById('logout-link').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('currentUser');
            window.location.reload();
        });
    } else {
        authItem.innerHTML = '<a href="#" class="nav-link" data-section="login">Login</a>';
        // Reattach event listener
        document.querySelector('[data-section="login"]').addEventListener('click', (e) => {
            e.preventDefault();
            switchSection('login');
        });
    }
}

// Simulate loading for auth processes
function simulateLoading(callback) {
    const overlay = document.querySelector('.loading-overlay');
    overlay.classList.remove('hidden');
    
    setTimeout(() => {
        overlay.classList.add('hidden');
        callback();
    }, 1500);
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);