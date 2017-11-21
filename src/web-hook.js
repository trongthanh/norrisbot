/* © 2017 NauStud.io
 * @author Thanh
 */
/* eslint-disable prefer-template */
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
				let s = req.query.s || req.query.text || req.query.msg || req.query.message;
				let to = req.query.to || 'general';
				if (s) {
					s = decodeURIComponent(s);
					to = '#' + decodeURIComponent(to).trim(); // just channel for now

					webApp.bot
						.sendMessage(to, decodeURIComponent(s))
						.then(() => {
							res.json({
								status: 'success',
							});
						})
						.catch(err => {
							res.json({
								status: 'error',
								message: err.message,
							});
						});

					return null;
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
