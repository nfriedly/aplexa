const express = require('express');
const app = require('express');
require('dotenv').load({ silent: true });
const aplexa = require('./aplexa');

const hostname = process.env.PLEX_SERVER;
const username = process.env.PLEX_USERNAME;
const password = process.env.PLEX_PASSWORD;

express.static('public/');
express.static('node_modules/bootstrap/dist/');

app.get('/nodplaying', async (req, res) => res.send(await aplexa.getAlexaNowPlaying({ hostname, username, password })));
