const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const privateKey = fs.readFileSync('cert/key.pem');
const certificate = fs.readFileSync('cert/cert.pem');

const credentials = {
  key: privateKey,
  cert: certificate,
};

const app = express();

app.use(express.static('dist'));

const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(8080);
httpsServer.listen(8443);
