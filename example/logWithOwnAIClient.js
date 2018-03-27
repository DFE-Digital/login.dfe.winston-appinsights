const winston = require('winston');
const AITransport = require('./../lib');
const appInsights = require('applicationinsights');

appInsights.setup(process.env.AIKEY).start();
console.info(`started using key ${process.env.AIKEY}`);

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
    new AITransport({ client: appInsights.defaultClient }),
  ],
});

logger.info('This is an info message using own client');
logger.warn('This is an warning message using own client');
logger.error('This is an error message using own client');

console.info('done');