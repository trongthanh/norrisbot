/* eslint-disable import/first, no-global-assign */
require = require('@std/esm')(module, true);

const app = require('./src/web-hook').default;
const Bot = require('./src/slackbot').default;

// create a bot
const settings = {
	triggerOnWords: ['Chị Ba', 'chi ba', 'chiba'],
	specialCategories: [],
	messageColor: '#590088',
	usePictures: false,
	logger: console,
	// rtmOptions: {},
};
const bot = Bot('xoxb-267467087399-biCVYNB04tqkfmHriguFie9l', settings);
bot.start();

// inject bot to app
app.bot = bot;

