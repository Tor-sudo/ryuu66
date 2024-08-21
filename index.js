#!/usr/bin/env node
'use strict';
const app = require('express')();
const proxy = require('./src/proxy');
app.disable('x-powered-by');
app.enable('trust proxy');
app.get('/', proxy);
module.exports = app;
