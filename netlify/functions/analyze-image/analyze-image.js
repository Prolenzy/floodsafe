// netlify/functions/analyze-image/analyze-image.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    // Handle CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    try {
        const { image, region, season } = JSON.parse(event.body);
        
        if (!image) {
            return {
                statusCode: 400,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ error: 'No image provided' })
            };
        }

        // Initialize Google Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-pro-vision',
            generationConfig: {
                temperature: 0.1,
                topK: 32,
                topP: 1,
                maxOutputTokens: 2048,
            }
        });

        // Extract base64 data from data URL if needed
        let imageData = image;
        if (image.startsWith('data:image')) {
            imageData = image.split(',')[1];
        }

        // Create the prompt with specific instructions for structured output
        const prompt = `You are a flood risk assessment expert. Analyze this image thoroughly and provide a comprehensive flood risk assessment.

IMAGE ANALYSIS CONTEXT:
- Region: ${region}
- Season: ${season}
- Current time: ${new Date().toLocaleString()}

REQUIRED ANALYSIS COMPONENTS:

1. FLOOD RISK ASSESSMENT:
   - Risk Level: [Low/Moderate/High/Very High]
   - Risk Probability: [0-100%]
   - Estimated Elevation: [meters above sea level]
   - Distance from Water: [meters]

2. DETAILED VISUAL ANALYSIS:
   - Describe visible water bodies, their size and proximity to infrastructure
   - Identify terrain features and their flood vulnerability
   - Note any visible infrastructure (buildings, roads, bridges)
   - Assess vegetation and its impact on water absorption
   - Identify any signs of existing flooding or water damage

3. REGION-SPECIFIC FACTORS:
   - Consider how ${region} characteristics affect flood risk
   - Account for ${season} seasonal factors
   - Note any visible drainage systems or flood defenses

4. COMPREHENSIVE RISK ANALYSIS:
   - Overall flood risk assessment based on visual evidence
   - Potential causes of flooding in this area
   - Timeframe for potential flood events
   - Severity estimation of potential flooding

5. ACTIONABLE RECOMMENDATIONS:
   - Provide 5-7 specific, prioritized recommendations
   - Include immediate actions if high risk is detected
   - Suggest preventive measures
   - Include monitoring and preparedness advice

OUTPUT FORMAT REQUIREMENTS:
Return a valid JSON object with exactly these fields:
{
  "riskLevel": "High",
  "riskProbability": "75%",
  "elevation": "5m",
  "distanceFromWater": "50m",
  "analysis": "Detailed analysis text...",
  "recommendations": ["Recommendation 1", "Recommendation 2", ...]
}

Ensure the response is purely JSON with no additional text or formatting.`;

        // Prepare the image part for Gemini
        const imageParts = [
            {
                inlineData: {
                    data: imageData,
                    mimeType: getMimeType(image)
                }
            }
        ];

        // Generate content with retry logic
        let result;
        let attempts = 0;
        const maxAttempts = 3;
        
        while (attempts < maxAttempts) {
            try {
                result = await model.generateContent([prompt, ...imageParts]);
                break;
            } catch (error) {
                attempts++;
                if (attempts === maxAttempts) {
                    throw error;
                }
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * attempts));
            }
        }

        const response = await result.response;
        const text = response.text();
        
        // Extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No JSON found in AI response');
        }

        const analysisData = JSON.parse(jsonMatch[0]);
        
        // Validate required fields
        const requiredFields = ['riskLevel', 'riskProbability', 'analysis', 'recommendations'];
        for (const field of requiredFields) {
            if (!analysisData[field]) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(analysisData)
        };

    } catch (error) {
        console.error('Error analyzing image:', error);
        
        // Provide a fallback response if AI fails
        const fallbackResponse = {
            riskLevel: "Moderate",
            riskProbability: "45%",
            elevation: "Unknown",
            distanceFromWater: "Unknown",
            analysis: "Unable to complete full AI analysis. Please try again with a clearer image or check your connection.",
            recommendations: [
                "Try uploading a clearer image of the terrain",
                "Ensure good lighting and focus in your photo",
                "Try again in a few moments",
                "Contact support if the issue persists"
            ]
        };

        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: JSON.stringify(fallbackResponse)
        };
    }
};

// Helper function to determine MIME type from data URL
function getMimeType(dataUrl) {
    if (dataUrl.startsWith('data:image/jpeg')) return 'image/jpeg';
    if (dataUrl.startsWith('data:image/png')) return 'image/png';
    if (dataUrl.startsWith('data:image/webp')) return 'image/webp';
    if (dataUrl.startsWith('data:image/gif')) return 'image/gif';
    return 'image/jpeg'; // default
}