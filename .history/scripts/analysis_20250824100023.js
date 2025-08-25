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
const loadingOverlay = document.querySelector('.loading-overlay');

// Analysis parameters
const regionSelect = document.getElementById('region-select');
const seasonSelect = document.getElementById('season-select');
const modelSelect = document.getElementById('model-select');

// Switch between upload options
uploadOptions.forEach(option => {
    option.addEventListener('click', () => {
        uploadOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
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
        const soil = document.getElementById('soil').value;
        
        if (!waterLevel || !rainfall || !terrain || !soil) {
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
    loadingOverlay.classList.remove('hidden');
    
    // Simulate analysis process
    simulateAnalysis(uploadType, () => {
        // Hide loading state
        spinner.classList.add('hidden');
        buttonText.textContent = 'Analyze Flood Risk';
        analyzeButton.disabled = false;
        loadingOverlay.classList.add('hidden');
        
        // Show results
        showResults();
    });
});

// Enhanced analysis simulation
function simulateAnalysis(uploadType, callback) {
    // Get analysis parameters
    const region = regionSelect.value;
    const season = seasonSelect.value;
    const model = modelSelect.value;
    
    // Get input values for more realistic simulation
    let riskLevel, riskProbability, recommendations, insights;
    
    if (uploadType === 'image') {
        // Simulate image analysis with more varied results
        const randomFactor = Math.random();
        
        if (randomFactor < 0.3) {
            riskLevel = 'Low';
            riskProbability = '15%';
            recommendations = [
                'Continue normal monitoring procedures',
                'Check weather forecasts regularly',
                'Ensure drainage systems are clear'
            ];
            insights = 'No significant flood risk detected. Water levels appear normal for this region and season.';
        } else if (randomFactor < 0.7) {
            riskLevel = 'Moderate';
            riskProbability = '45%';
            recommendations = [
                'Increase monitoring frequency',
                'Prepare emergency supplies',
                'Review evacuation routes'
            ];
            insights = 'Elevated water levels detected. Potential risk if rainfall continues or increases.';
        } else {
            riskLevel = 'High';
            riskProbability = '78%';
            recommendations = [
                'Issue flood warnings to residents',
                'Activate emergency response plans',
                'Prepare evacuation procedures'
            ];
            insights = 'Significant flooding detected. Immediate action recommended to mitigate risks.';
        }
        
        // Adjust based on region and season
        if (region === 'coastal' && season === 'summer') {
            riskProbability = String(Math.min(95, parseInt(riskProbability) + 20)) + '%';
            insights += ' Coastal areas are at higher risk during summer storm season.';
        }
        
    } else {
        // Simulate data analysis with more sophisticated algorithm
        const waterLevel = parseFloat(document.getElementById('water-level').value);
        const rainfall = parseFloat(document.getElementById('rainfall').value);
        const terrain = document.getElementById('terrain').value;
        const soil = document.getElementById('soil').value;
        
        // Base risk calculation
        let baseRisk = 0;
        
        // Water level contribution (0-40 points)
        baseRisk += Math.min(40, waterLevel * 10);
        
        // Rainfall contribution (0-30 points)
        baseRisk += Math.min(30, rainfall * 1.5);
        
        // Terrain contribution
        if (terrain === 'flat') baseRisk += 15;
        else if (terrain === 'urban') baseRisk += 20;
        else if (terrain === 'rural') baseRisk += 10;
        
        // Soil contribution
        if (soil === 'saturated') baseRisk += 25;
        else if (soil === 'moist') baseRisk += 10;
        
        // Region adjustment
        if (region === 'coastal') baseRisk += 15;
        else if (region === 'river') baseRisk += 10;
        
        // Season adjustment
        if (season === 'spring') baseRisk += 10;
        else if (season === 'summer') baseRisk += 5;
        
        // Calculate final risk score (0-100)
        const riskScore = Math.min(100, baseRisk);
        
        // Determine risk level
        if (riskScore < 30) {
            riskLevel = 'Low';
            riskProbability = Math.round(riskScore) + '%';
            recommendations = [
                'Continue normal monitoring procedures',
                'Check weather forecasts regularly',
                'Ensure drainage systems are clear'
            ];
            insights = 'No immediate flood threat detected. Current conditions suggest low risk.';
        } else if (riskScore < 60) {
            riskLevel = 'Moderate';
            riskProbability = Math.round(riskScore) + '%';
            recommendations = [
                'Increase monitoring frequency',
                'Prepare emergency supplies',
                'Review evacuation routes'
            ];
            insights = 'Elevated flood risk due to current conditions. Stay alert for changes.';
        } else {
            riskLevel = 'High';
            riskProbability = Math.round(riskScore) + '%';
            recommendations = [
                'Issue flood warnings to residents',
                'Activate emergency response plans',
                'Prepare evacuation procedures'
            ];
            insights = 'High flood risk detected. Immediate action recommended to mitigate potential damage.';
        }
        
        // Add model-specific insights
        if (model === 'advanced') {
            insights += ' Advanced AI model detected patterns suggesting higher accuracy for this assessment.';
        } else if (model === 'historical') {
            insights += ' Historical analysis shows similar patterns to past flood events.';
        }
    }
    
    // Simulate processing time
    setTimeout(() => {
        // Store results for display
        window.currentResults = {
            riskLevel,
            riskProbability,
            recommendations,
            insights,
            timestamp: new Date().toISOString(),
            type: uploadType,
            region,
            season,
            model
        };
        
        callback();
    }, 3000);
}

// Display results
function showResults() {
    const { riskLevel, riskProbability, recommendations, insights } = window.currentResults;
    
    // Update risk level
    const riskLevelElement = document.getElementById('risk-level');
    riskLevelElement.textContent = riskLevel;
    riskLevelElement.className = 'risk-level risk-' + riskLevel.toLowerCase();
    
    // Update risk probability
    document.getElementById('risk-probability').textContent = riskProbability;
    
    // Update gauge fill based on risk level
    const gaugeFill = document.getElementById('gauge-fill');
    if (riskLevel === 'Low') {
        gaugeFill.style.width = '25%';
        gaugeFill.className = 'gauge-fill gauge-low';
    } else if (riskLevel === 'Moderate') {
        gaugeFill.style.width = '50%';
        gaugeFill.className = 'gauge-fill gauge-moderate';
    } else {
        gaugeFill.style.width = '85%';
        gaugeFill.className = 'gauge-fill gauge-high';
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
    
    // Scroll to results
    resultsArea.scrollIntoView({ behavior: 'smooth' });
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