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
import choosing from './data/choosing';
import pictures from './data/pictures';
import { WundergroundWeather } from './WundergroundWeather';

const weather = new WundergroundWeather();

const defaultOptions = {
	triggerOnWords: ['Chị Ba', 'chi ba', 'chiba'],
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

	function sendMessage(to, message, msgOptions = { as_user: true }) {
		opt.logger.info(`Posting message to ${to}`, msgOptions);

		return web.chat.postMessage(to, message, msgOptions);
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
			if (messageContainsText(event, ['chọn', 'đoán', 'cái nào', 'món nào'])) {
				// giữa: một, hai, ba. chị ba chọn ai?
				// chị ba hãy chọn: một, hai, ba.
				// chị ba hãy chọn một: một, hai, ba.
				// must have ending .|;|! as the list separator
				const parseReg = /:((?:,?.*?[;.!:])*)/i;
				const results = event.text.match(parseReg);
				if (results && results[1]) {
					const list = results[1]; //một, hai, ba.
					let items = list.split(',');
					items = items.map(item => item.replace(/[;.?!]/g, ''));
					const chosen = pickRandom(items);
					message = pickRandom(choosing);
					message = message.replace(/<chosen>/gi, chosen);
					sendMessage(event.channel, message);
				} else {
					sendMessage(event.channel, 'Xin lỗi, chị chưa hiểu câu hỏi. Cú pháp danh sách là `: a, b, c .`');
				}
			} else if (messageContainsText(event, ['thời tiết', 'thoi tiet', 'thoitiet', 'mưa'])) {
				// this one is async
				weather.getHourlyWeather().then(w => {
					sendMessage(event.channel, w.getWeatherMessage());
				});
			} else if (messageContainsText(event, ['chào', 'hello', 'hi chị'])) {
				message = pickRandom(greetings);
				message = message.replace(/<user>/gi, `<@${event.user}>`);
				sendMessage(event.channel, message);
			} else if (messageContainsText(event, ['chị im', 'chị ba im'])) {
				message = `<@${event.user}> im đi!`;
				sendMessage(event.channel, message, {
					as_user: true,
					attachments: [
						{
							fallback: message,
							image_url: 'https://media1.tenor.com/images/4548a5642b7ad2d2806ef9d49e00bc6d/tenor.gif',
						},
					],
				});
			} else if (
				messageContainsText(event, [
					'đua không',
					'đua xe không',
					'chơi không',
					'khoẻ không',
					'là ai',
					'đi ra đi',
				])
			) {
				message = 'Cô là ai? :fearful: Cháu không biết. :white_frowning_face: CÔ ĐI RA ĐI! :scream:';
				sendMessage(event.channel, message, {
					as_user: true,
					attachments: [
						{
							fallback: message,
							image_url: 'https://media.giphy.com/media/3osBLyfpNI2zxehU8U/giphy.gif',
						},
					],
				});
			} else {
				// this one is sync
				message = pickRandom(jokes);
				const msgOptions = {
					as_user: true,
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
		sendMessage,
		start() {
			rtm.start();
		},
	};
};

export default slackbot;
