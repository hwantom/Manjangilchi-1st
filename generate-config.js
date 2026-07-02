const fs = require('fs');

const configContent = `const AppConfig = {
    GOOGLE_MAPS_API_KEY: "${process.env.GOOGLE_MAPS_API_KEY || ''}",
    MAP_ID: "${process.env.MAP_ID || ''}",
    OPENAI_API_KEY: "${process.env.OPENAI_API_KEY || ''}",
    OPENAI_MODEL: "${process.env.OPENAI_MODEL || 'gpt-5.5'}",
    SHEET_ID: "${process.env.SHEET_ID || ''}",
    TMAP_APP_KEY: "${process.env.TMAP_APP_KEY || ''}"
};`;

fs.writeFileSync('./config.js', configContent);
console.log('config.js generated successfully');
