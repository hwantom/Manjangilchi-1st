const fetch = require('node-fetch');

exports.handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body);
        const API_KEY = process.env.GEMINI_API_KEY;

        if (!API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'GEMINI_API_KEY is not configured on the server.' })
            };
        }

        // Direct Gemini API Calling Logic (similar to the client-side implementation)
        const apiVersions = ['v1', 'v1beta'];
        let result = null;
        let lastError = null;

        const normalizeModelName = (name) => name.replace(/^models\//, '');

        const callGemini = async (apiVersion, modelName) => {
            const normalized = normalizeModelName(modelName);
            const url = `https://generativelanguage.googleapis.com/${apiVersion}/models/${normalized}:generateContent?key=${API_KEY}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            const bodyJson = await response.json();

            if (!response.ok) {
                const msg = bodyJson?.error?.message || bodyJson?.message || 'API 호출 실패';
                const error = new Error(msg);
                error.status = response.status;
                throw error;
            }

            return bodyJson;
        };

        const listModels = async (apiVersion) => {
            const url = `https://generativelanguage.googleapis.com/${apiVersion}/models?key=${API_KEY}`;
            const response = await fetch(url);
            const bodyJson = await response.json();
            if (!response.ok) {
                throw new Error(bodyJson?.error?.message || 'ListModels 실패');
            }
            return bodyJson?.models || [];
        };

        const pickModel = (models) => {
            const preferred = [
                'models/gemini-1.5-flash-8b',
                'models/gemini-1.5-flash',
                'models/gemini-1.5-flash-001',
                'models/gemini-1.5-pro'
            ];
            const supportsGenerate = (m) => (m.supportedGenerationMethods || []).includes('generateContent');
            const available = models.filter(supportsGenerate);
            for (const name of preferred) {
                const match = available.find(m => m.name === name);
                if (match) return match.name;
            }
            return available[0]?.name || '';
        };

        // Try multiple API versions and find an available model
        for (const apiVersion of apiVersions) {
            try {
                const models = await listModels(apiVersion);
                const picked = pickModel(models);
                if (picked) {
                    result = await callGemini(apiVersion, picked);
                    if (result) break;
                }
            } catch (err) {
                lastError = err;
                console.error(`Gemini Error (${apiVersion}):`, err);
            }
        }

        if (!result) {
            throw lastError || new Error('API 호출 성공 후 빈 응답');
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('Proxy Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || '서버 오류가 발생했습니다.' })
        };
    }
};
