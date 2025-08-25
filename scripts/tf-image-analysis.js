// TensorFlow.js Image Analysis for Flood Risk Assessment
class ImageAnalyzer {
    constructor() {
        this.model = null;
        this.isModelLoaded = false;
        this.modelLoading = false;
    }

    async loadModel() {
        if (this.modelLoading) {
            // Model is already loading, wait for it
            return new Promise((resolve) => {
                const checkInterval = setInterval(() => {
                    if (this.isModelLoaded) {
                        clearInterval(checkInterval);
                        resolve(true);
                    }
                }, 100);
            });
        }

        this.modelLoading = true;
        try {
            console.log('Loading COCO-SSD model...');
            this.model = await cocoSsd.load();
            this.isModelLoaded = true;
            this.modelLoading = false;
            console.log('Model loaded successfully');
            return true;
        } catch (error) {
            console.error('Error loading model:', error);
            this.modelLoading = false;
            return false;
        }
    }

    async analyzeImage(imageElement) {
        if (!this.isModelLoaded) {
            const loaded = await this.loadModel();
            if (!loaded) {
                throw new Error('Failed to load image analysis model');
            }
        }

        try {
            // Perform object detection
            const predictions = await this.model.detect(imageElement);
            
            // Analyze image for flood risk factors
            const analysis = this.analyzePredictions(predictions);
            
            return {
                predictions,
                analysis
            };
        } catch (error) {
            console.error('Error analyzing image:', error);
            throw error;
        }
    }

    analyzePredictions(predictions) {
        let waterBodyCount = 0;
        let vegetationCount = 0;
        let buildingCount = 0;
        let vehicleCount = 0;
        let personCount = 0;
        let terrainType = 'unknown';
        let estimatedElevation = 'unknown';
        let estimatedDistance = 'unknown';
        let detectedObjects = [];

        // Count different object types and collect object names
        predictions.forEach(prediction => {
            const className = prediction.class.toLowerCase();
            detectedObjects.push(prediction.class);
            
            if (className.includes('water') || className.includes('river') || 
                className.includes('lake') || className.includes('ocean') ||
                className.includes('sea')) {
                waterBodyCount++;
            } else if (className.includes('tree') || className.includes('plant') || 
                       className.includes('grass') || className.includes('vegetation') ||
                       className.includes('potted plant')) {
                vegetationCount++;
            } else if (className.includes('building') || className.includes('house') || 
                       className.includes('skyscraper') || className.includes('construction') ||
                       className.includes('bridge')) {
                buildingCount++;
            } else if (className.includes('car') || className.includes('truck') || 
                       className.includes('bus') || className.includes('vehicle')) {
                vehicleCount++;
            } else if (className.includes('person')) {
                personCount++;
            }
        });

        // Determine if this is a non-terrain image (people, vehicles, etc.)
        const nonTerrainElements = personCount + vehicleCount;
        const terrainElements = waterBodyCount + vegetationCount + buildingCount;
        
        if (nonTerrainElements > terrainElements && nonTerrainElements > 2) {
            // This appears to be a non-terrain image
            return {
                isTerrainImage: false,
                waterBodyCount,
                vegetationCount,
                buildingCount,
                vehicleCount,
                personCount,
                terrainType: 'non-terrain',
                estimatedElevation: 'unknown',
                estimatedDistance: 'unknown',
                detectedObjects
            };
        }

        // Determine terrain type based on detected objects
        if (waterBodyCount > 0 && buildingCount > 0) {
            terrainType = 'urban waterfront';
            estimatedElevation = 'low';
            estimatedDistance = 'very close (0-100m)';
        } else if (waterBodyCount > 0 && vegetationCount > 2) {
            terrainType = 'natural waterfront';
            estimatedElevation = 'variable';
            estimatedDistance = 'close (100-500m)';
        } else if (buildingCount > 3) {
            terrainType = 'urban area';
            estimatedElevation = 'variable';
            estimatedDistance = 'unknown (no water visible)';
        } else if (vegetationCount > 3) {
            terrainType = 'rural/vegetated area';
            estimatedElevation = 'variable';
            estimatedDistance = 'unknown (no water visible)';
        } else if (waterBodyCount > 0) {
            terrainType = 'water body';
            estimatedElevation = 'low';
            estimatedDistance = 'at location';
        } else if (detectedObjects.length === 0) {
            terrainType = 'unrecognized terrain';
        } else {
            terrainType = 'general terrain';
        }

        return {
            isTerrainImage: true,
            waterBodyCount,
            vegetationCount,
            buildingCount,
            vehicleCount,
            personCount,
            terrainType,
            estimatedElevation,
            estimatedDistance,
            detectedObjects
        };
    }

    // Enhanced flood risk assessment based on image analysis
    assessFloodRisk(analysis, region, season) {
        // Handle non-terrain images
        if (!analysis.isTerrainImage) {
            return {
                riskLevel: 'Unknown',
                riskProbability: 'N/A',
                recommendations: [
                    'Image does not appear to show terrain features',
                    'Please upload an image of a landscape or area for flood risk assessment'
                ],
                insights: 'The uploaded image contains primarily people, vehicles, or other non-terrain elements. For accurate flood risk assessment, please upload an image showing landscapes, water bodies, or urban areas.',
                analysisDetails: analysis
            };
        }

        let riskLevel = 'Low';
        let riskProbability = '15%';
        let recommendations = [
            'Continue normal monitoring procedures',
            'Check weather forecasts regularly'
        ];
        let insights = 'No significant flood risk detected.';

        // Base risk on water presence
        if (analysis.waterBodyCount > 0) {
            riskLevel = 'Moderate';
            riskProbability = '40%';
            insights = 'Water body detected. Monitor water levels during heavy rainfall.';
            
            // Adjust based on region and season
            if (region === 'coastal' && season === 'summer') {
                riskLevel = 'High';
                riskProbability = '70%';
                insights = 'Coastal area with water body detected. High risk during storm season.';
                recommendations = [
                    'Monitor tide and storm forecasts',
                    'Prepare emergency evacuation plan',
                    'Secure property against potential flooding'
                ];
            } else if (region === 'river') {
                riskLevel = 'Moderate to High';
                riskProbability = '55%';
                insights = 'River area detected. Flood risk depends on upstream conditions.';
                recommendations = [
                    'Monitor river level forecasts',
                    'Check upstream rainfall reports',
                    'Prepare sandbags if in flood-prone area'
                ];
            }
        }

        // Adjust risk if urban area near water
        if (analysis.buildingCount > 0 && analysis.waterBodyCount > 0) {
            riskLevel = 'High';
            riskProbability = '75%';
            insights = 'Urban area near water body detected. Significant flood risk to infrastructure.';
            recommendations = [
                'Implement flood protection measures',
                'Develop emergency response plan',
                'Consider property elevation options'
            ];
        }

        // Adjust for no water detected
        if (analysis.waterBodyCount === 0) {
            insights = 'No water bodies detected in image. Flood risk depends on regional factors.';
            if (region === 'coastal') {
                riskLevel = 'Moderate';
                riskProbability = '35%';
                insights += ' Coastal regions remain at risk during storm events.';
            } else if (region === 'river') {
                riskLevel = 'Low to Moderate';
                riskProbability = '30%';
                insights += ' River basins may experience flooding during heavy rainfall.';
            }
        }

        return {
            riskLevel,
            riskProbability,
            recommendations,
            insights,
            analysisDetails: analysis
        };
    }
}

// Initialize global image analyzer
window.imageAnalyzer = new ImageAnalyzer();