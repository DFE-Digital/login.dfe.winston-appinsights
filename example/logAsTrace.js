const winston = require('winston');
const AITransport = require('./../lib');

const logger = new (winston.Logger)({
  levels: {
    audit: 0,
    error: 1,
    warn: 2,
    info: 3,
    verbose: 4,
    debug: 5,
    silly: 6,
  },
  colors: {
    info: 'yellow',
    ok: 'green',
    error: 'red',
    audit: 'magenta',
  },
  transports: [
    new (winston.transports.Console)({ level: 'verbose', colorize: true }),
    new AITransport({ key: process.env.AIKEY }),
  ],
});

logger.info('This is an info message');
logger.warn('This is an warning message');
logger.error('This is an error message');

console.info('done');