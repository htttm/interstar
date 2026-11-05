const http = require('http');
const https = require('https');
const url = require('url');

const PORT = process.env.PORT || 8080;

http.createServer((req, res) => {
    // Permette le connessioni da qualsiasi pagina
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // Configura l'indirizzo di Xbox Cloud Gaming come destinazione fissa
    const targetUrl = 'https://xbox.com' + req.url;
    const parsedUrl = url.parse(targetUrl);

    const options = {
        hostname: parsedUrl.hostname,
        port: 443,
        path: parsedUrl.path,
        method: req.method,
        headers: {
            ...req.headers,
            'host': parsedUrl.hostname,
            'referer': 'https://xbox.com'
        }
    };

    const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res, { end: true });
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
        res.writeHead(500);
        res.end('Errore di connessione: ' + err.message);
    });

}).listen(PORT, () => {
    console.log(`Server attivo sulla porta ${PORT}`);
});
