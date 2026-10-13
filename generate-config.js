const fs = require('fs');

// This file is public. Keep OCR, Google service-account and admin secrets server-side.
const configContent = 'const AppConfig = ' + JSON.stringify({
    GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY || '',
    MAP_ID: process.env.MAP_ID || '',
    SHEET_ID: process.env.SHEET_ID || ''
}, null, 4) + ';';

fs.writeFileSync('./config.js', configContent);
console.log('config.js generated successfully');
