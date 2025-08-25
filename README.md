# Floodsafe
# FloodSafe AI - Flood Risk Assessment System

FloodSafe AI is a web-based application that uses artificial intelligence to analyze images and provide accurate flood risk assessments. The system processes terrain and flood images to identify potential risks and provide actionable recommendations.

## Features

- **AI-Powered Image Analysis**: Upload images of terrain or flooded areas for detailed analysis
- **Comprehensive Risk Assessment**: Get risk levels, probability percentages, elevation estimates, and distance from water
- **Actionable Recommendations**: Receive specific guidance based on the analysis results
- **Analysis History**: Save and review previous assessments
- **User Authentication**: Secure login and registration system
- **Responsive Design**: Works on desktop and mobile devices
- **Netlify Functions**: Serverless backend for image analysis

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Netlify Functions (Serverless)
- **Storage**: Browser localStorage for user data and history
- **Deployment**: Netlify

 ## Setup Instructions

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd flood-assessment-js

2. **Open the application**

- Simply open index.html in your web browser

- Or use a local server for better functionality:

### Using Python
python -m http.server 8000

### Using Node.js
npx serve

### Using PHP
php -S localhost:8000

3. **Access the application**

- Open your browser and navigate to http://localhost:8000

## Production Deployment on Netlify
### 1. Connect your GitHub repository to Netlify

- Go to Netlify

- Click "New site from Git"

- Connect your GitHub account and select your repository

### 2. Configure build settings (automatically detected):

- Build command: (leave empty - no build process needed)

- Publish directory: . (current directory)

### 3. Deploy your site

- Netlify will automatically deploy your site

- Your site will be available at https://your-site-name.netlify.app

### 4. Environment variables (Optional for advanced setup):

- If using Gemini AI in the future, add GEMINI_API_KEY in Netlify dashboard

- Go to Site settings > Environment variables

## Usage Guide
### 1. Account Creation
- Click on "Login" in the navigation bar

- Switch to "Register" to create a new account

- Provide your name, email, and password

### 2. Image Analysis
1. Navigate to the "Analysis" section

2. Select the region type and season from the dropdown menus

3. Upload an image by dragging and dropping or clicking to browse

4. Click "Analyze Flood Risk" to process the image

5. View the detailed results including risk level, probability, and recommendations

### 3. Viewing History
- Go to the "History" section to review past analyses

- Filter results by time period or risk level

- Each entry shows the date, risk level, and basic information

## How It Works
### Frontend (Browser)
- User uploads images through the responsive UI

- JavaScript processes the image and sends it to Netlify function

- Results are displayed with detailed risk assessment

### Backend (Netlify Function)
- Serverless function handles image analysis

- Currently uses simulated AI responses

- Can be extended with real AI APIs like Google Gemini

### Data Storage
- User authentication data stored in localStorage

- Analysis history persisted in browser storage

- No server-side database required

## Customization
### Modifying Analysis Responses
Edit netlify/functions/analyze-image/analyze-image.js to change:

- Risk assessment logic

- Response formats

- Recommendation templates

### Styling Changes
Modify styles/style.css to customize:

- Color scheme and branding

- Layout and responsive behavior

- Component styles

### Adding New Features
1. Add new JavaScript modules in the scripts/ directory

2. Update HTML in index.html for new UI elements

3. Extend Netlify functions for new backend capabilities

## Browser Support
- Chrome 60+

- Firefox 55+

- Safari 12+

- Edge 79+

## Troubleshooting
### Common Issues
**1. Images not uploading**

- Check file size (max 10MB)

- Ensure file is JPG or PNG format

**2. Analysis not working**

- Check browser console for error messages (F12)

- Ensure JavaScript is enabled in your browser

**3. Netlify deployment issues**

- Verify netlify.toml configuration is correct

- Check that all files are committed to GitHub

**4. Function errors**

- Check Netlify function logs in the dashboard

- Ensure function dependencies are correctly specified

### Getting Help
If you encounter issues:

1. Check the browser console for error messages (F12)

2. Examine Netlify deployment logs in the dashboard

3. Ensure all files are properly committed to your repository

## Future Enhancements
- Integrate real Google Gemini AI API

- Add more detailed image analysis capabilities

- Implement user accounts with cloud storage

- Add export functionality for reports

- Include historical flood data integration

## License
This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments
- Netlify for serverless function hosting

- Unsplash for placeholder images

- Google for Gemini AI inspiration

## Support
For support or questions about this project:

- Check the troubleshooting section above

- Review Netlify documentation for deployment issues

- Ensure your environment is properly set up

**Note:** This application is for demonstration purposes. Always consult with professional flood assessment services for real-world flood risk evaluation.

 

