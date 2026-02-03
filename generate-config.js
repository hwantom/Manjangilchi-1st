const fs = require('fs');

const configContent = `const AppConfig = {
    GOOGLE_MAPS_API_KEY: "${process.env.GOOGLE_MAPS_API_KEY || ''}",
    MAP_ID: "${process.env.MAP_ID || ''}",
    GEMINI_API_KEY: "AIzaSyDZCQ_SPc8DamoXWN5798d_P1E1B9CDUo4",
    SHEET_ID: "${process.env.SHEET_ID || ''}"
};`;

fs.writeFileSync('./config.js', configContent);
console.log('config.js generated successfully');
