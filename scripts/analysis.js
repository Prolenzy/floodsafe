// scripts/analysis.js
document.addEventListener('DOMContentLoaded', function() {
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

    // File input handling
    dropZone.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', () => {
        handleFiles(fileInput.files);
    });

    function handleFiles(files) {
        if (files.length === 0) return;
        
        // Check file size (max 10MB)
        const maxSize = 10 * 1024 * 1024; // 10MB in bytes
        for (let i = 0; i < files.length; i++) {
            if (files[i].size > maxSize) {
                alert('File size exceeds 10MB limit. Please upload a smaller image.');
                return;
            }
        }
        
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

    // Analysis functionality
    analyzeButton.addEventListener('click', async () => {
        // Check if user is logged in
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        
        if (!isLoggedIn) {
            alert('Please log in to use the analysis feature');
            switchSection('login');
            return;
        }
        
        // Check if image is uploaded
        if (imagePreview.children.length === 0) {
            alert('Please upload at least one image');
            return;
        }
        
        // Show loading state
        const spinner = analyzeButton.querySelector('.fa-spinner');
        const buttonText = analyzeButton.querySelector('span');
        
        spinner.classList.remove('hidden');
        buttonText.textContent = 'Analyzing...';
        analyzeButton.disabled = true;
        loadingOverlay.classList.remove('hidden');
        
        // Show progress UI for image analysis
        document.getElementById('analysis-progress').classList.remove('hidden');
        updateProgress(10, 'Preparing image for analysis...');
        
        // Perform analysis
        try {
            await analyzeImage();
        } catch (error) {
            console.error('Analysis error:', error);
            alert('Analysis failed: ' + error.message);
            
            // Hide loading state
            spinner.classList.add('hidden');
            buttonText.textContent = 'Analyze Flood Risk';
            analyzeButton.disabled = false;
            loadingOverlay.classList.add('hidden');
            document.getElementById('analysis-progress').classList.add('hidden');
        }
    });

    // Enhanced image analysis with API service
    async function analyzeImage() {
        const region = regionSelect.value;
        const season = seasonSelect.value;
        
        updateProgress(30, 'Analyzing image content with AI...');
        
        try {
            // Get the uploaded image
            const imageElement = document.querySelector('.preview-image');
            
            if (!imageElement) {
                throw new Error('No image found for analysis');
            }
            
            // Use API service for image analysis
            updateProgress(50, 'Evaluating flood risk factors...');
            const analysisResult = await window.apiService.analyzeImage(
                imageElement.src, 
                region, 
                season
            );
            
            updateProgress(80, 'Generating detailed assessment...');
            
            // Store results for display
            window.currentResults = {
                riskLevel: analysisResult.riskLevel,
                riskProbability: analysisResult.riskProbability,
                recommendations: analysisResult.recommendations,
                insights: analysisResult.analysis,
                timestamp: new Date().toISOString(),
                type: 'image',
                region,
                season,
                analysisDetails: {
                    elevation: analysisResult.elevation,
                    distanceFromWater: analysisResult.distanceFromWater
                }
            };
            
            // Simulate processing time
            setTimeout(() => {
                // Hide loading state
                const spinner = analyzeButton.querySelector('.fa-spinner');
                const buttonText = analyzeButton.querySelector('span');
                
                spinner.classList.add('hidden');
                buttonText.textContent = 'Analyze Flood Risk';
                analyzeButton.disabled = false;
                loadingOverlay.classList.add('hidden');
                document.getElementById('analysis-progress').classList.add('hidden');
                
                // Show results
                showResults();
                showImageAnalysisDetails(window.currentResults.analysisDetails);
            }, 1500);
            
        } catch (error) {
            console.error('Analysis error:', error);
            
            // Fall back to basic analysis if API call fails
            updateProgress(60, 'Using standard analysis...');
            
            setTimeout(() => {
                simulateBasicAnalysis('image', region, season);
                
                const spinner = analyzeButton.querySelector('.fa-spinner');
                const buttonText = analyzeButton.querySelector('span');
                
                spinner.classList.add('hidden');
                buttonText.textContent = 'Analyze Flood Risk';
                analyzeButton.disabled = false;
                loadingOverlay.classList.add('hidden');
                document.getElementById('analysis-progress').classList.add('hidden');
                
                // Show results
                showResults();
                showImageAnalysisDetails(window.currentResults.analysisDetails);
            }, 1500);
        }
    }
    
    // Basic analysis simulation for fallback
    function simulateBasicAnalysis(uploadType, region, season) {
        let riskLevel, riskProbability, recommendations, insights;
        
        // Simple logic for demonstration
        riskLevel = 'Moderate';
        riskProbability = '45%';
        recommendations = [
            'Monitor water levels regularly',
            'Prepare emergency supplies',
            'Review evacuation routes'
        ];
        insights = 'Standard flood risk assessment. For more accurate results, ensure images show terrain features clearly.';
        
        window.currentResults = {
            riskLevel,
            riskProbability,
            recommendations,
            insights,
            timestamp: new Date().toISOString(),
            type: uploadType,
            region,
            season,
            analysisDetails: {
                elevation: 'Unknown',
                distanceFromWater: 'Unknown'
            }
        };
    }

    // Update progress bar
    function updateProgress(percent, text) {
        const progressFill = document.getElementById('progress-fill');
        const progressText = document.getElementById('progress-text');
        
        if (progressFill) progressFill.style.width = `${percent}%`;
        if (progressText) progressText.textContent = text;
    }

    // Display results
    function showResults() {
        if (!window.currentResults) return;
        
        const { riskLevel, riskProbability, recommendations, insights } = window.currentResults;
        
        // Update risk level
        const riskLevelElement = document.getElementById('risk-level');
        riskLevelElement.textContent = riskLevel;
        riskLevelElement.className = 'risk-level risk-' + riskLevel.toLowerCase().replace(' ', '-');
        
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
        } else if (riskLevel === 'High') {
            gaugeFill.style.width = '75%';
            gaugeFill.className = 'gauge-fill gauge-high';
        } else if (riskLevel === 'Very High') {
            gaugeFill.style.width = '95%';
            gaugeFill.className = 'gauge-fill gauge-very-high';
        } else {
            gaugeFill.style.width = '25%';
            gaugeFill.className = 'gauge-fill gauge-low';
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
        document.getElementById('ai-analysis').textContent = insights;
        
        // Show results area
        resultsArea.classList.remove('hidden');
        
        // Scroll to results
        resultsArea.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Show image analysis details
    function showImageAnalysisDetails(analysisDetails) {
        const container = document.getElementById('image-analysis-results');
        const featuresContainer = document.getElementById('detected-features');
        
        // Clear previous results
        featuresContainer.innerHTML = '';
        
        // Add analysis details
        const detailsHtml = `
            <div class="feature">
                <div>Elevation</div>
                <div class="feature-value">${analysisDetails.elevation || 'Unknown'}</div>
            </div>
            <div class="feature">
                <div>Distance from Water</div>
                <div class="feature-value">${analysisDetails.distanceFromWater || 'Unknown'}</div>
            </div>
        `;
        
        featuresContainer.innerHTML = detailsHtml;
        container.classList.remove('hidden');
        
        // Update metric values
        document.getElementById('elevation-value').textContent = analysisDetails.elevation || 'Unknown';
        document.getElementById('distance-value').textContent = analysisDetails.distanceFromWater || 'Unknown';
    }

    // Save results
    saveResultsButton.addEventListener('click', () => {
        if (!window.currentResults) return;
        
        // Save using API service
        window.apiService.saveAnalysisResult(window.currentResults)
            .then(() => {
                alert('Results saved to history!');
            })
            .catch(error => {
                console.error('Error saving results:', error);
                alert('Failed to save results.');
            });
    });
});