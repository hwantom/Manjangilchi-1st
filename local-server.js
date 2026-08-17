const http = require('http');
const fs = require('fs');
const path = require('path');
const recommendFunction = require('./netlify/functions/recommend.js');

const root = __dirname;
const port = Number(process.env.PORT || 8000);

const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.csv': 'text/csv; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

const sendText = (res, statusCode, text) => {
    res.writeHead(statusCode, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(text);
};

const readBody = (req) => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
        body += chunk;
        if (body.length > 1024 * 1024) {
            req.destroy();
            reject(new Error('Request body too large'));
        }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
});

const handleFunction = async (req, res) => {
    try {
        const body = await readBody(req);
        const result = await recommendFunction.handler({
            httpMethod: req.method,
            headers: req.headers,
            body
        });

        res.writeHead(result.statusCode || 200, result.headers || { 'Content-Type': 'application/json' });
        res.end(result.body || '');
    } catch (error) {
        sendText(res, 500, error.message || 'Local function error');
    }
};

const handleStatic = (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === '/') pathname = '/index.html';

    let filePath = path.normalize(path.join(root, pathname));
    if (!filePath.startsWith(root)) {
        sendText(res, 403, 'Forbidden');
        return;
    }

    fs.stat(filePath, (statError, stat) => {
        if (statError) {
            sendText(res, 404, 'Not found');
            return;
        }

        if (stat.isDirectory()) {
            filePath = path.join(filePath, 'index.html');
        }

        fs.readFile(filePath, (readError, data) => {
            if (readError) {
                sendText(res, 404, 'Not found');
                return;
            }

            const contentType = mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        });
    });
};

const server = http.createServer((req, res) => {
    if (req.url.startsWith('/.netlify/functions/recommend')) {
        handleFunction(req, res);
        return;
    }

    handleStatic(req, res);
});

server.listen(port, '127.0.0.1', () => {
    console.log(`Manjanilchi local server`);
    console.log(`URL: http://127.0.0.1:${port}/index.html`);
    console.log(`OpenAI proxy: http://127.0.0.1:${port}/.netlify/functions/recommend`);
    console.log(`Keep this window open while using the site.`);
});
