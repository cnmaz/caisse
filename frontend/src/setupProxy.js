const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://127.0.0.1:3001',
            changeOrigin: true,
            pathRewrite: {
                "^/api/": "/"
            },
            logLevel: 'debug'
        })
    );
};