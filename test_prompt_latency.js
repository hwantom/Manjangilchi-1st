const fs = require('fs');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// 1. Read and parse stores.csv
const csvText = fs.readFileSync('stores.csv', 'utf-8');
const rows = csvText.split('\n').filter(line => line.trim());
const cleaned = rows.map(line => {
    const parts = []; let current = ''; let inQuote = false;
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === '"') { inQuote = !inQuote; continue; }
        if (char === ',' && !inQuote) { parts.push(current.trim()); current = ''; continue; }
        current += char;
    }
    parts.push(current.trim());
    return parts;
});

const header = cleaned[0];
const stores = cleaned.slice(1).map(row => {
    const obj = {};
    header.forEach((h, i) => { obj[h] = row[i]; });
    return obj;
}).filter(s => s.name);

// Unique stores
const seen = new Set();
const storeList = stores.map(s => ({
    name: s.name,
    category: s.category || s['분류'] || '기타'
})).filter(s => {
    if (seen.has(s.name)) return false;
    seen.add(s.name);
    return true;
});

console.log(`Loaded ${storeList.length} unique stores from stores.csv`);

const storeListText = storeList.map(s => `${s.name}(${s.category})`).join(',');
const selection = {
    purpose: '먹거리',
    companion: '친구',
    interests: ['식사', '간식 • 디저트'],
    preference: '숨은 맛집'
};
const lang = 'ko';

const prompt = `통인시장 상점목록: ${storeListText}
사용자: 목적-${selection.purpose}, 동행-${selection.companion}, 관심-${selection.interests.join(',')}, 선호-${selection.preference}
위 목록에서 가장 적합한 4곳을 골라 JSON으로 답해줘. 답변 언어: ${lang}. 형식: [{ "name": "상점명", "description": "한줄추천이유" }]`;

console.log("Prompt length (chars):", prompt.length);

const API_KEY = "AIzaSyAXZcmM6NOeRdFIF6977AgNAertv_xAwnA";
const genAI = new GoogleGenerativeAI(API_KEY);

async function testModel(modelName) {
    const start = Date.now();
    console.log(`\n--- Calling ${modelName}...`);
    try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // Use JSON response mime type configuration if supported
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        const text = result.response.text();
        const duration = (Date.now() - start) / 1000;
        console.log(`[SUCCESS] ${modelName} took ${duration}s.`);
        console.log("Response text:");
        console.log(text.trim());
    } catch (err) {
        const duration = (Date.now() - start) / 1000;
        console.log(`[FAILURE] ${modelName} failed after ${duration}s. Error: ${err.message}`);
    }
}

async function run() {
    await testModel("gemini-2.5-flash");
    await testModel("gemini-3.5-flash");
}

run();
