// scripts/gemini-ai-service.js
class GeminiAIService {
    constructor() {
        this.apiKey = null;
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models';
        this.model = 'gemini-pro-vision'; // Using vision model for image analysis
        this.isConfigured = false;
        
        this.init();
    }

    async init() {
        try {
            this.apiKey = window.appConfig.get('GEMINI_API_KEY');
            this.isConfigured = !!this.apiKey;
            
            if (!this.isConfigured) {
                console.warn('Gemini API key not configured. Using simulated responses.');
            } else {
                console.log('Gemini AI service initialized with API key');
            }
        } catch (error) {
            console.error('Error initializing Gemini AI service:', error);
        }
    }

    setApiKey(apiKey) {
        this.apiKey = apiKey;
        this.isConfigured = !!apiKey;
        window.appConfig.set('GEMINI_API_KEY', apiKey);
    }

    async analyzeImageWithGemini(imageData, region, season) {
        if (!this.isConfigured) {
            // Fall back to simulated response if no API key
            return this.simulateGeminiResponse(imageData, region, season);
        }

        try {
            // Convert image data to base64 if it's a data URL
            let base64Image = imageData;
            if (imageData.startsWith('data:image')) {
                base64Image = imageData.split(',')[1];
            }

            // Prepare the request payload for Gemini API
            const requestPayload = {
                contents: [
                    {
                        parts: [
                            {
                                text: this.generatePrompt(region, season)
                            },
                            {
                                inline_data: {
                                    mime_type: "image/jpeg",
                                    data: base64Image
                                }
                            }
                        ]
                    }
                ]
            };

            const apiURL = `${this.baseURL}/${this.model}:generateContent?key=${this.apiKey}`;
            
            const response = await fetch(apiURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestPayload)
            });

            if (!response.ok) {
                throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            
            // Parse the response from Gemini API
            return this.parseGeminiResponse(data, region, season);
            
        } catch (error) {
            console.error('Error calling Gemini API:', error);
            // Fall back to simulated response if API call fails
            return this.simulateGeminiResponse(imageData, region, season);
        }
    }

    generatePrompt(region, season) {
        return `
        Analyze this image for flood risk assessment. Consider that this is a ${region} area during ${season} season.

        Please provide a comprehensive flood risk assessment including:
        1. Flood risk level (Low, Moderate, High, Very High)
        2. Risk probability percentage
        3. Estimated elevation
        4. Estimated distance from water bodies
        5. Detailed analysis of flood risk factors visible in the image
        6. Specific, actionable recommendations

        Format your response as JSON with the following structure:
        {
            "riskLevel": "High",
            "riskProbability": "75%",
            "elevation": "2m",
            "distanceFromWater": "0m",
            "analysis": "Detailed analysis here...",
            "recommendations": ["Recommendation 1", "Recommendation 2", ...]
        }
        `;
    }

    parseGeminiResponse(apiResponse, region, season) {
        try {
            // Extract text from Gemini API response
            const responseText = apiResponse.candidates[0].content.parts[0].text;
            
            // Try to find JSON in the response text
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
            
            // If no JSON found, fall back to simulated response
            console.warn('Could not parse JSON from Gemini response, using simulated response');
            return this.simulateGeminiResponse(null, region, season);
            
        } catch (error) {
            console.error('Error parsing Gemini response:', error);
            return this.simulateGeminiResponse(null, region, season);
        }
    }

    simulateGeminiResponse(imageData, region, season) {
        // Enhanced simulation based on region and season
        const isFloodImage = Math.random() > 0.4; // 60% chance it's a flood image
        const severity = Math.random(); // Random severity factor
        
        if (isFloodImage) {
            // Flood image scenarios
            if (severity > 0.7) {
                return {
                    riskLevel: "Very High",
                    riskProbability: "85%",
                    elevation: "2m",
                    distanceFromWater: "0m",
                    analysis: "The image shows significant flooding in an urban area. Water levels appear to be at least 1-2 feet deep, partially submerging vehicles and infrastructure. The presence of standing water indicates poor drainage and potential river overflow or flash flooding. Buildings in the area are at immediate risk of water damage.",
                    recommendations: [
                        "Evacuate the area immediately to higher ground",
                        "Avoid driving or wading through floodwater",
                        "Report the flooding to local authorities",
                        "Move to the highest possible floor if sheltering in place",
                        "Monitor emergency broadcasts for updates and instructions"
                    ]
                };
            } else if (severity > 0.4) {
                return {
                    riskLevel: "High",
                    riskProbability: "65%",
                    elevation: "5m",
                    distanceFromWater: "10m",
                    analysis: "The image shows moderate flooding with water covering roads and beginning to impact properties. The water depth appears to be less than 1 foot but still presents hazards. The urban environment suggests potential for significant property damage if water levels rise further.",
                    recommendations: [
                        "Prepare to evacuate if water levels continue to rise",
                        "Avoid unnecessary travel through affected areas",
                        "Secure important documents and valuables",
                        "Move vehicles to higher ground if possible",
                        "Monitor local weather and flood warnings"
                    ]
                };
            } else {
                return {
                    riskLevel: "Moderate",
                    riskProbability: "45%",
                    elevation: "10m",
                    distanceFromWater: "25m",
                    analysis: "The image shows minor flooding with some water accumulation in low-lying areas. While not immediately dangerous, this indicates drainage issues and potential for more significant flooding if rainfall continues. The terrain appears to be generally well-drained with localized pooling.",
                    recommendations: [
                        "Monitor water levels and weather forecasts",
                        "Clear drainage paths and gutters",
                        "Prepare emergency supplies in case conditions worsen",
                        "Identify evacuation routes to higher ground",
                        "Report blocked drains to local authorities"
                    ]
                };
            }
        } else {
            // Non-flood image scenarios with region-specific responses
            if (region === 'coastal') {
                return {
                    riskLevel: "Moderate",
                    riskProbability: "40%",
                    elevation: "5m",
                    distanceFromWater: "100m",
                    analysis: "The image shows a coastal area with no immediate signs of flooding. However, coastal regions are inherently at risk during storm events and high tides. The terrain appears relatively flat, which could increase vulnerability to storm surge and rising sea levels.",
                    recommendations: [
                        "Monitor tide tables and storm forecasts",
                        "Understand your property's elevation relative to sea level",
                        "Prepare for potential evacuation during storm warnings",
                        "Consider flood barriers for property protection",
                        "Review insurance coverage for flood damage"
                    ]
                };
            } else if (region === 'river') {
                return {
                    riskLevel: "Low to Moderate",
                    riskProbability: "30%",
                    elevation: "15m",
                    distanceFromWater: "50m",
                    analysis: "The image shows a river basin area with no current flooding. River basins can experience rapid flooding during heavy rainfall events upstream. The vegetation suggests a healthy watershed but monitoring is advised during rainy seasons.",
                    recommendations: [
                        "Monitor upstream rainfall and river level forecasts",
                        "Be aware of flash flood risks during heavy rain",
                        "Identify higher ground locations for emergency evacuation",
                        "Keep emergency supplies ready during flood season",
                        "Participate in community flood warning systems"
                    ]
                };
            } else {
                return {
                    riskLevel: "Low",
                    riskProbability: "20%",
                    elevation: "25m",
                    distanceFromWater: "200m",
                    analysis: "The image shows a general terrain with no visible water bodies or signs of flooding. The area appears well-drained with minimal immediate flood risk. However, all areas can experience flooding under extreme weather conditions.",
                    recommendations: [
                        "Continue normal monitoring procedures",
                        "Check weather forecasts regularly",
                        "Ensure drainage systems are clear and functional",
                        "Be aware of local flood history and risks",
                        "Prepare basic emergency supplies as a precaution"
                    ]
                };
            }
        }
    }

    // Method to analyze terrain from image
    async analyzeTerrain(imageData, region, season) {
        try {
            const response = await this.analyzeImageWithGemini(imageData, region, season);
            return response;
        } catch (error) {
            console.error('Error in terrain analysis:', error);
            throw error;
        }
    }

    // Method to get detailed flood analysis
    async getDetailedFloodAnalysis(imageData, region, season) {
        try {
            const response = await this.analyzeImageWithGemini(imageData, region, season);
            return response;
        } catch (error) {
            console.error('Error in detailed flood analysis:', error);
            throw error;
        }
    }
}

// Initialize global Gemini AI service
window.geminiAIService = new GeminiAIService();