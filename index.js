/* eslint-disable import/first, no-global-assign */
require = require('@std/esm')(module, true);

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

// bot.on('start', () => {
//   bot.postMessageToChannel('some-channel-name', 'Hello channel!');
//   bot.postMessageToUser('some-username', 'hello bro!');
//   bot.postMessageToGroup('some-private-group', 'hello group chat!');
// });
