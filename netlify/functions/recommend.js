const fetch = require('node-fetch');

const recommendationSchema = {
    type: 'object',
    additionalProperties: false,
    properties: {
        recommendations: {
            type: 'array',
            minItems: 1,
            maxItems: 4,
            items: {
                type: 'object',
                additionalProperties: false,
                properties: {
                    name: { type: 'string' },
                    description: { type: 'string' }
                },
                required: ['name', 'description']
            }
        }
    },
    required: ['recommendations']
};

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { prompt } = JSON.parse(event.body || '{}');
        const apiKey = process.env.OPENAI_API_KEY;
        const model = process.env.OPENAI_MODEL || 'gpt-5.5';

        if (!prompt) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'prompt is required.' })
            };
        }

        if (!apiKey) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'OPENAI_API_KEY is not configured on the server.' })
            };
        }

        const response = await fetch('https://api.openai.com/v1/responses', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model,
                input: prompt,
                store: false,
                max_output_tokens: 700,
                text: {
                    format: {
                        type: 'json_schema',
                        name: 'recommendation_reasons',
                        strict: true,
                        schema: recommendationSchema
                    }
                }
            })
        });

        const result = await response.json();

        if (!response.ok) {
            const message = result?.error?.message || result?.message || 'OpenAI API call failed.';
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: message })
            };
        }

        return {
            statusCode: 200,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(result)
        };

    } catch (error) {
        console.error('OpenAI proxy error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || 'Server error.' })
        };
    }
};
