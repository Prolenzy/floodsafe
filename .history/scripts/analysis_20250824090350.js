// DOM Elements
const uploadOptions = document.querySelectorAll('.upload-option');
const imageUpload = document.getElementById('image-upload');
const dataUpload = document.getElementById('data-upload');
const dropZone = document.querySelector('.drop-zone');
const fileInput = document.getElementById('file-input');
const imagePreview = document.getElementById('image-preview');
const analyzeButton = document.getElementById('analyze-button');
const resultsArea = document.querySelector('.results-area');
const saveResultsButton = document.getElementById('save-results');

// Switch between upload options
uploadOptions.forEach(option => {
    option.addEventListener('click', () => {
        // Set active option
        uploadOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        // Show corresponding upload area
        const uploadType = option.dataset.type;
        if (uploadType === 'image') {
            imageUpload.classList.remove('hidden');
            dataUpload.classList.add('hidden');
        } else {
            imageUpload.classList.add('hidden');
            dataUpload.classList.remove('hidden');
        }
    });
});

// Drag and drop functionality
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
});

['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropZone.style.borderColor = '#1a6fc4';
    dropZone.style.backgroundColor = '#f9fbfd';
}

function unhighlight() {
    dropZone.style.borderColor = '#ccc';
    dropZone.style.backgroundColor = 'transparent';
}

dropZone.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
    handleFiles(files);
}

// File input handling
dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', () => {
    handleFiles(fileInput.files);
});

function handleFiles(files) {
    if (files.length === 0) return;
    
    imagePreview.innerHTML = '';
    
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        if (!file.type.match('image.*')) {
            alert('Please upload only image files');
            continue;
        }
        
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'preview-image';
            imagePreview.appendChild(img);
        }
        
        reader.readAsDataURL(file);
    }
}

// Analysis functionality
analyzeButton.addEventListener('click', () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Please log in to use the analysis feature');
        switchSection('login');
        return;
    }
    
    // Get current upload type
    const activeOption = document.querySelector('.upload-option.active');
    const uploadType = activeOption.dataset.type;
    
    // Validate inputs based on type
    if (uploadType === 'image') {
        if (imagePreview.children.length === 0) {
            alert('Please upload at least one image');
            return;
        }
    } else {
        const waterLevel = document.getElementById('water-level').value;
        const rainfall = document.getElementById('rainfall').value;
        const terrain = document.getElementById('terrain').value;
        
        if (!waterLevel || !rainfall || !terrain) {
            alert('Please fill in all data fields');
            return;
        }
    }
    
    // Show loading state
    const spinner = analyzeButton.querySelector('.fa-spinner');
    const buttonText = analyzeButton.querySelector('span');
    
    spinner.classList.remove('hidden');
    buttonText.textContent = 'Analyzing...';
    analyzeButton.disabled = true;
    
    // Simulate analysis process
    simulateAnalysis(() => {
        // Hide loading state
        spinner.classList.add('hidden');
        buttonText.textContent = 'Analyze Flood Risk';
        analyzeButton.disabled = false;
        
        // Show results
        showResults();
    });
});

// Simulate analysis process
function simulateAnalysis(callback) {
    const overlay = document.querySelector('.loading-overlay');
    overlay.classList.remove('hidden');
    
    // Get inputs for more realistic simulation
    const activeOption = document.querySelector('.upload-option.active');
    const uploadType = activeOption.dataset.type;
    
    let riskLevel, riskProbability, recommendations, insights;
    
    if (uploadType === 'image') {
        // Simulate image analysis results
        riskLevel = 'Moderate';
        riskProbability = '45%';
        recommendations = [
            'Monitor water levels closely',
            'Prepare emergency supplies',
            'Stay updated with weather forecasts'
        ];
        insights = 'Water levels appear elevated with some signs of flooding in low-lying areas.';
    } else {
        // Simulate data analysis results
        const waterLevel = parseFloat(document.getElementById('water-level').value);
        const rainfall = parseFloat(document.getElementById('rainfall').value);
        
        if (waterLevel > 3.0 || rainfall > 30) {
            riskLevel = 'High';
            riskProbability = '75%';
            recommendations = [
                'Issue flood warnings',
                'Prepare evacuation plans',
                'Move to higher ground if necessary'
            ];
            insights = 'Dangerous flood conditions likely based on current water levels and rainfall intensity.';
        } else if (waterLevel > 2.0 || rainfall > 15) {
            riskLevel = 'Moderate';
            riskProbability = '45%';
            recommendations = [
                'Monitor water levels closely',
                'Prepare emergency supplies',
                'Stay updated with weather forecasts'
            ];
            insights = 'Elevated flood risk due to current conditions.';
        } else {
            riskLevel = 'Low';
            riskProbability = '20%';
            recommendations = [
                'Continue normal monitoring procedures',
                'Stay informed about weather conditions'
            ];
            insights = 'No immediate flood threat detected. Continue regular monitoring.';
        }
    }
    
    // Simulate processing time
    setTimeout(() => {
        overlay.classList.add('hidden');
        
        // Store results for display
        window.currentResults = {
            riskLevel,
            riskProbability,
            recommendations,
            insights,
            timestamp: new Date().toISOString(),
            type: uploadType
        };
        
        callback();
    }, 3000);
}

// Display results
function showResults() {
    const { riskLevel, riskProbability, recommendations, insights } = window.currentResults;
    
    // Update risk level
    document.getElementById('risk-level').textContent = riskLevel;
    
    // Update risk probability
    document.getElementById('risk-probability').textContent = riskProbability;
    
    // Update gauge fill based on risk level
    const gaugeFill = document.getElementById('gauge-fill');
    if (riskLevel === 'Low') {
        gaugeFill.style.width = '25%';
        gaugeFill.style.background = 'linear-gradient(90deg, #4caf50, #8bc34a)';
        document.getElementById('risk-level').style.color = '#4caf50';
    } else if (riskLevel === 'Moderate') {
        gaugeFill.style.width = '50%';
        gaugeFill.style.background = 'linear-gradient(90deg, #ffc107, #ff9800)';
        document.getElementById('risk-level').style.color = '#ff9800';
    } else {
        gaugeFill.style.width = '85%';
        gaugeFill.style.background = 'linear-gradient(90deg, #f44336, #ff5722)';
        document.getElementById('risk-level').style.color = '#f44336';
    }
    
    // Update recommendations
    const recommendationsList = document.getElementById('recommended-actions');
    recommendationsList.innerHTML = '';
    recommendations.forEach(rec => {
        const li = document.createElement('li');
        li.textContent = rec;
        recommendationsList.appendChild(li);
    });
    
    // Update insights
    document.getElementById('additional-insights').textContent = insights;
    
    // Show results area
    resultsArea.classList.remove('hidden');
}

// Save results
saveResultsButton.addEventListener('click', () => {
    if (!window.currentResults) return;
    
    // Get existing history or initialize empty array
    const history = JSON.parse(localStorage.getItem('analysisHistory') || '[]');
    
    // Add current results to history
    history.push(window.currentResults);
    
    // Save back to localStorage
    localStorage.setItem('analysisHistory', JSON.stringify(history));
    
    alert('Results saved to history!');
});