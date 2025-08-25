// netlify/functions/analyze-image/analyze-image.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

exports.handler = async (event, context) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const { image, region, season } = JSON.parse(event.body);
        
        // Initialize Google Gemini AI
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });
        
        // Process the image and generate analysis
        // This is a simplified example - you'd need to implement proper image processing
        const prompt = `Analyze this image for flood risk assessment in a ${region} region during ${season}. 
        Provide a detailed risk assessment including risk level, probability, elevation estimation, 
        distance from water, analysis, and specific recommendations.`;
        
        const result = await model.generateContent([prompt, image]);
        const response = await result.response;
        const analysis = response.text();
        
        return {
            statusCode: 200,
            body: JSON.stringify({ analysis })
        };
    } catch (error) {
        console.error('Error analyzing image:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to analyze image' })
        };
    }
};