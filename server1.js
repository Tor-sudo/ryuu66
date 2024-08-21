#!/usr/bin/env node
'use strict';

const fastify = require('fastify')();
const express = require('@fastify/express');
const proxy = require('./src/proxy');

const PORT = process.env.PORT || 3000;

async function start() {
  // Register the express plugin
  await fastify.register(express);

  // Use Express middleware for handling the proxy
  fastify.use('/', (req, res, next) => {
    if (req.path === '/') {
      return proxy(req, res); // proxy is assumed to be an Express-style handler
    }
    next();
  });

  // Start the server
  try {
    await fastify.listen({ host: '0.0.0.0', port: PORT });
    console.log(`Listening on ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
