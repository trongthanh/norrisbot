import { RtmClient, WebClient, RTM_EVENTS, CLIENT_EVENTS } from '@slack/client';
import {
	isMessage,
	// isMessageToChannel,
	isFromUser,
	messageContainsText,
	// filterJokesByCategories,
	pickRandom,
} from './utils';
import jokes from './data/gossip';
import greetings from './data/greetings';
import pictures from './data/pictures';
import { WundergroundWeather } from './WundergroundWeather';

const weather = new WundergroundWeather();

const defaultOptions = {
	triggerOnWords: ['Chị Ba', 'chi ba', 'chiba', 'chi3'],
	specialCategories: [],
	messageColor: '#590088',
	usePictures: true,
	logger: console,
	rtmOptions: {},
};

const slackbot = (botToken, options = {}) => {
	let botId;

	const opt = Object.assign({}, defaultOptions, options);
	const rtm = new RtmClient(botToken, opt.rtmOptions);
	const web = new WebClient(botToken);

	function sendMessage(to, message, msgOptions) {
		web.chat.postMessage(to, message, msgOptions);
		opt.logger.info(`Posting message to ${to}`, msgOptions);
	}

	rtm.on(RTM_EVENTS.MESSAGE, event => {
		console.log('RTM on messages:', event);
		if (
			isMessage(event) &&
			// isMessageToChannel(event) &&
			!isFromUser(event, botId) &&
			messageContainsText(event, opt.triggerOnWords)
		) {
			let message;
			if (messageContainsText(event, ['thời tiết', 'thoi tiet', 'thoitiet'])) {
				// this one is async
				weather.getHourlyWeather().then(w => {
					const msgOptions = {
						as_user: true,
					};
					sendMessage(event.channel, w.getWeatherMessage(), msgOptions);
				});
			} else if (messageContainsText(event, ['chào', 'hello', 'khoẻ không', 'hello', 'hi chị'])) {
				message = pickRandom(greetings);
				message = message.replace(/<user>/g, `<@${event.user}>`);
				sendMessage(event.channel, message, { as_user: true });
			} else {
				// this one is sync
				message = pickRandom(jokes);
				const msgOptions = {
					as_user: true,

					// attachments: [
					// 	{
					// 		color: opt.messageColor,
					// 		title: joke,
					// 	},
					// ],
				};

				if (opt.usePictures) {
					msgOptions.attachments[0].image_url = pickRandom(pictures);
				}
				sendMessage(event.channel, `*${message}*`, msgOptions);
			}
		}
	});

	rtm.on(CLIENT_EVENTS.RTM.AUTHENTICATED, rtmStartData => {
		botId = rtmStartData.self.id;
		// also trigger when mentioned:
		opt.triggerOnWords.push(botId);
		opt.logger.info(`Logged in as ${rtmStartData.self.name} (id: ${botId}) of team ${rtmStartData.team.name}`);
	});

	return {
		rtm,
		web,
		start() {
			rtm.start();
		},
	};
};

export default slackbot;
