const reqHandler = require('request');
const { pick } = require('lodash');
const { generateRandomIP, randomUserAgent } = require('./utils');
const copyHdrs = require('./copyHeaders');
const applyCompression = require('./compress');
const performBypass = require('./bypass');
const handleRedirect = require('./redirect');
const checkCompression = require('./shouldCompress');

// Array of predefined Via header values
const viaHeaders = [
    '1.1 example-proxy-service.com (ExampleProxy/1.0)',
    '1.0 another-proxy.net (Proxy/2.0)',
    '1.1 different-proxy-system.org (DifferentProxy/3.1)',
    '1.1 some-proxy.com (GenericProxy/4.0)',
];

function randomVia() {
    const index = Math.floor(Math.random() * viaHeaders.length);
    return viaHeaders[index];
}

function processRequest(req, res) {
    const { url, jpeg, bw, l } = req.query;

    // Handle the case where `url` is missing
    if (!url) {
        const ipAddress = generateRandomIP();
        const ua = randomUserAgent();
        const hdrs = {
            ...pick(req.headers, ['cookie', 'dnt', 'referer']),
            'x-forwarded-for': ipAddress,
            'user-agent': ua,
            'via': randomVia(), // Generate random Via header
        };

        // Set headers and return an invalid request response
        Object.keys(hdrs).forEach(key => res.setHeader(key, hdrs[key]));
        
        return res.end(`1we23`);
    }

    // Process and clean URL
    const urlList = Array.isArray(url) ? url.join('&url=') : url;
    const cleanUrl = urlList.replace(/http:\/\/1\.1\.\d\.\d\/bmi\/(https?:\/\/)?/i, 'http://');

    // Setup request parameters
    req.params.url = cleanUrl;
    req.params.webp = !jpeg;
    req.params.grayscale = bw !== '0';
    req.params.quality = parseInt(l, 10) || 40;

    const randomIP = generateRandomIP();
    const userAgent = randomUserAgent();

    // Set up the request with the random Via header
    reqHandler.get({
        url: req.params.url,
        headers: {
            ...pick(req.headers, ['cookie', 'dnt', 'referer']),
            'user-agent': userAgent,
            'x-forwarded-for': randomIP,
            'via': randomVia(), // Generate random Via header
        },
        timeout: 10000,
        maxRedirects: 5,
        encoding: null,
        strictSSL: false,
        gzip: true,
        jar: true,
    }, (err, origin, buffer) => {
        if (err || origin.statusCode >= 400) {
            return handleRedirect(req, res);
        }

        copyHdrs(origin, res);
        res.setHeader('content-encoding', 'identity');
        req.params.originType = origin.headers['content-type'] || '';
        req.params.originSize = buffer.length;

        if (checkCompression(req)) {
            applyCompression(req, res, buffer);
        } else {
            performBypass(req, res, buffer);
        }
    });
}

module.exports = processRequest;
