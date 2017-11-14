#!/usr/bin/env bash

./node_modules/.bin/rimraf lib;
./node_modules/.bin/babel src --out-dir lib;
chmod +x lib/slackbot-cli.js;
