const express = require('express');
const app = express();
app.use(express.json());

var host = process.env.HOST || '0.0.0.0';
// Listen on a specific port via the PORT environment variable
var port = process.env.PORT || 8080;

var cors_proxy = require('cors-anywhere');
let proxy = cors_proxy.createServer({
    originWhitelist: [], // Allow all origins
    requireHeader: ['origin', 'x-requested-with'],
    removeHeaders: ['cookie', 'cookie2']
}).listen(port, host, function() {
    console.log('Running CORS Anywhere on ' + host + ':' + port);
});

/* Attach our cors proxy to the existing API on the /proxy endpoint. */
        app.get('/:proxyUrl*', (req, res) => {
            req.url = req.url.replace('/proxy/', '/'); // Strip '/proxy' from the front of the URL, else the proxy won't work.
            proxy.emit('request', req, res);
        });

//  app.listen(port, () => {
//   console.log(`Server berjalan di http://localhost:${port}`);
// });
module.exports = app;