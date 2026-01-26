const fs = require('fs');

const configContent = `const AppConfig = {
    GOOGLE_MAPS_API_KEY: "${process.env.GOOGLE_MAPS_API_KEY || ''}",
    MAP_ID: "${process.env.MAP_ID || ''}",
    GEMINI_API_KEY: "${process.env.GEMINI_API_KEY || ''}",
    SHEET_ID: "${process.env.SHEET_ID || ''}"
};`;

fs.writeFileSync('./config.js', configContent);
console.log('config.js generated successfully');
