/* eslint no-restricted-syntax: "off" */

export const isMessage = event => Boolean(event.type === 'message' && event.text);

export const isMessageToChannel = message => typeof message.channel === 'string' && message.channel[0] === 'C';

export const isFromUser = (event, userId) => event.user === userId;

// NOTE: unused
// function removeVNToneMarks(st) {
// 	let str = st;

// 	str = str.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
// 	str = str.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
// 	str = str.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
// 	str = str.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
// 	str = str.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
// 	str = str.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
// 	str = str.replace(/(đ)/g, 'd');

// 	return str;
// }

export const messageContainsText = (message, possibleTexts) => {
	const messageText = message.text.toLowerCase();
	const texts = Array.isArray(possibleTexts) ? possibleTexts : [possibleTexts];
	for (const text of texts) {
		if (messageText.indexOf(text.toLowerCase()) > -1) {
			return true;
		}
	}

	return false;
};

export const filterJokesByCategories = (jokes, categories) =>
	jokes.filter(joke => {
		if (joke.categories.length === 0) {
			return true;
		}

		for (const category of categories) {
			if (joke.categories.includes(category)) {
				return true;
			}
		}

		return false;
	});

export const pickRandom = arr => arr[Math.floor(Math.random() * arr.length)];
