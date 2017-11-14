#!/usr/bin/env node

/* eslint no-console: off */

import winston from 'winston';
import chalk from 'chalk';
import slackbot from './slackbot';
import pkg from '../package.json';

if (['help', '--help', '-h', 'version', '--version', '-v'].includes(process.argv[2])) {
	console.log(`
		${chalk.bgMagenta(`slackbot v${pkg.version}`)}

		Usage:

		${chalk.cyan('slackbot')}

		Configuration through environment variables:

		${chalk.cyan('SLACKBOT_TOKEN')}         - ${chalk.grey(
	'(Mandatory)',
)} The Slack Bot User OAuth Access Token for your organisation/team
		${chalk.cyan('SLACKBOT_TRIGGERS')}      - ${chalk.grey(
	'(Optional)',
)} A coma separated list of words that triggers the bot to reply with a joke (${chalk.grey(
	'Default',
)}: "Chị Ba,chi ba,chiba")
		${chalk.cyan('SLACKBOT_CATEGORIES')}    - ${chalk.grey(
	'(Optional)',
)} A coma separated list to enable special joke categories like "explicit" and "nerdy" (${chalk.grey(
	'Default',
)}: "nerdy")
		${chalk.cyan('SLACKBOT_NO_PICTURES')}   - ${chalk.grey(
	'(Optional)',
)} If set to TRUE will disable pictures in jokes (${chalk.grey('Default')}: "FALSE")
		${chalk.cyan('SLACKBOT_MESSAGE_COLOR')} - ${chalk.grey(
	'(Optional)',
)} The hex color used by the bot to mark it's messages (${chalk.grey('Default')}: "#590088")
	`);
	process.exit(0);
}

const logger = new winston.Logger({
	transports: [
		new winston.transports.Console({
			timestamp() {
				return new Date().toISOString();
			},
		}),
	],
});

logger.cli();

if (!process.env.SLACKBOT_TOKEN) {
	logger.error('You must setup the SLACKBOT_TOKEN environment variable before running the bot');
	process.exit(1);
}

const options = { logger };
if (process.env.SLACKBOT_TRIGGERS) {
	options.triggerOnWords = process.env.SLACKBOT_TRIGGERS.split(',');
}
if (process.env.SLACKBOT_CATEGORIES) {
	options.specialCategories = process.env.SLACKBOT_CATEGORIES.split(',');
}
if (process.env.SLACKBOT_NO_PICTURES) {
	options.usePictures = false;
}
if (process.env.SLACKBOT_MESSAGE_COLOR) {
	options.messageColor = process.env.SLACKBOT_MESSAGE_COLOR;
}

const bot = slackbot(process.env.SLACKBOT_TOKEN, options);
bot.start();
