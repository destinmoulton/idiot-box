'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var winston = require('winston');

var customColors = {
  trace: 'white',
  debug: 'blue',
  info: 'green',
  warn: 'yellow',
  crit: 'red',
  error: 'red'
};

var config = {
  colors: customColors,

  levels: {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    crit: 4,
    error: 5
  },
  transports: []
};

config.transports.push(new winston.transports.Console({
  name: 'consoleLogger',
  level: 'error',
  colorize: true,
  timestamp: true
}));

var logger = new winston.Logger(config);
winston.addColors(customColors);

exports.default = logger;