const http = require('http');
const fs = require('fs');
const path = require('path');
// Node 22+; values already set by the host take precedence.
if (typeof process.loadEnvFile === 'function' && fs.existsSync(path.join(__dirname, '.env'))) process.loadEnvFile(path.join(__dirname, '.env'));
const recommendFunction = require('./netlify/functions/recommend.js');
const adminMenuFunction = require('./netlify/functions/admin-menu.js');

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
        if (Buffer.byteLength(body) > 4_500_000) {
            req.destroy();
            reject(new Error('Request body too large'));
        }
    });
    req.on('end', () => resolve(body));
    req.on('error', reject);
});

const handleFunction = async (req, res, fn) => {
    try {
        const body = await readBody(req);
        const result = await fn.handler({
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

// A request path like "//x" reads as a host-relative URL and makes new URL() throw; collapse leading slashes
// and treat anything still unparsable as a bad request instead of crashing the server.
const parseUrl = rawUrl => {
    try { return new URL(String(rawUrl || '/').replace(/^\/+/, '/'), `http://127.0.0.1:${port}`); }
    catch { return null; }
};

const handleStatic = (req, res) => {
    const url = parseUrl(req.url);
    if (!url) { sendText(res, 400, 'Bad request'); return; }
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); }
    catch { sendText(res, 400, 'Bad request'); return; }
    if (pathname === '/') pathname = '/index.html';
    // Mirrors _redirects: /shop/* -> /map.html
    if (pathname.startsWith('/shop/')) pathname = '/map.html';

    // Never expose local credentials, repository internals, or server source as static files.
    if (pathname.split(/[\\/]/).some(part => part.startsWith('.') || /^(netlify|node_modules)$/i.test(part)) || /\.(?:env|pem|key|log|local)$/i.test(pathname)) {
        sendText(res, 403, 'Forbidden'); return;
    }

    let filePath = path.normalize(path.join(root, pathname));
    if (filePath !== root && !filePath.startsWith(root + path.sep)) {
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

// Stand-in for Netlify Forms: the "정보 수정 요청" dialog posts form-name=correction to "/".
const CORRECTIONS_FILE = path.join(root, 'correction-requests.jsonl.local');
const handleFormPost = async (req, res) => {
    try {
        const fields = Object.fromEntries(new URLSearchParams(await readBody(req)));
        if (fields['form-name'] !== 'correction') { sendText(res, 404, 'Unknown form'); return; }
        if (fields['bot-field']) { sendText(res, 200, 'OK'); return; }
        const { target = '', page = '', lang = '', field = '', message = '', contact = '' } = fields;
        if (!message.trim()) { sendText(res, 400, 'message is required'); return; }
        const entry = { receivedAt: new Date().toISOString(), target, page, lang, field, message: message.slice(0, 1000), contact: contact.slice(0, 100) };
        fs.appendFileSync(CORRECTIONS_FILE, JSON.stringify(entry) + '\n');
        console.log('정보 수정 요청:', target, '-', field);
        sendText(res, 200, 'OK');
    } catch (error) {
        sendText(res, 500, error.message || 'Form error');
    }
};

const server = http.createServer((req, res) => {
    const url = parseUrl(req.url);
    if (!url) { sendText(res, 400, 'Bad request'); return; }
    const pathname = url.pathname;
    if (req.method === 'POST' && pathname === '/') {
        handleFormPost(req, res);
        return;
    }
    const fn = { '/.netlify/functions/recommend': recommendFunction, '/.netlify/functions/admin-menu': adminMenuFunction }[pathname];
    if (fn) {
        handleFunction(req, res, fn);
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
