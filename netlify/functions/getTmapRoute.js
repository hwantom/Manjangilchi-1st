// netlify/functions/getTmapRoute.js

exports.handler = async function (event, context) {
    // Only allow POST or GET
    if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    // Support both query strings (GET) and body parsing (POST)
    let startX, startY, endX, endY;
    if (event.httpMethod === 'GET') {
        ({ startX, startY, endX, endY } = event.queryStringParameters);
    } else {
        try {
            const body = JSON.parse(event.body);
            ({ startX, startY, endX, endY } = body);
        } catch (e) {
            return { statusCode: 400, body: JSON.stringify({ error: "Invalid JSON format" }) };
        }
    }

    if (!startX || !startY || !endX || !endY) {
        return { statusCode: 400, body: JSON.stringify({ error: "Missing start or end coordinates." }) };
    }

    // Use environment variable, fallback to client config if absolutely necessary (but Env Var is preferred for security)
    let appKey = process.env.TMAP_APP_KEY;

    // Fallback if local dev doesn't have it mapped correctly in process.env yet
    if (!appKey) {
        appKey = 'h3kf9zsM5F8xTry3VPbgS7YLcR4xjmJ76juisX51';
        // WARNING: Hardcoding here for testing as requested by the current user session setup. 
        // Ideally, this is strictly kept in .env or Netlify UI.
    }

    try {
        const url = 'https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result';

        const payload = {
            startX: startX,
            startY: startY,
            endX: endX,
            endY: endY,
            reqCoordType: "WGS84GEO",
            resCoordType: "WGS84GEO",
            startName: "출발지",
            endName: "도착지"
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'appKey': appKey,
                'Accept': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Tmap API Error:", response.status, errorText);
            throw new Error(`Tmap API returned status ${response.status}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*' // Allow CORS just in case
            },
            body: JSON.stringify(data)
        };
    } catch (error) {
        console.error("Function exception:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
