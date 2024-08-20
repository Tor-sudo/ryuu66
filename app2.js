#!/usr/bin/env node
'use strict';

const path = require('path');
const Fastify = require('fastify');
const fastifyExpress = require('@fastify/express');
const express = require('express');
const proxy = require('./src/proxy');

const app = express();
const fastify = Fastify(); // Initialize Fastify without logging
const PORT = process.env.PORT || 8080;

// Set up express through Fastify
async function setup() {
    // Register the Fastify-Express plugin
    await fastify.register(fastifyExpress);

    // Use Express app within Fastify
    await fastify.use(app);

    // Define paths to different favicons
    const favicons = [
        path.join(__dirname, 'public', 'favicon1.ico'),
        path.join(__dirname, 'public', 'favicon2.ico'),
        // path.join(__dirname, 'public', 'favicon3.ico'),
    ];

    // Route to serve a random favicon from the list
    app.get('/favicon.ico', (req, res) => {
        const randomFavicon = favicons[Math.floor(Math.random() * favicons.length)];
        res.sendFile(randomFavicon);
    });

    // Trust proxy settings
    app.enable('trust proxy');
    app.disable('x-powered-by');

    // Route with proxy functionality
    app.get('/', proxy);

    // Start Fastify server
    fastify.listen({ port: PORT }, err => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
        console.log(`Listening on port ${PORT}`);
    });
}

// Execute the setup function to initialize the server
setup();
