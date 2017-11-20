import express from 'express';
import bodyParser from 'body-parser';

const webApp = express();
webApp.use(bodyParser.json());

const PASS = process.env.PASS_PHRASE || '123456';

webApp.get('/hook', (req, res) => {
	console.log('hook request');

	try {
		if (req.query && req.query.pass === PASS) {
			// console.log('result: ', speech);
			if (webApp.bot) {
				const s = req.query.s || req.query.text || req.query.msg || req.query.message;
				if (s) {
					webApp.bot.sendMessage('#general', s);

					return res.json({
						status: 'success',
					});
				}

				return res.json({
					status: 'error',
					message: 'No message to send',
				});
			}

			return res.json({
				status: 'error',
				message: 'Bot is not ready',
			});
		}

		return res.json({
			status: 'error',
			message: 'Wrong pass phrase or no queries',
		});
	} catch (err) {
		console.error("Can't process request", err);

		return res.status(400).json({
			status: {
				code: 400,
				errorType: err.message,
			},
		});
	}
});

webApp.listen(process.env.PORT || 5000, () => {
	console.log('Server listening on PORT: 5000');
});

export default webApp;
