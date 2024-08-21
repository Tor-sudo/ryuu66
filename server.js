#!/usr/bin/env node
'use strict';
const app = require('express')();
const proxy = require('./src/proxy');

const PORT = process.env.PORT || 8080;

app.enable('trust proxy');
app.get('/', proxy);
app.listen(PORT, () => console.log(`Listening on ${PORT}`));
