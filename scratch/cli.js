require('dotenv').load({ silent: true });
require('@babel/register');
const aplexa = require('./lib/aplexa');

const hostname = process.env.PLEX_SERVER;
const username = process.env.PLEX_USERNAME;
const password = process.env.PLEX_PASSWORD;

// eslint-disable-next-line no-console
aplexa.getAlexaNowPlaying({ hostname, username, password }).then(console.log);
